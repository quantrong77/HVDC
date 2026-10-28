"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Cpu, Play, RotateCcw } from "lucide-react";
import RangeSlider from "@/components/ui/RangeSlider";
import { VSC_DEFAULT_SCENARIO, VSC_DURATION, VSC_EVENTS, VscSample, VscScenario, simulateVscHvdc } from "@/lib/vsc-hvdc";

const PLAY_MS = 2600;

const PRESETS: { label: string; patch: Partial<VscScenario> }[] = [
  { label: "Kịch bản chuẩn", patch: {} },
  { label: "Đảo chiều công suất", patch: { p1Step: -0.8 } },
  { label: "Lưới nhận yếu (SCR 1,5)", patch: { scr2: 1.5 } },
  { label: "Chạm giới hạn dòng", patch: { p1Step: 1.1, q2Step: 0.6, scr2: 6 } },
];

const EVENTS = [
  { t: VSC_EVENTS.p1, label: "P1" },
  { t: VSC_EVENTS.q1, label: "Q1" },
  { t: VSC_EVENTS.q2, label: "Q2" },
];

const fmt = (v: number) => v.toFixed(2);

function TimeChart({
  data,
  title,
  lines,
  domain,
}: {
  data: VscSample[];
  title: string;
  lines: { key: keyof VscSample; name: string; color: string; dashed?: boolean }[];
  domain: [number | "auto", number | "auto"];
}) {
  return (
    <figure className="bg-slate-950 rounded-xl border border-slate-800 p-3">
      <figcaption className="text-xs font-medium text-slate-300 mb-1">{title}</figcaption>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 10, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2F57" />
            <XAxis dataKey="t" type="number" domain={[0, VSC_DURATION]} ticks={[0, 1, 2, 3, 4, 5]} stroke="#66779C" fontSize={10} unit=" s" />
            <YAxis stroke="#66779C" fontSize={10} domain={domain} tickFormatter={fmt} width={48} />
            <Tooltip
              contentStyle={{ background: "#0A1633", border: "1px solid #1E2F57", borderRadius: 8, fontSize: 12 }}
              labelFormatter={(t) => `t = ${Number(t).toFixed(2)} s`}
              formatter={(v: number) => `${v.toFixed(3)} pu`}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="plainline" />
            {EVENTS.map((e) => (
              <ReferenceLine key={e.label} x={e.t} stroke="#485A82" strokeDasharray="4 4" />
            ))}
            {lines.map((l) => (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.name}
                stroke={l.color}
                strokeWidth={2}
                strokeDasharray={l.dashed ? "5 3" : undefined}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

/** Miền P-Q: đường tròn |S| = Smax và điểm làm việc cuối của hai trạm */
function PqDiagram({ sMax, points }: { sMax: number; points: { p: number; q: number; color: string; label: string }[] }) {
  const size = 220;
  const c = size / 2;
  const scale = (c - 18) / 1.3;
  return (
    <figure className="bg-slate-950 rounded-xl border border-slate-800 p-3">
      <figcaption className="text-xs font-medium text-slate-300 mb-1">Miền P-Q của bộ biến đổi (pu)</figcaption>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto h-auto" role="img" aria-label={`Miền làm việc P-Q, bán kính ${sMax.toFixed(2)} pu`}>
        <line x1={8} x2={size - 8} y1={c} y2={c} stroke="#485A82" />
        <line x1={c} x2={c} y1={8} y2={size - 8} stroke="#485A82" />
        <text x={size - 10} y={c - 5} fill="#8E9DBE" fontSize="10" textAnchor="end">P</text>
        <text x={c + 5} y={16} fill="#8E9DBE" fontSize="10">Q</text>
        <circle cx={c} cy={c} r={sMax * scale} fill="#22d3ee" fillOpacity={0.06} stroke="#22d3ee" strokeDasharray="4 3" />
        <circle cx={c} cy={c} r={1 * scale} fill="none" stroke="#33456E" />
        {points.map((pt) => (
          <g key={pt.label}>
            <line x1={c} y1={c} x2={c + pt.p * scale} y2={c - pt.q * scale} stroke={pt.color} strokeOpacity={0.5} />
            <circle cx={c + pt.p * scale} cy={c - pt.q * scale} r={5} fill={pt.color} stroke="#102041" strokeWidth={2} />
            <text x={c + pt.p * scale + 7} y={c - pt.q * scale - 6} fill={pt.color} fontSize="10">{pt.label}</text>
          </g>
        ))}
      </svg>
      <p className="text-[11px] text-slate-500 mt-1">
        Vòng nét đứt là giới hạn dòng Smax, vòng liền là 1 pu. Khi P lớn, phần Q còn lại bị thu hẹp.
      </p>
    </figure>
  );
}

export default function VscHvdcLab() {
  const [sc, setSc] = useState<VscScenario>(VSC_DEFAULT_SCENARIO);
  const [progress, setProgress] = useState(1);
  const reduceMotion = useReducedMotion();
  const raf = useRef<number | null>(null);
  const set = (patch: Partial<VscScenario>) => setSc((s) => ({ ...s, ...patch }));

  const samples = useMemo(() => simulateVscHvdc(sc), [sc]);
  const shown = useMemo(() => samples.filter((s) => s.t <= progress * VSC_DURATION), [samples, progress]);
  const last = shown[shown.length - 1] ?? samples[0];

  const play = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (reduceMotion) return setProgress(1);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / PLAY_MS);
      setProgress(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const vdcPeak = Math.max(...samples.map((s) => Math.abs(s.vdc - sc.vdcRef)));
  const q2Limited = Math.abs(samples[samples.length - 1].q2 - sc.q2Step) > 0.01;

  return (
    <div className="theme-dark bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Cpu className="w-5 h-5" />
        </span>
        <h3 className="text-xl font-bold text-white">Điều khiển VSC-HVDC hai đầu</h3>
      </div>
      <p className="text-xs text-slate-400 mb-6 max-w-3xl">
        Trạm 1 điều khiển P và Q, trạm 2 giữ điện áp DC và điều khiển Q. Tại t = 2 s đổi P1, t = 3 s đổi Q1, t = 4 s đổi Q2, giống ví dụ VSC-HVDC của MathWorks Simscape.
        Mô hình trung bình, đơn vị tương đối.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TimeChart
            data={shown}
            title="Công suất tác dụng"
            domain={[-1.2, 1.2]}
            lines={[
              { key: "p1", name: "P1 trạm 1", color: "#22d3ee" },
              { key: "p2", name: "P2 trạm 2", color: "#f59e0b", dashed: true },
            ]}
          />
          <TimeChart
            data={shown}
            title="Công suất phản kháng"
            domain={[-0.8, 0.8]}
            lines={[
              { key: "q1", name: "Q1 trạm 1", color: "#a78bfa" },
              { key: "q2", name: "Q2 trạm 2", color: "#10b981" },
            ]}
          />
          <TimeChart
            data={shown}
            title="Điện áp DC và điện áp AC trạm 2"
            domain={["auto", "auto"]}
            lines={[
              { key: "vdc", name: "Vdc", color: "#f43f5e" },
              { key: "vac2", name: "Vac trạm 2", color: "#10b981", dashed: true },
            ]}
          />
          <PqDiagram
            sMax={sc.sMax}
            points={[
              { p: last.p1, q: last.q1, color: "#22d3ee", label: "Trạm 1" },
              { p: last.p2, q: last.q2, color: "#10b981", label: "Trạm 2" },
            ]}
          />
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={play} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-sm hover:bg-cyan-400 transition">
              <Play className="w-4 h-4" /> Chạy mô phỏng
            </button>
            <button
              onClick={() => {
                setSc(VSC_DEFAULT_SCENARIO);
                setProgress(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" /> Mặc định
            </button>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
            <RangeSlider label="P1 đặt sau t = 2 s" value={sc.p1Step} min={-1.1} max={1.1} step={0.05} color="#22d3ee" format={(v) => `${v.toFixed(2)} pu`} onChange={(v) => set({ p1Step: v })} hint="Âm là đảo chiều: trạm 2 phát vào DC" />
            <RangeSlider label="Q1 đặt sau t = 3 s" value={sc.q1Step} min={-0.6} max={0.6} step={0.05} color="#a78bfa" format={(v) => `${v.toFixed(2)} pu`} onChange={(v) => set({ q1Step: v })} />
            <RangeSlider label="Q2 đặt sau t = 4 s" value={sc.q2Step} min={-0.6} max={0.6} step={0.05} color="#10b981" format={(v) => `${v.toFixed(2)} pu`} onChange={(v) => set({ q2Step: v })} />
            <RangeSlider label="SCR lưới trạm 2" value={sc.scr2} min={1.2} max={8} step={0.1} color="#f59e0b" format={(v) => v.toFixed(1)} onChange={(v) => set({ scr2: v })} />
            <RangeSlider label="Giới hạn dòng Smax" value={sc.sMax} min={1} max={1.3} step={0.01} color="#f43f5e" format={(v) => `${v.toFixed(2)} pu`} onChange={(v) => set({ sMax: v })} />
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => setSc({ ...VSC_DEFAULT_SCENARIO, ...p.patch })} className="text-[11px] px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
                {p.label}
              </button>
            ))}
          </div>

          <dl className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-3 text-xs" aria-live="polite">
            <div>
              <dt className="text-slate-500">Lệch Vdc lớn nhất</dt>
              <dd className="font-mono font-semibold tabular-nums text-rose-300">{(vdcPeak * 100).toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="text-slate-500">Tổn thất đường dây</dt>
              <dd className="font-mono font-semibold tabular-nums">{fmt(last.p1 - last.p2)} pu</dd>
            </div>
            <div>
              <dt className="text-slate-500">Vac trạm 2</dt>
              <dd className="font-mono font-semibold tabular-nums">{last.vac2.toFixed(3)} pu</dd>
            </div>
            <div>
              <dt className="text-slate-500">Q2 cuối</dt>
              <dd className={`font-mono font-semibold tabular-nums ${q2Limited ? "text-amber-300" : ""}`}>
                {fmt(samples[samples.length - 1].q2)} pu{q2Limited ? " (bị giới hạn)" : ""}
              </dd>
            </div>
          </dl>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Điểm cần quan sát: P và Q của mỗi trạm thay đổi độc lập với nhau; Vdc chỉ lệch thoáng qua khi P1 đổi rồi được trạm 2 kéo về giá trị đặt. Lưới yếu (SCR nhỏ) làm cùng một lượng Q đẩy điện áp AC lên nhiều hơn.
          </p>
        </div>
      </div>
    </div>
  );
}
