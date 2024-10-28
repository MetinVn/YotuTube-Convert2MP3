import { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Input = forwardRef(({ className, type = "text", password = false, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="max-w-3xl w-full my-2 relative flex items-center">
      <input
        autoComplete="true"
        ref={ref}
        type={password && showPassword ? "text" : type}
        className={`w-full p-2 pr-10 rounded-md border text-white outline-none transition-colors duration-300 ${className}`}
        value={inputValue}
        onChange={handleChange}
        {...props}
      />
      {password && (
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          type="button"
          onClick={handleTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-[#444] text-white transition-all duration-300 p-1 rounded-full">
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      )}
    </div>
  );
});

export default Input;
