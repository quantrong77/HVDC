import { ALL_LESSONS } from "@/data/curriculum";

/**
 * Liên hệ ứng dụng kiến thức cơ sở (Cấp độ 0) vào hệ thống HVDC: mỗi khái niệm nằm ở đâu trong trạm và đường dây,
 * gắn với công việc vận hành, thí nghiệm, bảo vệ nào, và học tiếp ở bài nào của Cấp độ 1–4.
 * Bài Cấp độ 1–4 dùng chiều ngược lại (foundationsFor) để trỏ về kiến thức nền.
 */

export interface SystemLink {
  concept: string;
  inSystem: string; // Xuất hiện ở đâu trong hệ thống HVDC
  work: string; // Công việc vận hành, thí nghiệm, bảo vệ, quy hoạch liên quan
  next: string[]; // Bài học tiếp ở Cấp độ 1–4
}

export const SYSTEM_LINKS: Record<string, SystemLink[]> = {
  "0.1": [
    {
      concept: "Chế độ khóa, hiệu suất 98–99,5 %",
      inSystem: "Tổn hao trạm LCC khoảng 0,7 % P. Với trạm 3000 MW, khoảng 21 MW biến thành nhiệt, phần lớn trong nhà van.",
      work: "Vận hành hệ thống làm mát nước khử ion: giám sát nhiệt độ, lưu lượng và độ dẫn điện của nước.",
      next: ["1.3", "4.1"],
    },
    {
      concept: "So sánh LCC và VSC",
      inSystem: "LCC hợp với truyền tải công suất lớn, đi xa trên không. VSC hợp với cáp biển, điện gió ngoài khơi, lưới yếu và lưới nhiều đầu.",
      work: "Lập phương án đấu nối và chọn công nghệ cho các tuyến HVDC trong Quy hoạch điện VIII điều chỉnh.",
      next: ["1.1", "1.2", "2.2"],
    },
    {
      concept: "Nhiệt độ tiếp giáp Tj và điện trở nhiệt",
      inSystem: "Tj giới hạn khả năng quá tải ngắn hạn của van và dòng sự cố mà van chịu được.",
      work: "Đặt giới hạn quá tải trong điều khiển cực; theo dõi cảnh báo nhiệt độ van.",
      next: ["3.1", "4.1"],
    },
  ],
  "0.2": [
    {
      concept: "Phục hồi ngược, mạch snubber RC",
      inSystem: "Mỗi cấp thyristor có snubber RC và điện trở phân áp để chia đều điện áp giữa hàng chục cấp nối tiếp.",
      work: "Thí nghiệm định kỳ bằng valve tester: đo tụ và điện trở snubber, điện trở phân áp, khả năng khóa và khả năng mở của từng cấp.",
      next: ["1.3", "4.1"],
    },
    {
      concept: "Thời gian tq và góc tắt tối thiểu",
      inSystem: "tq của thyristor là cơ sở để đặt γmin 15–18° cho bộ điều khiển CEA ở trạm nghịch lưu.",
      work: "Kiểm tra giá trị cài đặt điều khiển; đọc bản ghi sự cố để xác định γ đã xuống dưới ngưỡng hay chưa.",
      next: ["2.1", "3.1", "4.2"],
    },
    {
      concept: "Hỏng ngắn mạch và cấp dự phòng",
      inSystem: "VBE đếm số cấp thyristor hỏng trong mỗi van; van vẫn chạy khi số cấp hỏng chưa vượt số cấp dự phòng.",
      work: "Theo dõi cảnh báo của VBE, lập kế hoạch thay thyristor trong lần cắt điện bảo dưỡng.",
      next: ["3.2", "4.1"],
    },
    {
      concept: "Mở nhầm do dv/dt và quá áp break-over",
      inSystem: "Van có kích bảo vệ (BOD) và chống sét ZnO song song để thyristor không bị đánh thủng.",
      work: "Phân tích bản ghi tác động BOD và chống sét van sau sự cố quá áp, sét đánh.",
      next: ["3.2"],
    },
  ],
  "0.3": [
    {
      concept: "Linh kiện điều khiển hoàn toàn (IGBT)",
      inSystem: "Trạm VSC/MMC tự tạo điện áp AC, điều khiển P và Q độc lập, khởi động đen được.",
      work: "Phương án nối điện gió ngoài khơi, cấp điện cho đảo, hỗ trợ lưới yếu.",
      next: ["2.2", "1.2"],
    },
    {
      concept: "Đóng gói module và press-pack",
      inSystem: "Quyết định cách nối tắt submodule hỏng bằng thyristor hoặc tiếp điểm bypass.",
      work: "Xử lý submodule hỏng, quản lý số submodule dự phòng mỗi nhánh.",
      next: ["2.2"],
    },
    {
      concept: "Tổn hao LCC khoảng 0,7 %, MMC khoảng 0,8–1 %",
      inSystem: "Chênh lệch tổn hao tích lũy thành chi phí điện năng suốt vòng đời dự án.",
      work: "So sánh kinh tế giữa các phương án công nghệ ở giai đoạn quy hoạch.",
      next: ["1.1"],
    },
  ],
  "0.4": [
    {
      concept: "Vd = Vd0·cos α",
      inSystem: "Bộ CC chỉnh lưu chỉnh α để giữ Id; OLTC chuyển nấc để đưa α về 12,5–17,5°.",
      work: "Theo dõi α trên HMI. α lệch khỏi dải danh định kéo dài là dấu hiệu nấc MBA chưa phù hợp.",
      next: ["2.1", "4.1"],
    },
    {
      concept: "Góc tắt γ và sự cố chuyển mạch",
      inSystem: "Đây là nguyên nhân gián đoạn công suất phổ biến nhất khi có sự cố lưới AC gần trạm nghịch lưu.",
      work: "Phân tích sự cố; phối hợp thời gian cắt sự cố của bảo vệ lưới AC lân cận với khả năng phục hồi của liên kết HVDC.",
      next: ["2.1", "3.1", "4.2"],
    },
    {
      concept: "Trùng dẫn μ và điện kháng Xc",
      inSystem: "Xc chủ yếu là điện kháng tản của MBA chuyển đổi, một thông số được chốt ngay từ khi đặt hàng MBA.",
      work: "Đọc biên bản thí nghiệm điện áp ngắn mạch của MBA chuyển đổi và hiểu ảnh hưởng của nó tới Vd, μ, γ.",
      next: ["1.3", "2.1"],
    },
  ],
  "0.5": [
    {
      concept: "Cầu 12 xung và sóng hài đặc trưng 12k ± 1",
      inSystem: "Bộ lọc AC điều hưởng 11/13 và 24/36, bộ lọc DC điều hưởng bậc 12 và 24.",
      work: "Đo kiểm sóng hài định kỳ. Khi một nhóm lọc ra sửa chữa, phải xét giới hạn công suất truyền tải theo số nhóm lọc tối thiểu.",
      next: ["2.3", "1.3"],
    },
    {
      concept: "Q ≈ P·tan φ",
      inSystem: "Các nhóm bộ lọc và tụ bù được đóng, cắt theo bậc công suất truyền tải.",
      work: "Thao tác đóng bộ lọc trước khi tăng công suất; phối hợp với điều độ về điện áp nút đấu nối.",
      next: ["4.1", "2.3"],
    },
    {
      concept: "SCR và ESCR",
      inSystem: "Quyết định LCC có làm việc an toàn tại một điểm đấu nối hay không, và có cần máy bù đồng bộ hoặc STATCOM không.",
      work: "Nghiên cứu đấu nối, đánh giá độ cứng lưới tại các nút đặt trạm HVDC.",
      next: ["1.1", "4.2"],
    },
  ],
  "0.6": [
    {
      concept: "CC, CEA và biên dòng ΔId",
      inSystem: "Đặc tính V-I của hai trạm và việc tự chuyển chế độ khi sụt áp lưới AC.",
      work: "Đọc chế độ điều khiển trên HMI; giải thích công suất giảm đúng bằng ΔId khi lưới phía phát sụt áp.",
      next: ["3.1"],
    },
    {
      concept: "VDCOL",
      inSystem: "Giới hạn dòng khi điện áp DC thấp, giúp liên kết phục hồi êm sau sự cố AC.",
      work: "Kiểm tra cài đặt VDCOL; đánh giá thời gian phục hồi công suất trong bản ghi sự cố.",
      next: ["3.1", "4.2"],
    },
    {
      concept: "Cưỡng bức nghịch lưu và khởi động lại",
      inSystem: "Trình tự xử lý sự cố đường dây DC: đẩy α lên 120–150°, chờ khử ion rồi khởi động lại.",
      work: "Phối hợp bảo vệ đường dây DC; thống kê số lần khởi động lại thành công.",
      next: ["3.2"],
    },
    {
      concept: "Thử nghiệm van theo IEC 60700-1, điều khiển OLTC",
      inSystem: "Van được thử nghiệm điển hình và xuất xưởng; OLTC là vòng điều khiển chậm của trạm.",
      work: "Nghiệm thu van, lập quy trình thí nghiệm định kỳ; vận hành chuyển nấc MBA chuyển đổi.",
      next: ["4.1"],
    },
  ],
  "0.7": [
    {
      concept: "Điều khiển vector dq: id cho P, iq cho Q",
      inSystem: "Một trạm VSC giữ Udc, trạm kia giữ P; mỗi trạm tự điều khiển Q hoặc điện áp AC.",
      work: "Đặt chế độ điều khiển hai trạm VSC; hỗ trợ điều áp cho lưới tại điểm đấu nối.",
      next: ["2.2"],
    },
    {
      concept: "MMC nửa cầu không chặn được dòng sự cố DC",
      inSystem: "Với đường dây trên không, cần MMC cầu đủ hoặc máy cắt DC; với cáp, thường cắt bằng máy cắt AC.",
      work: "Chọn phương án bảo vệ đường dây DC cho dự án VSC.",
      next: ["3.2", "2.2"],
    },
    {
      concept: "PLL và điều khiển tạo lưới (grid-forming)",
      inSystem: "PLL dùng chung cho EPC của LCC và điều khiển vector của VSC; grid-forming giúp VSC làm việc với lưới rất yếu.",
      work: "Đánh giá khả năng hỗ trợ lưới yếu và khởi động đen của trạm VSC.",
      next: ["3.1", "2.2"],
    },
  ],
};

/** Kiến thức nền Cấp độ 0 liên quan tới một bài Cấp độ 1–4 (chiều ngược của SYSTEM_LINKS) */
export function foundationsFor(lessonId: string): { lessonId: string; title: string; concepts: string[] }[] {
  return Object.entries(SYSTEM_LINKS)
    .map(([id, links]) => ({
      lessonId: id,
      title: ALL_LESSONS.find((l) => l.id === id)?.title ?? id,
      concepts: links.filter((l) => l.next.includes(lessonId)).map((l) => l.concept),
    }))
    .filter((x) => x.concepts.length > 0);
}
