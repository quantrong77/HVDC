# BỘ MÔ TẢ YÊU CẦU VÀ KỊCH BẢN PHÁT TRIỂN WEBAPP HỌC TẬP KIẾN THỨC HVDC
> **Mục tiêu:** Tài liệu thiết kế kĩ thuật (PRD & AI Prompt Engineering Blueprint) dùng để nạp cho các công cụ AI Coding (Cursor, Claude Code, Bolt.new, v0, ChatGPT) hỗ trợ lập trình tự động WebApp đào tạo công nghệ Truyền tải Điện một chiều Điện áp cao (HVDC) từ cơ bản đến nâng cao.
> **Căn cứ nội dung:** Dựa trên khung chương trình và tài liệu đào tạo EVNNPT (Truyền tải điện Quốc gia).

---

## I. TỔNG QUAN DỰ ÁN WEBAPP (PROJECT OVERVIEW)

### 1. Tên dự án gợi ý
- **HVDC Academy Interactive** / **HVDC EduSim Platform**

### 2. Sứ mệnh & Mục tiêu
- **Mục tiêu:** Cung cấp nền tảng học tập trực quan, tương tác cao về công nghệ truyền tải HVDC, kết hợp giữa lý thuyết chuẩn hóa của EVNNPT, hình ảnh mô phỏng 2D/3D trạm biến áp, và công cụ mô phỏng dạng sóng điện tử công suất thời gian thực.
- **Đối tượng người dùng:** Kĩ sư điện, cán bộ vận hành hệ thống điện, sinh viên chuyên ngành Hệ thống điện & Điện tử công suất.

---

## II. LỘ TRÌNH NỘI DUNG ĐÀO TẠO (CURRICULUM ARCHITECTURE)
*Nội dung được cấu trúc chuẩn hóa theo 4 cấp độ từ các chuyên đề tài liệu EVNNPT:*

### Cấp độ 1: Tổng quan & Cơ sở LÝ thuyết HVDC (Cơ bản)
*(Tham chiếu tài liệu: Tong quan HVDC 1, 2, 3 & Co hoi thach thuc HVDC)*
1. **Bài 1.1: Bối cảnh & So sánh HVAC vs HVDC**
   - So sánh truyền tải xoay chiều (HVAC) và một chiều (HVDC): Khoảng cách kinh tế (Break-even distance), tổn thất đường dây, dòng sạc cáp ngầm/cáp biển.
   - Thách thức và cơ hội giải tỏa công suất nguồn năng lượng tái tạo (Điện gió ngoài khơi, Điện mặt trời).
2. **Bài 1.2: Các Cấu hình Hệ thống HVDC Cơ bản**
   - Đơn cực (Monopolar - Truyền qua đất/biển hoặc dây về).
   - Hai cực (Bipolar - Với điểm nối đất trung tính).
   - Khâu nối lưng đối lưng (Back-to-Back HVDC - Liên kết hai hệ thống AC không đồng bộ).
   - Đa cực (Multi-terminal HVDC).
3. **Bài 1.3: Cấu trúc Tổng thể Trạm Biến đổi HVDC (Converter Station Layout)**
   - Sơ đồ trạm biến đổi: Máy biến áp đổi nối (Converter Transformer), Van chỉnh lưu/nghịch lưu, Cuộn cảm san bằng (Smoothing Reactor), Bộ lọc AC/DC (Filters), Sân phân phối AC/DC.

### Cấp độ 2: Điện tử Công suất trong HVDC (Trung cấp)
*(Tham chiếu tài liệu: Dien tu CS trong HVDC & HVDC PLUS - Siemens VSC)*
1. **Bài 2.1: Công nghệ LCC (Line Commutated Converter - Bàn đổi nối theo chu kỳ lưới)**
   - Linh kiện Thyristor, cấu trúc Cầu 6 xung (6-pulse bridge) và Cầu 12 xung (12-pulse bridge).
   - Nguyên lý chuyển mạch (Commutation process), góc kích $\alpha$, góc dập $\gamma$, nguy cơ thất bại chuyển mạch (Commutation failure) ở nghịch lưu.
2. **Bài 2.2: Công nghệ VSC (Voltage Source Converter - Nguồn điện áp)**
   - Linh kiện IGBT, công nghệ MMC (Modular Multilevel Converter - HVDC PLUS).
   - Ưu điểm của VSC: Điều khiển độc lập công suất chủ động (P) và phản kháng (Q), khả năng Khởi động đen (Black start), không đòi hỏi điện áp lưới AC khỏe.
