// ============================================================
// TOÀN BỘ nội dung text / ảnh / bộ sưu tập của Studio Bin.
// Chuỗi song ngữ viết dạng t("tiếng Việt", "English").
// Sửa nội dung tại đây, không cần đụng vào component.
// ============================================================
import { t } from "@/i18n";

// Ảnh: /images/<bộ>/<bộ>-NN.jpg (đã tối ưu ≤ 2000px). Ảnh gốc nằm ở raw-photos/.
const P = (group, n) => `/images/${group}/${group}-${String(n).padStart(2, "0")}.jpg`;

// ---------- Điều hướng ----------
export const nav = [
  { label: t("Về Bin", "About"), href: "/#about" },
  { label: t("Bộ sưu tập", "Portfolio"), href: "/bo-suu-tap" },
  { label: t("Dịch vụ", "Services"), href: "/dich-vu" },
  { label: t("Địa điểm", "Locations"), href: "/#locations" },
  { label: t("Liên hệ", "Contact"), href: "/#contact" },
];

export const ui = {
  book: t("Đặt lịch chụp", "Book a session"),
  bookFree: t("Đặt lịch chụp ảnh", "Book a photo session"),
  explore: t("Xem bộ sưu tập", "View portfolio"),
  viewAll: t("Xem tất cả", "View all"),
  viewAlbum: t("Xem album", "View album"),
  swipe: t("Vuốt ngang để xem thêm →", "Swipe to see more →"),
  drag: t("Kéo để lướt →", "Drag to browse →"),
  scroll: t("Cuộn", "Scroll"),
  home: t("Trang chủ", "Home"),
  collections: t("Bộ sưu tập", "Portfolio"),
  nextCollection: t("Bộ sưu tập tiếp theo", "Next collection"),
  aboutCollection: t("Về bộ ảnh", "About this collection"),
  bookThis: t("Đặt lịch chụp kiểu này", "Book a session like this"),
  photos: t("ảnh", "photos"),
  closeMenu: t("Đóng menu", "Close menu"),
  openMenu: t("Mở menu", "Open menu"),
  hotline: t("Hotline / Zalo / WhatsApp", "Hotline / Zalo / WhatsApp"),
  menu: t("Menu", "Menu"),
  contact: t("Liên hệ", "Contact"),
  map: t("Bản đồ", "Map"),
  directions: t("Mở Google Maps", "Open in Google Maps"),
  toTop: t("Lên đầu trang", "Back to top"),
  all: t("Tất cả", "All"),
  resetFilters: t("Xoá bộ lọc", "Clear filter"),
  noResults: t("Chưa có bộ ảnh phù hợp.", "No collection matches this filter yet."),
  notFoundTitle: t("Không tìm thấy trang", "Page not found"),
  notFoundDesc: t(
    "Trang bạn tìm không tồn tại hoặc đã được di chuyển.",
    "The page you are looking for does not exist or has moved.",
  ),
  backHome: t("Về trang chủ", "Back to home"),
  callNow: t("Gọi ngay", "Call now"),
  chatMessenger: t("Chat Messenger", "Chat on Messenger"),
  chatZalo: t("Chat Zalo", "Chat on Zalo"),
  chatWhatsApp: t("Chat WhatsApp", "Chat on WhatsApp"),
  priceContact: t("Liên hệ báo giá", "Contact for pricing"),
  bestTime: t("Đẹp nhất", "Best at"),
  minutes: t("phút", "min"),
};

// ---------- Phân loại bộ sưu tập ----------
export const categories = {
  wedding: t("Cưới & Pre-wedding", "Wedding & Pre-wedding"),
  couple: t("Cặp đôi & Hoàng hôn", "Couples & Sunset"),
  family: t("Gia đình & Du lịch", "Family & Holiday"),
  portrait: t("Chân dung & Lookbook", "Portrait & Lookbook"),
};

// ---------- Bộ sưu tập (9 bộ, dùng đủ 73 ảnh trong kho) ----------
// pos = objectPosition cho ảnh bìa; ảnh dọc chụp chân dung thường cần "center 25%" để không cắt mặt.
// wide = ảnh ngang (gốc), dùng để xếp lưới.
const W = (group, n, pos = "center") => ({ src: P(group, n), pos, wide: true });
const V = (group, n, pos = "center 30%") => ({ src: P(group, n), pos });

