# Studio Bin — Photographer Phú Quốc (Next.js 16 + Tailwind CSS v4 + JavaScript)

Website giới thiệu **Studio Bin** — nhiếp ảnh gia bản địa tại Phú Quốc (brief `docs/demo.docx`, mã DN0065).
Phong cách *Minimalist & Editorial Luxury*: trắng kem, be cát, đen than, điểm nhấn vàng hoàng hôn & navy.
Header "viên thuốc" kính mờ và cuộn mượt Lenis lấy y hệt project mẫu ButStudio.

## 1. Chạy project

```bash
npm install
cp .env.example .env.local   # đặt NEXT_PUBLIC_SITE_URL = domain thật khi deploy
npm run dev                  # http://localhost:3000
npm run build && npm start
```

| Script                 | Mô tả                       |
| ---------------------- | --------------------------- |
| `npm run dev`          | Môi trường phát triển       |
| `npm run build`        | Build production            |
| `npm run start`        | Chạy bản build              |
| `npm run lint`         | ESLint                      |
| `npm run format`       | Prettier (tự sắp xếp class) |

## 2. Cấu trúc

```
raw-photos/              73 ảnh GỐC khách gửi (20–30MB/ảnh) — gitignore, KHÔNG deploy
public/images/
├── brand/               logo-gold / logo-dark / logo-white (PNG tách nền), logo-original.jpg, logo-family.png
├── wedding-beach/       11 ảnh ┐
├── sunset-couple/        6 ảnh │
├── maternity/            4 ảnh │
├── sunset-portrait/     11 ảnh │  73 ảnh đã phân loại, nén ≤ 2000px
├── resort-editorial/     7 ảnh │  đặt tên <bộ>-<số>.jpg
├── family-villa/        11 ảnh │
├── family-beach/        11 ảnh │
├── family-travel/        6 ảnh │
└── beach-lookbook/       6 ảnh ┘

src/
├── app/
│   ├── [lang]/              ROOT LAYOUT trong segment ngôn ngữ (vi | en)
│   │   ├── layout.js        font, metadata, JSON-LD, Navbar/Footer, Lenis, popup đặt lịch
│   │   ├── page.js          trang chủ (13 section)
│   │   ├── bo-suu-tap/      danh sách (lọc theo kiểu chụp) + [slug] chi tiết album + lightbox
│   │   └── dich-vu/         dịch vụ chi tiết, gói gợi ý, quy trình, FAQ
│   ├── api/contact/         nhận form đặt lịch (hiện chỉ log — tích hợp email tại đây)
│   ├── globals.css          Tailwind v4 @theme (màu, font, animation) + reveal/split/marquee
│   └── icon.png, apple-icon.png, opengraph-image.js, manifest.js, robots.js, sitemap.js
├── components/
│   ├── fx/        SmoothScroll (Lenis — giống mẫu), SplitText, Parallax, Preloader, PageTransition, ScrollTop
│   ├── layout/    Navbar (pill kính mờ + VI/EN — giống mẫu), Footer (bản đồ), FloatingContact
│   ├── sections/  Hero, Marquee, About, Usps, Collections, Services, GoldenHour, Locations,
│   │              Process, Moments, DayGrid, Testimonials, Contact
│   ├── gallery/   CollectionsGrid (bộ lọc), AlbumGallery (lưới + lightbox)
│   ├── services/  ServicesHero, ServiceList, Packages, Faq, ServicesCta
│   ├── booking/   BookingModal + BookingForm (POST /api/contact)
│   └── ui/        Button, Container, Icons, Lightbox, Logo, Ornaments, Pic, Reveal, SectionHeading
├── config/site.js   thông tin thương hiệu, liên hệ, SEO
├── data/site.js     TOÀN BỘ nội dung text song ngữ + mapping ảnh vào bộ sưu tập
├── i18n/            t(), localize(), href() — cơ chế song ngữ; routes.js ánh xạ URL VI ↔ EN
├── hooks/           useReveal, useScrollProgress, useDragScroll
└── lib/utils.js     cn(), lockScroll(), pad2()
```

## 3. Song ngữ Việt / Anh

- Tiếng Việt tại `/`, tiếng Anh tại `/en` (rewrites trong `next.config.mjs`; `/en/collections`, `/en/services`).
- Chuỗi trong `src/data/site.js` viết dạng `t("tiếng Việt", "English")`; page gọi `localize(data, lang)`.
- Link nội bộ dùng `href(lang, "/bo-suu-tap")`; nút VI/EN trên header giữ nguyên trang đang xem.

## 4. Sửa nội dung

| Muốn sửa                              | Ở đâu                                              |
| ------------------------------------- | -------------------------------------------------- |
| SĐT, Zalo, WhatsApp, Facebook, địa chỉ | `src/config/site.js`                               |
| Text từng section, bộ sưu tập, ảnh    | `src/data/site.js`                                 |
| Thêm bộ sưu tập                       | thêm thư mục ảnh + 1 object trong `collections`    |
| Màu, font, animation                  | khối `@theme` trong `src/app/globals.css`          |
| Thứ tự section trang chủ              | `src/app/[lang]/page.js`                           |
| Gửi email từ form                     | `src/app/api/contact/route.js` + `.env.example`    |

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
