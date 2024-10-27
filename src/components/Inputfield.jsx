import { forwardRef, useState } from "react";

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
    <div className="max-w-3xl w-full my-2 flex justify-center items-center">
      <input
        autoComplete="true"
        ref={ref}
        type={password && showPassword ? "text" : type}
        className={`w-full p-2 rounded-md border text-white outline-none transition-colors duration-300 ${className}`}
        value={inputValue}
        onChange={handleChange}
        {...props}
      />
      {password && (
        <button
          children={showPassword ? "Hide" : "Show"}
          aria_label={showPassword ? "Hide password" : "Show password"}
          type="button"
          onClick={handleTogglePassword}
          className="px-3 mx-[-5px] py-[9px] rounded-l-none rounded-r-md bg-[#4CAF50] hover:bg-[#388E3C] text-white transition-all duration-300"
        />
      )}
    </div>
  );
});

export default Input;
