/**
 * Đọc sổ tay HVDC viết bằng Markdown (src/content/so-tay-hvdc.md) thành các khối để render tĩnh.
 * Chỉ hỗ trợ tập con Markdown mà sổ tay dùng: frontmatter, tiêu đề, đoạn, bảng, danh sách, trích dẫn, đường kẻ
 * và sơ đồ mermaid dạng flowchart đơn giản (vẽ lại bằng HTML, không tải thư viện mermaid).
 */

export interface HandbookMeta {
  title: string;
  version?: string;
  date?: string;
  standardsChecked?: string;
}

export type HandbookBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "list"; ordered: boolean; items: { n?: number; text: string }[] }
  | { type: "quote"; text: string }
  | { type: "flowchart"; chart: Flowchart }
  | { type: "hr" };

export interface Handbook {
  meta: HandbookMeta;
  blocks: HandbookBlock[];
  toc: { level: 2 | 3; text: string; id: string }[];
}

/** Neo tiêu đề theo cách GitHub: chữ thường, bỏ dấu câu (giữ chữ Việt có dấu), mỗi khoảng trắng thành một gạch nối */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^0-9a-zÀ-ỹ\s-]/g, "")
    .trim()
    .replace(/\s/g, "-");
}

const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());

function parseFrontmatter(md: string): { meta: Record<string, string>; body: string } {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return { meta: {}, body: md };
  const meta: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: md.slice(m[0].length) };
}

export function parseHandbook(md: string): Handbook {
  const { meta, body } = parseFrontmatter(md);
  const lines = body.split(/\r?\n/);
  const blocks: HandbookBlock[] = [];
  let i = 0;
  const isBlockStart = (l: string) => /^(#{1,3} |\||- |\d+\. |> |```|---\s*$)/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const h = line.match(/^(#{1,3}) (.+)$/);
    if (h) {
      const text = h[2].trim();
      blocks.push({ type: "heading", level: h[1].length as 1 | 2 | 3, text, id: slugify(text) });
      i++;
    } else if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      if (lang === "mermaid") blocks.push({ type: "flowchart", chart: parseFlowchart(code.join("\n")) });
      else blocks.push({ type: "paragraph", text: code.join(" ") });
    } else if (/^---\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
    } else if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(splitRow(lines[i++]));
      const [header, , ...rest] = rows; // dòng 2 là dòng phân cách | --- |
      blocks.push({ type: "table", header, rows: rest });
    } else if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: { n?: number; text: string }[] = [];
      while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : lines[i].startsWith("- "))) {
        const m = lines[i].match(/^(?:(\d+)\. |- )(.*)$/)!;
        items.push({ n: m[1] ? Number(m[1]) : undefined, text: m[2] });
        i++;
      }
      blocks.push({ type: "list", ordered, items });
    } else if (line.startsWith("> ")) {
      const text: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) text.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ type: "quote", text: text.join(" ") });
    } else {
      const text: string[] = [];
      while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) text.push(lines[i++].trim());
      blocks.push({ type: "paragraph", text: text.join(" ") });
    }
  }

  const title = blocks.find((b): b is Extract<HandbookBlock, { type: "heading" }> => b.type === "heading" && b.level === 1)?.text ?? meta.title ?? "Sổ tay HVDC";
  const toc = blocks.flatMap((b) => (b.type === "heading" && b.level > 1 ? [{ level: b.level as 2 | 3, text: b.text, id: b.id }] : []));
  return { meta: { title, version: meta.version, date: meta.date, standardsChecked: meta.standards_checked }, blocks, toc };
}

/* ---------- Mermaid flowchart (tập con: nút ["…"] hoặc {"…"}, cạnh -->, --- , nhãn -- x -->, subgraph) ---------- */

export interface FlowNode {
  id: string;
  label: string;
  decision: boolean;
}
export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  line?: boolean; // "---": nối không mũi tên (thiết bị gắn kèm)
}
export interface Flowchart {
  direction: "LR" | "TD";
  nodes: Record<string, FlowNode>;
  edges: FlowEdge[];
  groups: { id: string; title: string; nodes: string[] }[];
}

const NODE = /([A-Za-z]\w*)(?:\["([^"]*)"\]|\{"([^"]*)"\})?/;
const cleanLabel = (s: string) => s.replace(/<br\s*\/?>/g, " ").replace(/\s+/g, " ").trim();

export function parseFlowchart(src: string): Flowchart {
  const chart: Flowchart = { direction: /flowchart\s+LR/.test(src) ? "LR" : "TD", nodes: {}, edges: [], groups: [] };
  let group: Flowchart["groups"][number] | null = null;

  const touch = (raw: string) => {
    const m = raw.trim().match(NODE);
    if (!m) return null;
    const [, id, box, diamond] = m;
    if (!chart.nodes[id]) chart.nodes[id] = { id, label: id, decision: false };
    if (box !== undefined) chart.nodes[id].label = cleanLabel(box);
    if (diamond !== undefined) chart.nodes[id] = { id, label: cleanLabel(diamond), decision: true };
    if (group && !group.nodes.includes(id)) group.nodes.push(id);
    return id;
  };

  for (const raw of src.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("flowchart")) continue;
    const sg = line.match(/^subgraph\s+(\w+)\["([^"]*)"\]/);
    if (sg) {
      group = { id: sg[1], title: cleanLabel(sg[2]), nodes: [] };
      chart.groups.push(group);
      continue;
    }
    if (line === "end") {
      group = null;
      continue;
    }
    // Tách theo các mũi tên, giữ nhãn cạnh: A -- Có --> B, A --> B --> C, A --- B
    const parts = line.split(/\s*(--\s[^-]+?\s-->|-->|---)\s*/);
    let prev: string | null = touch(parts[0]);
    for (let k = 1; k < parts.length; k += 2) {
      const op = parts[k];
      const next = touch(parts[k + 1]);
      if (prev && next) {
        const label = op.match(/^--\s(.+?)\s-->$/)?.[1];
        chart.edges.push({ from: prev, to: next, label, line: op === "---" });
      }
      prev = next;
    }
  }
  return chart;
}
