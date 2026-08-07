'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const TrainingContext = createContext();

const XP_PER_DRILL = 150;

export function TrainingProvider({ children }) {
  const { status } = useSession();

  // Progress starts empty. It used to be pre-seeded with a completed drill and
  // 1450 XP, so signed-out visitors saw someone else's history as their own.
  const [completedDrills, setCompletedDrills] = useState([]);
  const [savedDrills, setSavedDrills] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const isSignedIn = status === 'authenticated';

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }, []);

  // Load the signed-in athlete's profile and progress.
  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated') {
      setUserProfile(null);
      setCompletedDrills([]);
      setSavedDrills([]);
      setIsLoadingProfile(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoadingProfile(true);
      try {
        const res = await fetch('/api/user');
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.user) {
          setUserProfile(data.user);
          setCompletedDrills(data.user.completedDrills || []);
          setSavedDrills(data.user.savedDrills || []);
        }
      } catch (err) {
        console.warn('Could not fetch user profile:', err);
      } finally {
        if (!cancelled) setIsLoadingProfile(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);

  async function persist(payload) {
    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Could not save your progress.');
    }
    return res.json();
  }

  const toggleCompleteDrill = async (drillId) => {
    if (!isSignedIn) {
      showToast('Sign in to track your training progress');
      return;
    }

    const wasCompleted = completedDrills.includes(drillId);
    const updatedCompleted = wasCompleted
      ? completedDrills.filter((id) => id !== drillId)
      : [...completedDrills, drillId];

    const previousXp = userProfile?.xpPoints ?? 0;
    const newXp = Math.max(0, previousXp + (wasCompleted ? -XP_PER_DRILL : XP_PER_DRILL));

    // Optimistic update, rolled back below if the write fails.
    setCompletedDrills(updatedCompleted);
    setUserProfile((prev) => (prev ? { ...prev, xpPoints: newXp } : prev));

    try {
      const { user } = await persist({ completedDrills: updatedCompleted, xpPoints: newXp });
      if (user) setUserProfile(user);
      showToast(
        wasCompleted ? 'Drill marked incomplete' : `Drill completed! +${XP_PER_DRILL} XP earned ✓`
      );
    } catch (err) {
      setCompletedDrills(completedDrills);
      setUserProfile((prev) => (prev ? { ...prev, xpPoints: previousXp } : prev));
      showToast(err.message);
    }
  };

  const toggleSaveDrill = async (drillId) => {
    if (!isSignedIn) {
      showToast('Sign in to bookmark drills');
      return;
    }

    const wasSaved = savedDrills.includes(drillId);
    const updatedSaved = wasSaved
      ? savedDrills.filter((id) => id !== drillId)
      : [...savedDrills, drillId];

    setSavedDrills(updatedSaved);

    try {
      const { user } = await persist({ savedDrills: updatedSaved });
      if (user) setUserProfile(user);
      showToast(wasSaved ? 'Drill removed from bookmarks' : 'Drill saved to your bookmarks ✓');
    } catch (err) {
      setSavedDrills(savedDrills);
      showToast(err.message);
    }
  };

  return (
    <TrainingContext.Provider
      value={{
        completedDrills,
        savedDrills,
        userProfile,
        isSignedIn,
        isLoadingProfile,
        toastMessage,
        showToast,
        toggleCompleteDrill,
        toggleSaveDrill,
        setUserProfile,
      }}
    >
      {children}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
}
