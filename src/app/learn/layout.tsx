import React from "react";
import LessonSidebar from "@/components/lesson/LessonSidebar";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
      <LessonSidebar />
      {children}
    </div>
  );
}
