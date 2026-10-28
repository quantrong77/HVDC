"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import { ALL_LESSONS } from "@/data/curriculum";
import { HVDC_QUIZ } from "@/data/quiz";
import { useLearning } from "@/components/providers/LearningProvider";
import { lessonHref } from "@/lib/lesson-routes";
import RoadmapTrack from "@/components/layout/RoadmapTrack";
import { NoteItem } from "@/components/lesson/LessonNotes";
import ExportReportButton from "@/components/results/ExportReportButton";
import LearnerFields from "@/components/results/LearnerFields";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-white tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function ResultsView() {
  const { completedLessons, quizBestScore, quizPassed, notes, isHydrated, progressPercent } = useLearning();
  const done = isHydrated ? completedLessons : [];
  const myNotes = isHydrated ? notes : [];
  const noteCount = myNotes.filter((n) => n.kind === "note").length;
  const questionCount = myNotes.length - noteCount;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Kết quả học tập</h1>
        <p className="mt-3 text-slate-300 leading-relaxed">
          Tiến độ, điểm kiểm tra, ghi chú và câu hỏi của bạn được lưu trên trình duyệt của máy này. Nhập họ tên rồi xuất file .docx để nộp cho giảng viên;
          file có sẵn ô để giảng viên ghi nhận xét.
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Không có dữ liệu nào được gửi lên máy chủ. Đổi máy hoặc xóa dữ liệu trình duyệt sẽ mất kết quả, nên hãy xuất file định kỳ.
        </p>
      </header>

      <section aria-labelledby="learner-title" className="space-y-4">
        <h2 id="learner-title" className="text-lg font-bold text-white">Thông tin học viên</h2>
        <LearnerFields />
        <ExportReportButton />
      </section>

      <section aria-labelledby="roadmap-title">
        <h2 id="roadmap-title" className="text-lg font-bold text-white mb-1">Lộ trình nghiên cứu</h2>
        <p className="text-sm text-slate-400 mb-5">Nhấp vào một giai đoạn để mở bài chưa học đầu tiên của giai đoạn đó. Viền đỏ đánh dấu giai đoạn nên học tiếp.</p>
        <RoadmapTrack compact={false} className="rounded-2xl border border-slate-800 bg-slate-900 px-4 sm:px-8 py-6" />
      </section>

      <section aria-labelledby="summary-title">
        <h2 id="summary-title" className="sr-only">Tổng quan</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat label="Tiến độ khóa học" value={`${isHydrated ? progressPercent : 0}%`} sub={`Đã học ${done.filter((id) => ALL_LESSONS.some((l) => l.id === id)).length}/${ALL_LESSONS.length} bài`} />
          <Stat
            label="Bài kiểm tra"
            value={isHydrated && quizBestScore !== null ? `${quizBestScore}/${HVDC_QUIZ.length}` : "Chưa làm"}
            sub={isHydrated && quizPassed ? "Đã đạt yêu cầu" : "Chưa đạt yêu cầu"}
          />
          <Stat label="Ghi chú" value={String(noteCount)} />
          <Stat label="Câu hỏi cho giảng viên" value={String(questionCount)} />
        </div>
      </section>

      <section aria-labelledby="lessons-title">
        <h2 id="lessons-title" className="text-lg font-bold text-white mb-4">Theo từng bài</h2>
        <ul className="space-y-3">
          {ALL_LESSONS.map((lesson) => {
            const items = myNotes.filter((n) => n.lessonId === lesson.id);
            const isDone = done.includes(lesson.id);
            return (
              <li key={lesson.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={lessonHref(lesson.id)} className="flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-300">
                    {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-label="Đã học" /> : <Circle className="w-4 h-4 text-slate-600 shrink-0" aria-label="Chưa học" />}
                    {lesson.title}
                  </Link>
                  <span className="text-xs text-slate-400">{items.length > 0 ? `${items.length} mục` : "Chưa có ghi chú"}</span>
                </div>
                {items.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {items.map((n) => (
                      <NoteItem key={n.id} note={n} />
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
