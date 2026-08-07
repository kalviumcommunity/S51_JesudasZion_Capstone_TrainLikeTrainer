'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { TrainingProvider } from '@/context/TrainingContext';

export function Providers({ children }) {
  return (
    <SessionProvider>
      <TrainingProvider>{children}</TrainingProvider>
    </SessionProvider>
  );
}
