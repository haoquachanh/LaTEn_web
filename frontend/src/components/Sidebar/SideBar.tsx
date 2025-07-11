/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { navLinks, socialLinks } from '@/utils/navLink';
import { Icon, SocialIcon } from '../Icons';
import { AuthContext } from '@/contexts/AuthContext';

export default function SideBar() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <div className="z-40 h-full drawer-side" style={{ scrollBehavior: 'smooth', scrollPaddingTop: '5rem' }}>
      <label htmlFor="drawer" className="drawer-overlay" aria-label="Close menu" />
      <aside className="fixed flex flex-col bg-base-200 w-80 h-screen min-h-screen">
        {/* Header with Logo */}
        <div className="sticky top-0 z-20 bg-base-200 border-b border-base-300">
          <Link href="/" className="flex items-center justify-center p-6 hover:bg-base-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                LaTEn
              </span>
            </div>
          </Link>
        </div>

        {/* User Profile Section (if logged in) */}
        {loggedIn && (
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">U</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">User</p>
                <p className="text-xs text-base-content/60 truncate">user@example.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <ul className="menu p-4 space-y-2">
            {navLinks.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100 transition-colors group"
                >
                  <div className="text-base-content/70 group-hover:text-primary transition-colors">
                    <Icon kind={item.icon} size={20} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Quick Actions */}
          {loggedIn && (
            <div className="p-4 border-t border-base-300">
              <h3 className="font-semibold text-sm text-base-content/70 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/test" className="btn btn-primary btn-sm w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    ></path>
                  </svg>
                  Take Test
                </Link>
                <Link href="/course" className="btn btn-outline btn-sm w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                  Browse Courses
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Social Links */}
        <div className="p-4 border-t border-base-300">
          <h3 className="font-semibold text-sm text-base-content/70 mb-3">Connect With Us</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <SocialIcon kind="mail" href={`mailto:${socialLinks.email}`} size={4} />
            <SocialIcon kind="github" href={socialLinks.github} size={4} />
            <SocialIcon kind="facebook" href={socialLinks.facebook} size={4} />
            <SocialIcon kind="youtube" href={socialLinks.youtube} size={4} />
            <SocialIcon kind="linkedin" href={socialLinks.linkedin} size={4} />
            <SocialIcon kind="twitter" href={socialLinks.twitter} size={4} />
            <SocialIcon kind="instagram" href={socialLinks.instagram} size={4} />
            <SocialIcon kind="threads" href={socialLinks.threads} size={4} />
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-base-content/50">© 2024 LaTEn. All rights reserved.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
