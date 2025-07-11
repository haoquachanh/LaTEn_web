import { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/contexts/AuthContext';
import TheAccount from './AfterLogin';
import TheAccountUnLogged from './BeforeLogin';
import ChangeLang from './ChangeLang';
import ChangeTheme from './ChangeTheme';
import { Icon } from '../Icons';

export default function NavBarSimple() {
  const { loggedIn } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile menu button */}
        <div className="dropdown lg:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          {mobileMenuOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
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
        <Link href="/" className="btn btn-ghost text-xl font-bold ml-2 lg:ml-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LaTEn</span>
          </div>
        </Link>

        {/* Desktop navigation menu */}
        <div className="hidden lg:flex lg:ml-8">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link
                href="/course"
                className="btn btn-ghost flex items-center gap-2 px-4 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <Icon kind="course" size={20} className="text-primary/70" />
                <span className="font-medium">Courses</span>
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className="btn btn-ghost flex items-center gap-2 px-4 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <Icon kind="community" size={20} className="text-primary/70" />
                <span className="font-medium">Community</span>
              </Link>
            </li>
            <li>
              <Link
                href="/examination"
                className="btn btn-ghost flex items-center gap-2 px-4 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <Icon kind="examination" size={20} className="text-primary/70" />
                <span className="font-medium">Examinations</span>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="btn btn-ghost flex items-center gap-2 px-4 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <Icon kind="about" size={20} className="text-primary/70" />
                <span className="font-medium">About</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-end">
        <div className="flex items-center gap-1">
          {/* Theme switcher - hide on small screens */}
          <div className="hidden sm:block">
            <ChangeTheme />
          </div>

          {/* Language switcher */}
          <ChangeLang />

          {/* Profile dropdown or login buttons */}
          {loggedIn ? <TheAccount /> : <TheAccountUnLogged />}
        </div>
      </div>
    </div>
  );
}
