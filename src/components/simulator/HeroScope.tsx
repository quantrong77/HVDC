"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { calculateVd, generateWaveformData } from "@/lib/hvdc-math";

const V_LL = 210;
const W = 560;
const H = 300;
const POINTS = 240;
const SWEEP_MIN = 10;
const SWEEP_MAX = 160;
const SWEEP_SECONDS = 9; // Thời gian quét một chiều

/**
 * Máy hiện sóng thu nhỏ ở hero: điện áp Vd(t) của cầu 12 xung, góc α tự quét giữa chỉnh lưu và nghịch lưu.
 * Người học có thể kéo α để tự điều khiển; quét tự động dừng khi ra khỏi màn hình hoặc khi bật giảm chuyển động.
 */
export default function HeroScope() {
  const reduceMotion = useReducedMotion();
  const [alpha, setAlpha] = useState(15);
  const [isSweeping, setIsSweeping] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = isSweeping && isVisible && !reduceMotion;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const rate = (SWEEP_MAX - SWEEP_MIN) / SWEEP_SECONDS;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setAlpha((a) => {
        let next = a + directionRef.current * rate * dt;
        if (next >= SWEEP_MAX || next <= SWEEP_MIN) {
          directionRef.current *= -1;
          next = Math.min(SWEEP_MAX, Math.max(SWEEP_MIN, next));
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const { tracePath, avgY, metrics, scale } = useMemo(() => {
    const data = generateWaveformData({ alphaDeg: alpha, muDeg: 0, vLL: V_LL, frequency: 50, is12Pulse: true }, POINTS);
    const m = calculateVd(V_LL, alpha, { is12Pulse: true });
    const vScale = (H / 2 - 18) / (m.vd0 * 1.05);
    const toY = (v: number) => H / 2 - v * vScale;
    const d = data.map((p, i) => `${i === 0 ? "M" : "L"}${((p.wt / 360) * W).toFixed(1)} ${toY(p.voltage).toFixed(1)}`).join(" ");
    return { tracePath: d, avgY: toY(m.vd), metrics: m, scale: vScale };
  }, [alpha]);

  const isInverter = metrics.vd < -5;
  const isZero = Math.abs(metrics.vd) <= 5;
  const tone = isZero ? "#8E9DBE" : isInverter ? "#f59e0b" : "#34d399";

  return (
    <div ref={containerRef} className="theme-dark w-full lg:w-[520px] shrink-0">
      <div className="relative rounded-2xl border border-slate-700/80 bg-[#071230] shadow-[inset_0_0_60px_rgba(34,211,238,0.06)] overflow-hidden">
        {/* Thanh đầu máy hiện sóng */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 text-[11px] text-slate-400">
          <span>
            CH1 · Vd(t) cầu 12 xung · <span className="font-mono">{Math.round(H / 8 / scale / 10) * 10} kV/div</span>
          </span>
          <button
            onClick={() => setIsSweeping((v) => !v)}
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-800 text-slate-300"
            aria-label={isSweeping ? "Dừng quét góc α" : "Tự động quét góc α"}
            disabled={!!reduceMotion}
          >
            {isSweeping && !reduceMotion ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSweeping && !reduceMotion ? "Đang quét" : "Quét α"}
          </button>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label={`Dạng sóng điện áp DC với α = ${Math.round(alpha)} độ, Vd = ${metrics.vd} kV`}>
          <defs>
            <filter id="phosphor" x="-5%" y="-20%" width="110%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Lưới 12 × 8 ô */}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={(i * W) / 12} x2={(i * W) / 12} y1={0} y2={H} stroke="#13284F" strokeWidth={i % 6 === 0 ? 1.2 : 0.6} />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1={0} x2={W} y1={(i * H) / 8} y2={(i * H) / 8} stroke="#13284F" strokeWidth={i === 4 ? 1.4 : 0.6} />
          ))}
          <line x1={0} x2={W} y1={avgY} y2={avgY} stroke={tone} strokeDasharray="6 5" strokeWidth={1.4} opacity={0.9} />
          <path d={tracePath} fill="none" stroke="#5eead4" strokeWidth={2} filter="url(#phosphor)" strokeLinejoin="round" />
        </svg>

        {/* Số đo */}
        <div className="grid grid-cols-3 border-t border-slate-800 text-xs">
          <div className="px-4 py-3">
            <p className="text-slate-500">Góc kích α</p>
            <p className="font-mono text-lg text-white tabular-nums">{Math.round(alpha)}°</p>
          </div>
          <div className="px-4 py-3 border-l border-slate-800">
            <p className="text-slate-500">Vd trung bình</p>
            <p className="font-mono text-lg tabular-nums" style={{ color: tone }}>
              {metrics.vd > 0 ? "+" : ""}
              {Math.round(metrics.vd)} kV
            </p>
          </div>
          <div className="px-4 py-3 border-l border-slate-800">
            <p className="text-slate-500">Chế độ</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: tone }}>
              {isZero ? "Vd ≈ 0" : isInverter ? "Nghịch lưu" : "Chỉnh lưu"}
            </p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <input
            type="range"
            min={0}
            max={180}
            value={Math.round(alpha)}
            onChange={(e) => {
              setIsSweeping(false);
              setAlpha(Number(e.target.value));
            }}
            aria-label="Góc kích α"
            className="hvdc-range w-full cursor-pointer"
            style={{ "--range-fill": `${(alpha / 180) * 100}%`, "--range-color": tone } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  );
}
