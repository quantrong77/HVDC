import { ALL_LESSONS, CURRICULUM_LEVELS } from "@/data/curriculum";

/** "2.1" ↔ "2-1" để dùng trong URL */
export const lessonSlug = (lessonId: string) => lessonId.replace(".", "-");

export const lessonHref = (lessonId: string) => {
  const level = lessonId.split(".")[0];
  return `/learn/${level}/${lessonSlug(lessonId)}`;
};

export const FIRST_LESSON_HREF = lessonHref(ALL_LESSONS[0].id);

export function findLesson(levelParam: string, lessonParam: string) {
  const id = lessonParam.replace("-", ".");
  const index = ALL_LESSONS.findIndex((l) => l.id === id && String(l.level) === levelParam);
  if (index === -1) return null;
  const level = CURRICULUM_LEVELS.find((lv) => lv.level === ALL_LESSONS[index].level)!;
  return {
    lesson: ALL_LESSONS[index],
    level,
    prev: index > 0 ? ALL_LESSONS[index - 1] : null,
    next: index < ALL_LESSONS.length - 1 ? ALL_LESSONS[index + 1] : null,
    position: index + 1,
    total: ALL_LESSONS.length,
  };
}

export const allLessonParams = () =>
  ALL_LESSONS.map((l) => ({ level: String(l.level), lesson: lessonSlug(l.id) }));
