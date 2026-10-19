import Image from "next/image";

// next/image chất lượng cao mặc định (ảnh sắc nét) + chống kéo thả.
export default function Pic({ quality = 90, draggable = false, alt = "", ...props }) {
  return <Image quality={quality} draggable={draggable} alt={alt} {...props} />;
}
