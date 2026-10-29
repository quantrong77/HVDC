import { BKHN_SUPPLEMENTS } from "@/data/supplements-bkhn";
import { GIAOTRINH_SUPPLEMENTS } from "@/data/supplements-giaotrinh";

/**
 * Nội dung bổ sung cho từng bài, tổng hợp (diễn đạt lại) từ tài liệu tham khảo trong docs/references.
 * Mỗi nguồn ghi rõ tác giả và số trang để người học đối chiếu bản gốc.
 */

export interface SupplementTable {
  caption?: string;
  columns: string[];
  rows: string[][];
}

export interface SupplementSection {
  heading: string;
  points: string[];
  table?: SupplementTable;
  formulas?: string[]; // Công thức LaTeX, render bằng KaTeX dưới các ý
  note?: string; // Ghi chú biên soạn: chỗ tài liệu gốc cần lưu ý hoặc đã được hiệu chỉnh
}

export interface LessonSupplement {
  lessonId: string;
  source: string;
  author: string;
  pages: string;
  sections: SupplementSection[];
}

const HAI_HA_SOURCE = "Xây dựng và vận hành hệ thống truyền tải điện cao áp một chiều HVDC (Nha Trang, 21/4/2025)";
const HAI_HA_AUTHOR =
  "Nguyễn Hải Hà, Phòng Kỹ thuật PTC3. Dựa trên slide của IES trong khóa “Phát triển và vận hành hệ thống HVDC” cho EVNNPT (Aus4Skills, 2025)";

const haiHa = (lessonId: string, pages: string, sections: SupplementSection[]): LessonSupplement => ({
  lessonId,
  source: HAI_HA_SOURCE,
  author: HAI_HA_AUTHOR,
  pages,
  sections,
});

const basslink = (lessonId: string, pages: string, sections: SupplementSection[]): LessonSupplement => ({
  lessonId,
  source: "Tóm tắt hệ thống Basslink (bản dịch sơ bộ từ tài liệu kỹ thuật của trạm)",
  author: "Nguyễn Hải Hà, Phòng Kỹ thuật PTC3",
  pages,
  sections,
});

const australiaTrip = (lessonId: string, pages: string, sections: SupplementSection[]): LessonSupplement => ({
  lessonId,
  source: "Báo cáo kết quả chuyến công tác khóa đào tạo “Phát triển và Vận hành hệ thống HVDC” tại Australia (22/2–5/3/2025)",
  author: "Phòng Kỹ thuật PTC3, người tham dự: Nguyễn Hải Hà",
  pages,
  sections,
});

