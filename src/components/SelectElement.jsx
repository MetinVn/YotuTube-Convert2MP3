import React from "react";

const Select = ({ onChange, value, options, className }) => {
  return (
    <select
      onChange={onChange}
      value={value}
      className={`p-2 rounded outline-none bg-[#f9f9f9] text-[#333] dark:bg-[#333] dark:text-white transition-colors duration-300 ${className}`}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
