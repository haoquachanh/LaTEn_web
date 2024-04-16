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
      <body className="w-full h-screen" data-theme={theme}>
        <div className="bg-base-100 drawer lg:drawer-open w-full max-w-screen">
          <input id="drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <NavBar />
            <div className="flex flex-row lg:ml-80">
              <div className="mx-auto lg:mx-20 lg:mr-64 w-full">{children}</div>
            </div>
          </div>
          <SideBar />
        </div>
      </body>
    </>
  );
}
