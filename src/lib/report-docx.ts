import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  HeightRule,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { ReportEntry, ReportModel } from "@/lib/learning-report";

/**
 * Tạo file .docx từ mô hình báo cáo, chạy hoàn toàn trên trình duyệt (trang tĩnh, không có máy chủ).
 * Module này được import động khi bấm nút xuất, để thư viện docx không làm nặng trang.
 */

const EVN_BLUE = "164499";
const FONT = "Times New Roman";
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "B8C4DC" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
// Khổ A4, lề 2 cm: bề rộng vùng in ≈ 9.638 twip
const CONTENT_WIDTH = 9638;

const text = (t: string, opts: { bold?: boolean; italics?: boolean; color?: string; size?: number } = {}) =>
  new TextRun({ text: t, font: FONT, ...opts });

function cell(content: string, width: number, opts: { header?: boolean; align?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: BORDERS,
    shading: opts.header ? { type: ShadingType.CLEAR, color: "auto", fill: "E9EFFA" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ alignment: opts.align, children: [text(content, { bold: opts.header })] })],
  });
}

function table(columns: { title: string; width: number; center?: boolean }[], rows: string[][]) {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: columns.map((c) => c.width),
    rows: [
      new TableRow({ tableHeader: true, children: columns.map((c) => cell(c.title, c.width, { header: true, align: c.center ? AlignmentType.CENTER : undefined })) }),
      ...rows.map((r) => new TableRow({ children: r.map((v, i) => cell(v, columns[i].width, { align: columns[i].center ? AlignmentType.CENTER : undefined })) })),
    ],
  });
}

const heading = (t: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel]) => new Paragraph({ heading: level, children: [new TextRun(t)] });

const para = (t: string, opts: { italics?: boolean } = {}) => new Paragraph({ spacing: { after: 80 }, children: [text(t, opts)] });

function entryList(label: string, entries: ReportEntry[]) {
  if (entries.length === 0) return [];
  return [
    new Paragraph({ spacing: { before: 120, after: 60 }, children: [text(label, { bold: true })] }),
    ...entries.map(
      (e) =>
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 60 },
          children: [text(e.text), text(`  (${e.dateText})`, { italics: true, color: "667189", size: 22 })],
        })
    ),
  ];
}

export function buildReportDocument(m: ReportModel): Document {
  const quizText =
    m.quiz.best === null
      ? "Chưa làm bài kiểm tra"
      : `${m.quiz.best}/${m.quiz.total} câu đúng (điểm cao nhất), ${m.quiz.passed ? "đạt" : "chưa đạt"} yêu cầu ${m.quiz.passPercent}%`;

  const lessonsWithNotes = m.lessons.filter((l) => l.notes.length + l.questions.length > 0);

  return new Document({
    creator: "Nghiên cứu HVDC",
    title: m.title,
    // Khai báo style Heading để Word hiện cấu trúc đề mục (Navigation Pane) và mục lục
    styles: {
      default: {
        document: { run: { font: FONT, size: 26 } },
        heading2: { run: { font: FONT, size: 28, bold: true, color: EVN_BLUE }, paragraph: { spacing: { before: 280, after: 120 } } },
        heading3: { run: { font: FONT, size: 26, bold: true, color: EVN_BLUE }, paragraph: { spacing: { before: 200, after: 80 } } },
      },
    },
    sections: [
      {
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  text("Xuất từ nền tảng Nghiên cứu HVDC · Trang ", { size: 20, color: "667189" }),
                  new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20, color: "667189" }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [text(m.title.toUpperCase(), { bold: true, size: 32, color: EVN_BLUE })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [text("Truyền tải điện một chiều cao áp (HVDC)", { italics: true })],
          }),

          table(
            [
              { title: "Thông tin", width: 2900 },
              { title: "Nội dung", width: CONTENT_WIDTH - 2900 },
            ],
            [
              ["Học viên", m.learnerName || "(chưa nhập)"],
              ["Đơn vị", m.unit || "(chưa nhập)"],
              ["Phạm vi", m.scopeLabel],
              ["Thời điểm xuất", m.dateText],
            ]
          ),

          heading("1. Tổng quan tiến độ", HeadingLevel.HEADING_2),
          para(`Hoàn thành ${m.completedCount}/${m.totalLessons} bài học, tiến độ khóa học ${m.progressPercent}%.`),
          para(`Bài kiểm tra: ${quizText}.`),

          heading("2. Kết quả theo bài", HeadingLevel.HEADING_2),
          table(
            [
              { title: "Bài", width: 900, center: true },
              { title: "Tên bài", width: 5338 },
              { title: "Trạng thái", width: 1600, center: true },
              { title: "Ghi chú", width: 900, center: true },
              { title: "Câu hỏi", width: 900, center: true },
            ],
            m.lessons.map((l) => [
              l.id,
              l.title.replace(/^Bài [\d.]+: /, ""),
              l.done ? "Đã học" : "Chưa học",
              String(l.notes.length),
              String(l.questions.length),
            ])
          ),

          heading("3. Ghi chú và câu hỏi của học viên", HeadingLevel.HEADING_2),
          ...(lessonsWithNotes.length === 0
            ? [para("Học viên chưa ghi chú hoặc đặt câu hỏi.", { italics: true })]
            : lessonsWithNotes.flatMap((l) => [
                heading(l.title, HeadingLevel.HEADING_3),
                ...entryList("Ghi chú:", l.notes),
                ...entryList("Câu hỏi gửi giảng viên:", l.questions),
              ])),

          new Paragraph({ spacing: { before: 360 }, children: [] }),
          // Ô trống để giảng viên ghi nhận xét khi in
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: [CONTENT_WIDTH],
            rows: [
              new TableRow({ children: [cell("Nhận xét của giảng viên", CONTENT_WIDTH, { header: true })] }),
              new TableRow({ height: { value: 1700, rule: HeightRule.ATLEAST }, children: [cell("", CONTENT_WIDTH)] }),
            ],
          }),
        ],
      },
    ],
  });
}

/** Tạo file và kích hoạt tải xuống trên trình duyệt */
export async function downloadReport(m: ReportModel): Promise<void> {
  const blob = await Packer.toBlob(buildReportDocument(m));
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = m.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
