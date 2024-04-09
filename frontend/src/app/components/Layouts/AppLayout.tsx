"use client";
import { ReactNode, useContext } from "react";
import NavBar from "../Navbar/NavBar";
import SideBar from "../Sidebar/SideBar";
import AppFooter from "../Footer/AppFooter";
import { ThemeContext } from "@/app/contexts/ThemeContext";
type Props = {
  children: ReactNode;
};
export default function AppLayout({ children }: Props) {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div
        className="bg-base-100 drawer lg:drawer-open max-w-screen"
        data-theme={theme}
      >
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <NavBar />
          <div className="grid grid-cols-7 lg:grid-cols-8 gap-1 max-w-full px-6 pb-6">
            <div className="col-span-7">{children}</div>
          </div>
        </div>
        <SideBar />
      </div>
    </>
  );
}
