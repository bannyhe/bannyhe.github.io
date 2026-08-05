import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/** What the user picked. 'auto' defers to the operating system. */
export type ThemeMode = 'light' | 'dark' | 'auto';
/** What actually gets applied to the document. */
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  /** Resolved theme currently on the page — never 'auto'. */
  theme: ResolvedTheme;
  /** The stored preference, which may be 'auto'. */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Advances light → dark → auto → light. */
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const MODE_ORDER: ThemeMode[] = ['light', 'dark', 'auto'];
const DARK_QUERY = '(prefers-color-scheme: dark)';

const systemTheme = (): ResolvedTheme =>
  window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    // Visitors who already picked light or dark keep that choice; everyone
    // else — including first-time visitors — starts on 'auto'.
    return saved === 'light' || saved === 'dark' || saved === 'auto' ? saved : 'auto';
  });
  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>(systemTheme);

  // Keep 'auto' in sync when the OS flips theme while the page is open.
  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemPreference(e.matches ? 'dark' : 'light');
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const theme: ResolvedTheme = mode === 'auto' ? systemPreference : mode;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', mode);
  }, [theme, mode]);

  const cycleTheme = () => {
    setMode(prev => MODE_ORDER[(MODE_ORDER.indexOf(prev) + 1) % MODE_ORDER.length]);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
