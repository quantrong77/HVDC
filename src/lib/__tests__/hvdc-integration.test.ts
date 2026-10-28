import { describe, expect, it } from "vitest";
import { LCC_LINK_DEFAULT, designLccLink } from "@/lib/hvdc-integration";

describe("Bài toán tích hợp liên kết LCC (bài 0.8)", () => {
  const d = designLccLink(LCC_LINK_DEFAULT);

  it("±500 kV, 3000 MW lưỡng cực: Id = 3 kA, mỗi cầu chỉnh lưu chính là bài tập 1 (V_LL ≈ 209 kV, Xc ≈ 7,9 Ω, μ ≈ 21,5°)", () => {
    expect(d.id).toBeCloseTo(3, 10);
    expect(d.rect.vll).toBeCloseTo(209, 0);
    expect(d.xc).toBeCloseTo(7.88, 1);
    expect(d.rect.mu).toBeCloseTo(21.5, 0);
  });

  it("MBA mỗi cầu ≈ (π/3)·Vd0·Id ≈ 886 MVA; Q chỉnh lưu ≈ 0,5·P", () => {
    expect(d.transformerMVA).toBeGreaterThan(880);
    expect(d.transformerMVA).toBeLessThan(892);
    expect(d.rect.q / LCC_LINK_DEFAULT.powerMW).toBeGreaterThan(0.45);
    expect(d.rect.q / LCC_LINK_DEFAULT.powerMW).toBeLessThan(0.6);
  });

  it("nghịch lưu giữ γ = 17° cần β ≈ 37–39°; sụt áp khoảng 15–20 % là đủ gây sự cố chuyển mạch", () => {
    expect(d.inv.beta).toBeGreaterThan(37);
    expect(d.inv.beta).toBeLessThan(39);
    expect(d.cfDropPct).toBeGreaterThan(15);
    expect(d.cfDropPct).toBeLessThan(20);
  });

  it("van: áp đỉnh √2·V_LL ≈ 296 kV, cần ≥ 35 cấp thyristor 8,5 kV; dòng trung bình van = Id/3", () => {
    expect(d.valvePeakKV).toBeCloseTo(296, 0);
    expect(d.levelsMin).toBe(35);
    expect(d.levelsRedundant).toBeGreaterThan(d.levelsMin);
    expect(d.valveIavg).toBeCloseTo(1, 10);
  });

  it("đường dây dài hơn thì tổn hao tăng, hiệu suất giảm; lưới yếu làm ESCR giảm", () => {
    const far = designLccLink({ ...LCC_LINK_DEFAULT, lengthKm: 1600 });
    expect(far.lineLossMW).toBeCloseTo(2 * d.lineLossMW, 5);
    expect(far.efficiencyPct).toBeLessThan(d.efficiencyPct);
    expect(designLccLink({ ...LCC_LINK_DEFAULT, scrInv: 2 }).esrcInv).toBeLessThan(d.esrcInv);
  });

  it("giảm γ đặt thì dự trữ chống sự cố chuyển mạch nhỏ lại", () => {
    expect(designLccLink({ ...LCC_LINK_DEFAULT, gammaDeg: 12 }).cfDropPct).toBeLessThan(d.cfDropPct);
  });
});

describe("Liên hệ kiến thức cơ sở với hệ thống", () => {
  it("mọi bài 0.1–0.7 có liên hệ ứng dụng, trỏ tới bài Cấp độ 1–4 có thật; mọi bài Cấp độ 1–4 đều có kiến thức nền", async () => {
    const { SYSTEM_LINKS, foundationsFor } = await import("@/data/system-links");
    const { ALL_LESSONS } = await import("@/data/curriculum");
    const ids = new Set(ALL_LESSONS.map((l) => l.id));
    for (const id of ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7"]) {
      expect(SYSTEM_LINKS[id]?.length).toBeGreaterThan(0);
      for (const link of SYSTEM_LINKS[id]) for (const n of link.next) {
        expect(ids.has(n)).toBe(true);
        expect(n.startsWith("0.")).toBe(false);
      }
    }
    for (const l of ALL_LESSONS.filter((x) => x.level > 0)) expect(foundationsFor(l.id).length).toBeGreaterThan(0);
    expect(foundationsFor("2.1").map((f) => f.lessonId)).toEqual(expect.arrayContaining(["0.2", "0.4"]));
  });
});
