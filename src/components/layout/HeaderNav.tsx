"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Moon, Sun } from "lucide-react";
import { useLearning } from "@/components/providers/LearningProvider";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import RoadmapTrack from "@/components/layout/RoadmapTrack";

/** Thanh tiến độ chạy dọc mép dưới header */
export function HeaderProgressBar() {
  const { progressPercent, isHydrated } = useLearning();
  return (
    <div
      className="absolute left-0 right-0 bottom-0 h-[2px]"
      role="progressbar"
      aria-label="Tiến độ học tập"
      aria-valuenow={isHydrated ? progressPercent : 0}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full bg-cyan-500"
        initial={false}
        animate={{ width: `${isHydrated ? progressPercent : 0}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 24 }}
      />
    </div>
  );
}

/** Chuyển nền sáng/tối; lựa chọn lưu ở localStorage, script trong <head> áp dụng trước khi vẽ trang */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Không lưu được thì chỉ áp dụng cho phiên này
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
      aria-label={isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      title={isDark ? "Nền sáng" : "Nền tối"}
    >
      {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  );
}

export function HeaderActions() {
  const { progressPercent, isHydrated, openAssistant } = useLearning();

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
      {/* Lộ trình nghiên cứu: node từng giai đoạn, đặt trước số % */}
      <RoadmapTrack className="hidden lg:block mr-1" />
      <Link
        href="/learn"
        className="hidden md:flex items-baseline gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 transition"
        title="Tiến độ: số bài đã hoàn thành và bài kiểm tra"
      >
        <span className="font-semibold tabular-nums text-white text-sm">{isHydrated ? progressPercent : 0}%</span>
        đã học
      </Link>

      <ThemeToggle />

      <button
        onClick={() => openAssistant()}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-semibold transition"
      >
        <Bot className="w-4 h-4" />
        <span className="hidden sm:inline">Trợ lý AI</span>
      </button>
    </div>
  );
}
