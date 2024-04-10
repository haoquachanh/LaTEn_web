// components/ParentComponent.js

import React from "react";

// Định nghĩa kiểu cho object iconPaths
interface IconPaths {
  [key: string]: JSX.Element;
}

const menuItems = [
  { href: "/docs/changelog/", icon: "changelog", text: "Changelog" },
  {
    href: "https://v3.daisyui.com/",
    icon: "changelog",
    text: "Version 3.x",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    href: "https://v2.daisyui.com/",
    icon: "changelog",
    text: "Version 2.x",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    href: "https://v1.daisyui.com/",
    text: "Version 1.x",
    target: "_blank",
    rel: "noopener noreferrer",
    icon: "changelog",
  },
  { href: "/docs/roadmap/", icon: "roadmap", text: "Roadmap" },
];

const iconPaths: IconPaths = {
  changelog: (
    <svg
      width={14}
      height={14}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Path for changelog icon */}
    </svg>
  ),
  roadmap: (
    <svg
      width={14}
      height={14}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Path for roadmap icon */}
    </svg>
  ),
};

const ParentComponent = () => {
  const renderMenuItems = () => {
    return menuItems.map((item, index) => (
      <li key={index}>
        <a href={item.href} target={item.target} rel={item.rel}>
          {iconPaths[item.icon]}
          {/* Render the icon */}
          {item.text}
        </a>
      </li>
    ));
  };

  return (
    <ul
      tabIndex={0}
      className="dropdown-content menu menu-sm bg-base-200 rounded-box mt-7 w-36 border border-white/5 p-2 shadow-2xl outline outline-1 outline-black/5"
    >
      {renderMenuItems()}
    </ul>
  );
};

export default ParentComponent;
