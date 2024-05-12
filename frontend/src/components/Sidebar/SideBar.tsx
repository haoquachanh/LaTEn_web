/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { navLinks, socialLinks } from '@/utils/navLink';
import { SocialIcon } from '../Icons';

export default function SideBar() {
  return (
    <div className="z-40 h-full drawer-side" style={{ scrollBehavior: 'smooth', scrollPaddingTop: '5rem' }}>
      <label htmlFor="drawer" className="drawer-overlay" aria-label="Close menu" />
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
            <img src="/LaTEn.png" className="!py-1 w-auto h-24" alt="Logo"></img>
          </Link>
        </div>
        <div className="h-4" />
        <div className="flex flex-col justify-between h-screen">
          <ul className="px-4 menu">
            {navLinks.map((item, index) => (
              <li key={index} className="my-2">
                <Link href={item.href} className="group">
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 menu flex flex-row justify-center space-x-5 mb-5">
            <SocialIcon kind="mail" href={`mailto:${socialLinks.email}`} size={6} />
            <SocialIcon kind="github" href={socialLinks.github} size={6} />
            <SocialIcon kind="facebook" href={socialLinks.facebook} size={6} />
            <SocialIcon kind="youtube" href={socialLinks.youtube} size={6} />
            <SocialIcon kind="linkedin" href={socialLinks.linkedin} size={6} />
            <SocialIcon kind="twitter" href={socialLinks.twitter} size={6} />
            <SocialIcon kind="instagram" href={socialLinks.instagram} size={6} />
            <SocialIcon kind="threads" href={socialLinks.threads} size={6} />
          </div>
        </div>
      </aside>
    </div>
  );
}
