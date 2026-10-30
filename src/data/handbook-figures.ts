import { LESSON_FIGURES, LessonFigure } from "@/data/lesson-figures";

/**
 * Hình minh họa cho trang Sổ tay, chèn cuối mỗi mục (khóa là neo tiêu đề của mục).
 * Dùng lại hình giáo trình và ảnh Wikimedia đã có ở Cấp độ 0 (public/level0), thêm ảnh thiết bị trạm
 * từ Wikimedia Commons với giấy phép mở trong public/handbook, ghi tác giả, giấy phép và trang gốc.
 */

/** Hình đã có ở Cấp độ 0, đổi chú thích cho đúng ngữ cảnh của sổ tay */
function reuse(file: string, caption: string, title?: string): LessonFigure {
  const f = Object.values(LESSON_FIGURES)
    .flat()
    .find((x) => x.file === file);
  if (!f) throw new Error(`Không tìm thấy hình ${file} trong lesson-figures`);
  return { ...f, caption, ...(title ? { title } : {}) };
}

const commons = (file: string, f: Omit<LessonFigure, "file" | "dir" | "photo">, photo = true): LessonFigure => ({ file, dir: "handbook", photo, ...f });

export const HANDBOOK_FIGURES: Record<string, LessonFigure[]> = {
  "11-hai-cách-chuyển-đổi-ac--dc": [
    reuse(
      "gt/h8-1-cau-12-xung.svg",
      "Phía LCC của sơ đồ trên: hai cầu thyristor 6 xung nối tiếp, cấp từ cuộn Y/Y và Y/Δ lệch 30°. Van chỉ tắt khi lưới AC đảo chiều điện áp, nên lưới phải đủ cứng.",
    ),
    reuse(
      "gt/h12-2-cau-truc-mmc.svg",
      "Phía VSC: mỗi pha có nhánh trên và nhánh dưới gồm nhiều submodule nối tiếp cùng cuộn kháng nhánh. Điện áp DC do tụ trong submodule giữ, không cần lưới để chuyển mạch.",
    ),
  ],
  "12-thyristor-và-igbt": [
    reuse(
      "nelson-thyristor-module.jpg",
      "Thyristor vỏ ép (đĩa trắng) kẹp giữa các tản nhiệt nước: định mức đơn chiếc rất cao, khi hỏng thường thành ngắn mạch nên van chỉ cần thêm cấp dự phòng nối tiếp.",
    ),
    reuse("igbt-module.jpg", "IGBT dạng module: mở và tắt theo điện áp cổng, định mức đơn chiếc thấp hơn thyristor, khi hỏng có thể hở mạch nên submodule cần khóa bypass."),
    reuse("gt/h12-3-submodule-hb-fb.svg", "Submodule nửa cầu và cầu đủ của MMC: mỗi submodule có IGBT, tụ, bypass và bo điều khiển riêng, là đơn vị bảo trì của van VSC."),
  ],
  "13-điều-khiển-công-suất-tác-dụng-và-phản-kháng": [
    reuse(
      "gt/h9-1-dac-tinh-ud-id.svg",
      "Điều khiển P của LCC: chỉnh lưu giữ dòng (CC), nghịch lưu giữ góc tắt (CEA), cách nhau một biên dòng. Q không có trục điều khiển riêng mà đi theo α, γ và dòng.",
    ),
  ],
  "14-sóng-hài": [
    reuse("gt/h8-2-12-xung-va-pho.svg", "Dòng pha của cầu 12 xung và phổ: các bậc 5, 7 triệt tiêu, còn lại 11, 13, 23, 25… mà bộ lọc AC phải hấp thụ."),
    commons(
      "kontek-ac-filter.png",
      {
        title: "Sơ đồ bộ lọc AC của liên kết Kontek (Đan Mạch – Đức)",
        caption: "Ba pha của một nhánh lọc gồm tụ cao áp, cuộn kháng và điện trở giảm chấn, có ghi giá trị linh kiện. Bộ lọc vừa khử sóng hài vừa cấp công suất phản kháng cho trạm LCC.",
        author: "Zonk43",
        license: "Public domain",
        commons: "Kontek AC Filter.gif",
      },
      false,
    ),
  ],
  "16-ví-dụ-ứng-dụng-thực-tế": [
    commons("helwin-platforms.jpg", {
      title: "Giàn chuyển đổi HelWin 1 và 2 (Biển Bắc, Đức)",
      caption: "Trạm VSC đặt trên giàn ngoài khơi gom điện gió đưa về bờ bằng cáp DC. Ứng dụng này gần như chỉ dùng được VSC: lưới phía giàn là lưới thụ động, không có nguồn để chuyển mạch.",
      author: "Ossi Fan",
      license: "CC BY-SA 4.0",
      commons: "HGÜ Offshore Plattform Helwin 1+2.jpg",
    }),
    commons("celilo-station.jpg", {
      title: "Trạm chuyển đổi Celilo, đầu bắc Pacific DC Intertie (Mỹ)",
      caption: "Trạm LCC của tuyến điểm–điểm đi xa giữa hai lưới mạnh, vận hành từ năm 1970 và đã qua nhiều lần cải tạo, nâng cấp van và điều khiển.",
      author: "Tedder",
      license: "CC BY 3.0",
      commons: "Celilo Converter Station in 2009.jpg",
    }),
  ],
  "22-so-sánh-theo-hệ-thống-con": [
    commons("basslink-valve.jpg", {
      title: "Nhà van thyristor Basslink (Siemens, Australia)",
      caption: "Các tháp van treo từ trần, giữa là lối đi cho xe nâng phục vụ thay cấp thyristor. Khả năng tiếp cận van là một tiêu chí bảo trì cần hỏi nhà cung cấp; xem thêm kinh nghiệm vận hành Basslink ở bài 4.3.",
      author: "Minze2810",
      license: "CC BY-SA 4.0",
      commons: "Basslink Thyristor Valve Siemens.jpg",
    }),
    reuse("gt/h10-1-cap-thyristor-van.svg", "Một cấp thyristor của van LCC: thyristor, snubber RC, điện trở phân áp và mạch kích. Đây là các phần tử được kiểm tra khi cắt điện bảo trì định kỳ."),
  ],
  "24-sự-cố-thường-gặp-và-dữ-liệu-độ-tin-cậy": [
    reuse(
      "converter-transformer.jpg",
      "MBA chuyển đổi một pha: theo CIGRE TB 859, hư hỏng MBA chuyển đổi là nguyên nhân lớn nhất gây mất khả dụng cưỡng bức. Sứ xuyên phía van đi vào nhà van là vị trí cần theo dõi.",
    ),
  ],
  "33-máy-biến-áp-chuyển-đổi": [
    commons("celilo-transformer.jpg", {
      title: "Dãy MBA chuyển đổi tại trạm Celilo (2026)",
      caption: "Các MBA chuyển đổi ngoài trời của trạm. Máy một pha thường được chọn để vận chuyển được và để giữ một máy dự phòng tại chỗ, vì thời gian chế tạo, thay thế rất dài.",
      author: "Buddymoench",
      license: "CC BY-SA 4.0",
      commons: "Electrical transformer at Celilo Converter Station (2026).jpg",
    }),
  ],
  "34-van-bán-dẫn": [
    reuse("manitoba-valve.jpg", "Van thyristor 250 kV, 2000 A: hàng chục cấp nối tiếp xếp thành nhiều module, thử nghiệm theo IEC 60700-1 và có cấp dự phòng."),
  ],
  "35-thiết-bị-đóng-cắt-ac-và-dc": [
    commons("buttel-disconnector.jpg", {
      title: "Dao cách ly kiểu pantograph tại trạm chuyển đổi Büttel (Đức)",
      caption: "Dao cách ly trong sân phân phối của trạm VSC nối điện gió ngoài khơi. Thiết bị phía AC theo bộ IEC 62271 thông thường; thiết bị chịu điện áp DC theo IEC TS 62271-5.",
      author: "Zonk43",
      license: "CC BY-SA 3.0",
      commons: "Scherentrenner Stromrichterstation Buttel 23112012.JPG",
    }),
  ],
  "36-cuộn-kháng-bộ-lọc-chống-sét": [
    commons("etzenricht-reactors.jpg", {
      title: "Cuộn kháng san bằng của trạm back-to-back Etzenricht (Đức)",
      caption: "Các khối trụ trắng đặt ngoài trời cạnh nhà van là cuộn kháng san bằng. Điện cảm, dòng DC kèm sóng hài, cách điện với đất và tiếng ồn là các thông số cần kiểm tra theo IEC 60076-6.",
      author: "Timberwind",
      license: "Public domain",
      commons: "Etzenricht Smoothing Reactors August2008.JPG",
    }),
  ],
};

export const handbookFiguresFor = (sectionId: string) => HANDBOOK_FIGURES[sectionId] ?? [];
