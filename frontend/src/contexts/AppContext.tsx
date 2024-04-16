import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";

type Props = {
  children: ReactNode;
};

export default function AppProvider({ children }: Props) {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </>
  );
}
