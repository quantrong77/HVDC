"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Cable, Compass, RadioTower } from "lucide-react";
import RangeSlider from "@/components/ui/RangeSlider";
import {
  OVERHEAD_LINE_DATA,
  PlanningInput,
  RouteType,
  Technology,
  adviseTechnology,
  breakevenVerdict,
  converterLossesMW,
  distanceColumn,
  lccReactiveRangeMVAr,
  nearestLineData,
  powerRow,
  suggestDcVoltage,
  voltageLowerBound,
} from "@/lib/hvdc-planning";

const DEFAULTS: PlanningInput = { powerMW: 3000, distanceKm: 1200, route: "overhead", scrSend: 4, scrReceive: 3.5, multiTerminal: false, blackStart: false };

const POWER_LABELS = ["≤ 500 MW", "≤ 1.000 MW", "≤ 3.000 MW", "≤ 4.000 MW", "> 4.000 MW"];
const DIST_LABELS = ["≤ 200", "≤ 500", "≤ 1.000", "≤ 1.500", "< 2.000", "≥ 2.000"];
const GRID: (string | null)[][] = POWER_LABELS.map((_, r) =>
  DIST_LABELS.map((__, c) => suggestDcVoltage([500, 1000, 3000, 4000, 9000][r], [200, 500, 1000, 1500, 1999, 2500][c]))
);

const TECH_STYLE: Record<Technology, string> = {
  LCC: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  VSC: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10",
  Hybrid: "text-amber-400 border-amber-500/40 bg-amber-500/10",
};

const BREAKEVEN_TEXT = {
  hvac: { label: "HVAC thường kinh tế hơn", tone: "text-slate-300" },
  compare: { label: "Vùng hòa vốn: cần so sánh kinh tế - kỹ thuật", tone: "text-amber-400" },
  hvdc: { label: "HVDC có lợi thế", tone: "text-emerald-400" },
};

const nf = new Intl.NumberFormat("vi-VN");
// Màu thanh trượt theo token: xanh EVN ở nền sáng, xanh sáng hơn ở nền tối
const BRAND = "rgb(var(--cyan-400))";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
      {label}
    </label>
  );
}

