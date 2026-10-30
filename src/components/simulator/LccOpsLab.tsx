"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

// Trình mô phỏng vận hành là một trang HTML độc lập trong public/labs (cùng nguồn gốc), nhúng bằng iframe.
// Ảnh tĩnh và trang trong public/ không tự nhận basePath (GitHub Pages phục vụ dưới /HVDC)
const SRC = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/labs/hvdc-lcc-ops.html`;

type FrameWindow = Window & { hvdcOffscreen?: boolean };

/** Mô phỏng vận hành liên kết HVDC LCC hai trạm A ↔ B (mô hình giá trị trung bình) */
export default function LccOpsLab() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1600);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let resize: ResizeObserver | null = null;

    // Khung cao theo nội dung trang nhúng để không có thanh cuộn lồng nhau
    const onLoad = () => {
      const doc = frame.contentDocument;
      if (!doc) return;
      // Đo body (không đo documentElement vì nó luôn ít nhất bằng chiều cao khung hiện tại)
      const fit = () => setHeight(Math.ceil(doc.body.getBoundingClientRect().height));
      fit();
      resize?.disconnect();
      resize = new ResizeObserver(fit);
      resize.observe(doc.body);
    };
    frame.addEventListener("load", onLoad);
    if (frame.contentDocument?.readyState === "complete") onLoad();

    // Khung khuất khỏi màn hình thì trang nhúng thôi vẽ đồ thị (mô phỏng vẫn chạy)
    const seen = new IntersectionObserver(([e]) => {
      const win = frame.contentWindow as FrameWindow | null;
      if (win) win.hvdcOffscreen = !e.isIntersecting;
    });
    seen.observe(frame);

    return () => {
      frame.removeEventListener("load", onLoad);
      resize?.disconnect();
      seen.disconnect();
    };
  }, []);

  return (
    <div className="theme-dark rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-800 text-xs text-slate-400">
        <span>Mô hình giá trị trung bình, lưới 220 kV, cầu 12 xung hai đầu. Bấm Deblock để bắt đầu; phím cách để tạm dừng khi con trỏ ở trong khung.</span>
        <a href={SRC} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
          Mở toàn màn hình
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="sr-only">(mở trang mới)</span>
        </a>
      </div>
      <iframe
        ref={ref}
        src={`${SRC}?embed=1`}
        title="Mô phỏng vận hành liên kết HVDC LCC A ↔ B"
        loading="lazy"
        className="block w-full border-0"
        style={{ height }}
      />
    </div>
  );
}
