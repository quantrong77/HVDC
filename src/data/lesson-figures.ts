/**
 * Hình minh họa cho Cấp độ 0, hiện ở khung bên phải trang bài học.
 * Hai nguồn:
 * - Hình vẽ của Giáo trình Điện tử công suất ứng dụng trong HVDC v1.1 (docs/hinh/, chép vào public/level0/gt/),
 *   tiếng Việt, đúng ký hiệu và số liệu của bài; đặt trước.
 * - Ảnh thiết bị thật và vài sơ đồ bổ sung từ Wikimedia Commons với giấy phép mở (CC BY, CC BY-SA, public domain),
 *   ghi tác giả, giấy phép và link trang gốc như giấy phép yêu cầu. Không dùng hình chụp từ sách, bài báo có bản quyền.
 */

export type FigureLicense = "Giáo trình khóa học" | "CC BY 3.0" | "CC BY-SA 3.0" | "CC BY-SA 4.0" | "Public domain";

export const LICENSE_URL: Record<FigureLicense, string | null> = {
  "Giáo trình khóa học": null,
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "Public domain": null,
};

export interface LessonFigure {
  file: string; // trong public/<dir>/
  dir?: string; // thư mục trong public/, mặc định "level0"
  title: string;
  caption: string;
  author: string;
  license: FigureLicense;
  commons?: string; // tên file trên Wikimedia Commons (ảnh ngoài giáo trình)
  photo?: boolean; // ảnh chụp thiết bị thật (không cần nền trắng)
}

