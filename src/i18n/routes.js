// Ánh xạ đường dẫn tiếng Việt ↔ tiếng Anh. Slug bộ sưu tập dùng chung (đã là tiếng Anh).
export const PATHS_EN = {
  "/bo-suu-tap": "/collections",
  "/dich-vu": "/services",
};
const PATHS_VI = Object.fromEntries(Object.entries(PATHS_EN).map(([vi, en]) => [en, vi]));

const swap = (path, map) => {
  const [p, hash] = path.split("#");
  const seg = Object.keys(map).find((k) => p === k || p.startsWith(k + "/"));
  const out = seg ? map[seg] + p.slice(seg.length) : p;
  return hash ? `${out}#${hash}` : out;
};

export const toEnPath = (path) => swap(path, PATHS_EN);
export const toViPath = (path) => swap(path, PATHS_VI);
