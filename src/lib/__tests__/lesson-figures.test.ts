import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ALL_LESSONS } from "@/data/curriculum";
import { LESSON_FIGURES, LICENSE_URL } from "@/data/lesson-figures";

describe("Hình minh họa Cấp độ 0", () => {
  it("mỗi bài 0.1–0.7 có hình vẽ của giáo trình v1.1 (đủ 28 file trong gt/)", () => {
    const gtFiles = new Set(Object.values(LESSON_FIGURES).flat().filter((f) => f.file.startsWith("gt/")).map((f) => f.file));
    expect(gtFiles.size).toBe(28);
    for (const id of ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7"]) expect(LESSON_FIGURES[id][0].file.startsWith("gt/"), id).toBe(true);
  });

  it("mỗi bài Cấp độ 0 có ít nhất 3 hình; file tồn tại, có tác giả, giấy phép mở và tên file Commons", () => {
    for (const lesson of ALL_LESSONS.filter((l) => l.level === 0)) {
      const figs = LESSON_FIGURES[lesson.id] ?? [];
      expect(figs.length, lesson.id).toBeGreaterThanOrEqual(3);
      for (const f of figs) {
        const file = path.join(process.cwd(), "public", "level0", f.file);
        expect(fs.existsSync(file), f.file).toBe(true);
        expect(fs.statSync(file).size).toBeGreaterThan(1000);
        expect(f.author.length).toBeGreaterThan(1);
        expect(Object.keys(LICENSE_URL)).toContain(f.license);
        // Hình giáo trình nằm trong gt/; ảnh ngoài phải có tên file Commons để ghi nguồn
        if (f.file.startsWith("gt/")) expect(f.license).toBe("Giáo trình khóa học");
        else expect(f.commons).toMatch(/\.(svg|png|jpe?g|gif)$/i);
        expect(f.caption.length).toBeGreaterThan(40);
      }
    }
  });

  it("không có ảnh nào trong public/level0 bị bỏ quên (ảnh không được dùng thì không ghi nguồn)", () => {
    const used = new Set(Object.values(LESSON_FIGURES).flat().map((f) => f.file));
    const dir = path.join(process.cwd(), "public", "level0");
    const files = fs.readdirSync(dir, { recursive: true }).map(String).map((f) => f.split(path.sep).join("/")).filter((f) => fs.statSync(path.join(dir, f)).isFile());
    for (const file of files) expect(used.has(file), file).toBe(true);
  });
});
