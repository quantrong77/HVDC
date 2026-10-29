/**
 * Video và trang tham khảo bên ngoài cho từng bài, chủ yếu lấy từ các liên kết trong slide
 * “Xây dựng và vận hành hệ thống HVDC” (Nguyễn Hải Hà, PTC3, 2025). Chỉ dẫn liên kết, không nhúng hay sao chép nội dung.
 */

export interface LessonResource {
  kind: "video" | "web";
  title: string; // Tên gốc của video hoặc trang
  url: string;
  publisher: string;
  why: string; // Xem để hiểu điều gì, gắn với nội dung bài
  from: string; // Nơi tài liệu khóa học dẫn liên kết này
}

const SLIDE = (page: number) => `Slide PTC3 tr. ${page}`;

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
  why: "Thông tin công khai về liên kết ±800 kV nhiều đầu cực mà video trạm Agra trong bộ tài liệu khóa học giới thiệu.",
  from: "Video “Multi-terminal ±800 kV 6000 MW HVDC station at Agra” (tài liệu khóa học)",
};

export const LESSON_RESOURCES: Record<string, LessonResource[]> = {
  "0.2": [VALVE, THYRISTOR_MODULE],
  "0.4": [FULL_WAVE, SIX_PULSE],
  "0.5": [TWELVE_PULSE, SIX_PULSE],
  "0.6": [THYRISTOR_MODULE, VALVE],
  "1.1": [HVDC_WORLD, SUNCABLE],
  "1.2": [AGRA, HVDC_WORLD],
  "1.3": [THYRISTOR_MODULE, SIX_PULSE, TWELVE_PULSE],
  "2.1": [VALVE, FULL_WAVE, SIX_PULSE, TWELVE_PULSE],
  "2.3": [TWELVE_PULSE],
  "4.2": [AGRA, MARINUS, HVDC_WORLD],
  "4.3": [MARINUS, THYRISTOR_MODULE],
};

export const resourcesFor = (lessonId: string): LessonResource[] => LESSON_RESOURCES[lessonId] ?? [];
