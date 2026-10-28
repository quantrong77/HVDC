import { CURRICULUM_LEVELS } from "@/data/curriculum";
import { lessonHref } from "@/lib/lesson-routes";

/**
 * Lộ trình nghiên cứu: mỗi cấp độ là một giai đoạn, cuối cùng là bài kiểm tra.
 * Node của giai đoạn dẫn tới bài chưa học đầu tiên trong giai đoạn đó (học xong hết thì về bài đầu).
 */

export type StageStatus = "done" | "next" | "partial" | "todo";

export interface RoadmapStage {
  id: string;
  short: string; // Nhãn ngắn trong node
  title: string;
  href: string;
  done: number;
  total: number;
  status: StageStatus;
  level?: number;
}

export function buildRoadmap(completedLessons: string[], quizPassed: boolean): RoadmapStage[] {
  const stages: Omit<RoadmapStage, "status">[] = CURRICULUM_LEVELS.map((level) => {
    const ids = level.topics.map((t) => t.id);
    const firstTodo = ids.find((id) => !completedLessons.includes(id));
    return {
      id: `level-${level.level}`,
      short: String(level.level),
      title: `Cấp độ ${level.level}: ${level.title.replace(/^Cấp độ \d+: /, "")}`,
      href: lessonHref(firstTodo ?? ids[0]),
      done: ids.filter((id) => completedLessons.includes(id)).length,
      total: ids.length,
      level: level.level,
    };
  });
  stages.push({ id: "quiz", short: "KT", title: "Bài kiểm tra cuối khóa", href: "/quiz", done: quizPassed ? 1 : 0, total: 1 });

  // Giai đoạn chưa xong đầu tiên là giai đoạn nên học tiếp
  const nextIndex = stages.findIndex((s) => s.done < s.total);
  return stages.map((s, i) => ({
    ...s,
    status: s.done === s.total ? "done" : i === nextIndex ? "next" : s.done > 0 ? "partial" : "todo",
  }));
}
