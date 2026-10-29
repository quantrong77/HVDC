/**
 * Video và trang tham khảo bên ngoài cho từng bài, lấy từ các liên kết trong slide
 * “Xây dựng và vận hành hệ thống HVDC” (Nguyễn Hải Hà, PTC3, 2025) và bảng thống kê video HVDC (29/10/2026).
 * Chỉ dẫn liên kết, không nhúng hay sao chép nội dung.
 */

export type ResourceLevel = "Cơ bản" | "Trung cấp" | "Nâng cao";

export interface LessonResource {
  kind: "video" | "web";
  title: string; // Tên gốc của video hoặc trang
  url: string;
  publisher: string;
  why: string; // Xem để hiểu điều gì, gắn với nội dung bài
  from: string; // Nơi tài liệu khóa học dẫn liên kết này
  level?: ResourceLevel; // Mức độ theo bảng thống kê video
  date?: string; // Tháng đăng trên YouTube, dạng MM/YYYY
}

const SLIDE = (page: number) => `Slide PTC3 tr. ${page}`;
const STATS = "Thống kê video HVDC (29/10/2026)";

/** Video trong bảng thống kê: kênh, tháng đăng và mức độ theo phân loại của người biên soạn */
const yt = (id: string, title: string, publisher: string, date: string, level: ResourceLevel, why: string): LessonResource => ({
  kind: "video",
  title,
  url: `https://www.youtube.com/watch?v=${id}`,
  publisher,
  why,
  from: STATS,
  level,
  date,
});

const VALVE: LessonResource = {
  kind: "video",
  title: "HVDC Concepts: section 1 - how a valve operates",
  url: "https://www.youtube.com/watch?v=bQii7V7lJ1k",
  publisher: "Transpower New Zealand",
  why: "Van thyristor dẫn khi được kích và chỉ tắt khi dòng về 0: nền tảng của góc kích α và chuyển mạch tự nhiên.",
  from: SLIDE(92),
};

const FULL_WAVE: LessonResource = {
  kind: "video",
  title: "HVDC Concepts: section 2 - full-wave rectifier",
  url: "https://www.youtube.com/watch?v=Ru0f4eSV15M",
  publisher: "Transpower New Zealand",
  why: "Từ một van lên mạch chỉnh lưu toàn sóng, thấy điện áp DC được ghép từ các đoạn sóng sin như thế nào.",
  from: SLIDE(92),
};

const SIX_PULSE: LessonResource = {
  kind: "video",
  title: "HVDC Concepts: section 3 - 6-pulse rectifier",
  url: "https://www.youtube.com/watch?v=WVI8Z7p_rdY",
  publisher: "Transpower New Zealand",
  why: "Thứ tự dẫn của 6 van trong cầu Graetz và đấu nối thực tế với MBA chuyển đổi; xem trước khi làm tab 1 của phòng lab góc kích.",
  from: SLIDE(93),
};

const TWELVE_PULSE: LessonResource = {
  kind: "video",
  title: "Three-Phase 12-Pulse Diode Rectifier",
  url: "https://www.youtube.com/watch?v=7_nyQyPF-0U",
  publisher: "Bingsen Wang",
  why: "Hoạt hình hai cầu 6 xung cấp từ cuộn Y và Δ lệch 30°: sóng hài bậc 5, 7 triệt tiêu, còn lại 12k ± 1.",
  from: SLIDE(96),
};

const THYRISTOR_MODULE: LessonResource = {
  kind: "video",
  title: "HVDC Thyristor module in Bheramara , Kusthia, PGCB",
  url: "https://www.youtube.com/watch?v=15NJi1RYZ-4",
  publisher: "TecH4U",
  why: "Mô-đun thyristor thật trong nhà van của trạm back-to-back Bheramara (Bangladesh): thyristor, mạch giảm chấn, ống nước làm mát, cáp quang kích.",
  from: SLIDE(106),
};

