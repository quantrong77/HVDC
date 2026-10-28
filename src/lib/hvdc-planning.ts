/**
 * Thiết kế sơ bộ tuyến HVDC theo các bảng trong tài liệu khóa đào tạo 2026 (ĐHBKHN):
 * - Cấp điện áp DC theo công suất và cự ly (Bài giảng HVDC v3, TS. Nguyễn Trung Sơn, tr. 126, theo IEC 63127 / CIGRE 684)
 * - Thông số đường dây trên không theo cấp điện áp (tr. 71)
 * - Yêu cầu SCR và đặc tính LCC, VSC, Hybrid (tr. 103–122)
 * - Khoảng cách hòa vốn HVDC/HVAC (TS. Phạm Quang Phương, tr. 27)
 * Kết quả chỉ để định hướng học tập, không thay cho nghiên cứu hệ thống.
 */

export type RouteType = "overhead" | "cable";
export type Technology = "LCC" | "VSC" | "Hybrid";

export interface PlanningInput {
  powerMW: number;
  distanceKm: number;
  route: RouteType;
  scrSend: number;
  scrReceive: number;
  multiTerminal: boolean;
  blackStart: boolean;
}

const POWER_ROWS = [500, 1000, 3000, 4000, Infinity];
const VOLTAGE_TABLE: (string | null)[][] = [
  ["250", "400", null, null, null, null],
  ["350", "400", "500", null, null, null],
  [null, "500", "500–600", "600–800", "600–800", "800"],
  [null, "600", "600", "800", "800", "800"],
  [null, "800", "800", "800", "800", "800–1.100"],
];

export function distanceColumn(km: number): number {
  if (km <= 200) return 0;
  if (km <= 500) return 1;
  if (km <= 1000) return 2;
  if (km <= 1500) return 3;
  if (km < 2000) return 4;
  return 5;
}

export function powerRow(mw: number): number {
  return POWER_ROWS.findIndex((limit) => mw <= limit);
}

/** Cấp điện áp ±kV gợi ý; null khi bảng không có giá trị cho tổ hợp này */
export function suggestDcVoltage(mw: number, km: number): string | null {
  return VOLTAGE_TABLE[powerRow(mw)][distanceColumn(km)];
}

export interface OverheadLineData {
  kv: number;
  ratingMW: string;
  economicKm: string;
  bundle: string;
  rowM: string;
  clearanceM: string;
}

export const OVERHEAD_LINE_DATA: OverheadLineData[] = [
  { kv: 300, ratingMW: "600–1.000", economicKm: "300–750", bundle: "2, 3, 4", rowM: "40", clearanceM: "8,5" },
  { kv: 400, ratingMW: "1.000–2.000", economicKm: "500–1.000", bundle: "2, 3, 4, 6", rowM: "45–50", clearanceM: "10–11" },
  { kv: 500, ratingMW: "1.500–3.000", economicKm: "700–1.500", bundle: "4, 6, 8", rowM: "55–70", clearanceM: "11–13" },
  { kv: 800, ratingMW: "3.000–7.500", economicKm: "1.500–5.000", bundle: "6, 8", rowM: "85–90", clearanceM: "16" },
];

/** Cấp điện áp đầu tiên của chuỗi gợi ý ("500–600" → 500), dùng để tra bảng đường dây */
export function voltageLowerBound(v: string): number {
  return Number(v.split("–")[0].replace(".", ""));
}

export function nearestLineData(kv: number): OverheadLineData {
  return OVERHEAD_LINE_DATA.reduce((best, row) => (Math.abs(row.kv - kv) < Math.abs(best.kv - kv) ? row : best));
}

export type Breakeven = "hvac" | "compare" | "hvdc";

/** Hòa vốn: 500–800 km đường dây trên không, 50–100 km cáp */
export function breakevenVerdict(route: RouteType, km: number): Breakeven {
  const [low, high] = route === "overhead" ? [500, 800] : [50, 100];
  if (km < low) return "hvac";
  if (km > high) return "hvdc";
  return "compare";
}

export const LCC_MIN_SCR = 2.5;

