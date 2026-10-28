# Studio Bin — Photographer Phú Quốc (Next.js 16 + Tailwind CSS v4 + JavaScript)

Website giới thiệu **Studio Bin** — nhiếp ảnh gia bản địa tại Phú Quốc (brief `docs/demo.docx`, mã DN0065).
Phong cách _Minimalist & Editorial Luxury_: trắng kem, be cát, đen than, điểm nhấn vàng hoàng hôn & navy.
Header "viên thuốc" kính mờ và cuộn mượt Lenis lấy y hệt project mẫu ButStudio.

## 1. Chạy project

```bash
npm install
cp .env.example .env.local   # đặt NEXT_PUBLIC_SITE_URL = domain thật khi deploy
npm run dev                  # http://localhost:3000
npm run build && npm start
```

| Script           | Mô tả                       |
| ---------------- | --------------------------- |
| `npm run dev`    | Môi trường phát triển       |
| `npm run build`  | Build production            |
| `npm run start`  | Chạy bản build              |
| `npm run lint`   | ESLint                      |
| `npm run format` | Prettier (tự sắp xếp class) |

## 2. Cấu trúc

```
raw-photos/              ảnh GỐC khách gửi (73 ảnh đợt đầu + update/ 266 ảnh đợt 2) — gitignore, KHÔNG deploy
│                        webp-sources.json: ảnh web nào được tạo từ file gốc nào
public/images/
├── brand/               logo-gold / logo-dark / logo-white (WebP nền trong suốt), logo-original, logo-family
└── <slug>/<slug>-NN.webp   27 bộ sưu tập · 327 ảnh WebP, cạnh dài ≤ 2400px (q84–88, file ≤ 900KB)

src/
├── app/
│   ├── [lang]/              ROOT LAYOUT trong segment ngôn ngữ (vi | en)
│   │   ├── layout.js        font, metadata, JSON-LD, Navbar/Footer, Lenis, popup đặt lịch
│   │   ├── page.js          trang chủ (13 section)
│   │   ├── collections/      danh sách (lọc theo kiểu chụp) + [slug] chi tiết album + lightbox
│   │   └── services/         dịch vụ chi tiết, gói gợi ý, quy trình, FAQ
│   ├── api/contact/         nhận form đặt lịch (hiện chỉ log — tích hợp email tại đây)
│   ├── globals.css          Tailwind v4 @theme (màu, font, animation) + reveal/split/marquee
│   └── favicon.ico, icon.svg, icon1.png (192), apple-icon.png, opengraph-image.js, manifest.js, robots.js, sitemap.js
├── components/
│   ├── fx/        SmoothScroll (Lenis — giống mẫu), SplitText, Parallax, Preloader, PageTransition, ScrollTop
│   ├── layout/    Navbar (pill kính mờ + VI/EN — giống mẫu), Footer (bản đồ), FloatingContact
│   ├── sections/  Hero, Marquee, About, Usps, Collections, Services, GoldenHour, Locations,
│   │              Process, Moments, DayGrid, Testimonials, Contact
│   ├── gallery/   CollectionsGrid (bộ lọc), AlbumGallery (justified rows không cắt ảnh + lightbox)
│   ├── services/  ServicesHero, ServiceList, Packages, Faq, ServicesCta
│   ├── booking/   BookingModal + BookingForm (POST /api/contact)
│   └── ui/        Button, Container, Icons, Lightbox, Logo, Ornaments, Pic, Reveal, SectionHeading
├── config/site.js   thông tin thương hiệu, liên hệ, SEO
├── data/site.js     TOÀN BỘ nội dung text song ngữ
├── data/collections.js  27 bộ sưu tập (loại, mô tả, ảnh bìa, danh sách ảnh)
├── data/photos.js   P()/img()/seq() — đường dẫn ảnh WebP + kích thước thật (photo-sizes.json, tự sinh)
├── i18n/            t(), localize(), href() — cơ chế song ngữ; routes.js ánh xạ URL VI ↔ EN
├── hooks/           useReveal, useScrollProgress, useDragScroll
└── lib/             utils (cn, lockScroll), seo (metadata), schema (JSON-LD), justify (chia hàng ảnh)
```

## 3. Song ngữ Việt / Anh

- Mỗi ngôn ngữ một bộ URL thuần: tiếng Việt `/bo-suu-tap/cap-doi-hoang-hon`, `/dich-vu`; tiếng Anh `/en/collections/sunset-couple`, `/en/services`. Bảng ánh xạ ở `src/i18n/routes.js`, rewrite trong `src/proxy.js`.
- Chuỗi trong `src/data/site.js` viết dạng `t("tiếng Việt", "English")`; page gọi `localize(data, lang)`.
- Link nội bộ dùng đường dẫn route thật: `href(lang, "/collections")`; nút VI/EN trên header giữ nguyên trang đang xem.

## 4. Sửa nội dung

| Muốn sửa                               | Ở đâu                                                                                                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SĐT, Zalo, WhatsApp, Facebook, địa chỉ | `src/config/site.js`                                                                                                                                             |
| Text từng section                      | `src/data/site.js`                                                                                                                                               |
| Bộ sưu tập, ảnh bìa, thứ tự album      | `src/data/collections.js`                                                                                                                                        |
| Thêm bộ sưu tập                        | ảnh WebP vào `public/images/<slug>/` + kích thước vào `src/data/photo-sizes.json` + 1 object trong `collections.js` + slug tiếng Việt trong `src/i18n/routes.js` |
| Màu, font, animation                   | khối `@theme` trong `src/app/globals.css`                                                                                                                        |
| Thứ tự section trang chủ               | `src/app/[lang]/page.js`                                                                                                                                         |
| Gửi email từ form                      | `src/app/api/contact/route.js` + `.env.example`                                                                                                                  |

