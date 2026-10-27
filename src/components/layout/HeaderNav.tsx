"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Menu, Moon, Sun, X } from "lucide-react";
import { useLearning } from "@/components/providers/LearningProvider";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export const NAV_LINKS = [
  { href: "/#curriculum", label: "Lộ trình" },
  { href: "/learn", label: "Bài học" },
  { href: "/simulator", label: "Phòng lab" },
  { href: "/#sld", label: "Sơ đồ SLD" },
  { href: "/quiz", label: "Kiểm tra" },
  { href: "/#guide", label: "Hướng dẫn" },
];


/** Mục đang mở: so khớp theo đường dẫn (liên kết neo trên trang chủ không được đánh dấu) */
function useIsActive() {
  const pathname = usePathname();
  return (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
}

export function HeaderNavLinks() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Điều hướng chính" className="hidden xl:flex items-stretch self-stretch text-sm font-medium">
      {NAV_LINKS.map(({ href, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative flex items-center px-3 transition-colors ${
              active ? "text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {label}
            {/* Mục đang mở được gạch chân bằng màu đỏ NPT */}
            <span className={`absolute left-3 right-3 bottom-0 h-[3px] rounded-t bg-npt transition-opacity ${active ? "opacity-100" : "opacity-0"}`} />
          </Link>
        );
      })}
    </nav>
  );
}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = useIsActive();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
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

      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="xl:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
        aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Điều hướng chính"
            className="xl:hidden absolute left-0 right-0 top-full bg-slate-900 border-b border-slate-800 shadow-lg px-4 py-3 grid grid-cols-2 gap-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(href) ? "page" : undefined}
                className={`px-3 py-2.5 rounded-lg text-sm border-l-[3px] ${
                  isActive(href) ? "border-npt text-white bg-slate-800" : "border-transparent text-slate-300 hover:bg-slate-800"
                }`}
              >
                {label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