export const commonsUrl = (name: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name.replace(/ /g, "_"))}`;

const GT = "Giáo trình ĐTCS ứng dụng trong HVDC";
/** Hình của giáo trình: số hình giữ đúng như trong giáo trình để học viên đối chiếu */
const gt = (file: string, fig: string, title: string, caption: string): LessonFigure => ({
  file: `gt/${file}`,
  title: `${fig}. ${title}`,
  caption,
  author: `${GT}, ${fig}`,
  license: "Giáo trình khóa học",
});

const CLAMPOWER = "Clampower";
const BUTTAY = "Cyril Buttay";

/* Ảnh Wikimedia Commons dùng ở nhiều bài */
const HENDAY: LessonFigure = {
  file: "henday-station.jpg",
  title: "Trạm chuyển đổi Henday (Manitoba, Canada)",
  caption: "Đầu phía bắc của liên kết Bipole II. Sân AC với các bộ lọc và tụ bù chiếm diện tích lớn: đó là lượng công suất phản kháng khoảng 50–60 % P mà trạm LCC tiêu thụ.",
  author: "Jasonbook99",
  license: "CC BY-SA 3.0",
  commons: "Henday-Converter-Station.JPG",
  photo: true,
};
const CONVERTER_TRANSFORMER: LessonFigure = {
  file: "converter-transformer.jpg",
  title: "MBA chuyển đổi một pha ba cuộn dây (La Grande, Québec)",
  caption: "Sứ dài bên trái là đầu cuộn phía van, xuyên qua tường vào nhà van; sứ thẳng đứng là đầu cuộn phía lưới. Một máy có cả cuộn Y và Δ phía van để cấp cho cầu 12 xung; điện kháng tản của nó chính là Xc.",
  author: "Khayman",
  license: "CC BY-SA 3.0",
  commons: "Transformateur du complexe La Grande.jpg",
  photo: true,
};
const MANITOBA_VALVE: LessonFigure = {
  file: "manitoba-valve.jpg",
  title: "Van thyristor 250 kV, 2000 A (Henday, Manitoba Hydro)",
  caption: "Một van là hàng chục cấp thyristor nối tiếp xếp thành nhiều module. Nhờ cấp dự phòng và đặc tính hỏng ngắn mạch, van vẫn chạy khi vài cấp hỏng.",
  author: "Wtshymanski",
  license: "Public domain",
  commons: "Manitoba Hydro-BipoleII Valve.jpg",
  photo: true,
};
const NELSON_MODULE: LessonFigure = {
  file: "nelson-thyristor-module.jpg",
  title: "Module thyristor của Nelson River Bipole (Canada)",
  caption: "Các đĩa trắng phía sau là thyristor vỏ ép, kẹp giữa các tản nhiệt; ống nhựa trong dẫn nước làm mát. Module định mức 2000 A, gồm cả tụ của mạch snubber.",
  author: "Wtshymanski",
  license: "Public domain",
  commons: "Nelson Bipole Thyristors.jpg",
  photo: true,
};

export const LESSON_FIGURES: Record<string, LessonFigure[]> = {
  "0.1": [
    gt("h2-1-tiep-giap-pn-pin.svg", "Hình 2.1", "Tiếp giáp p-n và cấu trúc p-i-n", "a) Tiếp giáp p-n với vùng nghèo; b) cấu trúc p-i-n: lớp n⁻ dày quyết định điện áp chịu được. Đây là gốc của đánh đổi giữa điện áp chịu đựng và tốc độ đóng cắt."),
    {
      file: "hvdc-bipolar.svg",
      title: "Liên kết HVDC lưỡng cực",
      caption: "Hai lưới AC (3 pha) nối với nhau qua trạm chỉnh lưu, đường dây DC hai cực và trạm nghịch lưu. Mỗi trạm chuyển đổi chính là các bộ biến đổi điện tử công suất của Cấp độ 0.",
      author: "Wdwd",
      license: "CC BY 3.0",
      commons: "Hvdc bipolar schematic.svg",
    },
    {
      file: "switches-domain.svg",
      title: "Vùng làm việc của các loại khóa bán dẫn",
      caption: "Theo dòng, điện áp và tần số đóng cắt: thyristor chiếm góc điện áp và dòng lớn ở tần số thấp (van LCC), IGBT ở giữa (van VSC), MOSFET ở tần số cao.",
      author: BUTTAY,
      license: "CC BY-SA 3.0",
      commons: "Switches domain.svg",
    },
    {
      file: "thermal-stack.svg",
      title: "Đường truyền nhiệt từ tiếp giáp ra tản nhiệt",
      caption: "Chip bán dẫn, lớp hàn, đế và tản nhiệt xếp chồng: mỗi lớp là một điện trở nhiệt Rth. Tổn hao P đi qua chuỗi này nên Tj = Ta + P·ΣRth; van HVDC thay tản nhiệt khí bằng nước khử ion.",
      author: BUTTAY,
      license: "CC BY-SA 3.0",
      commons: "Thermal stack.svg",
    },
  ],
  "0.2": [
    gt("h3-1-diode-cau-truc-dac-tinh.svg", "Hình 3.1", "Diode công suất", "a) Cấu trúc p⁺–n⁻–n⁺ và ký hiệu; b) đặc tính V–I với ba vùng: dẫn thuận, khóa ngược và đánh thủng ngược tại VRRM."),
    gt("h3-2-phuc-hoi-nguoc.svg", "Hình 3.2", "Phục hồi ngược", "Dòng chạy ngược tới Irr, điện tích Qrr bị rút ra trong thời gian trr. Quá trình tắt của thyristor giống hệt, nên van HVDC cần mạch snubber RC."),
    gt("h4-1-thyristor-cau-truc.svg", "Hình 4.1", "Thyristor: cấu trúc bốn lớp và ký hiệu", "a) Cấu trúc p-n-p-n với ba tiếp giáp J1, J2, J3; b) ký hiệu. Khi phân cực thuận, J2 phân cực ngược và gánh toàn bộ điện áp khóa."),
    gt("h4-2-mo-hinh-hai-transistor.svg", "Hình 4.2", "Mô hình hai transistor", "Dòng collector của mỗi transistor là dòng base của transistor kia. Khi α1 + α2 tiến tới 1, thyristor tự giữ dẫn và cổng mất quyền điều khiển."),
    gt("h4-3-thyristor-dac-tinh.svg", "Hình 4.3", "Đặc tính V–I của thyristor", "Dòng cổng càng lớn, điện áp mở càng thấp. Thyristor chỉ tắt khi dòng giảm dưới dòng duy trì IH."),
    NELSON_MODULE,
    MANITOBA_VALVE,
    {
      file: "rc-snubber.png",
      title: "Mạch snubber RC",
      caption: "Tụ C nối tiếp điện trở R mắc song song với khóa bán dẫn, hấp thụ quá áp L·di/dt khi linh kiện phục hồi ngược. Mỗi cấp thyristor trong van HVDC đều có một mạch như vậy.",
      author: "Tosaka",
      license: "CC BY 3.0",
      commons: "RC Snubber (Model).PNG",
    },
  ],
  "0.3": [
    gt("h5-1-ky-hieu-linh-kien.svg", "Hình 5.1", "Ký hiệu linh kiện bán dẫn công suất", "Diode, thyristor, GTO, IGCT, MOSFET và IGBT: từ không điều khiển, bán điều khiển đến điều khiển hoàn toàn."),
    gt("h5-2-igbt-cau-truc.svg", "Hình 5.2", "Mặt cắt một cell IGBT", "Cổng MOS tạo kênh n; lớp p⁺ phía collector bơm lỗ trống vào lớp trôi để giảm sụt áp khi dẫn. Lỗ trống còn sót lại khi tắt chính là dòng đuôi."),
    {
      file: "igbt-module.jpg",
      title: "Module IGBT 3300 V, 1200 A (Mitsubishi CM1200HC-66H)",
      caption: "Dạng module có đế cách điện, nhiều chip nối bằng dây bond. Khi hỏng thường thành hở mạch, nên submodule MMC dùng module cần thyristor hoặc tiếp điểm bypass.",
      author: "ArséniureDeGallium",
      license: "CC BY-SA 3.0",
      commons: "IGBT 3300V 1200A Mitsubishi.jpg",
      photo: true,
    },
    {
      file: "gto-cross-section.svg",
      title: "Mặt cắt GTO",
      caption: "Cathode chia thành nhiều dải nhỏ xen kẽ cổng, để dòng cổng âm rút được hạt dẫn ra khỏi toàn bộ tấm silic khi tắt.",
      author: "Arielco",
      license: "Public domain",
      commons: "GTO thyristor cross section.svg",
    },
    {
      file: "igct-cut.svg",
      title: "Mặt cắt IGCT và phân bố pha tạp",
      caption: "Cấu trúc bốn lớp như thyristor, thêm lớp n-buffer. Đồ thị nồng độ pha tạp cho thấy lớp trôi n-base pha tạp rất nhẹ và dày, nơi gánh điện áp khóa.",
      author: "Nlophitis",
      license: "CC BY-SA 4.0",
      commons: "1 GCT cut.svg",
    },
    {
      file: "vdmos-cross-section.svg",
      title: "Mặt cắt MOSFET công suất (VDMOS)",
      caption: "Dòng chạy dọc qua lớp trôi n⁻ chỉ bằng electron (đơn cực), nên điện trở RDS(on) tăng nhanh theo độ dày lớp trôi, tức theo điện áp định mức.",
      author: BUTTAY,
      license: "CC BY-SA 3.0",
      commons: "Vdmos cross section en.svg",
    },
  ],
  "0.4": [
    gt("h6-1-cau-graetz-6-xung.svg", "Hình 6.1", "Cầu Graetz 6 xung", "Cầu ba pha 6 xung dùng thyristor; Lc là điện kháng chuyển mạch, Ld là kháng san bằng. Nhóm V1, V3, V5 nối cực dương, nhóm V4, V6, V2 nối cực âm."),
    gt("h6-2-dang-song-ud-theo-alpha.png", "Hình 6.2", "Dạng sóng ud theo α", "Điện áp một chiều của cầu 6 xung với α = 0°…150° (bỏ qua trùng dẫn). Từ α = 90° trở đi phần âm lấn át: chế độ nghịch lưu."),
    gt("h6-3-ud-theo-alpha.svg", "Hình 6.3", "Ud/Ud0 theo góc kích", "Đường cos α: vùng chỉnh lưu (α < 90°) và nghịch lưu (α > 90°). Id không đổi chiều, chỉ Ud đổi dấu."),
    gt("h6-4-dong-pha-va-pho.svg", "Hình 6.4", "Dòng pha và phổ sóng hài", "a) Dòng pha phía van dạng khối 120°, sóng cơ bản trễ góc α; b) phổ sóng hài In = I1/n với n = 6k ± 1."),
    gt("h7-1-mach-chuyen-mach.svg", "Hình 7.1", "Mạch chuyển mạch", "Mạch tương đương trong khoảng chuyển mạch V5 → V1: dòng ik chạy vòng qua hai điện kháng Lc, làm dòng chuyển dần từ van này sang van kia."),
    gt("h7-2-trung-dan-chinh-luu.svg", "Hình 7.2", "Trùng dẫn khi chỉnh lưu (α = 20°, μ = 22°)", "a) Diện tích điện áp mất đi tạo nên số hạng (3/π)·Xc·Id; b) dòng chuyển dần giữa hai van. So với tab 1 của phòng lab ở cùng α, μ."),
    gt("h7-3-nghich-luu-alpha-beta-gamma.svg", "Hình 7.3", "Các góc α, β, μ, γ khi nghịch lưu", "α = 143°, β = 37°, μ = 20°, γ = 17°: vùng xanh trên điện áp van V1 là góc tắt γ, khoảng áp ngược phải dài hơn tq của thyristor."),
  ],
  "0.5": [
    gt("h8-1-cau-12-xung.svg", "Hình 8.1", "Cầu 12 xung", "Hai cầu 6 xung nối tiếp phía DC, cấp từ MBA Y/Y và Y/Δ lệch pha 30°. Sóng hài bậc 5, 7 của hai cầu ngược pha nên triệt tiêu phía lưới."),
    gt("h8-2-12-xung-va-pho.svg", "Hình 8.2", "Dạng sóng 12 xung và phổ", "a) Điện áp một chiều 12 xung; b) phổ dòng phía lưới của cầu 6 xung và 12 xung: chỉ còn các bậc 12k ± 1."),
    {
      file: "quadrivalve.png",
      title: "Van bốn (quadrivalve)",
      caption: "Bốn van cùng pha của cầu 12 xung xếp chồng thành một khối treo trong nhà van. Mỗi cầu 12 xung có 3 van bốn.",
      author: "Psemdel",
      license: "CC BY-SA 3.0",
      commons: "Quadrivalve.png",
    },
    CONVERTER_TRANSFORMER,
    HENDAY,
  ],
  "0.6": [
    gt("h9-2-so-do-dieu-khien-lcc.svg", "Hình 9.1", "Sơ đồ khối điều khiển cực HVDC LCC", "Giản lược: CC ở chỉnh lưu, CEA kèm CC dự phòng ở nghịch lưu, VDCOL giới hạn dòng đặt, bộ phát xung đồng bộ với lưới."),
    gt("h9-1-dac-tinh-ud-id.svg", "Hình 9.2", "Đặc tính Ud–Id hai trạm", "Điểm A khi vận hành bình thường; điểm B khi điện áp AC chỉnh lưu giảm và nghịch lưu nhận điều khiển dòng, mất đúng ΔId. Tab 2 của phòng lab vẽ lại đặc tính này."),
    gt("h9-3-vdcol.svg", "Hình 9.3", "Đường VDCOL", "Giới hạn dòng đặt theo điện áp một chiều: 1,0 pu khi Ud ≥ 0,7 pu, 0,3 pu khi Ud ≤ 0,3 pu."),
    gt("h10-1-cap-thyristor-van.svg", "Hình 10.1", "Cấu trúc van thyristor HVDC", "Kháng bão hòa, các cấp thyristor nối tiếp với snubber RsCs, điện trở phân áp Rdc, bộ điện tử TE và chống sét van."),
    {
      file: "haywards-valve-hall.jpg",
      title: "Nhà van cực 2 tại Haywards (liên kết Inter-Island, New Zealand)",
      caption: "Các van bốn thyristor treo từ trần, chụp trong đợt cắt điện bảo dưỡng: lúc thí nghiệm định kỳ từng cấp thyristor bằng valve tester.",
      author: "Marshelec",
      license: "CC BY-SA 3.0",
      commons: "Pole 2 Thyristor Valve.jpg",
      photo: true,
    },
    {
      file: "hvdc-monopolar.svg",
      title: "Liên kết đơn cực",
      caption: "Một cực mang toàn bộ dòng. Khi một cực của hệ lưỡng cực sự cố, cực còn lại chạy theo sơ đồ này.",
      author: "Wdwd",
      license: "CC BY 3.0",
      commons: "Hvdc monopolar schematic.svg",
    },
    {
      file: "rosser-terminus.jpg",
      title: "Đầu cuối Nelson River Bipole 1 và 2 tại Rosser",
      caption: "Cột cao là cột đường dây HVDC đi xa; cột hình nón phía sau là cột néo nơi đường dây vào trạm Dorsey. Điểm làm việc của cả liên kết do hai bộ CC/CEA ở hai đầu quyết định.",
      author: "J. Lindsay",
      license: "CC BY-SA 3.0",
      commons: "Nelson River Bipoles 1 and 2 Terminus at Rosser.jpg",
      photo: true,
    },
  ],
  "0.7": [
    gt("h11-1-spwm.svg", "Hình 11.1", "SPWM (ma = 0,8, mf = 15)", "a) So sánh sin – tam giác; b) điện áp nhánh chỉ có hai mức ±Ud/2; c) điện áp dây và sóng cơ bản."),
    gt("h11-2-svpwm-luc-giac.svg", "Hình 11.2", "Lục giác vector không gian", "Vref trong sector 1 được ghép từ V1 trong T1 và V2 trong T2; đường tròn nội tiếp là giới hạn tuyến tính Ud/√3."),
    gt("h11-4-clarke-park.svg", "Hình 11.3", "Clarke và Park", "Ba hệ trục abc, αβ (Clarke) và dq quay (Park): đại lượng xoay chiều thành một chiều trong hệ dq."),
    gt("h11-3-dieu-khien-vector-dq.svg", "Hình 11.4", "Điều khiển vector dòng điện trong hệ dq", "PI cho id và iq, bù tách kênh ωL và bù thuận điện áp lưới; PLL cấp góc θ cho các phép biến đổi."),
    gt("h12-1-vsc-hai-muc.svg", "Hình 12.1", "VSC hai mức ba pha", "Mỗi nhánh hai IGBT kèm diode ngược song song, nối vào tụ DC."),
    gt("h12-2-cau-truc-mmc.svg", "Hình 12.2", "Cấu trúc MMC", "MMC ba pha: 6 nhánh, mỗi nhánh N submodule và cuộn kháng nhánh."),
    gt("h12-3-submodule-hb-fb.svg", "Hình 12.3", "Submodule nửa cầu và cầu đủ", "a) Nửa cầu: ra 0 hoặc +U_SM; b) cầu đủ: thêm −U_SM, chặn được dòng sự cố phía DC."),
    {
      file: "three-pwm-types.svg",
      title: "Ba kiểu căn xung PWM",
      caption: "Căn sườn trước, sườn sau và căn giữa với cùng hệ số làm việc. Căn giữa (đối xứng) cho phổ sóng hài tốt nhất, tương ứng SVPWM 7 đoạn.",
      author: "Cyril Buttay, Krishnavedala",
      license: "CC BY-SA 3.0",
      commons: "Three PWM types.svg",
    },
  ],
  "0.8": [
    {
      file: "hvdc-pylons.jpg",
      title: "Tầng hệ thống: cột đường dây HVDC Baltic Cable (Thụy Điển)",
      caption: "Đường dây một chiều chỉ cần ít dây dẫn và hành lang hẹp hơn đường dây AC cùng công suất.",
      author: "Timberwind",
      license: "CC BY-SA 3.0",
      commons: "HVDCPylons.jpg",
      photo: true,
    },
    { ...HENDAY, title: "Tầng trạm: trạm chuyển đổi Henday", caption: "Sân AC với bộ lọc, MBA chuyển đổi, nhà van và sân DC: các khối của bài toán năm tầng nằm cạnh nhau trên mặt bằng trạm." },
    gt("h8-1-cau-12-xung.svg", "Hình 8.1", "Tầng cầu: cầu 12 xung", "Mỗi cực của ví dụ ±500 kV là một cầu 12 xung; mỗi cầu 6 xung mang 250 kV với V_LL ≈ 209 kV và Xc ≈ 7,9 Ω."),
    { ...CONVERTER_TRANSFORMER, title: "Tầng MBA: MBA chuyển đổi", caption: "Trong ví dụ ±500 kV, 3000 MW, mỗi máy khoảng 890 MVA, phía van khoảng 209 kV, điện kháng tản tương ứng Xc ≈ 7,9 Ω." },
    gt("h10-1-cap-thyristor-van.svg", "Hình 10.1", "Tầng van: cấu trúc van thyristor", "Van của ví dụ chịu điện áp đỉnh khoảng 296 kV, cần ít nhất 35 cấp thyristor 8,5 kV, cộng cấp dự phòng."),
    { ...NELSON_MODULE, title: "Tầng linh kiện: module thyristor", caption: "Thyristor vỏ ép, tản nhiệt nước và tụ snubber: nơi các thông số V_DRM, tq và Tj của linh kiện quyết định giới hạn của cả liên kết." },
  ],
};

export const figuresFor = (lessonId: string) => LESSON_FIGURES[lessonId] ?? [];
