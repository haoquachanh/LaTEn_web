import Link from 'next/link';
import { Icon } from '../Icons';

export default function TheAccountUnLogged() {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button">
        <div className="flex justify-center align-middle btn btn-circle btn-ghost hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 transition-all duration-200">
          <Icon kind="account" size={20} className="text-primary/70" />
        </div>
      </div>
      <div
        tabIndex={0}
        className="top-px border-white/5 bg-base-200 shadow-2xl mt-16 border rounded-box w-56 max-h-[calc(100vh-10rem)] text-base-content overflow-y-auto dropdown-content outline outline-1 outline-black/5 custom-scrollbar"
      >
        <ul className="gap-1 menu menu-sm">
          <li>
            <Link
              href={'/login'}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 transition-all duration-200"
            >
              <Icon kind="login" size={18} className="text-primary/70" />
              <span className="font-medium">Login</span>
            </Link>
          </li>
          <li>
            <Link
              href={'/register'}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 transition-all duration-200"
            >
              <Icon kind="register" size={18} className="text-primary/70" />
              <span className="font-medium">Sign up</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