export const collections = [
  {
    slug: "wedding-beach",
    category: "wedding",
    name: t("Lễ cưới bên biển", "Beach Wedding"),
    sub: t("Cưới · Bãi biển Phú Quốc", "Wedding · Phu Quoc beach"),
    concept: t("Váy ren, hoa trắng và tiếng cười", "Lace, white flowers and laughter"),
    desc: t(
      "Một buổi chiều trời dịu trên bãi cát dài — cô dâu chú rể chạy, cười, ôm nhau giữa sóng. Studio Bin đi cùng như một người bạn, ghi lại những khoảnh khắc không dàn dựng của ngày trọng đại.",
      "A soft afternoon on a long sandy beach — the couple runs, laughs and holds each other between the waves. Studio Bin walks alongside like a friend, capturing the unstaged moments of the big day.",
    ),
    cover: P("wedding-beach", 9),
    coverPos: "center 28%",
    hero: { src: P("wedding-beach", 4), pos: "center 40%" },
    images: [
      V("wedding-beach", 1, "center 25%"),
      V("wedding-beach", 2, "center 25%"),
      W("wedding-beach", 3, "center 40%"),
      W("wedding-beach", 4, "center 40%"),
      W("wedding-beach", 5),
      W("wedding-beach", 6),
      V("wedding-beach", 7, "center 30%"),
      W("wedding-beach", 8, "center 35%"),
      V("wedding-beach", 9, "center 28%"),
      W("wedding-beach", 10),
      W("wedding-beach", 11, "center 35%"),
    ],
  },
  {
    slug: "sunset-couple",
    category: "couple",
    name: t("Hoàng hôn của hai người", "Sunset for Two"),
    sub: t("Cặp đôi · Giờ vàng", "Couple · Golden hour"),
    concept: t("Sóng, váy trắng và bầu trời hồng cam", "Waves, a white dress and a peach sky"),
    desc: t(
      "Phú Quốc nằm ở bờ tây nên mặt trời lặn thẳng xuống biển. Bộ ảnh này chụp trong 40 phút cuối ngày: ánh sáng vàng mật, rồi chuyển hồng, rồi tím — mỗi khung hình một màu trời khác nhau.",
      "Phu Quoc faces west, so the sun sets straight into the sea. This set was shot in the last 40 minutes of daylight: honey gold, then pink, then violet — every frame a different sky.",
    ),
    cover: P("sunset-couple", 2),
    coverPos: "center 35%",
    hero: { src: P("sunset-couple", 1), pos: "center 45%" },
    images: [
      W("sunset-couple", 1, "center 45%"),
      V("sunset-couple", 2, "center 35%"),
      W("sunset-couple", 3, "center 45%"),
      V("sunset-couple", 4, "center 40%"),
      V("sunset-couple", 5, "center 35%"),
      V("sunset-couple", 6, "center 30%"),
    ],
  },
  {
    slug: "maternity",
    category: "couple",
    name: t("Chờ đón thiên thần", "Waiting for You"),
    sub: t("Cặp đôi · Maternity", "Couple · Maternity"),
    concept: t("Cầu gỗ, hoàng hôn và tấm ảnh siêu âm", "A wooden pier, sunset and an ultrasound"),
    desc: t(
      "Bộ ảnh maternity trên cầu gỗ vươn ra biển lúc hoàng hôn. Nhẹ nhàng, riêng tư, tập trung vào ánh mắt của hai người và tấm ảnh siêu âm đầu tiên.",
      "A maternity session on a wooden pier reaching into the sea at sunset. Gentle, private, focused on the way the two of them look at each other — and at the very first ultrasound.",
    ),
    cover: P("maternity", 4),
    coverPos: "center 25%",
    hero: { src: P("maternity", 2), pos: "center 30%" },
    images: [
      V("maternity", 1, "center 25%"),
      V("maternity", 2, "center 25%"),
      V("maternity", 3, "center 25%"),
      V("maternity", 4, "center 25%"),
    ],
  },
  {
    slug: "sunset-portrait",
    category: "portrait",
    name: t("Giờ vàng trên đá", "Golden Hour on the Rocks"),
    sub: t("Chân dung · Ghềnh đá hoàng hôn", "Portrait · Sunset rocks"),
    concept: t("Đá, sóng và ánh sáng ngược", "Rocks, surf and backlight"),
    desc: t(
      "Ghềnh đá phía tây đảo là phim trường tự nhiên đẹp nhất lúc 17h30. Chân dung ngược sáng, bóng đổ dài, màu da ấm — phong cách lookbook cho khách muốn một bộ ảnh cá nhân thật khác biệt.",
      "The rocky west coast is the island's most beautiful natural set at 5:30pm. Backlit portraits, long shadows, warm skin tones — a lookbook style for guests who want a personal set that stands out.",
    ),
    cover: P("sunset-portrait", 8),
    coverPos: "center 30%",
    hero: { src: P("sunset-portrait", 3), pos: "center 55%" },
    images: [
      V("sunset-portrait", 1, "center 25%"),
      V("sunset-portrait", 2, "center 25%"),
      W("sunset-portrait", 3, "center 55%"),
      V("sunset-portrait", 4, "center 30%"),
      V("sunset-portrait", 5, "center 50%"),
      W("sunset-portrait", 6, "center 50%"),
      V("sunset-portrait", 7, "center 25%"),
      V("sunset-portrait", 8, "center 30%"),
      V("sunset-portrait", 9, "center 35%"),
      V("sunset-portrait", 10, "center 35%"),
      V("sunset-portrait", 11, "center 55%"),
    ],
  },
  {
    slug: "resort-editorial",
    category: "portrait",
    name: t("Editorial tại Resort", "Resort Editorial"),
    sub: t("Chân dung · Resort cao cấp", "Portrait · Luxury resort"),
    concept: t("Thư viện gỗ, gạch bàn cờ, váy lụa", "Wooden library, checkered floors, silk"),
    desc: t(
      "Không chỉ có biển — Phú Quốc còn có những resort với kiến trúc Đông Dương tuyệt đẹp. Bộ ảnh này chụp trong nhà với ánh sáng cửa sổ, phong cách tạp chí: tiết chế, sang và nhiều khoảng lặng.",
      "Beyond the beach, Phu Quoc has resorts with stunning Indochine architecture. This set was shot indoors with window light, magazine style: restrained, elegant and full of quiet moments.",
    ),
    cover: P("resort-editorial", 2),
    coverPos: "center 30%",
    hero: { src: P("resort-editorial", 6), pos: "center 60%" },
    images: [
      V("resort-editorial", 1, "center 30%"),
      V("resort-editorial", 2, "center 30%"),
      V("resort-editorial", 3, "center 35%"),
      V("resort-editorial", 4, "center 35%"),
      V("resort-editorial", 5, "center 30%"),
      W("resort-editorial", 6, "center 60%"),
      W("resort-editorial", 7, "center 40%"),
    ],
  },
  {
    slug: "family-villa",
    category: "family",
    name: t("Gia đình tại Villa", "Family at the Villa"),
    sub: t("Gia đình · Resort & villa", "Family · Resort & villa"),
    concept: t(
      "Phòng ngủ sáng, bãi cỏ dừa và hai cậu bé",
      "A bright bedroom, palm lawns and two boys",
    ),
    desc: t(
      "Buổi sáng của một gia đình đang nghỉ dưỡng: bắt đầu trên giường villa, rồi ra bãi cỏ dưới hàng dừa. Không tạo dáng — chỉ chơi, tung bé lên trời và cười. Bin chụp theo kiểu phóng sự để giữ nguyên không khí ấy.",
      "A holiday morning for one family: starting on the villa bed, then out to the palm-lined lawn. No posing — just play, tossing the little one in the air and laughing. Bin shoots documentary style to keep that mood intact.",
    ),
    cover: P("family-villa", 6),
    coverPos: "center 30%",
    hero: { src: P("family-villa", 4), pos: "center 50%" },
    images: [
      V("family-villa", 1, "center 40%"),
      V("family-villa", 2, "center 45%"),
      V("family-villa", 3, "center 45%"),
      W("family-villa", 4, "center 50%"),
      V("family-villa", 5, "center 45%"),
      V("family-villa", 6, "center 30%"),
      V("family-villa", 7, "center 30%"),
      V("family-villa", 8, "center 30%"),
      V("family-villa", 9, "center 40%"),
      V("family-villa", 10, "center 45%"),
      V("family-villa", 11, "center 55%"),
    ],
  },
  {
    slug: "family-beach",
    category: "family",
    name: t("Sinh nhật đầu tiên bên biển", "First Birthday by the Sea"),
    sub: t("Gia đình · Bãi biển lúc chiều", "Family · Beach at dusk"),
    concept: t(
      "Vương miện giấy, váy xanh bạc hà và sóng nhỏ",
      "A paper crown, mint dress and small waves",
    ),
    desc: t(
      "Sinh nhật một tuổi của bé được tổ chức trên bãi biển lúc chiều muộn. Ánh sáng mềm như phim, bố mẹ dắt bé đi dọc mép nước — những bức ảnh gia đình sẽ còn được treo rất lâu.",
      "A first birthday celebrated on the beach in the late afternoon. Film-soft light, parents walking the little one along the water's edge — family photos that will hang on the wall for years.",
    ),
    cover: P("family-beach", 7),
    coverPos: "center 35%",
    hero: { src: P("family-beach", 2), pos: "center 30%" },
    images: [
      V("family-beach", 1, "center 25%"),
      V("family-beach", 2, "center 25%"),
      V("family-beach", 3, "center 25%"),
      V("family-beach", 4, "center 30%"),
      V("family-beach", 5, "center 30%"),
      V("family-beach", 6, "center 40%"),
      V("family-beach", 7, "center 35%"),
      V("family-beach", 8, "center 40%"),
      V("family-beach", 9, "center 35%"),
      V("family-beach", 10, "center 30%"),
      V("family-beach", 11, "center 30%"),
    ],
  },
  {
    slug: "family-travel",
    category: "family",
    name: t("Kỳ nghỉ gia đình", "Family Holiday"),
    sub: t("Du lịch · Biển & hàng dừa", "Travel · Sea & palm roads"),
    concept: t("Áo trắng, xe đạp và con đường dừa", "White shirts, bicycles and a palm road"),
    desc: t(
      "Gói chụp du lịch nửa ngày: sáng đạp xe dưới hàng dừa, trưa ra bãi biển xanh ngắt. Ảnh tươi, sáng, đúng tinh thần một kỳ nghỉ — giao nhanh để gia đình kịp đăng khi còn ở đảo.",
      "A half-day travel session: cycling under the palms in the morning, then the turquoise beach at noon. Bright, fresh holiday photos — delivered fast so the family can post them while still on the island.",
    ),
    cover: P("family-travel", 1),
    coverPos: "center 35%",
    hero: { src: P("family-travel", 4), pos: "center 55%" },
    images: [
      V("family-travel", 1, "center 35%"),
      W("family-travel", 2, "center 45%"),
      W("family-travel", 3, "center 45%"),
      W("family-travel", 4, "center 55%"),
      W("family-travel", 5, "center 55%"),
      W("family-travel", 6, "center 55%"),
    ],
  },
  {
    slug: "beach-lookbook",
    category: "portrait",
    name: t("Lookbook bãi biển", "Beach Lookbook"),
    sub: t("Chân dung · Lookbook", "Portrait · Lookbook"),
    concept: t("Khăn lụa xanh, cát vàng và nắng xiên", "Blue silk, golden sand and low sun"),
    desc: t(
      "Bộ lookbook cho khách muốn ảnh cá nhân phong cách tạp chí du lịch: trưa nắng dưới hàng dừa, chiều nằm trên cát với khăn lụa bay. Bin tư vấn trang phục và màu sắc từ trước buổi chụp.",
      "A lookbook for guests who want personal photos in travel-magazine style: noon sun under the palms, then lying on golden sand with silk in the wind. Bin advises on outfits and colours before the shoot.",
    ),
    cover: P("beach-lookbook", 6),
    coverPos: "center 30%",
    hero: { src: P("beach-lookbook", 2), pos: "center 55%" },
    images: [
      V("beach-lookbook", 1, "center 30%"),
      W("beach-lookbook", 2, "center 55%"),
      V("beach-lookbook", 3, "center 40%"),
      V("beach-lookbook", 4, "center 45%"),
      V("beach-lookbook", 5, "center 45%"),
      V("beach-lookbook", 6, "center 30%"),
    ],
  },
];

