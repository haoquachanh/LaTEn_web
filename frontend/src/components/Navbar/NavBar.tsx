import { useContext } from "react";
import AfterLoggin from "./AfterLogin";
import BeforeLogin from "./BeforeLogin";
import ChangeLang from "./ChangeLang";
import ChangeTheme from "./ChangeTheme";
import { AuthContext } from "@/contexts/AuthContext";

export default function NavBar() {
  const { loggedIn } = useContext(AuthContext);
  return (
    <>
      <div className="top-0 z-30 sticky flex justify-center bg-base-100 bg-opacity-90 backdrop-blur w-full h-16 text-base-content">
        <nav className="w-full navbar">
          <div className="flex flex-1">
            <span
              className="tooltip-bottom before:content-[attr(data-tip)] before:text-xs tooltip"
              data-tip="Menu"
            >
              <label
                aria-label="Open menu"
                htmlFor="drawer"
                className="lg:hidden btn btn-ghost btn-square drawer-button"
              >
                <svg
                  width={20}
                  height={20}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 md:w-6 h-5 md:h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </span>
          </div>
          <div className="flex-row flex-0">
            <ChangeTheme />
            <ChangeLang />
            {loggedIn ? <AfterLoggin /> : <BeforeLogin />}
          </div>
        </nav>
      </div>
    </>
  );
}
