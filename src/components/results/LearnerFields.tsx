"use client";

import React, { useId } from "react";
import { useProgressStore } from "@/store/progress";

/** Họ tên và đơn vị của học viên, in ở đầu file kết quả */
export default function LearnerFields({ compact = false }: { compact?: boolean }) {
  const learner = useProgressStore((s) => s.learner);
  const setLearner = useProgressStore((s) => s.setLearner);
  const nameId = useId();
  const unitId = useId();
  const input =
    "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500";

  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 max-w-2xl"}`}>
      <div>
        <label htmlFor={nameId} className="block text-xs font-medium text-slate-300 mb-1">
          Họ và tên học viên
        </label>
        <input id={nameId} value={learner.name} onChange={(e) => setLearner({ name: e.target.value })} maxLength={80} autoComplete="name" placeholder="Nguyễn Văn A" className={input} />
      </div>
      <div>
        <label htmlFor={unitId} className="block text-xs font-medium text-slate-300 mb-1">
          Đơn vị công tác
        </label>
        <input id={unitId} value={learner.unit} onChange={(e) => setLearner({ unit: e.target.value })} maxLength={120} autoComplete="organization" placeholder="Truyền tải điện …, PTC…" className={input} />
      </div>
    </div>
  );
}
