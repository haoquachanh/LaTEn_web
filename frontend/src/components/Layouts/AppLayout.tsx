"use client";
import { ReactNode, useContext } from "react";
import NavBar from "../Navbar/NavBar";
import SideBar from "../Sidebar/SideBar";
import { ThemeContext } from "@/contexts/ThemeContext";
type Props = {
  children: ReactNode;
};
export default function AppLayout({ children }: Props) {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div
        className="bg-base-100 drawer lg:drawer-open w-full max-w-screen"
        data-theme={theme}
      >
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <NavBar />
          <div className="flex flex-row lg:ml-80">
            <div className="flex flex-row flex-wrap lg:mx-20 px-6">
              {children}
            </div>
          </div>
        </div>
        <SideBar />
      </div>
    </>
  );
}
