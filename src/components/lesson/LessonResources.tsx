import React from "react";
import { ExternalLink, Globe, PlayCircle } from "lucide-react";
import { LessonResource } from "@/data/lesson-resources";

/** Video và trang tham khảo bên ngoài: mở ở tab mới, không nhúng để trang bài học nhẹ và không tải nội dung bên thứ ba */
export default function LessonResources({ resources }: { resources: LessonResource[] }) {
  if (resources.length === 0) return null;
  return (
    <section className="py-6 border-t border-slate-800" aria-labelledby="lesson-resources">
      <h2 id="lesson-resources" className="flex items-center gap-2 text-lg font-bold text-white">
        <PlayCircle className="w-5 h-5 text-cyan-400" />
        Video và liên kết tham khảo
      </h2>
      <p className="mt-1 mb-4 text-sm text-slate-400">Các liên kết do tài liệu khóa học dẫn, mở trong tab mới. Nội dung video thuộc về đơn vị đăng tải.</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resources.map((r) => {
          const Icon = r.kind === "video" ? PlayCircle : Globe;
          return (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 h-full p-4 rounded-xl border border-slate-800 hover:border-cyan-500/60 transition"
              >
                <Icon className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white break-words">
                    {r.title}
                    <ExternalLink className="inline w-3.5 h-3.5 ml-1 text-slate-500 group-hover:text-cyan-400" aria-hidden="true" />
                    <span className="sr-only"> (mở trang mới)</span>
                  </span>
                  <span className="block mt-0.5 text-xs text-slate-500">
                    {r.kind === "video" ? "Video" : "Trang web"} · {r.publisher}
                  </span>
                  <span className="block mt-1.5 text-[13px] text-slate-300 leading-relaxed">{r.why}</span>
                  <span className="block mt-1.5 text-[11px] text-slate-500">Nguồn dẫn: {r.from}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
