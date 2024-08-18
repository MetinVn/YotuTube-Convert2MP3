const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] text-white py-2 px-4 border-t-2 border-[#333]">
      <div className="container mx-auto space-y-2">
        {/* Top Section: About & Buy Me a Coffee + Description */}
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* About Section */}
          <div className="flex-1 p-4">
            <h4 className="text-lg text-left font-semibold mb-3">About</h4>
            <p className="text-sm">
              MP3 Converter is a web app that lets you convert YouTube videos to
              MP3 and MP4 formats easily. Listen to your MP3 files with an
              embedded player before downloading.
            </p>
          </div>

          {/* Supporting My Development Section */}
          <div className="flex-1 text-center p-4">
            <h4 className="text-lg text-left font-semibold mb-3">
              Supporting My Development
            </h4>
            <p className="text-sm mb-4">
              This project is built and maintained by a solo developer, and it's
              hosted for free. If you find this tool useful, consider supporting
              its ongoing development by buying me a coffee. Your support helps
              keep the project alive and thriving.
            </p>
            <a
              href="https://www.buymeacoffee.com/MetinVn"
              className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-yellow-400 transition"
              target="_blank"
              rel="noopener noreferrer">
              Buy Me a Coffee
            </a>
          </div>
        </div>

        {/* Middle Section: Quick Links */}
        <div className="text-center ">
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="text-sm flex flex-wrap justify-center space-x-4">
            <li>
              <a
                href="https://www.linkedin.com/in/metin-isahanli-217374266/"
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer">
                Linkedin
              </a>
            </li>
            <li>
              <a
                href="https://github.com/yourusername"
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a
                href="mailto:misaxanli@gmail.com"
                className="text-blue-400 hover:underline"
                title="Contact Us">
                Email
              </a>
            </li>

            <li>
              <a
                href="https://www.flaticon.com/free-icons/convert"
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                title="convert icons">
                Credits
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-center border-t-2 border-[#333] pt-1">
          <p className="text-sm">
            Made with ❤️ by{" "}
            <a
              href="https://metinvn.github.io/ReactJS-TailwindCSS-Portfolio/"
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer">
              Metin Isakhanli
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
