"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextProps {
  theme: string;
  changeTheme: (x: string) => void;
}

interface Props {
  readonly children: ReactNode;
}
const ThemeContext = createContext<ThemeContextProps>({
  theme: "dark",
  changeTheme: (x: string) => {},
});

const useTheme = () => useContext(ThemeContext).theme;
function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState("light");

  const changeTheme = (x: string) => {
    localStorage.setItem("theme", x);
    setTheme(x);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      changeTheme(theme);
    }
  }, []);

  const value = {
    theme,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext, useTheme };
