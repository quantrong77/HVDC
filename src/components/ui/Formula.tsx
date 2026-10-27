import React from "react";
import katex from "katex";

interface FormulaProps {
  tex: string;
  display?: boolean;
  className?: string;
}

/** Render công thức LaTeX bằng KaTeX (chạy được cả ở server lẫn client, không cần JS phía trình duyệt) */
export default function Formula({ tex, display = false, className }: FormulaProps) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: display, output: "html" });
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
