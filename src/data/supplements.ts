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
];

/** Tất cả nguồn: PTC3 trước, sau đó tài liệu khóa đào tạo 2026 của ĐHBKHN */
export const ALL_SUPPLEMENTS: LessonSupplement[] = [...GIAOTRINH_SUPPLEMENTS, ...LESSON_SUPPLEMENTS, ...BKHN_SUPPLEMENTS];

export function getSupplements(lessonId: string): LessonSupplement[] {
  return ALL_SUPPLEMENTS.filter((s) => s.lessonId === lessonId);
}
