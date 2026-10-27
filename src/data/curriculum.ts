import { LearningLevel } from "@/types/hvdc";

/**
 * Khung chương trình 4 cấp độ theo tài liệu đào tạo EVNNPT
 * (docs/hvdc-webapp-specification.md, mục II)
 */
export const CURRICULUM_LEVELS: LearningLevel[] = [
  {
    level: 1,
    code: "LV1-BASICS",
    title: "Cấp độ 1: Tổng Quan & Cơ Sở Lý Thuyết HVDC",
    subtitle: "Cơ bản - Nền tảng nguyên lý truyền tải điện DC",
    description:
      "Nắm vững bối cảnh kinh tế kỹ thuật của HVDC so với HVAC, phân tích khoảng cách hòa vốn (Break-even distance), các cấu hình hệ thống (Monopolar, Bipolar, Back-to-Back, Multi-terminal) và cấu trúc tổng quan một trạm biến đổi.",
    badge: "Cơ bản (Fundamentals)",
    iconName: "Compass",
    lessonsCount: 3,
    durationHours: 12,
    topics: [
      {
        id: "1.1",
        title: "Bài 1.1: Bối cảnh Kỹ thuật & So sánh HVAC vs HVDC",
        description:
          "Điểm hòa vốn kinh tế (600-800km trên không, >50km cáp biển), triệt tiêu dòng điện nạp dung kháng, tăng khả năng tải của hành lang tuyến hẹp.",
        docRef: "Tong quan HVDC 1, 2, 3",
        keyPoints: [
          "Chi phí trạm biến đổi HVDC cao hơn trạm AC, nhưng chi phí đường dây/km và tổn thất thấp hơn. Hai đường chi phí cắt nhau tại khoảng cách hòa vốn khoảng 600-800 km với đường dây trên không.",
          "Cáp ngầm/cáp biển AC bị giới hạn bởi dòng nạp dung kháng. Trên khoảng 50-80 km, gần như toàn bộ khả năng tải của cáp AC bị dòng nạp chiếm hết, nên HVDC là lựa chọn bắt buộc.",
          "HVDC không truyền dòng sự cố giữa hai lưới AC và điều khiển được chính xác dòng công suất, phù hợp để giải tỏa nguồn điện gió ngoài khơi và điện mặt trời.",
          "Hai cực DC chỉ cần 2 dây dẫn thay vì 3 pha, nên hành lang tuyến hẹp hơn với cùng công suất truyền tải.",
        ],
        formula: "P_loss ∝ I²·R ; HVDC: không có thành phần X_L, B_C trên đường dây",
        formulaTex: String.raw`P_{loss} \propto I^2 R \qquad Q_{c,\,AC} = \omega C\,U^2`,
      },
      {
        id: "1.2",
        title: "Bài 1.2: Các Cấu hình Hệ thống HVDC Cơ bản",
        description:
          "Đơn cực hoàn lưu đất/dây kim loại, hai cực trung tính nối đất, khâu nối Back-to-Back liên kết lưới không đồng bộ và hệ thống đa cực (Multi-terminal).",
        docRef: "Co hoi va thach thuc HVDC (EVNNPT)",
        keyPoints: [
          "Đơn cực (Monopolar): một dây cực, dòng trở về qua đất/biển (cần điện cực nối đất) hoặc qua dây kim loại hồi lưu.",
          "Hai cực (Bipolar): hai cực +/− với trung tính nối đất. Khi mất một cực, cực còn lại vẫn tải được khoảng 50% công suất ở chế độ đơn cực.",
          "Back-to-Back: chỉnh lưu và nghịch lưu đặt trong cùng một trạm, không có đường dây. Dùng để liên kết hai lưới khác tần số hoặc không đồng bộ.",
          "Đa cực (MTDC): từ 3 trạm trở lên trên cùng lưới DC, chủ yếu dùng công nghệ VSC vì đảo chiều công suất không cần đảo cực điện áp.",
        ],
        labLink: { href: "#sld", label: "Mở sơ đồ SLD để chuyển cấu hình" },
      },
      {
        id: "1.3",
        title: "Bài 1.3: Cấu trúc Tổng thể Trạm Biến đổi (Converter Station Layout)",
        description:
          "Bố trí sân AC 500kV, Máy biến áp đổi nối Y/Y & Y/Δ, Nhà van (Valve Hall), Sân DC, Cuộn cảm san bằng và Bộ lọc sóng hài.",
        docRef: "Bai giang HVDC - EVNNPT",
        keyPoints: [
          "Sân AC gồm thanh cái, máy cắt, bộ lọc AC và tụ bù. Bộ lọc vừa khử sóng hài vừa cấp công suất phản kháng cho van LCC.",
          "Máy biến áp đổi nối có hai tổ cuộn dây Y/Y và Y/Δ lệch nhau 30° để tạo cầu 12 xung, kèm bộ điều áp dưới tải (OLTC).",
          "Nhà van chứa các van Thyristor có làm mát bằng nước khử ion. Sân DC gồm cuộn kháng san bằng, bộ lọc DC và thiết bị đo lường DC.",
        ],
        labLink: { href: "#sld", label: "Khảo sát từng thiết bị trên SLD" },
      },
    ],
  },
  {
    level: 2,
    code: "LV2-POWER-ELEC",
    title: "Cấp độ 2: Điện Tử Công Suất Trong HVDC",
    subtitle: "Trung cấp - Công nghệ LCC vs VSC & Sóng hài",
    description:
      "Khám phá sâu nguyên lý hoạt động của van Thyristor và IGBT, cầu 6 xung & 12 xung, quá trình chuyển mạch (Commutation), góc kích α, góc dập γ, và công nghệ MMC (HVDC PLUS Siemens).",
    badge: "Trung cấp (Converters)",
    iconName: "Cpu",
    lessonsCount: 3,
    durationHours: 16,
    topics: [
      {
        id: "2.1",
        title: "Bài 2.1: Công nghệ LCC (Line Commutated Converter)",
        description:
          "Nguyên lý chuyển mạch theo chu kỳ lưới xoay chiều, phương trình điện áp Vd = Vd0·cos(α) - ΔVx, hiện tượng trùng dẫn μ và nguy cơ mất chuyển mạch (Commutation Failure).",
        docRef: "Dien tu CS trong HVDC",
        keyPoints: [
          "Thyristor chỉ mở được bằng xung kích và chỉ khóa khi dòng qua van về 0. Việc chuyển dòng giữa các van dựa vào điện áp lưới AC, nên gọi là chuyển mạch theo lưới.",
          "Cầu 6 xung (Graetz) cho điện áp ra Vd0 = 1,35·V_LL với gợn sóng tần số 6f. Hai cầu nối tiếp qua MBA Y/Y và Y/Δ tạo thành cầu 12 xung, gợn sóng 12f.",
          "Do điện cảm tản của MBA, việc chuyển dòng giữa hai van kéo dài một góc trùng dẫn μ, làm điện áp ra giảm một lượng ΔVx.",
          "Ở trạm nghịch lưu, nếu γ = 180° − (α + μ) nhỏ hơn thời gian phục hồi khóa của van (khoảng 17°), van không kịp khóa lại và xảy ra thất bại chuyển mạch.",
        ],
        formula: "Vd = Vd0·[cos α + cos(α+μ)]/2 ; γ = 180° − (α + μ)",
        formulaTex: String.raw`V_d = V_{d0}\,\frac{\cos\alpha + \cos(\alpha+\mu)}{2},\quad V_{d0} = \frac{3\sqrt{2}}{\pi}V_{LL},\quad \gamma = 180^\circ - (\alpha+\mu)`,
        labLink: { href: "#simulation", label: "Thử α và μ trong phòng lab dạng sóng" },
      },
      {
        id: "2.2",
        title: "Bài 2.2: Công nghệ VSC (Voltage Source Converter & MMC)",
        description:
          "Cấu trúc khối MMC đa mức, điều khiển độc lập công suất tác dụng P và phản kháng Q trên 4 góc phần tư, khả năng Khởi động đen (Black Start).",
        docRef: "2022-03-11-HVDC-PLUS Siemens VSC",
        keyPoints: [
          "IGBT đóng và cắt được theo lệnh điều khiển, nên bộ biến đổi tự tạo điện áp AC và không cần lưới AC mạnh để chuyển mạch.",
          "MMC gồm hàng trăm module con (nửa cầu hoặc cầu đủ) nối tiếp trong mỗi nhánh. Điện áp ra là dạng bậc thang gần hình sin, nên hầu như không cần bộ lọc sóng hài.",
          "VSC điều khiển P và Q độc lập trên cả 4 góc phần tư và có thể cấp nguồn cho lưới chết (Black start).",
          "Khi đảo chiều công suất, VSC đảo chiều dòng điện chứ không đảo cực điện áp, nên phù hợp với cáp XLPE và lưới đa cực.",
        ],
      },
      {
        id: "2.3",
        title: "Bài 2.3: Sóng Hài & Thiết Kế Bộ Lọc (Harmonics & Filtering)",
        description:
          "Sóng hài phía AC (bậc 11, 13, 23, 25) và phía DC (bậc 12, 24). Phân tích cấu hình bộ lọc cộng hưởng đơn, đôi và tụ bù công suất phản kháng Q.",
        docRef: "HVDC Reference flyer & Sóng hài NPT",
        keyPoints: [
          "Cầu p xung sinh sóng hài đặc trưng bậc n = kp ± 1 phía AC và n = kp phía DC.",
          "Cầu 12 xung triệt tiêu sóng hài bậc 5 và 7 phía AC nhờ độ lệch 30° giữa hai MBA Y/Y và Y/Δ.",
          "Bộ lọc điều hưởng (tuned) cho bậc 11/13, bộ lọc thông cao (high-pass) cho bậc từ 24 trở lên. Bộ lọc AC đồng thời cấp khoảng 50-60% Pd công suất phản kháng.",
        ],
        formula: "n_AC = k·p ± 1 ; n_DC = k·p",
        formulaTex: String.raw`n_{AC} = k\,p \pm 1, \qquad n_{DC} = k\,p, \qquad k = 1, 2, 3, \dots`,
        labLink: { href: "#simulation", label: "So sánh gợn sóng 6 và 12 xung" },
      },
    ],
  },
  {
    level: 3,
    code: "LV3-CONTROL-PROT",
    title: "Cấp độ 3: Điều Khiển & Bảo Vệ Hệ Thống HVDC",
    subtitle: "Nâng cao - V-I Characteristic & Hệ thống rơ-le",
    description:
      "Làm chủ chiến lược điều khiển phối hợp giữa trạm Chỉnh lưu và Nghịch lưu, đường đặc tính V-I, chế độ điều khiển Dòng điện Hằng số (CC), Điện áp Hằng số (CV) và các mạch bảo vệ vi sai, sóng truyền.",
    badge: "Nâng cao (Control & Protection)",
    iconName: "ShieldAlert",
    lessonsCount: 2,
    durationHours: 14,
    topics: [
      {
        id: "3.1",
        title: "Bài 3.1: Chiến lược Điều khiển Vòng kín & Đặc tính V-I",
        description:
          "Giao điểm làm việc giữa đặc tính V-I trạm Chỉnh lưu và Nghịch lưu, điều khiển góc dập tối thiểu γ_min = 17°, phản ứng khi sụt áp AC.",
        docRef: "Dieu khien bao ve HVDC",
        keyPoints: [
          "Ở chế độ bình thường, trạm chỉnh lưu giữ dòng không đổi (CC) và trạm nghịch lưu giữ góc dập tối thiểu (CEA, γ_min), từ đó quyết định điện áp DC.",
          "Dòng đặt của nghịch lưu nhỏ hơn dòng đặt của chỉnh lưu một biên dòng ΔI ≈ 0,1 pu, để hai bộ điều khiển dòng không tranh chấp nhau.",
          "Khi điện áp AC phía chỉnh lưu sụt mạnh, chỉnh lưu chạm α_min và nghịch lưu tự động chuyển sang giữ dòng. Dòng DC giảm đúng bằng ΔI.",
          "Khi điện áp DC giảm sâu, VDCOL hạ dòng đặt để giảm nhu cầu công suất phản kháng và giúp hệ thống phục hồi.",
        ],
        labLink: { href: "#vi-curve", label: "Mở đặc tính V-I tương tác" },
      },
      {
        id: "3.2",
        title: "Bài 3.2: Hệ thống Bảo vệ Trạm & Đường dây DC",
        description:
          "Bảo vệ vi sai dòng cực DC (87DCL), bảo vệ sóng truyền sự cố (Traveling Wave), bảo vệ chống sét đánh van, triệt tiêu hiện tượng dao động cộng hưởng dưới đồng bộ (SSR).",
        docRef: "Dieu khien bao ve HVDC (EVNNPT)",
        keyPoints: [
          "Bảo vệ quá dòng van và bảo vệ vi sai cực DC so sánh dòng điện ở hai đầu cực hoặc hai đầu vùng bảo vệ.",
          "Bảo vệ sóng truyền phát hiện sự cố đường dây DC trong vài ms dựa vào biên độ và độ dốc của sóng điện áp/dòng điện lan truyền.",
          "Khi có sự cố đường dây DC, chỉnh lưu được đẩy sang chế độ nghịch lưu (retard α) để dập hồ quang, sau đó khởi động lại.",
          "SSR là dao động trục tổ máy phát gần trạm, bị kích thích bởi bộ điều khiển dòng. Hiện tượng này được giảm bằng bộ điều khiển phụ (SSDC).",
        ],
      },
    ],
  },
  {
    level: 4,
    code: "LV4-SPECIALIST",
    title: "Cấp độ 4: Thực Hành & Vận Hành Trạm Thực Tế",
    subtitle: "Chuyên gia - Khảo sát dự án & Xử lý sự cố",
    description:
      "Áp dụng vào thực tiễn lưới truyền tải điện Việt Nam: quy trình vận hành chuyển nấc MBA đổi nối (OLTC), xử lý sự cố trong vận hành và phân tích dự án thực tế.",
    badge: "Chuyên gia (Specialist)",
    iconName: "Award",
    lessonsCount: 2,
    durationHours: 18,
    topics: [
      {
        id: "4.1",
        title: "Bài 4.1: Quy trình Vận hành Chuyển nấc Máy biến áp & Đóng cắt",
        description:
          "Quy trình phối hợp OLTC duy trì góc kích α trong vùng tối ưu 13°-18°, thứ tự hòa lưới và cách ly phân đoạn trạm.",
        docRef: "Bai giang HVDC - EVNNPT",
        keyPoints: [
          "Bộ điều khiển van tác động nhanh (vài ms) qua góc α. OLTC tác động chậm (vài giây mỗi nấc) để đưa α trở về vùng định mức 13°-18°.",
          "Nếu α lớn kéo dài, công suất phản kháng tiêu thụ tăng (Q ≈ P·tan φ) và tổn thất van tăng. OLTC sẽ hạ nấc để giảm điện áp van.",
          "Thứ tự khởi động thường là: đóng bộ lọc AC, nạp MBA đổi nối, giải phóng xung kích (deblock), tăng dòng theo dốc, rồi đóng thêm bộ lọc theo công suất.",
        ],
        formula: "Q ≈ P·tan φ ; cos φ ≈ [cos α + cos(α+μ)]/2",
        formulaTex: String.raw`Q \approx P\tan\varphi, \qquad \cos\varphi \approx \frac{\cos\alpha + \cos(\alpha+\mu)}{2}`,
      },
      {
        id: "4.2",
        title: "Bài 4.2: Case Study Dự án Thực tế & Mô phỏng Sự cố",
        description:
          "Phân tích kịch bản sự cố mất chuyển mạch liên tiếp (Repetitive Commutation Failure), đứt cực đường dây DC, giải pháp sa thải phụ tải tự động và bài học vận hành trạm từ tài liệu Trạm 220kV Thái Nguyên.",
        docRef: "Trình chiếu giới thiệu Trạm 220kV Thái Nguyên",
        keyPoints: [
          "Thất bại chuyển mạch liên tiếp thường xảy ra khi điện áp lưới phía nhận sụt sâu. Cần phối hợp tăng γ đặt, VDCOL và bù phản kháng nhanh để xử lý.",
          "Khi mất một cực trong hệ thống Bipolar, cực còn lại chuyển sang đơn cực hoàn lưu đất hoặc kim loại và có thể tạm thời quá tải.",
          "Tài liệu Trạm 220kV Thái Nguyên dùng để tham chiếu quy trình thao tác và tổ chức vận hành trạm. Các kịch bản sự cố HVDC trong bài là tình huống mô phỏng phục vụ đào tạo.",
        ],
        labLink: { href: "#vi-curve", label: "Mô phỏng sụt áp AC trên đặc tính V-I" },
      },
    ],
  },
];

export const ALL_LESSONS = CURRICULUM_LEVELS.flatMap((level) =>
  level.topics.map((topic) => ({ ...topic, level: level.level }))
);
