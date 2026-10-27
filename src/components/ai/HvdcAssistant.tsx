"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, FileText, Loader2, Send, Sparkles, X } from "lucide-react";
import { useLearning } from "@/components/providers/LearningProvider";
import { KnowledgeHit, searchKnowledge } from "@/lib/knowledge-search";

interface ChatTurn {
  id: number;
  question: string;
  status: "loading" | "done";
  mode?: "claude" | "local";
  answer?: string; // Câu trả lời tổng hợp của Claude
  hits: Pick<KnowledgeHit, "text" | "source">[]; // Trích đoạn học liệu dùng làm nguồn
  notice?: string;
}

type ChatResponse =
  | { mode: "claude"; answer: string; sources: { text: string; source: string }[] }
  | { mode: "local"; hits: KnowledgeHit[]; notice?: string };

/** Lịch sử gửi lên server: câu hỏi và nội dung đã trả lời của các lượt trước */
function toHistory(turns: ChatTurn[]) {
  return turns
    .filter((t) => t.status === "done")
    .flatMap((t) => [
      { role: "user" as const, content: t.question },
      { role: "assistant" as const, content: t.answer ?? (t.hits.map((h) => h.text).join(" ") || "Không tìm thấy trong học liệu.") },
    ]);
}

const SUGGESTIONS = [
  "Góc dập γ là gì?",
  "Vì sao cầu 12 xung khử được sóng hài bậc 5, 7?",
  "VSC khác LCC ở điểm nào?",
  "Biên dòng ΔI dùng để làm gì?",
];

export default function HvdcAssistant() {
  const { isAssistantOpen, closeAssistant, assistantPrefill } = useLearning();
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isAssistantOpen) return;
    setInput(assistantPrefill);
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAssistant();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [isAssistantOpen, assistantPrefill, closeAssistant]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [turns, reduceMotion]);

  const isBusy = turns.some((t) => t.status === "loading");

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || isBusy) return;
    const id = Date.now();
    const history = toHistory(turns);
    setTurns((prev) => [...prev, { id, question: q, status: "loading", hits: [] }]);
    setInput("");

    let update: Partial<ChatTurn>;
    try {
      // Bản tĩnh (GitHub Pages) không có server: tra cứu ngay trên trình duyệt
      if (process.env.NEXT_PUBLIC_ASSISTANT_API === "off") throw new Error("static");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ChatResponse;
      update =
        data.mode === "claude"
          ? { mode: "claude", answer: data.answer, hits: data.sources.slice(0, 4) }
          : { mode: "local", hits: data.hits, notice: data.notice };
    } catch {
      // Không gọi được server (ví dụ bản tĩnh): tra cứu ngay trên trình duyệt
      update = { mode: "local", hits: searchKnowledge(q) };
    }
    setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, ...update, status: "done" } : t)));
  };

  return (
    <AnimatePresence>
      {isAssistantOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAssistant}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Trợ lý HVDC"
            className="fixed right-0 top-0 z-[61] h-full w-full sm:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-300 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Trợ lý HVDC</p>
                  <p className="text-[11px] text-slate-400">Trả lời từ học liệu EVNNPT có trong ứng dụng</p>
                </div>
              </div>
              <button
                onClick={closeAssistant}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                aria-label="Đóng trợ lý"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {turns.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Hỏi về khái niệm, thiết bị hay công thức HVDC. Trợ lý tìm đoạn liên quan trong bài giảng, thông số thiết bị và lời giải trắc nghiệm, kèm nguồn tham chiếu.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => ask(s)}
                        className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:border-cyan-500/60 hover:text-cyan-200 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {turns.map((turn) => (
                <div key={turn.id} className="space-y-2">
                  <p className="ml-auto max-w-[85%] w-fit text-sm bg-cyan-500/15 text-cyan-100 rounded-2xl rounded-br-md px-3.5 py-2">
                    {turn.question}
                  </p>
                  {turn.status === "loading" ? (
                    <p className="flex items-center gap-2 text-sm text-slate-400 px-1" aria-live="polite">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      Đang tìm trong học liệu và soạn câu trả lời…
                    </p>
                  ) : turn.mode === "claude" && turn.answer ? (
                    <div className="space-y-2">
                      <div className="text-sm text-slate-100 bg-slate-950/60 rounded-2xl rounded-bl-md px-3.5 py-3 border border-cyan-500/20">
                        <p className="text-[11px] text-cyan-400 flex items-center gap-1 mb-1.5">
                          <Sparkles className="w-3 h-3" />
                          Claude tổng hợp từ học liệu
                        </p>
                        <p className="leading-relaxed whitespace-pre-line">{turn.answer}</p>
                      </div>
                      {turn.hits.length > 0 && (
                        <details className="text-[11px] text-slate-500 px-1">
                          <summary className="cursor-pointer hover:text-slate-300">Nguồn trích dẫn ({turn.hits.length})</summary>
                          <ol className="mt-1.5 space-y-1 list-decimal pl-5">
                            {turn.hits.map((hit, i) => (
                              <li key={i}>{hit.source}</li>
                            ))}
                          </ol>
                        </details>
                      )}
                    </div>
                  ) : turn.hits.length === 0 ? (
                    <p className="text-sm text-slate-400 bg-slate-950/60 rounded-2xl rounded-bl-md px-3.5 py-2.5 border border-slate-800">
                      Không tìm thấy đoạn nào khớp trong học liệu. Thử dùng thuật ngữ cụ thể hơn, ví dụ “thất bại chuyển mạch”, “MMC”, “bộ lọc AC”.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {turn.notice && <p className="text-[11px] text-amber-300/90 px-1">{turn.notice} Hiển thị kết quả tra cứu học liệu.</p>}
                      {turn.hits.map((hit, i) => (
                        <div key={i} className="text-sm text-slate-200 bg-slate-950/60 rounded-2xl rounded-bl-md px-3.5 py-2.5 border border-slate-800">
                          <p className="leading-relaxed">{hit.text}</p>
                          <p className="mt-1.5 text-[11px] text-slate-500 flex items-start gap-1">
                            <FileText className="w-3 h-3 mt-0.5 shrink-0" />
                            {hit.source}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              className="p-4 border-t border-slate-800 flex gap-2 shrink-0"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi về HVDC…"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isBusy}
                className="px-3.5 rounded-xl bg-cyan-500 text-slate-950 disabled:opacity-40 hover:bg-cyan-400 transition"
                aria-label="Gửi câu hỏi"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
