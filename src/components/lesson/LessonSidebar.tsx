"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Circle, ListTree, X } from "lucide-react";
import { CURRICULUM_LEVELS } from "@/data/curriculum";
import { useLearning } from "@/components/providers/LearningProvider";
import { lessonHref } from "@/lib/lesson-routes";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { completedLessons, isHydrated, progressPercent } = useLearning();
  const done = (id: string) => isHydrated && completedLessons.includes(id);

  return (
    <nav aria-label="Mục lục bài học" className="space-y-5">
      <div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-slate-400">Tiến độ khóa học</span>
          <span className="font-mono font-semibold text-white tabular-nums">{isHydrated ? progressPercent : 0}%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${isHydrated ? progressPercent : 0}%` }} />
        </div>
      </div>

      {CURRICULUM_LEVELS.map((level) => (
        <div key={level.code}>
          <p className="text-[11px] font-semibold text-cyan-400 mb-1.5">Cấp độ {level.level}</p>
          <p className="text-xs text-slate-300 font-medium mb-2 leading-snug">{level.title.replace(/^Cấp độ \d+: /, "")}</p>
          <ul className="space-y-0.5 border-l border-slate-800">
            {level.topics.map((topic) => {
              const href = lessonHref(topic.id);
              const active = pathname === href;
              return (
                <li key={topic.id}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`-ml-px flex items-start gap-2 pl-3 pr-2 py-1.5 text-[13px] leading-snug border-l-2 transition-colors ${
                      active ? "border-cyan-400 text-white bg-cyan-500/5" : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
                    }`}
                  >
                    {done(topic.id) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-600" />
                    )}
                    <span>{topic.title.replace(/^Bài /, "")}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function LessonSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Desktop: cột cố định */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-3 pb-8">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile: nút mở mục lục */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <ListTree className="w-4 h-4 text-cyan-400" />
          Mục lục 10 bài học
        </span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="lg:hidden fixed inset-0 z-[55] bg-slate-950/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mục lục bài học"
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[56] w-[85%] max-w-sm bg-slate-900 border-r border-slate-800 p-5 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="flex justify-end mb-2">
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" aria-label="Đóng mục lục">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