export const getCollection = (slug) => collections.find((c) => c.slug === slug);
export const featuredCollections = [
  "wedding-beach",
  "sunset-couple",
  "family-villa",
  "sunset-portrait",
  "family-beach",
  "resort-editorial",
].map(getCollection);
export const totalPhotos = collections.reduce((s, c) => s + c.images.length, 0);

// ---------- Hero ----------
export const hero = {
  eyebrow: t("Studio Bin · Photographer · Phú Quốc", "Studio Bin · Photographer · Phu Quoc"),
  title: t("Khoảnh khắc thật,", "Real moments,"),
  accent: t("giữa biển trời Phú Quốc.", "under Phu Quoc skies."),
  desc: t(
    "Nhiếp ảnh gia bản địa, phong cách phóng sự tự nhiên — chụp ảnh cưới, cặp đôi, gia đình và chân dung cho khách trong và ngoài nước.",
    "A local photographer with a candid, documentary style — weddings, couples, families and portraits for guests from Vietnam and around the world.",
  ),
  // Slideshow: desktop dùng ảnh ngang, mobile dùng ảnh dọc tương ứng
  slides: [
    {
      wide: { src: P("sunset-couple", 1), pos: "center 45%" },
      tall: { src: P("sunset-couple", 2), pos: "center 35%" },
      label: t("Hoàng hôn · Cặp đôi", "Sunset · Couple"),
    },
    {
      wide: { src: P("wedding-beach", 4), pos: "center 12%" },
      tall: { src: P("wedding-beach", 1), pos: "center 25%" },
      label: t("Lễ cưới bên biển", "Beach wedding"),
    },
    {
      wide: { src: P("sunset-portrait", 3), pos: "center 55%" },
      tall: { src: P("sunset-portrait", 8), pos: "center 30%" },
      label: t("Giờ vàng trên đá", "Golden hour"),
    },
    {
      wide: { src: P("family-travel", 4), pos: "center 55%" },
      tall: { src: P("family-beach", 7), pos: "center 35%" },
      label: t("Gia đình & du lịch", "Family & holiday"),
    },
    {
      wide: { src: P("beach-lookbook", 2), pos: "center 55%" },
      tall: { src: P("beach-lookbook", 6), pos: "center 30%" },
      label: t("Lookbook bãi biển", "Beach lookbook"),
    },
  ],
  badges: [
    t("Candid & Documentary", "Candid & Documentary"),
    t("Giao tiếp tiếng Anh", "English speaking"),
    t("Bãi biển riêng · Resort cao cấp", "Private beaches · Luxury resorts"),
  ],
};

// ---------- Dải chữ chạy ----------
export const marquee = [
  t("Ảnh cưới", "Weddings"),
  t("Pre-wedding", "Pre-wedding"),
  t("Cặp đôi", "Couples"),
  t("Cầu hôn", "Proposals"),
  t("Săn hoàng hôn", "Sunset sessions"),
  t("Gia đình", "Families"),
  t("Resort & Villa", "Resorts & villas"),
  t("Chân dung", "Portraits"),
  t("Lookbook", "Lookbook"),
  t("Sự kiện", "Events"),
];

// ---------- Về Bin ----------
export const about = {
  eyebrow: t("Về Studio Bin", "About Studio Bin"),
  manifesto: [
    { text: t("Không dàn dựng.", "Nothing staged.") },
    { text: t("Chỉ có ánh sáng,", "Only light,") },
    { text: t("biển, và", "the sea, and") },
    { text: t("cảm xúc thật.", "real emotion."), accent: true },
  ],
  paragraphs: [
    t(
      "Studio Bin là nhiếp ảnh gia sinh ra và lớn lên ở Phú Quốc. Bin biết bãi biển nào vắng người lúc 7 giờ sáng, ghềnh đá nào bắt nắng đẹp nhất lúc 17h30, và resort nào có hành lang Đông Dương hợp với một bộ ảnh editorial.",
      "Studio Bin was born and raised in Phu Quoc. Bin knows which beach is empty at 7am, which rocks catch the best light at 5:30pm, and which resort has the Indochine corridors made for an editorial set.",
    ),
    t(
      "Phần lớn khách của Bin là du khách nước ngoài. Bin trao đổi bằng tiếng Anh, hiểu gu thẩm mỹ quốc tế và theo đuổi phong cách phóng sự: ít can thiệp, nhiều khoảnh khắc.",
      "Most of Bin's guests travel from abroad. Bin communicates in English, understands an international aesthetic and follows a documentary approach: minimal direction, maximum moments.",
    ),
  ],
  main: { src: P("wedding-beach", 7), pos: "center 30%" },
  polaroids: [
    { src: P("family-villa", 7), caption: "fly, little one", pos: "center 30%" },
    { src: P("sunset-portrait", 6), caption: "5:42 pm", pos: "center 50%", wide: true },
  ],
  highlights: [
    { value: "Candid", label: t("Phong cách phóng sự tự nhiên", "Documentary, candid style") },
    { value: "EN · VI", label: t("Giao tiếp song ngữ với khách", "Bilingual with every guest") },
    {
      value: "Local",
      label: t("Am hiểu từng bãi biển, từng khung giờ", "Knows every beach, every hour"),
    },
  ],
};

// ---------- Vì sao chọn Bin (USP theo brief) ----------
export const usps = {
  eyebrow: t("Điểm khác biệt", "Why Studio Bin"),
  title: t("Ba điều khách quốc tế tin ở Bin.", "Three things our international guests count on."),
  items: [
    {
      icon: "globe",
      title: t("Phục vụ khách nước ngoài", "Built for international guests"),
      desc: t(
        "Trao đổi tiếng Anh trôi chảy, làm việc đúng giờ, báo giá minh bạch và nắm bắt gu thẩm mỹ quốc tế.",
        "Fluent English, punctual, transparent pricing and a feel for international taste.",
      ),
    },
    {
      icon: "film",
      title: t("Candid & Documentary", "Candid & documentary"),
      desc: t(
        "Ít chỉ đạo, nhiều quan sát. Ảnh giữ nét chân thực, giàu cảm xúc, màu phim nhẹ và tự nhiên.",
        "Less directing, more observing. Honest, emotional frames with a soft, natural film look.",
      ),
    },
    {
      icon: "sun",
      title: t("Người bản địa, hiểu ánh sáng", "A local who reads the light"),
      desc: t(
        "Biết bãi biển riêng tư, resort cao cấp và khung giờ ánh sáng đẹp nhất của từng mùa ở Phú Quốc.",
        "Knows the private beaches, luxury resorts and the best light of every season in Phu Quoc.",
      ),
    },
  ],
};

