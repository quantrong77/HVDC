import type { LessonSupplement, SupplementSection } from "@/data/supplements";

/**
 * Nội dung bổ sung từ tài liệu khóa đào tạo HVDC 2026 do giảng viên Đại học Bách khoa Hà Nội trình bày cho EVNNPT.
 * Diễn đạt lại theo bài học; số trang là số slide trong bản PDF gốc.
 */

const SON_SOURCE = "Bài giảng HVDC, phiên bản 3 (Hà Nội, 2026)";
const SON_AUTHOR = "TS. Nguyễn Trung Sơn, Đại học Bách khoa Hà Nội";
const PHUONG_AUTHOR = "TS. Phạm Quang Phương, Khoa Điện, Trường Điện - Điện tử, Đại học Bách khoa Hà Nội (NPT Training 2026)";
const SIM_SOURCE = "Các bài toán tính toán và mô phỏng HVDC (NPT Training 2026)";
const PSSE_SOURCE = "Tính toán HVDC bằng PSS/E 36.6: mô hình, thông số và case thực hành 7 nút (NPT Training 2026)";

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

const TUNG_SOURCE = "Hệ thống truyền tải điện một chiều HVDC: Điều khiển và bảo vệ (12/8/2025)";
const TUNG_AUTHOR = "TS. Nguyễn Xuân Tùng, Khoa Điện, Trường Điện - Điện tử, Đại học Bách khoa Hà Nội";
const TRUNG_SOURCE = "Điện tử công suất trong hệ thống truyền tải điện một chiều HVDC (10/8/2025)";
const TRUNG_AUTHOR = "PGS. TS. Nguyễn Kiên Trung, Khoa Tự động hóa, Trường Điện - Điện tử, Đại học Bách khoa Hà Nội";

const tung = (lessonId: string, pages: string, sections: SupplementSection[]): LessonSupplement => ({
  lessonId,
  source: TUNG_SOURCE,
  author: TUNG_AUTHOR,
  pages,
  sections,
});

const trung = (lessonId: string, pages: string, sections: SupplementSection[]): LessonSupplement => ({
  lessonId,
  source: TRUNG_SOURCE,
  author: TRUNG_AUTHOR,
  pages,
  sections,
});

// Slide của TS. Nguyễn Xuân Tùng dùng "mất đồng bộ" cho commutation failure; app dùng thuật ngữ "sự cố chuyển mạch"
const CF_NOTE =
  "Slide gốc gọi commutation failure là “mất đồng bộ”. Nội dung trên dùng thuật ngữ “sự cố chuyển mạch” cho thống nhất với các bài khác, vì hiện tượng này là van không kịp khóa khi chuyển mạch, không liên quan đến đồng bộ máy phát.";

