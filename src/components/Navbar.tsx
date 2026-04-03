import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { changeRole } from "../store/slices/userSlice";
import Button from "./Button";
import Input from "./Input";
import { RiPaletteLine, RiUserLine } from "@remixicon/react";
import { setMode, toggleModal } from "../store/slices/pageSlice";
const Navbar = () => {
  const userRole = useAppSelector((state) => state.user.role);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("default");
  const themes = [
    { name: "default", label: "Default" },
    { name: "accent", label: "Accent" },
    { name: "sunset", label: "Sunset" },
    { name: "ocean", label: "Ocean" },
    { name: "dark", label: "Dark" },
  ];
  const changeTheme = (theme: string) => {
    const root = document.documentElement;
    root.classList.remove(
      "theme-default",
      "theme-accent",
      "theme-sunset",
      "theme-ocean",
      "theme-dark",
    );
    root.classList.add(`theme-${theme}`);
    setSelectedTheme(theme);
    setIsOpen(false);
  };
  const toggleUser = () => {
    dispatch(changeRole());
  };
  return (
    <nav className="rounded-md p-1 flex bg-neutral-50 justify-around items-center ">
      <section className="flex w-full gap-3 items-center p-3 bg-neutral-100">
        <Input
          onClick={() => {
            dispatch(setMode("search"));
            dispatch(toggleModal());
          }}
          variant="search"
          placeholder="Search any transaction"
          className="hidden max-w-100 w-full md:flex lg:flex"
        />
        <Button
          type="ghost"
          text="user"
          onClick={() => {
            if (userRole !== "user") toggleUser();
          }}
          clicked={userRole === "user"}
        />
        <Button
          type="ghost"
          text="admin"
          onClick={() => {
            if (userRole !== "admin") toggleUser();
          }}
          clicked={userRole === "admin"}
        />
      </section>

      <section className="flex   justify-end text-primary-500 items-center gap-6 p-3 ">
        <div className="relative">
          <RiPaletteLine
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer"
          />
          {isOpen && (
            <div className="absolute top-full right-0 bg-neutral-50 border border-neutral-200 rounded shadow p-2 z-10 w-52">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => changeTheme(theme.name)}
                  title={theme.label}
                  className={`w-full text-left rounded-lg p-2 hover:bg-neutral-100 focus:outline-none ${theme.name === "default" ? "theme-default" : `theme-${theme.name}`} ${selectedTheme === theme.name ? "ring-2 ring-primary-500" : ""}`}
                  aria-label={theme.label}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="grid grid-cols-4 gap-2">
                      {["primary", "secondary", "tertiary", "neutral"].map(
                        (color) => (
                          <span
                            key={color}
                            className="w-4 h-4 rounded-full border border-neutral-200"
                            style={{
                              backgroundColor: `rgb(var(--${color}-500))`,
                            }}
                          />
                        ),
                      )}
                    </div>
                    <span className="sr-only">{theme.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <RiUserLine />
      </section>
    </nav>
  );
};

export default Navbar;
