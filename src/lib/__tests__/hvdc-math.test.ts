import { describe, expect, it } from "vitest";
import {
  VD0_FACTOR,
  calculateVd,
  findOperatingPoint,
  generateWaveformData,
  inverterCeaLine,
  rectifierAlphaMinLine,
} from "@/lib/hvdc-math";

const V_LL = 210;

/** Trung bình số của Vd(t) trên một chu kỳ (bỏ điểm cuối trùng điểm đầu) */
function numericAverage(alphaDeg: number, muDeg: number, is12Pulse: boolean): number {
  const points = 3600;
  const data = generateWaveformData({ alphaDeg, muDeg, vLL: V_LL, frequency: 50, is12Pulse }, points);
  return data.slice(0, -1).reduce((sum, p) => sum + p.voltage, 0) / points;
}

describe("calculateVd - công thức CLAUDE.md", () => {
  it("Vd0 = 3√2/π · V_LL cho một cầu 6 xung", () => {
    expect(VD0_FACTOR).toBeCloseTo((3 * Math.SQRT2) / Math.PI, 10);
    expect(calculateVd(V_LL, 0).vd0).toBeCloseTo(283.6, 1);
  });

  it("cầu 12 xung có Vd0 gấp đôi (2 cầu nối tiếp)", () => {
    expect(calculateVd(V_LL, 0, { is12Pulse: true }).vd0).toBeCloseTo(567.2, 1);
  });

  it("Vd = Vd0·cos α khi μ = 0", () => {
    const m = calculateVd(V_LL, 60);
    expect(m.vd).toBeCloseTo(m.vd0 * 0.5, 0);
    expect(m.mode).toBe("rectifier");
  });

  it("Vd = Vd0·[cos α + cos(α+μ)]/2 khi có trùng dẫn", () => {
    const m = calculateVd(V_LL, 15, { muDeg: 20, is12Pulse: true });
    const expected = 567.2 * ((Math.cos((15 * Math.PI) / 180) + Math.cos((35 * Math.PI) / 180)) / 2);
    expect(m.vd).toBeCloseTo(expected, 0);
  });

  it("γ = 180° − (α + μ) và chế độ nghịch lưu khi α > 90°", () => {
    const m = calculateVd(V_LL, 142, { muDeg: 20, is12Pulse: true });
    expect(m.gamma).toBe(18);
    expect(m.mode).toBe("inverter");
    expect(m.vd).toBeLessThan(0);
  });

  it("Q ≈ P·tan φ, với μ = 0 thì tan φ = tan α", () => {
    const m = calculateVd(V_LL, 30, { idKA: 2 });
    expect(m.powerReactive / m.powerActive).toBeCloseTo(Math.tan(Math.PI / 6), 2);
  });

  it("tần số gợn = p·f", () => {
    expect(calculateVd(V_LL, 15).rippleFrequency).toBe(300);
    expect(calculateVd(V_LL, 15, { is12Pulse: true }).rippleFrequency).toBe(600);
  });

  it("hệ số gợn đỉnh-đỉnh của cầu 6 xung ở α = 0 bằng π/3·(1 − cos 30°) ≈ 14%", () => {
    const expected = (Math.PI / 3) * (1 - Math.cos(Math.PI / 6));
    expect(calculateVd(V_LL, 0).rippleFactor).toBeCloseTo(expected, 2);
  });

  it("cầu 12 xung gợn ít hơn cầu 6 xung", () => {
    expect(calculateVd(V_LL, 15, { is12Pulse: true }).rippleFactor).toBeLessThan(calculateVd(V_LL, 15).rippleFactor);
  });
});

describe("generateWaveformData - dạng sóng tức thời", () => {
  it.each([
    [0, 0, false],
    [60, 0, false],
    [15, 20, true],
    [142, 20, true],
    [120, 15, false],
  ])("trung bình số khớp giải tích (α=%i°, μ=%i°, 12 xung=%s) sai số ≤ 1%%", (alpha, mu, twelve) => {
    const analytic = calculateVd(V_LL, alpha, { muDeg: mu, is12Pulse: twelve });
    const tolerance = Math.max(0.01 * analytic.vd0, 0.5);
    expect(Math.abs(numericAverage(alpha, mu, twelve) - analytic.vd)).toBeLessThan(tolerance);
  });

  it("tại α = 90° vẫn còn gợn sóng dù Vd ≈ 0 (lỗi của bản cũ)", () => {
    const data = generateWaveformData({ alphaDeg: 90, vLL: V_LL, frequency: 50, is12Pulse: false });
    const values = data.map((p) => p.voltage);
    expect(Math.max(...values) - Math.min(...values)).toBeGreaterThan(100);
  });

  it("biên độ điện áp pha = √2·V_LL/√3", () => {
    const data = generateWaveformData({ alphaDeg: 0, vLL: V_LL, frequency: 50, is12Pulse: false });
    const peak = Math.max(...data.map((p) => p.phaseA ?? 0));
    expect(peak).toBeCloseTo((Math.SQRT2 * V_LL) / Math.sqrt(3), 0);
  });
});

describe("findOperatingPoint - đặc tính V-I", () => {
  const base = { rectifierAcPu: 1, inverterAcPu: 1, currentOrderPu: 1, marginPu: 0.1 };

  it("bình thường: chỉnh lưu giữ dòng tại I_ord, điện áp theo CEA nghịch lưu", () => {
    const op = findOperatingPoint(base);
    expect(op.regime).toBe("rectifier-cc");
    expect(op.id).toBe(1);
    expect(op.vd).toBeCloseTo(inverterCeaLine(1, 1), 10);
  });

  it("sụt áp AC chỉnh lưu: nghịch lưu giữ dòng, dòng giảm đúng ΔI", () => {
    const op = findOperatingPoint({ ...base, rectifierAcPu: 0.85 });
    expect(op.regime).toBe("inverter-cc");
    expect(op.id).toBeCloseTo(0.9, 10);
    expect(op.vd).toBeCloseTo(rectifierAlphaMinLine(0.9, 0.85), 10);
  });

  it("sụt áp rất sâu: báo VDCOL / sụp áp", () => {
    expect(findOperatingPoint({ ...base, rectifierAcPu: 0.3 }).regime).toBe("collapse");
  });

  it("đường α_min cắt CEA trong vùng biên dòng: vùng chuyển tiếp", () => {
    // kr·1.1 − 0.08·I = 1 − 0.06·I  ⇒  I = (1.1·kr − 1)/0.02.
    // I ∈ (0.9, 1) ⇔ 1.1·kr ∈ (1.018, 1.02): vùng rất hẹp vì hai đặc tính gần song song. Lấy điểm giữa.
    const kr = 1.019 / 1.1;
    const op = findOperatingPoint({ ...base, rectifierAcPu: kr });
    expect(op.regime).toBe("transition");
    expect(op.id).toBeGreaterThan(0.9);
    expect(op.id).toBeLessThan(1);
  });
});
