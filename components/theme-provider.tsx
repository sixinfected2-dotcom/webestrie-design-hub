'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { hubData } from '@/lib/data';
import type { ThemeKey } from '@/lib/types';

type DarkMode = 'light' | 'dark';

interface ThemeContextValue {
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => void;
  darkMode: DarkMode;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<ThemeKey>('sage-editorial');
  const [darkMode, setDarkMode] = useState<DarkMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('hub-prefs') || '{}');
      if (prefs.theme) setThemeKeyState(prefs.theme);
      if (prefs.darkMode === 'dark') {
        document.documentElement.classList.add('dark');
        setDarkMode('dark');
      }
    } catch {}
    setMounted(true);
  }, []);

  const setThemeKey = useCallback((key: ThemeKey) => {
    setThemeKeyState(key);
    const theme = hubData.themes[key];
    if (theme) {
      const root = document.documentElement.style;
      root.setProperty('--bg', theme.bg);
      root.setProperty('--bg-2', theme.bg2);
      root.setProperty('--bg-3', theme.bg3);
      root.setProperty('--ink', theme.ink);
      root.setProperty('--terracotta', theme.terracotta);
      root.setProperty('--amber', theme.amber);
      root.setProperty('--amber-light', theme.amberLight);
      root.setProperty('--green-mid', theme.greenMid);
      root.setProperty('--border', theme.border);
    }
    try {
      const prefs = JSON.parse(localStorage.getItem('hub-prefs') || '{}');
      prefs.theme = key;
      localStorage.setItem('hub-prefs', JSON.stringify(prefs));
    } catch {}
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        const prefs = JSON.parse(localStorage.getItem('hub-prefs') || '{}');
        prefs.darkMode = next;
        localStorage.setItem('hub-prefs', JSON.stringify(prefs));
      } catch {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey, darkMode, toggleDarkMode }}>
      {mounted ? children : children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}