export interface TechnologyAdvice {
  technology: Technology;
  reasons: string[];
}

export function adviseTechnology(input: PlanningInput): TechnologyAdvice {
  const reasons: string[] = [];
  const sendWeak = input.scrSend < LCC_MIN_SCR;
  const receiveWeak = input.scrReceive < LCC_MIN_SCR;

  if (sendWeak) {
    reasons.push(`SCR phía phát ${input.scrSend.toFixed(1)} < ${LCC_MIN_SCR}: LCC chuyển mạch theo lưới cần SCR ≥ 2,5–3,0.`);
    if (input.blackStart) reasons.push("Cần khởi động đen: chỉ VSC làm được.");
    return { technology: "VSC", reasons };
  }
  if (input.blackStart && input.powerMW <= 3000 && !receiveWeak) {
    reasons.push("Cần khởi động đen: chỉ VSC làm được.");
    return { technology: "VSC", reasons };
  }
  if (input.multiTerminal && input.powerMW <= 3000) {
    reasons.push("Hệ đa điểm: VSC giữ nguyên cực tính điện áp, đảo chiều công suất bằng dòng điện nên dễ mở rộng thành lưới DC.");
    return { technology: "VSC", reasons };
  }
  if (input.route === "cable" && input.powerMW <= 2000) {
    reasons.push("Tuyến cáp: VSC dùng cáp XLPE ép đùn, nhẹ và rẻ hơn cáp MI.");
    if (receiveWeak) reasons.push(`SCR phía nhận ${input.scrReceive.toFixed(1)} thấp, VSC vẫn vận hành tốt.`);
    return { technology: "VSC", reasons };
  }
  if (receiveWeak || input.blackStart || input.multiTerminal) {
    if (input.powerMW > 2000) {
      reasons.push("Công suất lớn từ nguồn có lưới mạnh: đặt LCC ở trạm chỉnh lưu.");
      if (receiveWeak) reasons.push(`SCR phía nhận ${input.scrReceive.toFixed(1)} < ${LCC_MIN_SCR}: đặt VSC-MMC ở trạm nghịch lưu để tránh sự cố chuyển mạch.`);
      if (input.multiTerminal) reasons.push("Nhiều điểm nhận: hybrid cho phép một trạm LCC cấp cho nhiều trạm VSC (như Wudongde).");
      if (input.blackStart) reasons.push("Khởi động đen thực hiện qua phía VSC.");
      return { technology: "Hybrid", reasons };
    }
    reasons.push(`SCR phía nhận ${input.scrReceive.toFixed(1)} thấp hoặc cần tính năng chỉ VSC có.`);
    return { technology: "VSC", reasons };
  }
  reasons.push("Lưới hai đầu đủ mạnh và không cần tính năng riêng của VSC: LCC có chi phí thấp, tổn thất thấp và trưởng thành nhất.");
  if (input.powerMW > 2000) reasons.push("Công suất trên khoảng 2 GW: vượt định mức VSC phổ biến hiện nay ở ±525 kV.");
  return { technology: "LCC", reasons };
}

/** Tổn thất mỗi trạm (% công suất định mức): LCC ≈ 0,7%; MMC ≈ 0,8–1% (lấy 0,9%) */
export const CONVERTER_LOSS_PERCENT: Record<"LCC" | "VSC", number> = { LCC: 0.7, VSC: 0.9 };

export function converterLossesMW(technology: Technology, powerMW: number): number {
  const send = CONVERTER_LOSS_PERCENT.LCC;
  const perStation = technology === "LCC" ? [send, send] : technology === "VSC" ? [0.9, 0.9] : [send, 0.9];
  return (perStation[0] + perStation[1]) * powerMW / 100;
}

/** LCC tiêu thụ 50–60% P ở mỗi trạm LCC */
export function lccReactiveRangeMVAr(technology: Technology, powerMW: number): [number, number] | null {
  const lccStations = technology === "LCC" ? 2 : technology === "Hybrid" ? 1 : 0;
  if (lccStations === 0) return null;
  return [0.5 * powerMW, 0.6 * powerMW];
}
