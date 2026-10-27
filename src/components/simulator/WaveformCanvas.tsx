"use client";

import React, { useState, useMemo, useEffect, useDeferredValue } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { generateWaveformData, calculateVd, VD0_FACTOR } from "@/lib/hvdc-math";
import RangeSlider from "@/components/ui/RangeSlider";
import { Activity, Zap, Cpu, Gauge, ArrowRightLeft, Info, AlertTriangle } from "lucide-react";

const V_LL = 210; // Điện áp dây hiệu dụng phía van mỗi cầu (kV rms) - cấu hình ±500 kV điển hình
const ID_KA = 2; // Dòng DC định mức (kA)
const GAMMA_MIN = 17;

const PRESETS = [
  { label: "Chỉnh lưu định mức", alpha: 15, mu: 20 },
  { label: "Vd = 0", alpha: 90, mu: 0 },
  { label: "Nghịch lưu định mức", alpha: 142, mu: 20 },
  { label: "Sát giới hạn γ", alpha: 150, mu: 22 },
];

/** Các khoảng chuyển mạch [α + 60° + k·60°, … + μ] trên trục 0-360° */
function commutationWindows(alpha: number, mu: number, is12Pulse: boolean): [number, number][] {
  if (mu <= 0) return [];
  const offsets = is12Pulse ? [0, 30] : [0];
  const windows: [number, number][] = [];
  for (const offset of offsets) {
    for (let k = 0; k < 6; k++) {
      const start = (60 + alpha + offset + k * 60) % 360;
      const end = start + mu;
      if (end <= 360) windows.push([start, end]);
      else {
        windows.push([start, 360]);
        windows.push([0, end - 360]);
      }
    }
  }
  return windows;
}

