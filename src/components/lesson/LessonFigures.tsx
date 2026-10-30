"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, ImageIcon, Maximize2, X } from "lucide-react";
import { LICENSE_URL, LessonFigure, commonsUrl } from "@/data/lesson-figures";

// Ảnh tĩnh trong public/ không tự nhận basePath (GitHub Pages phục vụ dưới /HVDC)
const src = (f: LessonFigure) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${f.dir ?? "level0"}/${f.file}`;

function Credit({ f }: { f: LessonFigure }) {
  // Hình của giáo trình khóa học: chỉ cần ghi số hình để đối chiếu
  if (!f.commons) return <p className="text-[11px] text-slate-500 leading-snug">Nguồn: {f.author}</p>;
  const lic = LICENSE_URL[f.license];
  return (
    <p className="text-[11px] text-slate-500 leading-snug">
      Ảnh: {f.author},{" "}
      {lic ? (
        <a href={lic} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-cyan-300">
          {f.license}
        </a>
      ) : (
        f.license
      )}
      ,{" "}
      <a href={commonsUrl(f.commons)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 underline decoration-dotted hover:text-cyan-300">
        Wikimedia Commons
        <ExternalLink className="w-3 h-3" aria-hidden="true" />
        <span className="sr-only">(mở trang mới)</span>
      </a>
    </p>
  );
}

/** Khung ảnh: sơ đồ (nền trắng của file gốc) đặt trên nền trắng thật để đọc được ở cả hai giao diện sáng và tối */
function Frame({ f, className = "" }: { f: LessonFigure; className?: string }) {
  return (
    <span className={`block rounded-lg overflow-hidden border border-slate-800 ${className}`} style={f.photo ? undefined : { background: "#fff" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src(f)} alt={f.title} loading="lazy" decoding="async" className={`block w-full ${f.photo ? "object-cover" : "object-contain p-2"} max-h-[230px]`} />
    </span>
  );
}

function Lightbox({ f, onClose }: { f: LessonFigure; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={f.title} className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80" aria-hidden="true" />
      <figure className="relative max-w-5xl w-full max-h-full overflow-auto rounded-2xl bg-slate-900 border border-slate-700 p-4 sm:p-5" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng ảnh"
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="block rounded-lg overflow-hidden mt-8" style={f.photo ? undefined : { background: "#fff" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src(f)} alt={f.title} className={`block mx-auto max-h-[68vh] w-auto max-w-full object-contain ${f.photo ? "" : "p-3"}`} />
        </span>
        <figcaption className="mt-4 space-y-1.5">
          <p className="text-base font-semibold text-white">{f.title}</p>
          <p className="text-sm text-slate-300 leading-relaxed">{f.caption}</p>
          <Credit f={f} />
        </figcaption>
      </figure>
    </div>
  );
}

/**
 * Hình minh họa của bài. `variant="aside"`: cột phải dính theo khi cuộn (màn hình rộng);
 * `variant="strip"`: dải ảnh vuốt ngang ngay dưới ý chính (màn hình hẹp).
 */
export default function LessonFigures({ figures, variant }: { figures: LessonFigure[]; variant: "aside" | "strip" | "inline" }) {
  const [open, setOpen] = useState<LessonFigure | null>(null);
  if (figures.length === 0) return null;

  const heading = (
    <h2 className="flex items-center gap-2 text-sm font-bold text-white">
      <ImageIcon className="w-4 h-4 text-cyan-400" />
      Hình minh họa ({figures.length})
    </h2>
  );

  const card = (f: LessonFigure, cls: string) => (
    <li key={f.file + f.title} className={cls}>
      <figure className="rounded-xl border border-slate-800 bg-slate-900 p-3 h-full">
        <button type="button" onClick={() => setOpen(f)} className="group relative block w-full text-left" aria-label={`Phóng to: ${f.title}`}>
          <Frame f={f} />
          <span className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition" aria-hidden="true">
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        </button>
        <figcaption className="mt-2.5 space-y-1">
          <p className="text-[13px] font-semibold text-white leading-snug">{f.title}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{f.caption}</p>
          <Credit f={f} />
        </figcaption>
      </figure>
    </li>
  );

  return (
    <>
      {variant === "inline" ? (
        // Chèn giữa văn bản (trang Sổ tay): lưới 1–2 cột, không tiêu đề riêng
        <ul aria-label="Hình minh họa" className={`my-5 grid gap-3 ${figures.length > 1 ? "sm:grid-cols-2" : "max-w-md"}`}>
          {figures.map((f) => card(f, "relative"))}
        </ul>
      ) : variant === "aside" ? (
        <aside aria-label="Hình minh họa" className="hidden xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 pb-4 space-y-3">
            {heading}
            <p className="text-xs text-slate-500">Bấm vào hình để phóng to. Hình vẽ của giáo trình đặt trước, sau đó là ảnh thiết bị thật từ Wikimedia Commons (giấy phép mở).</p>
            <ul className="space-y-3">{figures.map((f) => card(f, "relative"))}</ul>
          </div>
        </aside>
      ) : (
        <section aria-label="Hình minh họa" className="xl:hidden py-6 border-t border-slate-800">
          {heading}
          <p className="mt-1 mb-3 text-xs text-slate-500">Vuốt ngang để xem thêm, bấm vào hình để phóng to.</p>
          <ul className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">{figures.map((f) => card(f, "relative snap-start shrink-0 w-[78%] sm:w-[46%]"))}</ul>
        </section>
      )}
      {open && <Lightbox f={open} onClose={() => setOpen(null)} />}
    </>
  );
}
