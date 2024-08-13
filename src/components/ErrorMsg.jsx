const ErrorMessage = ({ message, isVisible }) => {
  return (
    <span
      className={`block text-[#FF5252] bg-[#ffe6e6] p-2 rounded mt-2 dark:text-[#FF5252] dark:bg-[#2E1E1E] transition-colors duration-300 ${
        !isVisible ? "hidden" : ""
      }`}>
      {message}
    </span>
  );
};

export default ErrorMessage;
