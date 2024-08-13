import Button from "./Button";

const ResultLink = ({ href, title }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this MP3: ${title}`,
          url: href,
        });
      } catch (error) {
        console.error("Error sharing the link:", error);
      }
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  return (
    <div className="flex justify-between items-center gap-4">
      <a
        href={href}
        download
        className="text-[#4CAF50] underline"
        target="_self"
        rel="noopener noreferrer">
        {title}
      </a>
      <Button
        ariaLabel="Share"
        children={null}
        onClick={handleShare}
        className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
        Share
      </Button>
    </div>
  );
};

export default ResultLink;
