"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, TrendingDown } from "lucide-react";
import RangeSlider from "@/components/ui/RangeSlider";
import InfoTip, { HoverTip } from "@/components/ui/InfoTip";
import { findOperatingPoint, inverterCeaLine, rectifierAlphaMinLine } from "@/lib/hvdc-math";
import { ViCharacteristicParams, ViControlRegime } from "@/types/hvdc";

// Khung vẽ SVG (đơn vị tương đối 0 → 1.3 pu trên cả hai trục)
const W = 560;
const H = 380;
const PAD = { left: 52, right: 20, top: 20, bottom: 44 };
const MAX_PU = 1.3;
const sx = (id: number) => PAD.left + (id / MAX_PU) * (W - PAD.left - PAD.right);
const sy = (vd: number) => H - PAD.bottom - (vd / MAX_PU) * (H - PAD.top - PAD.bottom);
const TICKS = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2];

const DEFAULTS: ViCharacteristicParams = { rectifierAcPu: 1, inverterAcPu: 1, currentOrderPu: 1, marginPu: 0.1 };

const SCENARIOS: { label: string; params: Partial<ViCharacteristicParams> }[] = [
  { label: "Vận hành bình thường", params: { rectifierAcPu: 1, inverterAcPu: 1 } },
  { label: "Sụt áp AC chỉnh lưu 10%", params: { rectifierAcPu: 0.9, inverterAcPu: 1 } },
  { label: "Sự cố gần trạm chỉnh lưu", params: { rectifierAcPu: 0.45, inverterAcPu: 1 } },
  { label: "Sụt áp AC nghịch lưu 15%", params: { rectifierAcPu: 1, inverterAcPu: 0.85 } },
];

const REGIME_TEXT: Record<ViControlRegime, { title: string; body: string; tone: string }> = {
  "rectifier-cc": {
    title: "Chỉnh lưu giữ dòng (CC), Nghịch lưu giữ γ_min (CEA)",
    body: "Đây là chế độ bình thường. Trạm chỉnh lưu điều chỉnh α để giữ Id bằng dòng đặt, còn trạm nghịch lưu quyết định điện áp DC.",
    tone: "#10b981",
  },
  transition: {
    title: "Vùng chuyển tiếp trong biên dòng",
    body: "Đường α_min của chỉnh lưu cắt đặc tính CEA ngay trong vùng biên dòng ΔI. Cả hai trạm đều đang ở giới hạn góc, nên điểm làm việc nhạy với dao động điện áp.",
    tone: "#eab308",
  },
  "inverter-cc": {
    title: "Nghịch lưu chuyển sang giữ dòng (CC)",
    body: "Chỉnh lưu chạm α_min nên không giữ được dòng nữa. Nghịch lưu tự động chuyển sang giữ dòng tại I_ord − ΔI. Công suất giảm, nhưng hệ thống vẫn ổn định.",
    tone: "#f59e0b",
  },
  collapse: {
    title: "Điện áp DC quá thấp: VDCOL tác động",
    body: "Điện áp DC giảm sâu. Bộ giới hạn dòng phụ thuộc điện áp (VDCOL) sẽ hạ dòng đặt để giảm nhu cầu công suất phản kháng và hỗ trợ lưới AC phục hồi.",
    tone: "#f43f5e",
  },
};

