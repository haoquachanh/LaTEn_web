import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

export default function ChangeTheme() {
  const { changeTheme } = useContext(ThemeContext);

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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="light"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("light")}
          >
            <span
              data-theme="light"
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
                  <span className="flex-grow text-sm">light</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="dark"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("dark")}
          >
            <span
              data-theme="dark"
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
                  <span className="flex-grow text-sm">dark</span>
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
          <button
            className="text-start outline-base-content outline-offset-4" //[&_svg]:visible"
            data-set-theme="cupcake"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("cupcake")}
          >
            <span
              data-theme="cupcake"
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
                  <span className="flex-grow text-sm">cupcake</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="bumblebee"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("bumblebee")}
          >
            <span
              data-theme="bumblebee"
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
                  <span className="flex-grow text-sm">bumblebee</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="emerald"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("emerald")}
          >
            <span
              data-theme="emerald"
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
                  <span className="flex-grow text-sm">emerald</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="corporate"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("corporate")}
          >
            <span
              data-theme="corporate"
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
                  <span className="flex-grow text-sm">corporate</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="synthwave"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("synthwave")}
          >
            <span
              data-theme="synthwave"
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
                  <span className="flex-grow text-sm">synthwave</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="retro"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("retro")}
          >
            <span
              data-theme="retro"
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
                  <span className="flex-grow text-sm">retro</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="cyberpunk"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("cyberpunk")}
          >
            <span
              data-theme="cyberpunk"
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
                  <span className="flex-grow text-sm">cyberpunk</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="valentine"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("valentine")}
          >
            <span
              data-theme="valentine"
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
                  <span className="flex-grow text-sm">valentine</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="halloween"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("halloween")}
          >
            <span
              data-theme="halloween"
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
                  <span className="flex-grow text-sm">halloween</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="garden"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("garden")}
          >
            <span
              data-theme="garden"
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
                  <span className="flex-grow text-sm">garden</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="forest"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("forest")}
          >
            <span
              data-theme="forest"
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
                  <span className="flex-grow text-sm">forest</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="aqua"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("aqua")}
          >
            <span
              data-theme="aqua"
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
                  <span className="flex-grow text-sm">aqua</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="lofi"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("lofi")}
          >
            <span
              data-theme="lofi"
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
                  <span className="flex-grow text-sm">lofi</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="pastel"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("pastel")}
          >
            <span
              data-theme="pastel"
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
                  <span className="flex-grow text-sm">pastel</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="fantasy"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("fantasy")}
          >
            <span
              data-theme="fantasy"
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
                  <span className="flex-grow text-sm">fantasy</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="wireframe"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("wireframe")}
          >
            <span
              data-theme="wireframe"
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
                  <span className="flex-grow text-sm">wireframe</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="black"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("black")}
          >
            <span
              data-theme="black"
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
                  <span className="flex-grow text-sm">black</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="luxury"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("luxury")}
          >
            <span
              data-theme="luxury"
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
                  <span className="flex-grow text-sm">luxury</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="dracula"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("dracula")}
          >
            <span
              data-theme="dracula"
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
                  <span className="flex-grow text-sm">dracula</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="cmyk"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("cmyk")}
          >
            <span
              data-theme="cmyk"
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
                  <span className="flex-grow text-sm">cmyk</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="autumn"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("autumn")}
          >
            <span
              data-theme="autumn"
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
                  <span className="flex-grow text-sm">autumn</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="business"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("business")}
          >
            <span
              data-theme="business"
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
                  <span className="flex-grow text-sm">business</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="acid"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("acid")}
          >
            <span
              data-theme="acid"
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
                  <span className="flex-grow text-sm">acid</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="lemonade"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("lemonade")}
          >
            <span
              data-theme="lemonade"
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
                  <span className="flex-grow text-sm">lemonade</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="night"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("night")}
          >
            <span
              data-theme="night"
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
                  <span className="flex-grow text-sm">night</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="coffee"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("coffee")}
          >
            <span
              data-theme="coffee"
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
                  <span className="flex-grow text-sm">coffee</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="winter"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("winter")}
          >
            <span
              data-theme="winter"
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
                  <span className="flex-grow text-sm">winter</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="dim"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("dim")}
          >
            <span
              data-theme="dim"
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
                  <span className="flex-grow text-sm">dim</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="nord"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("nord")}
          >
            <span
              data-theme="nord"
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
                  <span className="flex-grow text-sm">nord</span>
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
          <button
            className="text-start outline-base-content outline-offset-4"
            data-set-theme="sunset"
            data-act-class="[&_svg]:visible"
            onClick={() => changeTheme("sunset")}
          >
            <span
              data-theme="sunset"
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
                  <span className="flex-grow text-sm">sunset</span>
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
        </div>
      </div>
    </div>
  );
}
