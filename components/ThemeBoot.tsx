'use client';

import { useEffect } from 'react';
import { getSettings } from '../lib/storage';

export default function ThemeBoot() {
  useEffect(() => {
    const s = getSettings();
    const root = document.documentElement;
    if (s.theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, []);
  return null;
}
