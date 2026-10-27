import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonView from "@/components/lesson/LessonView";
import { allLessonParams, findLesson } from "@/lib/lesson-routes";

interface Params {
  params: { level: string; lesson: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return allLessonParams();
}

export function generateMetadata({ params }: Params): Metadata {
  const found = findLesson(params.level, params.lesson);
  if (!found) return {};
  return {
    title: `${found.lesson.title} | Nghiên Cứu HVDC`,
    description: found.lesson.description,
  };
}

export default function LessonPage({ params }: Params) {
  if (!findLesson(params.level, params.lesson)) notFound();
  return <LessonView level={params.level} lesson={params.lesson} />;
}
