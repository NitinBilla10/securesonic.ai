// app/providers.jsx
'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  // Fixes hydration issues with SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
}