import React, { useState, useEffect, useRef } from "react";
import { AiOutlineDown } from "react-icons/ai";

const CustomSelect = ({ options, value, onChange, className, width }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelected(option.value);
    setIsOpen(false);
    onChange(option.value);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
      style={{ width: width || "100%" }}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}>
      <div
        className="p-2 bg-[#333] border border-[#444] rounded-md flex justify-between items-center cursor-pointer hover:bg-[#444] transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}>
        <span className="text-white">{options.find((opt) => opt.value === selected)?.label || "Select..."}</span>
        <AiOutlineDown className="text-white transition-transform duration-200" />
      </div>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-[#333] border border-[#444] rounded-md max-h-40 overflow-auto z-10 transition-transform duration-300 shadow-lg">
          {options.map((option, index) => (
            <li
              key={index}
              className={`p-2 text-white hover:bg-[#444] cursor-pointer transition-colors duration-200 ${
                selected === option.value ? "font-bold" : ""
              }`}
              onClick={() => handleOptionClick(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