const HVDC_WORLD: LessonResource = {
  kind: "web",
  title: "HVDC World",
  url: "https://hvdcworld.com/",
  publisher: "hvdcworld.com",
  why: "Bản đồ và danh mục các dự án HVDC trên thế giới, dùng để tra nhanh công suất, điện áp, công nghệ của một tuyến.",
  from: SLIDE(12),
};

const SUNCABLE: LessonResource = {
  kind: "web",
  title: "SunCable: Australia–Asia PowerLink",
  url: "https://www.suncable.energy/",
  publisher: "SunCable",
  why: "Dự án truyền điện mặt trời từ Bắc Australia sang Singapore khoảng 4.200 km: ví dụ cho ưu điểm cự ly của HVDC.",
  from: SLIDE(65),
};

const MARINUS: LessonResource = {
  kind: "web",
  title: "Marinus Link",
  url: "https://www.marinuslink.com.au/",
  publisher: "Marinus Link Pty Ltd",
  why: "Trang chính thức của liên kết VSC thứ hai Victoria–Tasmania, tiến độ và thông số mới nhất.",
  from: "Báo cáo chuyến công tác Australia 2025",
};

const AGRA: LessonResource = {
  kind: "web",
  title: "North-East Agra: world's first multi-terminal UHVDC link",
  url: "https://www.hitachienergy.com/news-and-events/customer-stories/north-east-agra",
  publisher: "Hitachi Energy",
  why: "Thông số công khai của liên kết ±800 kV nhiều đầu cực North-East–Agra, xem kèm video tham quan trạm Agra.",
  from: "Video “Multi-terminal ±800 kV 6000 MW HVDC station at Agra” (tài liệu khóa học)",
};

// Video từ bảng thống kê, xếp vào bài theo chương giáo trình mà bảng gắn cho từng video
// (Ch. 1 → 1.1, Ch. 6–7 → 0.4, Ch. 8 → 0.5, Ch. 9–10 → 0.6, Ch. 12 → 0.7 và 2.2)

// Tổng quan, dự án UHVDC và tư liệu lịch sử (Ch. 1)
const CHANGJI_DONE = yt("VZ2KfrP_R3s", "World's highest voltage transmission project completed in China", "CGTN", "04/2018", "Cơ bản", "Hoàn thành tuyến Changji–Guquan ±1.100 kV dài 3.305 km từ Tân Cương về An Huy: cấp điện áp và cự ly cao nhất hiện nay.");
const CHANGJI_START = yt("qGgsVW9fnV0", "China Starts Construction of World's First 1,100kv DC Line", "CCTV Video News Agency", "01/2016", "Cơ bản", "Lễ khởi công tuyến ±1.100 kV đầu tiên Changji–Guquan. Xem cùng video hoàn thành dự án để thấy quy mô một tuyến UHVDC trên 3.000 km.");
const BELO_MONTE = yt("XAvC16weTqs", "The First Overseas Ultra-high Voltage Power Transmission Project of State Grid Put Into Use", "New China TV", "12/2017", "Cơ bản", "Đóng điện giai đoạn 1 tuyến Belo Monte ±800 kV (Brazil): truyền thủy điện Amazon về vùng phụ tải phía Nam.");
const INDIA_UHVDC = yt("DY2v0fQX7-8", "India's ultra high voltage DC power transmission project", "Johnny's Desk", "05/2020", "Cơ bản", "Tổng quan các tuyến HVDC của Ấn Độ, quốc gia có điều kiện địa lý và nhu cầu truyền tải đi xa gần với Việt Nam.");
const CHINA_UHVDC = yt("1CVlbBYl5OU", "Why is China Dominating Ultra High Voltage DC?", "Engineering with Rosie", "05/2024", "Trung cấp", "Vì sao Trung Quốc dẫn đầu UHVDC, so sánh với các nước khác. Phù hợp phần so sánh HVAC và HVDC theo cự ly.");
const INTERTIE_1969 = yt("1BLOqX0Itrk", "Intertie (1969)", "BonnevillePower", "06/2015", "Cơ bản", "Phim tư liệu xây dựng Pacific DC Intertie thập niên 1960, một trong những tuyến HVDC van thủy ngân đầu tiên ở Bắc Mỹ.");