3. **Bài 2.3: Sóng hài & Bộ lọc (Harmonics & Filtering)**
   - Phân tích sóng hài phía AC ($5^{th}, 7^{th}, 11^{th}, 13^{th}, \dots$) và phía DC ($6^{th}, 12^{th}, \dots$).
   - Thiết kế bộ lọc AC (Tuned filter, High-pass filter) và Tụ bù công suất phản kháng.

### Cấp độ 3: Điều khiển & Bảo vệ Hệ thống HVDC (Nâng cao)
*(Tham chiếu tài liệu: Dieu khien bao ve HVDC)*
1. **Bài 3.1: Chiêu thức Điều khiển Vòng kín HVDC**
   - Đặc tính $V-I$ của Trạm Chỉnh lưu (Rectifier) và Trạm Nghịch lưu (Inverter).
   - Điều khiển Dòng điện Hằng số (Constant Current - CC), Điều khiển Điện áp DC Hằng số (Constant Voltage - CV), Điều khiển Góc dập Tối thiểu (Minimum Gamma Control).
   - Chuyển đổi chế độ điều khiển tự động khi xảy ra sự cố sụt áp lưới AC.
2. **Bài 3.2: Hệ thống Bảo vệ Trạm & Đường dây HVDC**
   - Bảo vệ quá dòng van, Bảo vệ dòng vi sai cực DC (DC pole differential protection).
   - Bảo vệ sóng truyền (Traveling wave protection) trên đường dây DC.
   - Tương tác AC/DC, Hiện tượng cộng hưởng dưới đồng bộ (SSR - Sub-synchronous Resonance).

### Cấp độ 4: Thực hành & Vận hành Trạm Thực tế (Specialist)
*(Tham chiếu tài liệu: Bài giảng HVDC - EVNNPT & Trạm 220kV Thái Nguyên)*
1. **Bài 4.1: Quy trình Vận hành & Thao tác Chuyển nấc Máy biến áp**
2. **Bài 4.2: Case Study Dự án Thực tế & Mô phỏng Sự cố (Fault Troubleshooting)**

---

## III. THIẾT KẾ KIẾN TRÚC KĨ THUẬT WEBAPP (TECHNICAL ARCHITECTURE)

### 1. Technology Stack đề xuất
- **Frontend Framework:** Next.js 14+ (App Router, TypeScript)
- **UI / Styling:** Tailwind CSS, Shadcn UI, Lucide Icons, Framer Motion
- **Interactive Visualizations & Simulations:**
  - `Recharts` / `Chart.js` / `Canvas API`: Vẽ dạng sóng điện áp/dòng điện AC/DC, góc kích $\alpha$, $V-I$ curve.
  - `React Flow` / `SVG`: Sơ đồ đơn tuyến HVDC tương tác (Interactive Single Line Diagram).
  - `Three.js` / `React Three Fiber`: Mô hình 3D tương tác Trạm biến áp HVDC.
- **State Management:** Zustand / React Context
- **AI Tutor Integration:** OpenAI / Claude API / Gemini API (Sử dụng RAG pipeline với kiến thức HVDC NPT).

### 2. Các Tính năng Trọng tâm (Core Features)
1. **Interactive Single Line Diagram (SLD):** Người dùng nhấp vào từng thiết bị (Van Thyristor, Máy biến áp, Cuộn cảm san bằng, Bộ lọc) để xem thông số kĩ thuật, sơ đồ nguyên lý và video/hình ảnh thực tế.
2. **Live Waveform & Circuit Simulator:**
   - Điều chỉnh thanh trượt góc kích $\alpha$ ($0^\circ \to 180^\circ$) để quan sát dạng sóng điện áp DC ngõ ra của cầu 6 xung / 12 xung.
   - Tương tác đặc tính $V-I$: Thay đổi phụ tải lưới để xem điểm làm việc (Operating Point) dịch chuyển giữa các vùng điều khiển.
3. **HVDC Configuration Switcher:** Bật/tắt giữa các cấu hình Monopolar, Bipolar, Back-to-back để xem dòng điện chạy qua đất hoặc qua dây dẫn trong thời gian thực.
4. **AI HVDC Assistant (Trợ lý AI Trực tuyến):** Chatbot trả lời câu hỏi kĩ thuật grounded dựa trên tài liệu HVDC NPT 2025.
5. **Interactive Quiz & Testing Engine:** Ngân hàng câu hỏi trắc nghiệm tự luận theo cấp độ, chấm điểm tự động và phản hồi giải thích đáp án.

---

## IV. BỘ PROMPT MẪU ĐỂ RA LỆNH CHO AI BUILDER (AI PROMPT BLUEPRINTS)

> *Sao chép các đoạn Prompt dưới đây và dán vào Cursor, Claude Code, Bolt.new hoặc ChatGPT để tiến hành dựng app từng bước.*

