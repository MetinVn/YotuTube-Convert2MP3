import { forwardRef } from "react";

const Input = forwardRef(({ placeholder, className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      placeholder={placeholder}
      className={`w-full max-w-[350px] p-2 border rounded outline-none transition-colors duration-300 ${className}`}
      {...props}
    />
  );
});

export default Input;
