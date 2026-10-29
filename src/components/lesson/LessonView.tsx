"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight, Bot, Check, Layers, ChevronLeft, ChevronRight, Clock, FileText, FlaskConical } from "lucide-react";
import { useLearning } from "@/components/providers/LearningProvider";
import Formula from "@/components/ui/Formula";
import LessonSupplements from "@/components/lesson/LessonSupplements";
import LessonNotes from "@/components/lesson/LessonNotes";
import { getSupplements } from "@/data/supplements";
import { findLesson, lessonHref } from "@/lib/lesson-routes";
import LabGuidePanel from "@/components/simulator/LabGuidePanel";
import { LabId, labsForLesson } from "@/data/lab-guides";
import { SYSTEM_LINKS, foundationsFor } from "@/data/system-links";
import { figuresFor } from "@/data/lesson-figures";
import LessonFigures from "@/components/lesson/LessonFigures";
import LessonResources from "@/components/lesson/LessonResources";
import { resourcesFor } from "@/data/lesson-resources";

const loading = () => <div className="h-72 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />;
const WaveformCanvas = dynamic(() => import("@/components/simulator/WaveformCanvas"), { loading });
const VICharacteristic = dynamic(() => import("@/components/simulator/VICharacteristic"), { loading });
const SingleLineDiagram = dynamic(() => import("@/components/simulator/SingleLineDiagram"), { loading });
const VscHvdcLab = dynamic(() => import("@/components/simulator/VscHvdcLab"), { loading });

/** Mô phỏng nhúng theo từng bài (spec mục III.2) */
const LESSON_LAB: Record<string, { title: string; lab: LabId; Component: React.ComponentType }> = {
  "1.2": { title: "Thực hành: chuyển cấu hình Monopolar, Bipolar, Back-to-Back", lab: "sld", Component: SingleLineDiagram },
  "1.3": { title: "Thực hành: khảo sát thiết bị trên sơ đồ đơn tuyến", lab: "sld", Component: SingleLineDiagram },
  "2.1": { title: "Thực hành: góc kích α, trùng dẫn μ và góc dập γ", lab: "waveform", Component: WaveformCanvas },
  "2.2": { title: "Thực hành: điều khiển độc lập P, Q và điện áp DC của VSC", lab: "vsc", Component: VscHvdcLab },
  "2.3": { title: "Thực hành: so sánh gợn sóng cầu 6 xung và 12 xung", lab: "waveform", Component: WaveformCanvas },
  "3.1": { title: "Thực hành: đặc tính V-I và chuyển chế độ điều khiển", lab: "vi-curve", Component: VICharacteristic },
  "4.2": { title: "Thực hành: mô phỏng sụt áp AC trên đặc tính V-I", lab: "vi-curve", Component: VICharacteristic },
};

