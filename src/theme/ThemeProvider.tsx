// src/theme/ThemeProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { darkTokens, lightTokens, THEME_VERSION, Tokens } from './tokens';

type Mode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  tokens: Tokens;
  mode: Mode;
  setMode: (m: Mode) => void;
  setCustomTokens: (partial: Partial<Tokens> | null) => void; // null = clear custom
  isInitialized: boolean;
};

const ThemeCtx = createContext<ThemeContextValue>({
  tokens: darkTokens,
  mode: 'dark',
  setMode: () => {},
  setCustomTokens: () => {},
  isInitialized: false,
});

const STORAGE_KEYS = {
  MODE: '@bb.theme.mode',
  CUSTOM: '@bb.theme.custom', // JSON of Partial<Tokens>
};

function migrateTokens(t: Partial<Tokens> | null): Partial<Tokens> | null {
  if (!t) return null;
  // Example: if we ever bump THEME_VERSION, transform older keys here.
  // const from = (t.__version ?? 0);
  // if (from < 1) { /* map old names -> new */ }
  return t;
}

function resolveBase(mode: Mode, systemPref: 'light' | 'dark'): Tokens {
  const pick = mode === 'system' ? systemPref : mode;
  return pick === 'light' ? lightTokens : darkTokens;
}

export const useThemeTokens = () => {
  const context = useContext(ThemeCtx);
  // Always return the context, even if not initialized
  // This prevents crashes while the theme is loading
  return context;
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<Mode>('dark');
  const [custom, setCustom] = useState<Partial<Tokens> | null>(null);
  const [systemPref, setSystemPref] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() === 'light' ? 'light' : 'dark'
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // load persisted
  useEffect(() => {
    (async () => {
      try {
        const [m, c] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.MODE),
          AsyncStorage.getItem(STORAGE_KEYS.CUSTOM),
        ]);
        if (m === 'system' || m === 'light' || m === 'dark') setMode(m);
        if (c) setCustom(migrateTokens(JSON.parse(c)));
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      } finally {
        setIsInitialized(true);
      }
    })();

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemPref(colorScheme === 'light' ? 'light' : 'dark');
    });
    return () => sub.remove();
  }, []);

  // persist on change
  useEffect(() => {
    if (isInitialized) {
      AsyncStorage.setItem(STORAGE_KEYS.MODE, mode);
    }
  }, [mode, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      if (custom) AsyncStorage.setItem(STORAGE_KEYS.CUSTOM, JSON.stringify(custom));
      else AsyncStorage.removeItem(STORAGE_KEYS.CUSTOM);
    }
  }, [custom, isInitialized]);

  const base = resolveBase(mode, systemPref);
  const tokens = useMemo<Tokens>(() => {
    // merge custom on top of base, but ensure version
    const merged = { ...base, ...(custom ?? {}) };
    return { ...merged, __version: THEME_VERSION };
  }, [base, custom]);

  const setCustomTokens = (partial: Partial<Tokens> | null) => setCustom(partial);

  const value = useMemo(
    () => ({
      tokens,
      mode,
      setMode,
      setCustomTokens,
      isInitialized,
    }),
    [tokens, mode, isInitialized]
  );

  return (
    <ThemeCtx.Provider value={value}>
      {/* Give the root a bg fallback to avoid white flashes */}
      <React.Fragment>{children}</React.Fragment>
    </ThemeCtx.Provider>
  );
};
