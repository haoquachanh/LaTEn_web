'use client';
import { ReactNode, useContext } from 'react';
import NavBar from '../Navbar/NavBar';
import { ThemeContext } from '@/contexts/ThemeContext';
import AuthStateHandler from '../Auth/AuthStateHandler';
import AuthLoadingIndicator from '../Auth/AuthLoadingIndicator';

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="bg-base-100 w-full min-h-screen" data-theme={theme}>
      {/* Component quản lý trạng thái đăng nhập toàn cục */}
      <AuthStateHandler />

      {/* Hiển thị indicator khi đang kiểm tra trạng thái đăng nhập */}
      <AuthLoadingIndicator />

      <NavBar />
      <main className="w-full">{children}</main>
    </div>
  );
}