export default function WaveformCanvas() {
  const [alpha, setAlpha] = useState<number>(15);
  const [mu, setMu] = useState<number>(20);
  const [is12Pulse, setIs12Pulse] = useState<boolean>(true);
  const [showAcPhases, setShowAcPhases] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Thanh trượt cập nhật tức thì, đồ thị nặng hơn được phép trễ một nhịp để giữ < 100 ms
  const deferredAlpha = useDeferredValue(alpha);
  const deferredMu = useDeferredValue(mu);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = useMemo(
    () =>
      generateWaveformData({
        alphaDeg: deferredAlpha,
        muDeg: deferredMu,
        vLL: V_LL,
        frequency: 50,
        is12Pulse,
      }),
    [deferredAlpha, deferredMu, is12Pulse]
  );

  const metrics = useMemo(
    () => calculateVd(V_LL, alpha, { muDeg: mu, is12Pulse, idKA: ID_KA }),
    [alpha, mu, is12Pulse]
  );

  const windows = useMemo(
    () => commutationWindows(deferredAlpha, deferredMu, is12Pulse),
    [deferredAlpha, deferredMu, is12Pulse]
  );

  const yLimit = Math.ceil((metrics.vd0 * 1.15) / 100) * 100;
  const nearZero = Math.abs(metrics.vd) < 5;
  const isInverter = metrics.mode === "inverter" && !nearZero;
  const gammaUnsafe = isInverter && metrics.gamma < GAMMA_MIN;
  const modeColor = nearZero ? "#8E9DBE" : isInverter ? "#f59e0b" : "#10b981";
  const rippleKnown = metrics.rippleFactor !== null && Number.isFinite(metrics.rippleFactor);

  return (
    <div className="theme-dark bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Mô phỏng cầu Thyristor LCC</h3>
          </div>
          <p className="text-xs text-slate-400">
            Mỗi cầu 6 xung: V_LL = {V_LL} kV, Id = {ID_KA} kA. Cầu 12 xung gồm 2 cầu nối tiếp lệch 30° (MBA Y/Y và Y/Δ).
          </p>
        </div>

        {/* Badges & Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-colors"
            style={{ color: modeColor, borderColor: `${modeColor}55`, backgroundColor: `${modeColor}14` }}
            aria-live="polite"
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: modeColor }} />
            {nearZero ? "Biên giới Vd ≈ 0" : isInverter ? "Nghịch lưu (Inverter)" : "Chỉnh lưu (Rectifier)"}
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800" role="group" aria-label="Số xung">
            {[false, true].map((twelve) => (
              <button
                key={String(twelve)}
                onClick={() => setIs12Pulse(twelve)}
                aria-pressed={is12Pulse === twelve}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
                  is12Pulse === twelve ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                {twelve ? "12 xung" : "6 xung"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAcPhases(!showAcPhases)}
            aria-pressed={showAcPhases}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              showAcPhases ? "bg-cyan-950 text-cyan-300 border-cyan-800" : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {showAcPhases ? "Ẩn 3 pha AC" : "Hiện 3 pha AC"}
          </button>
        </div>
      </div>

      {/* Control Panel & Live Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-5">
          <RangeSlider
            label="Góc kích α"
            value={alpha}
            min={0}
            max={180}
            onChange={setAlpha}
            unit="°"
            color={modeColor}
            hint={
              <div className="flex justify-between font-mono">
                <span className="text-emerald-400">0° chỉnh lưu cực đại</span>
                <span>90°</span>
                <span className="text-amber-400">180° nghịch lưu</span>
              </div>
            }
          />
          <RangeSlider
            label="Góc trùng dẫn μ (do điện kháng chuyển mạch Xc)"
            value={mu}
            min={0}
            max={30}
            onChange={setMu}
            unit="°"
            color="#a78bfa"
          />

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span>Thiết lập nhanh:</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setAlpha(p.alpha);
                  setMu(p.mu);
                }}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
              >
                {p.label} <span className="font-mono text-slate-500">α={p.alpha}°</span>
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Block 1: Vd0 & Vd */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Vd0 = {is12Pulse ? "2 × " : ""}{VD0_FACTOR.toFixed(2)}·V_LL</span>
              <Gauge className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-lg font-bold font-mono text-slate-200 tabular-nums">
              {metrics.vd0} <span className="text-xs text-slate-400 font-normal">kV</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Vd = Vd0·[cos α + cos(α+μ)]/2</span>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight tabular-nums" style={{ color: modeColor }}>
              {metrics.vd > 0 ? `+${metrics.vd}` : metrics.vd}
              <span className="text-xs text-slate-300 font-normal ml-1">kV</span>
            </div>
          </div>
        </div>

        {/* Telemetry Block 2: Power & Reactive demand */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <div>
              <dt className="text-slate-400">P = |Vd|·Id</dt>
              <dd className="font-mono font-semibold text-slate-100 tabular-nums">{metrics.powerActive} MW</dd>
            </div>
            <div>
              <dt className="text-slate-400">Q ≈ P·tan φ</dt>
              <dd className="font-mono font-semibold text-amber-300 tabular-nums">{metrics.powerReactive} MVAr</dd>
            </div>
            <div>
              <dt className="text-slate-400">cos φ</dt>
              <dd className="font-mono font-semibold text-cyan-300 tabular-nums">{metrics.powerFactor}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Gợn sóng</dt>
              <dd className="font-mono font-semibold text-blue-300 tabular-nums">{metrics.rippleFrequency} Hz</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-slate-400">Hệ số gợn đỉnh-đỉnh ΔV/|Vd|</dt>
              <dd className="font-mono font-semibold text-blue-300 tabular-nums">
                {rippleKnown ? `${(metrics.rippleFactor * 100).toFixed(1)} %` : "Không xác định (Vd ≈ 0)"}
              </dd>
            </div>
          </dl>

          <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
            <span className="text-slate-400">γ = 180° − (α + μ)</span>
            <span
              className={`font-mono font-semibold tabular-nums ${
                !isInverter ? "text-slate-500" : gammaUnsafe ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {metrics.gamma}°
            </span>
          </div>
          {gammaUnsafe && (
            <p
              className="flex items-start gap-1.5 text-[11px] text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-2 py-1.5"
              role="alert"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
              γ &lt; {GAMMA_MIN}°: van không kịp phục hồi khả năng khóa, nguy cơ thất bại chuyển mạch.
            </p>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-slate-400 mb-2">
          <span className="font-medium flex items-center gap-1.5 text-slate-300">
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            Điện áp tức thời Vd(t) và giá trị trung bình Vd
          </span>
          <span className="flex items-center gap-3 text-[11px]">
            {mu > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-violet-400/25 border border-violet-400/50" />
                Khoảng trùng dẫn μ
              </span>
            )}
            <span className="font-mono text-slate-500">T = 20 ms (50 Hz)</span>
          </span>
        </div>

        <div className="h-[300px] sm:h-[360px] w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2F57" />
                <XAxis
                  dataKey="wt"
                  type="number"
                  domain={[0, 360]}
                  ticks={[0, 60, 120, 180, 240, 300, 360]}
                  stroke="#66779C"
                  tick={{ fill: "#8E9DBE", fontSize: 11 }}
                  label={{ value: "Góc điện ωt (độ)", position: "insideBottom", offset: -5, fill: "#8E9DBE", fontSize: 11 }}
                />
                <YAxis
                  stroke="#66779C"
                  domain={[-yLimit, yLimit]}
                  tick={{ fill: "#8E9DBE", fontSize: 11 }}
                  width={52}
                  label={{ value: "kV", angle: -90, position: "insideLeft", fill: "#8E9DBE", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#102041",
                    borderColor: "#33456E",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelFormatter={(v) => `ωt = ${v}°`}
                  formatter={(value: number, name: string) => [`${value} kV`, name]}
                />
                <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
                {windows.map(([x1, x2], i) => (
                  <ReferenceArea key={i} x1={x1} x2={x2} fill="#a78bfa" fillOpacity={is12Pulse ? 0.07 : 0.12} strokeOpacity={0} ifOverflow="hidden" />
                ))}
                <ReferenceLine y={0} stroke="#485A82" strokeWidth={1.5} />

                {showAcPhases && (
                  <>
                    <Line type="monotone" dataKey="phaseA" name="Pha A" stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="phaseB" name="Pha B" stroke="#eab308" strokeWidth={1} strokeDasharray="2 2" dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="phaseC" name="Pha C" stroke="#3b82f6" strokeWidth={1} strokeDasharray="2 2" dot={false} isAnimationActive={false} />
                  </>
                )}

                <Line type="linear" dataKey="voltage" name="Vd(t)" stroke="#22d3ee" strokeWidth={2.25} dot={false} isAnimationActive={false} />
                <Line
                  type="linear"
                  dataKey="vdAverage"
                  name="Vd trung bình"
                  stroke={modeColor}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">Đang tải đồ thị mô phỏng…</div>
          )}
        </div>
      </div>

      {/* Educational Note Callout */}
      <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-slate-200">Ghi chú vận hành EVNNPT: </span>
          trạm chỉnh lưu thường làm việc với α ≈ 13°–18° để giữ dự trữ điều khiển. Trạm nghịch lưu làm việc với α ≈ 140°–145°,
          và bộ điều khiển phải giữ γ ≥ {GAMMA_MIN}° để tránh thất bại chuyển mạch khi điện áp lưới AC sụt. Hãy tăng μ để thấy
          vết lõm điện áp trong khoảng chuyển mạch, cùng với γ giảm dần ở chế độ nghịch lưu.
        </p>
      </div>
    </div>
  );
}
