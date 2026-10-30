import React from "react";
import { ArrowDown, ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { Flowchart, Handbook, HandbookBlock } from "@/lib/handbook";
import { handbookFiguresFor } from "@/data/handbook-figures";
import LessonFigures from "@/components/lesson/LessonFigures";

/* ---------- Nội dung trong dòng: đậm, nghiêng, liên kết, trích dẫn [n], ký hiệu loại yếu tố ---------- */

const FACTOR: Record<string, { label: string; cls: string; title: string }> = {
  "🔷": { label: "Bản chất", cls: "border-cyan-500/50 text-cyan-400 bg-cyan-500/10", title: "Bản chất công nghệ: đúng với mọi dự án dùng công nghệ đó" },
  "🔶": { label: "Thiết kế", cls: "border-amber-500/50 text-amber-400 bg-amber-500/10", title: "Phụ thuộc thiết kế hoặc nhà sản xuất" },
  "🟢": { label: "Dự án", cls: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10", title: "Phụ thuộc dự án hoặc chế độ vận hành" },
};

const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\[(\d+)\]|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|`([^`]+)`|(🔷|🔶|🟢)/g;

function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  const re = new RegExp(INLINE.source, "g");
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, linkText, href, cite, bold, italic, code, factor] = m;
    if (linkText !== undefined) {
      const external = /^https?:/.test(href);
      out.push(
        <a
          key={k++}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-cyan-400 underline decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          <Inline text={linkText} />
          {external && <ExternalLink className="inline w-3 h-3 ml-0.5 -mt-0.5" aria-hidden="true" />}
          {external && <span className="sr-only"> (mở trang mới)</span>}
        </a>,
      );
    } else if (cite) {
      out.push(
        <a key={k++} href={`#ref-${cite}`} className="text-cyan-400 hover:underline" aria-label={`Tài liệu tham khảo ${cite}`}>
          [{cite}]
        </a>,
      );
    } else if (bold) out.push(<strong key={k++} className="font-semibold text-white"><Inline text={bold} /></strong>);
    else if (italic) out.push(<em key={k++}>{italic}</em>);
    else if (code) out.push(<code key={k++} className="px-1 rounded bg-slate-800 text-[0.9em]">{code}</code>);
    else if (factor) {
      const f = FACTOR[factor];
      out.push(
        <span key={k++} title={f.title} className={`inline-block align-[1px] mx-0.5 px-1.5 rounded border text-[11px] font-medium leading-4 whitespace-nowrap ${f.cls}`}>
          {f.label}
        </span>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/* ---------- Sơ đồ ---------- */

function chainOf(chart: Flowchart, ids: string[]) {
  const flow = chart.edges.filter((e) => !e.line && ids.includes(e.from) && ids.includes(e.to));
  const start = ids.find((id) => !flow.some((e) => e.to === id) && flow.some((e) => e.from === id)) ?? ids[0];
  const chain = [start];
  for (let next = flow.find((e) => e.from === start); next && !chain.includes(next.to); next = flow.find((e) => e.from === next!.to)) chain.push(next.to);
  const attached = chart.edges.filter((e) => e.line && ids.includes(e.from)).map((e) => chart.nodes[e.from].label);
  return { chain: chain.map((id) => chart.nodes[id].label), attached };
}

/** Sơ đồ khối nằm ngang theo nhóm (flowchart LR có subgraph) */
function ChainChart({ chart }: { chart: Flowchart }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {chart.groups.map((g) => {
        const { chain, attached } = chainOf(chart, g.nodes);
        return (
          <section key={g.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h4 className="text-sm font-bold text-white mb-3">{g.title}</h4>
            <ol className="space-y-1.5">
              {chain.map((label, i) => (
                <li key={label}>
                  <span className="block rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-3 py-2 text-[13px] text-slate-200">{label}</span>
                  {i < chain.length - 1 && <ArrowDown className="mx-auto my-1 w-4 h-4 text-slate-500" aria-hidden="true" />}
                </li>
              ))}
            </ol>
            {attached.length > 0 && <p className="mt-3 text-xs text-slate-400">Gắn ở phía lưới AC: {attached.join(", ")}</p>}
          </section>
        );
      })}
    </div>
  );
}

/** Cây quyết định (flowchart TD có nút hình thoi): mỗi câu hỏi là một bước, nhánh dẫn tới câu hỏi khác hoặc kết luận */
function DecisionChart({ chart }: { chart: Flowchart }) {
  const order: string[] = [];
  const queue = Object.values(chart.nodes).filter((n) => !chart.edges.some((e) => e.to === n.id)).map((n) => n.id);
  while (queue.length) {
    const id = queue.shift()!;
    if (order.includes(id)) continue;
    order.push(id);
    chart.edges.filter((e) => e.from === id).forEach((e) => queue.push(e.to));
  }
  const questions = order.filter((id) => chart.nodes[id].decision);
  return (
    <ol className="space-y-3">
      {questions.map((id, i) => (
        <li key={id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold text-white">
            <span className="text-cyan-400 mr-1.5">Câu {i + 1}.</span>
            {chart.nodes[id].label}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {chart.edges
              .filter((e) => e.from === id)
              .map((e) => {
                const target = chart.nodes[e.to];
                const q = questions.indexOf(e.to);
                return (
                  <li key={e.to + e.label} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1 text-[13px] text-slate-300">
                    <span className="font-medium text-white">{e.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    {target.decision ? <span>sang câu {q + 1}</span> : <span className="font-semibold text-cyan-400">{target.label}</span>}
                  </li>
                );
              })}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Khối ---------- */

function Table({ header, rows }: { header: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-950">
          <tr>
            {header.map((c, j) => (
              <th key={j} scope="col" className="text-left font-semibold text-white px-3 py-2 border-b border-slate-800 align-bottom">
                <Inline text={c} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-800 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-3 py-2 align-top min-w-[7rem] ${j === 0 ? "font-medium text-slate-200" : "text-slate-300"}`}>
                  <Inline text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ block, inRefs }: { block: HandbookBlock; inRefs: boolean }) {
  switch (block.type) {
    case "heading":
      if (block.level === 1) return null; // tiêu đề trang đã hiển thị ở phần đầu
      return block.level === 2 ? (
        <h2 id={block.id} className="scroll-mt-24 mt-12 mb-4 pt-6 border-t border-slate-800 text-2xl font-bold text-white">
          {block.text}
        </h2>
      ) : (
        <h3 id={block.id} className="scroll-mt-24 mt-8 mb-3 text-lg font-bold text-white">
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p className="my-3 text-[15px] leading-relaxed text-slate-300">
          <Inline text={block.text} />
        </p>
      );
    case "table":
      return <Table header={block.header} rows={block.rows} />;
    case "list":
      if (block.ordered && inRefs)
        return (
          <ol className="my-3 space-y-2">
            {block.items.map((it) => (
              <li key={it.n} id={`ref-${it.n}`} className="scroll-mt-24 flex gap-2 text-sm leading-relaxed text-slate-300">
                <span className="shrink-0 w-7 text-right font-mono text-slate-500">[{it.n}]</span>
                <span className="min-w-0 break-words">
                  <Inline text={it.text} />
                </span>
              </li>
            ))}
          </ol>
        );
      return React.createElement(
        block.ordered ? "ol" : "ul",
        { className: `my-3 pl-6 space-y-1.5 text-[15px] leading-relaxed text-slate-300 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-slate-500` },
        block.items.map((it, i) => (
          <li key={i} value={it.n}>
            <Inline text={it.text} />
          </li>
        )),
      );
    case "quote":
      return (
        <blockquote className="my-4 px-4 py-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-sm leading-relaxed text-slate-200">
          <Inline text={block.text} />
        </blockquote>
      );
    case "flowchart":
      return <figure className="my-5">{block.chart.direction === "LR" ? <ChainChart chart={block.chart} /> : <DecisionChart chart={block.chart} />}</figure>;
    case "hr":
      return null; // phần mới đã có đường kẻ ở tiêu đề
  }
}

/** Neo của mục chứa khối thứ i (tiêu đề cấp 2 hoặc 3 gần nhất phía trên) */
function sectionOf(blocks: HandbookBlock[], i: number): string | null {
  for (let k = i; k >= 0; k--) {
    const b = blocks[k];
    if (b.type === "heading" && b.level > 1) return b.id;
  }
  return null;
}

export default function HandbookView({ handbook }: { handbook: Handbook }) {
  const { meta, blocks, toc } = handbook;
  const refsAt = blocks.findIndex((b) => b.type === "heading" && b.text === "Tài liệu tham khảo");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="max-w-3xl">
        <p className="flex items-center gap-2 text-sm text-cyan-400">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Sổ tay
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">{meta.title}</h1>
        <p className="mt-3 text-sm text-slate-400">
          {meta.version && <>Phiên bản {meta.version}</>}
          {meta.date && <> · cập nhật {meta.date.split("-").reverse().join("/")}</>}
          {meta.standardsChecked && <> · tiêu chuẩn tra cứu ngày {meta.standardsChecked.split("-").reverse().join("/")}</>}
        </p>
      </header>

      <details className="xl:hidden mt-6 rounded-xl border border-slate-800 bg-slate-900">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-white">Mục lục</summary>
        <ul className="px-4 pb-4 space-y-1 text-sm">
          {toc.map((t) => (
            <li key={t.id} className={t.level === 3 ? "pl-4" : "mt-2"}>
              <a href={`#${t.id}`} className={t.level === 2 ? "font-semibold text-slate-200" : "text-slate-400"}>
                {t.text}
              </a>
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-6 grid gap-10 xl:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0 max-w-4xl">
          {blocks.map((b, i) => {
            // Hình của một mục đặt cuối mục, ngay trước tiêu đề kế tiếp
            const next = blocks[i + 1];
            const sectionEnd = !next || (next.type === "heading" && next.level <= 3);
            const owner = sectionEnd ? sectionOf(blocks, i) : null;
            const figs = owner ? handbookFiguresFor(owner) : [];
            return (
              <React.Fragment key={i}>
                <Block block={b} inRefs={refsAt >= 0 && i > refsAt} />
                {figs.length > 0 && <LessonFigures figures={figs} variant="inline" />}
              </React.Fragment>
            );
          })}
        </article>

        <nav aria-label="Mục lục sổ tay" className="hidden xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
            <p className="text-sm font-bold text-white mb-2">Mục lục</p>
            <ul className="space-y-1 text-[13px]">
              {toc.map((t) => (
                <li key={t.id} className={t.level === 3 ? "pl-3" : "mt-2"}>
                  <a href={`#${t.id}`} className={`block py-0.5 hover:text-cyan-400 ${t.level === 2 ? "font-semibold text-slate-200" : "text-slate-400"}`}>
                    {t.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
