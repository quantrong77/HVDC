import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "@/data/curriculum";
import { getSupplements } from "@/data/supplements";
import { LESSON_RESOURCES } from "@/data/lesson-resources";
import { foundationsFor } from "@/data/system-links";
import { labsForLesson } from "@/data/lab-guides";
import { alphaForGamma, bridgePoint } from "@/lib/firing-angle";

describe("Bài 4.3: case study Basslink", () => {
  it("có thực hành dẫn tới phòng lab góc kích, có kiến thức nền Cấp độ 0 và tài liệu bổ sung", () => {
    const lesson = ALL_LESSONS.find((l) => l.id === "4.3")!;
    expect(lesson.level).toBe(4);
    for (const p of lesson.practice!) expect(p.href).toMatch(/^\/simulator#(firing-(wave|char|dyn)|ops)$/);
    expect(foundationsFor("4.3").length).toBeGreaterThanOrEqual(3);
    expect(labsForLesson("4.3").map((g) => g.id)).toContain("firing");
    const sources = getSupplements("4.3").map((s) => s.source);
    expect(sources.some((s) => /Basslink/.test(s))).toBe(true);
    expect(sources.some((s) => /Australia/.test(s))).toBe(true);
  });

  // Số liệu thiết kế trong tài liệu Basslink phải tái hiện được bằng mô hình cầu của phòng lab
  const DEG = Math.PI / 180;
  const udi0 = 222.3;
  const xcRect = (0.06 * udi0) / ((3 / Math.PI) * 1.25);

  it("điểm định mức chỉnh lưu George Town: Vd ≈ 400 kV, μ ≈ 16,9°, Q ≈ 234,7 Mvar", () => {
    const r = bridgePoint({ alpha: 15.7, id: 1.25, vll: udi0 / 1.35, xc: xcRect, pulses: 12, gammaMin: 17 });
    expect(r.mu).toBeCloseTo(16.9, 0);
    expect(r.vd - 2 * 0.003 * udi0).toBeCloseTo(400, -0.5);
    expect(Math.abs(r.q - 234.7)).toBeLessThan(2);
    // Công thức tay ghi trong bài
    expect(2 * udi0 * (Math.cos(15.7 * DEG) - 0.063)).toBeCloseTo(400, 0);
  });

  it("điện áp nghịch lưu Loy Yang = 400 − Id·R và gần với mô hình", () => {
    expect(400 - 1.25 * 11.8).toBeCloseTo(385.3, 0);
    const vll = (224.6 / 1.35) * (163.05 / 166.31);
    const p = { alpha: 0, id: 1.25, vll, xc: (0.07 * 1.35 * vll) / ((3 / Math.PI) * 1.25), pulses: 12 as const, gammaMin: 17 };
    const inv = bridgePoint({ ...p, alpha: alphaForGamma(19.4, p) });
    expect(Math.abs(-inv.vd - 385.3)).toBeLessThan(2);
    expect(Math.abs(inv.q - 265.5)).toBeLessThan(3);
  });
});

describe("Video và liên kết tham khảo", () => {
  const all = Object.entries(LESSON_RESOURCES);

  it("mỗi liên kết gắn với bài có thật, là https và có nguồn dẫn", () => {
    const ids = new Set(ALL_LESSONS.map((l) => l.id));
    for (const [id, list] of all) {
      expect(ids.has(id), id).toBe(true);
      expect(new Set(list.map((r) => r.url)).size).toBe(list.length);
      for (const r of list) {
        expect(r.url).toMatch(/^https:\/\//);
        expect(r.from.length).toBeGreaterThan(5);
        expect(r.why.length).toBeGreaterThan(30);
        if (r.kind === "video") expect(r.url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/);
      }
    }
  });

  it("đủ 5 video trong slide PTC3 và 21 video mới của bảng thống kê (video thứ 22 trùng TranspowerNZ)", () => {
    const videos = all.flatMap(([, l]) => l).filter((r) => r.kind === "video");
    expect(new Set(videos.map((r) => r.url)).size).toBe(26);
    const stats = videos.filter((r) => /Thống kê video/.test(r.from));
    expect(new Set(stats.map((r) => r.url)).size).toBe(21);
    for (const r of stats) {
      expect(r.level, r.title).toBeDefined();
      expect(r.date).toMatch(/^(0[1-9]|1[0-2])\/20\d\d$/);
    }
  });
});
