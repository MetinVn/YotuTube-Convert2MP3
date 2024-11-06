import React, { useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import Button from "./Button";

const Modal = ({ isOpen = false, onClose = () => {}, paragraph = "", description = "" }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Transition
      show={isOpen}
      enter="transition ease-out duration-300 transform"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-200 transform"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95">
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-60" onClick={onClose} aria-hidden="true"></div>

        <div
          ref={modalRef}
          className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg relative z-10 max-w-lg mx-auto focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-description"
          tabIndex="-1">
          <h2 id="modal-description" className="text-2xl font-semibold mb-4 text-white">
            {description}
          </h2>
          <p className="mb-6 text-[#ccc] text-base leading-relaxed">{paragraph}</p>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="bg-[#4CAF50] px-4 py-2 text-white hover:bg-[#388E3C] rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Modal;
