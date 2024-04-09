"use client";
import { createContext, ReactNode, useContext, useState } from "react";

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
  const [theme, setTheme] = useState("dark");

  const changeTheme = (x: string) => {
    setTheme(x);
  };

  const value = {
    theme,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext, useTheme };
