"use client";

import React, { useEffect, useRef } from "react";

/**
 * Đồ thị canvas gọn nhẹ cho phòng lab góc kích (hàng nghìn điểm mỗi lần kéo thanh trượt, nhanh hơn SVG).
 * Lab luôn là "màn hình HMI" tối nên bảng màu cố định, không theo theme trang.
 */

export const HMI = {
  grid: "#1E2F57",
  axis: "#485A82",
  muted: "#8E9DBE",
  ink: "#E2EAEE",
  accent: "#22d3ee",
  // Màu pha theo quy ước Việt Nam: A vàng, B xanh lá, C đỏ
  pa: "#e3b93e",
  pb: "#4cc38a",
  pc: "#ef6b5b",
  vd: "#7fa9f2",
  vd2: "#c591e3",
  good: "#56c48a",
  crit: "#ef6b5b",
  warn: "#e0a63b",
};

export const fmtVi = (x: number | null | undefined, d = 1) => (x == null || !isFinite(x) ? "—" : x.toFixed(d).replace(".", ","));

export interface Series {
  x: number[];
  y: (number | null)[];
  color: string;
  name?: string;
  width?: number;
  dash?: number[];
}

export interface PlotSpec {
  title: string;
  xmin: number;
  xmax: number;
  xstep: number;
  ymin: number;
  ymax: number;
  ystep: number;
  ydec?: number;
  xfmt?: (x: number) => string;
  xlabel?: string;
  series?: Series[];
  bands?: { x0: number; x1: number; color: string; alpha?: number }[];
  vlines?: { x: number; color: string; label?: string; dy?: number }[];
  hlines?: { y: number; color: string; label?: string }[];
  bars?: { x: number; y: number; color: string }[];
  points?: { x: number; y: number; color: string; label?: string; align?: "left" | "right" }[];
  marks?: { x: number; color: string; label?: string }[];
  labels?: { x: number; y: number; text: string; color: string; align?: CanvasTextAlign }[];
}

const ticks = (a: number, b: number, s: number) => {
  const r: number[] = [];
  for (let v = Math.ceil(a / s - 1e-9) * s; v <= b + 1e-9; v += s) r.push(+v.toFixed(6));
  return r;
};

