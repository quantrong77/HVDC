import type { Metadata } from "next";
import HvdcQuizModule from "@/components/quiz/HvdcQuizModule";

export const metadata: Metadata = {
  title: "Kiểm tra kiến thức | Nghiên Cứu HVDC",
  description: "10 câu trắc nghiệm về LCC, VSC, sóng hài và điều khiển bảo vệ HVDC. Đạt 80% để nhận huy hiệu.",
};

export default function QuizPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Kiểm tra kiến thức HVDC</h1>
        <p className="mt-3 text-slate-300 leading-relaxed">
          10 câu thuộc 4 chủ đề: LCC, VSC, sóng hài và bộ lọc, điều khiển và bảo vệ. Mỗi câu có giải thích ngay sau khi chọn.
          Đúng từ 8 câu để nhận huy hiệu Kỹ sư HVDC.
        </p>
      </header>
      <HvdcQuizModule />
    </div>
  );
}
