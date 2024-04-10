"use client";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";

export default function NavBar() {
  const { changeTheme } = useContext(ThemeContext);
  return (
    <>
      <div
        className="
  bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)]   "
      >
        <nav className="navbar w-full">
          <div className="flex flex-1 md:gap-1 lg:gap-2">
            <span
              className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]"
              data-tip="Menu"
            >
              <label
                aria-label="Open menu"
                htmlFor="drawer"
                className="btn btn-square btn-ghost drawer-button lg:hidden "
              >
                <svg
                  width={20}
                  height={20}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </span>
            <div className="flex items-center gap-2 lg:hidden">
              <a
                data-sveltekit-preload-data=""
                href="/"
                aria-current="page"
                aria-label="daisyUI"
                className="flex-0 btn btn-ghost gap-1 px-2 md:gap-2"
                data-svelte-h="svelte-dlyygu"
              >
                <svg
                  className="h-6 w-6 md:h-8 md:w-8"
                  width={32}
                  height={32}
                  viewBox="0 0 415 415"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="82.5"
                    y={290}
                    width={250}
                    height={125}
                    rx="62.5"
                    fill="#1AD1A5"
                  />
                  <circle
                    cx="207.5"
                    cy={135}
                    r={130}
                    fill="black"
                    fillOpacity=".3"
                  />
                  <circle cx="207.5" cy={135} r={125} fill="white" />
                  <circle cx="207.5" cy={135} r={56} fill="#FF9903" />
                </svg>
                <span className="font-title text-base-content text-lg md:text-2xl">
                  daisyUI
                </span>
              </a>
            </div>
          </div>
          <div className="flex-0">
            {/* <div className="hidden flex-none items-center lg:block">
              <a
                data-sveltekit-preload-data=""
                href="/components/"
                className="btn btn-ghost drawer-button font-normal"
              >
                Components
              </a>
            </div> */}
            <div
              title="Change Theme"
              className="dropdown dropdown-end hidden [@supports(color:oklch(0%_0_0))]:block "
            >
              <div tabIndex={0} role="button" className="btn btn-ghost">
                <svg
                  width={20}
                  height={20}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 stroke-current md:hidden"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>{" "}
                <span className="hidden font-normal md:inline">Theme</span>{" "}
                <svg
                  width="12px"
                  height="12px"
                  className="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 2048 2048"
                >
                  <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
                </svg>
              </div>{" "}
              <div
                tabIndex={0}
                className="dropdown-content bg-base-200 text-base-content rounded-box top-px h-[28.6rem] max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5 mt-16"
              >
                <div className="grid grid-cols-1 gap-3 p-3">
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="light"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("light")}
                  >
                    <span
                      data-theme="light"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">light</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="dark"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("dark")}
                  >
                    <span
                      data-theme="dark"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">dark</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4" //[&_svg]:visible"
                    data-set-theme="cupcake"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("cupcake")}
                  >
                    <span
                      data-theme="cupcake"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">cupcake</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="bumblebee"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("bumblebee")}
                  >
                    <span
                      data-theme="bumblebee"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">bumblebee</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="emerald"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("emerald")}
                  >
                    <span
                      data-theme="emerald"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">emerald</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="corporate"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("corporate")}
                  >
                    <span
                      data-theme="corporate"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">corporate</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="synthwave"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("synthwave")}
                  >
                    <span
                      data-theme="synthwave"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">synthwave</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="retro"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("retro")}
                  >
                    <span
                      data-theme="retro"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">retro</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="cyberpunk"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("cyberpunk")}
                  >
                    <span
                      data-theme="cyberpunk"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">cyberpunk</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="valentine"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("valentine")}
                  >
                    <span
                      data-theme="valentine"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">valentine</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="halloween"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("halloween")}
                  >
                    <span
                      data-theme="halloween"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">halloween</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="garden"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("garden")}
                  >
                    <span
                      data-theme="garden"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">garden</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="forest"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("forest")}
                  >
                    <span
                      data-theme="forest"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">forest</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="aqua"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("aqua")}
                  >
                    <span
                      data-theme="aqua"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">aqua</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="lofi"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("lofi")}
                  >
                    <span
                      data-theme="lofi"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">lofi</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="pastel"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("pastel")}
                  >
                    <span
                      data-theme="pastel"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">pastel</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="fantasy"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("fantasy")}
                  >
                    <span
                      data-theme="fantasy"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">fantasy</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="wireframe"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("wireframe")}
                  >
                    <span
                      data-theme="wireframe"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">wireframe</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="black"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("black")}
                  >
                    <span
                      data-theme="black"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">black</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="luxury"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("luxury")}
                  >
                    <span
                      data-theme="luxury"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">luxury</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="dracula"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("dracula")}
                  >
                    <span
                      data-theme="dracula"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">dracula</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="cmyk"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("cmyk")}
                  >
                    <span
                      data-theme="cmyk"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">cmyk</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="autumn"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("autumn")}
                  >
                    <span
                      data-theme="autumn"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">autumn</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="business"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("business")}
                  >
                    <span
                      data-theme="business"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">business</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="acid"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("acid")}
                  >
                    <span
                      data-theme="acid"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">acid</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="lemonade"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("lemonade")}
                  >
                    <span
                      data-theme="lemonade"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">lemonade</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="night"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("night")}
                  >
                    <span
                      data-theme="night"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">night</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="coffee"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("coffee")}
                  >
                    <span
                      data-theme="coffee"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">coffee</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="winter"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("winter")}
                  >
                    <span
                      data-theme="winter"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">winter</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="dim"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("dim")}
                  >
                    <span
                      data-theme="dim"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">dim</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="nord"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("nord")}
                  >
                    <span
                      data-theme="nord"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">nord</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className="outline-base-content text-start outline-offset-4"
                    data-set-theme="sunset"
                    data-act-class="[&_svg]:visible"
                    onClick={() => changeTheme("sunset")}
                  >
                    <span
                      data-theme="sunset"
                      className="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                    >
                      <span className="grid grid-cols-5 grid-rows-3">
                        <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="invisible h-3 w-3 shrink-0"
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                          </svg>{" "}
                          <span className="flex-grow text-sm">sunset</span>{" "}
                          <span className="flex h-full shrink-0 flex-wrap gap-1">
                            <span className="bg-primary rounded-badge w-2" />{" "}
                            <span className="bg-secondary rounded-badge w-2" />{" "}
                            <span className="bg-accent rounded-badge w-2" />{" "}
                            <span className="bg-neutral rounded-badge w-2" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>{" "}
                </div>
              </div>
            </div>{" "}
            <div title="Change Language" className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost"
                aria-label="Language"
              >
                <svg
                  className="h-5 w-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 512 512"
                >
                  <path d="M363,176,246,464h47.24l24.49-58h90.54l24.49,58H480ZM336.31,362,363,279.85,389.69,362Z" />
                  <path d="M272,320c-.25-.19-20.59-15.77-45.42-42.67,39.58-53.64,62-114.61,71.15-143.33H352V90H214V48H170V90H32v44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-32.68-43.44-47.14-75.88-47.33-76.22L143,152l-38,22,6.87,13.86c.89,1.56,17.19,37.9,54.71,86.57.92,1.21,1.85,2.39,2.78,3.57-49.72,56.86-89.15,79.09-89.66,79.47L64,368l23,36,19.3-11.47c2.2-1.67,41.33-24,92-80.78,24.52,26.28,43.22,40.83,44.3,41.67L255,362Z" />
                </svg>{" "}
                <svg
                  width="12px"
                  height="12px"
                  className="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 2048 2048"
                >
                  <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
                </svg>
              </div>{" "}
              <div
                tabIndex={0}
                className="dropdown-content bg-base-200 text-base-content rounded-box top-px mt-16 max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5"
              >
                <ul className="menu menu-sm gap-1">
                  <li>
                    <button className="active">
                      <span className="badge badge-sm badge-outline !pl-1.5 !pr-1 pt-px font-mono !text-[.6rem] font-bold tracking-widest opacity-50">
                        EN
                      </span>{" "}
                      <span className="font-[sans-serif]">English</span>{" "}
                    </button>{" "}
                  </li>
                  <li>
                    <button>
                      <span className="badge badge-sm badge-outline !pl-1.5 !pr-1 pt-px font-mono !text-[.6rem] font-bold tracking-widest opacity-50">
                        VI
                      </span>{" "}
                      <span className="font-[sans-serif]">Vietnamese</span>{" "}
                    </button>{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
