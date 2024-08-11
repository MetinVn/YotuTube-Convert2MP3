const Button = ({
  onClick = () => {},
  children = null,
  className = "",
  ariaLabel = "",
}) => {
  // Use a fallback for aria-label if none is provided and handle children being null
  const accessibleLabel =
    ariaLabel || (typeof children === "string" ? children : "Button");

  return (
    <button
      aria-label={accessibleLabel}
      onClick={onClick}
      className={`px-4 py-2 rounded transition-colors duration-300 ${className}`}>
      {children}
    </button>
  );
};

export default Button;
