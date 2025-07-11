'use client';
import { AuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useContext } from 'react';
import { Icon } from '../Icons';

export default function TheAccount() {
  const { logout } = useContext(AuthContext);
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button">
        <div className="flex justify-center align-middle btn btn-circle btn-ghost hover:bg-base-200 focus:bg-base-200 active:bg-base-300 transition-colors">
          <Icon kind="profile" size={20} />
        </div>
      </div>
      <div
        tabIndex={0}
        className="top-px border-white/5 bg-base-200 shadow-2xl mt-16 border rounded-box w-56 max-h-[calc(100vh-10rem)] text-base-content overflow-y-auto dropdown-content outline outline-1 outline-black/5"
      >
        <ul className="gap-1 menu menu-sm">
          <li>
            <Link
              href={'/profile'}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 transition-all duration-200"
            >
              <Icon kind="account" size={18} className="text-primary/70" />
              <span className="font-medium">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              href={'/profile'}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 transition-all duration-200"
            >
              <Icon kind="settings" size={18} className="text-primary/70" />
              <span className="font-medium">Settings</span>
            </Link>
          </li>
          <li>
            <Link
              href={'/'}
              onClick={() => {
                localStorage.removeItem('access_token');
                logout();
              }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-error/10 hover:text-error focus:bg-error/10 focus:text-error active:bg-error/20 transition-all duration-200"
            >
              <Icon kind="logout" size={18} className="text-error/70" />
              <span className="font-medium">Log out</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