export default function HvdcPlanner() {
  const [input, setInput] = useState<PlanningInput>(DEFAULTS);
  const reduceMotion = useReducedMotion();
  const set = (patch: Partial<PlanningInput>) => setInput((s) => ({ ...s, ...patch }));

  const voltage = suggestDcVoltage(input.powerMW, input.distanceKm);
  const row = powerRow(input.powerMW);
  const col = distanceColumn(input.distanceKm);
  const advice = useMemo(() => adviseTechnology(input), [input]);
  const breakeven = BREAKEVEN_TEXT[breakevenVerdict(input.route, input.distanceKm)];
  const losses = converterLossesMW(advice.technology, input.powerMW);
  const reactive = lccReactiveRangeMVAr(advice.technology, input.powerMW);
  const line = voltage && input.route === "overhead" ? nearestLineData(voltageLowerBound(voltage)) : null;
  const pop = reduceMotion ? {} : { initial: { scale: 0.96, opacity: 0.6 }, animate: { scale: 1, opacity: 1 } };

  return (
    <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Compass className="w-5 h-5" />
        </span>
        <h3 className="text-xl font-bold text-white">Thiết kế sơ bộ tuyến HVDC</h3>
      </div>
      <p className="text-xs text-slate-400 mb-6 max-w-3xl">
        Nhập công suất, cự ly và độ mạnh lưới hai đầu để tra cấp điện áp DC, công nghệ phù hợp và thông số đường dây theo bảng trong bài giảng HVDC 2026 (ĐHBKHN,
        theo IEC 63127 và CIGRE 684). Kết quả để định hướng học tập, không thay cho nghiên cứu hệ thống.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-5">
        {/* Đầu vào */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Loại tuyến">
            {([
              ["overhead", "Đường dây trên không", RadioTower],
              ["cable", "Cáp ngầm, cáp biển", Cable],
            ] as [RouteType, string, typeof Cable][]).map(([value, label, Icon]) => (
              <button
                key={value}
                role="radio"
                aria-checked={input.route === value}
                onClick={() => set({ route: value })}
                className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs transition ${
                  input.route === value ? "border-cyan-500 bg-cyan-500/10 text-white font-semibold" : "border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <RangeSlider color={BRAND} label="Công suất truyền tải" value={input.powerMW} min={100} max={12000} step={100} format={(v) => `${nf.format(v)} MW`} onChange={(v) => set({ powerMW: v })} />
            <RangeSlider color={BRAND} label="Cự ly" value={input.distanceKm} min={20} max={3000} step={10} format={(v) => `${nf.format(v)} km`} onChange={(v) => set({ distanceKm: v })} />
            <RangeSlider color={BRAND} label="SCR lưới phía phát" value={input.scrSend} min={1} max={8} step={0.1} format={(v) => v.toFixed(1)} onChange={(v) => set({ scrSend: v })} />
            <RangeSlider color={BRAND} label="SCR lưới phía nhận" value={input.scrReceive} min={1} max={8} step={0.1} format={(v) => v.toFixed(1)} onChange={(v) => set({ scrReceive: v })} />
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <Toggle checked={input.multiTerminal} onChange={(v) => set({ multiTerminal: v })} label="Nhiều điểm nhận (đa điểm)" />
            <Toggle checked={input.blackStart} onChange={(v) => set({ blackStart: v })} label="Cần khởi động đen" />
          </div>
        </div>

        {/* Kết quả */}
        <div className="space-y-4 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" aria-live="polite">
            <motion.div key={`v-${voltage}`} {...pop} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-400">Cấp điện áp DC gợi ý</p>
              <p className="mt-1 text-2xl font-extrabold text-white tabular-nums">{voltage ? `±${voltage} kV` : "Ngoài bảng"}</p>
              {!voltage && <p className="mt-1 text-xs text-slate-400">Tổ hợp công suất và cự ly này không có trong bảng tham chiếu.</p>}
            </motion.div>
            <motion.div key={`t-${advice.technology}`} {...pop} className={`rounded-xl border p-4 ${TECH_STYLE[advice.technology]}`}>
              <p className="text-xs text-slate-400">Công nghệ phù hợp</p>
              <p className="mt-1 text-2xl font-extrabold">{advice.technology === "Hybrid" ? "Hybrid LCC–VSC" : advice.technology}</p>
            </motion.div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-400">So với HVAC ({input.route === "overhead" ? "hòa vốn 500–800 km" : "hòa vốn 50–100 km"})</p>
              <p className={`mt-1 text-sm font-semibold ${breakeven.tone}`}>{breakeven.label}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-semibold text-white mb-2">Vì sao chọn {advice.technology}</p>
            <ul className="space-y-1.5">
              {advice.reasons.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-2" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
            <dl className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-slate-400">Tổn thất hai trạm biến đổi (ước tính)</dt>
                <dd className="font-mono font-semibold text-white tabular-nums">≈ {nf.format(Math.round(losses))} MW</dd>
                <dd className="text-[11px] text-slate-500">LCC ≈ 0,7%/trạm; MMC ≈ 0,8–1%/trạm (lấy 0,9%)</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Bù công suất phản kháng</dt>
                <dd className="font-mono font-semibold text-white tabular-nums">
                  {reactive ? `${nf.format(reactive[0])}–${nf.format(reactive[1])} MVAr mỗi trạm LCC` : "Không cần bù lớn"}
                </dd>
                <dd className="text-[11px] text-slate-500">{reactive ? "LCC tiêu thụ 50–60% P, cấp bằng bộ lọc AC và tụ bù" : "VSC điều khiển Q độc lập"}</dd>
              </div>
            </dl>
          </div>

          {/* Bảng tra cấp điện áp, ô đang chọn được tô sáng */}
          <figure className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <figcaption className="text-sm font-semibold text-white mb-3">Bảng chọn cấp điện áp DC (±kV) theo công suất và cự ly (km)</figcaption>
            <div className="overflow-x-auto">
              <table className="w-full text-xs tabular-nums">
                <thead>
                  <tr>
                    <th scope="col" className="text-left text-slate-400 font-medium px-2 py-1.5">Công suất</th>
                    {DIST_LABELS.map((d, c) => (
                      <th key={d} scope="col" className={`px-2 py-1.5 font-medium whitespace-nowrap ${c === col ? "text-white" : "text-slate-400"}`}>
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {GRID.map((cells, r) => (
                    <tr key={POWER_LABELS[r]} className="border-t border-slate-800">
                      <th scope="row" className={`text-left px-2 py-1.5 font-medium whitespace-nowrap ${r === row ? "text-white" : "text-slate-400"}`}>
                        {POWER_LABELS[r]}
                      </th>
                      {cells.map((v, c) => {
                        const active = r === row && c === col;
                        return (
                          <td key={c} className={`px-2 py-1.5 text-center rounded ${active ? "bg-cyan-500 text-slate-950 font-bold" : v ? "text-slate-300" : "text-slate-600"}`}>
                            {v ?? "–"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>

          {input.route === "overhead" ? (
            <figure className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <figcaption className="text-sm font-semibold text-white mb-3">
                Thông số đường dây trên không điển hình{line ? `, cấp gần nhất ±${line.kv} kV` : ""}
              </figcaption>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400">
                      {["Điện áp", "Công suất (MW)", "Cự ly kinh tế (km)", "Phân pha/cực", "Hành lang (m)", "K/c đến đất (m)"].map((h) => (
                        <th key={h} scope="col" className="text-left font-medium px-2 py-1.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {OVERHEAD_LINE_DATA.map((d) => (
                      <tr key={d.kv} className={`border-t border-slate-800 ${line?.kv === d.kv ? "bg-cyan-500/10 text-white font-semibold" : "text-slate-300"}`}>
                        <td className="px-2 py-1.5 whitespace-nowrap">±{d.kv} kV</td>
                        <td className="px-2 py-1.5 whitespace-nowrap">{d.ratingMW}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap">{d.economicKm}</td>
                        <td className="px-2 py-1.5">{d.bundle}</td>
                        <td className="px-2 py-1.5">{d.rowM}</td>
                        <td className="px-2 py-1.5">{d.clearanceM}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </figure>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300 leading-relaxed">
              <p className="font-semibold text-white mb-1">Chọn cáp</p>
              {advice.technology === "LCC"
                ? "LCC đảo cực điện áp khi đảo chiều công suất: tuyến cáp biển dài dùng cáp MI (giấy tẩm hợp chất), nay đã có cáp XLPE 525 kV đạt chuẩn cho LCC."
                : "VSC không đảo cực điện áp: dùng cáp XLPE ép đùn, nhẹ, rẻ, dễ thi công, nay đạt 525–640 kV."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
