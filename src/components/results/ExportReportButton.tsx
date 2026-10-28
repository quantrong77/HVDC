"use client";

import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { useProgressStore } from "@/store/progress";
import { buildReportModel } from "@/lib/learning-report";

/** Nút xuất kết quả học tập ra .docx; thư viện docx chỉ được tải khi bấm */
export default function ExportReportButton({ lessonId, label, className = "" }: { lessonId?: string; label?: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onExport = async () => {
    setBusy(true);
    setError("");
    try {
      const s = useProgressStore.getState();
      const model = buildReportModel({
        learner: s.learner,
        completedLessons: s.completedLessons,
        quizBestScore: s.quizBestScore,
        quizPassed: s.quizPassed,
        notes: s.notes,
        lessonId,
        exportedAt: new Date(),
      });
      const { downloadReport } = await import("@/lib/report-docx");
      await downloadReport(model);
    } catch {
      setError("Không tạo được file. Hãy thử lại hoặc dùng trình duyệt khác.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={onExport}
        disabled={busy}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-60 transition ${className}`}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
        {label ?? (lessonId ? "Xuất kết quả bài này (.docx)" : "Xuất kết quả học tập (.docx)")}
      </button>
      {error && (
        <span role="alert" className="text-xs text-rose-400">
          {error}
        </span>
      )}
    </span>
  );
}
