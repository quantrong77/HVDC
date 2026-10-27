import fs from "node:fs";
import path from "node:path";
import React from "react";

/**
 * Khung logo EVNNPT.
 * Đặt file logo chính thức của đơn vị vào public/brand/ với một trong các tên dưới đây,
 * build lại là logo tự hiện. Chưa có file thì hiển thị chữ "EVNNPT" theo màu nhận diện.
 */
const LOGO_CANDIDATES = ["evnnpt-logo.svg", "evnnpt-logo.png", "evnnpt-logo.webp"];

function findLogo(): string | null {
  const dir = path.join(process.cwd(), "public", "brand");
  const file = LOGO_CANDIDATES.find((name) => fs.existsSync(path.join(dir, name)));
  // Ảnh tĩnh trong public/ không tự nhận basePath (GitHub Pages phục vụ dưới /HVDC)
  return file ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/${file}` : null;
}

export default function BrandMark({ compact = false }: { compact?: boolean }) {
  const logo = findLogo();

  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element -- logo do đơn vị cung cấp, kích thước không cố định
    return <img src={logo} alt="EVNNPT" className={compact ? "h-7 w-auto" : "h-9 w-auto"} />;
  }

  return (
    <span className={`font-extrabold tracking-tight leading-none ${compact ? "text-lg" : "text-xl"}`} aria-label="EVNNPT">
      <span className="text-cyan-500">EVN</span>
      <span className="text-npt italic">NPT</span>
    </span>
  );
}
