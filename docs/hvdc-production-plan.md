# Bảng Production – WebApp Nghiên Cứu HVDC

> Đối chiếu `docs/hvdc-webapp-specification.md` với mã nguồn trong `src/`.
> Agent planner (everything-claude-code) phân tích khoảng trống. Cột **Trạng thái** ghi kết quả sau hai đợt triển khai ngày 27/10/2026: đợt 1 sửa lỗi và thêm tương tác, đợt 2 làm theo thứ tự Phase 0–6 của planner.
> Kiểm chứng đợt 2: `npm test` cho 33/33 test pass, `tsc --noEmit` sạch, `next build` thành công (17 trang, lint qua). QA headless ở 1440px và 390px: không tràn ngang, lỗi console chỉ đến từ hai test cố ý (trang 404, API nhận body sai).

## A. Lỗi đã phát hiện trong mã cũ

| # | Vị trí (mã cũ) | Lỗi | Trạng thái |
|---|---|---|---|
| 1 | `hvdc-math.ts` – `calculateVd` | `Vd0 = (3/π)·vMax·√3`, nhân thừa √3. Với "500 kV" cho ra 827 kV | ✅ `Vd0 = 3√2/π·V_LL` (×2 khi dùng cầu 12 xung). Có unit test |
| 2 | `hvdc-math.ts` | `rippleFrequency` gán cứng 300 Hz | ✅ `p·f`. Có unit test |
| 3 | `hvdc-math.ts` – `generateWaveformData` | Vd(t) là sin giả, tại α = 90° gợn bằng 0 | ✅ Dựng lại cầu Graetz có μ. Unit test xác nhận trung bình số khớp giải tích (sai số ≤ 1%) và α = 90° vẫn còn gợn |
| 4 | `hvdc-math.ts` | Code chết; biên độ pha `vMax·0.6` tùy ý | ✅ Đã xóa; biên độ pha = √2·V_LL/√3. Có unit test |
| 5 | `WaveformCanvas.tsx` | μ gán cứng, γ tính lệch nhau giữa các chỗ | ✅ Có thanh trượt μ; γ lấy từ thư viện |
| 6 | `WaveformCanvas.tsx` | Trục Y cố định, sóng bị cắt | ✅ Trục co giãn theo Vd0 |
| 7 | `WaveformCanvas.tsx` | LaTeX hiển thị nguyên văn | ✅ Công thức trong bài học render bằng KaTeX (`Formula.tsx`) |
| 8 | `SingleLineDiagram.tsx` | L_dc2 mở dữ liệu L_dc1 | ✅ Thêm bản ghi `smoothing-reactor-2`. Có unit test |
| 9 | `SingleLineDiagram.tsx` | Mũi tên tĩnh; Back-to-Back chỉ đổi nhãn; `setPowerFlowMW` không dùng tới | ✅ |
| 10 | `layout.tsx` | Không có điều hướng trên mobile; `py-0.2` không hợp lệ | ✅ |
| 11 | `tailwind.config.js` | `content` thiếu thư mục; font chưa nạp | ✅ |
| 12 | `types/hvdc.ts` | `QuizQuestion.category` không khớp spec | ✅ `topic` |

## B. Bảng production

Chú thích: ✅ Hoàn thành · 🟡 Hoàn thành một phần · ⬜ Chưa làm

