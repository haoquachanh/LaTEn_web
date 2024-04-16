import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

export default function ChangeTheme() {
  const { theme, changeTheme } = useContext(ThemeContext);
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  return (
    <div
      title="Change Theme"
      className="[@supports(color:oklch(0%_0_0))]:block hidden dropdown dropdown-end"
    >
      <div
        tabIndex={0}
        role="button"
        className="d-flex flex-nowrap btn btn-ghost"
      >
        <svg
          width={20}
          height={20}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="md:hidden w-5 h-5 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <span className="md:inline hidden font-normal">Theme</span>
        <svg
          width="12px"
          height="12px"
          className="sm:inline-block hidden opacity-60 w-2 h-2 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </div>
      <div
        tabIndex={0}
        className="top-px border-white/5 bg-base-200 shadow-2xl mt-16 border rounded-box w-56 h-[28.6rem] max-h-[calc(100vh-10rem)] text-base-content overflow-y-auto dropdown-content outline outline-1 outline-black/5"
      >
        <div className="gap-3 grid grid-cols-1 p-3">
          {themes.map((itheme) => {
            return (
              <button
                key={itheme}
                className={`text-start outline-base-content outline-offset-4 ${
                  theme == itheme ? "[&_svg]:visible" : ""
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
