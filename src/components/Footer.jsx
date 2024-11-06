import { Link } from "react-router-dom";
import black_image from "../images/black-button.png";

const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t-2 border-[#333] bg-[#1E1E1E] text-white">
      <div className="container mx-auto space-y-8">
        {/* About Section */}
        <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-1 p-2">
            <h1 className="text-lg font-semibold mb-2 text-green-500">About</h1>
            <p className="text-sm text-justify">
              YouTube Converter is a web app that lets you effortlessly convert YouTube videos into MP3 and MP4 formats,
              leveraging third-party APIs for seamless processing.
            </p>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0 md:space-x-8 border-t-2 border-t-[#333] pt-6">
          <div className="flex items-center space-x-6">
            <h1 className="text-base font-semibold text-green-500">Quick Links</h1>
            <ul className="flex flex-wrap space-x-4 text-xs">
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
              {/* Portfolio Link */}
              <li>
                <Link
                  to="https://metinvn.github.io/ReactJS-TailwindCSS-Portfolio/"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Visit My Portfolio">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Donation Section */}
        <div className="text-center text-xs opacity-70 hover:opacity-100 transition-opacity duration-300 mt-8">
          <p className="mb-2 text-justify">
            If you’d like to support the development of this project out of grace or simply wish to contribute, you can
            click the logo below to donate. Your support, big or small, is always appreciated!
          </p>
          <Link to="https://www.buymeacoffee.com/MetinVn" target="_blank" className="flex justify-center mx-auto">
            <img src={black_image} alt="Buy Me a Coffee" style={{ height: "30px", width: "120px" }} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