export default function VICharacteristic() {
  const [params, setParams] = useState<ViCharacteristicParams>(DEFAULTS);
  const reduceMotion = useReducedMotion();
  const set = (patch: Partial<ViCharacteristicParams>) => setParams((p) => ({ ...p, ...patch }));

  const { rectifierAcPu, inverterAcPu, currentOrderPu: iOrd, marginPu } = params;
  const iInv = iOrd - marginPu;
  const op = useMemo(() => findOperatingPoint(params), [params]);
  const regime = REGIME_TEXT[op.regime];

  const rectPath = useMemo(() => {
    const top = rectifierAlphaMinLine(iOrd, rectifierAcPu);
    return `M ${sx(0)} ${sy(rectifierAlphaMinLine(0, rectifierAcPu))} L ${sx(iOrd)} ${sy(top)} L ${sx(iOrd)} ${sy(0)}`;
  }, [iOrd, rectifierAcPu]);

  const invPath = useMemo(() => {
    const corner = inverterCeaLine(iInv, inverterAcPu);
    return `M ${sx(iInv)} ${sy(0)} L ${sx(iInv)} ${sy(corner)} L ${sx(MAX_PU)} ${sy(inverterCeaLine(MAX_PU, inverterAcPu))}`;
  }, [iInv, inverterAcPu]);

  const spring = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 220, damping: 26 };

  return (
    <div className="theme-dark bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <TrendingDown className="w-5 h-5" />
        </span>
        <h3 className="text-xl font-bold text-white">Đặc tính V-I và điểm làm việc</h3>
      </div>
      <p className="text-xs text-slate-400 mb-6">
        Đơn vị tương đối (pu). Kéo điện áp AC hai phía để thấy điểm làm việc chuyển giữa các chế độ điều khiển.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Plot */}
        <div className="lg:col-span-3 bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Đặc tính V-I. Điểm làm việc Id = ${op.id.toFixed(2)} pu, Vd = ${op.vd.toFixed(2)} pu. ${regime.title}`}>
            {/* Lưới và trục */}
            {TICKS.map((t) => (
              <g key={t}>
                <line x1={sx(t)} x2={sx(t)} y1={sy(0)} y2={sy(MAX_PU)} stroke="#1E2F57" strokeDasharray="3 3" />
                <line x1={sx(0)} x2={sx(MAX_PU)} y1={sy(t)} y2={sy(t)} stroke="#1E2F57" strokeDasharray="3 3" />
                <text x={sx(t)} y={sy(0) + 16} fill="#66779C" fontSize="10" textAnchor="middle">{t.toFixed(1)}</text>
                <text x={sx(0) - 8} y={sy(t) + 3} fill="#66779C" fontSize="10" textAnchor="end">{t.toFixed(1)}</text>
              </g>
            ))}
            <line x1={sx(0)} x2={sx(MAX_PU)} y1={sy(0)} y2={sy(0)} stroke="#485A82" />
            <line x1={sx(0)} x2={sx(0)} y1={sy(0)} y2={sy(MAX_PU)} stroke="#485A82" />
            <text x={(sx(0) + sx(MAX_PU)) / 2} y={H - 8} fill="#8E9DBE" fontSize="11" textAnchor="middle">Dòng DC Id (pu)</text>
            <text x={14} y={(sy(0) + sy(MAX_PU)) / 2} fill="#8E9DBE" fontSize="11" textAnchor="middle" transform={`rotate(-90 14 ${(sy(0) + sy(MAX_PU)) / 2})`}>
              Điện áp DC Vd (pu)
            </text>

            {/* Vùng biên dòng ΔI */}
            <rect x={sx(iInv)} y={sy(MAX_PU)} width={sx(iOrd) - sx(iInv)} height={sy(0) - sy(MAX_PU)} fill="#f59e0b" opacity={0.06} />
            <text x={(sx(iInv) + sx(iOrd)) / 2} y={sy(MAX_PU) + 12} fill="#b45309" fontSize="10" textAnchor="middle">ΔI</text>

            {/* Đặc tính chỉnh lưu */}
            <motion.path d={rectPath} fill="none" stroke="#10b981" strokeWidth={2.5} initial={false} animate={{ d: rectPath }} transition={spring} />
            <text x={sx(0.08)} y={sy(rectifierAlphaMinLine(0.08, rectifierAcPu)) - 8} fill="#6ee7b7" fontSize="11">Chỉnh lưu α_min</text>
            <text x={sx(iOrd) + 6} y={sy(0.18)} fill="#6ee7b7" fontSize="11">CC</text>

            {/* Đặc tính nghịch lưu */}
            <motion.path d={invPath} fill="none" stroke="#f59e0b" strokeWidth={2.5} initial={false} animate={{ d: invPath }} transition={spring} />
            <text x={sx(1.05)} y={sy(inverterCeaLine(1.05, inverterAcPu)) - 8} fill="#fcd34d" fontSize="11">Nghịch lưu γ_min</text>
            <text x={sx(iInv) - 6} y={sy(0.18)} fill="#fcd34d" fontSize="11" textAnchor="end">CC</text>

            {/* Điểm làm việc */}
            <motion.g initial={false} animate={{ x: sx(op.id), y: sy(op.vd) }} transition={spring}>
              <circle r={12} fill={regime.tone} opacity={0.18} />
              <circle r={6} fill={regime.tone} stroke="#102041" strokeWidth={2} />
            </motion.g>
          </svg>
        </div>

        {/* Controls & status */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-xl border bg-slate-950/80" style={{ borderColor: `${regime.tone}55` }} aria-live="polite">
            <p className="text-sm font-semibold" style={{ color: regime.tone }}>
              {op.regime === "collapse" && <AlertTriangle className="inline w-4 h-4 mr-1 -mt-0.5" />}
              {regime.title}
            </p>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{regime.body}</p>
            <dl className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <dt className="text-slate-500">Id<InfoTip text="Dòng DC tại điểm làm việc, đơn vị tương đối so với dòng định mức." /></dt>
                <dd className="font-mono font-semibold tabular-nums">{op.id.toFixed(2)} pu</dd>
              </div>
              <div>
                <dt className="text-slate-500">Vd<InfoTip text="Điện áp DC tại điểm làm việc (pu), là giao điểm đặc tính hai trạm." /></dt>
                <dd className="font-mono font-semibold tabular-nums">{op.vd.toFixed(2)} pu</dd>
              </div>
              <div>
                <dt className="text-slate-500">P = Vd·Id<InfoTip text="Công suất DC truyền tải (pu). Giảm khi nghịch lưu chuyển sang giữ dòng hoặc khi điện áp DC sụt." /></dt>
                <dd className="font-mono font-semibold tabular-nums">{(op.id * op.vd).toFixed(2)} pu</dd>
              </div>
            </dl>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
            <RangeSlider tip="Điện áp lưới AC tại trạm chỉnh lưu. Khi sụt, đường α_min hạ xuống và chỉnh lưu có thể mất khả năng giữ dòng." label="Điện áp AC phía chỉnh lưu" value={rectifierAcPu} min={0.3} max={1.1} step={0.01} color="#10b981" format={(v) => `${v.toFixed(2)} pu`} onChange={(v) => set({ rectifierAcPu: v })} />
            <RangeSlider tip="Điện áp lưới AC tại trạm nghịch lưu. Đặc tính γ_min (CEA) tỷ lệ với điện áp này, nên nó quyết định điện áp DC khi vận hành bình thường." label="Điện áp AC phía nghịch lưu" value={inverterAcPu} min={0.7} max={1.1} step={0.01} color="#f59e0b" format={(v) => `${v.toFixed(2)} pu`} onChange={(v) => set({ inverterAcPu: v })} />
            <RangeSlider tip="Dòng DC mà trạm chỉnh lưu giữ không đổi bằng cách điều chỉnh α. Trạm nghịch lưu nhận cùng lệnh dòng nhưng trừ đi biên ΔI." label="Dòng đặt I_ord" value={iOrd} min={0.4} max={1.2} step={0.01} color="#22d3ee" format={(v) => `${v.toFixed(2)} pu`} onChange={(v) => set({ currentOrderPu: v })} />
            <RangeSlider tip="Độ chênh giữa dòng đặt của hai trạm, thường 0,1 pu. Nhờ biên này chỉ một trạm giữ dòng tại một thời điểm, tránh hai bộ điều khiển dòng tranh nhau." label="Biên dòng ΔI" value={marginPu} min={0.05} max={0.2} step={0.01} color="#a78bfa" format={(v) => `${v.toFixed(2)} pu`} onChange={(v) => set({ marginPu: v })} />
          </div>

          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <HoverTip key={s.label} text={`Đặt điện áp AC: chỉnh lưu ${s.params.rectifierAcPu} pu, nghịch lưu ${s.params.inverterAcPu} pu.`}>
                <button
                  onClick={() => set(s.params)}
                  className="text-[11px] px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  {s.label}
                </button>
              </HoverTip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
