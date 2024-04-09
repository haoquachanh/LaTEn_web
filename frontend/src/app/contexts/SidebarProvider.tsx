"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface SideBarContextProps {
  isOpen: boolean;
  toggleOpen: () => void;
}

interface Props {
  readonly children: ReactNode;
}
const SideBarContext = createContext<SideBarContextProps>({
  isOpen: true,
  toggleOpen: () => {},
});

function SideBarProvider({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const value = {
    isOpen,
    toggleOpen,
  };

  return (
    <SideBarContext.Provider value={value}>{children}</SideBarContext.Provider>
  );
}

export { SideBarProvider, SideBarContext };