function draw(cv: HTMLCanvasElement, o: PlotSpec, h: number) {
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth || 600;
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const m = { l: 50, r: 12, t: 26, b: o.xlabel ? 34 : 24 };
  const pw = w - m.l - m.r;
  const ph = h - m.t - m.b;
  const X = (x: number) => m.l + ((x - o.xmin) / (o.xmax - o.xmin)) * pw;
  const Y = (y: number) => m.t + ((o.ymax - y) / (o.ymax - o.ymin)) * ph;
  const mono = '11px ui-monospace, "SFMono-Regular", Consolas, monospace';
  const sans = "system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.clearRect(0, 0, w, h);
  ctx.font = mono;

  (o.bands ?? []).forEach((b) => {
    ctx.fillStyle = b.color;
    ctx.globalAlpha = b.alpha ?? 0.14;
    const x0 = X(Math.max(b.x0, o.xmin));
    ctx.fillRect(x0, m.t, X(Math.min(b.x1, o.xmax)) - x0, ph);
    ctx.globalAlpha = 1;
  });

  ctx.strokeStyle = HMI.grid;
  ctx.fillStyle = HMI.muted;
  ctx.lineWidth = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ticks(o.xmin, o.xmax, o.xstep).forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(X(x) + 0.5, m.t);
    ctx.lineTo(X(x) + 0.5, m.t + ph);
    ctx.stroke();
    ctx.fillText(o.xfmt ? o.xfmt(x) : String(x), X(x), m.t + ph + 5);
  });
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ticks(o.ymin, o.ymax, o.ystep).forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(m.l, Y(y) + 0.5);
    ctx.lineTo(m.l + pw, Y(y) + 0.5);
    ctx.stroke();
    ctx.fillText(fmtVi(y, o.ydec ?? 0), m.l - 6, Y(y));
  });
  if (o.ymin < 0 && o.ymax > 0) {
    ctx.strokeStyle = HMI.axis;
    ctx.beginPath();
    ctx.moveTo(m.l, Y(0) + 0.5);
    ctx.lineTo(m.l + pw, Y(0) + 0.5);
    ctx.stroke();
  }
  if (o.xlabel) {
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = HMI.muted;
    ctx.fillText(o.xlabel, m.l + pw, h - 1);
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(m.l, m.t - 2, pw, ph + 4);
  ctx.clip();
  (o.vlines ?? []).forEach((v) => {
    ctx.strokeStyle = v.color;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(X(v.x) + 0.5, m.t);
    ctx.lineTo(X(v.x) + 0.5, m.t + ph);
    ctx.stroke();
    ctx.setLineDash([]);
    if (v.label) {
      ctx.fillStyle = v.color;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(v.label, X(v.x) + 4, m.t + 3 + (v.dy ?? 0));
    }
  });
  (o.hlines ?? []).forEach((v) => {
    ctx.strokeStyle = v.color;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(m.l, Y(v.y) + 0.5);
    ctx.lineTo(m.l + pw, Y(v.y) + 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
    if (v.label) {
      ctx.fillStyle = v.color;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(v.label, m.l + pw - 4, Y(v.y) - 2);
    }
  });
  (o.bars ?? []).forEach((b) => {
    ctx.fillStyle = b.color;
    const bw = Math.max(1.5, (pw / (o.xmax - o.xmin)) * 0.7);
    ctx.fillRect(X(b.x) - bw / 2, Y(b.y), bw, Y(0) - Y(b.y));
  });
  (o.series ?? []).forEach((s) => {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width ?? 1.5;
    ctx.setLineDash(s.dash ?? []);
    ctx.lineJoin = "round";
    ctx.beginPath();
    let pen = false;
    for (let i = 0; i < s.x.length; i++) {
      const y = s.y[i];
      if (y == null || !isFinite(y)) {
        pen = false;
        continue;
      }
      const px = X(s.x[i]);
      const py = Y(y);
      if (!pen) {
        ctx.moveTo(px, py);
        pen = true;
      } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  });
  (o.points ?? []).forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(X(p.x), Y(p.y), 6, 0, 7);
    ctx.fill();
    if (p.label) {
      ctx.font = `600 12px ${sans}`;
      ctx.textAlign = p.align ?? "left";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = HMI.ink;
      ctx.fillText(p.label, X(p.x) + (p.align === "right" ? -8 : 8), Y(p.y) - 6);
      ctx.font = mono;
    }
  });
  (o.marks ?? []).forEach((p) => {
    ctx.fillStyle = p.color;
    const px = X(p.x);
    ctx.beginPath();
    ctx.moveTo(px, m.t + ph);
    ctx.lineTo(px - 4, m.t + ph - 8);
    ctx.lineTo(px + 4, m.t + ph - 8);
    ctx.closePath();
    ctx.fill();
    if (p.label) {
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(p.label, px, m.t + ph - 10);
    }
  });
  (o.labels ?? []).forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.font = `600 11.5px ${sans}`;
    ctx.textAlign = p.align ?? "left";
    ctx.textBaseline = "middle";
    ctx.fillText(p.text, X(p.x), Y(p.y));
  });
  ctx.restore();

  ctx.font = `600 12.5px ${sans}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = HMI.ink;
  ctx.fillText(o.title, m.l, 16);
  // Chú giải xếp từ phải sang, bỏ qua nếu tràn vào tiêu đề (màn hình hẹp)
  const titleEnd = m.l + ctx.measureText(o.title).width + 12;
  let lx = w - m.r;
  ctx.font = `11.5px ${sans}`;
  ctx.textAlign = "right";
  [...(o.series ?? [])]
    .filter((s) => s.name)
    .reverse()
    .forEach((s) => {
      const tw = ctx.measureText(s.name!).width;
      if (lx - tw - 20 < titleEnd) return;
      ctx.fillStyle = HMI.muted;
      ctx.fillText(s.name!, lx, 16);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.5;
      ctx.setLineDash(s.dash ?? []);
      ctx.beginPath();
      ctx.moveTo(lx - tw - 20, 12);
      ctx.lineTo(lx - tw - 6, 12);
      ctx.stroke();
      ctx.setLineDash([]);
      lx -= tw + 30;
    });
}

/** Một khung đồ thị; vẽ lại khi dữ liệu đổi hoặc khi khung đổi kích thước */
export default function CanvasPlot({ spec, height = 200, label }: { spec: PlotSpec; height?: number; label?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const specRef = useRef(spec);
  specRef.current = spec;

  useEffect(() => {
    if (ref.current) draw(ref.current, spec, height);
  }, [spec, height]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ro = new ResizeObserver(() => draw(cv, specRef.current, height));
    ro.observe(cv);
    return () => ro.disconnect();
  }, [height]);

  return (
    <figure className="bg-slate-950 rounded-xl border border-slate-800 px-3 pt-2.5 pb-1.5 min-w-0">
      <canvas ref={ref} role="img" aria-label={label ?? spec.title} className="block w-full" style={{ height }} />
    </figure>
  );
}

/** Lục giác vector không gian của SVPWM, vector đặt và hai thành phần T1, T2 */
export function SvHexagon({ v, theta, sector, t1, t2, over }: { v: number; theta: number; sector: number; t1: number; t2: number; over: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const args = useRef({ v, theta, sector, t1, t2, over });
  args.current = { v, theta, sector, t1, t2, over };

  const paint = () => {
    const cv = ref.current;
    if (!cv) return;
    const size = Math.min(300, cv.clientWidth || 300);
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(size * dpr);
    cv.height = Math.round(size * dpr);
    cv.style.height = `${size}px`;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const { v: V, theta: th, sector: sec, t1: T1, t2: T2, over: ov } = args.current;
    const D = Math.PI / 180;
    const cx = size / 2;
    const cy = size / 2;
    const sc = (size / 2 - 30) / (2 / 3);
    const P = (r: number, a: number): [number, number] => [cx + r * sc * Math.cos(a * D), cy - r * sc * Math.sin(a * D)];
    const states = ["100", "110", "010", "011", "001", "101"];
    ctx.strokeStyle = HMI.grid;
    ctx.lineWidth = 1;
    for (let k = 0; k < 6; k++) {
      const [x, y] = P(2 / 3, 60 * k);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.strokeStyle = HMI.muted;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) {
      const [x, y] = P(2 / 3, 60 * k);
      if (k) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, sc / Math.sqrt(3), 0, 7);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "11px ui-monospace, Consolas, monospace";
    ctx.fillStyle = HMI.muted;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let k = 0; k < 6; k++) {
      const [x, y] = P(2 / 3 + 0.1, 60 * k);
      ctx.fillText(`V${k + 1} ${states[k]}`, x, y);
    }
    ctx.fillText("V0 000 / V7 111", cx, cy + 14);
    const ax = ((T1 * 2) / 3) * sc * Math.cos(60 * sec * D);
    const ay = -((T1 * 2) / 3) * sc * Math.sin(60 * sec * D);
    const bx = ((T2 * 2) / 3) * sc * Math.cos(60 * (sec + 1) * D);
    const by = -((T2 * 2) / 3) * sc * Math.sin(60 * (sec + 1) * D);
    const [xe, ye] = P(V, th);
    const arrow = (x0: number, y0: number, x: number, y: number, col: string, wd: number) => {
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = wd;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x, y);
      ctx.stroke();
      const a = Math.atan2(y - y0, x - x0);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 9 * Math.cos(a - 0.4), y - 9 * Math.sin(a - 0.4));
      ctx.lineTo(x - 9 * Math.cos(a + 0.4), y - 9 * Math.sin(a + 0.4));
      ctx.closePath();
      ctx.fill();
    };
    arrow(cx, cy, cx + ax, cy + ay, HMI.pb, 2);
    arrow(cx + ax, cy + ay, cx + ax + bx, cy + ay + by, HMI.pc, 2);
    arrow(cx, cy, xe, ye, ov ? HMI.warn : HMI.accent, 2.6);
    ctx.fillStyle = HMI.ink;
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.fillText("Vref", xe + (xe > cx ? 16 : -16), ye - 8);
  };

  useEffect(paint);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ro = new ResizeObserver(() => paint());
    ro.observe(cv);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} role="img" aria-label={`Lục giác vector không gian, sector ${sector + 1}`} className="block w-full max-w-[300px] mx-auto" />;
}
