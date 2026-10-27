/**
 * Tra cứu kiến thức nội bộ cho Trợ lý HVDC (bản không cần API key).
 * Chấm điểm theo số từ khóa trùng khớp trên toàn bộ học liệu đã số hóa trong app:
 * ý chính bài học, thiết bị trạm và lời giải câu hỏi trắc nghiệm.
 */

import { CURRICULUM_LEVELS } from "@/data/curriculum";
import { HVDC_QUIZ } from "@/data/quiz";
import { HVDC_EQUIPMENT_DATABASE } from "@/data/equipment";

export interface KnowledgeChunk {
  text: string;
  source: string;
}

export interface KnowledgeHit extends KnowledgeChunk {
  score: number;
}

// Từ đồng nghĩa ký hiệu ↔ tên gọi để câu hỏi "gamma" khớp với "γ"
const ALIASES: Record<string, string> = {
  "α": "alpha goc kich",
  "γ": "gamma goc dap",
  "μ": "mu trung dan",
  cea: "gamma goc dap",
  cc: "giu dong",
  "thyristor": "thyristor van lcc",
  "igbt": "igbt vsc mmc",
};

const STOP_WORDS = new Set([
  "la", "gi", "cua", "va", "co", "the", "nao", "trong", "cho", "khi", "voi", "mot", "cac", "nhung",
  "duoc", "bang", "tai", "sao", "vi", "de", "thi", "hay", "o", "ve", "nay", "do", "khong",
]);

export function normalize(input: string): string {
  let text = input.toLowerCase();
  for (const [symbol, expansion] of Object.entries(ALIASES)) {
    if (text.includes(symbol)) text += ` ${expansion}`;
  }
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ");
}

function tokenize(input: string): string[] {
  return normalize(input)
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

const CHUNKS: KnowledgeChunk[] = [
  ...CURRICULUM_LEVELS.flatMap((level) =>
    level.topics.flatMap((topic) => [
      ...topic.keyPoints.map((text) => ({ text, source: `${topic.title} · ${topic.docRef}` })),
      ...(topic.formula ? [{ text: `Công thức: ${topic.formula}`, source: topic.title }] : []),
    ])
  ),
  ...HVDC_EQUIPMENT_DATABASE.flatMap((eq) => [
    { text: `${eq.vietnameseName}: ${eq.description}`, source: eq.nptReference },
    { text: `${eq.vietnameseName} – vai trò: ${eq.roleInSystem}`, source: eq.nptReference },
  ]),
  ...HVDC_QUIZ.map((q) => ({ text: q.explanation, source: q.evnReference })),
];

const INDEXED = CHUNKS.map((chunk) => ({ chunk, tokens: new Set(tokenize(chunk.text)) }));

export function searchKnowledge(query: string, limit = 3): KnowledgeHit[] {
  const queryTokens = Array.from(new Set(tokenize(query)));
  if (queryTokens.length === 0) return [];
  return INDEXED.map(({ chunk, tokens }) => ({
    ...chunk,
    score: queryTokens.reduce((sum, t) => sum + (tokens.has(t) ? 1 : 0), 0) / Math.sqrt(tokens.size + 4),
  }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
