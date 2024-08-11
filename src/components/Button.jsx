const Button = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded transition-colors duration-300 ${className}`}>
      {children}
    </button>
  );
};

export default Button;
