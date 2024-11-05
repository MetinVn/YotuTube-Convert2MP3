import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutsideMenu = (e) => {
    const target = e.target;
    if (menuRef.current && !menuRef.current.contains(target)) {
      setIsMenuOpen(false);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleClickOutsideMenu);
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("touchstart", handleClickOutsideMenu);
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  const dashboardFeatures = [
    {
      name: "Main Menu",
      description: "Convert Youtube links",
      linkTo: "/YotuTube-Convert2MP3/",
    },
    {
      name: "Check out MP3 list",
      description: "Listen to your converted music",
      linkTo: "/YotuTube-Convert2MP3/music-list",
    },
  ];

  const dashboardBugReport = [
    {
      name: "Report a Bug",
      description: "Help us improve by reporting any issues.",
      linkTo: "/YotuTube-Convert2MP3/bug-report",
    },
  ];

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 pt-5 bg-[#1E1E1E] h-screen transition-all ease-in-out duration-300 ${
        isMenuOpen ? "w-[320px] border-r border-r-[#4CAF50]" : "w-0 overflow-hidden"
      } z-[9999]`}>
      {" "}
      <div className="fixed top-2 left-2 z-[10000]">
        <Button
          children={<FiMenu className="stroke-[#4CAF50]" size={25} />}
          type="button"
          onClick={handleMenuToggle}
          className="px-3 py-2 bg-[#333] hover:bg-[#4d4d4d] active:bg-[#6e6e6e]"
          aria_label="Burger Menu"
        />
      </div>
      <div
        className={`absolute h-full overflow-y-auto w-full overflow-x-hidden py-10 max-w-[1000px] mx-auto p-4 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        }`}>
        {isMenuOpen && (
          <div className="mt-5">
            <section className="text-sm">
              <p className="text-white text-base sm:text-xl">Features</p>
              <hr className="my-3" />
              <ul className="space-y-3">
                {dashboardFeatures.map((link, index) => (
                  <li
                    key={index}
                    className="p-2 border rounded bg-[#333] border-[#444] transition-colors duration-300 hover:bg-[#444]">
                    <Link to={link.linkTo} className="block hover:underline text-[#4CAF50]">
                      <h3 className="font-semibold">{link.name}</h3>
                      <p className="text-gray-400 text-sm">{link.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-5 text-sm">
              <p className="text-white text-base sm:text-xl">Bug report</p>
              <hr className="my-3" />
              <ul className="space-y-3">
                {dashboardBugReport.map((link, index) => (
                  <li
                    key={index}
                    className="p-2 border rounded bg-[#333] border-[#444] transition-colors duration-300 hover:bg-[#444]">
                    <Link to={link.linkTo} className="block hover:underline text-[#4CAF50]">
                      <h3 className="font-semibold">{link.name}</h3>
                      <p className="text-gray-400 text-sm">{link.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
