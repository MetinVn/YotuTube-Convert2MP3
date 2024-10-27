import React from "react";

const Button = ({
  onClick = () => {},
  type = "button",
  children = null,
  aria_label = null,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      disabled={disabled}
      title={aria_label || ""}
      aria-label={aria_label || ""}
      type={type}
      onClick={onClick}
      className={`rounded-md transition-all duration-300 ${className}`}>
      {children}
    </button>
  );
};

export default Button;
