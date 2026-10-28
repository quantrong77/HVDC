import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ALL_LESSONS } from "@/data/curriculum";

/**
 * Store tiến độ học (zustand + persist vào localStorage).
 * skipHydration: dữ liệu chỉ được nạp sau khi mount (LearningProvider gọi rehydrate),
 * nên HTML render ở server và client lần đầu luôn giống nhau.
 */
/** Ghi chú cá nhân hoặc câu hỏi gửi giảng viên, gắn với một bài; chỉ lưu trong trình duyệt của học viên */
export type NoteKind = "note" | "question";

export interface LessonNote {
  id: string;
  lessonId: string;
  kind: NoteKind;
  text: string;
  createdAt: string; // ISO
  updatedAt?: string;
}

export interface LearnerInfo {
  name: string;
  unit: string; // Đơn vị công tác
}

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

interface ProgressState {
  completedLessons: string[];
  quizBestScore: number | null; // Số câu đúng cao nhất
  quizPassed: boolean;
  notes: LessonNote[];
  learner: LearnerInfo;
  isHydrated: boolean;
  isAssistantOpen: boolean;
  assistantPrefill: string;
  toggleLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  recordQuiz: (score: number, passed: boolean) => void;
  resetProgress: () => void;
  addNote: (lessonId: string, kind: NoteKind, text: string) => void;
  updateNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
  setLearner: (patch: Partial<LearnerInfo>) => void;
  openAssistant: (prefill?: string) => void;
  closeAssistant: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      quizBestScore: null,
      quizPassed: false,
      notes: [],
      learner: { name: "", unit: "" },
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
      addNote: (lessonId, kind, text) =>
        set((s) => ({ notes: [...s.notes, { id: newId(), lessonId, kind, text: text.trim(), createdAt: new Date().toISOString() }] })),
      updateNote: (id, text) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, text: text.trim(), updatedAt: new Date().toISOString() } : n)) })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      setLearner: (patch) => set((s) => ({ learner: { ...s.learner, ...patch } })),
      openAssistant: (prefill = "") => set({ isAssistantOpen: true, assistantPrefill: prefill }),
      closeAssistant: () => set({ isAssistantOpen: false }),
    }),
    {
      name: "hvdc-progress-v1", // Giữ khóa cũ để không mất tiến độ đã lưu
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      // Bản lưu cũ chưa có notes, learner: persist trộn nông nên các trường này giữ giá trị mặc định
      partialize: (s) => ({
        completedLessons: s.completedLessons,
        quizBestScore: s.quizBestScore,
        quizPassed: s.quizPassed,
        notes: s.notes,
        learner: s.learner,
      }),
    }
  )
);

/** % hoàn thành: 10 bài học + 1 bài kiểm tra đạt yêu cầu */
export function selectProgressPercent(s: Pick<ProgressState, "completedLessons" | "quizPassed">): number {
  const total = ALL_LESSONS.length + 1;
  const done = s.completedLessons.filter((id) => ALL_LESSONS.some((l) => l.id === id)).length + (s.quizPassed ? 1 : 0);
  return Math.round((done / total) * 100);
}
