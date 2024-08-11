import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Button from "./Button";
import { FiMenu } from "react-icons/fi";
import { clearMP3Store } from "../utils/IndexedDB";
const Dashboard = ({ mp3List, setMp3List, toast, ToastContainer }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClearList = async () => {
    if (Object.keys(mp3List).length === 0) {
      toast.info("The list is already empty.");
    } else {
      await clearMP3Store();
      setMp3List({});
      toast.info("List cleared.");
    }
  };

  const handleDownload = (url) => {
    window.open(url, "_blank");
    toast.success("Downloading...");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`fixed top-2 left-2 h-screen overflow-hidden ${
        isMenuOpen ? "w-72" : "w-0"
      } transition-all duration-300 bg-white dark:bg-[#1E1E1E]`}>
      <motion.div
        initial={{ x: -80 }}
        animate={{ x: isMenuOpen ? 64 : 0 }}
        transition={{ duration: 0.5 }}
        className="z-50 fixed top-2 left-2">
        <Button
          children={null}
          onClick={handleMenuToggle}
          ariaLabel="Burger Menu"
          className="px-3 py-1 rounded bg-[#4CAF50] text-white hover:bg-[#388E3C] dark:bg-[#333] dark:text-[#4CAF50] dark:hover:bg-[#555] transition-colors duration-300">
          <FiMenu size={24} />
        </Button>
      </motion.div>
      <div
        className={`w-full h-full overflow-y-scroll overflow-x-hidden py-10 max-w-[1000px] mx-auto mt-4 p-4 ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}>
        <h1 className="text-2xl font-bold text-[#333] dark:text-white mb-4">
          MP3 Dashboard
        </h1>
        {Object.keys(mp3List).length === 0 ? (
          <p className="text-lg text-[#666] dark:text-[#ccc]">List is empty</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {Object.keys(mp3List).map((key) => (
              <li
                key={key}
                className="flex justify-between items-center p-2 border rounded bg-[#f9f9f9] dark:bg-[#333] dark:border-[#444]">
                <span className="text-[#333] dark:text-white">
                  {mp3List[key].title}
                </span>
                <div>
                  <Button
                    ariaLabel="Download"
                    children={null}
                    onClick={() => handleDownload(key)}
                    className="px-1 py-1 bg-[#4CAF50] text-white hover:bg-[#388E3C] dark:bg-[#555] dark:text-[#4CAF50] dark:hover:bg-[#777]">
                    Download
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <Button
            ariaLabel="Clear List"
            children={null}
            onClick={handleClearList}
            className=" py-[4px] bg-[#FF5252] text-white hover:bg-[#E63946] dark:bg-[#555] dark:text-[#FF5252] dark:hover:bg-[#777]">
            Clear List
          </Button>
        </div>
      </div>
      <div>{ToastContainer}</div>
    </div>
  );
};

export default Dashboard;