export default function LessonView({ level, lesson }: { level: string; lesson: string }) {
  const found = findLesson(level, lesson)!;
  const { lesson: data, level: levelData, prev, next, position, total } = found;
  const { completedLessons, toggleLesson, completeLesson, openAssistant, isHydrated } = useLearning();
  const isDone = isHydrated && completedLessons.includes(data.id);
  const lab = LESSON_LAB[data.id];
  const practice = data.practice ?? [];
  // "/simulator#firing-wave" → phòng lab "firing"
  const practiceLabs = practice.map((p) => p.href.split("#")[1]?.replace(/-(wave|char|dyn|pwm|vec|design)$/, ""));
  // Phòng lab khác liên quan đến bài (bỏ phòng lab đã nhúng hoặc đã có trong phần thực hành)
  const relatedLabs = labsForLesson(data.id).filter((g) => g.id !== lab?.lab && !practiceLabs.includes(g.id));
  // Cấp độ 0: khái niệm → hệ thống HVDC; Cấp độ 1–4: trỏ ngược về kiến thức nền
  const systemLinks = SYSTEM_LINKS[data.id] ?? [];
  const foundations = levelData.level === 0 ? [] : foundationsFor(data.id);
  // Hình minh họa (Cấp độ 0): cột phải trên màn hình rộng, dải ảnh vuốt ngang trên màn hình hẹp
  const figures = figuresFor(data.id);

  return (
    <article className="min-w-0 flex-1">
      <nav aria-label="Vị trí" className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mb-4">
        <Link href="/#curriculum" className="hover:text-cyan-300">Lộ trình</Link>
        <ChevronRight className="w-3 h-3" />
        <span>Cấp độ {levelData.level}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-300">Bài {data.id}</span>
      </nav>

      <div className={figures.length > 0 ? "xl:grid xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8" : ""}>
        <div className="min-w-0">
          <header className="pb-6 border-b border-slate-800">
            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
              <span className="font-mono text-cyan-400">{levelData.code}</span>
              <span>Bài {position}/{total}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Cấp độ {levelData.level}: {levelData.durationHours} giờ
              </span>
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white leading-tight">{data.title}</h1>
            <p className="mt-3 text-slate-300 leading-relaxed max-w-3xl">{data.description}</p>
            <p className="mt-3 text-xs text-cyan-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Tài liệu: {data.docRef}
            </p>
          </header>

          <section className="py-6 max-w-3xl">
            <h2 className="text-lg font-bold text-white mb-4">Ý chính cần nắm</h2>
            <ol className="space-y-3">
              {data.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-[15px] text-slate-300 leading-relaxed">
                  <span className="w-6 h-6 shrink-0 rounded-md bg-slate-800 text-cyan-300 text-xs font-mono flex items-center justify-center mt-0.5">{i + 1}</span>
                  {point}
                </li>
              ))}
            </ol>

            {data.formulaTex && (
              <div className="mt-6 px-5 py-4 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <p className="text-xs text-amber-400 mb-2">Công thức trọng tâm</p>
                <Formula tex={data.formulaTex} display className="text-amber-100" />
              </div>
            )}
          </section>

          <LessonFigures figures={figures} variant="strip" />

          {systemLinks.length > 0 && (
            <section className="py-6 border-t border-slate-800 max-w-4xl" aria-labelledby="lesson-system-links">
              <h2 id="lesson-system-links" className="flex items-center gap-2 text-lg font-bold text-white">
                <Layers className="w-5 h-5 text-cyan-400" />
                Liên hệ ứng dụng trong hệ thống HVDC
              </h2>
              <p className="mt-1 mb-4 text-sm text-slate-400">Mỗi khái niệm của bài xuất hiện ở đâu trong trạm và đường dây, gắn với công việc nào, và học tiếp ở bài nào.</p>
              <ul className="space-y-3">
                {systemLinks.map((s) => (
                  <li key={s.concept} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-[15px] font-semibold text-white">{s.concept}</p>
                    <dl className="mt-2 grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm">
                      <dt className="text-slate-400">Trong hệ thống</dt>
                      <dd className="text-slate-200 leading-relaxed">{s.inSystem}</dd>
                      <dt className="text-slate-400">Công việc liên quan</dt>
                      <dd className="text-slate-200 leading-relaxed">{s.work}</dd>
                      <dt className="text-slate-400">Học tiếp</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {s.next.map((id) => (
                          <Link key={id} href={lessonHref(id)} className="text-xs px-2 py-0.5 rounded-md border border-slate-700 text-cyan-300 hover:border-cyan-500">
                            Bài {id}
                          </Link>
                        ))}
                      </dd>
                    </dl>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {foundations.length > 0 && (
            <section className="py-6 border-t border-slate-800 max-w-3xl" aria-labelledby="lesson-foundations">
              <h2 id="lesson-foundations" className="flex items-center gap-2 text-lg font-bold text-white">
                <Layers className="w-5 h-5 text-cyan-400" />
                Kiến thức nền từ Cấp độ 0
              </h2>
              <p className="mt-1 mb-3 text-sm text-slate-400">Ôn lại các khái niệm cơ sở mà bài này dựa vào.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {foundations.map((f) => (
                  <li key={f.lessonId}>
                    <Link href={lessonHref(f.lessonId)} className="block h-full rounded-xl border border-slate-800 p-3 hover:border-cyan-500/60 transition">
                      <span className="block text-sm font-semibold text-white">{f.title}</span>
                      <span className="block mt-1 text-xs text-slate-400 leading-relaxed">{f.concepts.join(" · ")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <LessonSupplements supplements={getSupplements(data.id)} />

          <LessonResources resources={resourcesFor(data.id)} />

          {lab && (
            <section className="py-6 border-t border-slate-800" aria-labelledby="lesson-lab">
              <h2 id="lesson-lab" className="text-lg font-bold text-white mb-4">{lab.title}</h2>
              <lab.Component />
              <LabGuidePanel id={lab.lab} defaultOpen={false} />
            </section>
          )}

          {practice.length > 0 && (
            <section className="py-6 border-t border-slate-800" aria-labelledby="lesson-practice">
              <h2 id="lesson-practice" className="text-lg font-bold text-white">Thực hành trong phòng lab</h2>
              <p className="mt-1 mb-4 text-sm text-slate-400">Mỗi thẻ mở đúng tab mô phỏng. Làm xong, ghi kết quả quan sát vào mục ghi chú bên dưới.</p>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {practice.map((p, i) => (
                  <li key={p.title + i}>
                    <Link href={p.href} className="group flex gap-3 h-full p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-400 transition">
                      <FlaskConical className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">
                          {i + 1}. {p.title}
                        </span>
                        <span className="block mt-1 text-[13px] text-slate-300 leading-relaxed">{p.task}</span>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-400">
                          Mở phòng lab
                          <ArrowUpRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {relatedLabs.length > 0 && (
            <section className="py-6 border-t border-slate-800" aria-labelledby="lesson-related-labs">
              <h2 id="lesson-related-labs" className="text-lg font-bold text-white mb-3">Phòng lab liên quan</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedLabs.map((g) => (
                  <li key={g.id}>
                    <Link href={`/simulator#${g.id}`} className="flex gap-3 h-full p-4 rounded-xl border border-slate-800 hover:border-cyan-500/60 transition">
                      <FlaskConical className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" />
                      <span>
                        <span className="block text-sm font-semibold text-white">{g.title}</span>
                        <span className="block mt-1 text-xs text-slate-400 leading-relaxed">{g.goal}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>
        <LessonFigures figures={figures} variant="aside" />
      </div>

      <LessonNotes lessonId={data.id} />

      <footer className="pt-6 mt-2 border-t border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => toggleLesson(data.id)}
            aria-pressed={isDone}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              isDone ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40" : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            }`}
          >
            <Check className="w-4 h-4" />
            {isDone ? "Đã học xong" : "Đánh dấu đã học"}
          </button>
          <button
            onClick={() => openAssistant(data.title.replace(/^Bài [\d.]+: /, ""))}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-slate-200 border border-slate-700 hover:border-cyan-500/60 transition"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            Hỏi trợ lý về bài này
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prev ? (
            <Link href={lessonHref(prev.id)} className="group p-4 rounded-xl border border-slate-800 hover:border-slate-600 transition">
              <span className="text-xs text-slate-500 flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5" />Bài trước</span>
              <span className="block mt-1 text-sm text-slate-200 group-hover:text-white">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link
              href={lessonHref(next.id)}
              onClick={() => completeLesson(data.id)}
              className="group p-4 rounded-xl border border-cyan-500/40 bg-cyan-500/5 hover:border-cyan-400 transition sm:text-right"
            >
              <span className="text-xs text-cyan-400 flex items-center gap-1 sm:justify-end">Học xong, sang bài tiếp<ChevronRight className="w-3.5 h-3.5" /></span>
              <span className="block mt-1 text-sm text-slate-200 group-hover:text-white">{next.title}</span>
            </Link>
          ) : (
            <Link
              href="/quiz"
              onClick={() => completeLesson(data.id)}
              className="group p-4 rounded-xl border border-amber-500/40 bg-amber-500/5 hover:border-amber-400 transition sm:text-right"
            >
              <span className="text-xs text-amber-400 flex items-center gap-1 sm:justify-end">Hoàn thành lộ trình<ChevronRight className="w-3.5 h-3.5" /></span>
              <span className="block mt-1 text-sm text-slate-200 group-hover:text-white">Làm bài kiểm tra 10 câu</span>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}
