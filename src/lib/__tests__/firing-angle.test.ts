import { describe, expect, it } from "vitest";
import {
  BridgeParams,
  alphaForGamma,
  bridgePoint,
  bridgeWaves,
  pwmWaves,
  simulateCcCea,
  simulateDqCurrent,
  solveCharacteristic,
  spectrum,
  svTimes,
} from "@/lib/firing-angle";

// Thông số các bài tập có lời giải trong giáo trình: V_LL = 210 kV, Xc = 8 Ω, Id = 3 kA
const base: BridgeParams = { alpha: 15, id: 3, vll: 210, xc: 8, gammaMin: 17, pulses: 6 };

describe("Cầu 6/12 xung: khớp bài tập có lời giải", () => {
  it("bài 1: α = 15° cho μ ≈ 21,5° và Vd ≈ 251 kV mỗi cầu, 502 kV với 12 xung", () => {
    const r = bridgePoint(base);
    expect(r.vd0).toBeCloseTo(283.6, 1);
    expect(r.mu).toBeCloseTo(21.5, 1);
    expect(r.vd).toBeCloseTo(251.0, 0);
    expect(bridgePoint({ ...base, pulses: 12 }).vd).toBeCloseTo(502, 0);
  });

  it("trung bình số của dạng sóng trùng công thức Vd = Vd0·cos α − (3/π)·Xc·Id", () => {
    for (const pulses of [6, 12] as const) {
      const p = { ...base, pulses };
      const r = bridgePoint(p);
      expect(bridgeWaves(p, r).vdIntegrated).toBeCloseTo(r.vd, 0);
    }
  });

  it("bài 2: nghịch lưu γ = 17° cần β ≈ 37,4°, α ≈ 142,6°", () => {
    const a = alphaForGamma(17, base);
    expect(180 - a).toBeCloseTo(37.4, 1);
    const r = bridgePoint({ ...base, alpha: a });
    expect(r.gamma).toBeCloseTo(17, 5);
    expect(r.vd).toBeLessThan(0); // nghịch lưu: Vd âm theo quy ước chỉnh lưu
    expect(-r.vd).toBeCloseTo(248.3, 0);
  });

  it("bài 3 và thực hành 2: giữ β, tăng Id lên 4,2 kA thì xảy ra sự cố chuyển mạch", () => {
    const a = alphaForGamma(17, base);
    expect(bridgePoint({ ...base, alpha: a, id: 4.2 }).failed).toBe(true);
    // Điện áp AC giảm 15 %: γ còn khoảng 10°
    expect(bridgePoint({ ...base, alpha: a, vll: 178.5 }).gamma).toBeCloseTo(10, 0);
  });

  it("ví dụ mục 8.3: α = 15°, μ ≈ 22° cho Q/P ≈ 0,5", () => {
    const r = bridgePoint(base);
    expect(r.q / (r.vd * base.id)).toBeGreaterThan(0.45);
    expect(r.q / (r.vd * base.id)).toBeLessThan(0.6);
  });
});

describe("Đặc tính Vd–Id hai trạm", () => {
  const p = { vacR: 1, vacI: 1, idRef: 1, margin: 0.1, alphaMin: 5, gammaRef: 17, vdcol: true };
  it("bình thường chỉnh lưu giữ dòng; sụt áp chỉnh lưu 0,85 pu thì nghịch lưu giữ Id,ref − ΔId", () => {
    expect(solveCharacteristic(p).op).toMatchObject({ mode: "rectifier-cc", i: 1 });
    const low = solveCharacteristic({ ...p, vacR: 0.85 }).op;
    expect(low.mode).toBe("inverter-cc");
    expect(low.i).toBeCloseTo(0.9, 5);
  });
});

describe("Đáp ứng động CC/CEA", () => {
  const dyn = { scenario: "inv" as const, depth: 20, durationMs: 100, kp: 1.5, ki: 80, vdcol: true, cfPrevention: false };
  it("sụt áp nghịch lưu 20 % gây sự cố chuyển mạch; bật chống sự cố thì giảm số lần", () => {
    const off = simulateCcCea(dyn);
    const on = simulateCcCea({ ...dyn, cfPrevention: true });
    expect(off.cfCount).toBeGreaterThan(0);
    expect(on.cfCount).toBeLessThan(off.cfCount);
  });
  it("không có sự cố lưới thì không có sự cố chuyển mạch", () => {
    expect(simulateCcCea({ ...dyn, depth: 0 }).cfCount).toBe(0);
  });
});

describe("PWM và điều khiển vector", () => {
  it("SPWM tuyến tính: biên độ cơ bản điện áp dây ≈ √3/2·ma", () => {
    const { vab } = pwmWaves(0.9, 21, "spwm", 4000);
    expect(spectrum(vab, 1).amps[0]).toBeCloseTo((Math.sqrt(3) / 2) * 0.9, 1);
  });
  it("SVPWM: T1 + T2 + T0 = Ts, quá điều chế khi |Vref| vượt đường tròn nội tiếp", () => {
    const s = svTimes(1, 40);
    expect(s.t1 + s.t2 + s.t0).toBeCloseTo(1, 10);
    expect(svTimes(1.1, 30).over).toBe(false);
    expect(svTimes(1.25, 30).over).toBe(true);
  });
  it("bài 5: X = 0,15 pu, τ = 2 ms cho Kp ≈ 0,239, Ki = 2,5; bỏ bù tách kênh thì iq lệch rõ", () => {
    const r = simulateDqCurrent({ x: 0.15, tauMs: 2, decoupling: true, feedforward: true });
    expect(r.kp).toBeCloseTo(0.239, 3);
    expect(r.ki).toBeCloseTo(2.5, 5);
    const coupled = simulateDqCurrent({ x: 0.15, tauMs: 2, decoupling: false, feedforward: true });
    expect(coupled.dev).toBeGreaterThan(r.dev * 3);
  });
});
