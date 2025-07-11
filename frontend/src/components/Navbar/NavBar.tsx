import { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/contexts/AuthContext';
import AfterLoggin from './AfterLogin';
import BeforeLogin from './BeforeLogin';
import ChangeLang from './ChangeLang';
import ChangeTheme from './ChangeTheme';
import { navLinks, socialLinks } from '@/utils/navLink';
import { Icon, SocialIcon } from '../Icons/index';

export default function NavBar() {
  const { loggedIn } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="navbar-start">
        {/* Mobile menu button */}
        <div className="dropdown lg:hidden">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle hover:bg-base-200 focus:bg-base-200 active:bg-base-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon kind="menu" size={20} />
          </label>

          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div className="dropdown-content mt-3 z-[1] card card-compact w-80 p-2 shadow bg-base-100">
              <div className="card-body">
                {/* User section for mobile */}
                {loggedIn && (
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg mb-4">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon kind="account" size={20} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">User</p>
                      <p className="text-xs text-base-content/60 truncate">user@example.com</p>
                    </div>
                  </div>
                )}

                {/* Navigation links */}
                <ul className="menu menu-sm p-0 space-y-1">
                  {navLinks.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 focus:bg-base-200 active:bg-base-300 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon kind={item.icon} size={18} />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Quick actions for mobile */}
                {loggedIn && (
                  <div className="mt-4 pt-4 border-t border-base-300">
                    <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Link
                        href="/test"
                        className="btn btn-primary btn-sm w-full hover:btn-primary-focus focus:btn-primary-focus transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon kind="app" size={16} />
                        Take Test
                      </Link>
                      <Link
                        href="/course"
                        className="btn btn-outline btn-sm w-full hover:btn-outline-focus focus:btn-outline-focus transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon kind="course" size={16} />
                        Browse Courses
                      </Link>
                    </div>
                  </div>
                )}

                {/* Social links for mobile */}
                <div className="mt-4 pt-4 border-t border-base-300">
                  <h4 className="font-medium text-sm mb-2">Connect</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <SocialIcon kind="mail" href={`mailto:${socialLinks.email}`} size={4} />
                    <SocialIcon kind="github" href={socialLinks.github} size={4} />
                    <SocialIcon kind="facebook" href={socialLinks.facebook} size={4} />
                    <SocialIcon kind="youtube" href={socialLinks.youtube} size={4} />
                    <SocialIcon kind="linkedin" href={socialLinks.linkedin} size={4} />
                    <SocialIcon kind="twitter" href={socialLinks.twitter} size={4} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logo */}
        <Link href="/" className="btn btn-ghost text-xl font-bold hover:bg-transparent focus:bg-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LaTEn</span>
          </div>
        </Link>

        {/* Desktop navigation menu */}
        <div className="hidden lg:flex lg:ml-8">
          <ul className="menu menu-horizontal px-1 gap-1">
            {navLinks.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="btn btn-ghost hover:bg-base-200 focus:bg-base-200 active:bg-base-300 transition-colors"
                >
                  <Icon kind={item.icon} size={16} />
                  <span className="hidden xl:inline">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="navbar-end gap-2">
        {/* Quick actions for desktop */}
        {loggedIn && (
          <div className="hidden lg:flex gap-2">
            <Link
              href="/test"
              className="btn btn-primary btn-sm hover:btn-primary-focus focus:btn-primary-focus transition-colors"
            >
              <Icon kind="app" size={16} />
              <span className="hidden xl:inline">Test</span>
            </Link>
            <Link
              href="/course"
              className="btn btn-outline btn-sm hover:btn-outline-focus focus:btn-outline-focus transition-colors"
            >
              <Icon kind="course" size={16} />
              <span className="hidden xl:inline">Courses</span>
            </Link>
          </div>
        )}

        {/* Search button */}
        <div className="hidden md:block">
          <button className="btn btn-ghost btn-circle hover:bg-base-200 focus:bg-base-200 active:bg-base-300 transition-colors">
            <Icon kind="search" size={20} />
          </button>
        </div>

        {/* Theme and language switchers */}
        <ChangeTheme />
        <ChangeLang />

        {/* Notifications for logged in users */}
        {loggedIn && (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle hover:bg-base-200 focus:bg-base-200 active:bg-base-300 transition-colors"
            >
              <div className="indicator">
                <Icon kind="bell" size={20} />
                <span className="badge badge-xs badge-primary indicator-item animate-pulse"></span>
              </div>
            </label>
            <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
              <div className="card-body">
                <span className="font-bold text-lg">Notifications</span>
                <span className="text-info">You have new updates!</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block btn-sm hover:btn-primary-focus transition-colors">
                    View all
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile dropdown or login buttons */}
        {loggedIn ? <AfterLoggin /> : <BeforeLogin />}

        {/* Social links dropdown for desktop */}
        <div className="dropdown dropdown-end hidden lg:block">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle hover:bg-base-200 focus:bg-base-200 active:bg-base-300 transition-colors"
          >
            <Icon kind="link" size={20} />
          </label>
          <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-48 bg-base-100 shadow">
            <div className="card-body">
              <span className="font-bold text-sm">Connect With Us</span>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                <SocialIcon kind="mail" href={`mailto:${socialLinks.email}`} size={4} />
                <SocialIcon kind="github" href={socialLinks.github} size={4} />
                <SocialIcon kind="facebook" href={socialLinks.facebook} size={4} />
                <SocialIcon kind="youtube" href={socialLinks.youtube} size={4} />
                <SocialIcon kind="linkedin" href={socialLinks.linkedin} size={4} />
                <SocialIcon kind="twitter" href={socialLinks.twitter} size={4} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
