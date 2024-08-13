const Footer = () => {
  return (
    <footer className="flex justify-between items-center p-4 bg-[#1E1E1E] border-t-2 border-[#333] text-white">
      <div className="flex flex-col items-center flex-grow">
        <p className="text-sm mb-2 text-center">
          © 2024 MP3 Converter. All rights reserved.
        </p>
        <p className="text-sm text-center">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/metinVn"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer">
            Metin Isakhanli
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
