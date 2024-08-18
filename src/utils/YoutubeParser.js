export const youtube_parser = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be)(?:\/(watch)?\?v=|\/embed\/|\/v\/|\/)([^\s&?\/]{11})/;
  const match = url.match(regex);
  return match ? match[2] : null;
};
