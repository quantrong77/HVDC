import { DEG, bridgePoint } from "@/lib/firing-angle";

/**
 * Bài toán tích hợp Cấp độ 0 (bài 0.8): đi ngược từ yêu cầu truyền tải (P, Vd, cự ly) xuống từng tầng của liên kết LCC
 * (hệ thống → trạm → cầu 12 xung và MBA → van → linh kiện), dùng đúng các công thức của bài 0.2–0.6.
 * Kết quả là ước tính sơ bộ để học, không thay cho tính toán thiết kế của dự án.
 */

export interface LccLinkInput {
  powerMW: number; // công suất truyền tải danh định ở đầu chỉnh lưu (cả liên kết)
  vdPoleKV: number; // điện áp cực, ví dụ 500 cho ±500 kV
  poles: 1 | 2;
  alphaDeg: number; // α danh định trạm chỉnh lưu
  gammaDeg: number; // γ danh định trạm nghịch lưu
  dxPct: number; // sụt áp chuyển mạch tương đối dx = (3/π)·Xc·Id / Vd0, %
  lengthKm: number;
  rOhmPerKm: number; // điện trở một cực
  scrInv: number; // SCR lưới phía nghịch lưu = Sk / Pd
  vdrmKV: number; // điện áp khóa của một thyristor
  gammaCritDeg: number; // γ tương ứng tq: dưới mức này là sự cố chuyển mạch
}

export const LCC_LINK_DEFAULT: LccLinkInput = {
  powerMW: 3000,
  vdPoleKV: 500,
  poles: 2,
  alphaDeg: 15,
  gammaDeg: 17,
  dxPct: 8,
  lengthKm: 800,
  rOhmPerKm: 0.0067,
  scrInv: 3,
  vdrmKV: 8.5,
  gammaCritDeg: 7,
};

/** Tổn hao mỗi trạm chuyển đổi LCC, % công suất (bài 0.3) */
export const LCC_STATION_LOSS_PCT = 0.7;

const K = (3 * Math.SQRT2) / Math.PI; // Vd0 = K·V_LL

export function designLccLink(i: LccLinkInput) {
  // Tầng hệ thống: dòng mỗi cực và đường dây
  const pPole = i.powerMW / i.poles;
  const id = pPole / i.vdPoleKV; // kA
  const rLine = i.rOhmPerKm * i.lengthKm;
  const lineDropKV = id * rLine;
  const lineLossMW = i.poles * id * id * rLine;

  // Tầng cầu và MBA, trạm chỉnh lưu: mỗi cực là cầu 12 xung = 2 cầu 6 xung nối tiếp
  const dx = i.dxPct / 100;
  const vdBridgeR = i.vdPoleKV / 2;
  const vd0R = vdBridgeR / (Math.cos(i.alphaDeg * DEG) - dx);
  const vllR = vd0R / K;
  const xc = (dx * vd0R) / ((3 / Math.PI) * id); // Ω, quy về phía van
  const rect = bridgePoint({ alpha: i.alphaDeg, id, vll: vllR, xc, gammaMin: i.gammaDeg, pulses: 12 });
  const transformerMVA = (Math.PI / 3) * vd0R * id; // mỗi MBA (mỗi cầu 6 xung)

  // Trạm nghịch lưu: giữ γ, cùng Xc (MBA giống nhau), nấc MBA đặt cho Vdi = Vd − R·Id
  const vdPoleI = i.vdPoleKV - lineDropKV;
  const vdBridgeI = vdPoleI / 2;
  const vd0I = (vdBridgeI + (3 / Math.PI) * xc * id) / Math.cos(i.gammaDeg * DEG);
  const vllI = vd0I / K;
  const kI = (Math.SQRT2 * xc * id) / vllI;
  const betaDeg = Math.acos(Math.cos(i.gammaDeg * DEG) - kI) / DEG;
  const inv = bridgePoint({ alpha: 180 - betaDeg, id, vll: vllI, xc, gammaMin: i.gammaDeg, pulses: 12 });

  // Dự trữ chống sự cố chuyển mạch: giữ β, Id; điện áp AC nghịch lưu giảm còn u thì cos γ = cos β + kI/u
  const uCrit = kI / (Math.cos(i.gammaCritDeg * DEG) - Math.cos(betaDeg * DEG));
  const cfDropPct = (1 - uCrit) * 100;

  // Tầng van và linh kiện
  const valvePeakKV = Math.SQRT2 * vllR;
  const levelsMin = Math.ceil(valvePeakKV / i.vdrmKV);
  const levelsRedundant = levelsMin + Math.max(2, Math.ceil(levelsMin * 0.03));
  const valveIavg = id / 3;
  const valveIrms = id / Math.sqrt(3);
  const valvesPerStation = i.poles * 12;

  // Công suất phản kháng và lưới
  const pInv = i.powerMW - lineLossMW - (i.powerMW * LCC_STATION_LOSS_PCT) / 100;
  const qRect = rect.q * i.poles;
  const qInv = inv.q * i.poles;
  const esrcInv = i.scrInv - qInv / pInv; // bộ lọc + tụ bù toàn bộ Q nghịch lưu
  const pReceived = pInv - (pInv * LCC_STATION_LOSS_PCT) / 100;

  return {
    pPole,
    id,
    rLine,
    lineDropKV,
    lineLossMW,
    rect: { vd0: vd0R, vll: vllR, mu: rect.mu, cosPhi: rect.cosPhi, q: qRect },
    inv: { vd0: vd0I, vll: vllI, beta: betaDeg, mu: inv.mu, q: qInv, vdPole: vdPoleI },
    xc,
    transformerMVA,
    transformersPerStation: i.poles * 2,
    cfDropPct,
    valvePeakKV,
    levelsMin,
    levelsRedundant,
    valveIavg,
    valveIrms,
    valvesPerStation,
    esrcInv,
    pReceived,
    efficiencyPct: (pReceived / i.powerMW) * 100,
  };
}

export type LccLinkDesign = ReturnType<typeof designLccLink>;
