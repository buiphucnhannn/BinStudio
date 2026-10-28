import localFont from "next/font/local";

// Font tự host, đã cắt gọn còn Latin + tiếng Việt (src/assets/fonts, tạo từ chính file Google Fonts phục vụ):
// mỗi kiểu chữ 1 file thay vì 3 file latin / latin-ext / vietnamese → ~174KB thay vì ~284KB,
// và chữ có dấu được canh khoảng (kerning) đúng vì cùng nằm trong một file.
// (next/font yêu cầu đường dẫn viết sẵn dạng chuỗi — không ghép từ biến)
export const serif = localFont({
  src: [
    { path: "../assets/fonts/cormorant-garamond-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond-500.woff2", weight: "500", style: "normal" },
    {
      path: "../assets/fonts/cormorant-garamond-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/cormorant-garamond-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const sans = localFont({
  src: [
    { path: "../assets/fonts/be-vietnam-pro-400.woff2", weight: "400" },
    { path: "../assets/fonts/be-vietnam-pro-500.woff2", weight: "500" },
    { path: "../assets/fonts/be-vietnam-pro-600.woff2", weight: "600" },
  ],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});

// Font viết tay — chỉ dùng cho chữ ký / watermark cỡ lớn phía dưới, không cần tải trước
export const script = localFont({
  src: "../assets/fonts/great-vibes.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

// className gắn lên <html> (khai báo biến CSS --font-serif / --font-sans / --font-script)
export const fontVariables = `${serif.variable} ${sans.variable} ${script.variable}`;
