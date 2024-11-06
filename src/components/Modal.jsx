import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen = false, onClose = () => {}, paragraph = "", description = "" }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate(null);

  const handleNavigate = () => {
    navigate("/YouTube-Converter/signin");
  };

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black opacity-70 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"></motion.div>

          <motion.div
            ref={modalRef}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-description"
            tabIndex="-1">
            <div className="bg-[#1E1E1E] p-8 rounded-xl shadow-2xl max-w-2xl w-full mx-auto space-y-6 focus:outline-none">
              <h2 id="modal-description" className="text-3xl font-semibold text-white mb-2">
                {description}
              </h2>
              <p className="text-[#ccc] text-lg leading-relaxed">{paragraph}</p>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-[#4CAF50] px-6 py-2 text-white font-medium rounded-md hover:bg-[#388E3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]">
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={handleNavigate}
                  className="bg-[#4CAF50] px-6 py-2 text-white font-medium rounded-md hover:bg-[#388E3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]">
                  Sign in
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
