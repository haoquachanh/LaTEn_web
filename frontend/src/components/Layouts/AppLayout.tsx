'use client';
import { ReactNode, useContext } from 'react';
import NavBar from '../Navbar/NavBar';
import SideBar from '../Sidebar/SideBar';
import { ThemeContext } from '@/contexts/ThemeContext';
import FeedbackCom from '../Feedback/FeedbackCom';
type Props = {
  children: ReactNode;
};
export default function AppLayout({ children }: Props) {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <body className="w-full lg:h-full" data-theme={theme}>
        <div className="bg-base-100 drawer lg:drawer-open w-full max-w-screen lg:h-full min-h-screen">
          <input id="drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content h-full">
            <NavBar />
            <div className="flex flex-row lg:ml-80 lg:h-[calc(100vh-4rem)]">
              <div className="flex mx-5 lg:mx-20 xl:mr-64 w-full lg:h-full">{children}</div>
            </div>
          </div>
          <SideBar />
        </div>
      </body>
    </>
  );
}
