/**
 * Thư viện tính toán đại lượng điện tử công suất HVDC
 * Tuân thủ chuẩn tài liệu EVNNPT:
 * - Vd0: Điện áp một chiều lý thuyết không tải của 1 cầu 6 xung = (3 * sqrt(2) / PI) * V_LL ≈ 1.35 V_LL
 * - Vd: Điện áp một chiều trung bình = Vd0 * [cos(α) + cos(α + μ)] / 2  (μ = 0 → Vd = Vd0 * cos α)
 * - Góc dập nghịch lưu: γ = 180° - (α + μ)
 * - Sóng hài bậc: n = 6k +- 1 (AC) / 6k (DC) đối với cầu 6-pulse; 12k +- 1 (AC) / 12k (DC) đối với cầu 12-pulse
 */

import {
  ElectricalMetrics,
  ViCharacteristicParams,
  ViOperatingPoint,
  WaveformParams,
  WaveformPoint,
} from "@/types/hvdc";

const DEG = Math.PI / 180;

/** Hệ số Vd0 / V_LL của một cầu 6 xung: 3√2/π ≈ 1.3505 */
export const VD0_FACTOR = (3 * Math.SQRT2) / Math.PI;

/**
 * Điện áp DC tức thời của một cầu 6 xung Graetz có góc kích α và góc trùng dẫn μ.
 * Sáu điện áp dây u_k(θ) = Vm·sin(θ - k·60°); van thứ k dẫn trong đoạn [60° + k·60° + α, 120° + k·60° + α].
 * Trong μ độ đầu mỗi đoạn (chuyển mạch k-1 → k), điện áp ra là trung bình (u_{k-1} + u_k) / 2.
 */
function sixPulseInstant(thetaDeg: number, vm: number, alphaDeg: number, muDeg: number): number {
  const local = (((thetaDeg - 60 - alphaDeg) % 360) + 360) % 360;
  const k = Math.floor(local / 60);
  const u = (idx: number) => vm * Math.sin((thetaDeg - idx * 60) * DEG);
  if (local - k * 60 < muDeg) {
    return (u(k) + u(k - 1)) / 2;
  }
  return u(k);
}

/**
 * Tính toán điện áp DC trung bình lý thuyết Vd0 và Vd
 * @param vLL Điện áp dây hiệu dụng phía van (kV rms)
 * @param alphaDeg Góc kích Alpha (0° - 180°)
 * @param options muDeg: góc trùng dẫn; is12Pulse: 2 cầu nối tiếp; idKA: dòng DC (kA)
 */
export function calculateVd(
  vLL: number,
  alphaDeg: number,
  options: { muDeg?: number; is12Pulse?: boolean; idKA?: number; frequency?: number } = {}
): ElectricalMetrics {
  const { muDeg = 0, is12Pulse = false, idKA = 2, frequency = 50 } = options;
  const bridges = is12Pulse ? 2 : 1;
  const vd0 = bridges * VD0_FACTOR * vLL;
  const cosPhi = (Math.cos(alphaDeg * DEG) + Math.cos((alphaDeg + muDeg) * DEG)) / 2;
  const vd = vd0 * cosPhi;
  const gamma = 180 - alphaDeg - muDeg;

  // Dấu của Vd quyết định chế độ: Vd > 0 Chỉnh lưu, Vd < 0 Nghịch lưu
  const mode = vd >= 0 ? "rectifier" : "inverter";

  // P = Vd·Id (kV·kA = MW); Q = |P|·tan(φ) với cos φ ≈ [cos α + cos(α+μ)] / 2
  const powerActive = Math.abs(vd * idKA);
  const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
  const powerReactive = Math.abs(cosPhi) > 1e-3 ? (powerActive * sinPhi) / Math.abs(cosPhi) : vd0 * idKA;

  // Hệ số gợn sóng đỉnh-đỉnh, lấy mẫu trên một chu kỳ gợn
  const vm = Math.SQRT2 * vLL;
  let vmax = -Infinity;
  let vmin = Infinity;
  for (let i = 0; i <= 360; i++) {
    const v = instantVd(i, vm, alphaDeg, muDeg, is12Pulse);
    vmax = Math.max(vmax, v);
    vmin = Math.min(vmin, v);
  }
  const rippleFactor = Math.abs(vd) > 1 ? (vmax - vmin) / Math.abs(vd) : Infinity;

  return {
    vd0: Number(vd0.toFixed(1)),
    vd: Number(vd.toFixed(1)),
    gamma: Number(gamma.toFixed(1)),
    powerActive: Number(powerActive.toFixed(0)),
    powerReactive: Number(Math.min(powerReactive, vd0 * idKA).toFixed(0)),
    powerFactor: Number(Math.abs(cosPhi).toFixed(3)),
    rippleFrequency: (is12Pulse ? 12 : 6) * frequency,
    rippleFactor: Number(rippleFactor.toFixed(3)),
    mode,
  };
}

