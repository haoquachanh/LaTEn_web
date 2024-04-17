"use client";
import Link from "next/link";
import { navLinks, socialLinks } from "@/utils/navLink";
import { menuIcons, socialIcons } from "@/utils/IconRender";

export default function SideBar() {
  return (
    <div
      className="z-40 h-full drawer-side"
      style={{ scrollBehavior: "smooth", scrollPaddingTop: "5rem" }}
    >
      <label
        htmlFor="drawer"
        className="drawer-overlay"
        aria-label="Close menu"
      />
      <aside className="fixed flex flex-col border-e-2 border-spacing-8 bg-base-100 py-4 border-black/10 w-80 h-screen min-h-screen">
        <div
          data-sveltekit-preload-data=""
          className="top-0 z-20 sticky flex justify-center items-center gap-2 bg-base-100 bg-opacity-90 backdrop-blur px-4 pt-2 w-full"
        >
          <Link
            href="/"
            aria-current="page"
            aria-label="Homepage"
            className="flex justify-center align-middle"
            data-svelte-h="svelte-nce89e"
          >
            <img
              src="/LaTEn.png"
              className="!py-1 w-auto h-24"
              alt="Logo"
            ></img>
          </Link>
        </div>
        <div className="h-4" />
        <div className="flex flex-col justify-between h-screen">
          <ul className="px-4 menu">
            {navLinks.map((item, index) => (
              <li key={index} className="my-2">
                <Link href={item.href} className="group">
                  {menuIcons[index]}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            {/* Social links */}
          </ul>
          <ul className="px-4 menu">
            <li />
            {socialLinks.map((item, index) => (
              <li key={index} className="my-2">
                <Link href={item.href} target="_blank" className="group">
                  {socialIcons[index]}
                  <span>{item.name}</span>
                  <svg
                    width="12"
                    height="12"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 11H37V29"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="butt"
                      strokeLinejoin="bevel"
                    ></path>
                    <path
                      d="M11.5439 36.4559L36.9997 11"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="butt"
                      strokeLinejoin="bevel"
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
