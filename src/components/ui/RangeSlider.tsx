"use client";

import React, { useId } from "react";
import InfoTip from "@/components/ui/InfoTip";

interface RangeSliderProps {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  color?: string;
  format?: (value: number) => string;
  onChange: (value: number) => void;
  hint?: React.ReactNode;
  tip?: React.ReactNode; // Giải thích hiện khi trỏ vào biểu tượng (i) cạnh nhãn
}

export default function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  color = "#22d3ee",
  format,
  onChange,
  hint,
  tip,
}: RangeSliderProps) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : `${value}${unit}`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span className="inline-flex items-center">
          <label htmlFor={id} className="text-xs font-medium text-slate-300">
            {label}
          </label>
          {tip && <InfoTip text={tip} label={`Giải thích: ${typeof label === "string" ? label : "thông số"}`} />}
        </span>
        <output htmlFor={id} className="font-mono text-sm font-semibold tabular-nums" style={{ color }}>
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="hvdc-range w-full cursor-pointer"
        style={{ "--range-fill": `${fill}%`, "--range-color": color } as React.CSSProperties}
      />
      {hint && <div className="mt-1.5 text-[11px] text-slate-500">{hint}</div>}
    </div>
  );
}
