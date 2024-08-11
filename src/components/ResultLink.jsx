const ResultLink = ({ href, title }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      className="block mt-4 text-[#4CAF50] underline">
      Download {title}
    </a>
  );
};

export default ResultLink;
