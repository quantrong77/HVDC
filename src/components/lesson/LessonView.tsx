"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Bot, Check, ChevronLeft, ChevronRight, Clock, FileText } from "lucide-react";
import { useLearning } from "@/components/providers/LearningProvider";
import Formula from "@/components/ui/Formula";
import LessonSupplements from "@/components/lesson/LessonSupplements";
import { getSupplements } from "@/data/supplements";
import { findLesson, lessonHref } from "@/lib/lesson-routes";

const loading = () => <div className="h-72 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />;
const WaveformCanvas = dynamic(() => import("@/components/simulator/WaveformCanvas"), { loading });
const VICharacteristic = dynamic(() => import("@/components/simulator/VICharacteristic"), { loading });
const SingleLineDiagram = dynamic(() => import("@/components/simulator/SingleLineDiagram"), { loading });

/** Mô phỏng nhúng theo từng bài (spec mục III.2) */
const LESSON_LAB: Record<string, { title: string; Component: React.ComponentType }> = {
  "1.2": { title: "Thực hành: chuyển cấu hình Monopolar, Bipolar, Back-to-Back", Component: SingleLineDiagram },
  "1.3": { title: "Thực hành: khảo sát thiết bị trên sơ đồ đơn tuyến", Component: SingleLineDiagram },
  "2.1": { title: "Thực hành: góc kích α, trùng dẫn μ và góc dập γ", Component: WaveformCanvas },
  "2.3": { title: "Thực hành: so sánh gợn sóng cầu 6 xung và 12 xung", Component: WaveformCanvas },
  "3.1": { title: "Thực hành: đặc tính V-I và chuyển chế độ điều khiển", Component: VICharacteristic },
  "4.2": { title: "Thực hành: mô phỏng sụt áp AC trên đặc tính V-I", Component: VICharacteristic },
};

export default function LessonView({ level, lesson }: { level: string; lesson: string }) {
  const found = findLesson(level, lesson)!;
  const { lesson: data, level: levelData, prev, next, position, total } = found;
  const { completedLessons, toggleLesson, completeLesson, openAssistant, isHydrated } = useLearning();
  const isDone = isHydrated && completedLessons.includes(data.id);
  const lab = LESSON_LAB[data.id];

  return (
    <article className="min-w-0 flex-1">
      <nav aria-label="Vị trí" className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mb-4">
        <Link href="/#curriculum" className="hover:text-cyan-300">Lộ trình</Link>
        <ChevronRight className="w-3 h-3" />
        <span>Cấp độ {levelData.level}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-300">Bài {data.id}</span>
      </nav>

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

      <LessonSupplements supplements={getSupplements(data.id)} />

      {lab && (
        <section className="py-6 border-t border-slate-800" aria-labelledby="lesson-lab">
          <h2 id="lesson-lab" className="text-lg font-bold text-white mb-4">{lab.title}</h2>
          <lab.Component />
        </section>
      )}

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