// ---------- Dịch vụ (5 mục theo brief) ----------
export const services = {
  eyebrow: t("Dịch vụ", "Services"),
  title: t("Năm cách để giữ lại Phú Quốc.", "Five ways to keep Phu Quoc with you."),
  allLabel: t("Xem chi tiết dịch vụ", "See all services"),
  desc: t(
    "Cuộn qua từng dịch vụ — ảnh bên trái sẽ đổi theo. Mọi gói đều có thể kết hợp và tuỳ chỉnh theo lịch trình của bạn.",
    "Scroll through each service — the photo on the left follows along. Every package can be combined and tailored to your itinerary.",
  ),
  items: [
    {
      n: "01",
      title: t("Ảnh cưới & Pre-wedding ngoại cảnh biển", "Beach wedding & pre-wedding"),
      desc: t(
        "Chụp lễ cưới, elopement hoặc pre-wedding trên bãi biển, ghềnh đá và resort tại Phú Quốc. Bin theo sát cả ngày hoặc nửa ngày, chụp phóng sự xen kẽ những khung hình editorial.",
        "Wedding days, elopements or pre-wedding sessions on Phu Quoc's beaches, rocks and resorts. Bin covers a full or half day, mixing documentary coverage with editorial frames.",
      ),
      points: [
        t("Nửa ngày hoặc trọn ngày", "Half-day or full-day"),
        t("Gợi ý địa điểm & khung giờ", "Location & timing advice"),
        t("Album online + ảnh in", "Online gallery + prints"),
      ],
      image: P("wedding-beach", 7),
      pos: "center 30%",
      collection: "wedding-beach",
    },
    {
      n: "02",
      title: t("Cặp đôi, cầu hôn & săn hoàng hôn", "Couples, proposals & sunset sessions"),
      desc: t(
        "Buổi chụp 60–90 phút vào giờ vàng cho cặp đôi, kỷ niệm ngày cưới hay một màn cầu hôn bí mật — Bin ẩn mình để bắt trọn khoảnh khắc 'Yes'.",
        "A 60–90 minute golden-hour session for couples, anniversaries or a secret proposal — Bin stays hidden to capture the moment she says yes.",
      ),
      points: [
        t("Giờ vàng 16:30 – 18:30", "Golden hour 4:30 – 6:30pm"),
        t("Lên kế hoạch cầu hôn kín đáo", "Discreet proposal planning"),
        t("Ảnh xem trước trong 24h", "Sneak peeks within 24h"),
      ],
      image: P("sunset-couple", 5),
      pos: "center 35%",
      collection: "sunset-couple",
    },
    {
      n: "03",
      title: t(
        "Gia đình & du lịch nghỉ dưỡng tại Resort/Villa",
        "Family & holiday sessions at your resort",
      ),
      desc: t(
        "Bin đến tận resort hoặc villa bạn đang ở. Chụp bữa sáng, bể bơi, bãi biển trước cửa — thoải mái cho trẻ nhỏ, không cần di chuyển xa.",
        "Bin comes to the resort or villa where you're staying. Breakfast, the pool, the beach right outside — relaxed for little ones, no long transfers.",
      ),
      points: [
        t("Chụp tại nơi bạn ở", "Shot where you stay"),
        t("Thân thiện với trẻ nhỏ", "Kid-friendly pacing"),
        t("Giao nhanh khi còn trên đảo", "Fast delivery while you're still here"),
      ],
      image: P("family-beach", 10),
      pos: "center 30%",
      collection: "family-villa",
    },
    {
      n: "04",
      title: t(
        "Chân dung nghệ thuật (Portrait/Lookbook) & Sự kiện",
        "Editorial portraits, lookbooks & events",
      ),
      desc: t(
        "Bộ ảnh cá nhân phong cách tạp chí tại resort, bãi biển hay ghềnh đá; lookbook cho thương hiệu; chụp sự kiện, tiệc riêng và hội nghị tại Phú Quốc.",
        "Magazine-style personal portraits at resorts, beaches or rocks; brand lookbooks; private events, parties and conferences across Phu Quoc.",
      ),
      points: [
        t("Tư vấn trang phục & màu", "Outfit & colour direction"),
        t("Lookbook cho thương hiệu", "Lookbooks for brands"),
        t("Sự kiện, tiệc riêng, hội nghị", "Events, parties, conferences"),
      ],
      image: P("resort-editorial", 2),
      pos: "center 30%",
      collection: "resort-editorial",
    },
    {
      n: "05",
      title: t(
        "Trọn gói: Makeup, trang phục cưới & quay phóng sự",
        "All-inclusive: makeup, wedding attire & film",
      ),
      desc: t(
        "Đến Phú Quốc với hành lý nhẹ. Bin kết nối makeup artist, váy cưới / vest cho thuê và quay phim phóng sự để bạn chỉ cần có mặt và tận hưởng.",
        "Travel light. Bin arranges a makeup artist, wedding dress / suit rental and documentary videography so you only need to show up and enjoy.",
      ),
      points: [
        t("Makeup & làm tóc tại chỗ", "On-site hair & makeup"),
        t("Thuê váy cưới, vest", "Dress & suit rental"),
        t("Video phóng sự highlight", "Documentary highlight film"),
      ],
      image: P("wedding-beach", 2),
      pos: "center 25%",
    },
  ],
};

// ---------- Giờ vàng: lịch ánh sáng Phú Quốc ----------
export const goldenHour = {
  eyebrow: t("Lịch ánh sáng", "Light calendar"),
  cta: t("Đặt lịch giờ vàng", "Book golden hour"),
  title: t(
    "Phú Quốc có bốn loại ánh sáng. Bin chụp cả bốn.",
    "Phu Quoc has four kinds of light. Bin shoots all four.",
  ),
  desc: t(
    "Đảo nằm ở bờ tây vịnh Thái Lan: bình minh ở bãi phía đông, hoàng hôn lặn thẳng xuống biển phía tây. Chọn đúng giờ quan trọng hơn chọn đúng máy.",
    "The island sits on the west of the Gulf of Thailand: sunrise on the eastern beaches, sunset dropping straight into the western sea. Picking the right hour matters more than the right camera.",
  ),
  slots: [
    {
      time: "05:45",
      name: t("Bình minh", "Sunrise"),
      where: t("Bãi Sao · Bãi Khem", "Sao Beach · Khem Beach"),
      desc: t(
        "Biển lặng, bãi vắng, ánh sáng xanh pastel — hợp gia đình có trẻ nhỏ.",
        "Calm sea, empty sand, pastel light — perfect for families with little ones.",
      ),
      image: { src: P("family-beach", 6), pos: "center 40%" },
    },
    {
      time: "07:00 – 09:30",
      name: t("Sáng dịu", "Soft morning"),
      where: t("Resort · Villa · Hàng dừa", "Resorts · Villas · Palm roads"),
      desc: t(
        "Nắng chưa gắt, màu da đẹp, chụp trong nhà với ánh cửa sổ hoặc ngoài sân.",
        "Gentle sun, flattering skin tones, indoor window light or the garden.",
      ),
      image: { src: P("resort-editorial", 6), pos: "center 60%" },
    },
    {
      time: "16:30 – 18:00",
      name: t("Giờ vàng", "Golden hour"),
      where: t("Bãi Trường · Ông Lang · Bãi Dài", "Truong · Ong Lang · Dai Beach"),
      desc: t(
        "Nắng vàng mật, bóng dài, ngược sáng lung linh — khung giờ của cặp đôi và cầu hôn.",
        "Honey light, long shadows, glowing backlight — the hour for couples and proposals.",
      ),
      image: { src: P("sunset-couple", 3), pos: "center 45%" },
    },
    {
      time: "18:00 – 18:40",
      name: t("Hoàng hôn & giờ xanh", "Sunset & blue hour"),
      where: t("Ghềnh đá phía tây · Cầu gỗ", "West-coast rocks · Wooden piers"),
      desc: t(
        "Trời chuyển hồng rồi tím, biển phẳng như gương — 20 phút đẹp nhất trong ngày.",
        "The sky turns pink then violet, the sea goes glassy — the best 20 minutes of the day.",
      ),
      image: { src: P("sunset-portrait", 5), pos: "center 50%" },
    },
  ],
};

