import NotFoundView from "@/components/sections/NotFoundView";

// 404 bên trong khung site (vd. /bo-suu-tap/album-khong-ton-tai): menu, footer giữ nguyên, nội dung dùng chung
export default function NotFound() {
  return (
    <>
      <title>Không tìm thấy trang · Page not found | Studio Bin</title>
      <NotFoundView />
    </>
  );
}
