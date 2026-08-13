const url = `<iframe width="560" height="315" src="https://www.youtube.com/embed/XdokahoDpOo?si=nUCzY_bWmnVZfsm3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
const isYouTubeUrl = (url) => {
  if (!url) return false;
  return /(youtube\.com|youtu\.?be)\//i.test(url);
};
console.log(isYouTubeUrl(url));
