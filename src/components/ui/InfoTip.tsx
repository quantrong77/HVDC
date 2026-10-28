"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

/** Hộp gợi ý: hiện khi trỏ chuột, khi focus bằng bàn phím, hoặc khi chạm (mobile); Esc để đóng */
function useTip(align: "start" | "end" = "start") {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const boxRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  // Không để hộp tràn khỏi mép phải màn hình
  useLayoutEffect(() => {
    if (!open || !boxRef.current) return setShift(0);
    const rect = boxRef.current.getBoundingClientRect();
    const right = rect.right - (window.innerWidth - 8);
    const left = 8 - rect.left;
    setShift(right > 0 ? -right : left > 0 ? left : 0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const box = (text: React.ReactNode) =>
    open ? (
      <span
        ref={boxRef}
        id={id}
        role="tooltip"
        style={{ transform: `translateX(${shift}px)` }}
        className={`absolute ${align === "end" ? "right-0" : "left-0"} top-full mt-1.5 z-40 w-64 max-w-[80vw] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-normal normal-case leading-relaxed text-slate-200 shadow-xl text-left whitespace-normal`}
      >
        {text}
      </span>
    ) : null;

  const handlers = {
    // Chỉ chuột mới mở khi trỏ; chạm trên mobile mở qua focus/click
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setOpen(true),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  };
  return { open, setOpen, id, box, handlers };
}

/** Biểu tượng (i) cạnh nhãn: trỏ, focus hoặc chạm để xem giải thích */
export default function InfoTip({ text, label = "Giải thích" }: { text: React.ReactNode; label?: string }) {
  const tip = useTip();
  return (
    <span className="relative inline-flex align-middle" {...tip.handlers}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={tip.open ? tip.id : undefined}
        aria-expanded={tip.open}
        onClick={(e) => {
          e.preventDefault();
          tip.setOpen(true);
        }}
        className="ml-1 inline-flex items-center justify-center rounded-full text-slate-500 hover:text-cyan-400 focus-visible:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
      >
        <Info className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      {tip.box(text)}
    </span>
  );
}

/** Bọc một phần tử (nút, thẻ) để hiện gợi ý khi trỏ hoặc focus vào nó */
export function HoverTip({
  text,
  children,
  className = "",
  align = "start",
}: {
  text: React.ReactNode;
  children: React.ReactElement;
  className?: string;
  align?: "start" | "end"; // "end": hộp canh theo mép phải, dùng cho nút nằm sát mép phải khung có overflow-hidden
}) {
  const tip = useTip(align);
  return (
    <span className={`relative inline-flex ${className}`} {...tip.handlers}>
      {React.cloneElement(children, { "aria-describedby": tip.open ? tip.id : undefined })}
      {tip.box(text)}
    </span>
  );
}
