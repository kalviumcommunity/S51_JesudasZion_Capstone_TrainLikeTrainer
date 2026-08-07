'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CourseDetailPage({ params }) {
  const { slug } = params;

  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState('loading');
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/courses/${slug}`);
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

        setCourse(data.course);
        setActiveLesson(data.course?.modules?.[0]?.lessons?.[0] || null);
        setStatus('ready');
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load course:', err);
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-sm text-[#A89C8D] animate-pulse">Loading course…</p>
      </div>
    );
  }

  if (status === 'error' || status === 'notfound') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-light text-white">
          {status === 'notfound' ? 'Course Not Found' : "Couldn't load this course"}
        </h1>
        <Link href="/courses" className="inline-block text-sm text-[#A89C8D] hover:text-white transition">
          Back to Courses
        </Link>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
      <Link href="/courses" className="flex items-center gap-1.5 text-sm text-[#7A6F62] hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Courses</span>
      </Link>

      {/* Course header */}
      <div className="bg-[#1C1917] border border-[#3A332C] rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{course.icon}</span>
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#7A6F62]">
            {course.category} · {course.sport}
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">{course.title}</h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#A89C8D] pt-2">
          <span>{course.difficulty}</span>
          <span>{course.durationWeeks} weeks</span>
          <span>{totalLessons} lessons</span>
          <span>★ {course.rating}</span>
          <span>{course.enrolledCount?.toLocaleString()} enrolled</span>
        </div>

        {course.trainer && (
          <div className="flex items-center gap-3 pt-4 border-t border-[#2B2723]">
            {course.trainer.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.trainer.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            )}
            <div>
              <div className="text-sm text-white">{course.trainer.name}</div>
              <div className="text-xs text-[#7A6F62]">{course.trainer.role}</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lesson player */}
        <div className="lg:col-span-7 space-y-5">
          {activeLesson ? (
            <>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#2B2723]">
                {activeLesson.videoUrl ? (
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#8B8073] px-4 text-center">
                    No demonstration video for this lesson yet.
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-light text-white">{activeLesson.title}</h2>
                <p className="text-sm text-[#A89C8D] leading-relaxed">{activeLesson.overview}</p>

                <div className="text-xs text-[#7A6F62]">
                  {activeLesson.duration} · {activeLesson.calories} · {activeLesson.reps}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm pt-4 border-t border-[#2B2723]">
                  <div className="space-y-4">
                    {activeLesson.setupSteps?.length > 0 && (
                      <div>
                        <h3 className="font-medium text-white mb-2">Set Up</h3>
                        <ul className="list-disc list-inside space-y-1 text-[#A89C8D]">
                          {activeLesson.setupSteps.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {activeLesson.executionSteps?.length > 0 && (
                      <div>
                        <h3 className="font-medium text-white mb-2">Execution</h3>
                        <ul className="list-disc list-inside space-y-1 text-[#A89C8D]">
                          {activeLesson.executionSteps.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {activeLesson.keyTips?.length > 0 && (
                      <div>
                        <h3 className="font-medium text-white mb-2">Key Tips</h3>
                        <ul className="list-disc list-inside space-y-1 text-[#A89C8D]">
                          {activeLesson.keyTips.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {activeLesson.commonMistakes?.length > 0 && (
                      <div>
                        <h3 className="font-medium text-white mb-2">Common Mistakes</h3>
                        <ul className="list-disc list-inside space-y-1 text-[#A89C8D]">
                          {activeLesson.commonMistakes.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#A89C8D]">This course has no lessons yet.</p>
          )}
        </div>

        {/* Curriculum */}
        <aside className="lg:col-span-5 space-y-5">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#7A6F62]">CURRICULUM</div>

          {course.modules.map((module) => (
            <div key={module.moduleId} className="bg-[#1C1917] border border-[#3A332C] rounded-2xl p-5 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-white">{module.moduleTitle}</h3>
                <p className="text-xs text-[#8B8073] mt-1 leading-relaxed">{module.summary}</p>
              </div>

              <div className="space-y-1.5">
                {module.lessons.map((lesson) => {
                  const isActive = activeLesson?.lessonId === lesson.lessonId;
                  return (
                    <button
                      key={lesson.lessonId}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-[#2B2723] text-white'
                          : 'text-[#A89C8D] hover:bg-[#2B2723] hover:text-white'
                      }`}
                    >
                      <span className="leading-snug">{lesson.title}</span>
                      <span className="text-[#7A6F62] flex-shrink-0">{lesson.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
