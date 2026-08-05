import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DARK_QUERY = '(prefers-color-scheme: dark)';

const systemTheme = (): Theme =>
  window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // null means the visitor has never picked a side, so we mirror their device.
  // Anything other than 'light'/'dark' in storage — including the 'auto' written
  // by an earlier build — counts as no choice.
  const [preference, setPreference] = useState<Theme | null>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : null;
  });
  const [systemPreference, setSystemPreference] = useState<Theme>(systemTheme);

  // Keep following the device if the OS flips while no choice has been made.
  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemPreference(e.matches ? 'dark' : 'light');
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const theme: Theme = preference ?? systemPreference;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Only an explicit toggle is persisted — that is what pins the choice.
  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setPreference(next);
    localStorage.setItem('theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
