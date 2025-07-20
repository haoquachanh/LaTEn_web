import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import TheAccount from './AfterLogin';
import TheAccountUnLogged from './BeforeLogin';
import ChangeLang from './ChangeLang';
import ChangeTheme from './ChangeTheme';
import { Icon } from '../Icons';

export default function NavBarSimple() {
  const { loggedIn, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between w-full px-4 h-16">
        {/* PHẦN 1: Logo và Navigation - Nằm bên trái */}
        <div className="flex items-center gap-12 flex-1">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button className="btn btn-ghost btn-circle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {mobileMenuOpen && (
              <ul className="menu menu-sm absolute left-0 mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <Link
                    href="/course"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg px-3 py-2"
                  >
                    <Icon kind="course" size={18} className="text-primary/70" />
                    <span className="font-medium">Courses</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg px-3 py-2"
                  >
                    <Icon kind="community" size={18} className="text-primary/70" />
                    <span className="font-medium">Community</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/examination"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg px-3 py-2"
                  >
                    <Icon kind="examination" size={18} className="text-primary/70" />
                    <span className="font-medium">Examinations</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg px-3 py-2"
                  >
                    <Icon kind="about" size={18} className="text-primary/70" />
                    <span className="font-medium">About</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="btn btn-ghost font-bold hover:bg-transparent focus:bg-transparent flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xl">
                LaTEn
              </span>
            </div>
          </Link>

          {/* Navigation Menu - Nằm sát bên logo */}
          <div className="hidden lg:flex">
            <div className="flex items-center gap-1">
              <Link
                href="/course"
                className="btn btn-ghost btn-sm flex items-center gap-2 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <Icon kind="course" size={18} className="text-primary/70" />
                <span className="font-medium text-sm">Courses</span>
              </Link>
              <Link
                href="/community"
                className="btn btn-ghost btn-sm flex items-center gap-2 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <Icon kind="community" size={18} className="text-primary/70" />
                <span className="font-medium text-sm">Community</span>
              </Link>
              <Link
                href="/examination"
                className="btn btn-ghost btn-sm flex items-center gap-2 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <Icon kind="examination" size={18} className="text-primary/70" />
                <span className="font-medium text-sm">Examinations</span>
              </Link>
              <Link
                href="/about"
                className="btn btn-ghost btn-sm flex items-center gap-2 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <Icon kind="about" size={18} className="text-primary/70" />
                <span className="font-medium text-sm">About</span>
              </Link>
            </div>
          </div>
        </div>

        {/* PHẦN 2: Các nút phụ - Cố định bên phải */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Theme switcher - hide on small screens */}
          <div className="hidden sm:block">
            <ChangeTheme />
          </div>

          {/* Language switcher */}
          <ChangeLang />

          {/* Profile dropdown or login buttons */}
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-base-200 animate-pulse flex items-center justify-center">
              <span className="loading loading-spinner loading-sm"></span>
            </div>
          ) : loggedIn ? (
            <TheAccount />
          ) : (
            <TheAccountUnLogged />
          )}
        </div>
      </div>
    </div>
  );
}
