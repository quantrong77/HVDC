import { describe, expect, it } from "vitest";
import { VSC_DEFAULT_SCENARIO, VSC_EVENTS, limitReactive, simulateVscHvdc } from "@/lib/vsc-hvdc";
import {
  adviseTechnology,
  breakevenVerdict,
  converterLossesMW,
  distanceColumn,
  nearestLineData,
  suggestDcVoltage,
  type PlanningInput,
} from "@/lib/hvdc-planning";
import { getSupplements } from "@/data/supplements";
import { searchKnowledge } from "@/lib/knowledge-search";

const at = (samples: ReturnType<typeof simulateVscHvdc>, t: number) => samples.reduce((a, b) => (Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a));

describe("Mô hình VSC-HVDC", () => {
  const run = simulateVscHvdc(VSC_DEFAULT_SCENARIO);

  it("xác lập ban đầu đúng giá trị đặt", () => {
    const s = at(run, 1.9);
    expect(s.p1).toBeCloseTo(0.5, 3);
    expect(s.vdc).toBeCloseTo(1, 3);
    expect(s.q1).toBeCloseTo(0.1, 3);
  });

  it("bước P1 lên 1 pu: trạm 2 giữ Vdc về 1 pu và nhận P1 trừ tổn thất đường dây", () => {
    const s = at(run, VSC_EVENTS.q1 - 0.05);
    expect(s.p1).toBeCloseTo(1, 2);
    expect(s.vdc).toBeCloseTo(1, 2);
    expect(s.p2).toBeCloseTo(1 - 0.01, 2);
    const dip = Math.max(...run.filter((x) => x.t > 2 && x.t < 2.5).map((x) => Math.abs(x.vdc - 1)));
    expect(dip).toBeGreaterThan(0.005);
    expect(dip).toBeLessThan(0.15);
  });

  it("Q bị giới hạn theo miền P-Q khi P lớn", () => {
    expect(limitReactive(1, 0.8, 1.1)).toBeCloseTo(Math.sqrt(1.21 - 1), 6);
    expect(limitReactive(0, -2, 1.1)).toBeCloseTo(-1.1, 6);
    const s = at(run, 4.95);
    expect(s.q2).toBeCloseTo(0.2, 2);
    expect(s.vac2).toBeCloseTo(1 + 0.2 / 3, 2);
  });
});

describe("Thiết kế sơ bộ tuyến HVDC", () => {
  const base: PlanningInput = { powerMW: 3000, distanceKm: 1200, route: "overhead", scrSend: 4, scrReceive: 4, multiTerminal: false, blackStart: false };

  it("tra bảng cấp điện áp theo công suất và cự ly", () => {
    expect(distanceColumn(200)).toBe(0);
    expect(distanceColumn(1999)).toBe(4);
    expect(distanceColumn(2000)).toBe(5);
    expect(suggestDcVoltage(3000, 1200)).toBe("600–800");
    expect(suggestDcVoltage(8000, 2500)).toBe("800–1.100");
    expect(suggestDcVoltage(400, 800)).toBeNull();
    expect(nearestLineData(800).rowM).toBe("85–90");
  });

  it("khoảng cách hòa vốn", () => {
    expect(breakevenVerdict("overhead", 300)).toBe("hvac");
    expect(breakevenVerdict("overhead", 600)).toBe("compare");
    expect(breakevenVerdict("cable", 150)).toBe("hvdc");
  });

  it("chọn công nghệ", () => {
    expect(adviseTechnology(base).technology).toBe("LCC");
    expect(adviseTechnology({ ...base, scrSend: 1.8 }).technology).toBe("VSC");
    expect(adviseTechnology({ ...base, powerMW: 8000, scrReceive: 2 }).technology).toBe("Hybrid");
    expect(adviseTechnology({ ...base, powerMW: 1000, route: "cable", distanceKm: 150 }).technology).toBe("VSC");
    expect(converterLossesMW("LCC", 1000)).toBeCloseTo(14, 6);
  });
});

describe("Tài liệu ĐHBKHN 2026", () => {
  it("bổ sung vào các bài liên quan", () => {
    for (const id of ["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "3.2", "4.1", "4.2"]) {
      expect(getSupplements(id).some((s) => /Bách khoa/.test(s.author))).toBe(true);
    }
  });

  it("trợ lý tra cứu được nội dung mới", () => {
    expect(searchKnowledge("Wudongde hybrid").some((h) => /Wudongde/.test(h.text))).toBe(true);
    expect(searchKnowledge("MRTB đường về kim loại").some((h) => /MRTB/.test(h.text))).toBe(true);
  });
});
