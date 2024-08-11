export function youtube_parser(url) {
  const regExp =
    /(?:youtu\.be\/|(?:v|e(?:mbed)?)\/|watch\?v=|\/u\/\w\/|embed\/|watch\?.*v=|\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : false;
}