### PROMPT 1: Khởi tạo Cấu trúc Dự án & UI Shell
```text
Role: Senior Full-Stack Engineer specializing in Educational Web Applications.
Task: Create a Next.js 14 (App Router) project with TypeScript, Tailwind CSS, and Shadcn UI for an "HVDC Learning WebApp" named HVDC-Academy.

Requirements:
1. Setup layout with Sidebar navigation containing 4 learning levels:
   - Level 1: Fundamentals & System Overview (HVAC vs HVDC, Topologies)
   - Level 2: Power Electronics (LCC, VSC, MMC, Thyristor/IGBT, Harmonics)
   - Level 3: Control & Protection (V-I Characteristics, CC/CV control, Protections)
   - Level 4: Practical Station & Case Studies (Transformer, Reactors, Operations)
2. Include a Dark Mode technical theme (Slate/Zinc palette with Electric Cyan/Amber accent colors).
3. Header should contain Progress Bar, User Profile status, and an "AI Assistant" trigger button.
4. Provide responsive, mobile-friendly design.

Please generate the base directory structure and `app/layout.tsx`, `app/page.tsx`, and sidebar components.
```

### PROMPT 2: Module Mô phỏng Tương tác Dạng sóng Điện tử Công suất (Waveform Simulator)
```text
Role: Interactive Data Visualization Expert in Power Electronics.
Task: Build a React component `ThyristorBridgeSimulator.tsx` using HTML5 Canvas or Chart.js/Recharts.

Requirements:
1. Allow user to adjust Alpha angle (Triggering Angle) via a slider from 0° to 180°.
2. Allow user to toggle between 6-Pulse Bridge and 12-Pulse Bridge.
3. Render live animated graphs:
   - AC 3-Phase Voltage Input (Sinusoidal).
   - DC Output Voltage waveform calculated via equation: V_dc = V_do * cos(alpha).
   - Highlight commutation periods and ripple frequency (6x or 12x line frequency).
4. Show key calculated metrics dynamically: Average DC Voltage (Vdc), Ripple Factor, Reactive Power demand (Q ~ P * tan(alpha)).
5. Code must be clean, modular, fully typed with TypeScript, and styled with Tailwind CSS.
```

### PROMPT 3: Sơ đồ Đơn tuyến Tương tác (Interactive HVDC Single Line Diagram)
```text
Role: Frontend Developer with React Flow / SVG expertise.
Task: Build an `InteractiveHvdcSld.tsx` component representing a Bipolar HVDC Transmission System.

Requirements:
1. Display interactive visual blocks:
   - AC Grid 1 -> Converter Transformer 1 -> Rectifier Station (LCC/VSC) -> Smoothing Reactor -> DC Overhead Line / Subsea Cable -> Smoothing Reactor -> Inverter Station -> Converter Transformer 2 -> AC Grid 2.
2. User interaction:
   - Clicking any block opens a detailed Drawer/Modal with technical descriptions derived from EVNNPT training materials.
   - Toggle switch for "System Mode": Monopolar (Earth return) vs Bipolar vs Back-to-Back.
   - Animated current flow arrows along the DC line showing direction of power flow (P_rectifier -> P_inverter).
```

### PROMPT 4: Module Đánh giá & Câu hỏi Trắc nghiệm Tương tác (Quiz Engine)
```text
Role: EdTech UX Specialist.
Task: Build a Quiz Engine component `HvdcQuizModule.tsx`.

Requirements:
1. Support Multiple Choice Questions (MCQ) categorized by topic (LCC, VSC, Protection, Filters).
2. Show immediate feedback upon answer submission with detailed technical explanations.
3. Calculate final score, track correct/incorrect answers, and award badge certificates upon 80%+ pass rate.
4. Include mock dataset with 10 high-quality HVDC questions (e.g., comparing LCC vs VSC commutation, extinction angle gamma, 12-pulse harmonic elimination).
```

---

## V. NGUYÊN TẮC KIỂM THỬ VÀ ĐẢM BẢO CHẤT LƯỢNG (QA & VALIDATION)
1. **Kiểm tra tính chính xác kĩ thuật:** Công thức tính $V_{dc} = \frac{3\sqrt{2}}{\pi} V_{LL} \cos\alpha$, đặc tính $V-I$ và các bậc sóng hài phải tuân thủ đúng lý thuyết điện tử công suất chuẩn.
2. **Trải nghiệm người dùng (UX):** Mô phỏng chạy mượt mà trên 60 FPS, giao diện phản hồi nhanh (<100ms) khi kéo thanh trượt thông số.
3. **Độ tin cậy nội dung:** Mọi thuật ngữ và ký hiệu kĩ thuật đồng bộ tuyệt đối với bộ tài liệu đào tạo EVNNPT.
