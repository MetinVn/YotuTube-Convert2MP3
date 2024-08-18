import { useEffect } from "react";

import { setDarkMode, setLightMode } from "../functions/Themes";

import { getTheme, saveTheme } from "../utils/IndexedDB";

const Header = () => {
  useEffect(() => {
    const applySavedTheme = async () => {
      const savedTheme = await getTheme();
      if (savedTheme) {
        if (savedTheme === "dark") {
          setDarkMode();
        } else {
          setLightMode();
        }
      } else {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const currentSystemTheme = mediaQuery.matches ? "dark" : "light";
        if (currentSystemTheme === "dark") {
          setDarkMode();
        } else {
          setLightMode();
        }

        const handleChange = (e) => {
          if (e.matches) {
            setDarkMode();
          } else {
            setLightMode();
          }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
    };

    applySavedTheme();
  }, []);

  const handleSystemTheme = () => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const currentSystemTheme = mediaQuery.matches ? "dark" : "light";

    if (currentSystemTheme === "dark") {
      setDarkMode();
      saveTheme("dark");
    } else {
      setLightMode();
      saveTheme("light");
    }
  };

  const handleLightMode = () => {
    setLightMode();
    saveTheme("light");
  };

  const handleDarkMode = () => {
    setDarkMode();
    saveTheme("dark");
  };

  return (
    <div className="fixed text-xs sm:text-sm md:text-lg top-5 right-0 md:top-2 flex justify-end md:justify-center gap-0 md:gap-4 mb-4">
      <button
        onClick={handleLightMode}
        className="px-2 md:px-3 py-1 rounded dark:text-[#4CAF50] hover:bg-[#999] dark:hover:bg-[#333] transition-colors duration-300">
        Light mode
      </button>
      <button
        onClick={handleDarkMode}
        className="px-2 md:px-3 py-1 rounded dark:text-[#4CAF50] hover:bg-[#999] dark:hover:bg-[#333] transition-colors duration-300">
        Dark mode
      </button>
      <button
        onClick={handleSystemTheme}
        className="px-2 md:px-3 py-1 rounded dark:text-[#4CAF50] hover:bg-[#999] dark:hover:bg-[#333] transition-colors duration-300">
        Prefer system theme
      </button>
    </div>
  );
};

export default Header;
