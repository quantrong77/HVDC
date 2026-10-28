"use client";

import React, { useEffect, useId, useState } from "react";
import Link from "next/link";
import { HelpCircle, MessageSquare, Pencil, StickyNote, Trash2 } from "lucide-react";
import { LessonNote, NoteKind, useProgressStore } from "@/store/progress";
import { formatDateTime } from "@/lib/learning-report";
import ExportReportButton from "@/components/results/ExportReportButton";
import LearnerFields from "@/components/results/LearnerFields";

const MAX_LEN = 2000;

const KIND: Record<NoteKind, { label: string; icon: typeof StickyNote; tone: string; placeholder: string }> = {
  note: { label: "Ghi chú", icon: StickyNote, tone: "text-cyan-400", placeholder: "Điều bạn rút ra, công thức cần nhớ, liên hệ với trạm đang vận hành…" },
  question: { label: "Câu hỏi cho giảng viên", icon: HelpCircle, tone: "text-amber-400", placeholder: "Điểm bạn chưa rõ và muốn giảng viên giải đáp…" },
};

/** Một ghi chú hoặc câu hỏi: sửa tại chỗ, xóa có xác nhận */
export function NoteItem({ note }: { note: LessonNote }) {
  const updateNote = useProgressStore((s) => s.updateNote);
  const deleteNote = useProgressStore((s) => s.deleteNote);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.text);
  const [confirming, setConfirming] = useState(false);
  const kind = KIND[note.kind];
  const Icon = kind.icon;

  return (
    <li className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
        <span className={`flex items-center gap-1.5 font-medium ${kind.tone}`}>
          <Icon className="w-3.5 h-3.5" />
          {kind.label}
        </span>
        <span>
          {formatDateTime(new Date(note.updatedAt ?? note.createdAt))}
          {note.updatedAt ? " (đã sửa)" : ""}
        </span>
      </div>

      {editing ? (
        <div className="mt-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={MAX_LEN}
            rows={3}
            aria-label={`Sửa ${kind.label.toLowerCase()}`}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={!draft.trim()}
              onClick={() => {
                updateNote(note.id, draft);
                setEditing(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(note.text);
                setEditing(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-800 hover:bg-slate-700"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-1.5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap break-words">{note.text}</p>
      )}

      {!editing && (
        <div className="mt-2 flex items-center gap-1">
          <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800">
            <Pencil className="w-3.5 h-3.5" /> Sửa
          </button>
          {confirming ? (
            <span className="inline-flex items-center gap-1 text-xs">
              <span className="text-slate-400 ml-1">Xóa mục này?</span>
              <button type="button" onClick={() => deleteNote(note.id)} className="px-2 py-1 rounded-md text-rose-400 hover:bg-rose-500/10 font-semibold">
                Xóa
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="px-2 py-1 rounded-md text-slate-400 hover:bg-slate-800">
                Không
              </button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800">
              <Trash2 className="w-3.5 h-3.5" /> Xóa
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/** Ghi chú và câu hỏi của học viên cho một bài, lưu trong trình duyệt; xuất ra .docx để nộp giảng viên */
export default function LessonNotes({ lessonId }: { lessonId: string }) {
  const notes = useProgressStore((s) => s.notes);
  const addNote = useProgressStore((s) => s.addNote);
  const isHydrated = useProgressStore((s) => s.isHydrated);
  const [kind, setKind] = useState<NoteKind>("note");
  const [text, setText] = useState("");
  const textId = useId();
  // Chỉ quyết định một lần sau khi nạp dữ liệu: nếu chưa có tên thì hiện ô nhập, và giữ ô đó trong lúc gõ
  const [askLearner, setAskLearner] = useState(false);
  useEffect(() => {
    if (isHydrated && !useProgressStore.getState().learner.name.trim()) setAskLearner(true);
  }, [isHydrated]);
  const mine = isHydrated ? notes.filter((n) => n.lessonId === lessonId) : [];

  const submit = () => {
    if (!text.trim()) return;
    addNote(lessonId, kind, text);
    setText("");
  };

  return (
    <section className="py-6 border-t border-slate-800 max-w-3xl" aria-labelledby="lesson-notes">
      <h2 id="lesson-notes" className="flex items-center gap-2 text-lg font-bold text-white">
        <MessageSquare className="w-5 h-5 text-cyan-400" />
        Ghi chú và câu hỏi của bạn
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Chỉ lưu trên trình duyệt của máy này, không gửi đi đâu. Xuất file .docx để nộp cho giảng viên.
      </p>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Loại nội dung">
          {(Object.keys(KIND) as NoteKind[]).map((k) => {
            const Icon = KIND[k].icon;
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={kind === k}
                onClick={() => setKind(k)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  kind === k ? "border-cyan-500 bg-cyan-500/10 text-white" : "border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${KIND[k].tone}`} />
                {KIND[k].label}
              </button>
            );
          })}
        </div>
        <label htmlFor={textId} className="sr-only">
          {KIND[kind].label}
        </label>
        <textarea
          id={textId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              submit();
            }
          }}
          maxLength={MAX_LEN}
          rows={3}
          placeholder={KIND[kind].placeholder}
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500">
            {text.length}/{MAX_LEN} ký tự · Ctrl + Enter để lưu
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={!text.trim()}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition"
          >
            Lưu {KIND[kind].label.toLowerCase()}
          </button>
        </div>
      </div>

      {mine.length > 0 && (
        <ul className="mt-4 space-y-2" aria-label="Các ghi chú và câu hỏi đã lưu">
          {mine.map((n) => (
            <NoteItem key={n.id} note={n} />
          ))}
        </ul>
      )}

      <div className="mt-5 rounded-xl border border-slate-800 p-4 space-y-3">
        <p className="text-sm font-semibold text-white">Xuất kết quả bài học</p>
        {askLearner && <LearnerFields compact />}
        <div className="flex flex-wrap items-start gap-3">
          <ExportReportButton lessonId={lessonId} />
          <Link href="/ket-qua" className="px-4 py-2.5 rounded-xl text-sm text-slate-200 border border-slate-700 hover:border-cyan-500/60 transition">
            Xem kết quả toàn khóa
          </Link>
        </div>
      </div>
    </section>
  );
}
