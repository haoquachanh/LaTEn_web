'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeContextProps {
  theme: string;
  changeTheme: (x: string) => void;
}

interface Props {
  readonly children: ReactNode;
}
const ThemeContext = createContext<ThemeContextProps>({
  theme: 'valentine',
  changeTheme: (x: string) => {},
});

const useTheme = () => useContext(ThemeContext).theme;
function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState('valentine');
  const [isMounted, setIsMounted] = useState(false);

  const changeTheme = (x: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', x);
    }
    setTheme(x);
  };

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const value = {
    theme: isMounted ? theme : 'valentine', // Use default theme until client-side code runs
    changeTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeProvider, ThemeContext, useTheme };
