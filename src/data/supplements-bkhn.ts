import type { LessonSupplement, SupplementSection } from "@/data/supplements";

/**
 * Nội dung bổ sung từ tài liệu khóa đào tạo HVDC 2026 do giảng viên Đại học Bách khoa Hà Nội trình bày cho EVNNPT.
 * Diễn đạt lại theo bài học; số trang là số slide trong bản PDF gốc.
 */

const SON_SOURCE = "Bài giảng HVDC, phiên bản 3 (Hà Nội, 2026)";
const SON_AUTHOR = "TS. Nguyễn Trung Sơn, Đại học Bách khoa Hà Nội";
const PHUONG_AUTHOR = "TS. Phạm Quang Phương, Khoa Điện, Trường Điện - Điện tử, Đại học Bách khoa Hà Nội (NPT Training 2026)";

const son = (lessonId: string, pages: string, sections: SupplementSection[]): LessonSupplement => ({
  lessonId,
  source: SON_SOURCE,
  author: SON_AUTHOR,
  pages,
  sections,
});

const phuong = (lessonId: string, source: string, pages: string, sections: SupplementSection[]): LessonSupplement => ({
  lessonId,
  source,
  author: PHUONG_AUTHOR,
  pages,
  sections,
});

export const BKHN_SUPPLEMENTS: LessonSupplement[] = [
  phuong("1.1", "Tổng quan về truyền tải điện một chiều HVDC", "tr. 4–5, 25–33", [
    {
      heading: "Dự án HVDC đầu tiên: Gotland (1954)",
      points: [
        "Mục tiêu ban đầu là cấp điện cho đảo Gotland (Thụy Điển), về sau dùng để giải tỏa công suất các trang trại gió trên đảo. Hệ thống được mở rộng năm 1970 (Gotland 2) và 1983 (Gotland 3).",
        "Thông số: 20 MW, 100 kV, dài 98 km trong đó 96 km cáp biển, dùng van hồ quang thủy ngân.",
        "Dự án chứng minh HVDC truyền được công suất đáng kể đi xa với tổn thất thấp.",
      ],
      note: "Slide ghi điện áp ±100 kV và dòng “Thyristor: van thủy ngân”. Gotland 1 là hệ đơn cực 100 kV hồi lưu qua biển, dùng van hồ quang thủy ngân (thyristor chỉ xuất hiện từ cuối thập niên 1960), nên nội dung trên đã ghi lại cho đúng.",
    },
    {
      heading: "Khi nào chọn HVDC thay cho HVAC",
      points: [
        "Khoảng cách hòa vốn: 500–800 km với đường dây trên không, 50–100 km với cáp ngầm hoặc cáp biển.",
        "Về kỹ thuật, HVDC kiểm soát hoàn toàn độ lớn và chiều của dòng công suất, áp dụng được nhiều chiến lược điều khiển và không góp thêm dòng ngắn mạch cho lưới AC.",
        "Ứng dụng chính: truyền tải đi xa, cáp ngầm dưới biển, liên kết các hệ thống không đồng bộ, điều khiển dòng công suất liên kết nhiều quốc gia và giảm nghẽn mạch truyền tải.",
      ],
    },
    {
      heading: "Chuyển đường dây HVAC hiện hữu sang HVDC",
      points: [
        "Các bước nâng khả năng tải của một tuyến hiện hữu xếp theo mức can thiệp tăng dần: thay đổi vận hành, gia cố, thay dây, nâng điện áp và cuối cùng là chuyển sang HVDC.",
        "Điều kiện cơ bản để cân nhắc chuyển đổi: cần tăng công suất truyền tải từ 50% trở lên, đường dây dài (từ khoảng 80 km), có ít trạm phụ tải ở giữa, và việc tăng điện áp hoặc dòng AC làm các ảnh hưởng điện (tiếng ồn, từ trường, cảm ứng) vượt giới hạn cho phép.",
        "Phải cân đối giữa lợi ích tăng công suất với chi phí bảo dưỡng và rủi ro kỹ thuật khi cải tạo.",
        "Các lựa chọn cấu hình khi chuyển một mạch AC 3 dây: đơn cực (cả 3 dây cùng truyền công suất, cần đường về qua đất), lưỡng cực (2 dây truyền, 1 dây làm đường về), ba cực (cần thêm một bộ biến đổi hai chiều), hoặc lai (giữ một mạch AC, chuyển một mạch sang DC).",
      ],
      note: "Slide ghi điều kiện đường dây dài theo đơn vị dặm (50 miles), tương đương khoảng 80 km.",
    },
  ]),

  son("1.2", "tr. 5–21, 126", [
    {
      heading: "Đơn cực đường về đất và đường về kim loại",
      points: [
        "Đơn cực đường về đất: một hoặc nhiều bộ biến đổi 6 xung (thực tế thường ghép thành 12 xung) ở mỗi đầu, một dây dẫn và đường về qua đất hoặc biển. Mỗi đầu cần một đường dây điện cực và một điện cực đất hoặc biển để vận hành liên tục.",
        "Cấu hình này tiết kiệm chi phí cho tuyến cáp và thường là giai đoạn đầu của một hệ lưỡng cực.",
        "Đơn cực đường về kim loại gồm một dây cao áp và một dây trung áp. Cấu hình này được chọn để tránh dòng qua đất, hoặc khi xây điện cực không kinh tế vì khoảng cách ngắn hay điện trở suất đất cao.",
      ],
    },
    {
      heading: "Lưỡng cực, giáp lưng và đa điểm",
      points: [
        "Lưỡng cực gồm hai cực, mỗi cực có một hoặc nhiều bộ biến đổi 12 xung. Một dây dương và một dây âm so với đất; muốn đảo chiều công suất (LCC) thì hai dây đảo cực tính.",
        "Lưỡng cực là tổ hợp của hai hệ đơn cực đường về đất. Khi hai cực cùng vận hành, dòng không cân bằng qua đất được giữ ở mức rất thấp.",
        "Lưỡng cực đường về kim loại cần thêm dây thứ ba: dây này mang dòng không cân bằng và làm đường về khi một cực ngừng.",
        "Giáp lưng (back-to-back) dùng để nối hai hệ thống AC không đồng bộ hoặc khác tần số, và điều khiển linh hoạt dòng công suất giữa chúng.",
        "Đa điểm (MTDC) có thể đấu các trạm nối tiếp hoặc song song.",
      ],
      table: {
        caption: "So sánh định tính các cấu hình phổ biến (tr. 21)",
        columns: ["Cấu hình", "Chi phí", "Dự phòng đường dây", "Dự phòng bộ biến đổi", "Dòng qua đất", "Số dây", "Khả năng truyền tải"],
        rows: [
          ["Lưỡng cực", "Cao", "Có (trung bình–cao)", "Có (trung bình)", "Thấp", "Nhiều", "Cao"],
          ["Lưỡng cực cứng (rigid)", "Trung bình", "Không (thấp)", "Có (trung bình)", "Thấp", "Trung bình", "Cao"],
          ["Đơn cực bất đối xứng, đường về kim loại", "Trung bình", "Không (thấp)", "Không (thấp)", "Thấp", "Trung bình", "Thấp"],
          ["Đơn cực bất đối xứng, đường về đất", "Thấp", "Không (thấp)", "Không (thấp)", "Cao", "Ít", "Thấp"],
          ["Đơn cực đối xứng", "Trung bình", "Không (thấp)", "Không (thấp)", "Thấp", "Trung bình", "Thấp"],
        ],
      },
    },
    {
      heading: "Ba loại cáp HVDC",
      points: [
        "Cáp MI (giấy tẩm hợp chất độ nhớt cao): dùng cho cáp biển rất dài, điện áp đến khoảng 525 kV, chịu được đảo cực nên dùng được với LCC. Không cần hệ thống cấp dầu nên chiều dài không bị giới hạn, nhưng nặng, nhiệt độ làm việc thấp (khoảng 55 °C) và đắt.",
        "Cáp SCFF (giấy tẩm dầu độ nhớt thấp, có áp lực): cách điện và tản nhiệt tốt, dùng cho tuyến ngắn điện áp rất cao, nhưng cần trạm cấp dầu và có nguy cơ rò dầu. Ngày nay ít dùng.",
        "Cáp XLPE ép đùn: nhẹ, rẻ, dễ thi công và nối, nay đạt 525–640 kV. Do tích tụ điện tích không gian khi đảo cực nên trước đây chủ yếu dùng với VSC.",
        "Kết luận chọn cáp: VSC dùng cáp XLPE; LCC với tuyến cáp biển dài dùng cáp MI.",
      ],
    },
    {
      heading: "Chọn cấp điện áp DC theo công suất và cự ly",
      points: [
        "Trình tự chọn công suất và điện áp theo IEC 63127 và CIGRE 684: nhu cầu truyền tải, kiểm tra SCR lưới AC, chọn cấu hình, tính tổn thất, so sánh kinh tế - kỹ thuật.",
        "Cấp ±800 kV phủ toàn bộ dải công suất trên 4.000 MW với cự ly từ 500 km; ±1.100 kV chỉ xuất hiện ở cự ly từ 2.000 km.",
        "Công cụ “Thiết kế sơ bộ tuyến HVDC” trong Phòng lab dùng bảng này để gợi ý cấp điện áp.",
      ],
      table: {
        caption: "Cấp điện áp DC gợi ý (kV) theo công suất và cự ly",
        columns: ["Công suất", "≤ 200 km", "≤ 500 km", "≤ 1.000 km", "≤ 1.500 km", "< 2.000 km", "≥ 2.000 km"],
        rows: [
          ["≤ 500 MW", "250", "400", "–", "–", "–", "–"],
          ["≤ 1.000 MW", "350", "400", "500", "–", "–", "–"],
          ["≤ 3.000 MW", "–", "500", "500–600", "600–800", "600–800", "800"],
          ["≤ 4.000 MW", "–", "600", "600", "800", "800", "800"],
          ["> 4.000 MW", "–", "800", "800", "800", "800", "800–1.100"],
        ],
      },
    },
  ]),

  son("1.3", "tr. 23–71, 83–91", [
    {
      heading: "Sáu khối chính của trạm",
      points: [
        "Trạm LDT gồm: sân phân phối AC, bộ lọc AC và tụ bù, máy biến áp chuyển đổi, van thyristor, cuộn kháng làm phẳng và bộ lọc DC, sân phân phối DC; cộng thêm hệ thống điều khiển, bảo vệ và giám sát. Trạm giáp lưng không có sân DC.",
        "Máy biến áp chuyển đổi cho phép cầu chỉnh lưu hoạt động 12 xung (một cuộn nối sao, một cuộn nối tam giác) và cho phép nối tiếp các cầu 6 xung.",
        "LCC có cuộn kháng lớn phía DC nên dòng gần như không đổi (bộ biến đổi nguồn dòng). VSC có tụ lớn phía DC nên điện áp gần như không đổi (bộ biến đổi nguồn áp).",
      ],
    },
    {
      heading: "Van thyristor và sảnh van",
      points: [
        "Mỗi thyristor chỉ chịu được một phần điện áp, nên phải đấu nối tiếp trong mô-đun van. Số tầng thyristor được xác định theo điện áp van và điện áp khóa của mỗi thyristor (khoảng 8 kV).",
        "Thyristor kích trực tiếp bằng ánh sáng (LTT) dùng ít hơn khoảng 80% linh kiện điện tử. Tấm bán dẫn 4 inch chịu dòng đến 2.200 A, loại 5 inch đến 3.700 A.",
        "Các mô-đun được treo trong giá cách điện bằng không khí trong sảnh van. Ví dụ một cực 500 kV: sáu tháp treo (ba cặp) tạo thành một cầu 12 xung, mỗi cặp là một cụm 4 van.",
        "Với cùng công suất 400 MW, trạm VSC (HVDC PLUS) chiếm ít diện tích hơn đáng kể so với trạm thyristor truyền thống.",
      ],
    },
    {
      heading: "Máy biến áp chuyển đổi và cuộn kháng làm phẳng",
      points: [
        "Máy biến áp chuyển đổi phải qua các thử nghiệm đặc biệt: chịu điện áp DC, đảo cực và thử nhiệt có xét dòng hài.",
        "Cuộn kháng làm phẳng giảm gợn sóng dòng DC, tránh dòng gián đoạn khi tải nhẹ, hạn chế tốc độ tăng dòng khi sự cố đường dây DC và hạn chế cộng hưởng ở tần số cơ bản và hài bậc 2.",
        "Ví dụ thông số: loại khô 150 mH, 500 kV, 1.800 A; loại ngâm dầu 270 mH, 500 kV, 3.000 A; loại 800 kV, 3.125 A, 75 mH nặng 28 tấn, đường kính 4,6 m, cao 14,3 m.",
      ],
      table: {
        caption: "Khác biệt giữa máy biến áp HVDC và máy biến áp AC (tr. 57)",
        columns: ["Tiêu chí", "MBA chuyển đổi HVDC", "MBA AC"],
        rows: [
          ["Cách điện cuộn phía van", "Chịu cả điện áp AC và DC", "Không cần cách điện DC"],
          ["Dòng hài trong cuộn dây", "Lớn", "Hầu như không có"],
          ["Dải điều chỉnh nấc", "Rộng", "Hẹp"],
        ],
      },
    },
    {
      heading: "Điện cực nối đất",
      points: [
        "Đường hồi tiếp qua đất có thể là điện cực vòng, bãi chôn nông diện rộng, giếng khoan sâu (đường kính khoảng 1 m, sâu hàng trăm mét) hoặc điện cực biển, điện cực bờ.",
        "Hiệu ứng cục bộ (trong phạm vi dưới 1 km): an toàn cho người và động vật, đất bị nóng và khô.",
        "Hiệu ứng từ xa (có thể đến 50 km hoặc hơn): dòng DC đi vào trung tính máy biến áp, ăn mòn kết cấu kim loại chôn ngầm.",
        "Yêu cầu thiết kế trong ví dụ của tài liệu: điện trở điện cực ≤ 0,3 Ω, điện áp tiếp xúc ≤ 40 V, điện áp bước ≤ 6 V, mật độ dòng ≤ 0,5 A/m², nhiệt độ bề mặt điện cực con ≤ 100 °C. Điện thế đất và điện trường phải giảm nhanh, chỉ còn vài vôn trong phạm vi 15–20 km.",
      ],
    },
    {
      heading: "Đường dây trên không theo cấp điện áp",
      points: [
        "Với khoảng 2.000 MW, đường dây ±500 kV DC cần hành lang khoảng 60 m, trong khi phương án 2 mạch 500 kV AC cần khoảng 110 m.",
      ],
      table: {
        caption: "Thông số điển hình đường dây DC trên không (tr. 71)",
        columns: ["Điện áp", "Công suất phù hợp", "Cự ly kinh tế", "Phân pha mỗi cực", "Hành lang", "Khoảng cách đến đất tối thiểu"],
        rows: [
          ["±300 kV", "600–1.000 MW", "300–750 km", "2, 3, 4", "40 m", "8,5 m"],
          ["±400 kV", "1.000–2.000 MW", "500–1.000 km", "2, 3, 4, 6", "45–50 m", "10–11 m"],
          ["±500 kV", "1.500–3.000 MW", "700–1.500 km", "4, 6, 8", "55–70 m", "11–13 m"],
          ["±800 kV", "3.000–7.500 MW", "1.500–5.000 km", "6, 8", "85–90 m", "16 m"],
        ],
      },
    },
  ]),

  son("2.1", "tr. 101–105", [
    {
      heading: "Đặc điểm của LCC-HVDC",
      points: [
        "Bộ biến đổi gồm một hoặc nhiều cầu 6 xung; mỗi van gồm hàng chục đến hàng trăm thyristor nối tiếp. Hệ thống lớn ghép thành 12 xung; ở UHVDC mỗi cực gồm hai nhóm 12 xung nối tiếp.",
        "Công suất tác dụng được điều khiển bằng góc kích α ở trạm chỉnh lưu và góc tắt γ ở trạm nghịch lưu.",
        "Điện cảm làm phẳng phía DC của hệ thống lớn thường từ 0,1 H đến 0,5 H.",
        "Bộ biến đổi tiêu thụ công suất phản kháng khoảng 50–60% công suất định mức, do bộ lọc và tụ bù phía AC cung cấp.",
      ],
    },
    {
      heading: "Ưu điểm và hạn chế",
      points: [
        "Điện áp và công suất rất lớn: hiện đến ±1.100 kV, 12.000 MW (Changji–Guquan, 2019).",
        "Tổn thất thấp, khoảng 0,7% công suất định mức mỗi trạm, vì thyristor có tổn thất dẫn thấp và tổn thất đóng cắt không đáng kể. Dòng sự cố DC tăng chậm nhờ điện cảm lớn.",
        "Dòng chỉ chạy một chiều, muốn đảo chiều công suất phải đảo cực tính điện áp, nên khó xây hệ đa điểm và lưới DC.",
        "Cần lưới AC đủ mạnh (thường SCR > 2–3); lưới rất yếu phải bổ sung máy bù đồng bộ. Có nguy cơ sự cố chuyển mạch ở trạm nghịch lưu khi có sự cố phía AC.",
        "Không điều khiển độc lập được P và Q; thyristor không tự ngắt nên bộ biến đổi không tự cắt được dòng sự cố.",
        "Cáp DC phải chịu được đảo cực: trước đây chỉ dùng cáp MI, nay đã có cáp XLPE 525 kV đạt chuẩn cho LCC.",
      ],
    },
  ]),

  son("2.2", "tr. 106–121", [
    {
      heading: "Thiết bị đặc thù của trạm VSC",
      points: [
        "Máy biến áp chuyển đổi chỉnh điện áp phía bộ biến đổi bằng bộ đổi nấc, tạo điện kháng ghép nối với lưới, cách ly về điện và chặn dòng thứ tự không.",
        "Bộ lọc AC có định mức thấp hơn LCC và không bắt buộc phải cấp công suất phản kháng; nhiệm vụ chính là chặn hài tần số cao.",
        "Tụ DC là phần tử tích trữ năng lượng, giữ điện áp DC cứng giữa các lần chuyển mạch. Có thể đặt thêm bộ lọc DC song song thay vì tăng kích thước tụ.",
        "Cuộn kháng DC của VSC điểm–điểm thường chỉ vài mH, nhỏ hơn nhiều so với LCC; lưới DC dùng MMC và máy cắt DC cần 100–300 mH.",
      ],
    },
    {
      heading: "Ưu điểm và hạn chế của VSC-HVDC",
      points: [
        "Điều khiển độc lập P và Q nên làm việc được với lưới yếu (SCR < 2), kể cả lưới không có nguồn. Khi không truyền tải, hai trạm có thể vận hành như STATCOM.",
        "Điện áp DC giữ nguyên cực tính, đảo chiều công suất bằng cách đổi chiều dòng, nên phù hợp với hệ đa điểm và lưới DC. Có khả năng khởi động đen.",
        "MMC cầu đủ (full-bridge) tự chặn được dòng sự cố DC. VSC 2 mức và MMC nửa cầu (phổ biến nhất) vẫn để dòng sự cố đi qua diode song song ngược, nên phải cắt bằng máy cắt AC hoặc DC.",
        "Tổn thất cao hơn LCC: VSC 2 mức thế hệ đầu khoảng 1,6%/trạm, MMC hiện nay khoảng 0,8–1%/trạm.",
        "Công suất định mức thấp hơn LCC (khoảng 2 GW/hệ thống ở ±525 kV) và khả năng chịu quá dòng của IGBT kém hơn thyristor.",
        "Theo slide của TS. Phạm Quang Phương, vốn đầu tư VSC cao hơn LCC khoảng 10–40%, tùy địa điểm, thời điểm và yêu cầu kỹ thuật.",
      ],
    },
    {
      heading: "HVDC Hybrid LCC–VSC",
      points: [
        "Lai ở cấp hệ thống: trạm chỉnh lưu dùng LCC (công suất lớn, tổn thất thấp), trạm nghịch lưu dùng VSC-MMC (điều khiển P, Q độc lập, chịu được lưới yếu, có thể khởi động đen).",
        "Lai ở cấp bộ biến đổi: MMC nửa cầu (ít linh kiện, tổn thất thấp), MMC cầu đủ (chặn được dòng sự cố DC), MMC lai nửa cầu/cầu đủ, và HML-VSC.",
        "Dự án tham chiếu Wudongde (Kunbei–Liubei–Longmen): ±800 kV, 8.000 MW, 1.452 km, một trạm LCC 8.000 MW và hai trạm VSC 3.000 MW và 5.000 MW, vận hành toàn bộ từ 12/2020. Đây là dự án HVDC đa điểm hybrid đầu tiên trên thế giới.",
        "Hạn chế: chi phí ở mức trung bình giữa LCC và VSC, triển khai phức tạp nhất vì phối hợp hai công nghệ, phía LCC vẫn cần SCR ≥ 2,5–3,0 và bù 50–60% công suất phản kháng.",
      ],
      table: {
        caption: "So sánh LCC, VSC và Hybrid (tr. 115, 120)",
        columns: ["Tiêu chí", "LCC", "VSC", "Hybrid"],
        rows: [
          ["Linh kiện", "Thyristor", "IGBT", "Thyristor + IGBT"],
          ["Công suất", "2–12 GW", "Thương mại đến 5 GW", "Đến 8 GW"],
          ["Điện áp DC điển hình", "±500, ±800, ±1.100 kV", "±320, ±400, ±525 kV", "±800 kV"],
          ["Yêu cầu lưới AC", "Lưới mạnh", "Chạy tốt với lưới yếu", "Đặt VSC ở đầu lưới yếu"],
          ["Công suất phản kháng", "Tiêu thụ 50–60% P", "Điều khiển độc lập P, Q", "Tối ưu trao đổi Q"],
          ["Khởi động đen", "Không", "Có", "Có thể (qua phía VSC)"],
          ["Độ trưởng thành", "Cao", "Trung bình", "Trung bình"],
          ["Chi phí đầu tư", "Thấp", "Cao", "Trung bình"],
          ["Mở rộng lưới DC", "Thấp", "Cao", "Trung bình"],
        ],
      },
    },
  ]),

  phuong("2.2", "Tổng quan về FACTS", "tr. 4–16", [
    {
      heading: "FACTS và liên hệ với VSC",
      points: [
        "Theo IEEE (từ 1988), FACTS là hệ thống truyền tải xoay chiều dùng thiết bị điện tử công suất để điều khiển dòng công suất và các đại lượng khác của lưới. Ba thông số điều khiển chính là điện áp, góc pha và tổng trở.",
        "Các giới hạn truyền tải mà FACTS giúp nới rộng: giới hạn tải xác lập, ổn định điện áp tĩnh và động, ổn định quá độ, giới hạn nhiệt, giới hạn dòng ngắn mạch, giới hạn cản dao động công suất và dòng vòng không mong muốn.",
        "SVC gồm các nhánh TCR (cuộn kháng điều khiển bằng thyristor), TSC (tụ đóng cắt bằng thyristor) và FC (tụ cố định).",
        "STATCOM dùng bộ biến đổi nguồn áp như trạm VSC: đáp ứng nhanh hơn SVC, giữ được công suất phản kháng khi điện áp thấp, gọn hơn, ít sóng hài, nhưng chi phí đầu tư cao hơn. Đây là lý do một trạm VSC-HVDC có thể chạy ở chế độ STATCOM.",
      ],
    },
  ]),

  son("2.3", "tr. 63–68", [
    {
      heading: "Sóng hài của bộ biến đổi 12 xung",
      points: [
        "Phía AC sinh hài dòng điện bậc 12n ± 1, chủ yếu là bậc 11, 13, 23, 25, 35, 37; ngoài ra có thể xuất hiện hài bậc 3.",
        "Phía DC sinh hài điện áp bậc 12n, chủ yếu là bậc 12, 24, 36.",
        "Tác hại: quá nhiệt và tổn thất phụ trong máy phát, động cơ; mất ổn định điều khiển bộ biến đổi; nhiễu viễn thông; quá điện áp do cộng hưởng.",
        "Bộ lọc AC vừa giảm hài đưa vào lưới vừa phát công suất phản kháng; ở tần số cơ bản, tụ điện của bộ lọc là thành phần chính tạo ra công suất phản kháng. Các nhóm lọc được đóng cắt theo mức công suất truyền tải.",
        "Bộ lọc DC đặt ở sân DC để làm phẳng thêm dòng trên đường dây trên không, tránh nhiễu đường dây điện thoại.",
      ],
    },
  ]),

  son("3.2", "tr. 134–142", [
    {
      heading: "Phối hợp cách điện trạm chuyển đổi",
      points: [
        "IEC 60071-11:2022 đưa ra nguyên tắc cho hệ thống HVDC (cả LCC và VSC); IEC 60071-12:2022 hướng dẫn áp dụng cho trạm LCC. Hai tiêu chuẩn này thay thế IEC 60071-5:2014, nên hồ sơ dự án mới cần viện dẫn bản 2022.",
        "Quy trình gồm bốn bước: phân tích ứng suất điện áp (điện áp làm việc DC và gợn hài, quá điện áp tạm thời AC khi sa thải tải, xung đóng cắt, xung sét từ đường dây DC); chọn chống sét van theo vị trí và điện áp làm việc đỉnh liên tục (CCOV); định mức chịu xung đóng cắt (SIL) và xung sét (BIL) có hệ số an toàn; hiệu chỉnh theo độ cao và kiểm tra khoảng cách không khí, đường rò.",
        "Chống sét van đặt song song với cuộn kháng làm phẳng ở cực 800 kV bảo vệ cuộn kháng trước sóng sét từ đường dây nhưng không được tác động khi có lỗi chuyển mạch.",
        "Hiệu chỉnh theo độ cao (IEC 60071-2) chỉ áp dụng cho khoảng cách không khí trên 1.000 m; cách điện trong không phụ thuộc độ cao.",
        "Mức chịu xung đóng cắt của khe hở thanh - mặt phẳng: U50 = 1080·ln(0,46·d + 1) kV, với d tính bằng mét.",
        "Đường rò riêng của cách điện ngoài sân DC khoảng 23–54 mm/kV. Ví dụ sứ đỡ cực 800 kV với 54 mm/kV cần 43.200 mm đường rò, tức sứ cao khoảng 13,5 m; vì vậy cấp ±800 kV thường dùng sứ vỏ silicone, lớp phủ RTV hoặc sân DC trong nhà.",
      ],
    },
  ]),

  son("4.1", "tr. 92–99", [
    {
      heading: "Các khóa DC tốc độ cao dùng khi chuyển cấu hình",
      points: [
        "NBGS (khóa nối đất thanh cái trung tính): bình thường mở; khi đóng nối điểm trung tính của bộ biến đổi với lưới nối đất của trạm. Chỉ được vận hành với khóa đóng khi hai cực cân bằng, và khóa phải mở được để đẩy dòng không cân bằng nhỏ trở lại mạch DC.",
        "NBS (khóa thanh cái trung tính): đặt nối tiếp ở trung tính mỗi cực. Khi một cực chạm đất và bị khóa, cực còn lại vẫn đẩy dòng vào điểm sự cố qua trung tính chung; NBS chuyển dòng này ra khỏi cực bị khóa và xuống đất.",
        "GRTS (khóa chuyển đường về đất): nối tiếp với một dao cách ly cao áp giữa dây cao áp và trung tính. Dao cách ly phải đóng trước rồi GRTS mới đóng, đặt dây cao áp song song với đường về đất; GRTS cũng chuyển dòng tải từ dây cao áp sang đường về đất.",
        "MRTB (máy cắt chuyển đường về kim loại): dùng cùng GRTS để chuyển dòng giữa đường về đất và đường về kim loại. Khi mở, MRTB ép dòng từ đường về đất (tổng trở thấp) sang đường về kim loại có tổng trở cao hơn nhiều.",
        "Nguyên lý cắt dòng DC của MRTB: khi tiếp điểm mở, hồ quang kích dao động trong nhánh LC song song; vì hồ quang có đặc tính V-I âm, dao động tăng dần đến khi biên độ bằng dòng cần cắt, tạo điểm dòng bằng 0 để hồ quang tắt.",
        "Đường về đất chỉ dùng khi có sự cố vĩnh cửu trên dây của một cực hoặc khi bảo dưỡng lớn đường dây; lưỡng cực và đơn cực đường về kim loại là chế độ vận hành bình thường.",
      ],
    },
  ]),

  son("4.2", "tr. 78–81, 117–122", [
    {
      heading: "Mô hình chuẩn CIGRE và độ mạnh lưới tại Việt Nam",
      points: [
        "Mô hình chuẩn CIGRE dùng trong nghiên cứu mô phỏng: liên kết đơn cực 500 kV, 1.000 MW, bộ biến đổi 12 xung ở hai đầu, lưới AC có tỷ số ngắn mạch 2,5. Mô hình có sẵn trong PSS/E, ATP-EMTP, EMTP-RV và PSCAD.",
        "SCR thấp làm quá điện áp AC tạm thời lớn khi sa thải tải, là đầu vào trực tiếp cho phối hợp cách điện. Ví dụ Vân Nam – Quảng Đông: trạm Chuxiong khi tách đảo cùng hai nhà máy thủy điện có SCR có thể dưới 1,7.",
        "Ví dụ tính toán SCR năm 2035 cho ba khu vực của Việt Nam (IE), giả thiết phụ tải cực tiểu và các nhà máy nhiệt điện lân cận ngừng bảo dưỡng: kết quả SCR và ESCR hầu hết lớn hơn 3, tức đáp ứng yêu cầu của LCC.",
      ],
      table: {
        caption: "SCR dự kiến năm 2035 tại các điểm đấu nối (tr. 122)",
        columns: ["Khu vực", "SCL (MVA)", "SCR", "ESCR"],
        rows: [
          ["Quảng Ngãi", "26.300", "3,29", "3,10"],
          ["Quảng Trị", "25.800", "3,22", "2,98"],
          ["Hà Nội", "50.900", "6,36", "5,93"],
        ],
      },
    },
  ]),

  phuong("4.2", "Tính toán trào lưu công suất HVDC sử dụng PSS/E", "tr. 3–13", [
    {
      heading: "Mô hình HVDC hai đầu trong PSS/E",
      points: [
        "PSS/E (Siemens PTI) tính trào lưu công suất, ngắn mạch, ổn định quá độ, ổn định điện áp và dao động nhỏ, phân tích sự cố và khả năng tải, có mô hình FACTS và HVDC cùng công cụ lập trình tự động hóa.",
        "Ví dụ thực hành dùng lưới mẫu “savnw” và các liên kết HVDC thực tế như TNB–EGAT (Malaysia – Thái Lan) và Ấn Độ – Bangladesh.",
        "Dữ liệu đường dây DC: tên, chế độ điều khiển (khóa, theo công suất, theo dòng), giá trị đặt (MW hoặc A), điện trở đường dây Rdc, điện áp DC đặt Vschedule, điện trở bù Rcmp (thường 0), biên dòng Delti (thường 0), điện áp DC nhỏ nhất Dcvmin, số vòng lặp và hệ số tăng tốc của thuật toán.",
        "Dữ liệu trạm chỉnh lưu: nút đấu nối, điện áp sơ cấp định mức phía bộ biến đổi, điện trở và điện kháng chuyển mạch của máy biến áp mỗi cầu, tỷ số biến, nấc đặt cùng giới hạn nấc lớn nhất, nhỏ nhất và bước nấc.",
      ],
    },
  ]),
];
