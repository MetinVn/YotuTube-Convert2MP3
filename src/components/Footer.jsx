import { Link } from "react-router-dom";
import black_image from "../images/black-button.png";

const Footer = () => {
  return (
    <footer className="py-1 px-2 border-t-2 border-[#333] bg-[#1E1E1E] text-white duration-300">
      <div className="container mx-auto space-y-2">
        {/* Top Section: About & Buy Me a Coffee + Description */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* About Section */}
          <div className="flex-1 p-2">
            <h1 className="text-base font-semibold mb-2 text-green-500">About</h1>
            <p className="text-xs text-justify">
              YouTube Converter is a web app that lets you effortlessly convert YouTube videos into MP3 and MP4 formats,
              leveraging third-party APIs for seamless processing.
            </p>
          </div>

          {/* Supporting My Development Section */}
          <div className="flex-1 p-2">
            <h1 className="text-base font-semibold mb-2 text-green-500">Support</h1>
            <p className="text-xs mb-2 text-justify">
              The core conversion functionality of this app depends on third-party APIs, but the design, development,
              and maintenance are managed by a dedicated solo developer. If you consider supporting the project, click
              the logo below.
            </p>

            <Link
              to="https://www.buymeacoffee.com/MetinVn"
              target="_blank"
              className="flex w-fit mx-auto"
              rel="noopener noreferrer">
              <img src={black_image} alt="Buy Me a Coffee" style={{ height: "40px", width: "160px" }} />
            </Link>
          </div>
        </div>

        {/* Middle Section: Quick Links */}
        <div className="text-start flex items-center justify-between border-t-2 border-t-[#333]">
          <div className="flex items-center">
            <h1 className="text-sm font-semibold mr-2 text-green-500">Quick Links</h1>
            <ul className="flex space-x-1 text-xs">
              <li>
                <Link
                  to="https://www.linkedin.com/in/metin-isahanli-217374266/"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Find me on LinkedIn">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  to="https://github.com/MetinVn"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Find me on GitHub">
                  GitHub
                </Link>
              </li>
              <li>
                <Link to="mailto:misaxanli@gmail.com" className="text-blue-400 hover:underline" title="Contact me">
                  Email
                </Link>
              </li>
              <li>
                <Link to="/YouTube-Converter/credits" className="text-blue-400 hover:underline" title="Credits">
                  Credits
                </Link>
              </li>
            </ul>
          </div>
          {/* Bottom Section: Copyright */}
          <p className="text-xs text-end">
            Made with ❤️ by{" "}
            <Link
              to="https://metinvn.github.io/ReactJS-TailwindCSS-Portfolio/"
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              title="Personal portfolio">
              Metin Isakhanli
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
