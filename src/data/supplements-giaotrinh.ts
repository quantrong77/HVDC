import type { LessonSupplement, SupplementSection } from "@/data/supplements";

/**
 * Nội dung Cấp độ 0, tổng hợp từ Giáo trình Điện tử công suất ứng dụng trong HVDC
 * (docs/giao-trinh-dien-tu-cong-suat-hvdc.md). Giáo trình viết Ud, ULL theo IEC 60633; app thống nhất ký hiệu Vd, V_LL.
 */

const GT_SOURCE = "Giáo trình Điện tử công suất ứng dụng trong HVDC (v1.1, 28/10/2026)";
const GT_AUTHOR =
  "Tài liệu biên soạn cho khóa học. Nguồn chính: Mohan–Undeland–Robbins, Rashid, Arrillaga, Kundur, Kim–Sood, Baliga, Kimbark, Yazdani–Iravani; IEC 60633, IEC 60700-1, IEEE Std 1204";

const gt = (lessonId: string, pages: string, sections: SupplementSection[]): LessonSupplement => ({
  lessonId,
  source: GT_SOURCE,
  author: GT_AUTHOR,
  pages,
  sections,
});

export const GIAOTRINH_SUPPLEMENTS: LessonSupplement[] = [
  gt("0.1", "Chương 1–2", [
    {
      heading: "Quy ước ký hiệu (IEC 60633)",
      points: [
        "Mọi góc tính bằng độ điện. Các góc α, β, γ đều đo từ điểm chuyển mạch tự nhiên, nơi điện áp trên van đổi dấu.",
        "Trạm chỉnh lưu được điều khiển bằng α, trạm nghịch lưu bằng β hoặc γ. Hai đầu cùng chịu ảnh hưởng của góc trùng dẫn μ.",
      ],
      table: {
        columns: ["Ký hiệu", "Tên gọi", "Đơn vị"],
        rows: [
          ["α", "Góc kích trễ (delay angle), tính từ điểm chuyển mạch tự nhiên", "°"],
          ["μ", "Góc trùng dẫn (overlap angle)", "°"],
          ["β", "Góc kích sớm (advance angle), β = 180° − α", "°"],
          ["γ", "Góc tắt (extinction angle), γ = β − μ", "°"],
          ["Vd0", "Điện áp một chiều không tải lý tưởng của cầu 6 xung", "kV"],
          ["Id", "Dòng điện một chiều", "kA"],
          ["Xc", "Điện kháng chuyển mạch, chủ yếu là điện kháng tản MBA chuyển đổi", "Ω"],
          ["V_LL", "Điện áp dây hiệu dụng phía van của MBA chuyển đổi", "kV"],
        ],
      },
      note: "Giáo trình gốc viết Ud, Ud0, ULL theo IEC 60633 (U là điện áp). Ứng dụng thống nhất ký hiệu Vd, Vd0, V_LL như các cấp độ khác; hai cách viết cùng một đại lượng.",
    },
    {
      heading: "Bốn dạng biến đổi cơ bản",
      points: [
        "Linh kiện chỉ ở hai trạng thái, dẫn hoặc khóa, không làm việc ở vùng khuếch đại. Nhờ vậy bộ biến đổi có tổn hao thấp.",
      ],
      table: {
        columns: ["Dạng", "Vào → Ra", "Ví dụ ứng dụng"],
        rows: [
          ["Chỉnh lưu", "AC → DC", "Trạm chỉnh lưu HVDC, nạp ắc quy, kích từ máy phát"],
          ["Nghịch lưu", "DC → AC", "Trạm nghịch lưu HVDC, inverter điện mặt trời, biến tần"],
          ["Biến đổi DC–DC", "DC → DC", "Bộ băm áp, nguồn xung, DC breaker lai"],
          ["Biến đổi AC–AC", "AC → AC", "Bộ điều áp xoay chiều, TCR/TSC trong SVC, cycloconverter"],
        ],
      },
    },
    {
      heading: "Hai công nghệ HVDC",
      points: [
        "HVDC được chọn khi:",
        "Đường dây trên không rất dài (thường trên 600–800 km), hoặc cáp ngầm, cáp biển dài trên 50–80 km.",
        "Cần liên kết hai hệ thống không đồng bộ hoặc khác tần số (back-to-back).",
        "Cần điều khiển công suất nhanh và chính xác.",
        "Khái niệm góc kích α, β, γ có ý nghĩa trực tiếp ở LCC, nên Cấp độ 0 dành nhiều bài cho LCC. PWM, điều khiển vector và MMC ở bài 0.7.",
      ],
      table: {
        columns: ["Tiêu chí", "LCC", "VSC"],
        rows: [
          ["Linh kiện", "Thyristor (chỉ điều khiển được lúc mở)", "IGBT/IGCT (điều khiển cả mở và tắt)"],
          ["Chuyển mạch", "Nhờ điện áp lưới AC", "Cưỡng bức, theo PWM hoặc MMC"],
          ["Đại lượng điều khiển", "Góc kích α (chỉnh lưu), γ (nghịch lưu)", "Biên độ và góc pha điện áp ra"],
          ["Công suất phản kháng", "Tiêu thụ 50–60% P, cần bù", "Điều khiển độc lập P và Q"],
          ["Đảo chiều công suất", "Đảo cực tính điện áp", "Đảo chiều dòng điện"],
          ["Lưới yếu (SCR thấp)", "Khó, nguy cơ sự cố chuyển mạch", "Tốt, có thể khởi động đen"],
          ["Lớn nhất hiện nay", "Đến ±1100 kV, khoảng 12 GW", "Khoảng ±525–640 kV, 2–3 GW"],
        ],
      },
    },
    {
      heading: "Cấu trúc một cực trạm LCC",
      points: [
        "Thứ tự từ lưới vào:",
        "Thanh cái AC.",
        "Bộ lọc AC, đồng thời là tụ bù.",
        "MBA chuyển đổi gồm một bộ Y/Y và một bộ Y/Δ.",
        "Hai cầu 6 xung nối tiếp thành cầu 12 xung, mỗi cầu có 6 van thyristor.",
        "Cuộn kháng san bằng, bộ lọc DC và đường dây hoặc cáp DC.",
        "Cầu 12 xung là khâu duy nhất được điều khiển. Trạm chỉnh lưu dùng α để đặt dòng Id. Trạm nghịch lưu dùng β, thông qua γ, để giữ điện áp DC.",
      ],
    },
    {
      heading: "Vật liệu bán dẫn và tiếp giáp p-n",
      points: [
        "Silic (Si) có vùng cấm Eg ≈ 1,12 eV và điện trường đánh thủng tới hạn Ec ≈ 0,3 MV/cm. Gần như toàn bộ thyristor và IGBT dùng trong HVDC hiện nay làm bằng Si.",
        "Silic-cacbua (SiC) có Eg ≈ 3,26 eV, Ec ≈ 2,5–3 MV/cm và dẫn nhiệt tốt gấp khoảng 3 lần Si. Ở cùng điện áp, lớp trôi của SiC mỏng hơn khoảng 10 lần.",
        "Ghép lớp p với lớp n tạo vùng nghèo và hàng rào thế, khoảng 0,7 V với Si:",
        "Phân cực thuận: dòng tăng theo hàm mũ của điện áp.",
        "Phân cực ngược: chỉ có dòng rò nhỏ, cho đến khi điện trường đạt Ec thì xảy ra đánh thủng thác lũ.",
        "Linh kiện công suất chèn một lớp trôi n⁻ pha tạp nhẹ và dày giữa p⁺ và n⁺. Điện áp chịu được xấp xỉ tỷ lệ với độ dày lớp này: thyristor 8 kV cần tấm silic dày khoảng 1–1,5 mm.",
        "Khi dẫn, lớp n⁻ bị \"ngập\" hạt dẫn thiểu số, nên sụt áp vẫn thấp dù lớp dày. Cái giá là điện tích tích trữ Qrr lớn, linh kiện tắt chậm.",
        "Đánh đổi cốt lõi: điện áp chịu cao ⇒ lớp trôi dày ⇒ Qrr lớn ⇒ tắt chậm, tổn hao đóng cắt lớn.",
      ],
      formulas: [
        String.raw`T_j = T_a + P\,\big(R_{th(j-c)} + R_{th(c-h)} + R_{th(h-a)}\big)`,
      ],
    },
    {
      heading: "Câu hỏi ôn tập",
      points: [
        "Vì sao linh kiện điện tử công suất làm việc ở chế độ khóa mà không ở chế độ khuếch đại?",
        "Giải thích đánh đổi giữa điện áp chịu đựng và tốc độ đóng cắt. Từ đó, vì sao van LCC làm việc ở tần số lưới, còn MMC dùng IGBT 3,3–4,5 kV ghép nối tiếp hàng trăm module?",
      ],
      note: "Ghi câu trả lời vào mục Ghi chú bên dưới để xuất kèm file kết quả gửi giảng viên.",
    },
  ]),

  gt("0.2", "Chương 3–4", [
    {
      heading: "Diode công suất",
      points: [
        "Cấu trúc p⁺–n⁻–n⁺. Đặc tính có ba vùng:",
        "Dẫn thuận, sụt áp VF khoảng 1–3 V.",
        "Khóa ngược, dòng rò IR rất nhỏ.",
        "Đánh thủng ngược tại VRRM.",
        "Diode phục hồi mềm (soft recovery) có dòng tắt thoải, giảm quá áp L·di/dt. Quá trình tắt của thyristor giống hệt hiện tượng này.",
        "Trong HVDC, diode có hai vai trò:",
        "Diode ngược song song với IGBT trong submodule MMC.",
        "Các bộ chỉnh lưu phụ trợ.",
      ],
      formulas: [String.raw`Q_{rr} \approx \tfrac{1}{2}\, I_{rr}\, t_{rr}, \qquad V_{d0} = \frac{3\sqrt{2}}{\pi}\,V_{LL} \approx 1{,}35\,V_{LL}`],
      table: {
        caption: "Các loại diode công suất",
        columns: ["Loại", "trr điển hình", "Ứng dụng"],
        rows: [
          ["Diode chỉnh lưu tần số lưới", "5–25 µs", "Chỉnh lưu 50/60 Hz, nguồn phụ"],
          ["Diode phục hồi nhanh (FRD)", "0,1–5 µs", "Diode ngược song song IGBT, mạch kẹp"],
          ["Diode Schottky SiC", "Gần 0 (không có điện tích thiểu số)", "Bộ biến đổi tần số cao, đến 1,7–3,3 kV"],
        ],
      },
    },
    {
      heading: "Cấu tạo bốn lớp và các cách mở thyristor",
      points: [
        "Thyristor có ba tiếp giáp J1, J2, J3 và ba cực Anode (A), Cathode (K), Gate (G).",
        "Phân cực thuận: J2 phân cực ngược, linh kiện khóa thuận và chịu áp VDRM.",
        "Phân cực ngược: J1 và J3 phân cực ngược, linh kiện chịu áp VRRM.",
        "Thyristor HVDC là loại đối xứng, VDRM ≈ VRRM.",
        "Hệ số khuếch đại α1, α2 tăng theo dòng và nhiệt độ. Vì vậy thyristor có thể mở bằng một trong năm cách:",
        "(1) Dòng cổng IG, là cách điều khiển chuẩn.",
        "(2) Ánh sáng chiếu vào vùng cổng (thyristor LTT).",
        "(3) dv/dt lớn, khi dòng nạp điện dung J2 đóng vai dòng cổng. Đây là mở nhầm.",
        "(4) Điện áp vượt ngưỡng break-over VBO. Đây là mở nhầm và có thể phá hỏng thyristor.",
        "(5) Nhiệt độ cao làm tăng dòng rò.",
        "Lúc mới mở, vùng dẫn chỉ là một dải hẹp sát cổng rồi lan ra toàn bề mặt với tốc độ khoảng 0,1 mm/µs. Vì vậy van HVDC dùng cổng khuếch đại phân nhánh và cuộn kháng bão hòa nối tiếp để hạn chế di/dt.",
      ],
      formulas: [String.raw`I_A = \frac{\alpha_2 I_G + I_{CBO1} + I_{CBO2}}{1 - (\alpha_1 + \alpha_2)}`],
    },
    {
      heading: "Thông số thyristor HVDC",
      points: ["Đây là khoảng giá trị tham khảo. Thiết kế cụ thể phải theo datasheet của nhà sản xuất."],
      table: {
        columns: ["Thông số", "Ý nghĩa", "Điển hình (6 inch)"],
        rows: [
          ["VDRM / VRRM", "Điện áp khóa thuận / ngược lặp lại cực đại", "7,2–8,5 kV"],
          ["IT(AV)", "Dòng trung bình định mức", "4–6,25 kA"],
          ["ITSM", "Dòng xung không lặp (10 ms)", "60–100 kA"],
          ["VT", "Sụt áp khi dẫn", "1,5–2,5 V"],
          ["IL / IH", "Dòng chốt / dòng duy trì", "Vài trăm mA"],
          ["(di/dt)cr", "Tốc độ tăng dòng tới hạn khi mở", "100–300 A/µs"],
          ["(dv/dt)cr", "Tốc độ tăng áp tới hạn khi khóa", "2–3 kV/µs"],
          ["tq", "Thời gian phục hồi khả năng khóa", "Vài trăm µs"],
        ],
      },
    },
    {
      heading: "Từ tq đến góc tắt tối thiểu γmin",
      points: [
        "Thyristor chỉ tắt khi dòng thuận về 0. Ở HVDC LCC, điện áp lưới AC đưa dòng về 0, gọi là chuyển mạch tự nhiên.",
        "Sau đó van cần được đặt áp ngược tối thiểu trong thời gian tq để điện tích trong lớp n⁻ tái hợp hết. Nếu áp thuận đặt lại quá sớm, thyristor tự dẫn lại.",
        "Khoảng áp ngược ở trạm nghịch lưu kéo dài γ/ω giây. Ở 50 Hz, γ = 15° ứng với 833 µs, lớn hơn tq vài trăm µs của thyristor HVDC, nên còn dự phòng.",
      ],
      formulas: [String.raw`t_\gamma = \frac{\gamma}{\omega} = \frac{\gamma}{360^\circ}\cdot\frac{1}{f} \;>\; t_q`],
    },
    {
      heading: "Thyristor ETT, LTT và vỏ ép",
      points: [
        "ETT (Electrically Triggered Thyristor) kích bằng điện. Lệnh từ hệ thống điều khiển truyền qua cáp quang tới bo TCU/TE đặt ngay tại thế của từng thyristor. Bo này lấy năng lượng từ mạch snubber và tạo xung cổng.",
        "LTT (Light Triggered Thyristor) nhận xung laser qua cáp quang, chiếu thẳng vào vùng cổng. LTT cần ít linh kiện điện tử ở thế cao và thường tích hợp sẵn bảo vệ break-over và dv/dt trong tấm silic.",
        "Tấm silic tăng dần từ 4 inch lên 5 và 6 inch, cho phép dòng 4,5–6,25 kA ở các dự án UHVDC ±800 kV và ±1100 kV.",
        "Vỏ ép (press-pack) làm mát cả hai phía. Khi hỏng, thyristor ngắn mạch thay vì hở mạch, nên van có các cấp thyristor dự phòng nối tiếp vẫn vận hành tiếp được.",
      ],
    },
    {
      heading: "Câu hỏi ôn tập",
      points: [
        "Giải thích bằng mô hình hai transistor vì sao thyristor không tắt được bằng cổng.",
        "Vì sao trạm nghịch lưu phải giữ góc tắt γ lớn hơn γmin? Liên hệ γmin với thời gian tq của thyristor.",
      ],
    },
  ]),

  gt("0.3", "Chương 5", [
    {
      heading: "So sánh tổng hợp",
      points: [
        "Linh kiện điều khiển hoàn toàn mở và tắt được theo lệnh, không cần chờ dòng tự về 0. Đây là điều kiện để bộ biến đổi tự tạo điện áp AC mà không cần lưới để chuyển mạch, tức là HVDC VSC.",
      ],
      table: {
        columns: ["Linh kiện", "Điều khiển", "Điện áp lớn nhất", "Tần số đóng cắt", "Vai trò trong HVDC"],
        rows: [
          ["Thyristor", "Chỉ mở (dòng)", "8,5 kV", "50/60 Hz", "Van LCC"],
          ["GTO", "Mở và tắt (dòng)", "6 kV", "< 1 kHz", "Lịch sử, ít dùng"],
          ["IGCT", "Mở và tắt (dòng)", "6,5 kV", "0,5–1 kHz", "Lựa chọn cho MMC, DC breaker"],
          ["IGBT Si", "Mở và tắt (áp)", "4,5–6,5 kV", "0,1–2 kHz trong MMC", "Van VSC/MMC chủ đạo"],
          ["SiC MOSFET", "Mở và tắt (áp)", "3,3 kV (đang lên 10 kV)", "Đến hàng chục kHz", "Nghiên cứu, thế hệ sau"],
        ],
      },
    },
    {
      heading: "IGBT trong van VSC",
      points: [
        "IGBT có cấu trúc như MOSFET nhưng thêm lớp p⁺ ở collector. Lớp này bơm lỗ trống vào lớp trôi, nên sụt áp thấp ở điện áp cao.",
        "Điện áp ngưỡng VGE(th) khoảng 5–7 V. IGBT tự giới hạn được dòng ngắn mạch trong khoảng 10 µs, đủ để bảo vệ kịp cắt.",
        "Dòng đuôi (tail current) khi tắt do lỗ trống còn sót lại. Đây là thành phần chính của tổn hao tắt.",
        "Có hai dạng đóng gói. Module có đế cách điện và dây hàn bond. Press-pack (StakPak) có vỏ ép.",
      ],
      table: {
        columns: ["Đóng gói", "Khi hỏng", "Hệ quả thiết kế"],
        rows: [
          ["Module", "Thường thành hở mạch", "Cần thyristor hoặc tiếp điểm bypass cho submodule"],
          ["Press-pack", "Ngắn mạch ổn định", "Thích hợp ghép nối tiếp nhiều linh kiện"],
        ],
      },
    },
    {
      heading: "Kết luận cho người làm HVDC",
      points: [
        "Chọn linh kiện quyết định cấu trúc trạm.",
        "Thyristor cho LCC: đơn giản, rẻ, tổn hao khoảng 0,7% mỗi trạm, nhưng phụ thuộc lưới để chuyển mạch.",
        "IGBT cho VSC: linh hoạt, nhưng tổn hao cao hơn, khoảng 0,8–1% mỗi trạm MMC. VSC hai mức đời đầu dùng PWM 1–2 kHz nên tổn hao lên tới 1,5–3% mỗi trạm.",
      ],
    },
    {
      heading: "Câu hỏi ôn tập",
      points: [
        "Vì sao MOSFET Si không dùng được cho điện áp cao, còn SiC MOSFET thì có thể?",
        "Khi một IGBT hỏng, module và press-pack ảnh hưởng thế nào tới thiết kế bypass của submodule MMC?",
      ],
    },
  ]),

  gt("0.4", "Chương 6–7", [
    {
      heading: "Cầu Graetz 6 xung có điều khiển",
      points: [
        "Sáu thyristor đánh số V1…V6 theo thứ tự kích. Nhóm anode chung (V1, V3, V5) nối cực dương, nhóm cathode chung (V4, V6, V2) nối cực âm.",
        "Khi bỏ qua trùng dẫn, luôn có đúng hai van cùng dẫn.",
        "Mỗi chu kỳ, điện áp ra gồm 6 đoạn điện áp dây, nên gọi là cầu 6 xung.",
        "Ví dụ để làm quen: cầu một pha 4 thyristor cho Vd = 2√2/π·U·cos α ≈ 0,9·U·cos α.",
      ],
      formulas: [String.raw`V_d = \frac{3}{\pi}\int_{-\pi/6+\alpha}^{\pi/6+\alpha} \sqrt{2}\,V_{LL}\cos\theta\,d\theta = \frac{3\sqrt{2}}{\pi}V_{LL}\cos\alpha = V_{d0}\cos\alpha`],
      table: {
        columns: ["α", "Vd / Vd0", "Chế độ"],
        rows: [
          ["0°", "1,00", "Chỉnh lưu, như cầu diode"],
          ["15° (vận hành HVDC điển hình)", "0,97", "Chỉnh lưu"],
          ["60°", "0,50", "Chỉnh lưu"],
          ["90°", "0", "Ranh giới"],
          ["120°", "−0,50", "Nghịch lưu"],
          ["150°", "−0,87", "Nghịch lưu"],
        ],
      },
    },
    {
      heading: "Vì sao không vận hành ở α = 0",
      points: [
        "Trạm chỉnh lưu giữ αmin khoảng 5°, vì hai lý do:",
        "Lúc kích, van cần một điện áp thuận đủ lớn để tất cả thyristor nối tiếp mở đồng đều.",
        "Cần dự trữ điều khiển: khi điện áp AC giảm, bộ điều khiển giảm α để giữ dòng.",
        "Giá trị vận hành danh định thường là 12,5–17,5°.",
      ],
    },
    {
      heading: "Quá trình chuyển mạch và góc trùng dẫn",
      points: [
        "Xét dòng chuyển từ V1 (pha a) sang V3 (pha b). Khi V3 được kích, hai pha bị ngắn mạch qua hai điện kháng Xc: iV3 tăng từ 0 lên Id, còn iV1 giảm từ Id về 0.",
        "Trong khoảng trùng dẫn, điện áp ra bằng trung bình của hai điện áp pha, nên mất đi một phần diện tích điện áp.",
        "Phần sụt áp này tương đương một \"điện trở chuyển mạch\" Rc = 3Xc/π, nhưng không tiêu tán công suất.",
        "Ở thông số danh định, độ sụt áp tương đối dx = Rc·Id/Vd0 khoảng 6–9%.",
        "Khi μ < 60°, số van dẫn xen kẽ giữa 2 và 3 (chế độ bình thường). Khi μ đạt 60°, do dòng rất lớn hoặc điện áp rất thấp, cầu chuyển sang chế độ 3–3 và các công thức trên không còn đúng.",
      ],
      formulas: [
        String.raw`I_d = \frac{V_{LL}}{\sqrt{2}\,X_c}\left[\cos\alpha - \cos(\alpha+\mu)\right]`,
        String.raw`V_d = V_{d0}\,\frac{\cos\alpha + \cos(\alpha+\mu)}{2} = V_{d0}\cos\alpha - \frac{3}{\pi}X_c I_d`,
      ],
    },
    {
      heading: "Chế độ nghịch lưu: β và γ",
      points: [
        "Khi α > 90°, cầu làm việc nghịch lưu. Các góc lúc này được đo ngược về phía trước điểm chuyển mạch tự nhiên tiếp theo, nơi điện áp trên van đổi dấu từ âm sang dương.",
        "γ là khoảng thời gian, quy ra độ, mà van vừa tắt còn chịu áp ngược trước khi áp thuận đặt lại.",
        "Ở công thức điện áp nghịch lưu dưới đây, Vdi được viết với dấu dương theo quy ước của trạm nghịch lưu.",
      ],
      formulas: [
        String.raw`\beta = 180^\circ - \alpha, \qquad \gamma = \beta - \mu = 180^\circ - (\alpha + \mu)`,
        String.raw`V_{di} = V_{d0}\cos\gamma - \frac{3}{\pi}X_c I_d = V_{d0}\cos\beta + \frac{3}{\pi}X_c I_d, \qquad \cos\gamma = \cos\beta + \frac{\sqrt{2}\,X_c I_d}{V_{LL}}`,
      ],
      table: {
        caption: "Tóm tắt các góc",
        columns: ["Góc", "Định nghĩa", "Trạm", "Giá trị điển hình"],
        rows: [
          ["α", "Từ điểm chuyển mạch tự nhiên đến lúc kích", "Chỉnh lưu", "15° (αmin ≈ 5°)"],
          ["μ", "Thời gian trùng dẫn", "Cả hai", "20–25° ở Id danh định"],
          ["β = 180° − α", "Từ lúc kích đến điểm chuyển mạch tự nhiên kế tiếp", "Nghịch lưu", "35–45°"],
          ["γ = β − μ", "Từ lúc kết thúc trùng dẫn đến điểm áp van đổi dấu", "Nghịch lưu", "15–18° (γmin)"],
        ],
      },
    },
    {
      heading: "Sự cố chuyển mạch",
      points: [
        "Diễn biến khi γ nhỏ hơn γmin:",
        "Van vừa tắt bị đặt áp thuận quá sớm và dẫn lại, nên dòng không chuyển được sang van kế tiếp.",
        "Hai van cùng pha nối tiếp dẫn, làm Vd của nghịch lưu sụt về 0 trong một phần chu kỳ và Id tăng vọt.",
        "Nguyên nhân phổ biến nhất là điện áp AC phía nghịch lưu giảm do sự cố lưới gần trạm. Điện áp ba pha chỉ cần giảm khoảng 10–15% đã có thể gây sự cố chuyển mạch khi γ danh định là 15–18°.",
        "Biện pháp hạn chế:",
        "Điều khiển góc tắt không đổi (CEA) có dự đoán.",
        "Giảm dòng nhanh bằng VDCOL.",
        "Tăng tạm thời γ dự phòng khi phát hiện sụt áp.",
        "Bù đồng bộ hoặc STATCOM để tăng độ cứng lưới.",
        "Chọn ESCR đủ lớn, trên 2,5–3.",
      ],
    },
    {
      heading: "Bài tập có lời giải",
      points: [
        "Bài 1. Cầu 6 xung, V_LL = 210 kV, Xc = 8 Ω, Id = 3 kA, α = 15°. Tính Vd0, μ và Vd.",
        "Lời giải: Vd0 = 1,35 × 210 = 283,6 kV. √2·Xc·Id/V_LL = 0,1616, nên cos(α+μ) = 0,9659 − 0,1616 = 0,8043. Suy ra α + μ = 36,5° và μ = 21,5°.",
        "Vd = 283,6 × 0,9659 − (3/π) × 8 × 3 = 273,9 − 22,9 = 251,0 kV. Cầu 12 xung cho 502 kV.",
        "Bài 2. Cùng thông số, trạm làm việc nghịch lưu với γ = 17°. Tính β, α và Vd.",
        "Lời giải: cos β = cos 17° − 0,1616 = 0,7947, nên β = 37,4°, α = 142,6° và μ = β − γ = 20,4°.",
        "Vdi = Vd0·cos γ − (3/π)·Xc·Id = 271,2 − 22,9 = 248,3 kV mỗi cầu.",
        "Bài 3. Ở bài 2, điện áp AC phía nghịch lưu đột ngột giảm 15% trong khi β chưa kịp thay đổi. Có xảy ra sự cố chuyển mạch không?",
        "Lời giải: V_LL = 178,5 kV, nên √2·Xc·Id/V_LL = 0,190 và cos γ = 0,7947 + 0,190 = 0,985, tức γ = 10,0°.",
        "γ = 10° ứng với 556 µs ở 50 Hz. Giá trị này chưa nhỏ hơn tq nhưng đã dưới γmin, nên rủi ro cao.",
        "Nếu Id đồng thời tăng 30% (do Vd nghịch lưu giảm), số hạng √2·Xc·Id/V_LL thành 0,247 và cos γ > 1: xảy ra sự cố chuyển mạch.",
      ],
      note: "Các số này được kiểm tra tự động với mô hình của phòng lab (kiểm thử firing-angle.test.ts). Trên tab 1 của phòng lab, nhập đúng các thông số trên để đối chiếu.",
    },
    {
      heading: "Câu hỏi ôn tập",
      points: [
        "Phân biệt các góc α, β, γ, μ. Vì sao trạm nghịch lưu được điều khiển theo γ mà không theo α?",
        "Vì sao cả trạm chỉnh lưu lẫn trạm nghịch lưu LCC đều tiêu thụ công suất phản kháng?",
        "Nêu bốn nguyên nhân gây sự cố chuyển mạch và các biện pháp hạn chế.",
        "Vì sao điện áp thanh cái có \"vết khuyết\" trong khoảng μ? Liên hệ với số hạng (3/π)·Xc·Id.",
      ],
    },
  ]),

  gt("0.5", "Chương 8", [
    {
      heading: "Sóng hài đặc trưng",
      points: [
        "Cuộn dây Δ làm điện áp phía van lệch 30° so với cuộn Y, và hai cầu được kích lệch nhau 30°.",
        "Với dòng chữ nhật lý tưởng, In = I1/n. Trùng dẫn làm các bậc cao giảm nhanh hơn.",
        "Ngoài sóng hài đặc trưng còn có sóng hài không đặc trưng (bậc 3, 5, 7 nhỏ). Chúng sinh ra do mất cân bằng điện áp, sai lệch góc kích giữa các van, hoặc sai khác điện kháng giữa hai MBA.",
      ],
      formulas: [String.raw`I_1 = \frac{\sqrt{6}}{\pi}I_d \approx 0{,}78\,I_d, \qquad I_n = \frac{I_1}{n}`],
      table: {
        columns: ["Phía", "Cầu 6 xung", "Cầu 12 xung"],
        rows: [
          ["AC (dòng)", "6k ± 1: 5, 7, 11, 13…", "12k ± 1: 11, 13, 23, 25…"],
          ["DC (áp)", "6k: 6, 12, 18…", "12k: 12, 24, 36…"],
        ],
      },
    },
    {
      heading: "Bộ lọc và cuộn kháng san bằng",
      points: [
        "Lọc AC: bộ lọc thông cao kép điều chỉnh tại bậc 11/13 và 24/36. Kèm lọc C-type hoặc lọc bậc 3 cho cộng hưởng tần số thấp. Các bộ lọc AC đồng thời là nguồn bù công suất phản kháng.",
        "Lọc DC: điều chỉnh tại bậc 12 và 24 để giảm nhiễu lên đường dây thông tin. Với cáp ngầm thường không cần.",
        "Cuộn kháng san bằng thường 0,1–0,4 H mỗi cực. Cuộn kháng này giảm nhấp nhô dòng, hạn chế tốc độ tăng dòng khi sự cố DC và giảm xác suất sự cố chuyển mạch.",
      ],
    },
    {
      heading: "Ví dụ tính công suất phản kháng",
      points: [
        "Với α = 15° và μ = 22°: cos φ ≈ (0,966 + 0,799)/2 = 0,88, tan φ ≈ 0,53.",
        "Trạm 1000 MW khi đó tiêu thụ khoảng 530 Mvar, cần bù gần hết bằng bộ lọc và các nhóm tụ đóng cắt theo tải. Nghịch lưu với γ = 17° cho kết quả tương tự.",
        "Quy tắc vận hành: giữ α và γ càng nhỏ càng tốt để giảm Q và ứng suất van, nhưng không nhỏ hơn αmin, γmin để đảm bảo an toàn.",
      ],
      formulas: [String.raw`\cos\varphi \approx \frac{\cos\alpha + \cos(\alpha+\mu)}{2} = \frac{V_d}{V_{d0}}, \qquad Q = P\tan\varphi`],
    },
    {
      heading: "Tỷ số ngắn mạch",
      points: [
        "Độ cứng lưới AC tại trạm được đánh giá bằng SCR = Sk/Pd, hoặc bằng ESCR (đã trừ phần bù của tụ và bộ lọc).",
        "Theo IEEE Std 1204, ESCR dưới 2 là lưới rất yếu, 2–3 là yếu, trên 3 là mạnh.",
        "Ở lưới yếu, điện áp AC dao động mạnh theo Id và α, dẫn tới mất ổn định điều khiển và sự cố chuyển mạch.",
      ],
    },
    {
      heading: "Câu hỏi ôn tập",
      points: [
        "Vì sao cầu 12 xung loại được sóng hài bậc 5 và 7?",
        "Với α = 15°, tỷ số Q/P đo được trên phòng lab là bao nhiêu? So sánh với ví dụ ở trên.",
      ],
    },
  ]),

  gt("0.6", "Chương 9–10", [
    {
      heading: "Phân cấp điều khiển",
      points: [
        "(1) Điều khiển lưỡng cực, hay điều khiển chủ: nhận lệnh công suất từ điều độ, tính Id,ref = P_ref/Vd và phối hợp hai trạm qua kênh viễn thông.",
        "(2) Điều khiển cực: chọn chế độ vận hành, khởi động và dừng (deblock/block), đảo chiều công suất, giới hạn quá tải.",
        "(3) Điều khiển nhóm van: các vòng CC, CEA, VDCOL, giới hạn αmin và αmax, điều khiển nấc phân áp MBA.",
        "(4) Bộ phát xung: đồng bộ với lưới bằng PLL, tạo 12 xung cách đều.",
        "(5) Điện tử van (VBE): chuyển lệnh thành xung quang tới từng thyristor, giám sát trạng thái và bảo vệ van.",
      ],
    },
    {
      heading: "Đặc tính Vd–Id và biên dòng",
      points: [
        "Bình thường, dòng thực lớn hơn dòng đặt của nghịch lưu. Bộ CC nghịch lưu vì thế bão hòa, và CEA giữ điện áp.",
        "Khi chỉnh lưu chạm αmin, đặc tính của nó trở thành đường αmin. Dòng giảm về mức đặt của nghịch lưu: vai trò hai trạm hoán đổi cho nhau.",
      ],
      table: {
        columns: ["Đoạn đặc tính", "Trạm", "Hình dạng trên mặt phẳng Vd–Id"],
        rows: [
          ["αmin", "Chỉnh lưu", "Đường dốc xuống: Vd0r·cos αmin − Rc·Id"],
          ["CC", "Chỉnh lưu", "Đường thẳng đứng tại Id,ref"],
          ["VDCOL", "Cả hai", "Id,ref giảm khi Vd thấp"],
          ["CEA", "Nghịch lưu", "Đường dốc xuống nhẹ: Vd0i·cos γ − Rc·Id"],
          ["CC", "Nghịch lưu", "Đường thẳng đứng tại Id,ref − ΔId"],
        ],
      },
    },
    {
      heading: "CEA phản hồi và CEA dự đoán",
      points: [
        "CEA phản hồi: đo γ của từng van ở chu kỳ trước và lấy giá trị nhỏ nhất làm tín hiệu phản hồi cho bộ PI.",
        "CEA dự đoán: tính trước β cần thiết từ V_LL và Id đo được. Vì dùng điện áp đã lọc, bộ dự đoán vẫn có thể để lọt sự cố chuyển mạch khi điện áp sụt đột ngột (xem tab 3 của phòng lab).",
        "VDCOL giảm dòng đặt nhanh, với hằng số thời gian 10–40 ms. Khi phục hồi, dòng tăng chậm hơn, với hằng số 40–100 ms.",
      ],
    },
    {
      heading: "Phát xung kích và các thao tác đặc biệt",
      points: [
        "IPC (Individual Phase Control): mỗi van kích theo điểm qua 0 của điện áp riêng. Khi điện áp méo, xung không cách đều, sinh sóng hài không đặc trưng và có thể gây mất ổn định sóng hài.",
        "EPC (Equidistant Pulse Control): bộ dao động khóa pha tạo 12 xung cách đều 30°, chỉ hiệu chỉnh pha chậm theo lưới. EPC do Ainsworth đề xuất năm 1968 và là tiêu chuẩn hiện nay.",
        "Vòng OLTC chậm, từ giây đến phút, giữ α chỉnh lưu trong khoảng 12,5–17,5° và giữ γ hoặc Vd của nghịch lưu ở định mức.",
        "Khởi động (deblock): chỉnh lưu kích với α ≈ 90°, nghịch lưu với β ≈ 90°, rồi tăng Id theo dốc.",
        "Sự cố đường dây DC: cưỡng bức chỉnh lưu sang nghịch lưu (α ≈ 120–150°) để xả năng lượng đường dây, chờ khử ion 150–300 ms rồi khởi động lại.",
        "Đảo chiều công suất: đảo dấu Vd bằng cách đổi vai trò hai trạm. Id giữ nguyên chiều.",
      ],
    },
    {
      heading: "Van thyristor HVDC",
      points: [
        "Mỗi cấp thyristor gồm bốn phần:",
        "Thyristor vỏ ép, kẹp giữa hai tản nhiệt làm mát bằng nước.",
        "Mạch snubber RC.",
        "Điện trở phân áp DC.",
        "Bo điện tử TE/TCU (với thyristor ETT).",
        "Nhiều cấp ghép với cuộn kháng bão hòa thành module. Cuộn kháng giới hạn di/dt lúc mở.",
        "Nhiều module nối tiếp thành một van. Số cấp gồm cả cấp dự phòng, thường 2–3% hoặc tối thiểu 2–3 cấp mỗi van.",
        "Bốn van cùng pha xếp chồng thành van bốn (quadrivalve), treo từ trần nhà van để chịu động đất. Mỗi cầu 12 xung có 3 van bốn.",
        "IEC 60700-1 quy định thử nghiệm điển hình và thử nghiệm xuất xưởng cho van, gồm ba nhóm:",
        "Thử nghiệm vận hành: dòng liên tục và quá tải, αmin, γmin, dòng sự cố, phục hồi sau kích bảo vệ.",
        "Thử nghiệm điện môi: điện áp DC, AC, xung đóng cắt, xung sét, xung dốc đứng.",
        "Thử nghiệm nhiễu điện từ (EMI).",
        "Khi bảo dưỡng định kỳ, valve tester kiểm tra từng cấp:",
        "Khả năng khóa áp thuận và ngược.",
        "Khả năng mở khi có xung.",
        "Chức năng kích bảo vệ.",
        "Giá trị tụ, điện trở snubber và điện trở phân áp.",
        "Kết quả được theo dõi xu hướng qua các lần thí nghiệm để phát hiện linh kiện suy giảm trước khi hỏng.",
      ],
      table: {
        caption: "Bảo vệ van",
        columns: ["Bảo vệ", "Chống lại", "Cách thực hiện"],
        rows: [
          ["Kích bảo vệ (BOD)", "Quá áp thuận trên từng cấp", "Diode break-over hoặc mạch đo áp kích thyristor trước khi đánh thủng"],
          ["Bảo vệ phục hồi thuận", "Áp thuận đặt lại trong thời gian tq", "Phát hiện và kích toàn van để tránh dẫn lại cục bộ"],
          ["Chống sét van", "Quá áp đóng cắt, sét", "Chống sét ZnO song song mỗi van"],
          ["Giám sát cấp thyristor", "Cấp hỏng, mất xung", "VBE đếm cấp hỏng; cảnh báo khi gần hết dự phòng, cắt khi vượt"],
          ["Làm mát", "Quá nhiệt, rò nước", "Nước khử ion, độ dẫn điện < 0,5 µS/cm, giám sát lưu lượng và nhiệt độ"],
        ],
      },
      note: "Quy trình thí nghiệm cụ thể tại trạm theo hướng dẫn của nhà sản xuất van và quy định của đơn vị quản lý vận hành.",
    },
    {
      heading: "Câu hỏi ôn tập",
      points: [
        "Vẽ đặc tính Vd–Id của hai trạm, chỉ ra điểm làm việc và giải thích vai trò của biên dòng ΔId.",
        "VDCOL hoạt động như thế nào và vì sao cần thiết khi có sự cố lưới AC?",
        "So sánh EPC và IPC trong phát xung kích.",
        "Liệt kê các hạng mục thử nghiệm van thyristor theo IEC 60700-1.",
        "Ở tab 3 của phòng lab, vì sao bộ CEA dự đoán vẫn để xảy ra sự cố chuyển mạch dù đã tính β từ phương trình? Gợi ý: hằng số lọc điện áp.",
      ],
    },
  ]),

  gt("0.7", "Chương 11–12", [
    {
      heading: "Nguyên lý PWM và SPWM",
      points: [
        "Một nhánh nửa cầu hai mức chỉ cho ra +Ud/2 hoặc −Ud/2. Giá trị trung bình trong mỗi chu kỳ đóng cắt tỷ lệ với hệ số làm việc d.",
        "SPWM so sánh sóng điều chế hình sin với sóng mang tam giác. Chọn mf là số lẻ và là bội của 3 để sóng hài tại tần số sóng mang triệt tiêu trong điện áp dây.",
        "Khi ma > 1 là quá điều chế: quan hệ giữa ma và biên độ không còn tuyến tính, và xuất hiện sóng hài bậc thấp 5, 7.",
      ],
      formulas: [
        String.raw`\bar{v}_{a0} = \frac{U_d}{2}(2d - 1), \qquad m_a = \frac{\hat{V}_{ref}}{\hat{V}_{tri}}, \qquad m_f = \frac{f_c}{f_1}`,
        String.raw`V_{LL,1} = \frac{\sqrt{3}}{2\sqrt{2}}m_a U_d \approx 0{,}612\,m_a U_d`,
      ],
    },
    {
      heading: "SVPWM và điều chế đa mức",
      points: [
        "Bộ biến đổi hai mức ba pha có 8 trạng thái đóng cắt: 6 vector tích cực có độ lớn 2Ud/3 và 2 vector không V0, V7.",
        "Cách chia thời gian T0 giữa V0 và V7 quyết định dạng sóng và tổn hao. Kiểu đối xứng 7 đoạn là phổ biến. Kiểu kẹp DC 5 đoạn giảm 1/3 số lần đóng cắt.",
      ],
      formulas: [String.raw`T_1 = \frac{\sqrt{3}\,T_s|V_{ref}|}{U_d}\sin(60^\circ - \theta), \quad T_2 = \frac{\sqrt{3}\,T_s|V_{ref}|}{U_d}\sin\theta, \quad T_0 = T_s - T_1 - T_2`],
      table: {
        caption: "Phương pháp điều chế cho MMC",
        columns: ["Phương pháp", "Nguyên lý", "Phù hợp"],
        rows: [
          ["PWM dịch pha sóng mang (PSC-PWM)", "N sóng mang lệch nhau 360°/N, mỗi SM một sóng mang", "Số SM ít (STATCOM, MMC trung áp)"],
          ["PWM dịch mức (PD, POD, APOD)", "N sóng mang xếp chồng theo mức điện áp", "Số SM vừa"],
          ["Điều chế mức gần nhất (NLM)", "Làm tròn vref/U_SM thành số SM cần cắm vào", "HVDC, trên 100 SM mỗi nhánh"],
        ],
      },
    },
    {
      heading: "Clarke, Park và vòng dòng dq",
      points: [
        "Phía AC của VSC được mô hình là điện áp bộ biến đổi vc nối với lưới vg qua cuộn kháng pha và MBA (L, R).",
        "Trong hệ dq xuất hiện các số hạng ghép chéo ωL giữa hai trục. Bộ điều khiển bù chúng bằng các số hạng tách kênh.",
        "PLL đồng bộ (SRF-PLL) đưa vq về 0 bằng một bộ PI. Đầu ra PI là tần số, tích phân lên thành góc θ.",
        "Cùng loại PLL này dùng cho bộ phát xung EPC của LCC.",
        "Khi sự cố không đối xứng, dùng PLL tách thứ tự thuận và nghịch (DDSRF, DSOGI).",
      ],
      formulas: [
        String.raw`x_\alpha = \tfrac{2}{3}\left(x_a - \tfrac{1}{2}x_b - \tfrac{1}{2}x_c\right), \quad x_\beta = \tfrac{1}{\sqrt{3}}(x_b - x_c)`,
        String.raw`x_d = x_\alpha\cos\theta + x_\beta\sin\theta, \quad x_q = -x_\alpha\sin\theta + x_\beta\cos\theta`,
        String.raw`v_{cd}^* = v_{gd} + \mathrm{PI}(i_d^* - i_d) - \omega L i_q, \qquad v_{cq}^* = v_{gq} + \mathrm{PI}(i_q^* - i_q) + \omega L i_d`,
      ],
    },
    {
      heading: "Phân công giữa hai trạm VSC",
      points: [
        "So với LCC: ở LCC, chỉnh lưu giữ dòng và nghịch lưu giữ áp, đều bằng α và γ. Ở VSC, một trạm giữ Udc, trạm kia giữ P, và mỗi trạm còn tự do điều khiển Q.",
        "Nhìn từ lưới, quan hệ giữa điện áp bộ biến đổi Vc (góc δ) và lưới Vg qua điện kháng X tương tự như truyền công suất giữa hai nút.",
      ],
      formulas: [String.raw`P \approx \frac{V_c V_g}{X}\sin\delta, \qquad Q \approx \frac{V_g(V_c\cos\delta - V_g)}{X}`],
      table: {
        columns: ["Kênh", "Trạm A (điều khiển áp)", "Trạm B"],
        rows: [
          ["Trục d → id*", "Điện áp DC Udc (giữ cân bằng năng lượng)", "Công suất tác dụng P"],
          ["Trục q → iq*", "Q hoặc điện áp AC", "Q hoặc điện áp AC"],
        ],
      },
    },
    {
      heading: "MMC: cấu trúc và submodule",
      points: [
        "Mỗi pha có nhánh trên và nhánh dưới. Mỗi nhánh gồm N submodule nối tiếp cùng một cuộn kháng nhánh.",
        "Số SM được cắm ở mỗi nhánh tại từng thời điểm là n = u/U_SM. Tổng số SM cắm trong một pha luôn xấp xỉ N.",
        "Dòng vòng giữa các pha chủ yếu là bậc 2 thứ tự nghịch. Bộ triệt dòng vòng (CCSC) đưa thành phần này về 0.",
        "Mỗi SM có thyristor bảo vệ và tiếp điểm bypass để nối tắt SM hỏng. Nhánh có SM dự phòng, tương tự cấp thyristor dự phòng ở van LCC.",
        "Điều khiển bám lưới (grid-following) cần PLL. Điều khiển tạo lưới (grid-forming) tự đặt điện áp và tần số, nên làm việc được với lưới rất yếu, hệ thống cô lập hoặc khi khởi động đen.",
      ],
      formulas: [String.raw`u_{u} = \frac{U_{dc}}{2} - v, \quad u_{l} = \frac{U_{dc}}{2} + v, \qquad i_{u,l} = \frac{I_{dc}}{3} \pm \frac{i}{2} + i_{circ}`],
      table: {
        columns: ["Cấu trúc", "Đặc điểm", "Ghi chú"],
        rows: [
          ["Hai mức", "IGBT nối tiếp trực tiếp, PWM 1–2 kHz", "Tổn hao cao, cần lọc lớn; thế hệ đầu"],
          ["MMC nửa cầu (HB-SM)", "2 IGBT + tụ, ra 0 hoặc +U_SM", "Phổ biến nhất; không chặn được dòng sự cố DC"],
          ["MMC cầu đủ (FB-SM)", "4 IGBT + tụ, ra −U_SM, 0, +U_SM", "Chặn được sự cố DC; đắt và tổn hao hơn"],
          ["MMC lai (HB + FB)", "Kết hợp theo tỷ lệ", "Cân bằng chi phí và khả năng xử lý sự cố DC"],
        ],
      },
    },
    {
      heading: "Bài tập có lời giải",
      points: [
        "Bài 4. VSC hai mức, Ud = 640 kV, SPWM với ma = 0,9. Tính điện áp dây hiệu dụng cơ bản. Nếu dùng SVPWM thì ma tuyến tính lớn nhất là bao nhiêu?",
        "Lời giải: VLL,1 = 0,612 × 0,9 × 640 = 352,5 kV.",
        "Với SVPWM, ma,max = 2/√3 = 1,155, nên VLL,1 lớn nhất = 0,612 × 1,155 × 640 ≈ 452 kV.",
        "Bài 5. Vòng dòng dq với X = 0,15 pu, R = 0,005 pu, f = 50 Hz, chọn τ = 2 ms. Tính Kp và Ki.",
        "Lời giải: L = X/ω = 0,15/314,16 = 4,77·10⁻⁴ pu·s.",
        "Kp = L/τ = 0,239 pu, Ki = R/τ = 2,5 pu/s. Hai giá trị này khớp với ô kết quả ở tab 5 của phòng lab.",
      ],
    },
    {
      heading: "Câu hỏi ôn tập",
      points: [
        "So sánh SPWM, SVPWM và NLM về giới hạn điều chế, tần số đóng cắt và phạm vi ứng dụng.",
        "Viết phương trình điều khiển dòng dq có bù tách kênh và giải thích ý nghĩa từng số hạng.",
        "MMC nửa cầu và cầu đủ khác nhau thế nào khi ngắn mạch phía DC?",
        "Ở tab 5 của phòng lab, ước lượng độ lệch iq khi không bù tách kênh bằng số hạng ωL·id.",
      ],
    },
  ]),

  gt("0.8", "Tổng hợp Chương 1–12; QĐ 768/QĐ-TTg", [
    {
      heading: "Chuỗi tích hợp năm tầng",
      points: [
        "Cách đọc bảng: đi từ trên xuống là thiết kế, đi từ dưới lên là ràng buộc. Mỗi tầng chỉ đúng khi tầng dưới chịu được và tầng trên cần đến nó.",
      ],
      table: {
        columns: ["Tầng", "Thông số quyết định", "Kiến thức nền", "Học tiếp"],
        rows: [
          ["5. Hệ thống", "P, điện áp cực, cự ly, SCR hai đầu, công nghệ LCC hay VSC", "Bài 0.1, 0.5", "Bài 1.1, 1.2"],
          ["4. Trạm", "Q tiêu thụ và bộ lọc, chế độ điều khiển CC/CEA, VDCOL, OLTC", "Bài 0.5, 0.6", "Bài 2.3, 3.1, 4.1"],
          ["3. Cầu 12 xung và MBA", "V_LL phía van, Xc (dx), μ, công suất MBA", "Bài 0.4, 0.5", "Bài 1.3, 2.1"],
          ["2. Van", "Áp đỉnh √2·V_LL, dòng Id/3, bảo vệ BOD và chống sét van", "Bài 0.2, 0.6", "Bài 3.2, 4.1"],
          ["1. Linh kiện", "V_DRM, tq, Tj, số cấp nối tiếp và cấp dự phòng", "Bài 0.1, 0.2", "Bài 4.1"],
        ],
      },
    },
    {
      heading: "Ví dụ thiết kế xuyên suốt: ±500 kV, 3000 MW lưỡng cực",
      points: [
        "Giả thiết: α = 15°, γ = 17°, dx = 8 %, đường dây 800 km với 0,0067 Ω/km mỗi cực (6 dây phân pha), SCR phía nhận bằng 3, thyristor 8,5 kV.",
        "Tầng 5. Mỗi cực truyền 1500 MW, nên Id = 1500/500 = 3 kA. Điện trở đường dây 5,36 Ω, sụt áp 16 kV, tổn hao 2 × 3² × 5,36 ≈ 96 MW (3,2 %).",
        "Tầng 3. Mỗi cầu 6 xung mang 250 kV, nên Vd0 = 250/(cos 15° − 0,08) ≈ 282 kV, V_LL ≈ 209 kV và Xc = 0,08 × 282/(0,955 × 3) ≈ 7,9 Ω. Số liệu này đúng bằng bài tập 1, μ ≈ 21°.",
        "Mỗi MBA chuyển đổi có S = (π/3)·Vd0·Id ≈ 886 MVA. Mỗi trạm có 4 MBA, gồm 2 bộ Y/Y và 2 bộ Y/Δ.",
        "Tầng 4. Chỉnh lưu có cos φ ≈ 0,89 và tiêu thụ khoảng 1.530 Mvar. Nghịch lưu cần đặt β ≈ 37,5° để giữ γ = 17° và tiêu thụ khoảng 1.570 Mvar. Bộ lọc AC và tụ bù tại mỗi trạm phải cấp gần hết lượng này.",
        "Tầng 2. Mỗi trạm có 24 van (6 van bốn, mỗi cực 3 van bốn). Điện áp đỉnh đặt lên van √2 × 209 ≈ 296 kV. Dòng trung bình qua van 1 kA, dòng hiệu dụng 1,73 kA.",
        "Tầng 1. Số cấp tối thiểu mỗi van là 296/8,5, làm tròn lên thành 35 cấp. Thêm dự phòng được khoảng 37 cấp, tức gần 900 thyristor mỗi trạm.",
        "Để so sánh, thiết kế van 500 kV của Siemens dùng 39 thyristor 8 kV nối tiếp mỗi van.",
        "Ràng buộc ngược. ESCR phía nhận = 3 − 1.570/2.900 ≈ 2,45, tức lưới yếu. Giữ nguyên β và Id, điện áp AC chỉ cần sụt khoảng 18 % là γ xuống dưới 7° và xảy ra sự cố chuyển mạch.",
        "Khi Id tăng theo trong sự cố, ngưỡng sụt áp gây sự cố chuyển mạch còn thấp hơn 18 %. Giải pháp: tăng γ đặt, lắp máy bù đồng bộ hoặc STATCOM, hoặc chọn VSC cho đầu nhận.",
      ],
      formulas: [
        String.raw`I_d = \frac{1500}{500} = 3\ \text{kA},\qquad V_{d0} = \frac{250}{\cos 15^\circ - 0{,}08} \approx 282\ \text{kV},\qquad V_{LL} = \frac{V_{d0}}{1{,}35} \approx 209\ \text{kV}`,
        String.raw`u_{crit} = \frac{\sqrt{2}\,X_c I_d / V_{LL}}{\cos\gamma_{crit} - \cos\beta},\qquad \Delta U_{max} = 1 - u_{crit} \approx 18\,\%`,
      ],
      note: "Các số trên được tính bằng cùng mô hình với tab 6 của phòng lab và được kiểm tra tự động (hvdc-integration.test.ts). Đây là ước tính sơ bộ để học; số cấp thyristor thực tế còn phụ thuộc mức bảo vệ của chống sét van và quá áp đóng cắt. Số liệu Siemens theo Modern Power Systems.",
    },
    {
      heading: "Kiến thức cơ sở trong công việc của đơn vị truyền tải",
      points: [
        "Phần lớn công việc vận hành, thí nghiệm và xử lý sự cố ở trạm HVDC quy về một vài khái niệm của Cấp độ 0. Bảng dưới gom các trường hợp hay gặp.",
      ],
      table: {
        columns: ["Công việc", "Kiến thức nền dùng tới", "Ví dụ cụ thể"],
        rows: [
          ["Vận hành trạm", "α, γ, Q ≈ P·tan φ, OLTC (bài 0.4–0.6)", "α lệch khỏi 12,5–17,5° kéo dài thì chuyển nấc; đóng thêm nhóm lọc khi tăng công suất"],
          ["Thí nghiệm định kỳ van", "Snubber, phân áp, khả năng khóa và mở (bài 0.2)", "Valve tester đo từng cấp; theo dõi xu hướng để thay thyristor suy giảm"],
          ["Phân tích sự cố", "tq, γ, sự cố chuyển mạch, VDCOL (bài 0.2, 0.4, 0.6)", "Đọc bản ghi: γ xuống dưới ngưỡng ở thời điểm nào, VDCOL hạ dòng bao lâu"],
          ["Bảo vệ", "BOD, chống sét van, cưỡng bức nghịch lưu (bài 0.2, 0.6)", "Trình tự xử lý sự cố đường dây DC và khởi động lại"],
          ["Làm mát", "Tổn hao, Tj, điện trở nhiệt (bài 0.1)", "Độ dẫn điện nước khử ion dưới 0,5 µS/cm, lưu lượng và nhiệt độ nước"],
          ["Chất lượng điện năng", "Sóng hài 12k ± 1, bộ lọc (bài 0.5)", "Đo sóng hài tại thanh cái AC; giới hạn công suất khi thiếu nhóm lọc"],
          ["Quy hoạch, đấu nối", "SCR, ESCR, LCC hay VSC (bài 0.1, 0.3, 0.5)", "Đánh giá độ cứng lưới tại nút đặt trạm; cân nhắc máy bù đồng bộ hoặc VSC"],
        ],
      },
    },
    {
      heading: "Định hướng HVDC tại Việt Nam",
      points: [
        "Quy hoạch điện VIII điều chỉnh được phê duyệt theo Quyết định 768/QĐ-TTg ngày 15/4/2025.",
        "Giai đoạn 2031–2035: định hướng xây mới 26.000–36.000 MW dung lượng trạm chuyển đổi HVDC và 3.500–6.600 km đường dây HVDC.",
        "Giai đoạn 2036–2050: định hướng thêm khoảng 26.000–36.000 MW trạm HVDC và 3.600–6.700 km đường dây HVDC.",
        "Sau năm 2030, định hướng phát triển đường dây siêu cao áp một chiều nối Trung Trung Bộ, Nam Trung Bộ với Bắc Bộ để khai thác điện gió ngoài khơi.",
        "Với Trung Quốc, quy hoạch nghiên cứu phương án liên kết qua chuyển đổi một chiều–xoay chiều hoặc đường dây siêu cao áp một chiều.",
        "Liên hệ với Cấp độ 0:",
        "Tuyến truyền tải công suất lớn, đi xa trên không, giống bài toán ở trên, là vùng mạnh của LCC (bài 0.4–0.6).",
        "Nối điện gió ngoài khơi bằng cáp biển và đấu vào nút lưới yếu là vùng mạnh của VSC/MMC (bài 0.3, 0.7).",
        "Liên kết không đồng bộ với lưới nước ngoài có thể dùng trạm back-to-back.",
        "Vì vậy đội ngũ vận hành, thí nghiệm cần nắm cả hai công nghệ.",
      ],
      note: "Số liệu quy hoạch theo bản tóm tắt QĐ 768/QĐ-TTg trên Tạp chí Công Thương. Đối chiếu nguyên văn quyết định và phụ lục trước khi trích dẫn trong văn bản chính thức; danh mục tuyến HVDC cụ thể chưa được nêu trong bản tóm tắt.",
    },
    {
      heading: "Câu hỏi ôn tập",
      points: [
        "Nếu nâng điện áp cực từ ±500 kV lên ±800 kV mà giữ 3000 MW, thông số nào ở mỗi tầng tăng, thông số nào giảm? Kiểm tra lại bằng tab 6.",
        "Giải thích chuỗi hệ quả từ thời gian tq vài trăm µs của thyristor tới dung lượng bộ lọc AC phải lắp tại trạm nghịch lưu.",
        "Với ESCR ≈ 2,45, nêu ba giải pháp kỹ thuật để giảm nguy cơ sự cố chuyển mạch và cái giá của từng giải pháp.",
        "Tuyến nối điện gió ngoài khơi Nam Trung Bộ ra Bắc Bộ nên dùng LCC, VSC hay lai? Lập luận theo năm tầng của bài.",
      ],
    },
  ]),
];
