import type { Metadata } from "next";
import WaveformCanvas from "@/components/simulator/WaveformCanvas";
import VICharacteristic from "@/components/simulator/VICharacteristic";
import SingleLineDiagram from "@/components/simulator/SingleLineDiagram";

export const metadata: Metadata = {
  title: "Phòng lab mô phỏng | Nghiên Cứu HVDC",
  description: "Ba mô phỏng tương tác: cầu Thyristor LCC, đặc tính V-I và sơ đồ đơn tuyến trạm HVDC.",
};

const LABS = [
  { id: "waveform", title: "Cầu Thyristor LCC: dạng sóng và góc kích", lesson: "Bài 2.1 và 2.3", Component: WaveformCanvas },
  { id: "vi-curve", title: "Đặc tính V-I và điểm làm việc", lesson: "Bài 3.1", Component: VICharacteristic },
  { id: "sld", title: "Sơ đồ đơn tuyến trạm biến đổi", lesson: "Bài 1.2 và 1.3", Component: SingleLineDiagram },
];

export default function SimulatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-14">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Phòng lab mô phỏng HVDC</h1>
        <p className="mt-3 text-slate-300 leading-relaxed">
          Ba công cụ dùng chung với các bài học. Mọi số liệu được tính trực tiếp theo công thức của tài liệu EVNNPT khi bạn kéo thanh trượt.
        </p>
        <nav aria-label="Các phòng lab" className="mt-5 flex flex-wrap gap-2">
          {LABS.map((lab) => (
            <a key={lab.id} href={`#${lab.id}`} className="px-3 py-1.5 rounded-lg text-sm text-slate-300 border border-slate-700 hover:border-cyan-500/60 hover:text-white transition">
              {lab.title}
            </a>
          ))}
        </nav>
      </header>

      {LABS.map(({ id, title, lesson, Component }) => (
        <section key={id} id={id} aria-labelledby={`${id}-title`}>
          <p className="text-xs text-cyan-400 mb-1">{lesson}</p>
          <h2 id={`${id}-title`} className="text-2xl font-bold text-white mb-5">{title}</h2>
          <Component />
        </section>
      ))}
    </div>
  );
}
