"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Gauge } from "lucide-react";
import RangeSlider from "@/components/ui/RangeSlider";
import InfoTip, { HoverTip } from "@/components/ui/InfoTip";
import CanvasPlot, { HMI, PlotSpec, SvHexagon, fmtVi } from "@/components/simulator/firing/CanvasPlot";
import {
  BridgeParams,
  DynScenario,
  GAMMA_CRIT,
  PwmMode,
  alphaForGamma,
  bridgePoint,
  bridgeWaves,
  pwmLinearLimit,
  pwmWaves,
  simulateCcCea,
  simulateDqCurrent,
  solveCharacteristic,
  spectrum,
  svTimes,
} from "@/lib/firing-angle";
import Link from "next/link";
import { LCC_LINK_DEFAULT, LCC_STATION_LOSS_PCT, LccLinkInput, designLccLink } from "@/lib/hvdc-integration";
import { lessonHref } from "@/lib/lesson-routes";

export const FIRING_TABS = [
  { id: "wave", label: "Dạng sóng cầu 6/12 xung" },
  { id: "char", label: "Đặc tính Vd–Id" },
  { id: "dyn", label: "Đáp ứng động CC/CEA" },
  { id: "pwm", label: "PWM và SVPWM" },
  { id: "vec", label: "Điều khiển vector dq" },
  { id: "design", label: "Tích hợp: liên kết LCC" },
] as const;

export type FiringTab = (typeof FIRING_TABS)[number]["id"];
const isTab = (x: string): x is FiringTab => FIRING_TABS.some((t) => t.id === x);

/* ---------- khối dùng chung ---------- */

type Tone = "good" | "warn" | "crit";
const TONE: Record<Tone, string> = { good: "border-emerald-400", warn: "border-amber-400", crit: "border-rose-400" };

function Status({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <p role="status" className={`text-[13px] font-semibold text-slate-100 bg-slate-900 rounded-lg px-3 py-2 border-l-[3px] ${TONE[tone]}`}>
      {children}
    </p>
  );
}

