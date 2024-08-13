import React from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#1E1E1E] text-[#333] dark:text-white rounded-lg shadow-lg max-w-[500px] w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            🎉 You've Unlocked Something Special! 🎉
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#333] dark:text-white hover:text-red-500 transition-colors duration-200">
            ✕
          </button>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
