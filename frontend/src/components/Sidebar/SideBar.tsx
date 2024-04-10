"use client";
import Link from "next/link";
import { navLinks, socialLinks } from "@/helper/navLink";
import { menuIcons, socialIcons } from "@/helper/IconRender";

export default function SideBar() {
  return (
    <div
      className="drawer-side z-40 h-full"
      style={{ scrollBehavior: "smooth", scrollPaddingTop: "5rem" }}
    >
      <label
        htmlFor="drawer"
        className="drawer-overlay"
        aria-label="Close menu"
      />
      <aside className="bg-base-100 min-h-screen w-80 border-e-2 border-spacing-8 border-black/10 h-screen flex flex-col py-4 fixed">
        <div
          data-sveltekit-preload-data=""
          className="bg-base-100 sticky top-0 z-20 items-center gap-2 bg-opacity-90 px-4 pt-2 backdrop-blur flex w-full justify-center"
        >
          <Link
            href="/"
            aria-current="page"
            aria-label="Homepage"
            className="flex align-middle justify-center"
            data-svelte-h="svelte-nce89e"
          >
            <img
              src="/LaTEn.png"
              className="h-24 w-auto !py-1"
              alt="Logo"
            ></img>
          </Link>
        </div>
        <div className="h-4" />
        <div className="flex flex-col h-screen justify-between ">
          <ul className="menu px-4">
            {navLinks.map((item, index) => (
              <li key={index} className="my-2">
                <Link href={item.href} className="group   ">
                  {menuIcons[index]}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            {/* Social links */}
          </ul>
          <ul className="menu px-4">
            <li />
            {socialLinks.map((item, index) => (
              <li key={index} className="my-2">
                <Link href={item.href} target="_blank" className="group   ">
                  {socialIcons[index]}
                  <span>{item.name}</span>
                  <svg
                    width="12"
                    height="12"
                    className="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 11H37V29"
                      stroke="currentColor"
                      stroke-width="4"
                      stroke-linecap="butt"
                      stroke-linejoin="bevel"
                    ></path>
                    <path
                      d="M11.5439 36.4559L36.9997 11"
                      stroke="currentColor"
                      stroke-width="4"
                      stroke-linecap="butt"
                      stroke-linejoin="bevel"
                    ></path>
                  </svg>
                </Link>
              </li>
            ))}
            {/* Social links */}
          </ul>
        </div>
      </aside>
    </div>
  );
}
