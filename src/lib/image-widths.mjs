// Cỡ ảnh dùng chung cho next.config.mjs, loader và script tạo ảnh (scripts/build-images.mjs).
// VARIANT_WIDTHS được tạo sẵn; ORIGINAL_WIDTH trở lên dùng thẳng ảnh gốc (cạnh dài ảnh gốc ≤ 2048px).
export const IMAGE_SIZES = [256, 384];
export const DEVICE_SIZES = [640, 960, 1280, 1600, 2048];
export const ORIGINAL_WIDTH = 2048;
export const VARIANT_WIDTHS = [...IMAGE_SIZES, ...DEVICE_SIZES].filter((w) => w < ORIGINAL_WIDTH);