export const LESSON_SUPPLEMENTS: LessonSupplement[] = [
  haiHa("1.1", "tr. 5–12, 61–75", [
    {
      heading: "Vì sao truyền tải một chiều",
      points: [
        "Công suất P = U·I còn tổn thất ΔP = I²·R. Truyền ở điện áp cao giúp giảm dòng và giảm tổn thất.",
        "Lưới AC luôn có công suất phản kháng và giới hạn ổn định góc khi truyền tải đi xa. Đường dây DC không gặp hai vấn đề này.",
        "Ví dụ so sánh tổn thất trong tài liệu: khoảng 3,5% với HVDC so với trên 6% với HVAC cho cùng nhiệm vụ truyền tải.",
        "HVDC cho phép nối hai lưới khác tần số hoặc không đồng bộ. Hệ thống cần trạm biến đổi ở cả hai đầu: chỉnh lưu ở đầu phát, nghịch lưu ở đầu nhận.",
      ],
    },
    {
      heading: "Từ Edison đến HVDC",
      points: [
        "Hệ thống điện hoàn chỉnh đầu tiên (Pearl Street, New York, 9/1882) là hệ một chiều 110 V, cấp cho 59 khách hàng trong bán kính 1,5 km qua cáp ngầm.",
        "Từ năm 1884, động cơ điện của Frank Sprague đưa phụ tải động lực vào lưới một chiều.",
      ],
    },
    {
      heading: "Hạn chế của truyền tải HVAC đi xa",
      points: [
        "Khi khoảng cách tăng, tổn thất và nhu cầu công suất phản kháng tăng, nên phạm vi truyền tải hiệu quả bị giới hạn.",
        "Với dòng xoay chiều, hiệu ứng bề mặt và hiệu ứng lân cận dồn dòng ra mặt ngoài dây dẫn, làm tăng điện trở hiệu dụng.",
        "Cáp ngầm và cáp biển có điện dung lớn, phải nạp liên tục. Trên khoảng 50 km, dòng nạp chiếm phần lớn khả năng tải của cáp AC.",
        "Nối lưới AC đồng bộ đòi hỏi đồng bộ hóa máy phát, rất khó thực hiện với các hệ thống liên kết rộng.",
      ],
    },
    {
      heading: "Ưu điểm của đường dây HVDC",
      points: [
        "Điều khiển chính xác dòng công suất. Dòng AC phân bố theo trở kháng (định luật Kirchhoff), còn dòng trên đường dây DC được đặt cả chiều lẫn độ lớn.",
        "Không có hiệu ứng bề mặt: dòng chạy đều trên toàn tiết diện, nên dây dẫn nhỏ hơn cho cùng công suất. Tổn thất vầng quang và nhiễu vô tuyến cũng thấp hơn.",
        "Chỉ có tổn thất điện trở, không có tổn thất cảm kháng hay dung kháng, nên khoảng cách và công suất truyền tải gần như không bị giới hạn về mặt kỹ thuật. Ví dụ là dự án Australia–Asia PowerLink (SunCable) dài khoảng 4.200 km.",
        "Hành lang tuyến (ROW) hẹp hơn: chỉ cần 2 dây dẫn thay vì 3, cột đơn giản hơn và ít thép hơn.",
        "Phù hợp với cáp ngầm và cáp biển.",
      ],
      table: {
        caption: "So sánh các thành phần tổn thất",
        columns: ["Hình thức tổn thất", "HVDC", "HVAC"],
        rows: [
          ["Tổn thất điện trở", "Có", "Có"],
          ["Tổn thất do cảm kháng", "Không", "Có"],
          ["Tổn thất do dung kháng", "Không", "Có"],
          ["Tăng điện trở do hiệu ứng bề mặt", "Không", "Có"],
        ],
      },
    },
    {
      heading: "Nhược điểm",
      points: [
        "Trạm biến đổi và bộ lọc ở hai đầu có chi phí cao. Máy cắt DC đắt hơn nhiều so với máy cắt AC.",
        "Không thể đổi cấp điện áp bằng máy biến áp đơn giản như trong lưới AC.",
        "Điều khiển bộ biến đổi khi có sự cố đòi hỏi kiến thức sâu về điện tử công suất. Hệ thống làm mát van cũng là một thách thức.",
        "Trạm LCC tiêu thụ nhiều công suất phản kháng ở cả hai đầu.",
      ],
    },
    {
      heading: "Khoảng cách hòa vốn và năng lượng tái tạo",
      points: [
        "Chi phí trạm HVDC cao nhưng chi phí đường dây trên mỗi km thấp, nên hai đường chi phí cắt nhau tại khoảng cách hòa vốn.",
        "HVDC khai thác được sự khác biệt về chế độ gió và múi giờ của nguồn mặt trời giữa các vùng xa nhau, và đưa điện từ nơi có gió, nắng đến trung tâm phụ tải.",
        "HVDC tận dụng được nguồn lưu trữ sẵn có, ví dụ thủy điện ở Tasmania, và phù hợp với các hệ thống điện trải dài như Việt Nam và Australia.",
      ],
      note: "Tài liệu nêu hai mốc hòa vốn cho đường dây trên không: trên 600 km (tr. 8) và 800–1.000 km (tr. 73). Với cáp biển, cả hai trang đều ghi khoảng 50 km. Mốc thực tế phụ thuộc giá thiết bị và công suất của từng dự án.",
      table: {
        caption: "Tổng kết HVAC và HVDC",
        columns: ["Tiêu chí", "HVAC", "HVDC"],
        rows: [
          ["Giới hạn khoảng cách truyền tải", "Có", "Không"],
          ["Đường kính dây dẫn", "Lớn", "Nhỏ"],
          ["Cấu trúc hệ thống", "Đơn giản", "Phức tạp"],
          ["Chi phí đầu tư", "Thấp", "Cao"],
          ["Tổn thất", "Cao", "Thấp"],
          ["Kết cấu cột", "Lớn", "Đơn giản hơn"],
          ["Nối hai lưới khác tần số", "Không", "Có"],
        ],
      },
    },
  ]),

  haiHa("1.2", "tr. 42–59", [
    {
      heading: "Hệ thống đơn cực (monopolar)",
      points: [
        "Dùng một dây dẫn cực giữa hai trạm, chi phí thấp nhất nhưng không phù hợp với công suất rất lớn.",
        "Đường dây trên không thường chọn cực âm vì vầng quang và nhiễu vô tuyến ít hơn.",
        "Hồi lưu qua đất hoặc biển: bố trí đơn giản nhất, phổ biến với cáp biển, nhưng thiết kế điện cực nối đất phức tạp.",
        "Hồi lưu bằng dây kim loại: dùng khi không thể đặt điện cực, vì lý do môi trường hoặc thiếu quỹ đất.",
      ],
    },
    {
      heading: "Hệ thống lưỡng cực (bipolar)",
      points: [
        "Là cấu hình phổ biến nhất: một cực dương và một cực âm có điện áp bằng nhau. Mỗi đầu có hai bộ biến đổi định mức bằng nhau, trung tính được nối đất.",
        "Ở chế độ bình thường, hầu như không có dòng qua đất, chỉ có một lượng dòng nhỏ khi hai cực mất cân bằng.",
        "Khi một cực sự cố, cực còn lại vẫn vận hành như hệ đơn cực, hồi lưu qua đất hoặc qua dây dẫn của cực hỏng.",
        "Lưỡng cực có dây hồi lưu kim loại: dùng khi không đặt được điện cực, các chế độ dự phòng giống lưỡng cực hồi lưu đất.",
        "Lưỡng cực không có đường hồi lưu riêng: rẻ nhất, nhưng khi cáp của một cực hỏng thì toàn hệ thống phải dừng.",
      ],
    },
    {
      heading: "Hệ đồng cực (homopolar) và Back-to-Back",
      points: [
        "Hệ đồng cực: từ hai dây dẫn trở lên trên cùng cột, cùng cực tính (thường là cực âm), hồi lưu qua đất. Khi một dây hỏng, dây còn lại có thể quá tải trên 50%. Nhược điểm là dòng hồi lưu qua đất lớn, nên ít được dùng.",
        "Back-to-Back: chỉnh lưu và nghịch lưu đặt cùng một trạm, không có đường dây, điện áp DC thấp. Dùng để nối hai lưới AC không đồng bộ.",
        "Theo thống kê 160 dự án (2017), cấu hình lưỡng cực chiếm phần lớn các dự án truyền tải.",
      ],
    },
    {
      heading: "Lưới HVDC nhiều trạm (MTDC)",
      points: [
        "Hai trạm (điểm–điểm): dễ triển khai nhất, mua từ một nhà cung cấp, phục vụ một mục đích, công nghệ đã hoàn thiện.",
        "Đa trạm hình tia: phục vụ nhiều mục đích với ít bộ biến đổi hơn, nên chi phí và tổn thất thấp hơn, nhưng các thiết bị phải tương thích với nhau.",
        "Đa trạm mạch vòng: có đường dự phòng, tăng tính khả dụng và giảm ảnh hưởng lên lưới AC, nhưng bắt buộc có hệ thống bảo vệ DC.",
        "Nghiên cứu phối hợp ngoài khơi của National Grid ESO (Anh, 2020) cho thấy chi phí vòng đời thấp hơn khoảng 18%, giảm tác động môi trường và xã hội, tăng an ninh cung cấp điện.",
        "Nghiên cứu điện gió ngoài khơi Đại Tây Dương của NREL (Mỹ) cho thấy lợi ích thường gấp khoảng 2 lần chi phí, nhờ giảm cắt giảm công suất và giảm huy động tổ máy đắt tiền.",
        "Các dự án mới dùng VSC vì đảo chiều công suất bằng cách đảo chiều dòng điện mà giữ nguyên cực tính điện áp, rất phù hợp với lưới đa trạm. Máy cắt DC, bộ biến đổi cầu đầy đủ và bộ hạn dòng siêu dẫn giúp loại trừ sự cố DC mà không làm mất ổn định tần số lưới AC.",
        "Trên thế giới đã có nhiều lưới HVDC 3–5 trạm vận hành hơn 30 năm, gồm cả công nghệ LCC và VSC.",
      ],
    },
  ]),

  haiHa("1.3", "tr. 14–19, 26–29, 34–40", [
    {
      heading: "Các thành phần chính của trạm",
      points: [
        "Một hệ thống HVDC điển hình gồm: máy biến áp chuyển đổi, bộ biến đổi, bộ lọc, cuộn san dòng, đường dây hoặc cáp DC, nguồn công suất phản kháng.",
        "Bố trí trạm gồm: sân phân phối AC, tụ bù ngang và bộ lọc sóng hài, máy biến áp chuyển đổi, nhà van, sân DC và đầu đường dây DC.",
        "Hệ thống điều khiển quyết định công suất truyền tải và chiều truyền công suất.",
      ],
    },
    {
      heading: "Máy biến áp chuyển đổi",
      points: [
        "Khác với máy biến áp AC thông thường: phải chịu đồng thời ứng suất điện áp DC và dòng sóng hài từ phía điện tử công suất.",
        "Sóng hài làm tăng từ thông tản và gây điểm nóng cục bộ trong cuộn dây, nên cần làm mát bổ sung.",
        "Có thể dùng 2 máy ba pha hoặc 3 máy một pha cho mỗi tổ. Mức cách điện phải chịu được quá điện áp quá độ và quá điện áp thao tác.",
      ],
    },
    {
      heading: "Bộ biến đổi và van",
      points: [
        "Đơn vị cơ bản là cầu 6 xung, nhưng hầu hết trạm HVDC dùng cầu 12 xung gồm 12 van.",
        "Mỗi van gồm nhiều thyristor nối tiếp để đạt điện áp định mức, được ghép thành van đơn, van kép hoặc van bốn (quadrivalve).",
        "Vai trò chỉnh lưu và nghịch lưu của hai trạm có thể hoán đổi bằng bộ điều khiển, từ đó đảo chiều truyền công suất.",
      ],
    },
    {
      heading: "Cuộn san dòng",
      points: [
        "Nối tiếp với bộ biến đổi ở phía DC, có thể đặt ở phía đường dây hoặc phía trung tính.",
        "San phẳng dòng DC, giảm sóng hài trên đường dây DC và hạn chế dòng sự cố, nhờ đó giảm ứng suất lên van khi dòng thay đổi đột ngột.",
        "Ngăn dòng bị gián đoạn khi vận hành ở dòng nhỏ, và giảm nguy cơ thất bại chuyển mạch ở trạm nghịch lưu.",
        "Ví dụ trong tài liệu: cuộn san dòng ngâm dầu có điện cảm khoảng 1 H.",
      ],
      note: "Mục thiết bị trên sơ đồ SLD ghi 150–300 mH cho cuộn kháng lõi không khí. Giá trị điện cảm khác nhau tùy dự án và kiểu cuộn kháng (ngâm dầu hay lõi không khí).",
    },
    {
      heading: "Máy cắt AC và điện cực",
      points: [
        "Máy cắt phía AC dùng để cô lập sự cố máy biến áp và cắt trạm ra khỏi lưới. Sự cố phía DC được bộ điều khiển van xử lý nhanh hơn.",
        "Điện cực là vật dẫn nối đất làm điểm trung tính, có diện tích bề mặt lớn để giảm mật độ dòng và gradient điện thế trên mặt đất.",
      ],
    },
    {
      heading: "Đường dây và cáp DC",
      points: [
        "Đường dây DC chỉ cần 2 dây dẫn chính. Do không có hiệu ứng bề mặt, dây dẫn nhỏ hơn đường dây AC cùng công suất.",
        "Dây dẫn thường bằng nhôm hoặc hợp kim nhôm. Dây composite dùng lõi sợi carbon hoặc sợi thủy tinh.",
        "Cáp DC gồm ruột đồng hoặc nhôm, lớp bán dẫn, cách điện XLPE chịu được điện trường cao, vỏ kim loại và lớp bọc polymer chống ăn mòn.",
        "Ví dụ Basslink (Australia): cáp ngâm dầu cách điện bằng giấy, 400 kVDC, 1.250 A, nhiệt độ ruột tối đa 55 °C, tiết diện 1.500 mm² đoạn dưới biển và 2.000 mm² đoạn trên bờ. Cáp hồi lưu XLPE 12 kVDC, cáp quang 12 sợi. Rãnh cáp ngoài khơi sâu 1,5 m, rộng 0,7 m, được tạo bằng máy phun áp lực và tự lấp bằng cát theo thời gian.",
      ],
    },
  ]),

  haiHa("2.1", "tr. 20–24", [
    {
      heading: "Bộ biến đổi nguồn dòng (CSC/LCC)",
      points: [
        "Dòng trong mạch DC chỉ chạy một chiều. Muốn đảo chiều công suất phải đảo cực tính điện áp DC.",
        "Phần lớn hệ thống HVDC đang vận hành là loại CSC, công nghệ đã hoàn thiện và đạt cấp điện áp đến ±800 kV.",
        "Dùng van thyristor, chuyển mạch nhờ điện áp lưới AC, nên có thể xảy ra thất bại chuyển mạch khi lưới AC yếu hoặc sụt áp.",
      ],
    },
  ]),

  haiHa("2.2", "tr. 22–24", [
    {
      heading: "Bộ biến đổi nguồn áp (VSC)",
      points: [
        "Dùng điều chế độ rộng xung (PWM) để điều khiển cả biên độ lẫn góc pha điện áp, nhờ đó điều khiển độc lập công suất tác dụng và phản kháng, cũng như điện áp và tần số.",
        "Dùng van IGBT tự chuyển mạch, nên không xảy ra thất bại chuyển mạch.",
        "Số hệ thống VSC đang vận hành ít hơn LCC, nhưng công nghệ đang phát triển nhanh về công suất và cấp điện áp.",
      ],
      note: "Tài liệu ghi VSC đạt khoảng 350 kV. Một số dự án VSC mới đã ở cấp ±525 kV, nên nên kiểm tra số liệu cập nhật khi so sánh.",
    },
  ]),

  haiHa("2.3", "tr. 30–33", [
    {
      heading: "Bộ lọc AC và DC",
      points: [
        "Quá trình chuyển mạch ở hai đầu sinh sóng hài, có thể lan sang lưới AC và gây quá nhiệt thiết bị, nên cần lọc ở cả phía AC và DC.",
        "Bộ lọc là tổ hợp tụ điện và cuộn cảm được điều hưởng theo các bậc sóng hài cần loại bỏ.",
        "Bộ lọc AC có trở kháng thấp ở tần số điều hưởng và đồng thời cấp công suất phản kháng cho bộ biến đổi. Bộ lọc DC nhỏ hơn và rẻ hơn bộ lọc AC.",
        "VSC sinh ít sóng hài hơn LCC, nên cần ít bộ lọc hơn.",
      ],
    },
    {
      heading: "Nguồn công suất phản kháng",
      points: [
        "Bộ biến đổi CSC tiêu thụ công suất phản kháng khoảng 40–60% công suất định mức. Mức này giảm được nhờ bộ điều áp dưới tải của máy biến áp, và bộ lọc sóng hài cũng cấp một phần.",
        "Tụ bù song song: nguồn phổ biến nhất, đóng cắt theo nhu cầu.",
        "Máy bù đồng bộ: máy điện quay không tải, điều chỉnh kích từ để phát hoặc thu công suất phản kháng, đồng thời tăng ổn định điện áp và độ mạnh lưới.",
        "SVC: thiết bị điện tử công suất điều chỉnh điện áp và hệ số công suất rất nhanh, phù hợp để hỗ trợ trạm HVDC.",
      ],
    },
  ]),

  haiHa("4.2", "tr. 77–88", [
    {
      heading: "Các tuyến HVDC tại Australia",
      points: [
        "Thị trường điện quốc gia Australia (NEM) có 3 tuyến HVDC đang vận hành và 1 tuyến đang xây dựng, cung cấp dịch vụ truyền tải theo Quy định ngành điện quốc gia (NER).",
        "Directlink (NSW–Queensland): công nghệ VSC (HVDC Light), gồm 3 cặp cáp ngầm polyme ±80 kV, mỗi cặp 60 MW. Tuyến nối lưới 132 kV của NSW với lưới 110 kV của Queensland, dự kiến khấu hao hết năm 2041.",
        "Murraylink (Victoria–Nam Australia): VSC 220 MW hai chiều, khoảng 176 km cáp ngầm, ±150 kV. Mỗi đầu phát hoặc thu công suất phản kháng từ +140 đến −150 MVAr, nối lưới 220 kV tại Red Cliffs và 132 kV tại Berri.",
        "Basslink (Victoria–Tasmania): 500 MW, đơn cực 400 kV, khoảng 370 km gồm đường dây trên không, cáp ngầm và 290 km cáp biển, nối Loy Yang với George Town (220 kV). Tuyến này đảm bảo an ninh năng lượng cho Tasmania và cân bằng điện năng giữa hai bang.",
        "Marinus Link (Victoria–Tasmania, đang xây dựng): 1.500 MW chia 2 giai đoạn 750 MW, ±320 kV, công nghệ HVDC Light của Hitachi Energy. Tổng chiều dài 345 km (255 km dưới biển, 90 km ngầm trên bờ), dự kiến vận hành giai đoạn 1 năm 2030 và giai đoạn 2 năm 2032.",
      ],
      table: {
        caption: "Tóm tắt các tuyến HVDC tại Australia",
        columns: ["Tuyến", "Nối lưới", "Năm", "Công suất", "Điện áp DC", "Chiều dài cáp", "Công nghệ"],
        rows: [
          ["Directlink", "NSW – Queensland", "2000", "3 × 60 MW", "±80 kV", "59 km", "VSC"],
          ["Murraylink", "Victoria – Nam Australia", "2002", "220 MW", "±150 kV", "~180 km", "VSC"],
          ["Basslink", "Victoria – Tasmania", "2006", "500 MW", "400 kV", "~370 km", "LCC"],
          ["Marinus Link", "Victoria – Tasmania", "2030 (dự kiến)", "2 × 750 MW", "±320 kV", "345 km", "VSC"],
        ],
      },
      note: "Slide tr. 85 ghi Basslink dùng VSC. Thực tế Basslink là hệ đơn cực LCC Thyristor 400 kV có dây hồi lưu kim loại, khớp với mô tả cáp ngâm dầu 400 kVDC kèm cáp hồi lưu ở tr. 40, nên bảng trên ghi LCC. Phần chi phí dự án trong slide không được đưa vào vì chưa rõ đơn vị tiền tệ.",
    },
  ]),

  basslink("1.3", "mục 1.3", [
    {
      heading: "Cấu tạo van và thiết bị chính của trạm Basslink",
      points: [
        "Mỗi trạm là một nhóm van 12 xung: hai cầu 6 xung nối tiếp, cấp từ hai cuộn thứ cấp Y và Δ lệch nhau 30°. Bốn van nối cùng một pha MBA đặt chung một khối gọi là van bốn (quadrivalve); ba van bốn treo từ trần nhà van.",
        "Mỗi van gồm hai mô-đun, mỗi mô-đun 30 thyristor nối tiếp kèm 8 cuộn kháng bão hòa, song song với tụ phân áp; mỗi van có một hoặc hai chống sét. Tổng cộng 30 × 2 × 12 = 720 thyristor kích bằng ánh sáng (Siemens).",
        "Cuộn kháng san bằng 250 mH ±5 %, 1.250 A DC, có vỏ giảm tiếng ồn, đặt trong khu rào chắn của sân DC cùng bộ lọc DC. Nhiệm vụ: hạn chế di/dt khi sự cố chuyển mạch và giảm gợn dòng DC.",
        "MBA chuyển đổi gồm ba máy một pha ba cuộn dây đặt ngoài nhà van, làm mát ODAF, có bộ điều áp dưới tải để giữ điện áp không tải của bộ biến đổi khi lưới AC dao động.",
        "Trạm chuyển tiếp nối đường dây trên không 400/20 kV DC với cáp: có chống sét cho cả dây và cáp, dao tiếp đất, thiết bị đo dòng DC và RTU. Dao cách ly ở đây bắt buộc thao tác từ xa khi thí nghiệm cao áp đường dây và cáp.",
      ],
      table: {
        caption: "MBA chuyển đổi của Basslink (mỗi máy một pha, ba cuộn dây)",
        columns: ["Thông số", "George Town (Tasmania)", "Loy Yang (Victoria)"],
        rows: [
          ["Công suất H / Y / Δ", "194 / 97 / 97 MVA", "196 / 98 / 98 MVA"],
          ["Điện áp cuộn lưới", "220/√3 kV", "500/√3 kV"],
          ["Điện áp cuộn van Y / Δ", "164,6/√3 kV / 164,6 kV", "166,3/√3 kV / 166,3 kV"],
          ["Tổ đấu dây", "Yd11", "Yd1"],
          ["Điện áp ngắn mạch", "12 %", "14 %"],
        ],
      },
    },
  ]),

  basslink("2.3", "mục 1.6", [
    {
      heading: "Bộ lọc AC và DC của Basslink",
      points: [
        "George Town (220 kV) có 6 bộ lọc AC: 2 bộ điều hưởng ba tần 3/12/24, 1 bộ 5/12/24 và 2 bộ 7/12/24, mỗi bộ 43 Mvar, cùng 1 bộ đơn tần bậc 5 dung lượng 98 Mvar. Các bộ lọc vừa khử sóng hài vừa bù công suất phản kháng cho bộ biến đổi.",
        "Loy Yang (500 kV) có 5 bộ lọc 105 Mvar: 3 bộ 7/12/24 và 2 bộ 5/12/24, tổng 525 Mvar; khác George Town, trạm này không có bộ lọc điều hưởng bậc 3.",
        "Mỗi trạm có một bộ lọc DC ba tần (12/24/36 ở George Town) với tụ cao áp 1,25 µF. Bộ lọc DC giảm sóng hài trên đường dây để tránh nhiễu viễn thông, vô tuyến trong khu vực.",
        "Khi có đường dây AC chạy gần đường dây DC, phải tính toán chỉnh định lại bộ lọc DC để hai hệ thống không gây ảnh hưởng lẫn nhau.",
      ],
      table: {
        caption: "Bộ lọc AC tại hai trạm (TT: điều hưởng ba tần, ST: đơn tần)",
        columns: ["Trạm", "Loại", "Số bộ", "Dung lượng mỗi bộ"],
        rows: [
          ["George Town", "TT 3/12/24", "2", "43 Mvar"],
          ["George Town", "TT 5/12/24", "1", "43 Mvar"],
          ["George Town", "TT 7/12/24", "2", "43 Mvar"],
          ["George Town", "ST 5", "1", "98 Mvar"],
          ["Loy Yang", "TT 7/12/24", "3", "105 Mvar"],
          ["Loy Yang", "TT 5/12/24", "2", "105 Mvar"],
        ],
      },
      note: "Bảng thông số bộ lọc trong bản dịch bị lệch cột khi chuyển từ bản gốc. Số bộ ở George Town được đối chiếu với mô tả trong báo cáo chuyến công tác Australia (2025).",
    },
  ]),

  australiaTrip("4.2", "mục II, ngày 27/2–4/3/2025", [
    {
      heading: "Kinh nghiệm vận hành Directlink và tổ chức của Powerlink",
      points: [
        "Directlink gồm 3 hệ VSC độc lập, mỗi hệ 60 MW, ±80 kV, dùng IGBT thế hệ đầu của nhà thầu, nối lưới 132 kV (NSW) với 110 kV (Queensland) qua khoảng 60 km cáp, phần lớn chôn ngầm. Lý do chọn HVDC: môi trường, tác động tới cộng đồng và khả năng điều khiển của VSC.",
        "Suất sự cố cáp cao: đến nay đã có 201 sự cố, giai đoạn đầu khoảng 1 lần mỗi tháng, hiện 3–4 tháng một lần. Phần lớn xảy ra ở các đoạn cáp đi trên mặt đất, nơi nhiệt độ bề mặt cao hơn trong lòng đất khoảng 20 °C.",
        "Trạm vận hành tự động hoàn toàn nhưng vẫn có một nhân viên theo dõi thiết bị đã chạy khoảng 25 năm. Ba hệ có thể tách riêng để bảo dưỡng mà không dừng cả liên kết.",
        "Powerlink (Queensland) quản lý 15.358 km đường dây và 148 trạm 330/275/132 kV, dự kiến đưa lưới 500 kV vào giữa thập kỷ 2030. Chỉ có một đội vận hành cơ động xử lý sự cố nhờ tự động hóa và điều khiển xa; phần lớn sửa chữa, bảo dưỡng thuê nhà thầu.",
        "Giá truyền tải do cơ quan điều tiết AER quyết định theo chu kỳ 5 năm, dựa trên giá trị tài sản, dự báo nhu cầu, chi phí đầu tư, vận hành và các chỉ tiêu hiệu quả.",
      ],
    },
    {
      heading: "Marinus Link: liên kết thứ hai Victoria–Tasmania",
      points: [
        "Hai giai đoạn, mỗi giai đoạn 750 MW, ±320 kV, xây cách nhau vài năm và có thể dùng công nghệ của các hãng khác nhau. Giai đoạn 1 có vốn khoảng 3,86 tỷ AUD, dự kiến khởi công 2026 và hoàn thành 2030.",
        "Chủ đầu tư là Marinus Link Pty Ltd, do Chính phủ liên bang (49 %), bang Victoria (33,3 %) và bang Tasmania (17,7 %) góp vốn. Dự án gồm cả tuyến cáp quang viễn thông.",
        "Dùng VSC với yêu cầu bộ biến đổi tạo lưới (grid-forming) để giữ ổn định lưới Tasmania. Mỗi giai đoạn là một hệ đơn cực đối xứng. Cáp biển của hai giai đoạn đặt cách nhau trên 1 km để giảm tác động sinh thái và được chôn sâu 1–1,5 m dưới đáy biển.",
        "Các gói EPC chính: cáp biển (Prysmian, tàu rải cáp Leonardo da Vinci), trạm chuyển đổi hai đầu (Hitachi Energy), xây dựng trạm và đường dây trên bờ.",
      ],
      note: "Báo cáo ghi Directlink vận hành từ năm 1999; bảng ở trên ghi năm 2000 theo slide. Tỷ lệ vốn của bang Tasmania trong báo cáo là 17,3 %, đã sửa thành 17,7 % để tổng bằng 100 %.",
    },
  ]),

  {
    lessonId: "4.2",
    source: "North-East Agra: liên kết UHVDC nhiều đầu cực đầu tiên trên thế giới (trang giới thiệu dự án)",
    author: "Hitachi Energy, tham khảo kèm video giới thiệu trạm Agra trong bộ tài liệu khóa học",
    pages: "trang web dự án, truy cập 10/2026",
    sections: [
      {
        heading: "Case study nhiều đầu cực: North-East – Agra (Ấn Độ)",
        points: [
          "Liên kết lưỡng cực LCC ±800 kV dài 1.728 km, truyền 6.000 MW thủy điện từ vùng Đông Bắc Ấn Độ về Agra cho Power Grid Corporation of India. Hoàn thành năm 2017.",
          "Bốn đầu cực trong ba trạm: Assam, Tây Bengal và Agra. Tại Agra hai bộ biến đổi lưỡng cực đấu song song. Tổng dung lượng biến đổi 8.000 MW, trong đó 2.000 MW là dự phòng; khả năng quá tải liên tục 33 %.",
          "Sân phân phối 800 kV ở Agra lần đầu tiên được đặt trong nhà. Tuyến phải đi qua “cổ chai” ở Tây Bengal rộng 22 km kẹp giữa Nepal và Bangladesh, nên một liên kết DC nhiều đầu cực thay được nhiều tuyến AC.",
          "Liên hệ bài 1.2: đây là cấu hình nhiều trạm xuyên tâm (radial multi-terminal) với LCC. Muốn đảo chiều ở một đầu cực LCC phải đảo cực tính điện áp, nên lưới nhiều đầu cực LCC thường chỉ truyền theo một chiều định trước.",
        ],
      },
    ],
  },

  basslink("4.3", "mục 1.4", [
    {
      heading: "Thông số định mức hai chiều truyền tải",
      points: [
        "Công suất liên tục 500 MW tại đầu DC của trạm chỉnh lưu (400 kV, 1.250 A), đơn cực hồi lưu kim loại, truyền được cả hai chiều. Công suất tối thiểu 50 MW mỗi chiều.",
        "Với điện trở mạch DC danh định 11,8 Ω, điện áp đầu nghịch lưu là 400 − 1,25 × 11,8 ≈ 385,3 kV và công suất nhận được 481,6 MW. Tổn thất 18,4 MW tương đương 3,7 %.",
        "Kiểm chứng bằng công thức Cấp độ 0 với Udi0 = 222,3 kV, α = 15,7°, dx = 0,06, dr = 0,003: Vd = 2 × 222,3 × (0,9627 − 0,063) ≈ 400,0 kV; cos(α + μ) = 0,9627 − 0,12 = 0,8427 nên α + μ = 32,6° và μ ≈ 16,9°, đúng bảng thông số.",
        "Mô hình cầu của phòng lab (công thức Kimbark có xét trùng dẫn) cho Q = 234,7 Mvar ở chỉnh lưu, trùng giá trị thiết kế, và Vd ≈ 384,7 kV, Q ≈ 264 Mvar ở nghịch lưu Loy Yang (thiết kế: 385,3 kV và 265,5 Mvar).",
        "Q của mỗi trạm vào khoảng 47–55 % công suất truyền tải, đúng dải 40–60 % đã học ở bài 2.3, và đó là lý do George Town cần 313 Mvar bộ lọc AC.",
      ],
      formulas: [
        String.raw`V_d = 2\,U_{di0}\,(\cos\alpha - d_x - d_r) = 2 \times 222{,}3 \times (0{,}9627 - 0{,}063) \approx 400\ \text{kV}`,
        String.raw`\cos(\alpha+\mu) = \cos\alpha - 2d_x \;\Rightarrow\; \mu = 32{,}6^\circ - 15{,}7^\circ \approx 16{,}9^\circ`,
        String.raw`V_{d,\mathrm{nl}} = V_{d,\mathrm{cl}} - I_d R = 400 - 1{,}25 \times 11{,}8 \approx 385{,}3\ \text{kV}`,
      ],
      table: {
        caption: "Điểm làm việc định mức (CL: chỉnh lưu, NL: nghịch lưu)",
        columns: ["Thông số", "Tas→Vic: George Town (CL)", "Loy Yang (NL)", "Vic→Tas: Loy Yang (CL)", "George Town (NL)"],
        rows: [
          ["Công suất DC (MW)", "500", "481,6", "500", "481,6"],
          ["Điện áp DC (kV)", "400", "385,3", "400", "385,3"],
          ["Góc kích α / góc tắt γ", "α = 15,7°", "γ = 19,4°", "α = 15,5°", "γ = 19,6°"],
          ["Góc trùng dẫn μ", "16,9°", "17,4°", "19,0°", "15,3°"],
          ["Tổng sụt áp tương đối (pu)", "0,063", "0,067", "0,073", "0,057"],
          ["Điện áp thứ cấp MBA (kV)", "164,61", "163,05", "166,31", "161,38"],
          ["Q bộ biến đổi tiêu thụ (Mvar)", "234,7", "265,5", "246,7", "254,7"],
        ],
      },
    },
    {
      heading: "Dải góc vận hành và quá tải theo chu kỳ",
      points: [
        "Góc kích danh định 15,5–15,7°, dải vận hành 12,7–17,3°, αmin động 5°. Góc tắt danh định 19,4–19,6°, dải vận hành 18–21°, γmin 17°. OLTC đổi nấc để kéo hai góc này về dải định mức.",
        "Chiều Tasmania → Victoria có khả năng quá tải theo chu kỳ 24 giờ (khi chạy đủ hệ thống làm mát dự phòng, nhiệt độ môi trường tối đa 30 °C ở George Town và 40 °C ở Loy Yang): 604 MW trong 10 giờ, hoặc 630 MW trong hai khoảng 4 giờ cách nhau ít nhất 2 giờ, hoặc 630 MW liên tục 6 giờ.",
        "630 MW tương ứng dòng thiết kế 1.565 A ở 400 kV (tính cả 4 MW tổn thất trạm chỉnh lưu): quá tải chủ yếu là quá tải dòng, giới hạn bởi nhiệt van, MBA và cáp.",
      ],
      note: "Bản dịch ghi các giờ còn lại của chu kỳ có “công suất tối thiểu 312 MW”. Về mặt nhiệt, đây nhiều khả năng là mức công suất giới hạn để thiết bị nguội lại; nên đối chiếu bản gốc tiếng Anh trước khi dùng con số này.",
    },
    {
      heading: "Chế độ Gamma tăng cường và vận hành điện áp giảm",
      points: [
        "Gamma tăng cường (chỉ ở George Town): OLTC giữ γ trong dải 21–24° thay vì 18–21°. Người vận hành bật chế độ này khi lưới Tasmania yếu, ví dụ nhiều đường dây bị cắt hoặc nhà máy Bell Bay ngừng, chấp nhận tiêu thụ thêm Q để tăng dự trữ chống sự cố chuyển mạch.",
        "Vận hành điện áp DC giảm (0,8 pu = 320 kV, công suất 400 MW): OLTC đưa lên nấc có điện áp thứ cấp thấp nhất, phần còn lại do tăng α. Khi đó α ≈ 30°, γ ≈ 35° và mỗi trạm tiêu thụ 301–339 Mvar, nhiều hơn chế độ định mức khoảng 30 %.",
        "Van Siemens chạy được ở α lớn nhờ điện trở giảm chấn làm mát trực tiếp bằng nước. Dòng ở chế độ này vẫn giới hạn 1.250 A để không quá tải van, MBA và không phải lắp thêm thiết bị bù.",
        "Nếu điện áp AC vượt mức vận hành bình thường (George Town 1,06 pu, Loy Yang 1,1 pu) hoặc mất liên lạc giữa hai trạm, điện áp đặt phía chỉnh lưu tự nâng từ 0,8 lên 0,9 pu.",
      ],
    },
    {
      heading: "Đảo chiều công suất và chức năng ổn định",
      points: [
        "Trình tự đảo chiều theo lịch: (a) giảm về Pmin ở Udn và Idmin; (b) cưỡng bức chậm kích chỉnh lưu, khóa van khi Id = 0; (c) xả cáp có kiểm soát bằng nghịch lưu, Ud đặt giảm theo dốc từ 1 về 0 pu; (d) chờ khử ion 2 phút rồi mới mở khóa và truyền theo chiều ngược lại.",
        "Đảo cực tính chậm và có dốc để giảm ứng suất lên cách điện cáp ngâm dầu. Khuyến nghị cách nhau ít nhất 2 giờ giữa hai lần đảo chiều; đảo chiều nhanh không được phép. Tránh bước nhảy +50 → −50 MW vì tương đương thay đổi 100 MW ở lưới Tasmania.",
        "Điều khiển tần số: liên kết truyền dịch vụ điều tần giữa hai bang. Khi chênh lệch giữa tần số Tasmania và giá trị tính theo hàm mục tiêu BOF (phụ thuộc tần số Victoria) vượt ±0,01 Hz, bộ điều khiển ở trạm chỉnh lưu thay đổi công suất để kéo tần số về 50 Hz.",
        "Bộ giảm chấn cộng hưởng dưới đồng bộ (SSDC) ở Loy Yang: đo góc pha điện áp AC để phát hiện dao động xoắn trục tuabin, rồi điều chế công suất DC để dập dao động. Chỉ bật khi Loy Yang là chỉnh lưu. Run-up/run-back và giảm chấn dao động công suất có sẵn nhưng không kích hoạt.",
      ],
    },
  ]),

  australiaTrip("4.3", "mục II, ngày 03/3/2025", [
    {
      heading: "Ghi nhận khảo sát tại trạm George Town",
      points: [
        "Hai trạm vận hành tự động hoàn toàn theo chế độ Master–Slave. Victoria đặt làm Master vì nhân viên tới trạm Loy Yang ngoài giờ chỉ mất khoảng 20 phút, so với 40 phút ở Tasmania. Nhân viên có mặt trong ngày làm việc để giám sát và làm công tác kỹ thuật.",
        "Công suất tăng giảm tự động theo dốc tới giá trị đặt. Người vận hành có thể tăng α đột ngột (từ khoảng 12–17° lên 24°) khi cần, nhưng không mong muốn vì bất lợi cho thiết bị.",
        "Thực tế công suất chiều Victoria → Tasmania thường chỉ khoảng 480 MW do lưới Tasmania hạn chế khả năng hấp thụ. Chiều ngược lại có thể đạt 630 MW trong thời gian ngắn (đến 4 giờ).",
        "Từ năm 2006 chỉ có 7 trong 720 thyristor phải thay (4 ở Tasmania, 3 ở Victoria). Thyristor ít hỏng hơn IGBT vì dòng qua van có điểm về 0, ứng suất chủ yếu là điện áp.",
        "Dự phòng: 15 thyristor tại chỗ cho hai trạm, tăng từ 8 sau khi tham khảo một sự cố HVDC ở Na Uy. Mất 1 thyristor trong van vẫn vận hành bình thường; mất 2 được duy trì tối đa 24 giờ; mất 3 thì hệ thống tự cắt.",
        "Nước làm mát van phải khử ion, sạch tạp chất và giữ nhiệt độ ổn định, bình thường khoảng 42 °C; vượt 45 °C thì phải dừng. Vì sự cố HVDC phức tạp và chuỗi cung ứng linh kiện hạn chế, phải lập kế hoạch thiết bị dự phòng có sẵn tại hiện trường.",
      ],
    },
  ]),
];

/** Tất cả nguồn: PTC3 trước, sau đó tài liệu khóa đào tạo 2026 của ĐHBKHN */
export const ALL_SUPPLEMENTS: LessonSupplement[] = [...GIAOTRINH_SUPPLEMENTS, ...LESSON_SUPPLEMENTS, ...BKHN_SUPPLEMENTS];

export function getSupplements(lessonId: string): LessonSupplement[] {
  return ALL_SUPPLEMENTS.filter((s) => s.lessonId === lessonId);
}
