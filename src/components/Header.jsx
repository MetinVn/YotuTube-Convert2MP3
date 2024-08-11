import { useEffect, useState } from "react";
import { setDarkMode, setLightMode } from "./Themes";
import { getTheme, saveTheme } from "../utils/IndexedDB";

const Header = () => {
  const [systemTheme, setSystemTheme] = useState("light");

  useEffect(() => {
    const applySavedTheme = async () => {
      const savedTheme = await getTheme();
      if (savedTheme) {
        if (savedTheme === "dark") {
          setDarkMode();
          setSystemTheme("dark");
        } else {
          setLightMode();
          setSystemTheme("light");
        }
      } else {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setSystemTheme(mediaQuery.matches ? "dark" : "light");

        const handleChange = (e) => {
          setSystemTheme(e.matches ? "dark" : "light");
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
    <div className="fixed top-2 w-full flex justify-center gap-4 mb-4">
      <button
        onClick={handleLightMode}
        className="px-3 py-1 rounded dark:text-[#4CAF50] hover:bg-[#999] dark:hover:bg-[#333] transition-colors duration-300">
        Light Mode
      </button>
      <button
        onClick={handleDarkMode}
        className="px-3 py-1 rounded dark:text-[#4CAF50] hover:bg-[#999] dark:hover:bg-[#333] transition-colors duration-300">
        Dark Mode
      </button>
      <button
        onClick={handleSystemTheme}
        className="px-3 py-1 rounded dark:text-[#4CAF50] hover:bg-[#999] dark:hover:bg-[#333] transition-colors duration-300">
        Prefer system theme
      </button>
    </div>
  );
};

export default Header;