function instantVd(thetaDeg: number, vm: number, alphaDeg: number, muDeg: number, is12Pulse: boolean): number {
  const v = sixPulseInstant(thetaDeg, vm, alphaDeg, muDeg);
  // Cầu thứ hai nối qua MBA Y/Δ lệch pha 30°
  return is12Pulse ? v + sixPulseInstant(thetaDeg - 30, vm, alphaDeg, muDeg) : v;
}

/**
 * Sinh dữ liệu dạng sóng tức thời Vd(t) và 3 pha AC (điện áp pha, kV đỉnh)
 */
export function generateWaveformData(params: WaveformParams, points: number = 360): WaveformPoint[] {
  const { alphaDeg, vLL, is12Pulse, muDeg = 0 } = params;
  const vm = Math.SQRT2 * vLL;
  const vPhase = vm / Math.sqrt(3);
  const { vd } = calculateVd(vLL, alphaDeg, { muDeg, is12Pulse });

  const data: WaveformPoint[] = [];
  for (let i = 0; i <= points; i++) {
    const wt = (i / points) * 360;
    data.push({
      wt: Math.round(wt),
      voltage: Number(instantVd(wt, vm, alphaDeg, muDeg, is12Pulse).toFixed(1)),
      vdAverage: vd,
      phaseA: Number((vPhase * Math.sin(wt * DEG)).toFixed(1)),
      phaseB: Number((vPhase * Math.sin((wt - 120) * DEG)).toFixed(1)),
      phaseC: Number((vPhase * Math.sin((wt + 120) * DEG)).toFixed(1)),
    });
  }
  return data;
}

/**
 * Đặc tính V-I (đơn vị tương đối) của trạm Chỉnh lưu và Nghịch lưu.
 * - Chỉnh lưu: đường α_min  Vr(I) = kr·1.10 - 0.08·I, đoạn dòng không đổi (CC) thẳng đứng tại I_ord
 * - Nghịch lưu: đường γ_min (CEA)  Vi(I) = ki·1.00 - 0.06·I, đoạn CC thẳng đứng tại I_ord - ΔI
 */
export function rectifierAlphaMinLine(id: number, rectifierAcPu: number): number {
  return rectifierAcPu * 1.1 - 0.08 * id;
}

export function inverterCeaLine(id: number, inverterAcPu: number): number {
  return inverterAcPu * 1.0 - 0.06 * id;
}

export function findOperatingPoint(p: ViCharacteristicParams): ViOperatingPoint {
  const { rectifierAcPu, inverterAcPu, currentOrderPu: iOrd, marginPu } = p;
  const iInv = iOrd - marginPu;
  const vrAtOrder = rectifierAlphaMinLine(iOrd, rectifierAcPu);
  const viAtOrder = inverterCeaLine(iOrd, inverterAcPu);

  // Bình thường: CC chỉnh lưu cắt CEA nghịch lưu tại I_ord
  if (vrAtOrder >= viAtOrder) {
    return { id: iOrd, vd: viAtOrder, regime: "rectifier-cc" };
  }

  // α_min cắt CEA trong vùng biên dòng (I_ord - ΔI, I_ord)
  const vrAtInv = rectifierAlphaMinLine(iInv, rectifierAcPu);
  const viAtInv = inverterCeaLine(iInv, inverterAcPu);
  if (vrAtInv > viAtInv) {
    // Giải kr·1.1 - 0.08 I = ki - 0.06 I
    const id = (rectifierAcPu * 1.1 - inverterAcPu) / 0.02;
    return { id, vd: inverterCeaLine(id, inverterAcPu), regime: "transition" };
  }

  // Nghịch lưu chuyển sang giữ dòng tại I_ord - ΔI
  const vd = Math.max(0, vrAtInv);
  return { id: iInv, vd, regime: vd < 0.35 ? "collapse" : "inverter-cc" };
}

// CSDL thiết bị đã chuyển sang src/data/equipment.ts; giữ re-export để không phá các import cũ
export { HVDC_EQUIPMENT_DATABASE } from "@/data/equipment";
