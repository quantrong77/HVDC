import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { Packer } from "docx";
import { asciiSlug, buildReportModel, type ReportInput } from "@/lib/learning-report";
import { buildReportDocument } from "@/lib/report-docx";
import { buildRoadmap } from "@/lib/roadmap";
import type { LessonNote } from "@/store/progress";

const note = (lessonId: string, kind: LessonNote["kind"], text: string, createdAt: string): LessonNote => ({ id: text, lessonId, kind, text, createdAt });

const input: ReportInput = {
  learner: { name: "Nguyễn Thị Đào", unit: "Truyền tải điện Đà Nẵng" },
  completedLessons: ["1.1", "1.2", "2.1"],
  quizBestScore: 7,
  quizPassed: false,
  notes: [
    note("2.1", "question", "Vì sao γ phải ≥ 17°?", "2026-10-28T03:00:00Z"),
    note("2.1", "note", "Vd = Vd0·cos α", "2026-10-28T02:00:00Z"),
    note("1.1", "note", "Hòa vốn 500–800 km", "2026-10-28T01:00:00Z"),
  ],
  exportedAt: new Date(2026, 9, 28, 9, 5),
};

describe("Báo cáo kết quả học tập", () => {
  it("toàn khóa: tổng hợp tiến độ, ghi chú theo bài, tên file không dấu", () => {
    const m = buildReportModel(input);
    expect(m.lessons).toHaveLength(18);
    expect(m.completedCount).toBe(3);
    const l21 = m.lessons.find((l) => l.id === "2.1")!;
    expect(l21.done).toBe(true);
    expect(l21.notes.map((n) => n.text)).toEqual(["Vd = Vd0·cos α"]);
    expect(l21.questions).toHaveLength(1);
    expect(m.fileName).toBe("Ket-qua-HVDC_Nguyen-Thi-Dao_2026-10-28.docx");
    expect(m.dateText).toBe("28/10/2026 09:05");
  });

  it("một bài: chỉ xuất bài đó", () => {
    const m = buildReportModel({ ...input, lessonId: "1.1" });
    expect(m.lessons.map((l) => l.id)).toEqual(["1.1"]);
    expect(m.fileName).toBe("Ket-qua-HVDC_Bai-1-1_Nguyen-Thi-Dao_2026-10-28.docx");
    expect(asciiSlug("  Đỗ Văn Ước! ")).toBe("Do-Van-Uoc");
  });

  it("tạo được file docx chứa tên học viên, ghi chú và câu hỏi", async () => {
    const buf = await Packer.toBuffer(buildReportDocument(buildReportModel(input)));
    const xml = await (await JSZip.loadAsync(buf)).file("word/document.xml")!.async("string");
    for (const t of ["Nguyễn Thị Đào", "Truyền tải điện Đà Nẵng", "Vì sao γ phải ≥ 17°?", "Hòa vốn 500–800 km", "Nhận xét của giảng viên", "7/"]) {
      expect(xml).toContain(t);
    }
  });
});

describe("Lộ trình nghiên cứu", () => {
  it("6 giai đoạn (Cấp độ 0–4 và kiểm tra), node dẫn tới bài chưa học đầu tiên, đánh dấu giai đoạn nên học tiếp", () => {
    const level0 = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8"];
    const stages = buildRoadmap([...level0, "1.1", "1.2", "1.3", "2.1"], false);
    expect(stages.map((s) => s.id)).toEqual(["level-0", "level-1", "level-2", "level-3", "level-4", "quiz"]);
    expect(stages[0]).toMatchObject({ status: "done", short: "0", href: "/learn/0/0-1" });
    expect(stages[1].href).toBe("/learn/1/1-1");
    expect(stages[2]).toMatchObject({ status: "next", done: 1, total: 3, href: "/learn/2/2-2" });
    expect(stages[3].status).toBe("todo");
    expect(stages[5]).toMatchObject({ href: "/quiz", status: "todo" });
    // Chưa học Cấp độ 0 thì node Cấp độ 0 là bước nên học tiếp, dẫn tới bài 0.3
    expect(buildRoadmap(["0.1", "0.2", "1.1"], false)[0]).toMatchObject({ status: "next", href: "/learn/0/0-3" });
  });

  it("học xong hết thì giai đoạn kiểm tra là bước tiếp theo", () => {
    const all = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "3.1", "3.2", "4.1", "4.2"];
    const stages = buildRoadmap(all, false);
    expect(stages.slice(0, 5).every((s) => s.status === "done")).toBe(true);
    expect(stages[5].status).toBe("next");
    expect(buildRoadmap(all, true).every((s) => s.status === "done")).toBe(true);
  });
});
