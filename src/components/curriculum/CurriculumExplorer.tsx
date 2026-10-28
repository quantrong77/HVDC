"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ArrowUpRight, BookOpenText, Bot, Check, CheckCircle2, Circle, Clock, FileText, Sigma } from "lucide-react";
import { CURRICULUM_LEVELS } from "@/data/curriculum";
import { useLearning } from "@/components/providers/LearningProvider";
import { lessonHref } from "@/lib/lesson-routes";
import { getSupplements } from "@/data/supplements";

// KaTeX (~90 kB) chỉ tải khi cần hiển thị công thức, không nằm trong gói đầu của trang chủ
const Formula = dynamic(() => import("@/components/ui/Formula"));

function LabAnchor({ href, ...rest }: { href: string; className: string; children: React.ReactNode }) {
  return href.startsWith("/") ? <Link href={href} {...rest} /> : <a href={href} {...rest} />;
}

export default function CurriculumExplorer() {
  const { completedLessons, toggleLesson, openAssistant, isHydrated } = useLearning();
  const [levelIndex, setLevelIndex] = useState(0);
  const [lessonId, setLessonId] = useState<string>(CURRICULUM_LEVELS[0].topics[0].id);
  const reduceMotion = useReducedMotion();

  const level = CURRICULUM_LEVELS[levelIndex];
  const lesson = level.topics.find((t) => t.id === lessonId) ?? level.topics[0];
  const done = (id: string) => isHydrated && completedLessons.includes(id);

  const selectLevel = (idx: number) => {
    setLevelIndex(idx);
    setLessonId(CURRICULUM_LEVELS[idx].topics[0].id);
  };

  return (
    <>
      {/* Level Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6" role="tablist" aria-label="Cấp độ đào tạo">
        {CURRICULUM_LEVELS.map((item, idx) => {
          const doneCount = item.topics.filter((t) => done(t.id)).length;
          const active = levelIndex === idx;
          return (
            <button
              key={item.code}
              role="tab"
              aria-selected={active}
              onClick={() => selectLevel(idx)}
              className={`relative p-4 rounded-xl text-left border transition-colors overflow-hidden ${
                active ? "bg-slate-900 border-cyan-500" : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${active ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400"}`}>
                  Cấp độ {item.level}
                </span>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {doneCount}/{item.topics.length} bài
                </span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1">{item.title.replace(/^Cấp độ \d+: /, "")}</h3>
              <p className="text-xs text-slate-400 line-clamp-1 mt-1">{item.subtitle}</p>
              {/* Tiến độ của cấp độ */}
              <span className="absolute left-0 bottom-0 h-0.5 bg-emerald-400 transition-all duration-500" style={{ width: `${(doneCount / item.topics.length) * 100}%` }} />
            </button>
          );
        })}
      </div>

      {/* Active Level Detail */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 pb-6 border-b border-slate-800">
          <div>
            <p className="text-xs text-slate-400 mb-1">
              <span className="font-mono text-cyan-400">{level.code}</span> · {level.lessonsCount} chuyên đề
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{level.title}</h3>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">{level.description}</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {level.durationHours} giờ
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-5 mt-6">
          {/* Lesson list */}
          <ol className="space-y-2" aria-label="Danh sách bài học">
            {level.topics.map((topic) => {
              const active = topic.id === lesson.id;
              return (
                <li key={topic.id}>
                  <button
                    onClick={() => setLessonId(topic.id)}
                    aria-current={active}
                    className={`w-full text-left p-3.5 rounded-xl border transition-colors flex gap-3 ${
                      active ? "bg-slate-950 border-cyan-500/60" : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {done(topic.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className={`w-5 h-5 shrink-0 mt-0.5 ${active ? "text-cyan-400" : "text-slate-600"}`} />
                    )}
                    <span>
                      <span className="block text-sm font-semibold text-white">{topic.title}</span>
                      <span className="block text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{topic.description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Lesson detail */}
          <AnimatePresence mode="wait">
            <motion.article
              key={lesson.id}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-xl bg-slate-950/70 border border-slate-800"
            >
              <h4 className="text-lg font-bold text-white">{lesson.title}</h4>
              <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {lesson.docRef}
              </p>
              {getSupplements(lesson.id).length > 0 && (
                <Link href={lessonHref(lesson.id)} className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition">
                  <BookOpenText className="w-3.5 h-3.5" />
                  Tài liệu bổ sung: {getSupplements(lesson.id).reduce((n, s) => n + s.sections.length, 0)} mục, xem trong trang bài học
                </Link>
              )}

              <ul className="mt-4 space-y-2.5">
                {lesson.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                    {point}
                  </li>
                ))}
              </ul>

              {lesson.formula && (
                <div className="mt-4 px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5 overflow-x-auto">
                  <Sigma className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  {lesson.formulaTex ? (
                    <Formula tex={lesson.formulaTex} className="text-amber-100" />
                  ) : (
                    <code className="font-mono text-sm text-amber-200 break-words">{lesson.formula}</code>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800">
                <Link
                  href={lessonHref(lesson.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
                >
                  Mở trang bài học
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  aria-pressed={done(lesson.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                    done(lesson.id)
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {done(lesson.id) ? "Đã học xong" : "Đánh dấu đã học"}
                </button>
                {lesson.labLink && (
                  // Link sang trang khác (Phòng lab) phải qua next/link để giữ basePath; neo trong trang chủ giữ thẻ a
                  <LabAnchor
                    href={lesson.labLink.href}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm text-slate-200 border border-slate-700 hover:border-cyan-500/60 transition"
                  >
                    {lesson.labLink.label}
                    <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                  </LabAnchor>
                )}
                <button
                  onClick={() => openAssistant(lesson.title.replace(/^Bài [\d.]+: /, ""))}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  Hỏi trợ lý về bài này
                </button>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
