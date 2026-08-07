'use client';

import { useState, useEffect } from 'react';

/**
 * Loads a single sport from the database by its string `id` (e.g. "football").
 *
 * The sport pages used to be split between this API and the static
 * `data/sports.js` file, so `/sports` could link to a sport whose detail page
 * rendered "Sport Not Found". Every sport page now goes through here.
 *
 * @returns {{sport: object|null, status: 'loading'|'ready'|'notfound'|'error'}}
 */
export function useSport(sportId) {
  const [sport, setSport] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!sportId) return;

    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const res = await fetch(`/api/sports/${sportId}`);
        if (cancelled) return;

        if (res.status === 404) {
          setStatus('notfound');
          return;
        }
        if (!res.ok) {
          setStatus('error');
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        setSport(data.sport);
        setStatus(data.sport ? 'ready' : 'notfound');
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load sport:', err);
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sportId]);

  return { sport, status };
}

/**
 * Builds a lookup of every drill in the library, keyed by drill id, so a bare
 * drill id stored on a user profile can be resolved back to its real title,
 * sport, position and link.
 *
 * @returns {{index: Record<string, object>, isLoading: boolean}}
 */
export function useDrillIndex() {
  const [index, setIndex] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/sports');
        const data = await res.json();
        if (cancelled || !res.ok) return;

        const lookup = {};
        for (const sport of data.sports || []) {
          for (const position of sport.positions || []) {
            for (const drill of position.drills || []) {
              lookup[drill.id] = {
                ...drill,
                sportId: sport.id,
                sportName: sport.name,
                positionId: position.id,
                positionName: position.name,
                href: `/sports/${sport.id}/${position.id}/${drill.id}`,
              };
            }
          }
        }

        setIndex(lookup);
      } catch (err) {
        console.error('Failed to build drill index:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { index, isLoading };
}
