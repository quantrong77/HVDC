"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { useLearning } from "@/components/providers/LearningProvider";
import { HoverTip } from "@/components/ui/InfoTip";
import { RoadmapStage, buildRoadmap } from "@/lib/roadmap";

const STATUS_TEXT: Record<RoadmapStage["status"], string> = {
  done: "đã hoàn thành",
  next: "nên học tiếp",
  partial: "đang học",
  todo: "chưa bắt đầu",
};

/** Vòng tròn node: tô đầy khi xong, cung tiến độ khi đang học, viền đỏ NPT cho giai đoạn nên học tiếp */
function Node({ stage, size, current }: { stage: RoadmapStage; size: number; current: boolean }) {
  const r = size / 2 - 2;
  const c = 2 * Math.PI * r;
  const frac = stage.total ? stage.done / stage.total : 0;
  const done = stage.status === "done";
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={done ? "fill-cyan-500 stroke-cyan-500" : "fill-slate-900 stroke-slate-700"}
          strokeWidth={2}
        />
        {!done && frac > 0 && (
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-cyan-500" strokeWidth={2.5} strokeDasharray={`${c * frac} ${c}`} strokeLinecap="round" />
        )}
      </svg>
      {stage.status === "next" && <span className="absolute -inset-[3px] rounded-full border-2 border-npt motion-safe:animate-pulse" aria-hidden="true" />}
      {current && <span className="absolute -inset-[5px] rounded-full ring-2 ring-cyan-400/60" aria-hidden="true" />}
      {/* Màu trắng cố định: token "white" của theme sáng là màu chữ tối */}
      <span className={`relative font-bold leading-none ${size >= 30 ? "text-xs" : "text-[9px]"} ${done ? "" : "text-slate-300"}`} style={done ? { color: "#fff" } : undefined}>
        {done ? <Check className={size >= 30 ? "w-4 h-4" : "w-3 h-3"} strokeWidth={3} /> : stage.short}
      </span>
    </span>
  );
}

/**
 * Lộ trình nghiên cứu dạng node trên đường kẻ.
 * compact: dùng trong header và sidebar; đầy đủ: có nhãn dưới mỗi node (trang Kết quả học tập).
 */
export default function RoadmapTrack({
  compact = true,
  className = "",
  tipSide = "bottom",
}: {
  compact?: boolean;
  className?: string;
  tipSide?: "top" | "bottom";
}) {
  const { completedLessons, quizPassed, isHydrated } = useLearning();
  const pathname = usePathname() ?? "/";
  const stages = buildRoadmap(isHydrated ? completedLessons : [], isHydrated && quizPassed);
  const size = compact ? 20 : 36;
  const currentLevel = pathname.match(/\/learn\/(\d)\//)?.[1];
  const isCurrent = (s: RoadmapStage) => (s.level !== undefined ? String(s.level) === currentLevel : pathname.startsWith("/quiz"));

  return (
    <nav aria-label="Lộ trình nghiên cứu" className={className}>
      <ol className="flex items-start">
        {stages.map((stage, i) => {
          const label = `${stage.title}: ${stage.done}/${stage.total}${stage.level ? " bài" : ""}, ${STATUS_TEXT[stage.status]}`;
          const link = (
            <Link
              href={stage.href}
              aria-label={label}
              aria-current={isCurrent(stage) ? "step" : undefined}
              className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-transform hover:scale-110"
            >
              <Node stage={stage} size={size} current={isCurrent(stage)} />
            </Link>
          );
          // Đoạn nối tới node tiếp theo: tô màu khi giai đoạn này đã xong
          const connector =
            i < stages.length - 1 ? (
              <span
                aria-hidden="true"
                className={`block h-[2px] rounded-full ${stage.status === "done" ? "bg-cyan-500" : "bg-slate-700"} ${compact ? "w-3.5 mx-0.5" : "flex-1 mx-1"}`}
                style={compact ? undefined : { marginTop: size / 2 - 1 }}
              />
            ) : null;

          return (
            <li key={stage.id} className={`flex ${compact ? "items-center" : "flex-1 last:flex-none items-start"}`}>
              <span className={`flex flex-col items-center ${compact ? "" : "w-12 sm:w-20 shrink-0"}`}>
                {compact ? (
                  <HoverTip text={label} align={i >= stages.length - 2 ? "end" : "start"} side={tipSide}>
                    {link}
                  </HoverTip>
                ) : (
                  link
                )}
                {!compact && (
                  <span className="mt-2 text-center text-[11px] leading-snug text-slate-400">
                    <span className="block font-semibold text-slate-200">{stage.level ? `Cấp độ ${stage.level}` : "Kiểm tra"}</span>
                    {stage.done}/{stage.total}
                  </span>
                )}
              </span>
              {connector}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
