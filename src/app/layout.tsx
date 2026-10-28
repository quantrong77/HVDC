import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import React from "react";
import Link from "next/link";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { Mail } from "lucide-react";
import { LearningProvider } from "@/components/providers/LearningProvider";
import { HeaderActions, HeaderProgressBar } from "@/components/layout/HeaderNav";
import AppSidebar, { SidebarToggle } from "@/components/layout/AppSidebar";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import BrandMark from "@/components/layout/BrandMark";
import HvdcAssistant from "@/components/ai/HvdcAssistant";

// Be Vietnam Pro được thiết kế riêng cho dấu tiếng Việt; JetBrains Mono chỉ dùng cho số đo kỹ thuật
const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Nghiên Cứu HVDC | Nền Tảng Đào Tạo & Mô Phỏng EVNNPT",
  description:
    "Nền tảng Nghiên cứu HVDC - Tổng hợp và sử dụng tài liệu học tập của các Khóa học do Tổng công ty Truyền tải điện Quốc gia (EVNNPT) tổ chức. Xây dựng: Hoàng Trọng - PTC3 (quantrong77@gmail.com).",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950 font-sans">
        <LearningProvider>
          {/* Dải nhận diện: xanh EVN, kết thúc bằng đoạn đỏ NPT */}
          <div className="flex h-1" aria-hidden="true">
            <span className="flex-1 bg-evn" />
            <span className="w-24 sm:w-40 bg-npt" />
          </div>

          <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
            <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <SidebarToggle />
              <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0" aria-label="Nghiên cứu HVDC, về trang chủ">
                <BrandMark />
                <span className="h-8 w-px bg-slate-700" aria-hidden="true" />
                <span className="leading-tight min-w-0">
                  <span className="block font-bold text-white text-sm sm:text-[15px] truncate">Nghiên cứu HVDC</span>
                  <span className="hidden sm:block text-[11px] text-slate-400">Đào tạo và mô phỏng truyền tải một chiều</span>
                </span>
              </Link>
              </div>

              <HeaderActions />
            </div>
            <HeaderProgressBar />
          </header>

          <div className="flex">
            <AppSidebar />
            <div className="flex-1 min-w-0">
          <main>{children}</main>

          {/* Footer: nền navy EVN, luôn tối */}
          <footer className="theme-dark bg-evn-ink mt-24 border-t-4 border-npt text-sm text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-10 border-b border-slate-700/60">
                <div>
                  <div className="flex items-center gap-3">
                    <BrandMark compact />
                    <span className="h-6 w-px bg-slate-600" aria-hidden="true" />
                    <span className="font-bold text-white">Nghiên cứu HVDC</span>
                  </div>
                  <p className="mt-4 text-slate-400 leading-relaxed max-w-md">
                    Nền tảng số hóa giáo trình đào tạo Truyền tải điện một chiều điện áp cao (HVDC), tổng hợp từ tài liệu các khóa học do
                    Tổng công ty Truyền tải điện Quốc gia (EVNNPT) tổ chức.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold text-white mb-3">Tổng hợp và phát triển</h2>
                  <p className="text-slate-300">Hoàng Trọng, Công ty Truyền tải điện 3 (PTC3)</p>
                  <a href="mailto:quantrong77@gmail.com" className="mt-2 inline-flex items-center gap-1.5 text-cyan-300 hover:underline">
                    <Mail className="w-4 h-4" />
                    quantrong77@gmail.com
                  </a>
                </div>

                <div>
                  <h2 className="font-semibold text-white mb-3">Tài liệu tham chiếu</h2>
                  <ul className="space-y-1.5 text-slate-400">
                    <li>Tài liệu các khóa đào tạo HVDC của EVNNPT</li>
                    <li>Chuyên đề LCC Thyristor và VSC-MMC (HVDC PLUS)</li>
                    <li>Hồ sơ kỹ thuật Trạm 220kV Thái Nguyên</li>
                    <li>Bài giảng HVDC 2026, Đại học Bách khoa Hà Nội</li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
                <p>© Nghiên cứu HVDC. Phục vụ học tập và nghiên cứu nội bộ.</p>
                <nav aria-label="Liên kết cuối trang" className="flex flex-wrap gap-x-5 gap-y-2">
                  <Link href="/#guide" className="hover:text-white transition">Hướng dẫn sử dụng</Link>
                  <Link href="/#about" className="hover:text-white transition">Giới thiệu tác giả</Link>
                  <a href="mailto:quantrong77@gmail.com" className="hover:text-white transition">Hỗ trợ kỹ thuật</a>
                </nav>
              </div>
            </div>
          </footer>
            </div>
          </div>
          <HvdcAssistant />
        </LearningProvider>
      </body>
    </html>
  );
}
