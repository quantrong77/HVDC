"use client";

import React from "react";
import Link from "next/link";
import WaveformCanvas from "@/components/simulator/WaveformCanvas";
import SingleLineDiagram from "@/components/simulator/SingleLineDiagram";
import VICharacteristic from "@/components/simulator/VICharacteristic";
import HeroScope from "@/components/simulator/HeroScope";
import CurriculumExplorer from "@/components/curriculum/CurriculumExplorer";
import HvdcQuizModule from "@/components/quiz/HvdcQuizModule";
import { Mail, BookmarkCheck, Check, ArrowRight } from "lucide-react";

function SectionHeading({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <span
        className="block h-1 w-10 rounded-full bg-npt mb-4"
        aria-hidden="true"
      />
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
        {title}
      </h2>
      {meta && (
        <p className="mt-1.5 text-sm font-medium text-cyan-400">{meta}</p>
      )}
      {children && (
        <p className="mt-2 text-slate-400 leading-relaxed">{children}</p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-20 pb-8">
      {/* Hero: tiêu đề màu xanh EVN, máy hiện sóng HMI là điểm nhấn */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px] gap-10 lg:gap-14 items-center">
          <div>
            <p className="flex items-center gap-3 text-sm font-medium text-slate-400">
              <span
                className="h-5 w-1 rounded-full bg-npt"
                aria-hidden="true"
              />
              Chương trình đào tạo HVDC của Tổng công ty Truyền tải điện Quốc
              gia
            </p>
            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-cyan-500 max-w-2xl">
              Truyền tải điện một chiều cao áp, học qua mô phỏng
            </h1>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Bốn cấp độ từ tổng quan đến vận hành trạm. Mỗi bài đi kèm phòng
              lab để thử ngay: cầu Thyristor, đặc tính V-I, điều khiển VSC-HVDC,
              sơ đồ trạm và thiết kế sơ bộ tuyến. Nội dung tổng hợp từ tài liệu các khóa học do
              EVNNPT tổ chức.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold text-sm transition"
              >
                Bắt đầu học
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/simulator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-700 hover:border-cyan-500 text-white font-semibold text-sm transition"
              >
                Mở phòng lab
              </Link>
            </div>

            <p className="mt-8 text-sm text-slate-400">
              Tổng hợp và xây dựng:{" "}
              <span className="font-semibold text-slate-200">
                Hoàng Trọng, PTC3
              </span>
              <span className="mx-2 text-slate-600" aria-hidden="true">
                |
              </span>
              <a
                href="mailto:quantrong77@gmail.com"
                className="text-cyan-400 hover:underline"
              >
                quantrong77@gmail.com
              </a>
            </p>
          </div>

          <HeroScope />
        </div>
      </section>

      <section
        id="curriculum"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <SectionHeading title="Lộ trình đào tạo 4 cấp độ">
          Biên soạn theo khung bài giảng EVNNPT, từ so sánh kinh tế HVAC và HVDC
          đến vận hành trạm biến đổi.
        </SectionHeading>
        <CurriculumExplorer />
      </section>

      <section
        id="simulation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <SectionHeading
          title="Phòng lab dạng sóng và góc kích α"
          meta="Bài 2.1 và 2.3"
        >
          Kéo góc kích và góc trùng dẫn để thấy điện áp DC đổi dấu khi trạm
          chuyển từ chỉnh lưu sang nghịch lưu.
        </SectionHeading>
        <WaveformCanvas />
      </section>

      <section id="vi-curve" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Phối hợp điều khiển chỉnh lưu và nghịch lưu"
          meta="Bài 3.1"
        >
          Điểm làm việc là giao của hai đặc tính. Thử sụt áp lưới AC để thấy
          quyền giữ dòng chuyển từ trạm chỉnh lưu sang trạm nghịch lưu.
        </SectionHeading>
        <VICharacteristic />
      </section>

      <section id="sld" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Sơ đồ đơn tuyến trạm biến đổi và đường dây"
          meta="Bài 1.2 và 1.3"
        >
          Chọn từng thiết bị để xem thông số: nhà van Thyristor, máy biến áp đổi
          nối Y/Y và Y/Δ, cuộn san bằng, bộ lọc.
        </SectionHeading>
        <SingleLineDiagram />
      </section>

      <section id="quiz" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Kiểm tra kiến thức HVDC"
          meta="10 câu, đạt từ 8 câu đúng"
        >
          Câu hỏi về LCC, VSC, sóng hài và điều khiển bảo vệ. Mỗi câu có giải
          thích ngay sau khi chọn.
        </SectionHeading>
        <HvdcQuizModule />
      </section>

      <section id="guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Hướng dẫn sử dụng">
          Bốn bước để khai thác bài giảng và công cụ mô phỏng.
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guide Card 1 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold flex items-center justify-center font-mono text-sm">
                  01
                </span>
                <h3 className="text-base font-bold text-white">
                  Khai Thác Lộ Trình Đào Tạo 4 Cấp Độ
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Chọn thẻ Cấp độ 1 đến 4:</strong> Mỗi cấp độ tương
                    ứng với một chuyên đề chuẩn của EVNNPT (từ cơ sở bối cảnh
                    HVAC vs HVDC đến vận hành trạm thực tế).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Tra cứu tài liệu tham chiếu:</strong> Chú ý mục
                    trích dẫn giáo trình (ví dụ: <em>Tong quan HVDC</em>,{" "}
                    <em>HVDC PLUS Siemens</em>, <em>Trạm 220kV Thái Nguyên</em>
                    ).
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-400">
              Mẹo: Nên học theo tuần tự từ Cấp độ 1 để nắm chắc định nghĩa trước
              khi sang phần điều khiển van.
            </div>
          </div>

          {/* Guide Card 2 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold flex items-center justify-center font-mono text-sm">
                  02
                </span>
                <h3 className="text-base font-bold text-white">
                  Thao Tác Phòng Lab Dạng Sóng Điện Tử Công Suất
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Kéo thanh trượt Góc kích α (0° - 180°):</strong>{" "}
                    Quan sát sự biến đổi tức thời của đường cong Vd(t) và giá
                    trị trung bình Vd = Vd0 · cos(α).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Nhận diện chế độ vận hành:</strong> Khi α &lt; 90°:
                    Chế độ Chỉnh lưu (Vd &gt; 0 màu xanh). Khi α &gt; 90°: Chế
                    độ Nghịch lưu (Vd &lt; 0 màu cam).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>So sánh Cầu 6-Pulse vs 12-Pulse:</strong> Bấm nút
                    chế độ để so sánh tần số gợn sóng (300 Hz vs 600 Hz) và mức
                    độ triệt tiêu sóng hài phía DC.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-amber-400">
              Cảnh báo: Luôn kiểm tra góc dập tắt an toàn γ ≥ 17° ở trạm nghịch
              lưu để tránh mất chuyển mạch.
            </div>
          </div>

          {/* Guide Card 3 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold flex items-center justify-center font-mono text-sm">
                  03
                </span>
                <h3 className="text-base font-bold text-white">
                  Tương Tác Sơ Đồ Đơn Tuyến Trạm Biến Đổi (SLD)
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Nhấp chuột vào thiết bị:</strong> Chọn MBA đổi nối
                    T1/T2, Trạm van Thyristor, Cuộn san bằng L_dc, hoặc Bộ lọc
                    để mở Drawer tra cứu thông số kỹ thuật.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Chuyển đổi 4 Cấu hình truyền tải:</strong> Bấm chọn
                    giữa Song cực (Bipolar), Đơn cực hoàn lưu đất, Đơn cực hoàn
                    lưu dây kim loại, và Lưng đối lưng (Back-to-Back).
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-indigo-400">
              Đường dây hiển thị mũi tên động khi trạng thái truyền tải công
              suất đang kích hoạt (ON).
            </div>
          </div>

          {/* Guide Card 4 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center justify-center font-mono text-sm">
                  04
                </span>
                <h3 className="text-base font-bold text-white">
                  Tra Cứu Thông Số & Hỗ Trợ Đào Tạo Kỹ Thuật
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Học liệu chuẩn hóa:</strong> Dữ liệu và sơ đồ được
                    tổng hợp từ bài giảng các Khóa học chuyên đề về HVDC do Tổng
                    công ty Truyền tải điện Quốc gia (EVNNPT) tổ chức.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Phục vụ đào tạo nội bộ:</strong> Phù hợp hỗ trợ học
                    tập, tra cứu cho kỹ sư điều độ, cán bộ kỹ thuật và nhân viên
                    vận hành trạm 500kV/220kV.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Góp ý & Nâng cấp:</strong> Mọi ý kiến hoàn thiện
                    chức năng và dữ liệu mô phỏng vui lòng liên hệ:{" "}
                    <a
                      href="mailto:quantrong77@gmail.com"
                      className="text-cyan-400 hover:underline"
                    >
                      quantrong77@gmail.com
                    </a>
                    .
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400">
              Hệ thống được tối ưu hóa hiển thị trên cả máy tính để bàn, máy
              tính bảng và màn hình trình chiếu.
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Giới thiệu" />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
              <span
                className="w-14 h-14 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-extrabold text-xl"
                aria-hidden="true"
              >
                HT
              </span>
              <div>
                <h3 className="text-xl font-bold text-white">Hoàng Trọng</h3>
                <p className="text-sm text-slate-400">
                  Công ty Truyền tải điện 3 (PTC3), tổng hợp và phát triển ứng
                  dụng
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-[15px] text-slate-300 leading-relaxed max-w-2xl">
              <p>
                Dự án <strong className="text-white">Nghiên cứu HVDC</strong> do
                Hoàng Trọng (PTC3) tổng hợp tài liệu và xây dựng, sử dụng tài liệu học
                tập từ các khóa đào tạo chuyên đề về công nghệ truyền tải điện
                HVDC do Tổng công ty Truyền tải điện Quốc gia (EVNNPT) tổ chức.
              </p>
              <p>
                Trước yêu cầu của Quy hoạch điện VIII và xu thế giải tỏa công
                suất các cụm nguồn năng lượng tái tạo quy mô lớn, việc làm chủ
                công nghệ HVDC, cả trạm biến đổi LCC lẫn VSC-MMC, ngày càng
                thiết thực với đội ngũ kỹ sư truyền tải điện.
              </p>
              <p>
                Nền tảng là công cụ học tập trực quan: người học tương tác với
                các phương trình điện tử công suất, quan sát dạng sóng và nắm
                nguyên lý chuyển mạch van Thyristor/IGBT đã được giảng dạy trong
                các chương trình đào tạo của EVNNPT.
              </p>
            </div>

            <a
              href="mailto:quantrong77@gmail.com"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold text-sm transition"
            >
              <Mail className="w-4 h-4" />
              Gửi góp ý qua email
            </a>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
            <h3 className="font-bold text-white">Nguồn học liệu</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {[
                "Tài liệu các khóa đào tạo HVDC do EVNNPT tổ chức",
                "Chuyên đề Điện tử công suất và HVDC PLUS (Siemens)",
                "Hồ sơ kỹ thuật Trạm 220kV Thái Nguyên",
                "Bài giảng HVDC EVNNPT 2025",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <BookmarkCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
              Phiên bản 1.0, phục vụ nghiên cứu và học tập nội bộ.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