// Liên kết VSC giữa các nước (Ch. 12, bài 2.2)
const VIKING_DONE = yt("B2NoCRFSWPw", "Viking Link: The world's longest subsea and land HVDC interconnector", "National Grid UK", "04/2024", "Cơ bản", "Hoàn thành Viking Link Anh – Đan Mạch, liên kết VSC cáp biển và cáp ngầm dài nhất thế giới.");
const VIKING_BUILD = yt("-Qp1ANbT_GA", "Viking Link: The world's longest electricity interconnector", "National Grid UK", "05/2021", "Cơ bản", "Giới thiệu Viking Link khi đang xây: tuyến cáp, trạm chuyển đổi hai đầu và vai trò trao đổi điện gió.");
const NORTH_SEA_LINK = yt("4Qg268FPSjE", "The North Sea Link - Hitachi", "Hitachi", "03/2022", "Cơ bản", "North Sea Link Anh – Na Uy, 1.400 MW, cáp 720 km: VSC nối thủy điện Na Uy với điện gió Anh.");
const NORDLINK = yt("NxTXKlZgqJU", "NordLink: The green link", "TenneT Netherlands", "09/2016", "Cơ bản", "NordLink Na Uy – Đức, cáp 623 km: trao đổi thủy điện Na Uy và điện gió Đức qua liên kết VSC.");
const PUGALUR = yt("knK7inUJKZ4", "INDIA'S FIRST VSC HVDC PROJECT | 2000 MW Pugalur - Thrissur VSC HVDC", "Technovision Academy", "04/2021", "Trung cấp", "Giới thiệu liên kết VSC đầu tiên của Ấn Độ, 2.000 MW Pugalur–Thrissur. Đối chiếu với bảng so sánh LCC và VSC của bài.");

// Trạm VSC/MMC ngoài khơi và thiết bị (Ch. 12, bài 0.7)
const BORWIN3 = yt("mqmMU8QMkPs", "Borwin3 HVDC Converter Platform", "Drydocks World", "01/2018", "Cơ bản", "Chế tạo giàn chuyển đổi 900 MW cho điện gió ngoài khơi: toàn bộ trạm MMC đặt trên một khối thép.");
const DOLWIN_KAPPA = yt("LajtpdsxRwM", "DolWin kappa converter station installation", "Allseas", "09/2022", "Cơ bản", "Tàu Pioneering Spirit nhấc và đặt giàn chuyển đổi DolWin6 lên chân đế ngoài khơi.");
const DOLWIN3 = yt("U_wk4VxKeyk", "TenneT Project: DolWin3", "TenneT Germany", "03/2025", "Cơ bản", "Lắp đặt và hậu cần cho giàn chuyển đổi DolWin3, nối các trang trại gió Biển Bắc về lưới Đức.");
const VSC_TRANSFORMER = yt("FZFsOfWUW8w", "Rekordtransport av största HVDC VSC transformator från Ludvika till Kina", "Hitachi Energy", "05/2026", "Trung cấp", "Vận chuyển MBA chuyển đổi VSC lớn nhất từ Ludvika (Thụy Điển) sang Trung Quốc. Tiếng Thụy Điển, xem hình ảnh là chính.");

