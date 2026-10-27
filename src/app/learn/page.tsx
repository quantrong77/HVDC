import { redirect } from "next/navigation";
import { FIRST_LESSON_HREF } from "@/lib/lesson-routes";

export default function LearnIndexPage() {
  redirect(FIRST_LESSON_HREF);
}
