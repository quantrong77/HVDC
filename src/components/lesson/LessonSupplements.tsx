import React from "react";
import { ChevronDown, FileText, Info } from "lucide-react";
import { LessonSupplement, SupplementTable } from "@/data/supplements";
import Formula from "@/components/ui/Formula";

function Table({ table }: { table: SupplementTable }) {
  return (
    <figure className="mt-4">
      {table.caption && <figcaption className="text-xs font-medium text-slate-400 mb-2">{table.caption}</figcaption>}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-950">
            <tr>
              {table.columns.map((c) => (
                <th key={c} scope="col" className="text-left font-semibold text-white px-3 py-2 whitespace-nowrap border-b border-slate-800">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-800 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className={`px-3 py-2 align-top ${j === 0 ? "font-medium text-slate-200 whitespace-nowrap" : "text-slate-300"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/** Nội dung bổ sung từ tài liệu tham khảo, mỗi mục thu gọn được (details/summary, không cần JS) */
export default function LessonSupplements({ supplements }: { supplements: LessonSupplement[] }) {
  if (supplements.length === 0) return null;

  return (
    <section className="py-6 border-t border-slate-800 max-w-3xl" aria-labelledby="lesson-supplements">
      <h2 id="lesson-supplements" className="text-lg font-bold text-white">
        Tài liệu bổ sung
      </h2>

      {supplements.map((sup) => (
        <div key={sup.source + sup.lessonId} className="mt-4">
          <p className="flex items-start gap-2 text-sm text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold text-white">{sup.source}</span>, {sup.pages}
              <span className="block text-xs text-slate-400 mt-0.5">{sup.author}</span>
            </span>
          </p>

          <div className="mt-4 space-y-2">
            {sup.sections.map((section, i) => (
              <details key={section.heading} open={i === 0} className="group rounded-xl border border-slate-800 bg-slate-900">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-4 py-3 text-[15px] font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {section.heading}
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4">
                  <ul className="space-y-2.5">
                    {section.points.map((point, k) => (
                      <li key={k} className="flex gap-2.5 text-[15px] text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-2.5" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  {section.formulas && (
                    <div className="mt-4 space-y-2">
                      {section.formulas.map((tex) => (
                        <div key={tex} className="px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
                          <Formula tex={tex} display className="text-amber-100" />
                        </div>
                      ))}
                    </div>
                  )}
                  {section.table && <Table table={section.table} />}
                  {section.note && (
                    <p className="mt-4 flex gap-2 text-sm text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2.5 leading-relaxed">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-semibold">Ghi chú biên soạn: </span>
                        {section.note}
                      </span>
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
