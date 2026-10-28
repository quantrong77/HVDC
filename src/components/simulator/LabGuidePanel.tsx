import React from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, FlaskConical, ListOrdered, Target } from "lucide-react";
import { ALL_LESSONS } from "@/data/curriculum";
import { getSupplements } from "@/data/supplements";
import { LAB_GUIDES, LabId } from "@/data/lab-guides";
import { lessonHref } from "@/lib/lesson-routes";

/**
 * Hướng dẫn chi tiết của một phòng lab: mục tiêu, các bước, thí nghiệm gợi ý (bấm để xem kết quả cần thấy) và mục liên quan.
 * Dùng details/summary nên thu gọn được mà không cần JS.
 */
export default function LabGuidePanel({ id, defaultOpen = true, showLabLinks = true }: { id: LabId; defaultOpen?: boolean; showLabLinks?: boolean }) {
  const guide = LAB_GUIDES[id];
  const lessons = guide.lessons.map((lid) => ALL_LESSONS.find((l) => l.id === lid)!).filter(Boolean);

  return (
    <details open={defaultOpen} className="group/guide mt-4 rounded-2xl border border-slate-800 bg-slate-900">
      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 font-semibold text-white">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Hướng dẫn chi tiết
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open/guide:rotate-180" />
      </summary>

      <div className="px-5 pb-5 space-y-5">
        <p className="flex gap-2 text-sm text-slate-300 leading-relaxed">
          <Target className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
          <span>
            <span className="font-semibold text-white">Mục tiêu: </span>
            {guide.goal}
          </span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section aria-label="Cách sử dụng">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold text-white mb-2">
              <ListOrdered className="w-4 h-4 text-cyan-400" />
              Cách sử dụng
            </h4>
            <ol className="space-y-2">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
                  <span className="w-5 h-5 shrink-0 rounded-md bg-slate-800 text-cyan-300 text-[11px] font-mono flex items-center justify-center mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section aria-label="Thí nghiệm gợi ý">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold text-white mb-2">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              Thí nghiệm gợi ý
            </h4>
            <ul className="space-y-2">
              {guide.experiments.map((ex) => (
                <li key={ex.task}>
                  <details className="group/ex rounded-lg border border-slate-800 bg-slate-950">
                    <summary className="flex items-start justify-between gap-2 cursor-pointer list-none px-3 py-2 text-sm text-slate-200 [&::-webkit-details-marker]:hidden">
                      {ex.task}
                      <span className="shrink-0 text-[11px] text-cyan-400 mt-0.5 group-open/ex:hidden">Xem kết quả</span>
                    </summary>
                    <p className="px-3 pb-2.5 text-[13px] text-emerald-400 leading-relaxed">{ex.expect}</p>
                  </details>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Mục liên quan">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold text-white mb-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Mục liên quan
            </h4>
            <ul className="space-y-1.5">
              {lessons.map((lesson) => {
                const extra = getSupplements(lesson.id).reduce((n, s) => n + s.sections.length, 0);
                return (
                  <li key={lesson.id}>
                    <Link href={lessonHref(lesson.id)} className="block rounded-lg px-3 py-2 border border-slate-800 hover:border-cyan-500/60 transition">
                      <span className="block text-sm text-slate-200">{lesson.title}</span>
                      {extra > 0 && <span className="block text-[11px] text-slate-500 mt-0.5">Kèm {extra} mục tài liệu bổ sung</span>}
                    </Link>
                  </li>
                );
              })}
              {showLabLinks &&
                guide.relatedLabs.map((labId) => (
                  <li key={labId}>
                    <Link href={`/simulator#${labId}`} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-cyan-400 hover:bg-slate-800 transition">
                      <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                      Phòng lab: {LAB_GUIDES[labId].title}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </details>
  );
}