`coverPos` / `pos` là `object-position` của ảnh (ảnh chân dung thường `center 25–35%` để không cắt mặt).

## 5. Hiệu ứng

- **Header**: viên thuốc kính mờ nổi; kính tối chữ trắng trên section có `data-nav-theme="dark"`, kính kem khi cuộn xuống.
- **Cuộn mượt**: Lenis (`fx/SmoothScroll.js`, lerp 0.06, wheelMultiplier 0.78) — chậm, có quán tính; anchor cuộn êm.
- **Màn chào**: logo ~1,2s rồi kéo lên; phát `bin:ready` để hero mở màn đúng lúc.
- **Hero**: slideshow 5 bộ ảnh crossfade + ken burns, chữ hiện từng ký tự, parallax, bộ đếm + thanh tiến độ.
- **Dịch vụ**: khung ảnh dính bên trái đổi theo khối dịch vụ đang cuộn qua tâm màn hình.
- **Khoảnh khắc**: section ghim, dải ảnh chạy ngang theo chiều cuộn (viewport ≤ 1080px cao).
- **Địa điểm / Bộ sưu tập**: kéo chuột để lướt, hover nở caption; `.reveal` / `.split` hiện dần khi cuộn tới.

## 6. Email đặt lịch

Khách bấm **Gửi yêu cầu** → `/api/contact` kiểm tra dữ liệu → gửi email HTML "Yêu cầu đặt lịch mới"
(template `src/lib/mail/bookingEmail.js`, màu & logo theo website, có nút Gọi / Zalo / WhatsApp tới khách).

1. Gmail của studio: bật **Xác minh 2 bước**, tạo **Mật khẩu ứng dụng** tại https://myaccount.google.com/apppasswords.
2. Tạo `.env.local` từ `.env.example`, điền `SMTP_USER` (Gmail) và `SMTP_PASS` (mật khẩu ứng dụng 16 ký tự).
   `CONTACT_TO_EMAIL` = hộp thư nhận (bỏ trống = gửi về chính Gmail đó).
3. Khởi động lại `npm run dev`. Khi deploy (Vercel…), khai báo các biến này trong phần Environment Variables.

Chưa cấu hình SMTP: dev chỉ ghi log; production trả lỗi để form báo khách nhắn trực tiếp. Có sẵn ô ẩn chống bot
và giới hạn 5 yêu cầu / 10 phút / IP.

### Bảo mật form

| Lớp        | Cách chặn                                                                                                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nguồn gửi  | Chỉ nhận `fetch` từ chính website (Origin / Sec-Fetch-Site), đúng `Content-Type: application/json`                                                                                                                           |
| Kích thước | Body tối đa 8KB, đọc dạng text rồi mới parse JSON                                                                                                                                                                            |
| Tần suất   | Theo IP: 3/phút, 8/giờ, 20/ngày · theo số điện thoại: 3/giờ · gửi trùng trong 10 phút không gửi lại mail                                                                                                                     |
| Bot        | Ô ẩn honeypot + chặn form điền xong dưới 1,5 giây                                                                                                                                                                            |
| Dữ liệu    | Luật chung client/server ở `src/lib/validation/booking.js`: họ tên chỉ chữ cái (có dấu, mọi ngôn ngữ), SĐT Việt Nam (03/05/07/08/09, 02…) hoặc quốc tế dạng +mã nước; ngày từ hôm nay tới 2 năm; dịch vụ chỉ nhận mã có thật |
| Email      | Bỏ ký tự điều khiển / vô hình (chống chèn header), escape HTML trong template                                                                                                                                                |
| Header     | `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, ẩn `X-Powered-By`                                                                                                                               |

Lỗi hiển thị bằng toast: lỗi nhập 6 giây (kèm viền đỏ + nhảy tới ô sai), gửi quá nhiều 9 giây (có số phút chờ), lỗi mạng / server 8 giây.

**Khi deploy:** cấu hình `UPSTASH_REDIS_REST_URL` / `TOKEN` để giới hạn tần suất không bị reset giữa các instance;
bật **Vercel Firewall** (Attack Challenge Mode khi bị tấn công) hoặc đặt site sau **Cloudflare** — DDoS quy mô lớn
chỉ chặn được ở tầng hạ tầng, không phải trong code ứng dụng.

### Toast dùng chung

Gọi từ bất kỳ client component nào (hiển thị bởi `<Toaster />` trong layout, luôn nổi trên cùng):

```js
import { toast } from "@/lib/toast";
toast.success("Đã gửi yêu cầu", "Bin sẽ liên hệ lại trong ngày.");
toast.error("Gửi chưa thành công", "Vui lòng thử lại.");
toast.info("Đã sao chép", undefined, { duration: 3000 }); // duration: 0 = không tự đóng
```

## 7. Cần khách xác nhận

- **Đánh giá khách hàng** đang là nội dung mẫu (có ghi chú trên trang) — thay bằng review thật.
- **Giờ vàng, địa điểm, gói gợi ý, FAQ** viết theo kiến thức chung về Phú Quốc — khách rà lại cho đúng thực tế.
- Email liên hệ, domain (`NEXT_PUBLIC_SITE_URL`); WhatsApp đang dùng cùng số 0384 038 453. Facebook & Messenger trỏ tới facebook.com/danhlyts67 (đã bỏ Instagram).
- Giờ làm việc đang để 06:00 – 21:00 hằng ngày.
