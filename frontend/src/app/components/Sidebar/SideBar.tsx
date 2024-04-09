"use client";
import { SideBarContext } from "@/app/contexts/SidebarProvider";
import Link from "next/link";
import { useContext } from "react";

export default function SideBar() {
  const { isOpen } = useContext(SideBarContext);

  return (
    <>
      <div
        className="drawer-side z-40"
        style={{ scrollBehavior: "smooth", scrollPaddingTop: "5rem" }}
      >
        <label
          htmlFor="drawer"
          className="drawer-overlay"
          aria-label="Close menu"
        />
        <aside className="bg-base-100 min-h-screen w-80">
          <div
            data-sveltekit-preload-data=""
            className="bg-base-100 sticky top-0 z-20 hidden items-center gap-2 bg-opacity-90 px-4 py-2 backdrop-blur lg:flex "
          >
            <a
              href="/"
              aria-current="page"
              aria-label="Homepage"
              className="flex-0 btn btn-ghost px-2"
              data-svelte-h="svelte-nce89e"
            >
              <svg
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
              <div className="font-title inline-flex text-lg md:text-2xl">
                daisyUI
              </div>
            </a>
            <div className="dropdown" data-sveltekit-preload-data="">
              <div
                tabIndex={0}
                role="button"
                className="link link-hover inline-block font-mono text-xs"
              >
                4.10.1
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu menu-sm bg-base-200 rounded-box mt-7 w-36 border border-white/5 p-2 shadow-2xl outline outline-1 outline-black/5"
              >
                <li>
                  <a href="/docs/changelog/">
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.81836 6.72729V14H13.0911"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 24C4 35.0457 12.9543 44 24 44V44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C16.598 4 10.1351 8.02111 6.67677 13.9981"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M24.005 12L24.0038 24.0088L32.4832 32.4882"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Changelog
                  </a>
                </li>
                <li />
                <li>
                  <a
                    target="_blank"
                    rel="noopener, noreferrer"
                    href="https://v3.daisyui.com/"
                  >
                    Version 3.x
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener, noreferrer"
                    href="https://v2.daisyui.com/"
                  >
                    Version 2.x
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener, noreferrer"
                    href="https://v1.daisyui.com/"
                  >
                    Version 1.x
                  </a>
                </li>
                <li />
                <li>
                  <a href="/docs/roadmap/">
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 12L4 6V36L17 42L31 36L44 42V12L31 6L17 12Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M31 6V36"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 12V42"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 9L17 12L31 6L37.5 9"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 39L17 42L31 36L37.5 39"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="h-4" />
          <ul className="menu px-4 py-0">
            <li>
              <details id="disclosure-docs">
                <summary className="group">
                  <span>
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 48 48"
                      className="text-orange-400 h-5 w-5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 7H16C20.4183 7 24 10.5817 24 15V42C24 38.6863 21.3137 36 18 36H5V7Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinejoin="bevel"
                      />
                      <path
                        d="M43 7H32C27.5817 7 24 10.5817 24 15V42C24 38.6863 26.6863 36 30 36H43V7Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinejoin="bevel"
                      />
                    </svg>
                  </span>
                  Docs
                </summary>
                <ul>
                  <li>
                    <a href="/docs/install/" className="group   ">
                      <span>Install</span>
                    </a>
                  </li>
                  <li>
                    <a href="/docs/use/" className="group   ">
                      <span>Use</span>
                    </a>
                  </li>
                  <li>
                    <a href="/docs/customize/" className="group   ">
                      <span>Customize components</span>
                    </a>
                  </li>
                  <li>
                    <a href="/docs/config/" className="group   ">
                      <span>Config</span>
                      <span className="badge badge-sm font-mono undefined">
                        updated
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="/docs/colors/" className="group   ">
                      <span>Colors</span>
                      <span className="badge badge-sm font-mono undefined">
                        updated
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="/docs/themes/" className="group   ">
                      <span>Themes</span>
                      <span className="badge badge-sm font-mono undefined">
                        updated
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="/docs/utilities/" className="group   ">
                      <span>Utilities</span>
                      <span className="badge badge-sm font-mono undefined">
                        new
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="/docs/layout-and-typography/" className="group">
                      <span>Layout &amp; Typography</span>
                    </a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details id="disclosure-components">
                <summary className="group">
                  <span>
                    <svg
                      className="w-5 h-5 text-green-600"
                      width={18}
                      height={18}
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 29H6V43H20V29Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="butt"
                        strokeLinejoin="bevel"
                      />
                      <path
                        d="M24 4L34 21H14L24 4Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="butt"
                        strokeLinejoin="bevel"
                      />
                      <path
                        d="M36 44C40.4183 44 44 40.4183 44 36C44 31.5817 40.4183 28 36 28C31.5817 28 28 31.5817 28 36C28 40.4183 31.5817 44 36 44Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="butt"
                        strokeLinejoin="bevel"
                      />
                    </svg>
                  </span>
                  Components
                </summary>
              </details>
            </li>
            <li>
              <a href="/theme-generator/" className="group   ">
                <span>
                  <svg
                    className="h-5 w-5 text-fuchsia-400"
                    width={18}
                    height={18}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.1005 8.1005L24.3431 12.3431M30 4V10V4ZM39.8995 8.1005L35.6569 12.3431L39.8995 8.1005ZM44 18H38H44ZM39.8995 27.8995L35.6569 23.6569L39.8995 27.8995ZM30 32V26V32ZM20.1005 27.8995L24.3431 23.6569L20.1005 27.8995ZM16 18H22H16Z"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="butt"
                      strokeLinejoin="bevel"
                    />
                    <path
                      d="M29.5856 18.4143L5.54395 42.4559"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="butt"
                      strokeLinejoin="bevel"
                    />
                  </svg>
                </span>
                <span>Theme Generator</span>
              </a>
            </li>
            <li />
            <li>
              <a href="/store/" className="group   ">
                <span>
                  <svg
                    className="h-5 w-5"
                    width={18}
                    height={18}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M40.0391 22V42H8.03906V22"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="butt"
                      strokeLinejoin="bevel"
                    />
                    <path
                      d="M5.84231 13.7766C4.31276 17.7377 7.26307 22 11.5092 22C14.8229 22 17.5276 19.3137 17.5276 16C17.5276 19.3137 20.2139 22 23.5276 22H24.546C27.8597 22 30.546 19.3137 30.546 16C30.546 19.3137 33.2518 22 36.5655 22C40.8139 22 43.767 17.7352 42.2362 13.7723L39.2337 6H8.84523L5.84231 13.7766Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinejoin="bevel"
                    />
                  </svg>
                </span>
                <span>Store</span>
                <span className="badge badge-sm font-mono badge-primary">
                  new
                </span>
              </a>
            </li>
            <li>
              <a href="/blog/" className="group">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M3.75 3a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75H4c6.075 0 11 4.925 11 11v.25c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75V16C17 8.82 11.18 3 4 3h-.25z" />
                    <path d="M3 8.75A.75.75 0 013.75 8H4a8 8 0 018 8v.25a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75V16a6 6 0 00-6-6h-.25A.75.75 0 013 9.25v-.5zM7 15a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                <span>Blog</span>
              </a>
            </li>
            {/* <li>
              <a href="/resources/videos/" className="group   ">
                <span>
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 48 48"
                    className="w-5 h-5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinejoin="bevel"
                    />
                    <path
                      d="M20 24V17.0718L26 20.5359L32 24L26 27.4641L20 30.9282V24Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinejoin="bevel"
                    />
                  </svg>
                </span>
                <span>Resources</span>
              </a>
            </li> */}
            <li />
            {/* <li>
              <a
                href="/tailwindplay/"
                target="_blank"
                rel="noopener noreferrer"
                className="group   "
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 54 33"
                  >
                    <g clipPath="url(#prefix__clip0)">
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
                        clipRule="evenodd"
                      />
                    </g>
                    <defs>
                      <clipPath id="prefix__clip0">
                        <path fill="#fff" d="M0 0h54v32.4H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>Playground</span>
                <svg
                  width={12}
                  height={12}
                  className="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 11H37V29"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="butt"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M11.5439 36.4559L36.9997 11"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="butt"
                    strokeLinejoin="bevel"
                  />
                </svg>
              </a>
            </li> */}
            <li>
              <a
                href="https://github.com/haoquachanh"
                target="_blank"
                rel="noopener noreferrer"
                className="group   "
              >
                <span>
                  <svg
                    width={18}
                    height={18}
                    className="h-5 w-5"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.3444 30.4765C31.7481 29.977 33.9292 29.1108 35.6247 27.8391C38.5202 25.6676 40 22.3136 40 18.9999C40 16.6752 39.1187 14.505 37.5929 12.6668C36.7427 11.6425 39.2295 3.99989 37.02 5.02919C34.8105 6.05848 31.5708 8.33679 29.8726 7.83398C28.0545 7.29565 26.0733 6.99989 24 6.99989C22.1992 6.99989 20.4679 7.22301 18.8526 7.6344C16.5046 8.23237 14.2591 5.99989 12 5.02919C9.74086 4.05848 10.9736 11.9632 10.3026 12.7944C8.84119 14.6051 8 16.7288 8 18.9999C8 22.3136 9.79086 25.6676 12.6863 27.8391C14.6151 29.2857 17.034 30.2076 19.7401 30.6619"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="butt"
                    />
                    <path
                      d="M19.7397 30.6619C18.5812 31.937 18.002 33.1478 18.002 34.2944C18.002 35.441 18.002 38.3464 18.002 43.0106"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="butt"
                    />
                    <path
                      d="M29.3446 30.4766C30.4423 31.9174 30.9912 33.211 30.9912 34.3576C30.9912 35.5042 30.9912 38.3885 30.9912 43.0107"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="butt"
                    />
                    <path
                      d="M6 31.2155C6.89887 31.3254 7.56554 31.7387 8 32.4554C8.65169 33.5303 11.0742 37.518 13.8251 37.518C15.6591 37.518 17.0515 37.518 18.0024 37.518"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="butt"
                    />
                  </svg>
                </span>
                <span>GitHub</span>
                <svg
                  width={12}
                  height={12}
                  className="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 11H37V29"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="butt"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M11.5439 36.4559L36.9997 11"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="butt"
                    strokeLinejoin="bevel"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/n9zXQNaE"
                target="_blank"
                rel="noopener noreferrer"
                className="group   "
              >
                <span>
                  <svg
                    className="h-5 w-5"
                    x="0px"
                    y="0px"
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M 8.2363281 3.3886719 C 7.9184915 3.3507541 7.5922955 3.389759 7.2851562 3.5078125 C 6.3662291 3.8593556 5.168019 4.408137 4.1210938 5.2539062 L 4.09375 5.2753906 L 4.0683594 5.296875 C 3.6038679 5.7274657 3.3488069 6.2439566 3.0234375 6.9511719 C 2.6980681 7.6583872 2.3700247 8.5311318 2.0722656 9.5136719 C 1.4767474 11.478752 1 13.870256 1 16.164062 C 1 16.404094 1.06291 16.653616 1.1875 16.873047 C 1.9936894 18.296146 3.3875707 19.089172 4.6289062 19.564453 C 5.8601415 20.035867 6.9037775 20.195689 7.5 20.216797 C 7.51943 20.217478 7.5686445 20.224609 7.5703125 20.224609 C 7.9778976 20.224609 8.507273 20.074519 8.8046875 19.511719 L 9.7265625 17.767578 C 11.253027 18.034862 12.698188 18.031089 14.265625 17.751953 L 15.193359 19.507812 C 15.4917 20.076956 16.025986 20.222656 16.429688 20.222656 C 16.431188 20.222656 16.477491 20.217397 16.494141 20.216797 C 17.090411 20.196247 18.137319 20.035024 19.371094 19.5625 C 20.610912 19.087661 22.002426 18.296509 22.808594 16.876953 C 22.937245 16.653708 23 16.40296 23 16.164062 C 23 13.870256 22.522369 11.477589 21.923828 9.5097656 C 21.624558 8.5258538 21.295636 7.6497223 20.966797 6.9394531 C 20.637958 6.2291839 20.373325 5.7078286 19.908203 5.2773438 L 19.882812 5.2558594 L 19.857422 5.234375 C 18.821451 4.3968794 17.628961 3.8543294 16.712891 3.5058594 C 16.100244 3.2723752 15.409182 3.355343 14.867188 3.7285156 C 14.448635 4.0163534 14.306763 4.5143523 14.197266 5 L 9.8027344 5 C 9.6928169 4.5147837 9.5518548 4.0163226 9.1347656 3.7285156 C 8.8636418 3.5414302 8.5541647 3.4265897 8.2363281 3.3886719 z M 8 5.375 C 8 6.2610628 8.7389372 7 9.625 7 L 14.373047 7 C 15.257904 7 15.998928 6.2596472 16 5.375 L 16.001953 5.375 C 16.788319 5.6741308 17.79628 6.1579204 18.5625 6.7675781 C 18.58015 6.7895071 18.877477 7.1898224 19.150391 7.7792969 C 19.429239 8.3815902 19.733786 9.1844586 20.009766 10.091797 C 20.546111 11.855141 20.948842 14.026311 20.972656 15.992188 C 20.490724 16.743136 19.60263 17.332859 18.65625 17.695312 C 17.804404 18.021562 17.097701 18.106186 16.736328 18.146484 L 16.273438 17.269531 C 16.616654 17.168826 16.957602 17.069914 17.320312 16.947266 A 1.0001 1.0001 0 1 0 16.679688 15.052734 C 12.849602 16.34789 10.965085 16.349225 7.3339844 15.058594 A 1.0001 1.0001 0 0 0 6.9414062 14.996094 A 1.0001 1.0001 0 0 0 6.6660156 16.941406 C 7.0298926 17.070746 7.3750462 17.176206 7.7207031 17.28125 L 7.2636719 18.146484 C 6.9025364 18.106234 6.1955688 18.021456 5.34375 17.695312 C 4.3973996 17.332975 3.5097566 16.745657 3.0273438 15.994141 C 3.0509129 14.027751 3.4522238 11.856178 3.9863281 10.09375 C 4.261069 9.1871651 4.5637131 8.3873003 4.8398438 7.7871094 C 5.1096316 7.2007049 5.4070693 6.8013834 5.4160156 6.7871094 C 6.1966698 6.1664912 7.2108742 5.6768865 8 5.375 z M 9.0390625 9.9960938 C 8.2100625 9.9960938 7.5390625 10.889188 7.5390625 11.992188 C 7.5390625 13.095188 8.2100625 13.988281 9.0390625 13.988281 C 9.8680625 13.988281 10.539062 13.095188 10.539062 11.992188 C 10.521062 10.889187 9.8710625 9.8860938 9.0390625 9.9960938 z M 14.996094 10.011719 A 1.5 2 0 0 0 14.996094 14.011719 A 1.5 2 0 0 0 14.996094 10.011719 z"
                    />
                  </svg>
                </span>
                <span>Discord</span>
                <svg
                  width={12}
                  height={12}
                  className="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 11H37V29"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="butt"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M11.5439 36.4559L36.9997 11"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="butt"
                    strokeLinejoin="bevel"
                  />
                </svg>
              </a>
            </li>
            {/* <li>
              <a
                href="https://opencollective.com/daisyui"
                target="_blank"
                rel="noopener noreferrer"
                className="group   "
              >
                <span>
                  <svg
                    width={18}
                    className="h-5 w-5"
                    height={18}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="butt"
                      strokeLinejoin="bevel"
                    />
                  </svg>
                </span>
                <span>Support daisyUI</span>
                <svg
                  width={12}
                  height={12}
                  className="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 11H37V29"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="butt"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M11.5439 36.4559L36.9997 11"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="butt"
                    strokeLinejoin="bevel"
                  />
                </svg>
              </a>
            </li> */}
          </ul>
          <div className="bg-base-100 pointer-events-none sticky bottom-0 flex h-40 [mask-image:linear-gradient(transparent,#000000)]" />
        </aside>
      </div>
    </>
  );
}
