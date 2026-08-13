import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DARK_QUERY = '(prefers-color-scheme: dark)';
const STORAGE_KEY = 'theme';

const systemTheme = (): Theme =>
  window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';

/**
 * Reading localStorage can throw, not just return null — Safari with "Block All
 * Cookies", some managed browsers and some embedded webviews all raise a
 * SecurityError on access. Unguarded, that threw during the provider's state
 * initialiser and took the whole app down to a blank page. The pre-paint script
 * in index.html has always guarded this; this now matches it.
 */
const readStoredTheme = (): Theme | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
};

const writeStoredTheme = (value: Theme | null) => {
  try {
    if (value === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable — the choice just will not survive a reload */
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  // null means the visitor has never picked a side, so we mirror their device.
  // Anything other than 'light'/'dark' in storage — including the 'auto' written
  // by an earlier build — counts as no choice.
  const [preference, setPreference] = useState<Theme | null>(readStoredTheme);
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

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';

    // Landing back on whatever the device already says is the same as asking to
    // follow the device, so the pin is dropped rather than rewritten. Without
    // this the first tap of the switch pinned a side permanently and the site
    // could never track the system again — there was no route back to auto
    // short of clearing site data.
    if (next === systemPreference) {
      setPreference(null);
      writeStoredTheme(null);
    } else {
      setPreference(next);
      writeStoredTheme(next);
    }
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