// MBA chuyển đổi và cầu 12 xung (Ch. 8, bài 0.5)
const SIEMENS_1100_P1 = yt("s9IV7SAlGXE", "Siemens presents: The first 1,100 kV HVDC Transformer (Part 1, short version)", "Siemens Knowledge Hub", "01/2018", "Trung cấp", "Giới thiệu MBA chuyển đổi 1.100 kV đầu tiên cho Changji–Guquan. Liên hệ bài: cuộn van chịu điện áp DC chồng lên AC nên cách điện khác MBA lưới thông thường.");
const SIEMENS_1100_P4 = yt("Qt5lRO5qb8M", "Siemens presents: The first 1,100 kV HVDC Transformer (Part 4, short version)", "Siemens Knowledge Hub", "08/2018", "Trung cấp", "Quay tại trạm nhận Guquan (An Huy). Khi xem, nhận diện các MBA một pha Y/Y và Y/Δ cấp cho hai cầu 6 xung của nhóm 12 xung.");
const ITAIPU_SIM = yt("NFqu-2Xz4Bk", "Simulando o Sistema HVDC da Itaipu", "Claudio Santos", "02/2023", "Nâng cao", "Mô phỏng cầu 12 xung giống trạm Furnas của hệ Itaipu ±600 kV. Tiếng Bồ Đào Nha; làm kèm tab 1 phòng lab góc kích.");

// Van thyristor và thử nghiệm (Ch. 10, bài 0.6)
const VALVE_HALL = yt("aNmfG6YhqNI", "Look inside HVDC valve hall", "Electrical L", "04/2025", "Cơ bản", "Hình ảnh bên trong nhà van HVDC. Kênh cá nhân, chưa rõ trạm và nguồn cảnh quay.");
const CELILO = yt("pEL6M27HSVc", "Sparks Fly as BPA Tests New Equipment at Celilo Converter Station", "BonnevillePower", "08/2016", "Trung cấp", "Thử nghiệm thiết bị mới tại trạm Celilo của Pacific DC Intertie. Liên hệ phần thử nghiệm van và thiết bị trạm trước khi đưa vào vận hành.");

// Tham quan trạm nhiều đầu cực (Ch. 1, 10, bài 1.2 và 4.2)
const AGRA_VISIT = yt("ccKw9-FQOqw", "A visit to the World's first multi-terminal ±800 kV 6000 MW HVDC station at Agra", "BHEL_India", "07/2020", "Trung cấp", "Tham quan trạm Agra của liên kết nhiều đầu cực North-East–Agra ±800 kV do BHEL và ABB xây cho POWERGRID.");

export const LESSON_RESOURCES: Record<string, LessonResource[]> = {
  "0.2": [VALVE, THYRISTOR_MODULE],
  "0.4": [VALVE, FULL_WAVE, SIX_PULSE],
  "0.5": [TWELVE_PULSE, SIEMENS_1100_P1, SIEMENS_1100_P4, ITAIPU_SIM, SIX_PULSE],
  "0.6": [THYRISTOR_MODULE, VALVE_HALL, CELILO, VALVE],
  "0.7": [BORWIN3, DOLWIN_KAPPA, DOLWIN3, VSC_TRANSFORMER],
  "1.1": [CHANGJI_DONE, CHANGJI_START, BELO_MONTE, INDIA_UHVDC, CHINA_UHVDC, INTERTIE_1969, HVDC_WORLD, SUNCABLE],
  "1.2": [AGRA_VISIT, AGRA, HVDC_WORLD],
  "1.3": [THYRISTOR_MODULE, VALVE_HALL, SIX_PULSE, TWELVE_PULSE],
  "2.1": [VALVE, FULL_WAVE, SIX_PULSE, TWELVE_PULSE],
  "2.2": [VIKING_DONE, VIKING_BUILD, NORTH_SEA_LINK, NORDLINK, PUGALUR],
  "2.3": [TWELVE_PULSE, ITAIPU_SIM],
  "4.2": [AGRA_VISIT, AGRA, MARINUS, HVDC_WORLD],
  "4.3": [MARINUS, THYRISTOR_MODULE],
};

export const resourcesFor = (lessonId: string): LessonResource[] => LESSON_RESOURCES[lessonId] ?? [];