export const BKHN_SUPPLEMENTS: LessonSupplement[] = [
  trung("2.1", "tr. 20–27, 33–40", [
    {
      heading: "Thyristor: đặc tính và thông số chính",
      points: [
        "Thyristor có cấu trúc 4 lớp p-n-p-n với 3 tiếp giáp, ba cực anode, cathode và cực điều khiển G. Van khóa được cả điện áp ngược lẫn điện áp thuận, và chỉ dẫn dòng theo một chiều từ anode sang cathode.",
        "Khi có xung điều khiển dương ở cực G, thyristor chuyển sang dẫn ở điện áp thuận thấp hơn nhiều so với điện áp tự mở. Van chỉ duy trì dẫn khi dòng lớn hơn dòng duy trì Ih.",
        "Dòng trung bình cho phép phụ thuộc cách làm mát: làm mát tự nhiên chỉ dùng được khoảng 1/3, quạt gió khoảng 2/3, nước cưỡng bức đến 100% dòng định mức. Vì vậy van HVDC dùng làm mát bằng nước.",
        "Thời gian phục hồi tính khóa trr là thời gian tối thiểu phải đặt điện áp ngược sau khi dòng về 0, trước khi điện áp thuận xuất hiện lại mà van vẫn khóa. Trong nghịch lưu phải bảo đảm thời gian khóa của van khoảng 1,5–2 lần trr; đây chính là cơ sở của yêu cầu góc tắt γ tối thiểu.",
        "Thyristor tần số thấp có trr trên 50 μs, dI/dt và dU/dt cho phép khoảng 50–100 A/μs và V/μs. dU/dt quá lớn có thể tự kích mở van như một dòng điều khiển.",
        "Mạch khuếch đại xung dùng biến áp xung để cách ly mạch lực với mạch điều khiển; độ rộng xung phải đủ để dòng van vượt dòng duy trì Ih.",
      ],
    },
    {
      heading: "Chỉnh lưu cầu 3 pha và cầu 12 xung",
      points: [
        "Dòng phía AC của cầu chỉnh lưu chứa sóng hài và chậm pha so với điện áp; góc lệch phụ thuộc góc điều khiển α và góc trùng dẫn μ. Ví dụ trong tài liệu: với α = 30°, độ méo dòng THDi = 21,9% và hệ số công suất 0,73.",
        "Dòng và điện áp ra đập mạch lớn nên cần điện cảm lớn phía DC để san phẳng dòng.",
        "Hai cầu 6 xung nối tiếp, cấp từ hai cuộn dây lệch nhau 30°, tạo thành cầu 12 xung; mỗi cực của hệ lưỡng cực dùng một hoặc nhiều cầu 12 xung.",
      ],
    },
  ]),

  trung("2.2", "tr. 28–32, 41–54", [
    {
      heading: "IGBT và mạch điều khiển",
      points: [
        "IGBT kết hợp ưu điểm của BJT (đóng cắt dòng lớn, chịu điện áp cao) và MOSFET (điều khiển bằng điện áp, công suất điều khiển nhỏ, tần số đóng cắt cao).",
        "Khi khóa, IGBT có “đuôi dòng điện” làm kéo dài thời gian khóa và tăng tổn hao đóng cắt. Các tụ ký sinh Cgc, Cge ảnh hưởng mạnh nhất tới đặc tính đóng cắt.",
        "Mạch driver phát hiện quá tải qua điện áp UCE (chân DESAT, khoảng 5–8 V). Nếu khóa van ngay, di/dt lớn sẽ gây quá áp trên điện cảm mạch; giải pháp là tăng điện trở cực G lên khoảng 10 lần để van khóa từ từ qua vùng tuyến tính.",
        "Trong van HVDC, nhiều IGBT được ghép nối tiếp để chịu điện áp cao.",
      ],
    },
    {
      heading: "Nghịch lưu nguồn áp, điều chế và điều khiển",
      points: [
        "Nghịch lưu 3 pha gồm ba nhánh nửa cầu; điện áp ra được tạo bằng điều chế độ rộng xung sin (SPWM) hoặc điều chế vector không gian (SVM).",
        "Cấu trúc điều khiển chỉnh lưu tích cực: PLL bám góc pha lưới, chuyển dòng sang hệ tọa độ dq, vòng ngoài điều khiển điện áp DC, vòng trong điều khiển dòng id, iq; thường có bộ lọc LCL phía lưới.",
        "Kết quả: dòng phía AC gần hình sin với THD thấp, góc pha giữa dòng và áp điều khiển được, điện áp DC bằng phẳng.",
        "Các cấu trúc đa mức giúp giảm bộ lọc AC và làm việc ở điện áp cao: bộ biến đổi 3 mức kẹp điểm trung tính bằng diode (NPC, Nabae, Takahashi và Akagi, 1981), bộ biến đổi tụ bay (FCC, Meynard và Foch, 1992), và bộ biến đổi đa mức mô-đun MMC dùng trong VSC-HVDC hiện nay.",
      ],
    },
    {
      heading: "So sánh LCC-HVDC và VSC-HVDC",
      points: [
        "Tài liệu dẫn so sánh mặt bằng trạm của Hitachi–ABB cho một liên kết 500 MW, 400 kV (Sellick và Åkerberg, ACDC 2012) và tổng quan của Oni và cộng sự (IEEE EEEIC 2016).",
      ],
      table: {
        caption: "Tóm tắt so sánh (tr. 54)",
        columns: ["Tiêu chí", "LCC-HVDC", "VSC-HVDC"],
        rows: [
          ["Phần tử lưu trữ năng lượng", "Cuộn cảm", "Tụ điện"],
          ["Đóng/ngắt van", "Mở bằng xung, tắt nhờ lưới AC", "Đóng ngắt chủ động"],
          ["Đảo chiều công suất", "Đảo cực tính điện áp DC", "Đổi chiều dòng điện DC"],
          ["Khả năng quá tải", "Tốt", "Yếu"],
          ["Yêu cầu lưới AC", "Lưới mạnh", "Làm việc tốt với lưới yếu"],
          ["Khởi động đen", "Không", "Có"],
          ["Lọc sóng hài", "Cần bộ lọc AC và DC lớn", "Bộ lọc nhỏ (MMC gần như không cần)"],
          ["Điều khiển Q", "Kém", "Tốt"],
          ["Tổn hao trạm", "Thấp hơn", "Cao hơn"],
          ["Sự cố chuyển mạch", "Có thể xảy ra khi áp AC sụt hoặc lệch pha", "Không"],
          ["Đa trạm", "Hạn chế", "Phù hợp"],
          ["Ngắn mạch phía DC", "Điều khiển góc kích để hạn chế dòng", "Dòng qua diode, cần cắt máy cắt AC rồi khởi động lại"],
        ],
      },
      note: "Bảng gốc ghi “Công suất cực đại: trên 1000 kV / khoảng 600 kV” (thực chất là cấp điện áp) và “VSC dùng máy biến áp AC thông thường”. Hai dòng này không đưa vào bảng; xem so sánh cấp điện áp và công suất trong mục HVDC Hybrid của bài giảng TS. Nguyễn Trung Sơn.",
    },
  ]),

  tung("1.1", "tr. 3–6", [
    {
      heading: "Ưu điểm và nhược điểm của HVDC",
      points: [
        "HVDC hiệu quả về kinh tế - kỹ thuật với đường dây trên không khoảng 300–800 km và cáp ngầm khoảng 5–100 km. Cấu hình lưỡng cực chỉ cần hai dây dẫn, giảm chi phí xây dựng và hành lang tuyến.",
        "Nhược điểm: trạm biến đổi đắt hơn đáng kể so với trạm biến áp AC cùng công suất; đưa liên kết HVDC vào lưới AC hiện hữu phải xét kỹ tương tác động, nhất là sóng hài và ổn định; bảo vệ phức tạp hơn nhiều so với HVAC.",
      ],
    },
  ]),

  tung("3.1", "tr. 12–38", [
    {
      heading: "Mục tiêu và cấu trúc điều khiển phân cấp",
      points: [
        "Mục tiêu điều khiển: dòng công suất (độ lớn và chiều), điện áp DC trong giới hạn; với VSC còn tham gia điều tần và điều chỉnh điện áp AC tại điểm đấu nối; tối ưu tổn thất và độ tin cậy.",
        "Các cấp điều khiển: cấp tổng thể (Master Control) quyết định chiến lược và phân bổ công suất; cấp cực (Pole Control) điều khiển dòng, điện áp từng cực; cấp van (Valve/Converter Control) tạo xung kích cho thyristor hoặc IGBT. Ngoài ra có các vòng phụ trợ như điều khiển giảm dao động công suất (POD).",
      ],
    },
    {
      heading: "Điều khiển LCC: góc α, γ và phối hợp hai trạm",
      points: [
        "Góc kích α tính từ thời điểm điện áp anode-cathode của van trở nên dương đến lúc phát xung kích. α = 0° cho điện áp DC cực đại; α tăng thì điện áp DC giảm, quá 90° thì chuyển sang nghịch lưu.",
        "Dải làm việc thường gặp: chỉnh lưu α khoảng 5–20°, nghịch lưu α khoảng 130–150°.",
        "LCC không điều khiển độc lập được P và Q: thay đổi α để điều khiển P đồng thời làm thay đổi độ chậm pha của dòng, nên LCC luôn tiêu thụ Q khoảng 50–60% P. Cần tụ bù tĩnh, cuộn kháng bù khi tải nhẹ, hoặc SVC/STATCOM ở cả hai trạm.",
        "Phân công điển hình: trạm chỉnh lưu giữ dòng DC bằng góc α; trạm nghịch lưu giữ điện áp DC bằng cách điều khiển góc tắt γ để bảo đảm chuyển mạch an toàn.",
        "Bộ điều áp dưới tải (OLTC) là điều khiển chậm: chỉnh tỷ số biến áp để giữ α và γ trong phạm vi tối ưu, giảm tiêu thụ Q và sóng hài; phối hợp với điều khiển góc kích nhanh.",
        "Đảo chiều công suất ở LCC phải cắt liên kết, hoán đổi chức năng điều khiển hai trạm và đảo cực tính điện áp DC rồi mới đóng điện lại, nên chậm và gây gián đoạn.",
        "LCC là thiết bị bám lưới (grid-following): cần SCR thường lớn hơn 2–3, không khởi động đen được, dễ sự cố chuyển mạch ở nghịch lưu khi lưới yếu.",
      ],
      note: CF_NOTE,
    },
    {
      heading: "Điều khiển VSC: hệ tọa độ dq và phối hợp nhiều trạm",
      points: [
        "Điều khiển vector: phép biến đổi Park chuyển dòng, áp ba pha sang hệ tọa độ dq quay đồng bộ với lưới, nên các đại lượng trở thành một chiều và điều khiển được bằng bộ PI. PLL xác định góc pha lưới để trục d trùng vector điện áp, khi đó vq = 0.",
        "Công suất khi đó: P = (3/2)·Vd·Id và Q = −(3/2)·Vd·Iq. P chỉ phụ thuộc Id, Q chỉ phụ thuộc Iq, nên điều khiển độc lập được P và Q.",
        "Phân công phổ biến: một trạm giữ điện áp DC để cân bằng công suất, trạm kia điều khiển P; cả hai trạm đều có thể điều khiển Q. Ví dụ trạm ngoài khơi điều khiển P, trạm trên bờ điều khiển Q để ổn định lưới.",
        "Với nhiều trạm: chiến lược chủ - tớ (một trạm giữ Vdc, các trạm khác điều khiển P) hoặc điều khiển droop điện áp DC (nhiều trạm cùng tham gia giữ Vdc theo đặc tính sụt áp, tăng độ tin cậy).",
        "Đảo chiều công suất ở VSC nhanh và liền mạch: chỉ đổi dấu giá trị đặt công suất, không phải dừng hệ thống hay đảo cực tính điện áp DC.",
        "Khả năng hỗ trợ lưới: điều chỉnh Q để ổn định điện áp, tham gia điều tần, giảm dao động công suất, khởi động đen, hoạt động như STATCOM khi P = 0, làm việc được với lưới yếu (SCR dưới 2).",
      ],
      note: "Slide gọi VSC là thiết bị tạo lưới (grid-forming). Phần lớn trạm VSC-HVDC hiện nay vẫn vận hành ở chế độ bám lưới dùng PLL như mô tả ở ý đầu; chế độ tạo lưới là một chế độ điều khiển riêng, cần khi khởi động đen hoặc nối lưới rất yếu.",
    },
  ]),

  tung("3.2", "tr. 40–102", [
    {
      heading: "Vì sao bảo vệ HVDC phức tạp hơn AC",
      points: [
        "Tổng trở phía DC thấp, nhất là VSC có tụ lớn: dòng sự cố tăng rất lớn trong vài mili giây, phải cách ly sự cố trong khoảng dưới 10 ms.",
        "Dòng DC không có điểm qua 0 tự nhiên nên máy cắt cơ khí khó dập hồ quang; ngắt đột ngột thì điện cảm mạch gây quá áp lớn trên van và cách điện. Van thyristor, IGBT chịu quá dòng, quá áp rất hạn chế.",
        "Ở trạng thái xác lập mạch DC không có điện kháng (X = 0), nên rơle khoảng cách truyền thống không dùng được. Bảo vệ DC dựa trên biên độ tức thời, đạo hàm dòng áp, hoặc sóng lan truyền.",
        "CT và TU cảm ứng không đo được thành phần DC. Thiết bị đo DC gồm biến dòng bù từ thông (DCCT, chính xác nhất), cảm biến Hall (rẻ, kém chính xác hơn), cảm biến dòng sợi quang (FOCS, cách ly hoàn toàn, dải tần rất rộng, dùng cho bảo vệ sóng lan truyền) và bộ phân áp điện trở - tụ (RCVD) để đo điện áp.",
      ],
    },
    {
      heading: "Vùng bảo vệ và các bảo vệ chính",
      points: [
        "Hệ thống được chia thành các vùng chồng lấn: thanh cái AC, bộ lọc AC, MBA chuyển đổi, van/bộ biến đổi, thanh cái DC, bộ lọc DC, đường dây DC. Mỗi vùng có hai bảo vệ chính (ưu tiên khác nguyên lý đo) và một bảo vệ dự phòng, độc lập với hệ thống điều khiển và có nguồn cấp riêng.",
        "Phía AC: so lệch MBA chuyển đổi (có thể bao cả thanh cái AC), quá dòng AC làm dự phòng, quá tải bộ lọc AC (đo dòng cơ bản và hài, đặc tính thời gian phụ thuộc), mất cân bằng bộ lọc và tụ bù.",
        "So lệch van/bộ biến đổi so sánh dòng AC phía van với dòng DC cực và trung tính; đây là bảo vệ quan trọng nhất, nếu không tác động kịp thì quá dòng AC sẽ cắt toàn hệ thống.",
        "Bảo vệ sự cố chuyển mạch: dòng DC lớn hơn dòng AC phía van là dấu hiệu sự cố chuyển mạch. Bảo vệ hài DC (bậc 1, bậc 2) làm dự phòng, phát hiện mất xung điều khiển hoặc sự cố không đối xứng phía AC.",
        "Các bảo vệ khác: quá dòng DC, ứng suất điện áp (đo áp AC có bù theo nấc phân áp), kích van sai (so xung điều khiển với trạng thái thực của van), chạm đất DC, quá áp DC (quá áp đồng thời dòng thấp), hở mạch đường dây điện cực (giám sát dòng qua chống sét van trung tính).",
        "Bảo vệ đường dây DC chỉ tác động ở đầu chỉnh lưu, theo hai tiêu chí: điện áp dưới ngưỡng thấp, hoặc dưới ngưỡng cao hơn kèm tốc độ giảm áp vượt ngưỡng. Khi tác động, ép chỉnh lưu sang nghịch lưu để dập dòng rồi thử khởi động lại.",
      ],
    },
    {
      heading: "Sự cố đường dây DC: một cực chạm đất, ngắn mạch hai cực, đứt dây",
      points: [
        "Một cực chạm đất (P2G) là sự cố thường gặp nhất trên đường dây trên không và phần lớn là thoáng qua; với cáp ngầm thì ít gặp hơn nhưng thường là vĩnh cửu.",
        "Ở VSC/MMC có trung tính phía DC nối đất qua tổng trở cao, dòng P2G ban đầu không lớn nên khó phát hiện bằng ngưỡng quá dòng. Sau quá độ, điện áp cực sự cố về gần 0 còn cực lành tăng gần gấp đôi so với đất, đòi hỏi cách điện cao.",
        "Ngắn mạch hai cực (P2P) hiếm nhưng nghiêm trọng nhất với VSC, gồm ba giai đoạn: tụ DC phóng điện (đỉnh dòng và di/dt rất lớn, Vdc về 0), diode song song ngược dẫn dòng (nguy cơ quá nhiệt diode), rồi lưới AC tiếp tục cấp dòng qua diode như chỉnh lưu không điều khiển.",
        "Sự cố càng xa trạm thì dòng và tốc độ tăng dòng ban đầu càng nhỏ; cuộn kháng làm phẳng hạn chế tốc độ tăng dòng. Bảo vệ P2P cần máy cắt DC tốc độ cao và thuật toán dựa trên di/dt hoặc độ sụt nhanh của điện áp DC.",
        "Đứt dây (sự cố nối tiếp) chỉ gây thay đổi nhỏ ở đầu cuối, khó phân biệt với thay đổi tải; có thể phát hiện bằng sóng phản xạ (bơm xung, đo thời gian phản xạ để định vị) hoặc học máy.",
      ],
      table: {
        caption: "So sánh các nguyên lý bảo vệ đường dây DC (tr. 66–67)",
        columns: ["Nguyên lý", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Sóng lan truyền", "Rất nhanh (vài ms), định vị chính xác", "Kém nhạy với sự cố điện trở cao, cần tốc độ lấy mẫu cao"],
          ["So lệch dòng", "Chọn lọc tuyệt đối, không phụ thuộc điện trở sự cố", "Cần kênh truyền tốc độ cao, ảnh hưởng của dòng điện dung"],
          ["Đạo hàm dV/dt, dI/dt", "Nhanh, không cần truyền thông", "Nhạy nhiễu, khó phân biệt sự cố trong và ngoài vùng"],
          ["Quá dòng, thấp áp", "Đơn giản, rẻ", "Chậm, kém nhạy và kém chọn lọc, thường làm dự phòng"],
          ["Học máy (AI/ML)", "Chính xác, phát hiện được sự cố khó", "Cần nhiều dữ liệu huấn luyện, tính toán phức tạp"],
        ],
      },
      note: "Tiêu đề slide tr. 54 ghi “Ngắn mạch một cực - đất (P2P)”; đúng phải là P2G (pole-to-ground), P2P là ngắn mạch giữa hai cực.",
    },
    {
      heading: "Sự cố chuyển mạch ở LCC",
      points: [
        "Đây là sự cố vận hành ở trạm nghịch lưu, không phải hỏng thiết bị: góc tắt γ thực tế giảm dưới giá trị tới hạn nên van chưa kịp phục hồi tính khóa.",
        "Nguyên nhân: sụt áp lưới AC gần trạm nghịch lưu (chuyển mạch chậm hơn, μ tăng, γ giảm), dịch pha điện áp AC khi có sự cố, hoặc dòng DC tăng đột ngột (μ tăng).",
        "Diễn biến: van lẽ ra phải khóa lại dẫn tiếp, hai van cùng nhánh pha dẫn đồng thời tạo ngắn mạch tạm thời, điện áp DC của cầu sụt về gần 0. Chênh áp giữa chỉnh lưu và nghịch lưu làm dòng DC tăng nhanh, μ càng tăng nên dễ xảy ra sự cố chuyển mạch liên tiếp.",
        "Hệ quả: gián đoạn truyền tải, quá dòng và ứng suất trên van, dao động có thể làm mất ổn định lưới AC, nhất là lưới yếu.",
      ],
      note: CF_NOTE,
    },
    {
      heading: "Bảo vệ bằng điều khiển và triết lý bảo vệ LCC, VSC",
      points: [
        "Làm chậm xung kích (retard): tăng dần góc kích chỉnh lưu đến chế độ nghịch lưu hoàn toàn, điện áp ra đảo dấu và dập dòng sự cố DC mà không cắt phía AC. Nhờ vậy LCC xử lý được sự cố hồ quang thoáng qua trên đường dây trên không bằng tự đóng lại, không cần máy cắt DC.",
        "Khóa bộ biến đổi (block): trước hết kích đồng thời hai van đối diện cùng pha để tạo đường bypass, rồi ngắt xung để van tự tắt khi dòng về 0, tránh quá áp do ngắt dòng đột ngột.",
        "LCC dựa chủ yếu vào điều khiển: với sự cố AC dùng giới hạn dòng phụ thuộc điện áp và thuật toán chống sự cố chuyển mạch; với sự cố DC dùng góc kích; sự cố vĩnh cửu thì cắt máy cắt AC hai đầu. LCC chịu sự cố DC tốt nhưng “đẩy” rủi ro ổn định sang lưới AC.",
        "VSC vượt qua sự cố AC tốt, có thể giảm P và bơm Q như STATCOM để hỗ trợ lưới. Ngược lại sự cố DC là điểm yếu lớn nhất: VSC 2 mức khi khóa IGBT trở thành cầu diode tiếp tục cấp dòng sự cố, nên cần phần cứng cách ly trong vài mili giây.",
        "Khi chọn công nghệ: LCC có thể kinh tế hơn cho liên kết điểm - điểm với lưới mạnh; VSC cần thiết cho lưới DC nhiều trạm.",
      ],
      note: "Slide tr. 92 ghi thuật toán hạn chế dòng là “CDCOL”; thuật ngữ thông dụng là VDCOL (Voltage Dependent Current Order Limiter), như trong phòng lab Đặc tính V-I.",
    },
    {
      heading: "Sự cố thiết bị trong trạm",
      points: [
        "Hư hỏng van thyristor: không kích mở được (misfire), phóng điện ngược khi đang khóa (arc-through), và sự cố chuyển mạch. Hư hỏng IGBT: hở mạch do mỏi nhiệt (đứt dây liên kết, hỏng mối hàn) hoặc ngắn mạch.",
        "Trong MMC, mô-đun hỏng ở dạng ngắn mạch vẫn để dòng đi qua, hệ thống loại mô-đun lỗi và dùng mô-đun dự phòng (kiểu n+1); mô-đun hở mạch thì có thể làm đứt cả nhánh.",
        "MBA chuyển đổi chịu điện áp tổng hợp AC + DC, dòng hài và đảo cực; sự cố hay gặp ở cuộn dây phía van. OLTC thao tác nhiều hơn hẳn MBA AC và là một trong những nguyên nhân hàng đầu gây sự cố MBA.",
        "Thành phần DC trong sự cố, hoặc thiên từ DC lúc bình thường (dòng rò từ bộ biến đổi, dòng cảm ứng địa từ GIC, điều khiển van không đối xứng) có thể làm CT bão hòa sâu, khiến bảo vệ so lệch MBA tác động nhầm hoặc từ chối tác động.",
        "Cuộn kháng làm phẳng: sự cố chạm vòng khó phát hiện sớm; có thể dùng phân tích đáp ứng tần số, hoặc theo dõi trực tuyến đồ thị điện áp - dòng điện (hình ellipse, Lissajous) bằng CT, TU có sẵn.",
        "Hệ thống làm mát van bằng nước khử ion là một trong những nguyên nhân hàng đầu gây ngừng trạm; đóng cặn trên điện cực cân bằng điện áp của van chiếm hơn 66% sự cố liên quan. Hệ thống điều khiển - bảo vệ được nhân đôi toàn bộ với chế độ dự phòng nóng.",
      ],
    },
  ]),


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

  phuong("2.2", "Tổng quan về FACTS", "tr. 4–23", [
    {
      heading: "FACTS và liên hệ với VSC",
      points: [
        "Theo IEEE (từ 1988), FACTS là hệ thống truyền tải xoay chiều dùng thiết bị điện tử công suất để điều khiển dòng công suất và các đại lượng khác của lưới. Ba thông số điều khiển chính là điện áp, góc pha và tổng trở.",
        "Các giới hạn truyền tải mà FACTS giúp nới rộng: giới hạn tải xác lập, ổn định điện áp tĩnh và động, ổn định quá độ, giới hạn nhiệt, giới hạn dòng ngắn mạch, giới hạn cản dao động công suất và dòng vòng không mong muốn.",
        "SVC gồm các nhánh TCR (cuộn kháng điều khiển bằng thyristor), TSC (tụ đóng cắt bằng thyristor) và FC (tụ cố định).",
        "STATCOM dùng bộ biến đổi nguồn áp như trạm VSC: đáp ứng nhanh hơn SVC, giữ được công suất phản kháng khi điện áp thấp, gọn hơn, ít sóng hài, nhưng chi phí đầu tư cao hơn. Đây là lý do một trạm VSC-HVDC có thể chạy ở chế độ STATCOM.",
      ],
    },
    {
      heading: "FACTS nối tiếp và kết hợp: TCSC, SSSC, UPFC, IPFC",
      points: [
        "TCSC (tụ bù dọc điều khiển bằng thyristor): tụ nối tiếp mắc song song với một TCR, thực chất là điện kháng nối tiếp thay đổi được. Giảm X đường dây để tăng Pmax, phân bố công suất giữa các đường dây song song, dập dao động công suất và cộng hưởng dưới đồng bộ (SSR).",
        "SSSC (bộ bù nối tiếp tĩnh): một VSC bơm vào đường dây qua MBA nối tiếp một điện áp có biên độ và pha điều khiển được. Khác TCSC, SSSC là nguồn áp, không phụ thuộc trở kháng đường dây, và là phần nối tiếp của UPFC, IPFC.",
        "UPFC: một VSC song song (như STATCOM) và một VSC nối tiếp (như SSSC) dùng chung một khâu DC, điều khiển đồng thời và độc lập điện áp nút cùng P, Q trên đường dây. Cấu trúc này chính là một trạm back-to-back VSC thu nhỏ.",
        "IPFC: nhiều VSC nối tiếp trên các đường dây khác nhau chung một thanh cái DC, chuyển công suất từ đường quá tải sang đường non tải trong cùng hành lang.",
      ],
      table: {
        caption: "Tổng hợp các thiết bị FACTS (tr. 23)",
        columns: ["Thiết bị", "Kiểu đấu", "Công nghệ", "Chức năng chính"],
        rows: [
          ["SVC", "Song song", "Thyristor", "Bù Q, điều áp nút"],
          ["STATCOM", "Song song", "VSC", "Bù Q nhanh, tốt ở điện áp thấp"],
          ["TCSC", "Nối tiếp", "Thyristor", "Thay đổi X đường dây, tăng khả năng tải, dập SSR"],
          ["SSSC", "Nối tiếp", "VSC", "Bơm áp nối tiếp, điều khiển P"],
          ["UPFC", "Kết hợp", "VSC", "Điều khiển đồng thời V, P, Q"],
          ["IPFC", "Kết hợp nhiều đường dây", "VSC", "San công suất giữa các đường dây"],
          ["TCPST", "Nối tiếp", "Thyristor", "Dịch pha điều khiển được"],
        ],
      },
    },
  ]),

  phuong("2.2", "Tổng quan về truyền tải điện một chiều HVDC", "tr. 27–31", [
    {
      heading: "HVDC lai: bổ sung từ bài giảng TS. Phạm Quang Phương",
      points: [
        "Tổn thất trạm: LCC khoảng 0,7 %/trạm, VSC khoảng 1 %/trạm. VSC đổi lại được điều khiển P, Q độc lập, khởi động đen, nối lưới yếu và đảo chiều công suất mà không đổi cực tính điện áp.",
        "Lai theo đầu cực: LCC ở đầu phát (công suất lớn, rẻ), VSC ở đầu thu cấp cho lưới yếu hoặc đô thị, tránh sự cố chuyển mạch vốn hay xảy ra ở nghịch lưu LCC. Có thể lai nối tiếp hay song song trên cùng một cực, hoặc nâng cấp một hệ LCC cũ bằng cách thêm đầu VSC.",
        "MMC lai: submodule nửa cầu rẻ và ít tổn thất nhưng không chặn được dòng sự cố DC; submodule cầu đủ tạo được điện áp âm để dập dòng sự cố nhưng gấp đôi số van. Trộn khoảng 50–70 % submodule cầu đủ là đủ để vượt qua sự cố DC mà vẫn tối ưu giá thành, nên dùng được cho đường dây trên không.",
        "Dự án tham khảo thêm: Skagerrak 4 (Na Uy – Đan Mạch) là cực VSC chạy song song với các cực LCC cũ, tạo thành lưỡng cực lai; Nan'ao và Zhoushan (Trung Quốc) là các hệ MMC nhiều đầu cực, nền tảng cho lưới DC.",
        "Thách thức: phối hợp điều khiển nguồn dòng (LCC) với nguồn áp (VSC), bảo vệ và dập sự cố DC phức tạp hơn, mô hình hóa và chỉnh định khó hơn, kinh nghiệm vận hành còn ít.",
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

  phuong("4.2", SIM_SOURCE, "tr. 2–4, 14–15", [
    {
      heading: "Các bài toán tính toán HVDC theo thang thời gian",
      points: [
        "HVDC là hệ điện tử công suất ghép vào lưới AC, nên hiện tượng trải từ micro giây đến nhiều giờ. Mỗi thang thời gian cần một loại mô hình và công cụ riêng; quy trình nghiên cứu điển hình đi từ xác lập, sang quá độ, rồi kiểm chứng bằng phần cứng thật.",
        "Trong trào lưu công suất, LCC được mô hình như nút điều khiển công suất hoặc dòng DC qua α (chỉnh lưu) và γ (nghịch lưu), hệ số công suất nhỏ hơn 1 nên hút nhiều Q. VSC hành xử như nguồn PQ hoặc PV tại điểm đấu nối, bị giới hạn bởi Smax và Imax của van.",
        "Hệ số công suất của LCC xấp xỉ cos α trừ đi sụt áp chuyển mạch tương đối, nên α càng lớn thì Vd càng giảm và Q hút càng tăng. Đây là lý do LCC luôn cần bù công suất phản kháng.",
      ],
      formulas: [
        String.raw`V_d = \frac{3\sqrt{2}}{\pi}V_{LL}\cos\alpha - \frac{3}{\pi}X_c I_d,\qquad \cos\varphi \approx \cos\alpha - \frac{X_c I_d}{\sqrt{2}\,V_{LL}},\qquad Q \approx P\tan\varphi`,
      ],
      table: {
        caption: "Chọn công cụ theo bài toán (tr. 14–15)",
        columns: ["Bài toán", "Trả lời câu hỏi", "Thang thời gian", "Công cụ tiêu biểu"],
        rows: [
          ["Trào lưu công suất", "Điểm làm việc, P/Q, điện áp có đạt yêu cầu?", "Xác lập", "PSS/E, PowerFactory, PSS/SINCAL"],
          ["Ngắn mạch", "Dòng sự cố, chọn thiết bị, chỉnh định bảo vệ?", "Xác lập", "PSS/E (ASCC, IEC 60909), PowerFactory"],
          ["Ổn định RMS", "Hệ có ổn định sau sự cố? HVDC hỗ trợ ra sao?", "ms – s", "PSS/E, PowerFactory"],
          ["Quá độ điện từ (EMT)", "Quá độ nhanh, điều khiển, sự cố DC?", "µs – ms", "PSCAD/EMTDC, EMTP-RV, Simulink"],
          ["Sóng hài, trở kháng", "Phổ hài, cộng hưởng, ổn định theo trở kháng?", "Miền tần số", "PSCAD, MATLAB, PowerFactory"],
          ["Thời gian thực, HIL", "Tủ điều khiển và bảo vệ thật có làm đúng?", "Thời gian thực, bước µs", "RTDS, OPAL-RT, Typhoon HIL"],
        ],
      },
    },
    {
      heading: "Ổn định RMS và mô phỏng EMT",
      points: [
        "Mô phỏng RMS dạng phasor, bước ms – s: đánh giá ổn định quá độ sau sự cố, dao động liên vùng (HVDC có thể bơm thêm cản dịu POD), hỗ trợ tần số và điện áp, khởi động đen của VSC và khả năng vượt sự cố (FRT). Trong PSS/E, LCC hai đầu dùng các mô hình như CDC4T, CDC6T với bước tích phân khoảng nửa chu kỳ.",
        "EMT tính giá trị tức thời với bước micro giây, cần khi nghiên cứu đóng cắt van, phát xung và PWM, quá điện áp và phối hợp cách điện, sự cố phía DC và máy cắt DC, lưới rất yếu, cộng hưởng dưới đồng bộ, và chi tiết của sự cố chuyển mạch mà RMS không thấy được.",
        "Mô hình EMT gồm van chi tiết (thyristor với trùng dẫn μ; IGBT và điốt; MMC hàng trăm đến hàng nghìn submodule) cùng vòng điều khiển, bảo vệ thật. Vì khối lượng tính rất lớn, MMC thường dùng mô hình tương đương rút gọn để chạy được hệ thống lớn.",
      ],
    },
  ]),

  phuong("4.2", PSSE_SOURCE, "tr. 3–34", [
    {
      heading: "PSS/E: quy trình, bộ giải và ba mô hình HVDC",
      points: [
        "Mọi bài toán đi theo cùng khung: dựng hoặc đọc case (.sav nhị phân, .raw/.rawx văn bản), nhập thông số, giải, khai thác kết quả, rồi tự động hóa bằng Python (PSSPY). Các tệp khác: .sld sơ đồ một sợi, .dyr mô hình động, .rop dữ liệu OPF.",
        "Loại nút IDE: 1 là nút tải PQ, 2 là nút PV có máy phát, 3 là nút cân bằng, 4 là nút tách lưới. Bộ giải mặc định FNSL (Newton–Raphson đầy đủ); FDNS, NSOL và SOLV (Gauss–Seidel) dùng cho lưới lớn hoặc để khởi tạo.",
        "HVDC khai báo riêng trong ba mục: Two-Terminal DC (LCC hai đầu), VSC DC Line (VSC hai đầu) và Multi-Terminal DC (nhiều đầu, LCC hoặc VSC, dùng cho dự án như Côn Liễu Long ba đầu). Các case mẫu như savnw không có sẵn HVDC, phải tự thêm.",
        "Ở mỗi bước Newton của lưới AC, PSS/E giải một vòng lặp con cho đường dây DC để tìm Vdc, Id, α hoặc γ và nấc MBA (tỉ số a trong công thức dưới) thỏa giá trị đặt, rồi bơm P và Q của trạm vào nút AC như tải hoặc nguồn tương đương.",
        "Dự án thực tế làm ví dụ: Bheramara 2 × 500 MW back-to-back (Ấn Độ – Bangladesh), nghiên cứu giới hạn công suất run-back trong PSS/E; bản slide trào lưu công suất trước đó dùng thêm liên kết TNB–EGAT (Malaysia – Thái Lan).",
      ],
      formulas: [String.raw`V_{d,\mathrm{rect}} = \frac{3\sqrt{2}}{\pi}\,a\,V_{LL}\cos\alpha - \frac{3}{\pi}X_c I_d`],
    },
    {
      heading: "Thông số LCC (Two-Terminal DC) và giá trị trong case 7 nút",
      points: [
        "Mỗi đường LCC có ba bản ghi: điều khiển chung, trạm chỉnh lưu và trạm nghịch lưu (cùng các trường, hậu tố R và I).",
        "Xc là thông số then chốt: nó quyết định góc trùng dẫn μ, sụt áp chuyển mạch và lượng Q rất lớn mà LCC buộc phải hút, nên trạm phải đặt tụ bù và bộ lọc.",
        "ANMN không được đặt bằng 0. Ở nghịch lưu, γ = 0 bị mô hình coi là sự cố chuyển mạch và bài toán không hội tụ.",
      ],
      table: {
        caption: "Các trường chính của LCC (tr. 18–22, 57)",
        columns: ["Thông số", "Ý nghĩa", "Case 7 nút / khuyến nghị"],
        rows: [
          ["MDC", "Chế độ: 0 khóa, 1 điều khiển công suất (MW), 2 điều khiển dòng (A)", "1"],
          ["SETVL / VSCHD", "Giá trị đặt (MW hoặc A) / điện áp DC danh định", "500 MW / 500 kV"],
          ["RDC", "Tổng điện trở đường dây DC", "10 Ω (thường 5–10 Ω)"],
          ["METER", "Công suất đặt tính tại chỉnh lưu (R) hay nghịch lưu (I)", "R"],
          ["RCOMP", "Điện trở bù tạo đặc tính droop khi nhiều đường DC song song", "0 với một đường"],
          ["DELTI", "Biên dòng giữa chỉnh lưu và nghịch lưu (pu)", "0,01 trong case; khuyến nghị 0,05–0,1"],
          ["VCMOD / DCVMIN", "Ngưỡng chuyển Power → Current / điện áp DC tối thiểu", "0 / 450 kV (70–80 % VSCHD)"],
          ["ANMX / ANMN", "Giới hạn góc α (chỉnh lưu) hoặc γ (nghịch lưu)", "90° / 7° (α 5–10°, γ 7–10°)"],
          ["NB", "Số cầu 6 xung nối tiếp", "1"],
          ["Tap / Min / Max / Step", "Nấc MBA chuyển đổi", "1,0 / 0,9 / 1,1 / 0,00625 (33 nấc)"],
          ["Xc / Rc", "Điện kháng và điện trở chuyển mạch mỗi cầu", "1 Ω / 1 Ω"],
          ["Xcap", "Tụ nối tiếp của bộ CCC (capacitor-commutated)", "0"],
        ],
      },
      note: "Slide khuyến nghị DELTI 0,05–0,1 nhưng case mẫu (cả slide và file .raw) dùng 0,01. Xc = 1 Ω là giá trị lý tưởng hóa để case dễ hội tụ: với Id = 1 kA, sụt áp chuyển mạch chỉ khoảng 1 kV, trong khi trạm thật có hàng chục kV (Basslink khoảng 13 kV mỗi cầu, bài 4.3). Muốn thấy rõ Q hút và μ, nên thử tăng Xc.",
    },
    {
      heading: "Thông số VSC (VSC DC Line)",
      points: [
        "Quy tắc: một đầu điều khiển điện áp DC, đầu kia điều khiển công suất. Hai đầu cùng loại điều khiển thì PSS/E báo lỗi dữ liệu.",
        "Khi điều khiển P, dấu của DCSET quyết định chiều: dương là bơm công suất vào nút AC, âm là hút từ nút AC. Đảo chiều chỉ cần đổi dấu, không đổi cực tính điện áp DC như LCC.",
        "Tổn thất bộ biến đổi mô hình bậc hai theo dòng: thành phần A ứng với tổn hao đồng, B với tổn hao đóng cắt IGBT, cộng thêm tổn thất không tải tối thiểu.",
      ],
      formulas: [String.raw`P_{loss} = A_{loss} I^2 + B_{loss} I + P_{loss,\min}`],
      table: {
        caption: "Các trường chính của VSC (tr. 25–29, 58)",
        columns: ["Thông số", "Ý nghĩa", "Nút 7", "Nút 4"],
        rows: [
          ["TYPE", "Điều khiển phía DC: 1 điện áp DC (kV), 2 công suất (MW)", "1 (giữ Vdc)", "2 (đặt P)"],
          ["DCSET", "Giá trị đặt: Vdc, hoặc ±P", "500 kV", "100 MW"],
          ["MODE / ACSET", "Phía AC: 1 điều khiển điện áp AC, 2 hệ số công suất", "1 / 1,0 pu", "2 / PF = 1 (Q ≈ 0)"],
          ["SMAX / IMAX", "Giới hạn MVA / dòng AC (0 thì tự tính theo SMAX)", "500 MVA / 0", "500 MVA / 0"],
          ["MAXQ / MINQ", "Giới hạn phát và hút Q", "±9999 Mvar", "±9999 Mvar"],
          ["PWF", "Trọng số ưu tiên P so với Q khi chạm IMAX", "0,02", "0,02"],
          ["REMOT / RMPCT", "Nút điều áp từ xa / % tham gia điều khiển Q (OPF)", "7 / 100 %", "4 / 100 %"],
        ],
      },
      note: "Slide ghi RDC của VSC “thường 1–5 Ω” nhưng case đặt 10 Ω, bằng RDC của đường LCC. Các hệ số tổn thất A, B và tổn thất tối thiểu trong case đều bằng 0, tức bộ biến đổi VSC được coi là không tổn thất.",
    },
  ]),

  phuong("4.2", PSSE_SOURCE, "tr. 15–16, 36–59", [
    {
      heading: "Case thực hành 7 nút LCC + VSC và các kịch bản",
      points: [
        "Lưới 7 nút 500 kV, 50 Hz: nút 1 cân bằng; máy phát ở nút 2, 6, 7; tải 100 + j50 MVA ở nút 3 và 4, 500 + j200 MVA ở nút 5; tụ bù cố định +300 Mvar ở nút 2, 4, 5, 7. LCC chỉnh lưu ở nút 2, nghịch lưu ở nút 5 (500 MW, 500 kV); VSC nút 7 giữ Vdc = 500 kV, nút 4 đặt P = 100 MW.",
        "Kết quả cơ sở: điện áp các nút 0,953–0,965 pu nhờ tụ bù; nút 2 thấp nhất vì trạm chỉnh lưu hút Q. Id = 500 MW / 500 kV ≈ 1 kA, tổn thất trên RDC = Id²·RDC = 10 MW, nên nghịch lưu nhận khoảng 490 MW.",
        "Ví dụ 2, tăng SETVL của LCC 500 → 600 → 700 MW: Id tăng làm Q hút tăng và điện áp nút 2 giảm nếu không thêm bù; sụt áp DC tăng nên phải tăng nấc hoặc giảm α; có thể chạm giới hạn góc hoặc DCVMIN và PSS/E tự giảm SETVL.",
        "Ví dụ 3, đổi đầu VSC nút 4 từ điều khiển PF sang điều khiển điện áp AC: VSC phát hoặc hút Q để giữ điện áp, chỉ bị kẹp bởi MAXQ, MINQ và SMAX. Ví dụ 4, đổi DCSET +100 → −100 MW: công suất đảo chiều mà cực tính DC giữ nguyên.",
        "Ví dụ 5, giảm điện áp AC phía nghịch lưu LCC (cắt một nguồn gần nút 5): γ không đủ, nguy cơ sự cố chuyển mạch; nếu Vdc dưới VCMOD hoặc DCVMIN thì PSS/E chuyển chế độ hoặc giảm SETVL. VSC không có sự cố chuyển mạch, nên thực tế hay đặt VSC ở đầu nhận là lưới yếu.",
        "OPF (NOPF, tệp .rop): ràng buộc điện áp 0,95–1,05 pu, giới hạn 300 MVA trên nhánh 2–4 và 4–5, chi phí phát tuyến tính từng đoạn, cùng ràng buộc của đường LCC. Bộ giải hội tụ “Optimal Solution Found” sau khoảng 16 vòng lặp, hai nhánh 2–4 và 4–5 nằm ở giới hạn.",
      ],
    },
    {
      heading: "Lỗi hội tụ thường gặp và checklist",
      points: [
        "Trước khi giải: đủ bù Q quanh trạm LCC; ANMN ≥ 7°; VSC một đầu Vdc, một đầu P; SMAX, MAXQ hợp lý. Sau khi giải: psspy.solved() = 0, điện áp nút trong 0,95–1,05 pu, đọc Vdc, Pdc, Q hút bằng các hàm a2trmdcconvreal, dc2dat, avscdcconvreal, rồi lưu case và xuất báo cáo.",
        "Mô phỏng động sau trào lưu: gắn mô hình DC (add_ttdcline_model, add_vsdcline_model, add_mtdcline_model) rồi chạy theo trình tự CONG → CONL → ORDR → FACT → TYSL → DYRE → STRT → RUN.",
        "Bài tập đề xuất: chạy FNSL và lập bảng điện áp, dòng nhánh; quét SETVL 300 → 800 MW, vẽ Q hút và điện áp nút 2; chuyển VSC nút 4 sang điều khiển điện áp AC; đảo chiều VSC; chạy OPF và đối chiếu DETAIL.log. Nộp script PSSPY, bảng hoặc đồ thị và nhận xét.",
      ],
      table: {
        caption: "Triệu chứng và cách khắc phục (tr. 51)",
        columns: ["Triệu chứng", "Nguyên nhân / khắc phục"],
        rows: [
          ["Không hội tụ khi thêm LCC", "ANMN = 0: đặt γ ≥ 7°; thiếu bù Q: thêm tụ"],
          ["Điện áp nút trạm rất thấp", "LCC hút Q lớn: tăng tụ, bộ lọc"],
          ["Không đạt SETVL", "Chạm DCVMIN, giới hạn góc hoặc nấc: nới giới hạn"],
          ["VSC báo lỗi dữ liệu", "Hai đầu cùng loại điều khiển: đặt một đầu Vdc, một đầu P"],
          ["Vòng lặp DC quá nhiều", "Tăng CCCITMX, chỉnh CCCACC"],
        ],
      },
    },
  ]),

  phuong("1.2", "Tổng quan về truyền tải điện một chiều HVDC", "tr. 7–13", [
    {
      heading: "Back-to-back qua ví dụ bếp từ",
      points: [
        "Phân loại HVDC theo đường dòng trở về (kim loại, đất hoặc biển, không có), theo số cực (đơn cực, lưỡng cực, ba cực) và theo công nghệ (LCC thyristor, VSC IGBT).",
        "Một bếp từ có đúng cấu trúc của trạm back-to-back: cầu điốt chỉnh lưu lưới 220 V, 50 Hz thành DC, tụ DC-link lọc và giữ điện áp, nghịch lưu IGBT tạo dòng xoay chiều 20–100 kHz cấp cho cuộn dây. Hai bộ biến đổi dùng chung khâu một chiều, không có đường dây DC, hai phía khác tần số.",
        "Cuộn dây bếp từ dùng dây Litz (nhiều sợi nhỏ bọc cách điện, bện đổi vị trí) vì ở tần số cao hiệu ứng bề mặt và hiệu ứng lân cận làm điện trở xoay chiều tăng mạnh. Cùng hiện tượng này là một lý do đường dây HVDC dùng hết tiết diện dây dẫn tốt hơn đường dây AC.",
        "Khác biệt với trạm B2B thật chỉ ở cấp công suất (MW thay cho kW) và tần số hai phía (hai lưới 50/60 Hz thay cho 50 Hz và hàng chục kHz).",
      ],
    },
  ]),

  phuong("2.3", SIM_SOURCE, "tr. 9", [
    {
      heading: "Nghiên cứu sóng hài và chất lượng điện năng",
      points: [
        "LCC 12 xung sinh sóng hài đặc trưng bậc 11, 13, 23, 25…, cần bộ lọc AC, DC và bù Q lớn tại trạm; dòng hài bơm vào lưới phải nằm trong giới hạn cho phép.",
        "VSC, MMC nhiều mức sinh ít sóng hài hơn nhiều, bộ lọc nhỏ gọn hoặc gần như không cần, nhưng phải chú ý sóng hài tần số cao do đóng cắt.",
        "Nghiên cứu gồm phân tích phổ hài, thiết kế bộ lọc và kiểm tra theo IEEE 519, IEC 61000, dùng quét tần số (frequency scan) và mô phỏng EMT.",
      ],
    },
  ]),

  phuong("3.1", SIM_SOURCE, "tr. 10–12", [
    {
      heading: "Tương tác điều khiển, lưới yếu và kiểm chứng HIL",
      points: [
        "Chỉnh định các vòng điều khiển: dòng DC, điện áp DC, P/Q, PLL và cân bằng năng lượng MMC. Tương tác điều khiển có thể xảy ra giữa các trạm HVDC gần nhau, với lưới yếu (mất ổn định vòng điều khiển), hoặc với tua-bin gió và thiết bị điện tử công suất khác (dao động dưới đồng bộ SSO, SSCI, SSTI).",
        "Lưới yếu khi SCR < 3, rất yếu khi SCR < 2. LCC ở lưới yếu dễ sự cố chuyển mạch và khó phục hồi; VSC tốt hơn nhưng vẫn cần phân tích ổn định theo trở kháng để tránh cộng hưởng.",
        "Công cụ: phân tích tín hiệu nhỏ (trị riêng), quét trở kháng theo tần số, kiểm chứng bằng EMT ở nhiều mức SCR.",
        "Mô phỏng thời gian thực (bước khoảng 1–50 µs trên RTDS, OPAL-RT, Typhoon HIL) cho phép nối tủ điều khiển, bảo vệ thật vào lưới ảo (CHIL) hoặc nối thiết bị công suất thật qua bộ khuếch đại (PHIL). Đây là bước kiểm chứng tủ điều khiển HVDC trong thử nghiệm xuất xưởng (FAT), trước khi đóng điện.",
      ],
      formulas: [String.raw`\mathrm{SCR} = \frac{S_{sc}}{P_{dc}}`],
    },
  ]),

  phuong("3.2", SIM_SOURCE, "tr. 5, 13", [
    {
      heading: "Ngắn mạch và sự cố phía DC theo công nghệ",
      points: [
        "Phía AC: LCC đóng góp dòng ngắn mạch hạn chế nhưng rất nhạy với sụt áp, dễ sự cố chuyển mạch; VSC giới hạn dòng sự cố ở khoảng 1,0–1,1 pu nhờ van và điều khiển chặn rất nhanh. Kết quả ngắn mạch dùng để chỉnh định bảo vệ và chọn thiết bị (khả năng cắt, dao cách ly).",
        "Phía DC: LCC tự giới hạn dòng sự cố nhờ điều khiển góc (cưỡng bức chậm kích, force retard). VSC nửa cầu không chặn được vì điốt tự do vẫn dẫn, nên cần máy cắt DC hoặc MMC cầu đủ.",
        "Các vùng bảo vệ: vùng AC, vùng van và bộ biến đổi, thanh cái DC, đường dây hoặc cáp DC. Lưới DC nhiều đầu cực cần phối hợp bảo vệ chọn lọc và cắt sự cố trong vài mili giây.",
        "Công cụ: PSS/E (ASCC) hoặc PowerFactory cho ngắn mạch AC; EMT (PSCAD) cho quá độ dòng sự cố DC và phối hợp bảo vệ; mô phỏng thời gian thực để kiểm chứng rơ-le.",
      ],
    },
  ]),
];
