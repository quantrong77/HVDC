import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { searchKnowledge, KnowledgeHit } from "@/lib/knowledge-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUESTION_CHARS = 1000;
const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_CHARS = 2000;

const SYSTEM_PROMPT = `Bạn là trợ giảng HVDC của nền tảng "Nghiên Cứu HVDC", phục vụ kỹ sư và nhân viên vận hành truyền tải điện của EVNNPT.

Trả lời bằng tiếng Việt, ngắn gọn và chính xác về kỹ thuật, dùng thuật ngữ thống nhất với tài liệu đào tạo EVNNPT (LCC, VSC, MMC, góc kích α, góc trùng dẫn μ, góc dập γ, CC, CEA, VDCOL).

Mỗi câu hỏi kèm theo các trích đoạn học liệu được đánh số [1], [2]... Dựa câu trả lời vào các trích đoạn đó và ghi số trích đoạn sau ý tương ứng. Khi trích đoạn không đủ để trả lời, nói rõ phần nào nằm ngoài học liệu của ứng dụng rồi mới bổ sung bằng kiến thức chung về HVDC. Viết công thức dạng văn bản thuần (ví dụ: Vd = Vd0·cos α), không dùng LaTeX hay Markdown đậm/nghiêng.`;

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

function parseBody(body: unknown): { question: string; history: ChatTurn[] } | null {
  if (!body || typeof body !== "object") return null;
  const { question, history } = body as { question?: unknown; history?: unknown };
  if (typeof question !== "string" || !question.trim() || question.length > MAX_QUESTION_CHARS) return null;
  const turns: ChatTurn[] = Array.isArray(history)
    ? history
        .filter(
          (t): t is ChatTurn =>
            !!t && (t.role === "user" || t.role === "assistant") && typeof t.content === "string" && t.content.trim().length > 0
        )
        .slice(-MAX_HISTORY_TURNS)
        .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_HISTORY_CHARS) }))
    : [];
  // Lịch sử phải bắt đầu bằng lượt của người dùng
  while (turns.length && turns[0].role !== "user") turns.shift();
  return { question: question.trim(), history: turns };
}

function formatExcerpts(hits: KnowledgeHit[]): string {
  if (hits.length === 0) return "(Không tìm thấy trích đoạn liên quan trong học liệu.)";
  return hits.map((h, i) => `[${i + 1}] ${h.text}\n    Nguồn: ${h.source}`).join("\n");
}

export async function POST(request: Request) {
  let parsed: ReturnType<typeof parseBody>;
  try {
    parsed = parseBody(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) {
    return NextResponse.json({ error: `Câu hỏi phải là chuỗi từ 1 đến ${MAX_QUESTION_CHARS} ký tự.` }, { status: 400 });
  }

  const { question, history } = parsed;
  const hits = searchKnowledge(question, 6);

  // Chưa cấu hình khóa API trên server: trả kết quả tra cứu nội bộ
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return NextResponse.json({ mode: "local", hits: hits.slice(0, 3) });
  }

  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.content })),
    {
      role: "user",
      content: `Trích đoạn học liệu:\n${formatExcerpts(hits)}\n\nCâu hỏi: ${question}`,
    },
  ];

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      // Hỏi đáp ngắn: effort thấp cho phản hồi nhanh; Opus 5.5 không cho tắt thinking
      output_config: { effort: "low" },
      // Khi bị bộ lọc an toàn từ chối, API tự chuyển sang model dự phòng phù hợp
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages,
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({
        mode: "claude",
        answer: "Trợ lý không thể trả lời câu hỏi này. Hãy đặt câu hỏi về nội dung kỹ thuật HVDC trong khóa học.",
        sources: [],
      });
    }

    const answer = response.content
      .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({ mode: "claude", answer, sources: hits.map(({ text, source }) => ({ text, source })) });
  } catch (error) {
    // Lỗi gọi API: vẫn trả kết quả tra cứu nội bộ để người học không bị chặn
    let reason = "Không gọi được dịch vụ AI.";
    if (error instanceof Anthropic.AuthenticationError) reason = "Khóa API trên server không hợp lệ.";
    else if (error instanceof Anthropic.RateLimitError) reason = "Dịch vụ AI đang quá tải, thử lại sau ít phút.";
    else if (error instanceof Anthropic.APIError) reason = `Dịch vụ AI trả lỗi ${error.status ?? ""}.`.trim();
    console.error("[api/chat]", error);
    return NextResponse.json({ mode: "local", notice: reason, hits: hits.slice(0, 3) });
  }
}
