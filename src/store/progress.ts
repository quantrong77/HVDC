import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ALL_LESSONS } from "@/data/curriculum";

/**
 * Store tiến độ học (zustand + persist vào localStorage).
 * skipHydration: dữ liệu chỉ được nạp sau khi mount (LearningProvider gọi rehydrate),
 * nên HTML render ở server và client lần đầu luôn giống nhau.
 */
interface ProgressState {
  completedLessons: string[];
  quizBestScore: number | null; // Số câu đúng cao nhất
  quizPassed: boolean;
  isHydrated: boolean;
  isAssistantOpen: boolean;
  assistantPrefill: string;
  toggleLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  recordQuiz: (score: number, passed: boolean) => void;
  resetProgress: () => void;
  openAssistant: (prefill?: string) => void;
  closeAssistant: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      quizBestScore: null,
      quizPassed: false,
      isHydrated: false,
      isAssistantOpen: false,
      assistantPrefill: "",
      toggleLesson: (lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons.filter((id) => id !== lessonId)
            : [...s.completedLessons, lessonId],
        })),
      completeLesson: (lessonId) =>
        set((s) => (s.completedLessons.includes(lessonId) ? s : { completedLessons: [...s.completedLessons, lessonId] })),
      recordQuiz: (score, passed) =>
        set((s) => ({ quizBestScore: Math.max(s.quizBestScore ?? 0, score), quizPassed: s.quizPassed || passed })),
      resetProgress: () => set({ completedLessons: [], quizBestScore: null, quizPassed: false }),
      openAssistant: (prefill = "") => set({ isAssistantOpen: true, assistantPrefill: prefill }),
      closeAssistant: () => set({ isAssistantOpen: false }),
    }),
    {
      name: "hvdc-progress-v1", // Giữ khóa cũ để không mất tiến độ đã lưu
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ completedLessons: s.completedLessons, quizBestScore: s.quizBestScore, quizPassed: s.quizPassed }),
    }
  )
);

/** % hoàn thành: 10 bài học + 1 bài kiểm tra đạt yêu cầu */
export function selectProgressPercent(s: Pick<ProgressState, "completedLessons" | "quizPassed">): number {
  const total = ALL_LESSONS.length + 1;
  const done = s.completedLessons.filter((id) => ALL_LESSONS.some((l) => l.id === id)).length + (s.quizPassed ? 1 : 0);
  return Math.round((done / total) * 100);
}
