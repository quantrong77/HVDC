"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import RangeSlider from "@/components/ui/RangeSlider";
import { HVDC_EQUIPMENT_DATABASE } from "@/data/equipment";
import { HvdcEquipment, SystemTopology } from "@/types/hvdc";
import {
  Layers,
  Zap,
  X,
  SlidersHorizontal,
  Compass,
} from "lucide-react";

export default function SingleLineDiagram() {
  const [selectedEquipment, setSelectedEquipment] = useState<HvdcEquipment | null>(
    HVDC_EQUIPMENT_DATABASE[1] // Default: Valve Hall Rectifier
  );
  const [topology, setTopology] = useState<SystemTopology>("bipolar");
  const [isPowerFlowing, setIsPowerFlowing] = useState<boolean>(true);
  const [powerFlowMW, setPowerFlowMW] = useState<number>(2000); // 2000 MW
  const reduceMotion = useReducedMotion();
  const isB2B = topology === "back-to-back";
  // Tốc độ chạy của vạch dòng điện tỉ lệ với công suất truyền tải
  const flowStyle = { "--flow-speed": `${(1.6 - (powerFlowMW / 3000) * 1.2).toFixed(2)}s` } as React.CSSProperties;

  useEffect(() => {
    if (!selectedEquipment) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedEquipment(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedEquipment]);

  /** Thuộc tính chung cho khối thiết bị: nhấp chuột hoặc Enter/Space để chọn */
  const selectable = (id: string, label: string) => ({
    onClick: () => setSelectedEquipment(getEquipment(id)),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectedEquipment(getEquipment(id));
      }
    },
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    "aria-pressed": selectedEquipment?.id === id,
    className: "cursor-pointer group focus:outline-none [&:focus-visible>*:first-child]:stroke-cyan-300",
  });

  const getEquipment = (id: string): HvdcEquipment => {
    return (
      HVDC_EQUIPMENT_DATABASE.find((item) => item.id === id) ||
      HVDC_EQUIPMENT_DATABASE[0]
    );
  };

  return (
    <div className="theme-dark bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">
              Sơ đồ đơn tuyến trạm biến đổi HVDC
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Khảo sát cấu trúc trạm biến đổi hai cực (Bipolar), đơn cực (Monopolar) & liên kết Back-to-Back
          </p>
        </div>

        {/* Topology Selector & Power Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTopology("bipolar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                topology === "bipolar"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Song cực (Bipolar)
            </button>
            <button
              onClick={() => setTopology("monopolar-ground")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                topology === "monopolar-ground"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Đơn cực (Đất)
            </button>
            <button
              onClick={() => setTopology("monopolar-metallic")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                topology === "monopolar-metallic"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Đơn cực (Kim loại)
            </button>
            <button
              onClick={() => setTopology("back-to-back")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                topology === "back-to-back"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Lưng đối Lưng (BtB)
            </button>
          </div>

          <button
            onClick={() => setIsPowerFlowing(!isPowerFlowing)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition ${
              isPowerFlowing
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isPowerFlowing ? "text-emerald-400 animate-bounce" : ""}`} />
            {isPowerFlowing ? "Đang truyền tải: ON" : "Dừng truyền tải: OFF"}
          </button>
        </div>
      </div>

      {/* Main Single Line Diagram Canvas (SVG Interactive) */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-6 relative overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Status Bar inside Diagram */}
          <div className="flex justify-between items-center mb-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Trạm Chỉnh lưu (Rectifier Station A): 500kV AC</span>
              </span>
              <span className="text-slate-600">➔</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Trạm Nghịch lưu (Inverter Station B): 220kV AC</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Công suất truyền tải:</span>
              <span className="text-cyan-400 font-bold">{isPowerFlowing ? `${powerFlowMW} MW` : "0 MW"}</span>
            </div>
          </div>

          {/* SVG Architecture Diagram */}
          <svg viewBox="0 0 1000 320" className="w-full h-auto select-none">
            <defs>
              {/* Gradient for DC Line */}
              <linearGradient id="dcLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>

              {/* Pulsing glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Background Grid Lines */}
            <line x1="40" y1="160" x2="960" y2="160" stroke="#1E2F57" strokeDasharray="4 4" />

            {/* AC GRID 1 (Left) */}
            <g>
              <circle cx="60" cy="160" r="32" fill="#102041" stroke="#38bdf8" strokeWidth="2" />
              <text x="60" y="155" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">AC Lưới 1</text>
              <text x="60" y="172" fill="#8E9DBE" fontSize="10" textAnchor="middle">500kV AC</text>
            </g>

            {/* AC Bus Line 1 */}
            <line x1="92" y1="160" x2="140" y2="160" stroke="#38bdf8" strokeWidth="3" />

            {/* AC Filter 1 (Shunt) */}
            <g
              {...selectable("ac-filter-bank", "Bộ lọc AC và tụ bù")}
            >
              <line x1="140" y1="160" x2="140" y2="240" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
              <rect
                x="110"
                y="240"
                width="60"
                height="45"
                rx="8"
                fill={selectedEquipment?.id === "ac-filter-bank" ? "#0369a1" : "#102041"}
                stroke="#0284c7"
                strokeWidth="2"
                className="transition-colors group-hover:stroke-cyan-400"
              />
              <text x="140" y="260" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">Lọc AC</text>
              <text x="140" y="275" fill="#7dd3fc" fontSize="9" textAnchor="middle">& Tụ Bù Q</text>
            </g>

            {/* Converter Trafo 1 */}
            <g
              {...selectable("converter-trafo-1", "Máy biến áp đổi nối T1")}
            >
              <circle
                cx="190"
                cy="160"
                r="26"
                fill={selectedEquipment?.id === "converter-trafo-1" ? "#1E2F57" : "#102041"}
                stroke="#06b6d4"
                strokeWidth="2.5"
                className="group-hover:stroke-cyan-300 transition"
              />
              <circle
                cx="225"
                cy="160"
                r="26"
                fill={selectedEquipment?.id === "converter-trafo-1" ? "#1E2F57" : "#102041"}
                stroke="#06b6d4"
                strokeWidth="2.5"
                className="group-hover:stroke-cyan-300 transition"
              />
              <text x="207" y="164" fill="#a5f3fc" fontSize="11" fontWeight="bold" textAnchor="middle">T1 (Y/Y, Y/Δ)</text>
              <text x="207" y="205" fill="#8E9DBE" fontSize="10" textAnchor="middle">MBA đổi nối 1</text>
            </g>

            <line x1="251" y1="160" x2="280" y2="160" stroke="#06b6d4" strokeWidth="3" />

            {/* Valve Hall Rectifier */}
            <g
              {...selectable("valve-hall-rectifier", "Nhà van chỉnh lưu")}
            >
              <rect
                x="280"
                y="115"
                width="95"
                height="90"
                rx="10"
                fill={selectedEquipment?.id === "valve-hall-rectifier" ? "#083344" : "#102041"}
                stroke={selectedEquipment?.id === "valve-hall-rectifier" ? "#22d3ee" : "#0e7490"}
                strokeWidth="2.5"
                filter={selectedEquipment?.id === "valve-hall-rectifier" ? "url(#glow)" : undefined}
                className="group-hover:stroke-cyan-300 transition"
              />
              {/* Thyristor Icon in Rectifier */}
              <polygon points="315,145 340,160 315,175" fill="#22d3ee" />
              <line x1="340" y1="140" x2="340" y2="180" stroke="#22d3ee" strokeWidth="2.5" />
              <text x="327" y="132" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">CHỈNH LƯU</text>
              <text x="327" y="196" fill="#a5f3fc" fontSize="9" textAnchor="middle">Cầu 12 xung</text>
            </g>

            {/* Positive Pole DC Line */}
            <line x1="375" y1="135" x2="425" y2="135" stroke="#ef4444" strokeWidth="3" />

            {/* Smoothing Reactor 1 (Positive) */}
            <g
              {...selectable("smoothing-reactor-1", "Cuộn san bằng L_dc1")}
            >
              <rect
                x="425"
                y="118"
                width="65"
                height="34"
                rx="6"
                fill={selectedEquipment?.id === "smoothing-reactor-1" ? "#312e81" : "#102041"}
                stroke="#6366f1"
                strokeWidth="2"
                className="group-hover:stroke-indigo-300 transition"
              />
              <text x="457" y="139" fill="#c7d2fe" fontSize="10" fontWeight="bold" textAnchor="middle">L_dc1 (+)</text>
              <text x="457" y="108" fill="#8E9DBE" fontSize="9" textAnchor="middle">Cuộn san bằng</text>
            </g>

            {/* DC Filter Branch (không có ở trạm Back-to-Back vì không có đường dây) */}
            {!isB2B && (
            <g
              {...selectable("dc-filter", "Bộ lọc DC")}
            >
              <line x1="510" y1="135" x2="510" y2="190" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect
                x="485"
                y="190"
                width="50"
                height="35"
                rx="6"
                fill={selectedEquipment?.id === "dc-filter" ? "#1e1b4b" : "#102041"}
                stroke="#818cf8"
                strokeWidth="1.5"
                className="group-hover:stroke-indigo-300 transition"
              />
              <text x="510" y="212" fill="#c7d2fe" fontSize="9" fontWeight="bold" textAnchor="middle">Lọc DC</text>
            </g>
            )}

            {/* Back-to-Back: chỉnh lưu và nghịch lưu nằm trong cùng một trạm */}
            {isB2B && (
              <g pointerEvents="none">
                <rect x="268" y="88" width="564" height="150" rx="14" fill="#f59e0b" fillOpacity="0.03" stroke="#8E9DBE" strokeDasharray="6 5" />
                <text x="550" y="230" fill="#8E9DBE" fontSize="10" textAnchor="middle">
                  Một trạm Back-to-Back: không có đường dây, liên kết hai lưới AC không đồng bộ
                </text>
              </g>
            )}

            {/* MAIN TRANSMISSION LINE (Middle) */}
            <g
              {...selectable("dc-transmission-line", "Đường dây DC")}
            >
              {/* Positive Pole Line */}
              <line
                x1="490"
                y1="135"
                x2="630"
                y2="135"
                stroke={isB2B ? "#66779C" : "#ef4444"}
                strokeWidth="4"
                className="group-hover:stroke-rose-400 transition"
              />
              <text x="560" y="125" fill={isB2B ? "#B6C3DD" : "#fca5a5"} fontSize="10" fontWeight="bold" textAnchor="middle">
                {isB2B ? "Thanh cái DC nội trạm" : "+500kV Pole 1"}
              </text>

              {/* Negative Pole Line (Active only in Bipolar mode) */}
              {topology === "bipolar" && (
                <>
                  <line
                    x1="490"
                    y1="185"
                    x2="630"
                    y2="185"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    className="group-hover:stroke-blue-400 transition"
                  />
                  <text x="560" y="200" fill="#93c5fd" fontSize="10" fontWeight="bold" textAnchor="middle">
                    -500kV Pole 2
                  </text>
                </>
              )}

              {/* Ground / Metallic Return path */}
              {(topology === "monopolar-ground" || topology === "monopolar-metallic") && (
                <>
                  <line
                    x1="490"
                    y1="185"
                    x2="630"
                    y2="185"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                  />
                  <text x="560" y="200" fill="#6ee7b7" fontSize="10" textAnchor="middle">
                    {topology === "monopolar-ground" ? "Hoàn lưu qua Đất/Biển" : "Dây về kim loại (Metallic)"}
                  </text>
                </>
              )}

              {/* Dòng điện chạy dọc đường dây: cực dương từ chỉnh lưu sang nghịch lưu, dòng hồi lưu chạy ngược lại */}
              {isPowerFlowing && (
                <g style={flowStyle} pointerEvents="none">
                  {/* Chỉ chạy trên đoạn dây dẫn, không đè lên khối cuộn kháng */}
                  <path d="M375 135 H425 M490 135 H630 M695 135 H725" stroke="#fecdd3" strokeWidth="2" className="flow-line" />
                  {topology === "bipolar" && (
                    <line x1="490" y1="185" x2="630" y2="185" stroke="#dbeafe" strokeWidth="2" className="flow-line-reverse" />
                  )}
                  {(topology === "monopolar-ground" || topology === "monopolar-metallic") && (
                    <line x1="490" y1="185" x2="630" y2="185" stroke="#d1fae5" strokeWidth="1.5" className="flow-line-reverse" />
                  )}
                  {reduceMotion && (
                    <polygon points="585,129 597,135 585,141" fill="#fecdd3" />
                  )}
                </g>
              )}

              {/* Transmission Line Badge */}
              <rect
                x="520"
                y="145"
                width="80"
                height="24"
                rx="6"
                fill="#102041"
                stroke="#485A82"
                strokeWidth="1"
              />
              <text x="560" y="161" fill="#B6C3DD" fontSize="9" fontWeight="bold" textAnchor="middle">
                {isB2B ? "Back-to-Back (0 km)" : "Đường dây 800 km"}
              </text>
            </g>

            {/* Smoothing Reactor 2 (Inverter side) */}
            <g
              {...selectable("smoothing-reactor-2", "Cuộn san bằng L_dc2")}
            >
              <rect
                x="630"
                y="118"
                width="65"
                height="34"
                rx="6"
                fill={selectedEquipment?.id === "smoothing-reactor-2" ? "#312e81" : "#102041"}
                stroke="#6366f1"
                strokeWidth="2"
                className="group-hover:stroke-indigo-300 transition"
              />
              <text x="662" y="139" fill="#c7d2fe" fontSize="10" fontWeight="bold" textAnchor="middle">L_dc2</text>
              <text x="662" y="108" fill="#8E9DBE" fontSize="9" textAnchor="middle">Cuộn san bằng</text>
            </g>

            <line x1="695" y1="135" x2="725" y2="135" stroke="#ef4444" strokeWidth="3" />

            {/* Valve Hall Inverter */}
            <g
              {...selectable("valve-hall-inverter", "Nhà van nghịch lưu")}
            >
              <rect
                x="725"
                y="115"
                width="95"
                height="90"
                rx="10"
                fill={selectedEquipment?.id === "valve-hall-inverter" ? "#451a03" : "#102041"}
                stroke={selectedEquipment?.id === "valve-hall-inverter" ? "#f59e0b" : "#b45309"}
                strokeWidth="2.5"
                filter={selectedEquipment?.id === "valve-hall-inverter" ? "url(#glow)" : undefined}
                className="group-hover:stroke-amber-300 transition"
              />
              {/* Inverter Symbol */}
              <polygon points="760,175 785,160 760,145" fill="#f59e0b" />
              <line x1="785" y1="140" x2="785" y2="180" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="772" y="132" fill="#fcd34d" fontSize="10" fontWeight="bold" textAnchor="middle">NGHỊCH LƯU</text>
              <text x="772" y="196" fill="#fef3c7" fontSize="9" textAnchor="middle">Cầu 12 xung</text>
            </g>

            <line x1="820" y1="160" x2="845" y2="160" stroke="#f59e0b" strokeWidth="3" />

            {/* Converter Trafo 2 */}
            <g
              {...selectable("converter-trafo-2", "Máy biến áp đổi nối T2")}
            >
              <circle
                cx="860"
                cy="160"
                r="26"
                fill={selectedEquipment?.id === "converter-trafo-2" ? "#1E2F57" : "#102041"}
                stroke="#f59e0b"
                strokeWidth="2.5"
                className="group-hover:stroke-amber-300 transition"
              />
              <circle
                cx="895"
                cy="160"
                r="26"
                fill={selectedEquipment?.id === "converter-trafo-2" ? "#1E2F57" : "#102041"}
                stroke="#f59e0b"
                strokeWidth="2.5"
                className="group-hover:stroke-amber-300 transition"
              />
              <text x="877" y="164" fill="#fde68a" fontSize="11" fontWeight="bold" textAnchor="middle">T2</text>
              <text x="877" y="205" fill="#8E9DBE" fontSize="10" textAnchor="middle">MBA đổi nối 2</text>
            </g>

            <line x1="921" y1="160" x2="945" y2="160" stroke="#38bdf8" strokeWidth="3" />

            {/* AC GRID 2 (Right) */}
            <g>
              <circle cx="965" cy="160" r="32" fill="#102041" stroke="#38bdf8" strokeWidth="2" />
              <text x="965" y="155" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">AC Lưới 2</text>
              <text x="965" y="172" fill="#8E9DBE" fontSize="10" textAnchor="middle">220kV AC</text>
            </g>
          </svg>
        </div>

        {/* Legend beneath Diagram */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 rounded"></span> Lưới & Thiết bị AC
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-rose-500 rounded"></span> Cực Dương (+500kV DC)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-blue-500 rounded"></span> Cực Âm (-500kV DC)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-500 rounded border border-dashed border-emerald-400"></span> Dây về trung tính / đất
            </span>
          </div>
          <div className="text-cyan-400">
            Chọn một khối thiết bị (nhấp chuột, hoặc Tab rồi Enter) để xem thông số kỹ thuật theo chuẩn EVNNPT
          </div>
        </div>
      </div>
      <p className="md:hidden mt-2 text-[11px] text-slate-500">Vuốt ngang trong khung để xem toàn bộ sơ đồ.</p>

      <div className="mt-4 max-w-md">
        <RangeSlider
          label="Công suất truyền tải đặt"
          value={powerFlowMW}
          min={100}
          max={3000}
          step={50}
          unit=" MW"
          color={isPowerFlowing ? "#22d3ee" : "#485A82"}
          onChange={(v) => {
            setPowerFlowMW(v);
            setIsPowerFlowing(true);
          }}
          hint="Vạch dòng điện trên đường dây chạy nhanh hơn khi công suất tăng."
        />
      </div>

      {/* Equipment Detailed Inspection Panel (Drawer Card) */}
      <AnimatePresence mode="wait">
      {selectedEquipment && (
        <motion.div
          key={selectedEquipment.id}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="mt-6 p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-xl"
          aria-live="polite"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-xs border border-cyan-500/20 font-bold">
                  {selectedEquipment.symbol}
                </span>
                <h4 className="text-lg font-bold text-white">
                  {selectedEquipment.vietnameseName}
                </h4>
                <span className="text-xs text-slate-400">({selectedEquipment.name})</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Vị trí: <strong className="text-slate-200">{selectedEquipment.location}</strong></span>
                <span>•</span>
                <span>Cấp điện áp: <strong className="text-cyan-400">{selectedEquipment.voltageLevel}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setSelectedEquipment(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Đóng bảng chi tiết"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* Description & Role */}
            <div className="lg:col-span-2 space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Mô tả và nguyên lý hoạt động
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedEquipment.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs font-semibold text-cyan-400 block mb-1">
                  Vai trò trong trạm biến đổi
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedEquipment.roleInSystem}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>Tham chiếu tài liệu: </span>
                <span className="text-slate-300 font-medium">{selectedEquipment.nptReference}</span>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-amber-400 block mb-3 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Thông số kỹ thuật chính
              </span>

              <div className="space-y-2 text-xs">
                {Object.entries(selectedEquipment.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start pb-2 border-b border-slate-800/80 last:border-0 last:pb-0">
                    <span className="text-slate-400">{key}:</span>
                    <span className="text-right font-mono font-medium text-slate-200 ml-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
