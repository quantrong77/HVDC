import React from "react";

/** Mục lục các bài nằm trong sidebar chung (AppSidebar), tự mở khi vào /learn */
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10 flex">{children}</div>;
}
