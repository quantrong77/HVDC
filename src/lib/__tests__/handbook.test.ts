import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { parseHandbook, slugify } from "@/lib/handbook";
import { HANDBOOK_FIGURES } from "@/data/handbook-figures";
import { LICENSE_URL } from "@/data/lesson-figures";

const md = fs.readFileSync(path.join(process.cwd(), "src", "content", "so-tay-hvdc.md"), "utf8");
const hb = parseHandbook(md);
const text = hb.blocks
  .flatMap((b) => (b.type === "paragraph" || b.type === "quote" ? [b.text] : b.type === "table" ? [...b.header, ...b.rows.flat()] : b.type === "list" ? b.items.map((i) => i.text) : []))
  .join("\n");

describe("Sổ tay HVDC", () => {
  it("đọc được frontmatter, tiêu đề và ba phần cùng tài liệu tham khảo", () => {
    expect(hb.meta.title).toBe("Sổ tay tự học HVDC");
    expect(hb.meta.version).toBe("1.0");
    expect(hb.toc.filter((t) => t.level === 2).map((t) => t.text)).toEqual([
      "Phần 1 — LCC và VSC",
      "Phần 2 — Vận hành và bảo trì",
      "Phần 3 — Lựa chọn thiết bị trạm HVDC",
      "Tài liệu tham khảo",
    ]);
  });

  it("neo tiêu đề giống GitHub để liên kết nội bộ trong file chạy được", () => {
    expect(slugify("Phần 1 — LCC và VSC")).toBe("phần-1--lcc-và-vsc");
    const ids = new Set(hb.toc.map((t) => t.id));
    for (const m of Array.from(text.matchAll(/\]\(#([^)]+)\)/g))) expect(ids.has(m[1]), m[1]).toBe(true);
  });

  it("mọi trích dẫn [n] đều có mục tương ứng trong danh mục tài liệu", () => {
    const refs = hb.blocks.flatMap((b) => (b.type === "list" && b.ordered ? b.items.map((i) => i.n) : []));
    const cited = Array.from(new Set(Array.from(text.matchAll(/\[(\d+)\](?!\()/g)).map((m) => Number(m[1]))));
    expect(cited.length).toBeGreaterThan(20);
    for (const n of cited) expect(refs, `[${n}]`).toContain(n);
  });

  it("bảng có số cột đồng đều", () => {
    const tables = hb.blocks.filter((b) => b.type === "table");
    expect(tables.length).toBeGreaterThan(15);
    for (const t of tables) if (t.type === "table") for (const r of t.rows) expect(r).toHaveLength(t.header.length);
  });

  it("hai sơ đồ mermaid được đọc thành chuỗi khối và cây quyết định", () => {
    const charts = hb.blocks.flatMap((b) => (b.type === "flowchart" ? [b.chart] : []));
    expect(charts).toHaveLength(2);
    const [blocks, decision] = charts;
    expect(blocks.direction).toBe("LR");
    expect(blocks.groups.map((g) => g.nodes.length)).toEqual([5, 4]);
    expect(blocks.edges.filter((e) => e.line)).toHaveLength(1);
    expect(decision.direction).toBe("TD");
    expect(Object.values(decision.nodes).filter((n) => n.decision)).toHaveLength(4);
    // Nhánh "Có" của câu 3 dẫn sang câu 4, ba nhánh còn lại dẫn tới kết luận
    const yes = decision.edges.filter((e) => e.label === "Có").map((e) => decision.nodes[e.to]);
    expect(yes.filter((n) => !n.decision).map((n) => n.label)).toEqual(["Ưu tiên VSC", "Ưu tiên VSC", "Xem xét LCC"]);
  });
});

describe("Hình minh họa của Sổ tay", () => {
  const all = Object.values(HANDBOOK_FIGURES).flat();

  it("mỗi nhóm hình gắn với một mục có thật trong sổ tay", () => {
    const ids = new Set(hb.toc.map((t) => t.id));
    for (const id of Object.keys(HANDBOOK_FIGURES)) expect(ids.has(id), id).toBe(true);
    expect(Object.keys(HANDBOOK_FIGURES).length).toBeGreaterThanOrEqual(10);
  });

  it("file tồn tại, có tác giả, giấy phép mở; ảnh ngoài giáo trình có tên file Commons", () => {
    for (const f of all) {
      const file = path.join(process.cwd(), "public", f.dir ?? "level0", f.file);
      expect(fs.existsSync(file), f.file).toBe(true);
      expect(Object.keys(LICENSE_URL)).toContain(f.license);
      expect(f.author.length).toBeGreaterThan(1);
      expect(f.caption.length).toBeGreaterThan(40);
      if (!f.file.startsWith("gt/")) expect(f.commons).toMatch(/\.(svg|png|jpe?g|gif)$/i);
    }
  });

  it("không có ảnh nào trong public/handbook bị bỏ quên", () => {
    const used = new Set(all.filter((f) => f.dir === "handbook").map((f) => f.file));
    for (const file of fs.readdirSync(path.join(process.cwd(), "public", "handbook"))) expect(used.has(file), file).toBe(true);
  });
});
