import { useEffect, useRef, useState } from "react";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import Button from "./Button";

const ThemeDropdown = ({ currentTheme, onChange }) => {
  const dropDownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutsideThemeMenu = (e) => {
    const target = e.target;
    if (dropDownRef.current && !dropDownRef.current.contains(target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleClickOutsideThemeMenu);
    document.addEventListener("mousedown", handleClickOutsideThemeMenu);
    return () => {
      document.removeEventListener("touchstart", handleClickOutsideThemeMenu);
      document.removeEventListener("mousedown", handleClickOutsideThemeMenu);
    };
  }, []);

  const handleSelect = (theme) => {
    onChange(theme);
    setIsOpen(false);
  };

  return (
    <div ref={dropDownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded  text-[#4CAF50] flex items-center space-x-2">
        {currentTheme === "light" && (
          <FaSun className="fill-[#4CAF50]" size={22} />
        )}
        {currentTheme === "dark" && (
          <FaMoon className="fill-[#4CAF50]" size={22} />
        )}
        {currentTheme === "system" && (
          <FaDesktop className="fill-[#4CAF50]" size={22} />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-[#333] rounded shadow-lg w-48">
          <div className="flex flex-col">
            <Button
              children={
                <div className="flex items-center space-x-2">
                  <FaSun className="fill-[#4CAF50]" size={22} />
                  <span className="text-sm text-gray-300">Light Mode</span>
                </div>
              }
              type="button"
              onClick={() => handleSelect("light")}
              className="p-2 flex items-center space-x-2 hover:bg-[#444] rounded"
            />
            <Button
              children={
                <div className="flex items-center space-x-2">
                  <FaMoon className="fill-[#4CAF50]" size={22} />
                  <span className="text-sm text-gray-300">Dark Mode</span>
                </div>
              }
              type="button"
              onClick={() => handleSelect("dark")}
              className="p-2 flex items-center space-x-2 hover:bg-[#444] rounded"
            />
            <Button
              children={
                <div className="flex items-center space-x-2">
                  <FaDesktop className="fill-[#4CAF50]" size={22} />
                  <span className="text-sm text-gray-300">System Default</span>
                </div>
              }
              onClick={() => handleSelect("system")}
              type="button"
              className="p-2 flex items-center space-x-2 hover:bg-[#444] rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeDropdown;
