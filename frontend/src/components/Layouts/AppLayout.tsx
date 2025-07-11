'use client';
import { ReactNode, useContext } from 'react';
import NavBarSimple from '../Navbar/NavBarSimple';
import { ThemeContext } from '@/contexts/ThemeContext';

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  const { theme } = useContext(ThemeContext);

  return (
    <body className="w-full min-h-screen" data-theme={theme}>
      <div className="bg-base-100 w-full min-h-screen">
        <NavBarSimple />
        <main className="w-full">{children}</main>
      </div>
    </body>
  );
}
