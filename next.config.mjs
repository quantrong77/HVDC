/**
 * GITHUB_PAGES=true: xuất trang tĩnh vào out/ để triển khai lên https://quantrong77.github.io/HVDC
 * (xem .github/workflows/deploy-pages.yml). Chạy dev/build bình thường thì giữ server Next đầy đủ, có /api/chat.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? process.env.PAGES_BASE_PATH ?? "/HVDC" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isPages && {
    output: "export",
    basePath,
    trailingSlash: true, // learn/1/1-1/index.html - GitHub Pages phục vụ thư mục ổn định hơn file không đuôi
    images: { unoptimized: true },
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // Bản tĩnh không có server: trợ lý dùng tra cứu nội bộ thay vì gọi /api/chat
    NEXT_PUBLIC_ASSISTANT_API: isPages ? "off" : "on",
  },
};

export default nextConfig;
