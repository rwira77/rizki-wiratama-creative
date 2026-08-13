export const isYouTubeUrl = (url: string) => {
  if (!url) return false;
  return /(youtube\.com|youtu\.?be)\//i.test(url);
};

export const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (id: string | null) => {
  if (!id) return '';
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
};
