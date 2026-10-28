import { ALL_LESSONS } from "@/data/curriculum";
import { HVDC_QUIZ, QUIZ_PASS_RATIO } from "@/data/quiz";
import type { LearnerInfo, LessonNote } from "@/store/progress";
import { selectProgressPercent } from "@/store/progress";

/**
 * Mô hình dữ liệu của báo cáo kết quả học tập, tách khỏi phần tạo file docx để kiểm thử được.
 * Phạm vi: toàn khóa (mọi bài) hoặc một bài.
 */

export interface ReportInput {
  learner: LearnerInfo;
  completedLessons: string[];
  quizBestScore: number | null;
  quizPassed: boolean;
  notes: LessonNote[];
  lessonId?: string; // Có giá trị: chỉ xuất bài này
  exportedAt: Date;
}

export interface ReportEntry {
  text: string;
  dateText: string;
}

export interface ReportLesson {
  id: string;
  title: string;
  done: boolean;
  notes: ReportEntry[];
  questions: ReportEntry[];
}

export interface ReportModel {
  title: string;
  learnerName: string;
  unit: string;
  dateText: string;
  scopeLabel: string;
  progressPercent: number;
  completedCount: number;
  totalLessons: number;
  quiz: { best: number | null; total: number; passed: boolean; passPercent: number };
  lessons: ReportLesson[];
  fileName: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatDateTime(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Bỏ dấu, chỉ giữ chữ số và chữ cái ASCII để tên file mở được trên mọi máy */
export function asciiSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const entry = (n: LessonNote): ReportEntry => ({ text: n.text, dateText: formatDateTime(new Date(n.updatedAt ?? n.createdAt)) });

export function buildReportModel(input: ReportInput): ReportModel {
  const lessons = input.lessonId ? ALL_LESSONS.filter((l) => l.id === input.lessonId) : ALL_LESSONS;
  const byTime = [...input.notes].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const completedCount = input.completedLessons.filter((id) => ALL_LESSONS.some((l) => l.id === id)).length;
  const single = lessons.length === 1 && input.lessonId ? lessons[0] : null;
  const d = input.exportedAt;
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const who = asciiSlug(input.learner.name) || "hoc-vien";

  return {
    title: single ? "Kết quả học tập bài học HVDC" : "Kết quả học tập khóa HVDC",
    learnerName: input.learner.name.trim(),
    unit: input.learner.unit.trim(),
    dateText: formatDateTime(d),
    scopeLabel: single ? single.title : `Toàn khóa (${ALL_LESSONS.length} bài)`,
    progressPercent: selectProgressPercent({ completedLessons: input.completedLessons, quizPassed: input.quizPassed }),
    completedCount,
    totalLessons: ALL_LESSONS.length,
    quiz: { best: input.quizBestScore, total: HVDC_QUIZ.length, passed: input.quizPassed, passPercent: Math.round(QUIZ_PASS_RATIO * 100) },
    lessons: lessons.map((l) => ({
      id: l.id,
      title: l.title,
      done: input.completedLessons.includes(l.id),
      notes: byTime.filter((n) => n.lessonId === l.id && n.kind === "note").map(entry),
      questions: byTime.filter((n) => n.lessonId === l.id && n.kind === "question").map(entry),
    })),
    fileName: single ? `Ket-qua-HVDC_Bai-${single.id.replace(".", "-")}_${who}_${date}.docx` : `Ket-qua-HVDC_${who}_${date}.docx`,
  };
}