| ID | Hạng mục | Yêu cầu theo spec | Việc đã làm / còn lại | Ưu tiên | Giờ | Tiêu chí nghiệm thu | Trạng thái |
|---|---|---|---|---|---|---|---|
| UI-01 | Sidebar 4 cấp | Điều hướng 4 cấp độ và các bài con | `LessonSidebar`: 4 cấp, 10 bài, đánh dấu bài đang mở và bài đã học, thanh tiến độ. Trên mobile là drawer | P0 | 3 | Thấy đủ 4 cấp, 10 bài; bấm vào mở đúng route | ✅ |
| UI-02 | Thanh tiến độ ở header | Progress bar | `HeaderProgressBar` và chỉ số % | P0 | 2 | % cập nhật ngay | ✅ |
| UI-03 | Nút Trợ lý AI | Nút ở header | Mở panel trợ lý | P1 | 0,5 | Mở/đóng, ESC | ✅ |
| UI-04 | Dark theme | Slate/Zinc + Cyan/Emerald/Amber | Giữ palette; font Be Vietnam Pro và JetBrains Mono; viền focus rõ | P2 | 0,5 | Build không mất class | ✅ |
| UI-05 | Responsive | Mobile-friendly | Menu mobile, mục lục dạng drawer; đo ở 390px không tràn ngang | P0 | 2 | Dùng được ở 375px | ✅ |
| UI-06 | Nhận diện EVNNPT | Giao diện theo thương hiệu đơn vị | Màu đo từ logo EVNNPT (xanh `#164499`, đỏ `#FE0000`, vàng `#FFE600`); nền sáng mặc định, có nút chuyển nền tối navy (lưu lựa chọn, không chớp màu khi tải); dải nhận diện xanh/đỏ, gạch chân đỏ cho mục đang mở; mô phỏng và footer luôn là màn hình HMI tối; khung logo `public/brand/evnnpt-logo.*` (chưa có file thì hiện chữ EVNNPT). Còn lại: đặt logo chính thức của PTC3 | P1 | 4 | Hai theme hiển thị đúng, không tràn ngang ở 390px | 🟡 (chờ logo) |
| CT-01..10 | Bài 1.1 – 4.2 | Trang cho 10 bài | Route `/learn/[level]/[lesson]` prerender sẵn 10 trang: ý chính, công thức KaTeX, mô phỏng nhúng theo bài (1.2/1.3 SLD, 2.1/2.3 lab sóng, 3.1/4.2 V-I), nút bài trước/sau (sang bài tiếp thì tự đánh dấu đã học), nút hỏi trợ lý. URL sai trả 404. Còn lại: chuyên gia duyệt nội dung | P0/P1 | 9,5 | 10 route render, có "Đánh dấu hoàn thành", có tham chiếu EVNNPT | ✅ (chờ duyệt nội dung) |
| SIM-01 | Thanh trượt α 0–180° | Kéo góc kích | `useDeferredValue` | P1 | 0,5 | Phản hồi < 100 ms | ✅ |
| SIM-02 | 6/12 xung | Gợn 6f/12f | Mô hình cầu Graetz có μ | P0 | 3 | Trung bình số lệch ≤ 1% (unit test) | ✅ |
| SIM-03 | Số đo Vd, ripple, Q | Vd, Ripple Factor, Q ≈ P·tan φ | Đủ các số đo, kèm cảnh báo γ | P0 | 1,5 | α = 60° (6 xung) → Vd = 141,8 kV (unit test) | ✅ |
| SIM-04 | Tô vùng chuyển mạch | Tô khoảng μ | `ReferenceArea` | P1 | 2 | Vùng μ đổi theo α, μ | ✅ |
| SIM-05 | Máy hiện sóng ở hero | (bổ sung) | `HeroScope` | P1 | 2 | Hoạt hình chạy, không lỗi | ✅ |
| SIM-06 | Trang `/simulator` | (planner Phase 4) | Gom 3 phòng lab vào một trang, có mục nhảy nhanh | P1 | 1 | 3 section render | ✅ |
| VI-01 | Đặc tính V-I | Điểm làm việc dịch giữa CC, CEA, chế độ chuyển | `VICharacteristic` cùng 4 tình huống; logic có unit test. Còn lại: vẽ đường VDCOL; vùng chuyển tiếp hiện rất hẹp (xem C.3) | P0 | 4 | Sụt áp AC chỉnh lưu → nghịch lưu giữ dòng | ✅ |
| SLD-01 | Bảng chi tiết thiết bị | Drawer/Modal | Có animation, ESC, dùng được bằng bàn phím | P1 | 2 | Mỗi khối có dữ liệu riêng | ✅ |
| SLD-02 | Chuyển cấu hình | Mono/Bi/BtB | Back-to-Back vẽ thành một trạm, ẩn bộ lọc DC | P1 | 2 | Mỗi cấu hình có hình khác nhau | ✅ |
| SLD-03 | Dòng công suất động | Mũi tên chạy | Vạch chạy theo công suất, hồi lưu chạy ngược | P1 | 1,5 | Tắt khi OFF / giảm chuyển động | ✅ |
| QZ-01 | 10 câu trắc nghiệm | Theo chủ đề | 10 câu, đủ 4 chủ đề (unit test) | P0 | 2 | Đủ LCC/VSC/Protection/Filters | ✅ |
| QZ-02 | Phản hồi tức thì, chấm điểm | | `HvdcQuizModule` và trang `/quiz` | P0 | 3 | Phản hồi ngay | ✅ |
| QZ-03 | Huy hiệu ≥ 80% | | Lưu vào store tiến độ | P1 | 1 | 8/10 nhận, 7/10 không | ✅ |
| AI-01 | Trợ lý AI | Chatbot grounded RAG | `POST /api/chat`: tìm 6 trích đoạn liên quan nhất trong học liệu của app (bài học, thiết bị, lời giải quiz), gửi kèm câu hỏi cho Claude (`claude-opus-5-5`, effort `low`, dự phòng `fallbacks: "default"` khi bị từ chối), trả lời có số trích dẫn. Chưa có `ANTHROPIC_API_KEY` hoặc API lỗi thì trả kết quả tra cứu nội bộ. Còn lại: đưa PDF/DOCX trong `docs/references` vào kho tìm kiếm | P1 / P2 | 2 / 12+ | Hỏi "gamma" → định nghĩa kèm nguồn | 🟡 |
| QA-01 | Độ đúng công thức | Vd0, Vd, γ, Q | Vitest: 20 test cho `hvdc-math` và 13 test cho nội dung, route, tìm kiếm. Chạy bằng `npm test` | P0 | 2 | Test pass với giá trị chuẩn | ✅ |
| QA-02 | 60 FPS | | Đã tối ưu (`useDeferredValue`, tắt animation đồ thị, rAF tạm dừng khi khuất màn hình). Còn lại: đo bằng DevTools | P1 | 1 | ≥ 55 fps | 🟡 |
| QA-03 | Phản hồi < 100 ms | | Chưa đo bằng React Profiler | P1 | 0,5 | Commit < 16 ms | ⬜ |
| QA-04 | Thuật ngữ, KaTeX | Đồng bộ EVNNPT | KaTeX cho công thức; trên trang chủ KaTeX được tải lười (First Load giảm từ 352 xuống 277 kB). Còn lại: chuyên gia duyệt | P1 | 1,5 | Công thức render đúng | 🟡 |
| ST-01 | Lưu tiến độ | Zustand persist | `src/store/progress.ts` (zustand + persist, `skipHydration` để không lệch hydration); giữ khóa cũ `hvdc-progress-v1` và tự chuyển định dạng | P0 | 1,5 | Tải lại vẫn giữ tiến độ | ✅ |
| DT-01 | Tách dữ liệu | (planner Phase 1) | `src/data/curriculum.ts`, `quiz.ts`, `equipment.ts`; `hvdc-math.ts` vẫn re-export CSDL thiết bị | P1 | 1 | Import cũ vẫn chạy | ✅ |

