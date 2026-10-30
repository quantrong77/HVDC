import React from "react";
import type { Metadata } from "next";
import WaveformCanvas from "@/components/simulator/WaveformCanvas";
import VICharacteristic from "@/components/simulator/VICharacteristic";
import SingleLineDiagram from "@/components/simulator/SingleLineDiagram";
import VscHvdcLab from "@/components/simulator/VscHvdcLab";
import HvdcPlanner from "@/components/simulator/HvdcPlanner";
import FiringAngleLab from "@/components/simulator/FiringAngleLab";
import LccOpsLab from "@/components/simulator/LccOpsLab";
import LabGuidePanel from "@/components/simulator/LabGuidePanel";
import { LabId } from "@/data/lab-guides";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Phòng lab mô phỏng | Nghiên Cứu HVDC",
  description: "Mô phỏng tương tác: góc kích và điều chế, cầu Thyristor LCC, đặc tính V-I, vận hành liên kết LCC hai trạm, điều khiển VSC-HVDC, sơ đồ đơn tuyến trạm và công cụ thiết kế sơ bộ tuyến HVDC.",
};

const FiringLabWithAnchors = () => <FiringAngleLab anchors />;

const LABS: { id: LabId; title: string; lesson: string; Component: React.ComponentType }[] = [
  { id: "firing", title: "Góc kích, trùng dẫn và điều chế", lesson: "Cấp độ 0, bài 0.2 đến 0.8", Component: FiringLabWithAnchors },
  { id: "waveform", title: "Cầu Thyristor LCC: dạng sóng và góc kích", lesson: "Bài 2.1 và 2.3", Component: WaveformCanvas },
  { id: "vi-curve", title: "Đặc tính V-I và điểm làm việc", lesson: "Bài 3.1", Component: VICharacteristic },
  { id: "ops", title: "Vận hành liên kết LCC A ↔ B", lesson: "Bài 3.1, 4.1, 4.2 và 4.3", Component: LccOpsLab },
  { id: "vsc", title: "Điều khiển VSC-HVDC: P, Q và điện áp DC", lesson: "Bài 2.2 và 3.1", Component: VscHvdcLab },
  { id: "sld", title: "Sơ đồ đơn tuyến trạm biến đổi", lesson: "Bài 1.2 và 1.3", Component: SingleLineDiagram },
  { id: "planner", title: "Thiết kế sơ bộ tuyến HVDC", lesson: "Bài 1.1, 1.2 và 2.2", Component: HvdcPlanner },
];

// Công cụ bên ngoài đã tham khảo khi xây dựng các phòng lab
const EXTERNAL = [
  {
    href: "https://au.mathworks.com/help/simscape-electrical/ug/voltage-source-converter-hvdc.html",
    title: "MathWorks Simscape: VSC-HVDC",
    body: "Ví dụ mô hình VSC-HVDC hai đầu trong Simulink, cùng kịch bản đổi P, Q và giữ Vdc như phòng lab ở trên.",
  },
  {
    href: "https://www.gevernova.com/electrification/interactive-product-explorers/hvdc-explorer",
    title: "GE Vernova HVDC Explorer",
    body: "Trang giới thiệu tương tác hệ thống và thiết bị HVDC của nhà sản xuất, đối chiếu với sơ đồ đơn tuyến trạm.",
  },
  {
    href: "https://unitvectorsolutions.com/hvdc-studio/",
    title: "Unit Vector Solutions HVDC Studio",
    body: "Trang giới thiệu phần mềm HVDC Studio của Unit Vector Solutions, tham khảo cho công cụ thiết kế sơ bộ ở trên.",
  },
];

export default function SimulatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-14">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Phòng lab mô phỏng HVDC</h1>
        <p className="mt-3 text-slate-300 leading-relaxed">
          Bảy công cụ dùng chung với các bài học. Mọi số liệu được tính trực tiếp theo công thức và bảng tra trong tài liệu đào tạo khi bạn kéo thanh trượt.
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
          <LabGuidePanel id={id} />
        </section>
      ))}

      <section aria-labelledby="external-title" className="max-w-5xl">
        <h2 id="external-title" className="text-xl font-bold text-white mb-4">Công cụ tham khảo bên ngoài</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EXTERNAL.map((x) => (
            <li key={x.href}>
              <a
                href={x.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-cyan-500/60 transition"
              >
                <span className="flex items-center gap-1.5 font-semibold text-white text-sm">
                  {x.title}
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span className="sr-only">(mở trang mới)</span>
                </span>
                <span className="block mt-1.5 text-xs text-slate-400 leading-relaxed">{x.body}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
