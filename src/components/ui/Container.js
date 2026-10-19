import { cn } from "@/lib/utils";

// wide: giữ để tương thích, mọi Container đều cùng một chiều rộng
export default function Container({
  as: Tag = "div",
  wide = false,
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        // Một khung thống nhất cho toàn site: 1440px trừ lề 64px = 1312px nội dung (khớp header)
        "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
