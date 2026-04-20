import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    const r = document.documentElement;
    r.classList.remove('theme-light', 'theme-dark');
    r.classList.add(theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'theme-dark' : 'theme-light')
      : `theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
