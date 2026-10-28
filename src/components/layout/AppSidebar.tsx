"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Award,
  CheckCircle2,
  ChevronDown,
  Circle,
  Compass,
  Cpu,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  Home,
  Info,
  Layers,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  TrendingDown,
  X,
} from "lucide-react";
import { CURRICULUM_LEVELS } from "@/data/curriculum";
import { useLearning } from "@/components/providers/LearningProvider";
import { lessonHref } from "@/lib/lesson-routes";
import { useUiStore } from "@/store/ui";

type Match = "exact" | "prefix" | "none";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  match: Match; // Liên kết neo (#...) không được đánh dấu đang mở
  lessons?: boolean;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Học tập",
    items: [
      { href: "/", label: "Trang chủ", icon: Home, match: "exact" },
      { href: "/#curriculum", label: "Lộ trình 4 cấp độ", icon: Route, match: "none" },
      { href: "/learn", label: "Bài học", icon: GraduationCap, match: "prefix", lessons: true },
      { href: "/quiz", label: "Kiểm tra", icon: Award, match: "prefix" },
    ],
  },
  {
    title: "Phòng lab",
    items: [
      { href: "/simulator", label: "Tất cả phòng lab", icon: FlaskConical, match: "exact" },
      { href: "/simulator#waveform", label: "Cầu Thyristor LCC", icon: Activity, match: "none" },
      { href: "/simulator#vi-curve", label: "Đặc tính V-I", icon: TrendingDown, match: "none" },
      { href: "/simulator#vsc", label: "Điều khiển VSC-HVDC", icon: Cpu, match: "none" },
      { href: "/simulator#sld", label: "Sơ đồ đơn tuyến", icon: Layers, match: "none" },
      { href: "/simulator#planner", label: "Thiết kế sơ bộ tuyến", icon: Compass, match: "none" },
    ],
  },
  {
    title: "Thông tin",
    items: [
      { href: "/#guide", label: "Hướng dẫn sử dụng", icon: HelpCircle, match: "none" },
      { href: "/#about", label: "Giới thiệu", icon: Info, match: "none" },
    ],
  },
];

/** Bản tĩnh (trailingSlash) trả về "/learn/1/1-1/": bỏ dấu "/" cuối để so khớp */
function useCleanPath() {
  const pathname = usePathname() ?? "/";
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

function isActive(path: string, item: NavItem) {
  if (item.match === "exact") return path === item.href;
  if (item.match === "prefix") return path === item.href || path.startsWith(`${item.href}/`);
  return false;
}

function LessonTree({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  const { completedLessons, isHydrated } = useLearning();
  const done = (id: string) => isHydrated && completedLessons.includes(id);

  return (
    <div className="mt-1 mb-2 ml-[22px] space-y-3 border-l border-slate-800 pl-3">
      {CURRICULUM_LEVELS.map((level) => (
        <div key={level.code}>
          <p className="text-[11px] font-semibold text-cyan-400 mb-1">
            Cấp độ {level.level}: {level.title.replace(/^Cấp độ \d+: /, "")}
          </p>
          <ul className="space-y-px">
            {level.topics.map((topic) => {
              const href = lessonHref(topic.id);
              const active = path === href;
              return (
                <li key={topic.id}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-start gap-2 rounded-md px-2 py-1.5 text-[13px] leading-snug transition-colors ${
                      active ? "bg-cyan-500/10 text-white font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {done(topic.id) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" aria-label="Đã học" />
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
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useCleanPath();
  const { progressPercent, isHydrated } = useLearning();
  const onLearn = path === "/learn" || path.startsWith("/learn/");
  const [lessonsOpen, setLessonsOpen] = useState(onLearn);

  // Vào trang bài học thì tự mở cây bài
  useEffect(() => {
    if (onLearn) setLessonsOpen(true);
  }, [onLearn]);

  return (
    <div className="flex flex-col min-h-full">
      <nav aria-label="Điều hướng chính" className="flex-1 px-3 py-5 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-xs font-medium text-slate-500">{group.title}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(path, item);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={`relative flex-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          active ? "bg-slate-800 text-white font-semibold" : "text-slate-300 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        {/* Mục đang mở: vạch đỏ NPT ở mép trái */}
                        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-npt" aria-hidden="true" />}
                        <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-cyan-500" : "text-slate-500"}`} />
                        {item.label}
                      </Link>
                      {item.lessons && (
                        <button
                          onClick={() => setLessonsOpen((v) => !v)}
                          aria-expanded={lessonsOpen}
                          aria-controls="sidebar-lesson-tree"
                          aria-label={lessonsOpen ? "Thu gọn danh sách bài học" : "Mở danh sách bài học"}
                          className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${lessonsOpen ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {item.lessons && lessonsOpen && (
                      <div id="sidebar-lesson-tree">
                        <LessonTree path={path} onNavigate={onNavigate} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Tiến độ học tập */}
      <div className="sticky bottom-0 px-6 py-4 border-t border-slate-800 bg-slate-900">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-slate-400">Tiến độ khóa học</span>
          <span className="font-semibold text-white tabular-nums">{isHydrated ? progressPercent : 0}%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${isHydrated ? progressPercent : 0}%` }} />
        </div>
      </div>
    </div>
  );
}

/** Nút ẩn/hiện sidebar ở đầu header (desktop: ẩn/hiện cột; mobile: mở ngăn kéo) */
export function SidebarToggle() {
  const { desktopOpen, mobileOpen, toggleSidebar, syncDesktopFromDom } = useUiStore();

  useEffect(() => {
    syncDesktopFromDom();
  }, [syncDesktopFromDom]);

  return (
    <button
      onClick={toggleSidebar}
      aria-controls="app-sidebar"
      className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
    >
      <span className="lg:hidden">
        <Menu className="w-5 h-5" aria-hidden="true" />
        <span className="sr-only">{mobileOpen ? "Đóng menu" : "Mở menu"}</span>
      </span>
      <span className="hidden lg:inline">
        {desktopOpen ? <PanelLeftClose className="w-5 h-5" aria-hidden="true" /> : <PanelLeftOpen className="w-5 h-5" aria-hidden="true" />}
        <span className="sr-only">{desktopOpen ? "Ẩn menu" : "Hiện menu"}</span>
      </span>
    </button>
  );
}

export default function AppSidebar() {
  const { mobileOpen, closeMobile } = useUiStore();
  const path = useCleanPath();
  const reduceMotion = useReducedMotion();

  // Đổi trang thì đóng ngăn kéo mobile
  useEffect(() => {
    closeMobile();
  }, [path, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMobile();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  return (
    <>
      {/* Desktop: cột cố định, ẩn được bằng nút trên header */}
      <aside id="app-sidebar" className="app-sidebar hidden lg:block w-64 shrink-0 border-r border-slate-800 bg-slate-900">
        <div className="sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      {/* Mobile: ngăn kéo */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-[55] bg-slate-950/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu điều hướng"
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[56] w-[85%] max-w-xs bg-slate-900 border-r border-slate-800 overflow-y-auto"
              initial={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
                <span className="font-bold text-white">Nghiên cứu HVDC</span>
                <button onClick={closeMobile} className="p-2 -mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" aria-label="Đóng menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarNav onNavigate={closeMobile} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
