/**
 * Chia ảnh thành các hàng "justified" (mỗi hàng cao bằng nhau, lấp kín chiều ngang, ảnh không bị cắt),
 * giữ nguyên thứ tự ảnh. Quy hoạch động chọn điểm ngắt hàng sao cho chiều cao các hàng gần `height` nhất.
 *
 * - ratios: tỉ lệ w/h của từng ảnh
 * - width / height / gap: khổ khung giả định (px) — hàng hiển thị theo %, nên co giãn đúng ở mọi bề rộng
 * - Hàng cuối thiếu ảnh không bị kéo phình: giữ chiều cao `height` và căn giữa (fill < 1)
 *
 * Trả về [{ items: [index...], fill }] — fill = tỉ lệ bề rộng hàng so với khung (1 = lấp kín).
 */
export function justifyRows(ratios, { width, height, gap, maxPerRow = 6 }) {
  const n = ratios.length;
  const best = new Array(n + 1).fill(Infinity);
  const cut = new Array(n + 1).fill(0);
  best[0] = 0;

  const rowHeight = (i, j) => {
    let sum = 0;
    for (let k = i; k < j; k++) sum += ratios[k];
    return (width - gap * (j - i - 1)) / sum;
  };

  for (let j = 1; j <= n; j++) {
    for (let i = Math.max(0, j - maxPerRow); i < j; i++) {
      const h = rowHeight(i, j);
      const last = j === n;
      // Hàng cuối "thiếu" (cao hơn mức chuẩn) sẽ được thu về đúng chiều cao chuẩn → phạt nhẹ thay vì phạt nặng
      const dev = last && h > height ? ((h - height) / height) * 0.35 : (h - height) / height;
      const cost = best[i] + dev * dev;
      if (cost < best[j]) {
        best[j] = cost;
        cut[j] = i;
      }
    }
  }

  const rows = [];
  for (let j = n; j > 0; j = cut[j]) rows.unshift([cut[j], j]);
  return rows.map(([i, j]) => {
    const items = Array.from({ length: j - i }, (_, k) => i + k);
    const h = rowHeight(i, j);
    const gaps = gap * (j - i - 1);
    // Chỉ hàng cuối mới có thể không lấp kín: thu về chiều cao chuẩn → bề rộng = phần ảnh co lại + khe
    const fill = j === n && h > height ? ((width - gaps) * (height / h) + gaps) / width : 1;
    return { items, fill };
  });
}
