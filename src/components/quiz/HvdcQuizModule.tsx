"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, Check, ChevronRight, FileText, RotateCcw, X } from "lucide-react";
import { HVDC_QUIZ, QUIZ_PASS_RATIO } from "@/data/quiz";
import { useLearning } from "@/components/providers/LearningProvider";
import { QuizQuestion } from "@/types/hvdc";

const TOPIC_LABEL: Record<QuizQuestion["topic"], string> = {
  Fundamentals: "Tổng quan",
  LCC: "LCC",
  VSC: "VSC",
  Filters: "Sóng hài & Bộ lọc",
  Protection: "Điều khiển & Bảo vệ",
};

export default function HvdcQuizModule() {
  const { recordQuiz, quizBestScore, quizPassed, isHydrated } = useLearning();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const reduceMotion = useReducedMotion();

  const question = HVDC_QUIZ[index];
  const selected = answers[question.id];
  const isAnswered = selected !== undefined;
  const total = HVDC_QUIZ.length;

  const score = useMemo(
    () => HVDC_QUIZ.reduce((sum, q) => sum + (answers[q.id] === q.correctIndex ? 1 : 0), 0),
    [answers]
  );
  const passed = score / total >= QUIZ_PASS_RATIO;

  const choose = (optionIndex: number) => {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const next = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      return;
    }
    setFinished(true);
    recordQuiz(score, passed);
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setFinished(false);
  };

  const slide = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Thanh tiến trình theo từng câu */}
      <div className="flex gap-1 p-4 sm:px-6 border-b border-slate-800" aria-hidden="true">
        {HVDC_QUIZ.map((q, i) => {
          const a = answers[q.id];
          const state = a === undefined ? "todo" : a === q.correctIndex ? "right" : "wrong";
          return (
            <span
              key={q.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                state === "right" ? "bg-emerald-400" : state === "wrong" ? "bg-rose-400" : i === index && !finished ? "bg-cyan-400/60" : "bg-slate-800"
              }`}
            />
          );
        })}
      </div>

      <div className="p-4 sm:p-6 min-h-[420px]">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div key={question.id} {...slide} transition={{ duration: 0.2 }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-slate-400">
                <span>
                  Câu <span className="font-mono text-white">{index + 1}</span>/{total} · {TOPIC_LABEL[question.topic]} · Cấp độ {question.level}
                </span>
                {isHydrated && quizBestScore !== null && (
                  <span>
                    Điểm cao nhất: <span className="font-mono text-white">{quizBestScore}/{total}</span>
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-white leading-snug mb-5 max-w-3xl">{question.question}</h3>

              <div className="grid gap-2.5" role="radiogroup" aria-label="Các phương án">
                {question.options.map((option, i) => {
                  const isCorrect = i === question.correctIndex;
                  const isChosen = i === selected;
                  let tone = "border-slate-700 hover:border-cyan-500/60 hover:bg-slate-800/60";
                  if (isAnswered && isCorrect) tone = "border-emerald-500/70 bg-emerald-500/10";
                  else if (isAnswered && isChosen) tone = "border-rose-500/70 bg-rose-500/10";
                  else if (isAnswered) tone = "border-slate-800 opacity-60";
                  return (
                    <button
                      key={i}
                      role="radio"
                      aria-checked={isChosen}
                      disabled={isAnswered}
                      onClick={() => choose(i)}
                      className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-sm text-slate-200 transition ${tone}`}
                    >
                      <span
                        className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-semibold ${
                          isAnswered && isCorrect
                            ? "bg-emerald-500 text-slate-950"
                            : isAnswered && isChosen
                              ? "bg-rose-500 text-slate-950"
                              : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {isAnswered && isCorrect ? <Check className="w-4 h-4" /> : isAnswered && isChosen ? <X className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800" aria-live="polite">
                      <p className={`text-sm font-semibold ${selected === question.correctIndex ? "text-emerald-400" : "text-rose-400"}`}>
                        {selected === question.correctIndex ? "Chính xác." : `Chưa đúng. Đáp án: ${String.fromCharCode(65 + question.correctIndex)}.`}
                      </p>
                      <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{question.explanation}</p>
                      <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {question.evnReference}
                      </p>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={next}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold transition"
                      >
                        {index < total - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="result" {...slide} transition={{ duration: 0.25 }} className="flex flex-col items-center text-center py-6">
              <motion.div
                initial={reduceMotion ? false : { scale: 0.6, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-5 ${
                  passed ? "bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25" : "bg-slate-800 text-slate-400"
                }`}
              >
                <Award className="w-12 h-12" />
              </motion.div>
              <p className="font-mono text-5xl font-bold text-white tabular-nums">
                {score}
                <span className="text-2xl text-slate-500">/{total}</span>
              </p>
              <h3 className="text-lg font-semibold mt-3 text-white">
                {passed ? "Đạt huy hiệu Kỹ sư HVDC" : "Chưa đạt ngưỡng 80%"}
              </h3>
              <p className="text-sm text-slate-400 mt-1.5 max-w-md">
                {passed
                  ? "Huy hiệu đã được lưu vào tiến độ học tập của bạn trên trình duyệt này."
                  : `Cần đúng ít nhất ${Math.ceil(total * QUIZ_PASS_RATIO)} câu. Xem lại các bài có câu sai rồi làm lại.`}
              </p>
              {quizPassed && !passed && <p className="text-xs text-amber-300 mt-2">Bạn vẫn giữ huy hiệu từ lần làm trước.</p>}
              <button
                onClick={restart}
                className="mt-6 flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 hover:border-cyan-500/60 text-sm text-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Làm lại bài kiểm tra
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
