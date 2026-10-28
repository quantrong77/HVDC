import { describe, expect, it } from "vitest";
import { ALL_LESSONS, CURRICULUM_LEVELS } from "@/data/curriculum";
import { HVDC_QUIZ, QUIZ_PASS_RATIO } from "@/data/quiz";
import { HVDC_EQUIPMENT_DATABASE } from "@/data/equipment";
import { allLessonParams, findLesson, lessonHref } from "@/lib/lesson-routes";
import { normalize, searchKnowledge } from "@/lib/knowledge-search";
import { calculateVd } from "@/lib/hvdc-math";
import { LESSON_SUPPLEMENTS, getSupplements } from "@/data/supplements";

describe("Khung chương trình (spec mục II)", () => {
  it("có 5 cấp độ (0–4) và 18 bài, id bài duy nhất", () => {
    expect(CURRICULUM_LEVELS.map((l) => l.level)).toEqual([0, 1, 2, 3, 4]);
    expect(ALL_LESSONS).toHaveLength(18);
    expect(new Set(ALL_LESSONS.map((l) => l.id)).size).toBe(18);
  });

  it("bài Cấp độ 0 có thực hành dẫn tới đúng tab phòng lab", () => {
    const tabs = /^\/simulator#(firing-(wave|char|dyn|pwm|vec|design)|waveform|vsc|sld|planner)$/;
    for (const l of ALL_LESSONS.filter((x) => x.level === 0)) {
      expect(l.practice?.length).toBeGreaterThan(0);
      for (const p of l.practice!) expect(p.href).toMatch(tabs);
    }
  });

  it("lessonsCount của từng cấp khớp số bài thực tế", () => {
    for (const level of CURRICULUM_LEVELS) expect(level.topics).toHaveLength(level.lessonsCount);
  });

  it("bài 1.2 có cấu hình Multi-terminal", () => {
    expect(ALL_LESSONS.find((l) => l.id === "1.2")!.keyPoints.join(" ")).toMatch(/MTDC|Đa cực/);
  });
});

describe("Route bài học", () => {
  it("mỗi bài có đúng một URL và tìm lại được từ params", () => {
    const params = allLessonParams();
    expect(params).toHaveLength(18);
    for (const { level, lesson } of params) {
      const found = findLesson(level, lesson);
      expect(found).not.toBeNull();
      expect(lessonHref(found!.lesson.id)).toBe(`/learn/${level}/${lesson}`);
    }
  });

  it("bài trước/sau nối liền thành chuỗi", () => {
    expect(findLesson("0", "0-1")!.prev).toBeNull();
    expect(findLesson("0", "0-8")!.next!.id).toBe("1.1");
    expect(findLesson("1", "1-1")!.prev!.id).toBe("0.8");
    expect(findLesson("1", "1-1")!.next!.id).toBe("1.2");
    expect(findLesson("4", "4-2")!.next).toBeNull();
  });

  it("params sai trả null (để trang trả 404)", () => {
    expect(findLesson("2", "1-1")).toBeNull();
    expect(findLesson("9", "9-9")).toBeNull();
  });
});

describe("Ngân hàng câu hỏi (spec PROMPT 4)", () => {
  it("10 câu, phủ đủ 4 chủ đề LCC/VSC/Protection/Filters", () => {
    expect(HVDC_QUIZ).toHaveLength(10);
    for (const topic of ["LCC", "VSC", "Protection", "Filters"]) {
      expect(HVDC_QUIZ.some((q) => q.topic === topic)).toBe(true);
    }
  });

  it("đáp án hợp lệ và ngưỡng đạt 80%", () => {
    for (const q of HVDC_QUIZ) expect(q.correctIndex).toBeLessThan(q.options.length);
    expect(Math.ceil(HVDC_QUIZ.length * QUIZ_PASS_RATIO)).toBe(8);
  });

  it("câu tính toán q2 khớp thư viện tính toán", () => {
    const q = HVDC_QUIZ.find((x) => x.id === "q2")!;
    const vd = calculateVd(210, 60).vd;
    expect(q.options[q.correctIndex]).toContain(vd.toFixed(1).replace(".", ","));
  });
});

describe("Thiết bị SLD", () => {
  it("có bản ghi riêng cho cả hai cuộn san bằng", () => {
    const ids = HVDC_EQUIPMENT_DATABASE.map((e) => e.id);
    expect(ids).toContain("smoothing-reactor-1");
    expect(ids).toContain("smoothing-reactor-2");
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Tìm kiếm học liệu cho trợ lý", () => {
  it("bỏ dấu tiếng Việt và mở rộng ký hiệu Hy Lạp", () => {
    expect(normalize("Góc dập γ")).toContain("goc dap");
    expect(normalize("γ")).toContain("gamma");
  });

  it("hỏi 'gamma' trả về đoạn về góc dập kèm nguồn", () => {
    const hits = searchKnowledge("gamma là gì");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => /γ|góc dập/i.test(h.text))).toBe(true);
    expect(hits.every((h) => h.source.length > 0)).toBe(true);
  });

  it("câu hỏi rỗng hoặc chỉ có từ dừng thì không trả gì", () => {
    expect(searchKnowledge("")).toEqual([]);
    expect(searchKnowledge("là gì")).toEqual([]);
  });
});

describe("Tài liệu bổ sung", () => {
  it("mỗi phần bổ sung gắn với một bài có thật, có nguồn, số trang và nội dung", () => {
    const ids = new Set(ALL_LESSONS.map((l) => l.id));
    for (const sup of LESSON_SUPPLEMENTS) {
      expect(ids.has(sup.lessonId)).toBe(true);
      expect(sup.source.length).toBeGreaterThan(0);
      expect(sup.pages).toMatch(/tr\. \d/);
      for (const section of sup.sections) {
        expect(section.points.length).toBeGreaterThan(0);
        for (const row of section.table?.rows ?? []) expect(row).toHaveLength(section.table!.columns.length);
      }
    }
  });

  it("tài liệu PTC3 phủ các bài 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 4.2", () => {
    for (const id of ["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "4.2"]) {
      expect(getSupplements(id).length).toBeGreaterThan(0);
    }
  });

  it("Basslink được ghi đúng là LCC (hiệu chỉnh lỗi trong slide gốc)", () => {
    const table = getSupplements("4.2")[0].sections[0].table!;
    const basslink = table.rows.find((r) => r[0] === "Basslink")!;
    expect(basslink[basslink.length - 1]).toBe("LCC");
  });

  it("trợ lý tìm được nội dung bổ sung", () => {
    expect(searchKnowledge("hệ đồng cực homopolar").some((h) => /đồng cực/i.test(h.text))).toBe(true);
    expect(searchKnowledge("Marinus Link").some((h) => /Marinus/i.test(h.text))).toBe(true);
  });
});
