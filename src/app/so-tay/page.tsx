import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import HandbookView from "@/components/handbook/HandbookView";
import { parseHandbook } from "@/lib/handbook";

export const metadata: Metadata = {
  title: "Sổ tay tự học HVDC | Nghiên Cứu HVDC",
  description: "LCC và VSC, vận hành – bảo trì, lựa chọn thiết bị trạm HVDC và tiêu chuẩn IEC áp dụng.",
};

// Đọc lúc build (xuất tĩnh), nội dung gốc ở src/content/so-tay-hvdc.md
export default function HandbookPage() {
  const md = fs.readFileSync(path.join(process.cwd(), "src", "content", "so-tay-hvdc.md"), "utf8");
  return <HandbookView handbook={parseHandbook(md)} />;
}