// ---------- Địa điểm gợi ý ----------
export const locations = {
  eyebrow: t("Địa điểm", "Locations"),
  title: t("Những phim trường tự nhiên của đảo ngọc.", "The island's natural film sets."),
  desc: t(
    "Bin gợi ý địa điểm theo giờ chụp, mùa và concept của bạn. Chọn từng điểm để xem ảnh.",
    "Bin suggests locations based on your timing, the season and your concept. Pick a spot to preview.",
  ),
  mapLabel: t("Đảo Phú Quốc", "Phu Quoc Island"),
  studioLabel: t("Studio Bin", "Studio Bin"),
  items: [
    {
      name: t("Bãi Sao", "Sao Beach"),
      pin: { x: 205, y: 418 },
      best: t("Sáng sớm", "Early morning"),
      note: t(
        "Cát trắng mịn, nước xanh ngọc, bãi phía đông nam.",
        "Fine white sand, jade water, south-east coast.",
      ),
      image: { src: P("family-travel", 3), pos: "center 45%" },
    },
    {
      name: t("Bãi Khem", "Khem Beach"),
      pin: { x: 168, y: 446 },
      best: t("Bình minh", "Sunrise"),
      note: t(
        "Bãi riêng tư cạnh resort cao cấp, biển lặng.",
        "A private stretch next to luxury resorts, calm sea.",
      ),
      image: { src: P("wedding-beach", 10), pos: "center" },
    },
    {
      name: t("Ông Lang", "Ong Lang"),
      pin: { x: 92, y: 232 },
      best: t("Giờ vàng", "Golden hour"),
      note: t(
        "Ghềnh đá, dừa nghiêng, hoàng hôn phía tây.",
        "Rocks, leaning palms and a west-facing sunset.",
      ),
      image: { src: P("sunset-portrait", 6), pos: "center 50%" },
    },
    {
      name: t("Bãi Trường", "Truong Beach"),
      pin: { x: 118, y: 330 },
      best: t("Hoàng hôn", "Sunset"),
      note: t(
        "Bãi dài 20km, cầu gỗ và quán bar ven biển.",
        "A 20km beach with wooden piers and beach bars.",
      ),
      image: { src: P("sunset-couple", 1), pos: "center 45%" },
    },
    {
      name: t("Bãi Dài", "Dai Beach"),
      pin: { x: 86, y: 118 },
      best: t("Chiều muộn", "Late afternoon"),
      note: t(
        "Hoang sơ phía bắc đảo, ít người, nhiều cây.",
        "Wild north-coast beach, few people, lots of trees.",
      ),
      image: { src: P("beach-lookbook", 2), pos: "center 55%" },
    },
    {
      name: t("Resort & Villa", "Resorts & villas"),
      pin: { x: 166, y: 362 },
      best: t("Sáng dịu", "Soft morning"),
      note: t(
        "Kiến trúc Đông Dương, hồ bơi và sân vườn nơi bạn ở.",
        "Indochine architecture, pools and gardens where you stay.",
      ),
      image: { src: P("family-villa", 4), pos: "center 50%" },
    },
  ],
};

// ---------- Quy trình (4 bước) ----------
export const process = {
  eyebrow: t("Quy trình", "How it works"),
  title: t("Bốn bước, một bộ ảnh để đời.", "Four steps to a set you'll keep forever."),
  steps: [
    {
      n: "01",
      title: t("Trò chuyện & lên ý tưởng", "Chat & plan"),
      desc: t(
        "Nhắn Bin ngày bạn ở đảo, số người và kiểu ảnh bạn thích. Bin gợi ý concept, trang phục và báo giá rõ ràng.",
        "Tell Bin your dates, group size and the style you love. Bin suggests a concept, outfits and gives a clear quote.",
      ),
      image: { src: P("maternity", 1), pos: "center 25%" },
    },
    {
      n: "02",
      title: t("Chọn địa điểm & khung giờ", "Pick the spot & the hour"),
      desc: t(
        "Bin chọn bãi biển, resort hay ghềnh đá và khung giờ ánh sáng đẹp nhất theo mùa — bạn chỉ cần có mặt.",
        "Bin picks the beach, resort or rocks and the best light for the season — you just need to show up.",
      ),
      image: { src: P("sunset-portrait", 9), pos: "center 35%" },
    },
    {
      n: "03",
      title: t("Buổi chụp", "The session"),
      desc: t(
        "Thoải mái như đi dạo với một người bạn cầm máy. Bin quan sát, gợi ý nhẹ và bắt những khoảnh khắc thật.",
        "As relaxed as a walk with a friend who happens to carry a camera. Bin observes, nudges gently and catches the real moments.",
      ),
      image: { src: P("family-villa", 5), pos: "center 45%" },
    },
    {
      n: "04",
      title: t("Hậu kỳ & giao ảnh", "Editing & delivery"),
      desc: t(
        "Ảnh xem trước trong 24h, album online đầy đủ trong 7–10 ngày với màu phim đặc trưng của Bin.",
        "Sneak peeks within 24h, the full online gallery in 7–10 days with Bin's signature film tones.",
      ),
      image: { src: P("wedding-beach", 9), pos: "center 28%" },
    },
  ],
};

