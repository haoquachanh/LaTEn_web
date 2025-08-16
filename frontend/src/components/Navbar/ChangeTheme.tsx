import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext } from 'react';
import { Icon } from '../Icons';

export default function ChangeTheme() {
  const { theme, changeTheme } = useContext(ThemeContext);
  const themes = [
    'light',
    'dark',
    'valentine',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
  ];

  return (
    <div title="Change Theme" className="[@supports(color:oklch(0%_0_0))]:block hidden dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 transition-all duration-200"
      >
        <Icon kind="theme" size={20} className="text-primary/70" />
      </div>
      <div
        tabIndex={0}
        className="top-px border-white/5 bg-base-200 shadow-2xl mt-16 border rounded-box w-56 h-[28.6rem] max-h-[calc(100vh-10rem)] text-base-content overflow-y-auto dropdown-content outline outline-1 outline-black/5 custom-scrollbar"
      >
        <div className="gap-3 grid grid-cols-1 p-3">
          {themes.map((itheme) => {
            return (
              <button
                key={itheme}
                className={`text-start outline-base-content outline-offset-4 ${
                  theme == itheme ? '[&_svg]:visible' : ''
                }`}
                data-set-theme={itheme}
                data-act-class="[&_svg]:visible"
                onClick={() => changeTheme(itheme)}
              >
                <span
                  data-theme={itheme}
                  className="block bg-base-100 rounded-btn w-full font-sans text-base-content cursor-pointer"
                >
                  <span className="grid grid-cols-5 grid-rows-3">
                    <span className="flex items-center gap-2 col-span-5 row-span-3 row-start-1 px-4 py-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3 h-3 invisible shrink-0"
                      >
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                      </svg>
                      <span className="flex-grow text-sm">{itheme}</span>
                      <span className="flex flex-wrap gap-1 h-full shrink-0">
                        <span className="bg-primary rounded-badge w-2" />
                        <span className="bg-secondary rounded-badge w-2" />
                        <span className="bg-accent rounded-badge w-2" />
                        <span className="bg-neutral rounded-badge w-2" />
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
