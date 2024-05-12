'use client';
import { AuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useContext } from 'react';
import { Icon } from '../Icons';

export default function TheAccount() {
  const { logout } = useContext(AuthContext);
  return (
    <>
      <div className="bg-base-100 navbar">
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button">
              <div className="flex justify-center align-middle btn btn-circle btn-ghost">
                <Icon kind="account" size={30} />
              </div>
            </div>
            <div
              tabIndex={0}
              className="top-px border-white/5 bg-base-200 shadow-2xl mt-16 border rounded-box w-56 max-h-[calc(100vh-10rem)] text-base-content overflow-y-auto dropdown-content outline outline-1 outline-black/5"
            >
              <ul className="gap-1 menu menu-sm">
                <li>
                  <Link href={'/profile'}>Profile</Link>
                </li>
                <li>
                  <Link
                    href={'/'}
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      logout();
                    }}
                  >
                    Log out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
