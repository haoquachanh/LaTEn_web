import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { ExaminationProvider } from './ExaminationContext';

type Props = {
  children: ReactNode;
};

export default function AppProvider({ children }: Props) {
  return (
    <>
      <ThemeProvider>
        <ExaminationProvider>
          <AuthProvider>{children}</AuthProvider>
        </ExaminationProvider>
      </ThemeProvider>
    </>
  );
}
