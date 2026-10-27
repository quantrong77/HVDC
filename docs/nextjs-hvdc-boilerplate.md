# Next.js 14+ Boilerplate Architecture & Component Starters
## Dự Án WebApp Học Tập & Mô Phỏng HVDC

Tài liệu này cung cấp khung dự án chuẩn (Boilerplate) cho **Next.js 14+ (App Router)** tích hợp sẵn các thư viện UI, đồ họa mô phỏng và cấu trúc Component hoàn chỉnh để bạn bắt đầu lập trình cùng Cursor / Windsurf hoặc v0.

---

### 1. Cấu Trúc Thư Mục Dự Án (Directory Structure)

```text
hvdc-learning-hub/
├── .cursorrules                      # File cấu hình quy tắc và context cho Cursor AI
├── public/
│   ├── assets/                       # Sơ đồ trạm, biểu tượng thiết bị HVDC
│   └── docs/                         # Thư mục chứa file Markdown/PDF tài liệu nguồn
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Layout chung (Header, Navigation, Sidebar)
│   │   ├── page.tsx                  # Trang chủ Landing Page & Lộ trình 4 Cấp độ
│   │   ├── (modules)/
│   │   │   ├── level-1-basics/page.tsx       # Cấp độ 1: Tổng quan HVDC & Cấu hình
│   │   │   ├── level-2-converters/page.tsx   # Cấp độ 2: LCC vs VSC, Chuyển mạch
│   │   │   ├── level-3-control/page.tsx      # Cấp độ 3: Điều khiển CC/CV, Đặc tính V-I
│   │   │   └── level-4-specialist/page.tsx   # Cấp độ 4: Trạm biến đổi, Bảo vệ & Case Study
│   │   ├── simulator/
│   │   │   └── page.tsx              # Phòng Lab mô phỏng dạng sóng & sơ đồ tương tác
│   │   └── api/
│   │       └── chat/route.ts         # API Endpoint cho AI HVDC Assistant (RAG)
│   ├── components/
│   │   ├── ui/                       # Shadcn UI (Button, Card, Slider, Tabs, Dialog)
│   │   ├── simulator/
│   │   │   ├── WaveformCanvas.tsx    # Component mô phỏng điện áp/dòng điện chỉnh lưu
│   │   │   └── SingleLineDiagram.tsx # Sơ đồ đơn tuyến HVDC tương tác
│   │   ├── quiz/
│   │   │   └── QuizEngine.tsx        # Trắc nghiệm tương tác & Giải thích đáp án
│   │   └── ai/
│   │       └── HVDCChatbot.tsx       # Trợ lý AI tra cứu kiến thức HVDC
│   ├── lib/
│   │   ├── hvdc-math.ts              # Các hàm toán học điện tử công suất HVDC
│   │   └── utils.ts                  # Utility functions
│   └── types/
│       └── hvdc.ts                   # TypeScript interfaces (Equipment, WaveformParams, Quiz)
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

### 2. Cấu Hình `package.json`

```json
{
  "name": "hvdc-learning-hub",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "lucide-react": "^0.378.0",
    "recharts": "^2.12.0",
    "framer-motion": "^11.1.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "katex": "^0.16.10",
    "react-katex": "^3.0.1"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.0"
  }
}
```

---

### 3. Core Math Library (`src/lib/hvdc-math.ts`)

File chứa các công thức toán học điện tử công suất phục vụ tính toán cho mô phỏng:

```typescript
/**
 * Thư viện tính toán đại lượng điện học HVDC
 */

export interface WaveformParams {
  alphaDeg: number;   // Góc kích Alpha (độ)
  gammaDeg: number;   // Góc dập Gamma (độ)
  vMax: number;       // Điện áp đỉnh AC (kV)
  frequency: number;  // Tần số hệ thống (Hz)
  is12Pulse: boolean; // Chế độ 6-pulse hay 12-pulse
}

/**
 * Tính điện áp DC trung bình lý thuyết không tải Vd0 và có tải Vd
 * Vd0 = (3 * sqrt(2) / PI) * V_line
 * Vd = Vd0 * cos(alpha)
 */
export function calculateVd(vMax: number, alphaDeg: number): { vd0: number; vd: number } {
  const alphaRad = (alphaDeg * Math.PI) / 180;
  const vd0 = (3 * Math.sqrt(2) / Math.PI) * vMax;
  const vd = vd0 * Math.cos(alphaRad);
  return {
    vd0: Number(vd0.toFixed(2)),
    vd: Number(vd.toFixed(2)),
  };
}