// ---------- Khoảnh khắc (dải ngang ghim) ----------
export const moments = {
  eyebrow: t("Khoảnh khắc", "Moments"),
  title: t(
    "Những khung hình khách mang về từ đảo.",
    "Frames our guests took home from the island.",
  ),
  hint: t(
    "Cuộn tiếp để lướt qua một năm chụp ảnh ở Phú Quốc",
    "Keep scrolling to browse a year of photos in Phu Quoc",
  ),
  items: [
    {
      src: P("wedding-beach", 1),
      size: "tall",
      caption: t("Lễ cưới bên biển", "Beach wedding"),
      pos: "center 25%",
    },
    {
      src: P("family-travel", 5),
      size: "wide",
      caption: t("Đường dừa", "Palm road"),
      pos: "center 55%",
    },
    {
      src: P("sunset-couple", 4),
      size: "tall",
      caption: t("Hoàng hôn Bãi Trường", "Truong Beach sunset"),
      pos: "center 40%",
    },
    {
      src: P("family-beach", 9),
      size: "tall",
      caption: t("Bước đầu tiên", "First steps"),
      pos: "center 35%",
    },
    {
      src: P("resort-editorial", 7),
      size: "wide",
      caption: t("Editorial resort", "Resort editorial"),
      pos: "center 40%",
    },
    {
      src: P("beach-lookbook", 4),
      size: "tall",
      caption: t("Khăn lụa xanh", "Blue silk"),
      pos: "center 45%",
    },
    {
      src: P("maternity", 3),
      size: "tall",
      caption: t("Chờ đón thiên thần", "Waiting for you"),
      pos: "center 25%",
    },
    {
      src: P("wedding-beach", 6),
      size: "wide",
      caption: t("Chạy ra biển", "Run to the sea"),
      pos: "center",
    },
    {
      src: P("sunset-portrait", 4),
      size: "tall",
      caption: t("Giờ vàng", "Golden hour"),
      pos: "center 30%",
    },
    {
      src: P("family-villa", 11),
      size: "tall",
      caption: t("Dưới hàng dừa", "Under the palms"),
      pos: "center 55%",
    },
    {
      src: P("family-travel", 2),
      size: "wide",
      caption: t("Áo trắng & sóng", "White shirts & surf"),
      pos: "center 45%",
    },
    {
      src: P("sunset-portrait", 10),
      size: "tall",
      caption: t("Nhảy sóng", "Into the waves"),
      pos: "center 35%",
    },
  ],
};

// ---------- Lưới ảnh "Một ngày ở Phú Quốc" (dùng nốt ảnh còn lại) ----------
export const dayGrid = {
  eyebrow: t("Một ngày với Bin", "A day with Bin"),
  title: t("Từ bình minh đến giờ xanh.", "From sunrise to blue hour."),
  items: [
    { src: P("family-beach", 4), time: "05:52", pos: "center 30%" },
    { src: P("resort-editorial", 4), time: "08:10", pos: "center 35%" },
    { src: P("family-travel", 6), time: "10:30", pos: "center 55%", wide: true },
    { src: P("beach-lookbook", 1), time: "11:45", pos: "center 30%" },
    { src: P("family-villa", 9), time: "15:20", pos: "center 40%" },
    { src: P("wedding-beach", 3), time: "16:40", pos: "center 40%", wide: true },
    { src: P("sunset-couple", 6), time: "17:55", pos: "center 30%" },
    { src: P("sunset-portrait", 11), time: "18:21", pos: "center 55%" },
  ],
};

// ---------- Đánh giá (nội dung mẫu — thay bằng review thật của khách) ----------
export const testimonials = {
  eyebrow: t("Khách nói về Bin", "Kind words"),
  title: t("Những lời nhắn sau chuyến đi.", "Notes sent after the trip."),
  note: t(
    "Nội dung mẫu, sẽ thay bằng đánh giá thật từ Google / Facebook của khách.",
    "Sample copy — to be replaced with real Google / Facebook reviews.",
  ),
  items: [
    {
      quote: t(
        "Bin biết chính xác bãi biển nào vắng người lúc 6 giờ sáng. Cả buổi chụp chúng tôi chỉ việc chơi với con, còn lại anh ấy lo hết.",
        "Bin knew exactly which beach would be empty at 6am. We just played with our kids the whole session — he took care of everything else.",
      ),
      name: "Sarah & Tom",
      role: t("Gia đình · Úc", "Family · Australia"),
      image: { src: P("family-villa", 10), pos: "center 45%" },
    },
    {
      quote: t(
        "Cô ấy không hề biết. Bin giả vờ là khách du lịch chụp hoàng hôn, và chúng tôi có trọn bộ ảnh giây phút cầu hôn.",
        "She had no idea. Bin pretended to be a tourist shooting the sunset, and we got the whole proposal on camera.",
      ),
      name: "Daniel & Mai",
      role: t("Cầu hôn · Singapore", "Proposal · Singapore"),
      image: { src: P("sunset-couple", 2), pos: "center 35%" },
    },
    {
      quote: t(
        "Ảnh cưới không giống ảnh cưới — giống một bộ phim ngắn về ngày hôm đó. Màu phim rất đẹp, giao đúng hẹn.",
        "The wedding photos don't look like wedding photos — they look like a short film of that day. Beautiful tones, delivered on time.",
      ),
      name: "Linh & Khoa",
      role: t("Lễ cưới · Hà Nội", "Wedding · Hanoi"),
      image: { src: P("wedding-beach", 11), pos: "center 35%" },
    },
  ],
};

// ---------- Liên hệ (khối mời gọi cuối trang) ----------
export const contact = {
  script: t("Hẹn gặp bạn ở Phú Quốc", "See you in Phu Quoc"),
  eyebrow: t("Liên hệ & đặt lịch", "Contact & booking"),
  title: t("Ngày nào bạn ở trên đảo?", "Which day are you on the island?"),
  desc: t(
    "Nhắn Bin qua WhatsApp, Zalo, Messenger hoặc để lại thông tin — Bin phản hồi trong ngày, kèm gợi ý địa điểm và báo giá.",
    "Message Bin on WhatsApp, Zalo or Messenger, or leave your details — Bin replies within the day with location ideas and a quote.",
  ),
  polaroids: [
    { src: P("family-beach", 8), caption: "first steps", pos: "center 40%" },
    { src: P("wedding-beach", 8), caption: "golden", pos: "center 35%", wide: true },
    { src: P("beach-lookbook", 5), caption: "blue silk", pos: "center 45%" },
    { src: P("sunset-portrait", 1), caption: "b&w", pos: "center 25%" },
  ],
};

