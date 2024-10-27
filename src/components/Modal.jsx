import React from "react";
import { Transition } from "@headlessui/react";
import Button from "./Button";

const Modal = ({
  isOpen = null,
  onClose = () => {},
  children = "",
  description = "",
}) => {
  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0">
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="fixed inset-0 bg-black opacity-60"
          onClick={onClose}></div>
        <div className="bg-[#1E1E1E] p-8 rounded-lg shadow-lg relative z-10 max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4 text-white">{description}</h2>
          <p className="mb-4 text-[#ccc]">{children}</p>
          <Button
            type="button"
            onClick={onClose}
            className="bg-[#4CAF50] text-white hover:bg-[#388E3C] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]">
            Close
          </Button>
        </div>
      </div>
    </Transition>
  );
};

export default Modal;
