'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        setCourses(data.courses || []);
        setStatus('ready');
      } catch (err) {
        console.error('Failed to load courses:', err);
        setStatus('error');
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">
      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#7A6F62]">STRUCTURED PROGRAMS</div>
        <h1 className="touchline font-display text-5xl font-semibold mt-2 uppercase text-[#C8722F]"><span className="text-white">Full programs.</span></h1>
        <p className="text-base text-[#A89C8D] mt-3 max-w-2xl leading-relaxed">
          Multi-week programs built by specialist coaches. Each course is broken into modules and
          lessons with video demonstrations, setup notes and execution cues.
        </p>
      </div>

      {status === 'loading' && (
        <p className="text-sm text-[#A89C8D] animate-pulse">Loading courses…</p>
      )}

      {status === 'error' && (
        <p className="text-sm text-[#A89C8D]">
          Courses are unavailable right now. Please try again in a moment.
        </p>
      )}

      {status === 'ready' && courses.length === 0 && (
        <p className="text-sm text-[#A89C8D]">No courses have been published yet.</p>
      )}

      {courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="bg-[#1C1917] border border-[#3A332C] rounded-2xl overflow-hidden group hover:border-[#4A4139] hover:bg-[#232019] transition block"
            >
              {course.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.thumbnailUrl}
                  alt=""
                  className="w-full h-40 object-cover border-b border-[#2B2723]"
                />
              )}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.1em] text-[#7A6F62]">
                    {course.sport}
                  </span>
                  <span className="text-xl">{course.icon}</span>
                </div>
                <h2 className="text-lg font-medium text-white group-hover:text-[#FFFFFF] transition leading-snug">
                  {course.title}
                </h2>
                <p className="text-sm text-[#A89C8D]">{course.trainer?.name}</p>

                <div className="border-t border-[#2B2723] pt-4 flex items-center justify-between text-xs text-[#7A6F62]">
                  <span>
                    {course.difficulty} · {course.durationWeeks} weeks
                  </span>
                  <span>★ {course.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