// ---------- Popup đặt lịch ----------
export const booking = {
  title: t("Đặt lịch chụp ảnh", "Book a photo session"),
  desc: t(
    "Để lại thông tin, Bin sẽ liên hệ xác nhận lịch, gợi ý địa điểm và gửi báo giá trong ngày.",
    "Leave your details and Bin will confirm availability, suggest locations and send a quote within the day.",
  ),
  image: { src: P("sunset-couple", 5), pos: "center 35%" },
  headline: t(
    "Bạn chỉ cần có mặt.\nPhần còn lại để Bin lo.",
    "You just show up.\nBin handles the rest.",
  ),
  bullets: [
    t("Tư vấn địa điểm & khung giờ ánh sáng", "Location & light timing advice"),
    t("Giao tiếp tiếng Anh / tiếng Việt", "English / Vietnamese"),
    t("Ảnh xem trước trong 24 giờ", "Sneak peeks within 24 hours"),
  ],
  fields: {
    name: t("Họ tên", "Full name"),
    phone: t("Điện thoại / WhatsApp / Zalo", "Phone / WhatsApp / Zalo"),
    date: t("Ngày dự kiến", "Preferred date"),
    people: t("Số người", "Group size"),
    service: t("Dịch vụ quan tâm", "Service"),
    note: t(
      "Ghi chú (resort đang ở, concept, yêu cầu riêng…)",
      "Notes (your resort, concept, special requests…)",
    ),
    undecided: t("Chưa quyết định, cần tư vấn", "Not sure yet, need advice"),
    submit: t("Gửi yêu cầu", "Send request"),
    sending: t("Đang gửi…", "Sending…"),
    sent: t("Đã nhận! Bin sẽ phản hồi trong ngày.", "Received! Bin will reply within the day."),
    // Màn hình sau khi gửi thành công ({phone} = số khách vừa nhập)
    successTitle: t("Đã gửi yêu cầu thành công!", "Request sent!"),
    successDesc: t(
      "Cảm ơn bạn! Bin sẽ liên hệ qua số {phone} trong ngày để xác nhận lịch và gợi ý địa điểm.",
      "Thank you! Bin will contact you at {phone} within the day to confirm and suggest locations.",
    ),
    again: t("Gửi yêu cầu khác", "Send another request"),
    toastOkTitle: t("Đã gửi yêu cầu", "Request sent"),
    toastOkDesc: t("Bin sẽ liên hệ lại trong ngày.", "Bin will get back to you within the day."),
    toastErrTitle: t("Gửi chưa thành công", "Couldn't send your request"),
    toastErrDesc: t(
      "Vui lòng thử lại, hoặc nhắn Bin trực tiếp qua WhatsApp / Zalo.",
      "Please try again, or message Bin directly on WhatsApp / Zalo.",
    ),
    // Thông báo lỗi theo mã (lib/validation/booking.js + api/contact). {n} = số phút chờ.
    errors: {
      checkTitle: t("Vui lòng kiểm tra lại thông tin", "Please check your details"),
      name_required: t("Vui lòng nhập họ tên của bạn.", "Please enter your name."),
      name_short: t("Họ tên cần ít nhất 2 chữ cái.", "Your name needs at least 2 letters."),
      name_long: t("Họ tên tối đa 60 ký tự.", "Your name can be up to 60 characters."),
      name_invalid: t(
        "Họ tên chỉ gồm chữ cái và khoảng trắng, không chứa số hay ký hiệu.",
        "Please use letters and spaces only — no numbers or symbols.",
      ),
      phone_required: t(
        "Vui lòng nhập số điện thoại / WhatsApp / Zalo.",
        "Please enter your phone / WhatsApp number.",
      ),
      phone_invalid: t(
        "Số điện thoại chưa đúng. Ví dụ: 0384 038 453 hoặc +84 384 038 453.",
        "That phone number doesn't look right. Example: +84 384 038 453.",
      ),
      phone_intl: t(
        "Số nước ngoài cần có dấu + và mã quốc gia, ví dụ +61 412 345 678.",
        "International numbers need a + and country code, e.g. +61 412 345 678.",
      ),
      date_required: t("Vui lòng chọn ngày dự kiến chụp.", "Please choose your preferred date."),
      date_invalid: t("Ngày dự kiến không hợp lệ.", "That date isn't valid."),
      date_past: t("Ngày dự kiến không thể ở quá khứ.", "Please pick a date from today onwards."),
      date_far: t("Bin nhận lịch tối đa 2 năm tới.", "Bookings open up to 2 years ahead."),
      people_invalid: t("Số người không hợp lệ.", "Please choose a group size."),
      service_invalid: t(
        "Dịch vụ không hợp lệ, vui lòng chọn lại.",
        "Please choose a service from the list.",
      ),
      note_long: t("Ghi chú tối đa 1.000 ký tự.", "Notes can be up to 1,000 characters."),
      note_links: t(
        "Ghi chú chứa quá nhiều đường link hoặc mã HTML.",
        "Your note has too many links or HTML code.",
      ),
      too_fast: t(
        "Bạn gửi hơi nhanh — vui lòng kiểm tra lại thông tin rồi gửi lần nữa.",
        "That was quick! Please review your details and send again.",
      ),
      rate_limited_title: t("Bạn đã gửi nhiều yêu cầu", "Too many requests"),
      rate_limited: t(
        "Vui lòng thử lại sau {n} phút, hoặc nhắn Bin trực tiếp qua WhatsApp / Zalo.",
        "Please try again in {n} min, or message Bin directly on WhatsApp / Zalo.",
      ),
      offline_title: t("Mất kết nối mạng", "You're offline"),
      offline: t(
        "Kiểm tra kết nối Internet rồi gửi lại nhé.",
        "Check your connection and try again.",
      ),
      timeout: t(
        "Máy chủ phản hồi chậm, vui lòng thử lại.",
        "The server is slow to respond — please try again.",
      ),
    },
    error: t(
      "Gửi chưa thành công — vui lòng nhắn trực tiếp qua WhatsApp / Zalo.",
      "Something went wrong — please message directly on WhatsApp / Zalo.",
    ),
    or: t("Hoặc nhắn trực tiếp:", "Or message directly:"),
    privacy: t(
      "Bin chỉ dùng thông tin này để xác nhận lịch chụp.",
      "Bin only uses this information to confirm your booking.",
    ),
  },
  message: t(
    "Xin chào Studio Bin, mình muốn đặt lịch chụp ảnh:",
    "Hello Studio Bin, I'd like to book a photo session:",
  ),
};

