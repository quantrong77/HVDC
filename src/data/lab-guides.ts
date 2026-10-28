/**
 * Hướng dẫn sử dụng từng phòng lab: mục tiêu, các bước thao tác, thí nghiệm gợi ý kèm kết quả cần quan sát,
 * và mục liên quan (bài học, phòng lab khác). Dùng chung cho trang Phòng lab và trang bài học.
 */

export type LabId = "waveform" | "vi-curve" | "vsc" | "sld" | "planner";

export interface LabExperiment {
  task: string;
  expect: string;
}

export interface LabGuide {
  id: LabId;
  title: string;
  goal: string;
  steps: string[];
  experiments: LabExperiment[];
  lessons: string[]; // Bài liên quan, theo thứ tự ưu tiên
  relatedLabs: LabId[];
}

export const LAB_GUIDES: Record<LabId, LabGuide> = {
  waveform: {
    id: "waveform",
    title: "Cầu Thyristor LCC: dạng sóng và góc kích",
    goal: "Thấy điện áp DC của cầu chỉnh lưu thay đổi theo góc kích α và góc trùng dẫn μ, và vì sao trạm nghịch lưu phải giữ góc dập γ đủ lớn.",
    steps: [
      "Chọn cầu 6 xung hoặc 12 xung ở góc trên bên phải. Bật “Hiện 3 pha AC” để thấy các điện áp dây mà van đang dẫn.",
      "Kéo thanh “Góc kích α” từ 0° đến 180°. Đường Vd(t) đổi hình dạng, còn ô Vd cho giá trị trung bình theo công thức Vd = Vd0·[cos α + cos(α+μ)]/2.",
      "Kéo “Góc trùng dẫn μ” để thêm khoảng chuyển mạch: trong μ độ đầu mỗi xung, hai van cùng dẫn và điện áp ra bằng trung bình hai điện áp dây, nên Vd giảm.",
      "Theo dõi các ô P, Q, cos φ và hệ số gợn sóng. Ở chế độ nghịch lưu (α > 90°), xem ô γ = 180° − (α + μ) đổi màu đỏ khi γ quá nhỏ.",
      "Dùng các nút “Thiết lập nhanh” để nhảy tới các điểm làm việc điển hình.",
    ],
    experiments: [
      { task: "Đặt α = 90°, μ = 0°.", expect: "Vd ≈ 0: công suất tác dụng bằng 0 nhưng bộ biến đổi vẫn tiêu thụ nhiều công suất phản kháng (cos φ ≈ 0)." },
      { task: "Giữ α = 15°, tăng μ từ 0° lên 25°.", expect: "Vd giảm vài phần trăm và cos φ giảm: trùng dẫn làm sụt áp DC và tăng nhu cầu Q." },
      { task: "Chọn “Sát giới hạn γ” rồi tăng thêm α hoặc μ.", expect: "Khi γ xuống dưới 17°, ô γ báo đỏ: nguy cơ sự cố chuyển mạch ở trạm nghịch lưu." },
      { task: "So sánh 6 xung với 12 xung ở cùng α.", expect: "Tần số gợn tăng từ 300 Hz lên 600 Hz và hệ số gợn đỉnh-đỉnh giảm rõ rệt, nên cuộn kháng và bộ lọc DC nhỏ hơn." },
    ],
    lessons: ["2.1", "2.3", "1.3"],
    relatedLabs: ["vi-curve", "sld"],
  },
  "vi-curve": {
    id: "vi-curve",
    title: "Đặc tính V-I và điểm làm việc",
    goal: "Hiểu cách trạm chỉnh lưu giữ dòng (CC) và trạm nghịch lưu giữ góc dập (CEA) phối hợp với nhau qua biên dòng ΔI, và điều gì xảy ra khi điện áp AC sụt.",
    steps: [
      "Đường xanh lá là đặc tính chỉnh lưu: đoạn dốc là giới hạn α_min, đoạn thẳng đứng tại I_ord là điều khiển giữ dòng.",
      "Đường cam là đặc tính nghịch lưu: đoạn thẳng đứng tại I_ord − ΔI là giữ dòng, đoạn dốc là giữ γ_min.",
      "Điểm tròn là giao điểm hai đặc tính, tức điểm làm việc. Khung trạng thái bên phải cho biết trạm nào đang giữ dòng.",
      "Kéo điện áp AC hai phía, dòng đặt I_ord và biên dòng ΔI, hoặc bấm các kịch bản có sẵn.",
    ],
    experiments: [
      { task: "Bấm “Vận hành bình thường”.", expect: "Chỉnh lưu giữ dòng, nghịch lưu giữ γ_min và quyết định điện áp DC." },
      { task: "Bấm “Sụt áp AC chỉnh lưu 10%”.", expect: "Chỉnh lưu chạm α_min, nghịch lưu chuyển sang giữ dòng tại I_ord − ΔI = 0,9 pu: công suất giảm nhưng hệ thống vẫn ổn định." },
      { task: "Bấm “Sự cố gần trạm chỉnh lưu”, rồi kéo điện áp AC chỉnh lưu xuống dưới khoảng 0,38 pu.", expect: "Vd giảm còn khoảng 0,42 pu với dòng 0,9 pu; khi xuống thấp hơn nữa, khung trạng thái báo VDCOL: trong thực tế bộ giới hạn dòng hạ dòng đặt để giảm nhu cầu Q và giúp lưới AC phục hồi." },
      { task: "Đặt ΔI = 0,05 rồi 0,2 trong lúc sụt áp chỉnh lưu.", expect: "ΔI lớn làm công suất sụt nhiều hơn khi chuyển chế độ; ΔI nhỏ dễ làm hai bộ điều khiển dòng tranh nhau." },
    ],
    lessons: ["3.1", "4.2", "2.1"],
    relatedLabs: ["waveform", "vsc"],
  },
  vsc: {
    id: "vsc",
    title: "Điều khiển VSC-HVDC: P, Q và điện áp DC",
    goal: "Thấy VSC điều khiển độc lập công suất tác dụng và phản kháng, trạm giữ Vdc tự cân bằng công suất, và giới hạn dòng thu hẹp miền P-Q.",
    steps: [
      "Trạm 1 điều khiển P1 và Q1 theo giá trị đặt. Trạm 2 giữ điện áp DC bằng bộ PI: Vdc tăng thì trạm 2 đưa thêm công suất lên lưới.",
      "Đặt P1 sau t = 2 s, Q1 sau t = 3 s và Q2 sau t = 4 s bằng thanh trượt. Ba đường nét đứt dọc trên biểu đồ đánh dấu thời điểm đổi.",
      "Bấm “Chạy mô phỏng” để xem diễn biến theo thời gian; biểu đồ cập nhật ngay khi kéo thanh trượt.",
      "Đọc miền P-Q: điểm làm việc của mỗi trạm phải nằm trong vòng nét đứt Smax. Ô “Q2 cuối” chuyển màu vàng khi Q bị giới hạn.",
    ],
    experiments: [
      { task: "Bấm “Kịch bản chuẩn”.", expect: "P1 tăng từ 0,5 lên 1 pu tại t = 2 s; Vdc lệch thoáng qua khoảng 8% rồi về 1 pu; Q của hai trạm không bị ảnh hưởng khi P đổi." },
      { task: "Bấm “Đảo chiều công suất”.", expect: "P1 và P2 đổi dấu mà điện áp DC giữ nguyên cực tính: khác với LCC phải đảo cực tính điện áp." },
      { task: "Bấm “Lưới nhận yếu (SCR 1,5)”.", expect: "Cùng Q2 = 0,2 pu nhưng điện áp AC trạm 2 tăng nhiều hơn so với SCR 3: lưới yếu nhạy với công suất phản kháng." },
      { task: "Bấm “Chạm giới hạn dòng”.", expect: "Q2 không đạt 0,6 pu vì P đã chiếm gần hết dòng định mức; điểm trạm 2 nằm trên vòng Smax." },
    ],
    lessons: ["2.2", "3.1", "4.2"],
    relatedLabs: ["vi-curve", "planner"],
  },
  sld: {
    id: "sld",
    title: "Sơ đồ đơn tuyến trạm biến đổi",
    goal: "Nhận biết các thiết bị chính của trạm HVDC, vị trí và vai trò của chúng, và cách các cấu hình đơn cực, lưỡng cực, giáp lưng khác nhau.",
    steps: [
      "Chọn cấu hình ở thanh trên: lưỡng cực, đơn cực đường về đất, đơn cực đường về kim loại, hoặc giáp lưng.",
      "Trỏ chuột vào một khối thiết bị để xem tên và vai trò ở dòng trạng thái dưới sơ đồ; nhấp (hoặc Tab rồi Enter) để mở bảng thông số chi tiết.",
      "Bật hoặc tắt truyền tải và kéo công suất đặt để thấy vạch dòng điện chạy trên đường dây.",
      "Trên điện thoại, vuốt ngang trong khung để xem toàn bộ sơ đồ.",
    ],
    experiments: [
      { task: "Chuyển từ lưỡng cực sang đơn cực đường về đất.", expect: "Chỉ còn một cực mang công suất, dòng trở về qua điện cực nối đất." },
      { task: "Chọn đơn cực đường về kim loại.", expect: "Dòng trở về qua dây dẫn thay vì qua đất, tránh ăn mòn và dòng DC vào trung tính MBA lân cận." },
      { task: "Chọn giáp lưng (Back-to-Back).", expect: "Không còn đường dây DC: hai bộ biến đổi đặt cùng một trạm để nối hai lưới không đồng bộ." },
      { task: "Mở lần lượt bộ lọc AC, MBA đổi nối, nhà van và cuộn kháng san bằng.", expect: "Đối chiếu vai trò của từng thiết bị với mục “Sáu khối chính của trạm” trong bài 1.3." },
    ],
    lessons: ["1.2", "1.3", "4.1"],
    relatedLabs: ["waveform", "planner"],
  },
  planner: {
    id: "planner",
    title: "Thiết kế sơ bộ tuyến HVDC",
    goal: "Luyện trình tự chọn phương án ở giai đoạn đầu dự án: so với HVAC, chọn cấp điện áp, chọn công nghệ, ước tính tổn thất và bù công suất phản kháng.",
    steps: [
      "Chọn loại tuyến: đường dây trên không hoặc cáp. Khoảng cách hòa vốn so với HVAC khác nhau rất nhiều giữa hai loại.",
      "Nhập công suất và cự ly. Ô tương ứng trong bảng chọn cấp điện áp được tô sáng.",
      "Nhập SCR lưới hai đầu và đánh dấu nếu cần nhiều điểm nhận hoặc khởi động đen. Công cụ gợi ý LCC, VSC hoặc Hybrid kèm lý do.",
      "Đọc tổn thất hai trạm, lượng bù Q (nếu có trạm LCC) và thông số đường dây hoặc loại cáp phù hợp.",
    ],
    experiments: [
      { task: "Đường dây trên không 3.000 MW, kéo cự ly từ 300 km lên 1.000 km.", expect: "Kết luận so với HVAC đổi từ “HVAC thường kinh tế hơn” sang “HVDC có lợi thế” khi vượt qua dải 500–800 km." },
      { task: "Đặt SCR phía phát xuống 2,0.", expect: "Công nghệ chuyển sang VSC vì LCC cần SCR ≥ 2,5–3,0." },
      { task: "8.000 MW, 1.500 km, SCR phía nhận 2,0.", expect: "Gợi ý Hybrid LCC–VSC giống dự án Wudongde: LCC ở đầu nguồn, VSC ở đầu nhận lưới yếu." },
      { task: "Chuyển sang cáp, 1.000 MW, 150 km.", expect: "Gợi ý VSC dùng cáp XLPE; nếu buộc dùng LCC thì cần cáp MI chịu đảo cực." },
    ],
    lessons: ["1.1", "1.2", "2.2"],
    relatedLabs: ["vsc", "sld"],
  },
};

export const LAB_ORDER: LabId[] = ["waveform", "vi-curve", "vsc", "sld", "planner"];

/** Các phòng lab có liên quan đến một bài học */
export function labsForLesson(lessonId: string): LabGuide[] {
  return LAB_ORDER.map((id) => LAB_GUIDES[id]).filter((g) => g.lessons.includes(lessonId));
}
