import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "@/data/curriculum";
import { LAB_GUIDES, LAB_ORDER, labsForLesson } from "@/data/lab-guides";

describe("Hướng dẫn phòng lab", () => {
  it("mỗi phòng lab có đủ bước, thí nghiệm và mục liên quan trỏ tới bài, phòng lab có thật", () => {
    const lessonIds = new Set(ALL_LESSONS.map((l) => l.id));
    for (const id of LAB_ORDER) {
      const g = LAB_GUIDES[id];
      expect(g.id).toBe(id);
      expect(g.steps.length).toBeGreaterThanOrEqual(3);
      expect(g.experiments.length).toBeGreaterThanOrEqual(3);
      for (const l of g.lessons) expect(lessonIds.has(l)).toBe(true);
      for (const lab of g.relatedLabs) {
        expect(LAB_ORDER).toContain(lab);
        expect(lab).not.toBe(id);
      }
    }
  });

  it("tra ngược phòng lab theo bài học", () => {
    expect(labsForLesson("2.2").map((g) => g.id)).toEqual(["vsc", "planner"]);
    expect(labsForLesson("3.2")).toHaveLength(0);
    expect(labsForLesson("0.4").map((g) => g.id)).toEqual(["firing"]);
    expect(labsForLesson("2.1").map((g) => g.id)).toEqual(["firing", "waveform", "vi-curve"]);
  });
});