// ---------- Trang Dịch vụ (/dich-vu) ----------
export const servicesPage = {
  meta: {
    title: t("Dịch vụ", "Services"),
    desc: t(
      "Dịch vụ chụp ảnh của Studio Bin tại Phú Quốc: ảnh cưới & pre-wedding ngoại cảnh biển, cặp đôi, cầu hôn, săn hoàng hôn, gia đình nghỉ dưỡng tại resort/villa, chân dung nghệ thuật, sự kiện và gói trọn gói makeup – trang phục – quay phim.",
      "Studio Bin photography services in Phu Quoc: beach weddings & pre-wedding, couples, proposals, sunset sessions, family holidays at resorts & villas, editorial portraits, events and all-inclusive packages with makeup, attire and film.",
    ),
  },
  hero: {
    eyebrow: t("Dịch vụ của Bin", "Bin's services"),
    title: t("Một buổi chụp,", "One session,"),
    accent: t("trọn vẹn kỳ nghỉ.", "a whole holiday kept."),
    desc: t(
      "Từ ý tưởng, địa điểm, makeup đến hậu kỳ — Bin sắp xếp mọi thứ để bạn chỉ cần tận hưởng Phú Quốc và mang về một bộ ảnh đáng nhớ.",
      "From the idea and the location to makeup and editing — Bin arranges everything so you can simply enjoy Phu Quoc and take home a set worth keeping.",
    ),
    ctaSecondary: t("Xem các dịch vụ", "See all services"),
    script: t("chụp như kể chuyện", "shot like a story"),
    images: [
      { src: P("wedding-beach", 2), pos: "center 25%" },
      { src: P("family-beach", 1), pos: "center 25%" },
      { src: P("sunset-portrait", 2), pos: "center 25%" },
    ],
    stats: [
      { value: "05", label: t("Nhóm dịch vụ", "Service groups") },
      { value: "09", label: t("Bộ sưu tập", "Collections") },
      { value: "24h", label: t("Ảnh xem trước", "Sneak peeks") },
    ],
  },
  packages: {
    eyebrow: t("Gói gợi ý", "Suggested packages"),
    title: t("Ba cách bắt đầu.", "Three ways to start."),
    desc: t(
      "Giá tuỳ theo thời lượng, địa điểm và số người. Nhắn Bin lịch trình của bạn để nhận báo giá chi tiết trong ngày.",
      "Pricing depends on duration, location and group size. Send Bin your itinerary for a detailed quote within the day.",
    ),
    items: [
      {
        name: t("Giờ vàng", "Golden Hour"),
        for: t("Cặp đôi · Cầu hôn · Chân dung", "Couples · Proposals · Portraits"),
        duration: t("60–90 phút", "60–90 minutes"),
        includes: [
          t("1 địa điểm, giờ vàng hoặc bình minh", "1 location, golden hour or sunrise"),
          t("50+ ảnh chỉnh màu", "50+ edited photos"),
          t("Album online, tải về độ phân giải cao", "Online gallery, hi-res download"),
        ],
      },
      {
        name: t("Nửa ngày", "Half Day"),
        for: t("Gia đình · Pre-wedding · Lookbook", "Families · Pre-wedding · Lookbook"),
        duration: t("3–4 giờ", "3–4 hours"),
        includes: [
          t("2–3 địa điểm, đổi trang phục", "2–3 locations, outfit changes"),
          t("120+ ảnh chỉnh màu", "120+ edited photos"),
          t("Ảnh xem trước trong 24h", "Sneak peeks within 24h"),
        ],
        featured: true,
      },
      {
        name: t("Trọn ngày", "Full Day"),
        for: t("Lễ cưới · Elopement · Sự kiện", "Weddings · Elopements · Events"),
        duration: t("8–10 giờ", "8–10 hours"),
        includes: [
          t("Theo sát từ chuẩn bị tới tiệc", "Coverage from getting ready to the party"),
          t("300+ ảnh + album in tuỳ chọn", "300+ photos + optional printed album"),
          t("Kết nối makeup, trang phục, quay phim", "Makeup, attire & film on request"),
        ],
      },
    ],
  },
  faq: {
    eyebrow: t("Câu hỏi thường gặp", "FAQ"),
    title: t(
      "Những điều khách hay hỏi trước khi bay tới đảo.",
      "What guests ask before flying to the island.",
    ),
    polaroids: [
      { src: P("family-travel", 1), caption: "holiday mode", pos: "center 35%" },
      { src: P("maternity", 4), caption: "soon", pos: "center 25%" },
    ],
    items: [
      {
        q: t("Bin có nói tiếng Anh không?", "Does Bin speak English?"),
        a: t(
          "Có. Phần lớn khách của Bin là du khách nước ngoài; mọi trao đổi, hướng dẫn trong buổi chụp và giao ảnh đều có thể bằng tiếng Anh.",
          "Yes. Most of Bin's guests travel from abroad; planning, direction during the session and delivery can all be done in English.",
        ),
      },
      {
        q: t("Nên đặt lịch trước bao lâu?", "How far in advance should I book?"),
        a: t(
          "Giờ vàng và cuối tuần thường kín trước 1–2 tuần, mùa cao điểm (tháng 11 – tháng 4) nên đặt sớm hơn. Nhắn Bin ngay khi có vé máy bay.",
          "Golden-hour and weekend slots usually fill 1–2 weeks ahead; in high season (November – April) book earlier. Message Bin as soon as you have your flights.",
        ),
      },
      {
        q: t("Bin có đến resort của tôi không?", "Will Bin come to my resort?"),
        a: t(
          "Có. Bin chụp tại resort / villa bạn đang ở trên toàn đảo, hoặc đưa bạn tới bãi biển phù hợp nhất. Một số resort cần đăng ký chụp trước — Bin sẽ hỗ trợ.",
          "Yes. Bin shoots at your resort or villa anywhere on the island, or takes you to the most suitable beach. Some resorts require advance registration — Bin will help arrange it.",
        ),
      },
      {
        q: t("Bao lâu thì nhận được ảnh?", "When do I get the photos?"),
        a: t(
          "Ảnh xem trước (sneak peeks) trong 24 giờ, album online đầy đủ trong 7–10 ngày. Khách cần gấp khi còn trên đảo có thể chọn giao nhanh.",
          "Sneak peeks within 24 hours, the full online gallery in 7–10 days. If you need photos while still on the island, express delivery is available.",
        ),
      },
      {
        q: t("Trời mưa thì sao?", "What if it rains?"),
        a: t(
          "Phú Quốc mưa thường ngắn và có báo trước. Bin theo dõi thời tiết, đổi khung giờ hoặc ngày chụp miễn phí trong thời gian bạn còn ở đảo.",
          "Rain in Phu Quoc is usually brief and predictable. Bin tracks the forecast and reschedules the hour or the day free of charge while you're still here.",
        ),
      },
      {
        q: t("Có hỗ trợ makeup và trang phục không?", "Do you offer makeup and attire?"),
        a: t(
          "Có. Gói trọn gói bao gồm makeup artist, thuê váy cưới / vest và quay phim phóng sự — phù hợp cho khách bay đến Phú Quốc với hành lý gọn nhẹ.",
          "Yes. The all-inclusive package covers a makeup artist, wedding dress / suit rental and documentary videography — ideal for guests flying in with light luggage.",
        ),
      },
    ],
  },
  cta: {
    script: t("Hẹn gặp bạn ở Phú Quốc", "See you in Phu Quoc"),
    title: t("Sẵn sàng cho buổi chụp của bạn?", "Ready for your session?"),
    desc: t(
      "Gửi Bin ngày bạn ở đảo và kiểu ảnh bạn thích — Bin sẽ gợi ý địa điểm và báo giá trong ngày.",
      "Send Bin your dates and the style you love — Bin will suggest locations and send a quote within the day.",
    ),
    bg: [
      { src: P("sunset-couple", 4), pos: "center 40%" },
      { src: P("family-beach", 3), pos: "center 25%" },
      { src: P("resort-editorial", 5), pos: "center 30%" },
    ],
  },
};

// ---------- Trang Bộ sưu tập ----------
export const collectionsPage = {
  meta: {
    title: t("Bộ sưu tập", "Portfolio"),
    desc: t(
      "Bộ sưu tập ảnh của Studio Bin tại Phú Quốc: ảnh cưới bên biển, cặp đôi hoàng hôn, maternity, gia đình tại resort & villa, chân dung editorial và lookbook bãi biển.",
      "Studio Bin's Phu Quoc portfolio: beach weddings, sunset couples, maternity, families at resorts & villas, editorial portraits and beach lookbooks.",
    ),
  },
  title: t("Bộ sưu tập của", "Portfolio by"),
  accent: t("Studio Bin.", "Studio Bin."),
  desc: t(
    "Mỗi bộ ảnh là một ngày ở Phú Quốc — từ lễ cưới bên biển tới kỳ nghỉ gia đình. Lọc theo kiểu chụp, mở album để xem trọn bộ rồi đặt lịch ngay trên trang.",
    "Every collection is one day in Phu Quoc — from a beach wedding to a family holiday. Filter by type, open an album to see the full set, then book right from the page.",
  ),
  ctaScript: t("Chưa biết chọn gì?", "Not sure what to pick?"),
  ctaTitle: t("Kể Bin nghe về chuyến đi của bạn.", "Tell Bin about your trip."),
  ctaDesc: t(
    "Ngày bạn ở đảo, nơi bạn ở và những người đi cùng — Bin sẽ gợi ý concept phù hợp nhất.",
    "Your dates, where you're staying and who's coming — Bin will suggest the concept that fits best.",
  ),
  // Nền 3 ảnh mờ cho khối mời gọi cuối trang
  ctaBg: [
    { src: P("beach-lookbook", 4), pos: "center 45%" },
    { src: P("family-beach", 9), pos: "center 35%" },
    { src: P("sunset-portrait", 10), pos: "center 35%" },
  ],
  // Hero trang bộ sưu tập: 3 cột ảnh trôi dọc
  columns: [
    [P("wedding-beach", 1), P("family-beach", 5), P("sunset-portrait", 7)],
    [P("sunset-couple", 6), P("resort-editorial", 3), P("family-villa", 8)],
    [P("beach-lookbook", 3), P("maternity", 2), P("family-travel", 1)],
  ],
};

// ---------- Footer ----------
export const footer = {
  blurb: t(
    "Nhiếp ảnh gia bản địa tại Phú Quốc — ảnh cưới, cặp đôi, gia đình và chân dung theo phong cách phóng sự tự nhiên.",
    "A local Phu Quoc photographer — weddings, couples, families and portraits in a candid, documentary style.",
  ),
  rights: t("Bảo lưu mọi quyền.", "All rights reserved."),
};
