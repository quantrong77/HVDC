import type { Metadata } from "next";
import ResultsView from "@/components/results/ResultsView";

export const metadata: Metadata = {
  title: "Kết quả học tập | Nghiên Cứu HVDC",
  description: "Lộ trình nghiên cứu, tiến độ, điểm kiểm tra, ghi chú và câu hỏi của học viên; xuất kết quả ra file .docx.",
};

export default function ResultsPage() {
  return <ResultsView />;
}
