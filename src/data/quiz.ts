import { QuizQuestion } from "@/types/hvdc";

export const QUIZ_PASS_RATIO = 0.8;

export const HVDC_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    level: 1,
    topic: "Fundamentals",
    question: "Vì sao cáp biển dài trên khoảng 50-80 km gần như bắt buộc dùng HVDC?",
    options: [
      "Cáp DC có tiết diện nhỏ hơn cáp AC",
      "Dòng nạp dung kháng của cáp AC chiếm gần hết khả năng tải",
      "Cáp AC không chịu được điện áp trên 220 kV",
      "HVDC không cần trạm biến đổi ở hai đầu",
    ],
    correctIndex: 1,
    explanation:
      "Cáp có điện dung lớn. Với điện áp AC, dòng nạp tăng theo chiều dài, chiếm hết dòng định mức của cáp. Ở chế độ xác lập DC không có dòng nạp này.",
    evnReference: "Tong quan HVDC 1 - Bài 1.1",
  },
  {
    id: "q2",
    level: 2,
    topic: "LCC",
    question: "Với cầu 6 xung, V_LL = 210 kV, α = 60°, μ = 0, điện áp DC trung bình Vd xấp xỉ bằng bao nhiêu?",
    options: ["283,6 kV", "245,6 kV", "141,8 kV", "105,0 kV"],
    correctIndex: 2,
    explanation: "Vd0 = 1,35 × 210 ≈ 283,6 kV; Vd = Vd0·cos 60° = 141,8 kV.",
    evnReference: "Dien tu CS trong HVDC - Bài 2.1",
  },
  {
    id: "q3",
    level: 2,
    topic: "LCC",
    question: "Trạm nghịch lưu chạy với α = 145° và μ = 22°. Góc dập γ là bao nhiêu và có an toàn không?",
    options: [
      "γ = 35°, an toàn",
      "γ = 13°, nguy cơ thất bại chuyển mạch",
      "γ = 23°, an toàn",
      "γ = 167°, an toàn",
    ],
    correctIndex: 1,
    explanation:
      "γ = 180° − (145° + 22°) = 13°, nhỏ hơn γ_min ≈ 17°. Van không đủ thời gian phục hồi khả năng khóa, dễ gây thất bại chuyển mạch.",
    evnReference: "Dien tu CS trong HVDC - Bài 2.1",
  },
  {
    id: "q4",
    level: 2,
    topic: "Filters",
    question: "Cầu 12 xung loại bỏ được sóng hài bậc nào phía AC so với cầu 6 xung?",
    options: ["Bậc 11 và 13", "Bậc 5 và 7", "Bậc 12 và 24", "Bậc 3 và 9"],
    correctIndex: 1,
    explanation:
      "Hai cầu lệch pha 30° qua MBA Y/Y và Y/Δ làm sóng hài bậc 5, 7, 17, 19... triệt tiêu nhau. Các bậc đặc trưng còn lại là 12k ± 1 (11, 13, 23, 25...).",
    evnReference: "Sóng hài & Bộ lọc - Bài 2.3",
  },
  {
    id: "q5",
    level: 2,
    topic: "Filters",
    question: "Tần số gợn sóng chủ đạo phía DC của cầu 12 xung trên lưới 50 Hz là bao nhiêu?",
    options: ["50 Hz", "300 Hz", "600 Hz", "1200 Hz"],
    correctIndex: 2,
    explanation: "Gợn sóng DC có tần số p·f = 12 × 50 = 600 Hz, tương ứng sóng hài DC bậc 12.",
    evnReference: "Sóng hài & Bộ lọc - Bài 2.3",
  },
  {
    id: "q6",
    level: 2,
    topic: "VSC",
    question: "Ưu điểm nào chỉ có ở VSC mà LCC không có?",
    options: [
      "Truyền được công suất lớn hơn 3000 MW",
      "Khởi động đen và cấp nguồn cho lưới không có nguồn",
      "Dùng Thyristor kích bằng ánh sáng",
      "Không cần máy biến áp",
    ],
    correctIndex: 1,
    explanation:
      "IGBT tự đóng cắt được nên VSC tự tạo điện áp AC, không cần lưới AC để chuyển mạch. Nhờ đó VSC có thể Black start. LCC cần lưới AC đủ mạnh (SCR lớn).",
    evnReference: "HVDC PLUS (Siemens) - Bài 2.2",
  },
  {
    id: "q7",
    level: 2,
    topic: "VSC",
    question: "Khi đảo chiều công suất, hệ thống VSC-HVDC thay đổi đại lượng nào?",
    options: [
      "Đảo cực tính điện áp DC",
      "Đảo chiều dòng điện DC, giữ nguyên cực tính điện áp",
      "Đổi tổ đấu dây máy biến áp",
      "Tăng góc kích α lên trên 90°",
    ],
    correctIndex: 1,
    explanation:
      "VSC giữ cực tính điện áp và đảo chiều dòng. Vì vậy VSC phù hợp với cáp XLPE và lưới đa cực. LCC thì phải đảo cực điện áp.",
    evnReference: "HVDC PLUS (Siemens) - Bài 2.2",
  },
  {
    id: "q8",
    level: 3,
    topic: "Protection",
    question: "Ở chế độ vận hành bình thường của hệ thống LCC hai đầu, trạm nào giữ dòng điện DC?",
    options: [
      "Trạm nghịch lưu, bằng điều khiển CC",
      "Trạm chỉnh lưu, bằng điều khiển CC",
      "Cả hai trạm cùng giữ dòng",
      "Không trạm nào, dòng do tải quyết định",
    ],
    correctIndex: 1,
    explanation:
      "Chỉnh lưu giữ dòng (CC), nghịch lưu giữ γ_min (CEA) và quyết định điện áp. Biên dòng ΔI ≈ 0,1 pu ngăn hai bộ điều khiển dòng tranh chấp.",
    evnReference: "Dieu khien bao ve HVDC - Bài 3.1",
  },
  {
    id: "q9",
    level: 3,
    topic: "Protection",
    question: "Khi điện áp AC phía chỉnh lưu sụt mạnh, điểm làm việc trên đặc tính V-I thay đổi thế nào?",
    options: [
      "Dòng DC tăng vọt lên 2 pu",
      "Nghịch lưu chuyển sang giữ dòng, dòng DC giảm đúng bằng biên dòng ΔI",
      "Điện áp DC tăng để bù",
      "Trạm chỉnh lưu chuyển sang chế độ CEA",
    ],
    correctIndex: 1,
    explanation:
      "Chỉnh lưu chạm α_min, mất khả năng giữ dòng. Điểm làm việc chuyển sang đoạn CC của nghịch lưu tại I_ord − ΔI.",
    evnReference: "Dieu khien bao ve HVDC - Bài 3.1",
  },
  {
    id: "q10",
    level: 3,
    topic: "Protection",
    question: "Bảo vệ nào phát hiện sự cố trên đường dây DC nhanh nhất, trong vài mili giây?",
    options: [
      "Bảo vệ quá tải nhiệt van",
      "Bảo vệ sóng truyền (Traveling wave)",
      "Bảo vệ so lệch MBA đổi nối",
      "Bảo vệ điện áp thấp phía AC",
    ],
    correctIndex: 1,
    explanation:
      "Bảo vệ sóng truyền dựa vào độ dốc và biên độ sóng điện áp/dòng điện lan truyền từ điểm sự cố, tác động trong vài ms. Sau đó hệ thống dập hồ quang bằng cách đẩy α về vùng nghịch lưu.",
    evnReference: "Dieu khien bao ve HVDC - Bài 3.2",
  },
];