## C. Việc còn lại

1. **Bật trợ lý Claude:** đặt `ANTHROPIC_API_KEY` trong `.env.local` (chỉ phía server), rồi khởi động lại. Mỗi câu hỏi là một lượt gọi API có tính phí.
2. **RAG trên tài liệu gốc:** trích văn bản từ PDF/DOCX trong `docs/references` thành các đoạn nhỏ và đưa vào `knowledge-search` (hoặc dùng embedding).
3. **Đặc tính V-I:** hai đường α_min (độ dốc −0,08) và CEA (−0,06) gần như song song, nên vùng "chuyển tiếp" chỉ xuất hiện khi điện áp AC chỉnh lưu nằm trong khoảng 0,9255–0,9273 pu. Cần chuyên gia xác nhận độ dốc theo tài liệu. Cần thêm đường VDCOL.
4. **Đo hiệu năng** (QA-02, QA-03).
5. **Chuyên gia duyệt** 10 bài và 10 câu quiz.

## D. Bản đồ file

| File | Vai trò |
|---|---|
| `src/lib/hvdc-math.ts` | Mô hình cầu Graetz, số đo điện, đặc tính V-I |
| `src/lib/lesson-routes.ts` | Slug, URL, bài trước/sau |
| `src/lib/knowledge-search.ts` | Tìm kiếm học liệu (bỏ dấu, mở rộng ký hiệu) |
| `src/data/curriculum.ts` · `quiz.ts` · `equipment.ts` | Nội dung |
| `src/store/progress.ts` | Store zustand: tiến độ, trạng thái trợ lý |
| `src/app/learn/…` · `src/app/simulator` · `src/app/quiz` | Các route mới |
| `src/app/api/chat/route.ts` | API trợ lý (Claude + RAG, có fallback nội bộ) |
| `src/components/lesson/LessonSidebar.tsx` · `LessonView.tsx` | Khung trang bài học |
| `src/components/ui/Formula.tsx` · `RangeSlider.tsx` | Thành phần dùng chung |
| `src/lib/__tests__/*.test.ts` · `vitest.config.mts` | Unit test |