/**
 * Tạo dữ liệu chuỗi thời gian cho dạng sóng điện áp ngõ ra DC
 */
export function generateWaveformData(params: WaveformParams, points: number = 200) {
  const { alphaDeg, vMax, is12Pulse } = params;
  const alphaRad = (alphaDeg * Math.PI) / 180;
  const pulses = is12Pulse ? 12 : 6;
  const period = (2 * Math.PI) / pulses;
  const data = [];

  for (let i = 0; i < points; i++) {
    const wt = (i / points) * 2 * Math.PI; // Trục wt từ 0 đến 2pi
    // Tính toán tức thời sóng điện áp ghép từ các đỉnh hình sin
    const phaseOffset = Math.floor((wt + alphaRad) / period) * period;
    const instantaneousVd = vMax * Math.abs(Math.cos(wt - phaseOffset + alphaRad * 0.2));

    data.push({
      wt: (wt * 180 / Math.PI).toFixed(0),
      voltage: Number(instantaneousVd.toFixed(2)),
      vdAverage: calculateVd(vMax, alphaDeg).vd,
    });
  }

  return data;
}
```

---

### 4. Component Mô Phỏng Dạng Sóng (`src/components/simulator/WaveformCanvas.tsx`)

```tsx
"use client";

import React, { useState, useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { generateWaveformData, calculateVd } from "@/lib/hvdc-math";

export default function WaveformCanvas() {
  const [alpha, setAlpha] = useState<number>(30); // Góc kích mặc định 30 độ
  const [is12Pulse, setIs12Pulse] = useState<boolean>(true);
  const vMax = 500; // 500kV DC

  const chartData = useMemo(() => {
    return generateWaveformData({
      alphaDeg: alpha,
      gammaDeg: 18,
      vMax,
      frequency: 50,
      is12Pulse,
    });
  }, [alpha, is12Pulse]);

  const { vd0, vd } = useMemo(() => calculateVd(vMax, alpha), [alpha]);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-cyan-400">Mô Phỏng Điện Áp Chỉnh Lưu HVDC</h3>
          <p className="text-xs text-slate-400">Điều chỉnh góc kích α để quan sát dạng sóng ngõ ra</p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setIs12Pulse(!is12Pulse)}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition"
          >
            Chế độ: {is12Pulse ? "Cầu 12-Pulse" : "Cầu 6-Pulse"}
          </button>
        </div>
      </div>

      {/* Control Sliders & Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-slate-950 p-4 rounded-lg">
        <div>
          <label className="text-xs text-slate-400 mb-2 block">
            Góc kích α (Alpha): <span className="font-bold text-cyan-300">{alpha}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="180"
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0° (Chỉnh lưu cực đại)</span>
            <span>90°</span>
            <span>180° (Nghịch lưu)</span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-xs text-slate-400">Điện áp DC không tải (Vd0):</span>
          <span className="text-lg font-semibold text-slate-200">{vd0} kV</span>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-xs text-slate-400">Điện áp DC Trung bình (Vd):</span>
          <span className={`text-2xl font-bold ${vd >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
            {vd} kV {vd < 0 && "(Chế độ Nghịch lưu - Inverter)"}
          </span>
        </div>
      </div>

      {/* Recharts Chart */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="wt" stroke="#94a3b8" label={{ value: "Góc ωt (độ)", position: "insideBottom", offset: -5 }} />
            <YAxis stroke="#94a3b8" domain={[-vMax, vMax * 1.2]} label={{ value: "Điện áp (kV)", angle: -90, position: "insideLeft" }} />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
            <Legend />
            <Line type="monotone" dataKey="voltage" name="Dạng sóng tức thời Vd(t)" stroke="#06b6d4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="vdAverage" name="Điện áp trung bình Vd" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

---

### 5. File Cấu Hình Cursor (`.cursorrules`)

Đưa file này vào thư mục gốc của dự án để Cursor AI luôn tuân thủ nguyên lý HVDC:

```text
You are an expert Power Electronics Engineer and Senior Full-Stack React Developer specializing in HVDC (High Voltage Direct Current) transmission systems.

When generating code or explaining concepts for this project:
1. Always align terminology with EVNNPT standard HVDC training materials (LCC, VSC, Thyristor, IGBT, Commutation overlap Angle Mu, Extinction Angle Gamma, Firing Angle Alpha).
2. Ensure mathematical accuracy when rendering electrical equations using KaTeX / Recharts.
3. Use Next.js 14 App Router, TypeScript, Tailwind CSS, and Shadcn UI conventions.
4. Keep all UI components accessible, responsive, and visually polished with dark mode themes suitable for engineering dashboards.
```