function Readout({ rows }: { rows: [string, string, string?][] }) {
  return (
    <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 text-[13px] border-t border-slate-800 pt-3">
      {rows.map(([k, v, tip]) => (
        <React.Fragment key={k}>
          <dt className="text-slate-400 inline-flex items-center">
            {k}
            {tip && <InfoTip text={tip} />}
          </dt>
          <dd className="font-mono tabular-nums text-right text-slate-100">{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

function Select<T extends string>({ label, value, options, onChange, tip }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void; tip?: string }) {
  return (
    <label className="block">
      <span className="flex items-center text-xs font-medium text-slate-300 mb-1.5">
        {label}
        {tip && <InfoTip text={tip} />}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function Check({ label, checked, onChange, tip }: { label: string; checked: boolean; onChange: (v: boolean) => void; tip?: string }) {
  return (
    <span className="flex items-start gap-2 text-[13px] text-slate-300">
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 accent-cyan-400" />
        {label}
      </label>
      {tip && <InfoTip text={tip} />}
    </span>
  );
}

function Panel({ controls, children }: { controls: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-5 items-start">
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">{controls}</div>
      <div className="space-y-3 min-w-0">{children}</div>
    </div>
  );
}

const Note = ({ children }: { children: React.ReactNode }) => <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{children}</p>;
const Mono = ({ children }: { children: React.ReactNode }) => (
  <pre className="text-[12px] font-mono text-slate-200 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 overflow-x-auto whitespace-pre">{children}</pre>
);

const presetBtn = "text-[11px] px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition";

/* ---------- Tab 1: dạng sóng ---------- */

function WaveTab() {
  const [p, setP] = useState<BridgeParams>({ alpha: 15, id: 3, vll: 210, xc: 8, gammaMin: 17, pulses: 12 });
  const set = (patch: Partial<BridgeParams>) => setP((s) => ({ ...s, ...patch }));
  const r = useMemo(() => bridgePoint(p), [p]);
  const w = useMemo(() => bridgeWaves(p, r), [p, r]);

  const plots = useMemo(() => {
    const names = ["V1", "V2", "V3", "V4", "V5", "V6"];
    const fire = [-60, 0, 60, 120, 180, 240, 300, 360, 420].map((x) => x + p.alpha).filter((x) => x >= -90 && x <= 450);
    const marks = fire.map((x) => ({ x, color: HMI.accent, label: names[((Math.round((x - p.alpha + 60) / 60) % 6) + 6) % 6] }));
    const xs = { xmin: -90, xmax: 450, xstep: 60, xfmt: (x: number) => `${x}°` };
    const pk = Math.SQRT2 * p.vll;
    const vm = w.vm;
    const show12 = r.nb === 2;
    const udmax = Math.max(...w.ud12.map(Math.abs), pk) * 1.1;
    const bands: PlotSpec["bands"] = [];
    if (p.alpha > 90 && !r.failed) {
      for (let base = -60 + p.alpha; base < 450; base += 360) {
        for (const b0 of [base - 360, base]) bands.push({ x0: b0 + 120 + r.mu, x1: b0 + 180, color: r.gamma < p.gammaMin ? HMI.crit : HMI.good, alpha: 0.18 });
      }
    }
    const imax = 1.3 * Math.max(p.id, 0.5);
    const specs: [PlotSpec, number][] = [
      [
        {
          ...xs,
          ymin: -1.15 * vm,
          ymax: 1.15 * vm,
          ystep: Math.round(vm / 2 / 10) * 10 || 50,
          title: "Điện áp pha phía van và điện áp hai thanh cái cầu (kV)",
          marks,
          vlines: [
            { x: -60, color: HMI.muted, label: "chuyển mạch tự nhiên V1" },
            { x: -60 + p.alpha, color: HMI.accent, label: `α = ${fmtVi(p.alpha)}°`, dy: 14 },
          ],
          series: [
            { x: w.th, y: w.va, color: HMI.pa, name: "va", width: 1.2 },
            { x: w.th, y: w.vb, color: HMI.pb, name: "vb", width: 1.2 },
            { x: w.th, y: w.vc, color: HMI.pc, name: "vc", width: 1.2 },
            { x: w.th, y: w.up, color: HMI.ink, width: 2.2, name: "thanh cái +/−" },
            { x: w.th, y: w.lo, color: HMI.ink, width: 2.2 },
          ],
        },
        220,
      ],
      [
        {
          ...xs,
          ymin: show12 ? -udmax : -pk * 1.15,
          ymax: show12 ? udmax : pk * 1.15,
          ystep: show12 ? 100 : 50,
          title: show12 ? "Điện áp một chiều: một cầu 6 xung và tổng cầu 12 xung (kV)" : "Điện áp một chiều cầu 6 xung (kV)",
          hlines: [{ y: w.vdIntegrated, color: HMI.vd2, label: `trung bình ${fmtVi(w.vdIntegrated)} kV` }],
          series: show12
            ? [
                { x: w.th, y: w.ud6, color: HMI.vd, name: "vd cầu Y/Y", width: 1.2 },
                { x: w.th, y: w.ud12, color: HMI.vd2, name: "vd 12 xung", width: 2 },
              ]
            : [{ x: w.th, y: w.ud6, color: HMI.vd, name: "vd", width: 2 }],
        },
        200,
      ],
      [
        {
          ...xs,
          ymin: -1.15 * pk,
          ymax: 1.15 * pk,
          ystep: 100,
          bands,
          title: "Điện áp trên van V1 (kV) · vùng tô: áp ngược sau khi tắt = γ",
          marks: marks.filter((m) => m.label === "V1"),
          series: [{ x: w.th, y: w.vValve, color: HMI.pa, width: 1.8, name: "uV1" }],
        },
        190,
      ],
      [
        {
          ...xs,
          ymin: -imax,
          ymax: imax,
          ystep: p.id > 2 ? 1 : 0.5,
          ydec: p.id > 2 ? 0 : 1,
          xlabel: "θ (độ điện, theo pha A)",
          title: "Dòng pha A phía van (kA) · sườn cong là trùng dẫn μ",
          series: [{ x: w.th, y: w.ia, color: HMI.pa, width: 1.8, name: "ia" }],
        },
        180,
      ],
    ];
    return specs;
  }, [p, r, w]);

  const inverter = p.alpha > 90;
  const status: [Tone, string] = r.failed
    ? ["crit", "Sự cố chuyển mạch: dòng không chuyển hết trước khi áp van đổi dấu (cos(α+μ) < −1)."]
    : inverter && r.gamma < GAMMA_CRIT
      ? ["crit", `Sự cố chuyển mạch: γ = ${fmtVi(r.gamma)}° nhỏ hơn thời gian phục hồi tq của thyristor.`]
      : inverter && r.gamma < p.gammaMin
        ? ["warn", "Nghịch lưu, γ dưới γmin: nguy cơ sự cố chuyển mạch."]
        : inverter
          ? ["good", "Chế độ nghịch lưu: công suất chảy từ phía DC về lưới AC."]
          : p.alpha < 5
            ? ["warn", "Chỉnh lưu với α < αmin ≈ 5°: không dùng trong vận hành."]
            : ["good", "Chế độ chỉnh lưu: công suất chảy từ lưới AC sang phía DC."];
  const P = r.vd * p.id;
  const dash = r.failed;

  const toGamma = (id: number) => {
    const a = Math.round(alphaForGamma(p.gammaMin, { ...p, id: 3 }) * 2) / 2;
    set({ alpha: a, id });
  };

  return (
    <Panel
      controls={
        <>
          <RangeSlider label="Góc kích α" value={p.alpha} min={0} max={179} step={0.5} format={(v) => `${fmtVi(v)}°`} onChange={(v) => set({ alpha: v })} tip="Tính từ điểm chuyển mạch tự nhiên (giao điểm hai điện áp pha) đến lúc có xung kích. α > 90° là chế độ nghịch lưu." />
          <RangeSlider label="Dòng một chiều Id" value={p.id} min={0} max={5} step={0.05} color={HMI.pa} format={(v) => `${fmtVi(v, 2)} kA`} onChange={(v) => set({ id: v })} tip="Dòng lớn thì góc trùng dẫn μ lớn, γ của trạm nghịch lưu nhỏ đi." />
          <RangeSlider label="Điện áp dây phía van V_LL" value={p.vll} min={100} max={300} step={1} color={HMI.vd} format={(v) => `${v} kV`} onChange={(v) => set({ vll: v })} tip="Vd0 = 3√2/π · V_LL ≈ 1,35 · V_LL cho mỗi cầu 6 xung. Hạ V_LL để mô phỏng sụt áp lưới phía nghịch lưu." />
          <RangeSlider label="Điện kháng chuyển mạch Xc" value={p.xc} min={0} max={20} step={0.1} color={HMI.vd2} format={(v) => `${fmtVi(v)} Ω`} onChange={(v) => set({ xc: v })} tip="Chủ yếu là điện kháng tản MBA chuyển đổi. Xc = 0 thì không có trùng dẫn." />
          <RangeSlider label="Góc tắt tối thiểu γmin" value={p.gammaMin} min={8} max={25} step={0.5} color={HMI.pc} format={(v) => `${fmtVi(v)}°`} onChange={(v) => set({ gammaMin: v })} tip="Ngưỡng an toàn vận hành (thường 15–18°). Mô phỏng báo sự cố chuyển mạch khi γ < 7°, xấp xỉ tq của thyristor." />
          <Select
            label="Cấu hình"
            value={String(p.pulses) as "6" | "12"}
            options={[
              ["6", "Cầu 6 xung"],
              ["12", "Cầu 12 xung (Y/Y + Y/Δ)"],
            ]}
            onChange={(v) => set({ pulses: v === "6" ? 6 : 12 })}
            tip="Cầu 12 xung là hai cầu 6 xung nối tiếp, lệch 30° qua MBA Y/Y và Y/Δ: điện áp gấp đôi, gợn sóng 12 xung."
          />
          <div className="flex flex-wrap gap-2">
            <HoverTip text="Điểm làm việc chỉnh lưu điển hình: α = 15°, Id = 3 kA (bài tập 1 của giáo trình).">
              <button type="button" className={presetBtn} onClick={() => set({ id: 3, alpha: 15 })}>
                Chỉnh lưu α = 15°
              </button>
            </HoverTip>
            <HoverTip text="Tính α để trạm làm việc đúng tại γ = γmin với Id = 3 kA (bài tập 2).">
              <button type="button" className={presetBtn} onClick={() => toGamma(3)}>
                Nghịch lưu γ = γmin
              </button>
            </HoverTip>
            <HoverTip text="Giữ β của nghịch lưu, tăng Id lên 4,2 kA: μ tăng, γ hết chỗ và van không kịp khóa.">
              <button type="button" className={presetBtn} onClick={() => toGamma(4.2)}>
                Sự cố chuyển mạch
              </button>
            </HoverTip>
          </div>
          <Status tone={status[0]}>{status[1]}</Status>
          <Readout
            rows={[
              ["Vd0 (mỗi cầu)", `${fmtVi(r.vd0)} kV`, "Vd0 = 3√2/π · V_LL"],
              ["Góc trùng dẫn μ", dash ? "—" : `${fmtVi(r.mu)}°`, "cos(α+μ) = cos α − √2·Xc·Id/V_LL"],
              ["β = 180° − α", `${fmtVi(r.beta)}°`],
              ["γ = β − μ", dash ? "< 0" : `${fmtVi(r.gamma)}°`, "Khoảng áp ngược trên van vừa tắt. Có ý nghĩa ở chế độ nghịch lưu."],
              ["Vd theo công thức", dash ? "không áp dụng" : `${fmtVi(r.vd)} kV`, "Vd = Vd0·cos α − (3/π)·Xc·Id, nhân 2 với cầu 12 xung"],
              ["Vd tích phân dạng sóng", dash ? "—" : `${fmtVi(w.vdIntegrated)} kV`, "Trung bình số của dạng sóng, để đối chiếu với công thức."],
              ["P = Vd·Id", dash ? "—" : `${fmtVi(P, 0)} MW`],
              ["cos φ", dash ? "—" : fmtVi(r.cosPhi, 3), "cos φ ≈ [cos α + cos(α+μ)]/2"],
              ["Q tiêu thụ", dash ? "—" : `${fmtVi(r.q, 0)} Mvar`, "Cả chỉnh lưu lẫn nghịch lưu LCC đều tiêu thụ công suất phản kháng."],
              ["Q / |P|", !dash && Math.abs(P) > 1 ? fmtVi(r.q / Math.abs(P), 2) : "—"],
            ]}
          />
        </>
      }
    >
      {plots.map(([spec, h]) => (
        <CanvasPlot key={spec.title} spec={spec} height={h} />
      ))}
      <Note>
        Trục hoành là góc điện θ của pha A (va = Vm·cos θ). Điểm chuyển mạch tự nhiên của van V1 ở θ = −60°, xung kích V1 đến muộn hơn một góc α. Vùng tô trên đồ thị điện áp van V1 là khoảng áp ngược sau khi tắt: ở chế độ nghịch lưu, độ rộng của nó chính là góc tắt γ (xanh khi γ ≥ γmin, đỏ khi nhỏ hơn).
      </Note>
    </Panel>
  );
}

/* ---------- Tab 2: đặc tính Vd–Id ---------- */

function CharTab() {
  const [p, setP] = useState({ vacR: 1, vacI: 1, idRef: 1, margin: 0.1, alphaMin: 5, gammaRef: 17, vdcol: true });
  const set = (patch: Partial<typeof p>) => setP((s) => ({ ...s, ...patch }));
  const r = useMemo(() => solveCharacteristic(p), [p]);
  const spec = useMemo<PlotSpec>(
    () => ({
      xmin: 0,
      xmax: 1.4,
      xstep: 0.2,
      ymin: 0,
      ymax: 1.4,
      ystep: 0.2,
      ydec: 1,
      xfmt: (x) => fmtVi(x, 1),
      xlabel: "Id (pu)",
      title: "Đặc tính Vd–Id (pu) và điểm làm việc",
      series: [
        { x: r.rect.i, y: r.rect.u, color: HMI.vd, width: 2.4, name: "Chỉnh lưu (αmin + CC)" },
        { x: r.inv.i, y: r.inv.u, color: HMI.pc, width: 2.4, name: "Nghịch lưu (CEA + CC)" },
        ...(p.vdcol ? [{ x: r.vdcol.i, y: r.vdcol.u, color: HMI.muted, width: 1, dash: [3, 4], name: "VDCOL" }] : []),
      ],
      points: [{ x: r.op.i, y: r.op.u, color: HMI.ink, label: "Điểm làm việc", align: r.op.i > 1.05 ? "right" : "left" }],
      labels: [
        { x: 0.04, y: r.vdAtZero.rect + 0.04, text: `αmin = ${fmtVi(p.alphaMin)}°`, color: HMI.vd },
        { x: 1.36, y: r.vdAtZero.inv + 0.04, text: `γ = ${fmtVi(p.gammaRef)}°`, color: HMI.pc, align: "right" },
      ],
    }),
    [r, p]
  );
  const status: [Tone, string] =
    r.op.u < 0.02
      ? ["crit", "Không truyền được công suất: điện áp chỉnh lưu quá thấp."]
      : r.op.mode === "rectifier-cc"
        ? ["good", "Bình thường: chỉnh lưu giữ dòng (CC), nghịch lưu giữ góc tắt (CEA)."]
        : r.op.mode === "inverter-cc"
          ? ["warn", "Chuyển chế độ: chỉnh lưu chạm αmin, nghịch lưu giữ dòng Id,ref − ΔId."]
          : ["warn", "Vùng chuyển tiếp αmin – CEA: điểm làm việc không xác định chắc chắn."];

  return (
    <Panel
      controls={
        <>
          <RangeSlider label="Điện áp AC trạm chỉnh lưu" value={p.vacR} min={0.5} max={1.15} step={0.01} color={HMI.vd} format={(v) => `${fmtVi(v, 2)} pu`} onChange={(v) => set({ vacR: v })} tip="Hạ xuống khoảng 0,85 pu: đường αmin rơi dưới đường CEA, trạm nghịch lưu nhận quyền giữ dòng." />
          <RangeSlider label="Điện áp AC trạm nghịch lưu" value={p.vacI} min={0.5} max={1.15} step={0.01} color={HMI.pc} format={(v) => `${fmtVi(v, 2)} pu`} onChange={(v) => set({ vacI: v })} />
          <RangeSlider label="Dòng đặt Id,ref" value={p.idRef} min={0.1} max={1.2} step={0.01} color={HMI.pa} format={(v) => `${fmtVi(v, 2)} pu`} onChange={(v) => set({ idRef: v })} />
          <RangeSlider label="Biên dòng ΔId" value={p.margin} min={0.05} max={0.2} step={0.01} color={HMI.pb} format={(v) => `${fmtVi(v, 2)} pu`} onChange={(v) => set({ margin: v })} tip="Dòng đặt của nghịch lưu thấp hơn chỉnh lưu một lượng ΔId ≈ 0,1 pu để hai bộ điều khiển dòng không tranh nhau." />
          <RangeSlider label="αmin chỉnh lưu" value={p.alphaMin} min={2} max={15} step={0.5} color={HMI.vd} format={(v) => `${fmtVi(v)}°`} onChange={(v) => set({ alphaMin: v })} />
          <RangeSlider label="γ đặt nghịch lưu" value={p.gammaRef} min={12} max={30} step={0.5} color={HMI.pc} format={(v) => `${fmtVi(v)}°`} onChange={(v) => set({ gammaRef: v })} />
          <Check label="Bật VDCOL" checked={p.vdcol} onChange={(v) => set({ vdcol: v })} tip="Hạ giới hạn dòng đặt khi Vd thấp: 1,0 pu khi Vd ≥ 0,7 pu, 0,3 pu khi Vd ≤ 0,3 pu." />
          <Status tone={status[0]}>{status[1]}</Status>
          <Readout
            rows={[
              ["Id", `${fmtVi(r.op.i, 3)} pu`],
              ["Vd", `${fmtVi(r.op.u, 3)} pu`],
              ["P = Vd·Id", `${fmtVi(r.op.u * r.op.i, 3)} pu`],
              ["Dòng đặt sau VDCOL", `${fmtVi(r.io, 3)} pu`],
              ["α chỉnh lưu", `${fmtVi(r.alphaR)}°`],
              ["γ nghịch lưu", `${fmtVi(r.gammaI)}°`],
            ]}
          />
        </>
      }
    >
      <CanvasPlot spec={spec} height={420} />
      <Note>
        Đặc tính trạm nghịch lưu được quy về phía chỉnh lưu (cộng sụt áp đường dây R·Id). Hạ điện áp AC trạm chỉnh lưu xuống khoảng 0,85 pu: đường αmin rơi xuống dưới đường CEA, điểm làm việc nhảy sang đường thẳng đứng Id,ref − ΔId. Hệ thống vẫn ổn định, chỉ mất một lượng dòng bằng biên ΔId.
      </Note>
      <Mono>{`Chỉnh lưu (αmin):  Vd = Vd0r·cos αmin − Rc·Id
Nghịch lưu (CEA):  Vd = Vd0i·cos γ − Rc·Id + R·Id   (quy về phía chỉnh lưu)
Vd0r = 1,17·U_AC, Vd0i = 1,15·U_AC (pu),  Rc = 0,092 pu (dx = 8 %),  R = 0,03 pu
VDCOL: Id,lim = 1,0 khi Vd ≥ 0,7;  0,3 khi Vd ≤ 0,3;  nội suy tuyến tính ở giữa`}</Mono>
    </Panel>
  );
}

/* ---------- Tab 3: đáp ứng động ---------- */

function DynTab() {
  const [p, setP] = useState({ scenario: "inv" as DynScenario, depth: 20, durationMs: 100, kp: 1.5, ki: 80, vdcol: true, cfPrevention: false });
  const set = (patch: Partial<typeof p>) => setP((s) => ({ ...s, ...patch }));
  const r = useMemo(() => simulateCcCea(p), [p]);
  const specs = useMemo(() => {
    const bands = r.bands.map(([a, b]) => ({ x0: a * 1000, x1: b * 1000, color: HMI.crit, alpha: 0.22 }));
    const xs = { xmin: 0, xmax: 600, xstep: 100, bands };
    const imax = Math.max(1.4, Math.ceil(r.peakI * 5) / 5 + 0.2);
    const list: [PlotSpec, number][] = [
      [{ ...xs, ymin: 0.4, ymax: 1.1, ystep: 0.1, ydec: 1, title: "Điện áp AC hai trạm (pu)", series: [{ x: r.t, y: r.vacR, color: HMI.vd, name: "chỉnh lưu", width: 1.8 }, { x: r.t, y: r.vacI, color: HMI.pc, name: "nghịch lưu", width: 1.8 }] }, 160],
      [
        {
          ...xs,
          ymin: 0,
          ymax: imax,
          ystep: imax > 2.4 ? 0.5 : 0.2,
          ydec: 1,
          title: "Dòng Id và dòng đặt sau VDCOL (pu)",
          series: [
            { x: r.t, y: r.io, color: HMI.muted, name: "Id,ord", width: 1.2, dash: [5, 4] },
            { x: r.t, y: r.id, color: HMI.ink, name: "Id", width: 2 },
          ],
        },
        190,
      ],
      [{ ...xs, ymin: -0.2, ymax: 1.3, ystep: 0.2, ydec: 1, title: "Điện áp một chiều hai trạm (pu)", series: [{ x: r.t, y: r.vdr, color: HMI.vd, name: "Vd chỉnh lưu", width: 1.6 }, { x: r.t, y: r.vdi, color: HMI.pc, name: "Vd nghịch lưu", width: 1.6 }] }, 190],
      [
        {
          ...xs,
          ymin: 0,
          ymax: 90,
          ystep: 15,
          xlabel: "t (ms)",
          title: "Góc điều khiển (độ)",
          hlines: [{ y: GAMMA_CRIT, color: HMI.crit, label: "γ tới hạn ≈ tq" }],
          series: [
            { x: r.t, y: r.alpha, color: HMI.vd, name: "α chỉnh lưu", width: 1.6 },
            { x: r.t, y: r.beta, color: HMI.pa, name: "β nghịch lưu", width: 1.6 },
            { x: r.t, y: r.gamma, color: HMI.pc, name: "γ nghịch lưu", width: 1.8 },
          ],
        },
        200,
      ],
    ];
    return list;
  }, [r]);
  const status: [Tone, string] =
    r.cfCount > 0
      ? ["crit", `Xảy ra ${r.cfCount} lần sự cố chuyển mạch.`]
      : r.minGamma < 15
        ? ["warn", `Không có sự cố chuyển mạch nhưng γ xuống thấp (${fmtVi(r.minGamma)}°).`]
        : ["good", "Không có sự cố chuyển mạch; hệ thống phục hồi."];

  return (
    <Panel
      controls={
        <>
          <Select
            label="Sự kiện tại t = 0,1 s"
            value={p.scenario}
            options={[
              ["inv", "Sụt áp AC phía nghịch lưu"],
              ["rec", "Sụt áp AC phía chỉnh lưu"],
              ["step", "Giảm dòng đặt rồi phục hồi"],
            ]}
            onChange={(v) => set({ scenario: v })}
          />
          <RangeSlider label="Độ sâu sụt áp" value={p.depth} min={0} max={50} step={1} color={HMI.pc} format={(v) => `${v} %`} onChange={(v) => set({ depth: v })} tip="Sụt áp ba pha 10–15 % ở phía nghịch lưu đã có thể gây sự cố chuyển mạch khi γ danh định 15–18°." />
          <RangeSlider label="Thời gian sụt áp" value={p.durationMs} min={20} max={250} step={5} color={HMI.pa} format={(v) => `${v} ms`} onChange={(v) => set({ durationMs: v })} />
          <RangeSlider label="Hệ số Kp bộ CC" value={p.kp} min={0.2} max={4} step={0.1} color={HMI.vd} format={(v) => `${fmtVi(v)} rad/pu`} onChange={(v) => set({ kp: v })} tip="Khâu tỷ lệ của bộ điều khiển dòng chỉnh lưu: α = α0 − (Kp·e + Ki∫e dt)." />
          <RangeSlider label="Hệ số Ki bộ CC" value={p.ki} min={5} max={300} step={5} color={HMI.vd2} format={(v) => `${v} rad/(pu·s)`} onChange={(v) => set({ ki: v })} />
          <Check label="Bật VDCOL" checked={p.vdcol} onChange={(v) => set({ vdcol: v })} />
          <Check label="Bật chống sự cố chuyển mạch (tăng γ khi phát hiện sụt áp)" checked={p.cfPrevention} onChange={(v) => set({ cfPrevention: v })} tip="Khi điện áp AC nghịch lưu dưới 0,95 pu, tăng tạm thời γ đặt tối đa 25° để giữ dự trữ góc tắt." />
          <Status tone={status[0]}>{status[1]}</Status>
          <Readout
            rows={[
              ["α ban đầu", `${fmtVi(r.alpha0)}°`],
              ["β ban đầu", `${fmtVi(r.beta0)}°`],
              ["Id lớn nhất", `${fmtVi(r.peakI, 2)} pu`],
              ["γ nhỏ nhất", `${fmtVi(r.minGamma)}°`],
              ["Số lần sự cố chuyển mạch", String(r.cfCount)],
            ]}
          />
        </>
      }
    >
      {specs.map(([spec, h]) => (
        <CanvasPlot key={spec.title} spec={spec} height={h} />
      ))}
      <Note>
        Mô hình giá trị trung bình, bước tính 50 µs. Bộ CEA dự đoán tính β từ điện áp AC đã lọc (τ = 15 ms) nên phản ứng chậm hơn sụt áp đột ngột. Khi γ thực tế nhỏ hơn 7° (≈ thời gian tq của thyristor), mô hình ghi nhận sự cố chuyển mạch: điện áp nghịch lưu về 0 trong nửa chu kỳ và dòng tăng vọt (vùng tô đỏ). Thử sụt áp 20 % khi tắt rồi bật chức năng chống sự cố chuyển mạch.
      </Note>
    </Panel>
  );
}

/* ---------- Tab 4: PWM ---------- */

function PwmTab() {
  const [p, setP] = useState({ mode: "spwm" as PwmMode, ma: 0.9, mf: 21, theta: 40 });
  const set = (patch: Partial<typeof p>) => setP((s) => ({ ...s, ...patch }));
  const N = 8000;
  const data = useMemo(() => {
    const w = pwmWaves(p.ma, p.mf, p.mode, N);
    const H = Math.min(200, 4 * p.mf + 20);
    const sp = spectrum(w.vab, H);
    return { w, H, sp };
  }, [p.ma, p.mf, p.mode]);
  const sv = useMemo(() => svTimes(p.ma, p.theta), [p.ma, p.theta]);
  const lim = pwmLinearLimit(p.mode);
  const specs = useMemo(() => {
    const x = Array.from({ length: N }, (_, i) => (360 * i) / (N - 1));
    const { w, H, sp } = data;
    const f1 = x.map((_, i) => sp.amps[0] * Math.cos((2 * Math.PI * i) / N - sp.phi));
    const list: [PlotSpec, number][] = [
      [
        {
          xmin: 0,
          xmax: 360,
          xstep: 60,
          xfmt: (v) => `${v}°`,
          ymin: -1.35,
          ymax: 1.35,
          ystep: 0.5,
          ydec: 1,
          title: "Sóng điều chế và sóng mang (đơn vị: biên độ sóng mang)",
          series: [
            { x, y: w.tri, color: HMI.muted, width: 0.8, name: "sóng mang" },
            { x, y: w.ra, color: HMI.pa, width: 2, name: "v*a" },
            { x, y: w.rb, color: HMI.pb, width: 1.4, name: "v*b", dash: [5, 3] },
          ],
        },
        190,
      ],
      [
        {
          xmin: 0,
          xmax: 360,
          xstep: 60,
          xfmt: (v) => `${v}°`,
          ymin: -1.2,
          ymax: 1.2,
          ystep: 0.5,
          ydec: 1,
          title: "Điện áp nhánh va0 và điện áp dây vab (đơn vị Ud)",
          series: [
            { x, y: w.va.map((v) => v * 0.98), color: HMI.pa, width: 0.8, name: "va0 = ±Ud/2" },
            { x, y: w.vab, color: HMI.vd, width: 1, name: "vab" },
            { x, y: f1, color: HMI.vd2, width: 2.2, name: "sóng cơ bản vab" },
          ],
        },
        190,
      ],
      [
        {
          xmin: 0,
          xmax: H + 1,
          xstep: H > 120 ? 20 : 10,
          ymin: 0,
          ymax: Math.max(100, Math.ceil((sp.amps[0] * 100) / 20) * 20 + 10),
          ystep: 20,
          xlabel: "bậc sóng hài h",
          title: "Phổ biên độ điện áp dây vab (% Ud)",
          bars: sp.amps.map((A, i) => ({ x: i + 1, y: A * 100, color: i === 0 ? HMI.vd2 : HMI.vd })),
        },
        190,
      ],
    ];
    return list;
  }, [data]);
  const { sp } = data;
  const theo = p.ma <= lim ? (Math.sqrt(3) / 2) * p.ma : null;
  const low = [5, 7, 11, 13].map((h) => (sp.amps[h - 1] / sp.amps[0]) * 100);
  const states = ["100", "110", "010", "011", "001", "101"];
  const seg = (v: number, color: string, label: string) =>
    v > 0.001 ? (
      <span key={label} className="flex items-center justify-center overflow-hidden whitespace-nowrap" style={{ width: `${v * 100}%`, background: color, color: "#0B1220" }}>
        {v > 0.09 ? label : ""}
      </span>
    ) : null;

  return (
    <Panel
      controls={
        <>
          <Select
            label="Phương pháp điều chế"
            value={p.mode}
            options={[
              ["spwm", "SPWM sin – tam giác"],
              ["thi", "SPWM + bơm sóng hài bậc 3 (1/6)"],
              ["sv", "SVPWM (thứ tự không min–max)"],
            ]}
            onChange={(v) => set({ mode: v })}
            tip="Bơm thứ tự không (bậc 3 hoặc min–max) không đổi điện áp dây nhưng hạ đỉnh điện áp pha, nâng giới hạn tuyến tính từ 1 lên 2/√3 ≈ 1,155."
          />
          <RangeSlider label="Chỉ số điều chế biên độ ma" value={p.ma} min={0.1} max={1.3} step={0.01} color={HMI.pa} format={(v) => fmtVi(v, 2)} onChange={(v) => set({ ma: v })} tip="ma = biên độ sóng điều chế / biên độ sóng mang. Vượt giới hạn tuyến tính thì xuất hiện sóng hài bậc thấp 5, 7." />
          <RangeSlider label="Tỷ số tần số mf = fc/f1" value={p.mf} min={3} max={63} step={2} color={HMI.vd} format={(v) => String(v)} onChange={(v) => set({ mf: v })} tip="Chọn mf lẻ và là bội của 3 để sóng hài tại tần số sóng mang triệt tiêu trong điện áp dây." />
          <RangeSlider label="Góc vector đặt θ (cho lục giác)" value={p.theta} min={0} max={359} step={1} color={HMI.accent} format={(v) => `${v}°`} onChange={(v) => set({ theta: v })} />
          <Status tone={p.ma > lim ? "warn" : "good"}>
            {p.ma > lim ? `Quá điều chế (ma > ${fmtVi(lim, 3)}): xuất hiện sóng hài bậc thấp 5, 7, 11, 13.` : "Vùng tuyến tính: biên độ cơ bản tỷ lệ với ma."}
          </Status>
          <Readout
            rows={[
              ["Vab1 đỉnh đo được", `${fmtVi(sp.amps[0], 3)} Ud`],
              ["Lý thuyết √3/2·ma", theo ? `${fmtVi(theo, 3)} Ud` : "—", "Chỉ đúng trong vùng tuyến tính."],
              ["Giới hạn tuyến tính ma", fmtVi(lim, 3)],
              ["THD điện áp dây", `${fmtVi(sp.thd)} %`],
              ["Bậc 5 / 7", `${fmtVi(low[0], 2)} / ${fmtVi(low[1], 2)} %`],
              ["Bậc 11 / 13", `${fmtVi(low[2], 2)} / ${fmtVi(low[3], 2)} %`],
              ["Dải sóng hài chính quanh", `${p.mf}·f1`],
            ]}
          />
        </>
      }
    >
      {specs.map(([spec, h]) => (
        <CanvasPlot key={spec.title} spec={spec} height={h} />
      ))}
      <figure className="bg-slate-950 rounded-xl border border-slate-800 p-3 grid grid-cols-1 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-4 items-start">
        <SvHexagon v={sv.v} theta={p.theta} sector={sv.sector} t1={sv.t1} t2={sv.t2} over={sv.over} />
        <div className="space-y-2.5 min-w-0">
          <figcaption className="text-xs font-semibold text-slate-300">Tổng hợp vector không gian trong một chu kỳ Ts</figcaption>
          <div className="flex h-6 rounded overflow-hidden text-[11px] font-mono border border-slate-800">
            {seg(sv.t0 / 2, HMI.muted, "T0/2")}
            {seg(sv.t1, HMI.pb, `T1 ${fmtVi(sv.t1 * 100, 0)}%`)}
            {seg(sv.t2, HMI.pc, `T2 ${fmtVi(sv.t2 * 100, 0)}%`)}
            {seg(sv.t0 / 2, HMI.muted, "T0/2 ")}
          </div>
          <Mono>{`Sector ${sv.sector + 1}: V${sv.sector + 1} (${states[sv.sector]}) và V${((sv.sector + 1) % 6) + 1} (${states[(sv.sector + 1) % 6]}),  θ trong sector = ${fmtVi(sv.thetaInSector, 0)}°
|Vref| = ma·Ud/2 = ${fmtVi(sv.v, 3)} Ud   (giới hạn tuyến tính Ud/√3 = 0,577 Ud)
T1 = √3·Ts·|V|/Ud·sin(60° − θ) = ${fmtVi(sv.t1, 3)} Ts
T2 = √3·Ts·|V|/Ud·sin θ        = ${fmtVi(sv.t2, 3)} Ts
T0 = Ts − T1 − T2              = ${fmtVi(sv.t0, 3)} Ts${sv.over ? "   (quá điều chế, đã chuẩn hóa)" : ""}`}</Mono>
          <Note>
            Sáu vector tích cực (độ lớn 2Ud/3) chia mặt phẳng αβ thành 6 sector. Vector đặt được ghép từ hai vector kề nhau trong thời gian T1, T2 và vector không trong T0. Đường tròn nội tiếp lục giác (bán kính Ud/√3) là giới hạn điều chế tuyến tính.
          </Note>
        </div>
      </figure>
    </Panel>
  );
}

/* ---------- Tab 5: điều khiển vector ---------- */

function VecTab() {
  const [p, setP] = useState({ x: 0.15, tauMs: 2, decoupling: true, feedforward: true });
  const set = (patch: Partial<typeof p>) => setP((s) => ({ ...s, ...patch }));
  const r = useMemo(() => simulateDqCurrent(p), [p]);
  const specs = useMemo(() => {
    const xs = { xmin: 0, xmax: 140, xstep: 20 };
    const list: [PlotSpec, number][] = [
      [
        {
          ...xs,
          ymin: -0.8,
          ymax: 1.4,
          ystep: 0.2,
          ydec: 1,
          title: "Dòng trục d và q (pu)",
          series: [
            { x: r.t, y: r.idRef, color: HMI.vd, dash: [5, 4], width: 1, name: "i*d" },
            { x: r.t, y: r.id, color: HMI.vd, width: 2, name: "id" },
            { x: r.t, y: r.iqRef, color: HMI.pc, dash: [5, 4], width: 1, name: "i*q" },
            { x: r.t, y: r.iq, color: HMI.pc, width: 2, name: "iq" },
          ],
        },
        210,
      ],
      [{ ...xs, ymin: -0.4, ymax: 1.4, ystep: 0.2, ydec: 1, title: "Công suất tác dụng và phản kháng (pu)", series: [{ x: r.t, y: r.p, color: HMI.vd, width: 2, name: "P = vd·id" }, { x: r.t, y: r.q, color: HMI.vd2, width: 2, name: "Q = −vd·iq" }] }, 180],
      [
        {
          ...xs,
          ymin: -1.4,
          ymax: 1.4,
          ystep: 0.5,
          ydec: 1,
          xlabel: "t (ms)",
          title: "Dòng ba pha sau biến đổi Park ngược (pu)",
          series: [
            { x: r.t, y: r.ia, color: HMI.pa, width: 1.4, name: "ia" },
            { x: r.t, y: r.ib, color: HMI.pb, width: 1.4, name: "ib" },
            { x: r.t, y: r.ic, color: HMI.pc, width: 1.4, name: "ic" },
          ],
        },
        180,
      ],
    ];
    return list;
  }, [r]);
  const status: [Tone, string] = !p.feedforward
    ? ["warn", "Không bù thuận vg: khâu tích phân phải tự tạo 1 pu điện áp, đáp ứng chậm và dao động lúc đầu."]
    : r.dev > 0.05
      ? ["warn", `Ghép chéo rõ: bước id làm iq lệch tới ${fmtVi(r.dev, 2)} pu.`]
      : ["good", "Hai kênh d, q gần như độc lập."];

  return (
    <Panel
      controls={
        <>
          <RangeSlider label="Điện kháng pha X" value={p.x} min={0.05} max={0.3} step={0.01} color={HMI.vd} format={(v) => `${fmtVi(v, 2)} pu`} onChange={(v) => set({ x: v })} tip="Cuộn kháng pha cộng điện kháng MBA. Số hạng ghép chéo giữa hai trục là ωL·i = X·i (pu)." />
          <RangeSlider label="Hằng số thời gian vòng kín τ" value={p.tauMs} min={0.5} max={10} step={0.1} color={HMI.pa} format={(v) => `${fmtVi(v)} ms`} onChange={(v) => set({ tauMs: v })} tip="Chỉnh định IMC: Kp = L/τ, Ki = R/τ. Thời gian tăng 10–90 % lý thuyết ≈ 2,2·τ." />
          <Check label="Bù tách kênh ωL (decoupling)" checked={p.decoupling} onChange={(v) => set({ decoupling: v })} tip="Trừ −ωL·iq ở kênh d và cộng +ωL·id ở kênh q để hai kênh độc lập." />
          <Check label="Bù thuận điện áp lưới vg" checked={p.feedforward} onChange={(v) => set({ feedforward: v })} />
          <Mono>{`v*cd = vgd + PI(i*d − id) − ωL·iq
v*cq = vgq + PI(i*q − iq) + ωL·id
Kp = L/τ,  Ki = R/τ  (IMC)`}</Mono>
          <Status tone={status[0]}>{status[1]}</Status>
          <Readout
            rows={[
              ["Kp", `${fmtVi(r.kp, 4)} pu`],
              ["Ki", `${fmtVi(r.ki, 2)} pu/s`],
              ["Thời gian tăng id (10–90 %)", r.rise ? `${fmtVi(r.rise)} ms` : "—"],
              ["Lý thuyết 2,2·τ", `${fmtVi(2.2 * p.tauMs)} ms`],
              ["Lệch iq lớn nhất khi id đổi", `${fmtVi(r.dev, 3)} pu`],
            ]}
          />
        </>
      }
    >
      {specs.map(([spec, h]) => (
        <CanvasPlot key={spec.title} spec={spec} height={h} />
      ))}
      <Note>
        Lệnh: i*d bước 0 → 1 pu tại 10 ms và 1 → 0,5 pu tại 90 ms; i*q bước 0 → −0,5 pu tại 50 ms (phát 0,5 pu công suất phản kháng). Trục d đặt trùng vector điện áp lưới nên P = vd·id và Q = −vd·iq. Tắt bù tách kênh để thấy bước id làm iq lệch khỏi giá trị đặt: đó là số hạng ghép chéo ωL.
      </Note>
    </Panel>
  );
}

/* ---------- Tab 6: tích hợp, thiết kế sơ bộ liên kết LCC ---------- */

type Row = [string, string, string?];

function Tier({ n, title, lessons, rows }: { n: number; title: string; lessons: string[]; rows: Row[] }) {
  return (
    <section className="bg-slate-950 rounded-xl border border-slate-800 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-white">
          <span className="font-mono text-xs text-amber-400 mr-2">Tầng {n}</span>
          {title}
        </h4>
        <span className="flex flex-wrap gap-1">
          {lessons.map((id) => (
            <Link key={id} href={lessonHref(id)} className="text-[11px] font-mono px-1.5 py-0.5 rounded border border-slate-700 text-cyan-300 hover:border-cyan-500">
              Bài {id}
            </Link>
          ))}
        </span>
      </div>
      <Readout rows={rows} />
    </section>
  );
}

function DesignTab() {
  const [p, setP] = useState<LccLinkInput>(LCC_LINK_DEFAULT);
  const set = (patch: Partial<LccLinkInput>) => setP((s) => ({ ...s, ...patch }));
  const d = useMemo(() => designLccLink(p), [p]);
  const n0 = (x: number) => String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const status: [Tone, string] =
    d.esrcInv < 2
      ? ["crit", `ESCR phía nhận ≈ ${fmtVi(d.esrcInv, 2)}: lưới rất yếu, LCC khó vận hành an toàn. Cần máy bù đồng bộ, STATCOM hoặc chuyển sang VSC.`]
      : d.esrcInv < 2.5
        ? ["warn", `ESCR phía nhận ≈ ${fmtVi(d.esrcInv, 2)}: lưới yếu. Chỉ cần điện áp AC sụt khoảng ${fmtVi(d.cfDropPct, 0)} % là đủ gây sự cố chuyển mạch.`]
        : d.cfDropPct < 12
          ? ["warn", `Dự trữ góc tắt nhỏ: sụt áp AC ${fmtVi(d.cfDropPct, 0)} % đã gây sự cố chuyển mạch.`]
          : ["good", `Phương án hợp lý ở mức sơ bộ. Sụt áp AC phía nhận dưới khoảng ${fmtVi(d.cfDropPct, 0)} % chưa gây sự cố chuyển mạch.`];
  const conv = (p.powerMW * LCC_STATION_LOSS_PCT) / 100;
  const flow: [string, number, string][] = [
    ["Nhận về lưới", d.pReceived, HMI.good],
    ["Tổn hao đường dây", d.lineLossMW, HMI.pc],
    ["Tổn hao hai trạm", p.powerMW - d.pReceived - d.lineLossMW, HMI.pa],
  ];

  return (
    <Panel
      controls={
        <>
          <RangeSlider label="Công suất truyền tải P" value={p.powerMW} min={500} max={8000} step={100} color={HMI.pa} format={(v) => `${n0(v)} MW`} onChange={(v) => set({ powerMW: v })} tip="Công suất danh định đầu chỉnh lưu của cả liên kết." />
          <Select
            label="Điện áp cực"
            value={String(p.vdPoleKV)}
            options={[
              ["400", "±400 kV"],
              ["500", "±500 kV"],
              ["660", "±660 kV"],
              ["800", "±800 kV"],
            ]}
            onChange={(v) => set({ vdPoleKV: Number(v) })}
            tip="Mỗi cực là một cầu 12 xung gồm hai cầu 6 xung nối tiếp, nên mỗi cầu 6 xung mang một nửa điện áp cực."
          />
          <Select
            label="Cấu hình"
            value={String(p.poles) as "1" | "2"}
            options={[
              ["2", "Lưỡng cực (bipole)"],
              ["1", "Đơn cực (monopole)"],
            ]}
            onChange={(v) => set({ poles: v === "1" ? 1 : 2 })}
          />
          <RangeSlider label="Chiều dài đường dây" value={p.lengthKm} min={100} max={3000} step={50} color={HMI.vd} format={(v) => `${n0(v)} km`} onChange={(v) => set({ lengthKm: v })} />
          <RangeSlider label="Điện trở một cực" value={p.rOhmPerKm} min={0.003} max={0.015} step={0.0001} color={HMI.vd2} format={(v) => `${fmtVi(v, 4)} Ω/km`} onChange={(v) => set({ rOhmPerKm: v })} tip="Một sợi ACSR 720 mm² có khoảng 0,04 Ω/km; chia cho số dây phân pha: 4 sợi ≈ 0,010, 6 sợi ≈ 0,0067 Ω/km. Đây là giả định để học." />
          <RangeSlider label="α danh định chỉnh lưu" value={p.alphaDeg} min={10} max={20} step={0.5} format={(v) => `${fmtVi(v)}°`} onChange={(v) => set({ alphaDeg: v })} tip="Thường 12,5–17,5°, được OLTC giữ trong dải này (bài 0.6)." />
          <RangeSlider label="γ danh định nghịch lưu" value={p.gammaDeg} min={12} max={22} step={0.5} color={HMI.pc} format={(v) => `${fmtVi(v)}°`} onChange={(v) => set({ gammaDeg: v })} tip="γ lớn thì an toàn hơn trước sự cố chuyển mạch, nhưng tiêu thụ nhiều Q hơn." />
          <RangeSlider label="Sụt áp chuyển mạch dx" value={p.dxPct} min={4} max={12} step={0.5} color={HMI.vd2} format={(v) => `${fmtVi(v)} %`} onChange={(v) => set({ dxPct: v })} tip="dx = (3/π)·Xc·Id / Vd0, thường 6–9 %. Quyết định điện kháng tản cần thiết của MBA chuyển đổi." />
          <RangeSlider label="SCR lưới phía nhận" value={p.scrInv} min={1.5} max={6} step={0.1} color={HMI.pb} format={(v) => fmtVi(v, 1)} onChange={(v) => set({ scrInv: v })} tip="SCR = Sk/Pd. ESCR trừ đi phần Q của bộ lọc và tụ bù lắp tại trạm." />
          <RangeSlider label="Điện áp khóa thyristor" value={p.vdrmKV} min={6} max={8.5} step={0.1} color={HMI.accent} format={(v) => `${fmtVi(v)} kV`} onChange={(v) => set({ vdrmKV: v })} />
          <button type="button" className={presetBtn} onClick={() => setP(LCC_LINK_DEFAULT)}>
            Về ví dụ chuẩn ±500 kV, 3000 MW
          </button>
          <Status tone={status[0]}>{status[1]}</Status>
        </>
      }
    >
      <figure className="bg-slate-950 rounded-xl border border-slate-800 p-4">
        <figcaption className="text-xs font-semibold text-slate-300 mb-2">
          Cân bằng công suất: {n0(p.powerMW)} MW gửi đi, hiệu suất {fmtVi(d.efficiencyPct)} %
        </figcaption>
        <div className="flex h-7 rounded overflow-hidden text-[11px] font-mono">
          {flow.map(([label, v, color]) => (
            <span key={label} title={`${label}: ${n0(v)} MW`} className="flex items-center justify-center whitespace-nowrap overflow-hidden" style={{ width: `${(v / p.powerMW) * 100}%`, background: color, color: "#0B1220" }}>
              {v / p.powerMW > 0.12 ? `${label} ${n0(v)} MW` : ""}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Đường dây {n0(d.lineLossMW)} MW, hai trạm {n0(p.powerMW - d.pReceived - d.lineLossMW)} MW (khoảng {fmtVi(LCC_STATION_LOSS_PCT)} % mỗi trạm, bài 0.3).
        </p>
      </figure>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Tier
          n={1}
          title="Hệ thống và đường dây"
          lessons={["0.6", "1.1", "1.2"]}
          rows={[
            ["Dòng một chiều mỗi cực Id", `${fmtVi(d.id, 2)} kA`, "Id = P_cực / Vd_cực. Đây là dòng đặt 1,0 pu của bộ CC chỉnh lưu."],
            ["Điện trở và sụt áp đường dây", `${fmtVi(d.rLine, 2)} Ω · ${fmtVi(d.lineDropKV)} kV`],
            ["Tổn hao đường dây", `${n0(d.lineLossMW)} MW`, "Số cực × Id² × R. Nâng điện áp cực thì Id giảm, tổn hao giảm theo bình phương."],
            ["Điện áp cực phía nghịch lưu", `${fmtVi(d.inv.vdPole)} kV`],
            ["ESCR phía nhận", fmtVi(d.esrcInv, 2), "ESCR = (Sk − Q bộ lọc)/Pd. Dưới 2 là rất yếu, 2–3 là yếu, trên 3 là mạnh (bài 0.5)."],
          ]}
        />
        <Tier
          n={2}
          title="Trạm và điều khiển"
          lessons={["0.5", "0.6", "3.1"]}
          rows={[
            ["Q tiêu thụ trạm chỉnh lưu", `${n0(d.rect.q)} Mvar`, "Bộ lọc AC và tụ bù phải cấp gần hết lượng này, chia nhóm đóng cắt theo tải."],
            ["Q tiêu thụ trạm nghịch lưu", `${n0(d.inv.q)} Mvar`],
            ["cos φ chỉnh lưu", fmtVi(d.rect.cosPhi, 3), "cos φ ≈ [cos α + cos(α+μ)]/2"],
            ["β cần đặt ở nghịch lưu", `${fmtVi(d.inv.beta)}°`, "β = arccos(cos γ − √2·Xc·Id/V_LL), đúng công thức của bộ CEA dự đoán."],
            ["Sụt áp AC gây sự cố chuyển mạch", `≈ ${fmtVi(d.cfDropPct)} %`, "Giữ nguyên β và Id, hạ điện áp AC phía nhận cho tới khi γ < 7° (≈ tq). Thực tế Id tăng theo nên ngưỡng còn thấp hơn."],
          ]}
        />
        <Tier
          n={3}
          title="Cầu 12 xung và MBA chuyển đổi"
          lessons={["0.4", "0.5", "1.3"]}
          rows={[
            ["Vd0 mỗi cầu chỉnh lưu", `${fmtVi(d.rect.vd0)} kV`, "Vd_cầu = Vd0·(cos α − dx)"],
            ["V_LL phía van chỉnh lưu / nghịch lưu", `${fmtVi(d.rect.vll)} / ${fmtVi(d.inv.vll)} kV`, "V_LL = Vd0 / 1,35. Nấc OLTC chọn tỷ số biến để đạt điện áp này."],
            ["Điện kháng chuyển mạch Xc", `${fmtVi(d.xc, 2)} Ω`, "Xc = dx·Vd0 / ((3/π)·Id), chủ yếu là điện kháng tản MBA."],
            ["Góc trùng dẫn μ (chỉnh lưu / nghịch lưu)", `${fmtVi(d.rect.mu)}° / ${fmtVi(d.inv.mu)}°`],
            ["Công suất mỗi MBA (mỗi cầu)", `${n0(d.transformerMVA)} MVA`, "S = (π/3)·Vd0·Id, lớn hơn P của cầu khoảng 15–20 % vì dòng không sin và Q."],
            ["Số MBA mỗi trạm", `${d.transformersPerStation} (Y/Y và Y/Δ)`],
          ]}
        />
        <Tier
          n={4}
          title="Van thyristor"
          lessons={["0.2", "0.6"]}
          rows={[
            ["Số van mỗi trạm", `${d.valvesPerStation} van (${d.valvesPerStation / 4} van bốn)`, "Mỗi cầu 6 xung có 6 van; mỗi cầu 12 xung có 3 van bốn (quadrivalve)."],
            ["Điện áp đỉnh đặt lên van", `${fmtVi(d.valvePeakKV)} kV`, "Bằng đỉnh điện áp dây phía van √2·V_LL, chưa tính quá áp đóng cắt."],
            ["Dòng trung bình / hiệu dụng qua van", `${fmtVi(d.valveIavg, 2)} / ${fmtVi(d.valveIrms, 2)} kA`, "Mỗi van dẫn 120°: I_TB = Id/3, I_hd = Id/√3."],
          ]}
        />
        <Tier
          n={5}
          title="Linh kiện"
          lessons={["0.1", "0.2"]}
          rows={[
            ["Số cấp thyristor tối thiểu mỗi van", `${d.levelsMin} cấp`, "√2·V_LL / V_DRM. Thiết kế thực tế còn tính mức bảo vệ của chống sét van, nên nhiều cấp hơn."],
            ["Kèm cấp dự phòng (≈ 3 %, tối thiểu 2)", `${d.levelsRedundant} cấp`],
            ["Tổng số thyristor mỗi trạm (ước tính)", n0(d.levelsRedundant * d.valvesPerStation)],
            ["Nhiệt cần tản mỗi trạm", `≈ ${n0(conv)} MW`, "Tổn hao trạm khoảng 0,7 % P, phần lớn ở van, do hệ thống nước khử ion mang ra ngoài để giữ Tj."],
          ]}
        />
      </div>
      <Note>
        Bài toán đi ngược từ yêu cầu truyền tải xuống linh kiện, dùng đúng công thức của các bài 0.2–0.6. Ví dụ chuẩn ±500 kV, 3000 MW cho ra mỗi cầu chỉnh lưu có V_LL ≈ 209 kV, Xc ≈ 7,9 Ω, Id = 3 kA: chính là bài tập 1 của giáo trình. Ước tính sơ bộ để học, không thay cho tính toán thiết kế của dự án.
      </Note>
    </Panel>
  );
}

/* ---------- khung lab ---------- */

const TAB_BODY: Record<FiringTab, React.ComponentType> = { wave: WaveTab, char: CharTab, dyn: DynTab, pwm: PwmTab, vec: VecTab, design: DesignTab };

/**
 * Phòng lab góc kích và điều chế. `anchors` (trang Phòng lab) tạo các neo #firing-wave… để bài học Cấp độ 0
 * dẫn thẳng tới từng tab; mỗi tab chỉ được tính khi mở lần đầu, sau đó giữ nguyên trạng thái.
 */
export default function FiringAngleLab({ initialTab = "wave", anchors = false }: { initialTab?: FiringTab; anchors?: boolean }) {
  const [tab, setTab] = useState<FiringTab>(initialTab);
  const [visited, setVisited] = useState<FiringTab[]>([initialTab]);

  const open = (t: FiringTab, updateHash = false) => {
    setTab(t);
    setVisited((v) => (v.includes(t) ? v : [...v, t]));
    if (updateHash && anchors) history.replaceState(null, "", `#firing-${t}`);
  };

  // Trên màn hình hẹp, cuộn thanh tab để tab đang chọn luôn nhìn thấy (kể cả khi mở thẳng bằng #firing-design)
  useEffect(() => {
    const btn = document.getElementById(`firing-tab-${tab}`);
    const bar = btn?.parentElement;
    if (btn && bar) bar.scrollLeft = btn.offsetLeft - bar.offsetLeft - 8;
  }, [tab]);

  useEffect(() => {
    if (!anchors) return;
    const fromHash = () => {
      const m = window.location.hash.match(/^#firing-(\w+)$/);
      if (m && isTab(m[1])) open(m[1]);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchors]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = FIRING_TABS.length;
    const next = FIRING_TABS[(i + (e.key === "ArrowRight" ? 1 : n - 1)) % n].id;
    open(next, true);
    document.getElementById(`firing-tab-${next}`)?.focus();
  };

  return (
    <div className="theme-dark relative bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl">
      {anchors && FIRING_TABS.map((t) => <span key={t.id} id={`firing-${t.id}`} className="absolute -top-24" aria-hidden="true" />)}
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Gauge className="w-5 h-5" />
        </span>
        <h3 className="text-xl font-bold text-white">Mô phỏng góc kích HVDC: 6 bài thực hành</h3>
      </div>
      <p className="text-xs text-slate-400 mb-5 max-w-3xl">
        Kéo thanh trượt để thấy góc α, β, γ, μ thay đổi dạng sóng, điện áp một chiều, công suất phản kháng và nguy cơ sự cố chuyển mạch; sau đó sang PWM và điều khiển vector của VSC. Ký hiệu theo IEC 60633, mô hình lý tưởng hóa dùng cho đào tạo.
      </p>

      <div role="tablist" aria-label="Các bài thực hành" className="flex gap-1 overflow-x-auto border-b border-slate-800 mb-5 -mx-1 px-1">
        {FIRING_TABS.map((t, i) => (
          <button
            key={t.id}
            id={`firing-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            aria-controls={`firing-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => open(t.id, true)}
            onKeyDown={(e) => onKey(e, i)}
            className={`shrink-0 px-3 py-2.5 text-sm border-b-2 -mb-px transition ${
              tab === t.id ? "border-cyan-400 text-white font-semibold" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span className="font-mono text-xs text-slate-500 mr-1.5">{i + 1}</span>
            {t.label}
          </button>
        ))}
      </div>

      {FIRING_TABS.filter((t) => visited.includes(t.id)).map((t) => {
        const Body = TAB_BODY[t.id];
        return (
          <div key={t.id} id={`firing-panel-${t.id}`} role="tabpanel" aria-labelledby={`firing-tab-${t.id}`} hidden={tab !== t.id}>
            <Body />
          </div>
        );
      })}
    </div>
  );
}
