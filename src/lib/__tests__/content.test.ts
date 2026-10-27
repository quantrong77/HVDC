import { describe, expect, it } from "vitest";
import { ALL_LESSONS, CURRICULUM_LEVELS } from "@/data/curriculum";
import { HVDC_QUIZ, QUIZ_PASS_RATIO } from "@/data/quiz";
import { HVDC_EQUIPMENT_DATABASE } from "@/data/equipment";
import { allLessonParams, findLesson, lessonHref } from "@/lib/lesson-routes";
import { normalize, searchKnowledge } from "@/lib/knowledge-search";
import { calculateVd } from "@/lib/hvdc-math";

describe("Khung chương trình (spec mục II)", () => {
  it("có 4 cấp độ và 10 bài, id bài duy nhất", () => {
    expect(CURRICULUM_LEVELS).toHaveLength(4);
    expect(ALL_LESSONS).toHaveLength(10);
    expect(new Set(ALL_LESSONS.map((l) => l.id)).size).toBe(10);
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
    expect(params).toHaveLength(10);
    for (const { level, lesson } of params) {
      const found = findLesson(level, lesson);
      expect(found).not.toBeNull();
      expect(lessonHref(found!.lesson.id)).toBe(`/learn/${level}/${lesson}`);
    }
  });

  it("bài trước/sau nối liền thành chuỗi", () => {
    expect(findLesson("1", "1-1")!.prev).toBeNull();
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
