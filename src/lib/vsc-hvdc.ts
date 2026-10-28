/**
 * Mô hình VSC-HVDC hai đầu dạng trung bình (average model), đơn vị tương đối.
 * Cấu trúc điều khiển theo ví dụ VSC-HVDC của MathWorks Simscape Electrical:
 * - Trạm 1 (phát): điều khiển công suất tác dụng P1 và công suất phản kháng Q1
 * - Trạm 2 (nhận): điều khiển điện áp DC (Vdc) và công suất phản kháng Q2
 *
 * Vòng dòng điện trong được thay bằng khâu quán tính bậc một (τ). Tụ DC:
 *   τc · Vdc · dVdc/dt = P1 − ΔP_line − P2,  ΔP_line = R·Idc²,  Idc = P1 / Vdc
 * Bộ điều khiển Vdc ở trạm 2 là PI: P2* = Kp·(Vdc − Vref) + Ki·∫(Vdc − Vref) dt
 * Giới hạn dòng bộ biến đổi: |S| ≤ Smax·Vac, ưu tiên P, phần còn lại cho Q.
 * Điện áp AC tại điểm đấu nối xấp xỉ: Vac ≈ 1 + Q / SCR (Q phát lên lưới là dương).
 */

export interface VscScenario {
  p1Initial: number; // P đặt ban đầu của trạm 1 (pu)
  p1Step: number; // P đặt sau t = 2 s
  q1Initial: number;
  q1Step: number; // Q1 đặt sau t = 3 s
  q2Initial: number;
  q2Step: number; // Q2 đặt sau t = 4 s
  vdcRef: number; // Vdc đặt ở trạm 2 (pu)
  scr1: number; // Tỷ số ngắn mạch lưới AC trạm 1
  scr2: number; // Tỷ số ngắn mạch lưới AC trạm 2
  sMax: number; // Định mức dòng của bộ biến đổi, quy về MVA (pu)
}

export interface VscSample {
  t: number;
  p1: number;
  q1: number;
  p2: number; // Công suất trạm 2 bơm vào lưới AC (dương = nhận từ DC đưa lên lưới)
  q2: number;
  vdc: number;
  vac1: number;
  vac2: number;
}

export const VSC_EVENTS = { p1: 2, q1: 3, q2: 4 } as const;
export const VSC_DURATION = 5;

export const VSC_DEFAULT_SCENARIO: VscScenario = {
  p1Initial: 0.5,
  p1Step: 1.0,
  q1Initial: 0.1,
  q1Step: -0.1,
  q2Initial: 0.1,
  q2Step: 0.2,
  vdcRef: 1,
  scr1: 3,
  scr2: 3,
  sMax: 1.1,
};

const TAU_PQ = 0.05; // Vòng điều khiển P, Q (s)
const TAU_I = 0.01; // Vòng dòng điện trong (s)
const TAU_C = 0.03; // Hằng số thời gian năng lượng tụ DC (s)
const KP_VDC = 3;
const KI_VDC = 60;
const R_LINE = 0.01; // Điện trở đường dây DC (pu)

/** Giới hạn Q theo miền P-Q: Q² ≤ (Smax·Vac)² − P² */
export function limitReactive(p: number, q: number, sMax: number, vac = 1): number {
  const s = sMax * vac;
  const qMax = Math.sqrt(Math.max(0, s * s - p * p));
  return Math.max(-qMax, Math.min(qMax, q));
}

export function acVoltage(q: number, scr: number): number {
  return 1 + q / scr;
}

export function simulateVscHvdc(sc: VscScenario, dt = 0.0005, sampleEvery = 0.01): VscSample[] {
  const clampP = (p: number) => Math.max(-sc.sMax, Math.min(sc.sMax, p));
  // Khởi tạo tại xác lập để không có quá độ ban đầu
  let p1 = clampP(sc.p1Initial);
  let vdc = sc.vdcRef;
  const loss0 = R_LINE * (p1 / vdc) ** 2;
  let p2 = p1 - loss0;
  let integ = p2 / KI_VDC;
  let q1 = limitReactive(p1, sc.q1Initial, sc.sMax);
  let q2 = limitReactive(p2, sc.q2Initial, sc.sMax);

  const out: VscSample[] = [];
  const steps = Math.round(VSC_DURATION / dt);
  const every = Math.max(1, Math.round(sampleEvery / dt));

  for (let k = 0; k <= steps; k++) {
    const t = k * dt;
    if (k % every === 0) {
      out.push({
        t: Math.round(t * 1000) / 1000,
        p1,
        q1,
        p2,
        q2,
        vdc,
        vac1: acVoltage(q1, sc.scr1),
        vac2: acVoltage(q2, sc.scr2),
      });
    }

    const p1Ref = clampP(t >= VSC_EVENTS.p1 ? sc.p1Step : sc.p1Initial);
    const q1Ref = t >= VSC_EVENTS.q1 ? sc.q1Step : sc.q1Initial;
    const q2Ref = t >= VSC_EVENTS.q2 ? sc.q2Step : sc.q2Initial;

    // Trạm 1: P, Q bám giá trị đặt
    p1 += ((p1Ref - p1) / TAU_PQ) * dt;
    q1 += ((limitReactive(p1, q1Ref, sc.sMax, acVoltage(q1, sc.scr1)) - q1) / TAU_PQ) * dt;

    // Trạm 2: PI điện áp DC tạo P2 đặt, vòng dòng trong bám theo
    const err = vdc - sc.vdcRef;
    integ += err * dt;
    const p2Ref = clampP(KP_VDC * err + KI_VDC * integ);
    p2 += ((p2Ref - p2) / TAU_I) * dt;
    q2 += ((limitReactive(p2, q2Ref, sc.sMax, acVoltage(q2, sc.scr2)) - q2) / TAU_PQ) * dt;

    // Cân bằng công suất trên tụ DC
    const loss = R_LINE * (p1 / vdc) ** 2;
    vdc += ((p1 - loss - p2) / (TAU_C * vdc)) * dt;
  }
  return out;
}
