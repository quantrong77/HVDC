import { LearningLevel } from "@/types/hvdc";

/**
 * Khung chương trình theo tài liệu đào tạo EVNNPT (docs/hvdc-webapp-specification.md, mục II).
 * Cấp độ 0 là phần nền tảng điện tử công suất, theo Giáo trình Điện tử công suất ứng dụng trong HVDC
 * (docs/giao-trinh-dien-tu-cong-suat-hvdc.md); phần thực hành nằm ở phòng lab "Góc kích và điều chế".
 */
const GT = "Giáo trình ĐTCS ứng dụng trong HVDC";

export const CURRICULUM_LEVELS: LearningLevel[] = [
  {
    level: 0,
    code: "LV0-PE-BASICS",
    title: "Cấp độ 0: Nền tảng điện tử công suất cho HVDC",
    subtitle: "Cơ bản - Linh kiện bán dẫn, góc kích và điều chế",
    description:
      "Học trước Cấp độ 1 nếu chưa vững điện tử công suất: từ tiếp giáp p-n, diode, thyristor, IGBT đến chỉnh lưu có điều khiển, các góc α, β, γ, μ, điều khiển LCC, PWM, điều khiển vector và MMC. Mỗi bài có bài thực hành trên phòng lab Góc kích và điều chế, và bài 0.8 ghép tất cả vào một liên kết HVDC hoàn chỉnh.",
    badge: "Nền tảng (Power electronics)",
    iconName: "Gauge",
    lessonsCount: 8,
    durationHours: 24,
    topics: [
      {
        id: "0.1",
        title: "Bài 0.1: Tổng quan điện tử công suất và vật lý bán dẫn",
        description:
          "Linh kiện làm việc ở chế độ khóa, bốn dạng biến đổi, vì sao HVDC cần trạm chuyển đổi, so sánh LCC với VSC; tiếp giáp p-n, cấu trúc p-i-n và đánh đổi giữa điện áp chịu đựng với tốc độ đóng cắt.",
        docRef: `${GT}, Ch. 1–2`,
        keyPoints: [
          "Điện tử công suất biến đổi năng lượng bằng linh kiện bán dẫn làm việc ở chế độ khóa. Linh kiện chỉ ở hai trạng thái: dẫn (sụt áp nhỏ) hoặc khóa (dòng rò nhỏ). Nhờ vậy tổn hao thấp và hiệu suất bộ biến đổi thường đạt 98–99,5%.",
          "Có bốn dạng biến đổi: chỉnh lưu AC→DC, nghịch lưu DC→AC, DC–DC và AC–AC. Một liên kết HVDC gồm trạm chỉnh lưu ở đầu gửi và trạm nghịch lưu ở đầu nhận.",
          "LCC dùng thyristor, chỉ điều khiển được lúc mở. LCC chuyển mạch nhờ điện áp lưới và tiêu thụ công suất phản kháng khoảng 50–60% P.",
          "VSC dùng IGBT hoặc IGCT, điều khiển được cả lúc mở lẫn lúc tắt. VSC điều khiển P và Q độc lập và làm việc được với lưới yếu.",
          "Để chịu điện áp cao, linh kiện cần lớp trôi n⁻ dày: với Si, khoảng 10 µm cho mỗi 100 V. Lớp dày tích nhiều điện tích Qrr nên linh kiện tắt chậm. Vì vậy thyristor HVDC 8,5 kV chỉ làm việc ở tần số lưới 50/60 Hz.",
          "Tổn hao làm nóng tiếp giáp: nhiệt độ Tj tăng theo chuỗi điện trở nhiệt từ tiếp giáp ra môi trường. Thyristor Si giới hạn Tj,max khoảng 90–125 °C, nên van HVDC phải làm mát bằng nước khử ion.",
        ],
        formula: "Tj = Ta + P·(Rth(j-c) + Rth(c-h) + Rth(h-a))",
        formulaTex: String.raw`T_j = T_a + P\,\big(R_{th(j-c)} + R_{th(c-h)} + R_{th(h-a)}\big)`,
        labLink: { href: "/simulator#sld", label: "Xem cấu trúc trạm trên sơ đồ đơn tuyến" },
        practice: [
          {
            href: "/simulator#sld",
            title: "Sơ đồ đơn tuyến trạm biến đổi",
            task: "Lần theo dòng năng lượng qua một cực trạm LCC: lưới AC, bộ lọc AC kiêm tụ bù, MBA Y/Y và Y/Δ, cầu 12 xung, kháng san bằng, đường dây DC. Nhấp vào từng thiết bị để xem vai trò.",
          },
        ],
      },
      {
        id: "0.2",
        title: "Bài 0.2: Diode công suất và thyristor",
        description:
          "Đặc tính V–I và phục hồi ngược của diode, cầu Graetz không điều khiển; cấu tạo bốn lớp, mô hình hai transistor, quá trình mở và tắt của thyristor, thời gian tq và nguồn gốc của góc tắt tối thiểu γmin.",
        docRef: `${GT}, Ch. 3–4`,
        keyPoints: [
          "Diode dẫn khi anode dương hơn cathode. Khi chuyển sang khóa, điện tích thiểu số phải được rút ra: dòng chạy ngược tới đỉnh Irr trong thời gian trr. Hiện tượng phục hồi ngược này là lý do van HVDC cần mạch snubber RC.",
          "Cầu Graetz 6 diode cho điện áp trung bình lớn nhất Vd0 = 3√2/π·V_LL ≈ 1,35·V_LL. Đây là điểm xuất phát của mọi công thức chỉnh lưu có điều khiển.",
          "Thyristor gồm bốn lớp p–n–p–n. Theo mô hình hai transistor, khi α1 + α2 tiến tới 1, thyristor tự giữ dẫn và cổng mất quyền điều khiển. Vì vậy thyristor không tắt được bằng cổng.",
          "Ngoài xung cổng, thyristor còn có thể mở nhầm do dv/dt lớn, quá áp break-over hoặc nhiệt độ cao. Lúc mở, di/dt lớn gây quá nhiệt cục bộ, nên van có cuộn kháng bão hòa nối tiếp.",
          "Thyristor chỉ tắt khi dòng về 0 và được đặt áp ngược đủ thời gian tq. Ở trạm nghịch lưu, khoảng áp ngược γ/ω phải lớn hơn tq cộng dự phòng: γ = 15° ở 50 Hz tương ứng 833 µs.",
          "Thyristor HVDC kích bằng điện (ETT) hoặc bằng ánh sáng (LTT), dùng vỏ ép. Khi hỏng, thyristor ngắn mạch chứ không hở mạch, nên van có thyristor dự phòng nối tiếp vẫn làm việc tiếp được.",
        ],
        formula: "I_A = (α2·IG + ICBO1 + ICBO2) / (1 − (α1 + α2)) ; tγ = γ/ω > tq",
        formulaTex: String.raw`I_A = \frac{\alpha_2 I_G + I_{CBO1} + I_{CBO2}}{1 - (\alpha_1 + \alpha_2)}, \qquad t_\gamma = \frac{\gamma}{\omega} > t_q`,
        labLink: { href: "/simulator#firing-wave", label: "Quan sát áp ngược trên van" },
        practice: [
          {
            href: "/simulator#firing-wave",
            title: "Tab 1: Dạng sóng cầu 6/12 xung",
            task: "Bấm “Nghịch lưu γ = γmin” rồi xem đồ thị điện áp trên van V1. Vùng tô là khoảng áp ngược γ mà thyristor dùng để phục hồi khả năng khóa (tq). Giảm γmin xuống 8° để thấy vùng tô hẹp lại.",
          },
        ],
      },
      {
        id: "0.3",
        title: "Bài 0.3: Linh kiện điều khiển hoàn toàn: GTO, IGCT, MOSFET, IGBT",
        description:
          "Linh kiện mở và tắt được theo lệnh là điều kiện để có HVDC VSC. So sánh điện áp, tần số đóng cắt, kiểu đóng gói và vai trò của từng loại trong trạm chuyển đổi, kể cả SiC MOSFET thế hệ mới.",
        docRef: `${GT}, Ch. 5`,
        keyPoints: [
          "GTO tắt bằng dòng cổng âm rất lớn, khoảng 1/3–1/5 dòng anode. GTO cần snubber lớn và chỉ đóng cắt được vài trăm Hz, nên nay hầu như đã được IGCT thay thế.",
          "IGCT chuyển toàn bộ dòng cathode sang cổng trong khoảng 1 µs. IGCT có sụt áp thấp như thyristor, dùng vỏ ép, hỏng ở trạng thái ngắn mạch và đạt mức 4,5–6,5 kV.",
          "Với MOSFET Si, RDS(on) tăng xấp xỉ theo lũy thừa 2,5 của điện áp định mức, nên chỉ dùng tới vài trăm V. SiC MOSFET đạt 1,2–3,3 kV và đang được nghiên cứu cho submodule MMC.",
          "IGBT kết hợp cổng MOS (kích bằng áp, công suất kích nhỏ) với vùng dẫn lưỡng cực. IGBT mở khi kích +15 V và tắt khi kích −10 đến −15 V; VCE(sat) khoảng 2–3,5 V.",
          "Khi tắt, IGBT có dòng đuôi, gây tổn hao tắt.",
          "IGBT dạng module khi hỏng thường thành hở mạch, nên cần thyristor hoặc tiếp điểm bypass. Dạng press-pack khi hỏng thành ngắn mạch ổn định, thích hợp để ghép nối tiếp.",
          "Linh kiện quyết định cấu trúc trạm. Thyristor cho LCC: đơn giản, tổn hao khoảng 0,7% mỗi trạm. IGBT cho VSC/MMC: linh hoạt, tổn hao khoảng 0,8–1% mỗi trạm.",
        ],
        labLink: { href: "/simulator#firing-pwm", label: "Xem IGBT đóng cắt theo PWM" },
        practice: [
          {
            href: "/simulator#firing-pwm",
            title: "Tab 4: PWM và SVPWM",
            task: "Linh kiện điều khiển hoàn toàn cho phép đóng cắt theo PWM. Đổi mf từ 9 lên 45 và quan sát phổ sóng hài dời lên quanh mf·f1, xa tần số cơ bản nên dễ lọc.",
          },
          {
            href: "/simulator#vsc",
            title: "Điều khiển VSC-HVDC",
            task: "Xem lợi ích của IGBT ở cấp hệ thống: hai trạm VSC điều khiển P và Q độc lập, đảo chiều công suất mà không đảo cực điện áp.",
          },
        ],
      },
      {
        id: "0.4",
        title: "Bài 0.4: Chỉnh lưu có điều khiển, trùng dẫn và các góc α, β, γ, μ",
        description:
          "Điểm chuyển mạch tự nhiên, cầu Graetz 6 xung có điều khiển Vd = Vd0·cos α, hệ số công suất; quá trình chuyển mạch qua điện kháng Xc, chế độ nghịch lưu với β, γ và cơ chế sự cố chuyển mạch.",
        docRef: `${GT}, Ch. 6–7`,
        keyPoints: [
          "Điểm chuyển mạch tự nhiên là giao điểm hai điện áp pha, 30° sau khi điện áp pha qua 0. Góc kích α tính từ điểm này đến lúc có xung kích. Van chỉ mở được khi 0 < α < 180°.",
          "Trong cầu 6 xung, mỗi van dẫn 120° và các van được kích cách nhau 60°. Điện áp trung bình Vd = Vd0·cos α: α = 90° cho Vd = 0, còn α > 90° cho Vd âm, tức chế độ nghịch lưu. Id không đổi chiều.",
          "Dòng pha là các khối chữ nhật rộng 120°. Thành phần cơ bản I1 = √6/π·Id ≈ 0,78·Id, trễ sau điện áp một góc xấp xỉ α. Vì bộ biến đổi luôn tiêu thụ Q, HVDC giữ α nhỏ (15–18°) ở trạm chỉnh lưu.",
          "Do điện kháng chuyển mạch Xc, dòng chuyển giữa hai van mất một góc trùng dẫn μ, khoảng 20–25° ở dòng định mức. Trùng dẫn làm Vd giảm một lượng (3/π)·Xc·Id nhưng không tiêu tán công suất.",
          "Ở trạm nghịch lưu dùng β = 180° − α và góc tắt γ = β − μ = 180° − (α + μ), tức khoảng thời gian van vừa tắt còn chịu áp ngược. Nếu γ nhỏ hơn γmin, van dẫn lại và xảy ra sự cố chuyển mạch.",
          "γ giảm khi điện áp AC phía nghịch lưu sụt, khi Id tăng đột ngột, khi điểm qua 0 bị dịch pha do sự cố không đối xứng, hoặc khi dạng sóng bị méo.",
        ],
        formula: "Vd = Vd0·cos α − (3/π)·Xc·Id ; cos(α+μ) = cos α − √2·Xc·Id/V_LL ; γ = 180° − (α + μ)",
        formulaTex: String.raw`V_d = V_{d0}\cos\alpha - \frac{3}{\pi}X_c I_d,\quad \cos(\alpha+\mu) = \cos\alpha - \frac{\sqrt{2}\,X_c I_d}{V_{LL}},\quad \gamma = 180^\circ - (\alpha+\mu)`,
        labLink: { href: "/simulator#firing-wave", label: "Thực hành dạng sóng cầu 6/12 xung" },
        practice: [
          {
            href: "/simulator#firing-wave",
            title: "Tab 1: Dạng sóng cầu 6/12 xung",
            task: "Tăng α từ 0° đến 175° với Id = 3 kA, V_LL = 210 kV, Xc = 8 Ω. Vd đổi dấu tại α ≈ 90°, Vd tích phân dạng sóng trùng công thức, và vùng γ xuất hiện khi α > 90°.",
          },
          {
            href: "/simulator#firing-wave",
            title: "Tab 1: Sự cố chuyển mạch",
            task: "Bấm “Nghịch lưu γ = γmin”, rồi tăng Id từ 3 lên 4,2 kA. μ tăng, γ giảm dưới γmin, rồi xảy ra sự cố chuyển mạch. Đối chiếu với bài tập 2 và 3 trong phần tài liệu bổ sung.",
          },
        ],
      },
      {
        id: "0.5",
        title: "Bài 0.5: Cầu 12 xung, sóng hài và công suất phản kháng",
        description:
          "Ghép hai cầu 6 xung lệch 30° qua MBA Y/Y và Y/Δ, sóng hài đặc trưng phía AC và DC, bộ lọc, công suất phản kháng của bộ biến đổi và tỷ số ngắn mạch của lưới.",
        docRef: `${GT}, Ch. 8`,
        keyPoints: [
          "Hai cầu 6 xung nối tiếp qua MBA Y/Y và Y/Δ lệch 30° tạo thành cầu 12 xung. Điện áp DC gấp đôi. Sóng hài AC bậc 5, 7, 17, 19 của hai cầu ngược pha nhau và triệt tiêu ở cuộn sơ cấp.",
          "Sóng hài đặc trưng của cầu 12 xung là 12k ± 1 phía AC (11, 13, 23, 25…) và 12k phía DC (12, 24…). Mất cân bằng điện áp và sai lệch góc kích sinh thêm sóng hài không đặc trưng.",
          "Bộ lọc AC thông cao kép điều chỉnh tại bậc 11/13 và 24/36, đồng thời là nguồn bù Q. Bộ lọc DC điều chỉnh ở bậc 12, 24. Cuộn kháng san bằng thường 0,1–0,4 H mỗi cực.",
          "Có xét trùng dẫn, cos φ ≈ [cos α + cos(α+μ)]/2. Với α = 15° và μ = 22°, tan φ ≈ 0,53: trạm 1000 MW tiêu thụ khoảng 530 Mvar, phải bù bằng các nhóm bộ lọc và tụ đóng cắt theo tải.",
          "Độ cứng lưới được đánh giá bằng SCR = Sk/Pd và ESCR (đã trừ phần tụ và bộ lọc): ESCR dưới 2 là rất yếu, 2–3 là yếu, trên 3 là mạnh. Lưới yếu làm điện áp dao động theo Id và α, dễ gây sự cố chuyển mạch.",
        ],
        formula: "Vd,12 = 2·Vd0·cos α − 2·(3/π)·Xc·Id ; cos φ ≈ [cos α + cos(α+μ)]/2 ; Q = P·tan φ",
        formulaTex: String.raw`V_{d,12} = 2V_{d0}\cos\alpha - 2\cdot\frac{3}{\pi}X_c I_d, \qquad \cos\varphi \approx \frac{\cos\alpha + \cos(\alpha+\mu)}{2}, \qquad Q = P\tan\varphi`,
        labLink: { href: "/simulator#firing-wave", label: "So sánh cầu 6 xung và 12 xung" },
        practice: [
          {
            href: "/simulator#firing-wave",
            title: "Tab 1: Cầu 6 xung và 12 xung",
            task: "Chuyển giữa cầu 6 xung và 12 xung ở cùng α. Đồ thị Vd 12 xung có 12 đoạn mỗi chu kỳ và gợn nhỏ hơn. Ở α = 15°, đọc tỷ số Q/|P| và so sánh với ví dụ ≈ 0,53.",
          },
          {
            href: "/simulator#waveform",
            title: "Cầu Thyristor LCC: tần số và hệ số gợn",
            task: "So sánh tần số gợn 300 Hz và 600 Hz, cùng hệ số gợn đỉnh-đỉnh, giữa cầu 6 xung và cầu 12 xung.",
          },
        ],
      },
      {
        id: "0.6",
        title: "Bài 0.6: Điều khiển HVDC LCC và van thyristor",
        description:
          "Nguyên tắc chỉnh lưu giữ dòng, nghịch lưu giữ góc tắt; bộ CC, CEA dự đoán, biên dòng ΔId, VDCOL, phát xung EPC, điều khiển nấc MBA; cấu trúc, bảo vệ và thử nghiệm van thyristor theo IEC 60700-1.",
        docRef: `${GT}, Ch. 9–10`,
        keyPoints: [
          "Nguyên tắc vàng của HVDC LCC: trạm chỉnh lưu điều khiển dòng (CC), trạm nghịch lưu điều khiển điện áp qua góc tắt γ (CEA). Điểm làm việc là giao điểm hai đặc tính Vd–Id.",
          "Bộ CC là bộ PI điều chỉnh α theo sai lệch Id,ref − Id, đáp ứng trong 10–20 ms. Vì Id = (Vdr − Vdi)/R với R nhỏ, chỉ vài phần trăm chênh lệch điện áp cũng làm dòng thay đổi rất lớn.",
          "CEA dự đoán tính trước β từ V_LL và Id. Đặc tính CEA dốc xuống nhẹ, nên nhiều hệ thống thay CEA bằng điều khiển điện áp DC ở trạm nghịch lưu.",
          "Dòng đặt của nghịch lưu thấp hơn chỉnh lưu một biên ΔId ≈ 0,1 pu. Khi điện áp AC chỉnh lưu sụt, chỉnh lưu chạm αmin và nghịch lưu tự nhận việc giữ dòng. Hệ thống vẫn ổn định, chỉ mất ΔId.",
          "VDCOL hạ dòng đặt khi Vd thấp, ví dụ từ 1,0 pu khi Vd ≥ 0,7 pu xuống 0,3 pu khi Vd ≤ 0,3 pu. Mục đích là giảm Q, tránh sự cố chuyển mạch liên tiếp và giúp phục hồi êm.",
          "Phát xung kiểu EPC tạo 12 xung cách đều 30°, khóa pha theo lưới. Vòng OLTC chậm đưa α về khoảng 12,5–17,5°.",
          "Một van gồm hàng chục thyristor nối tiếp, kèm snubber và điện trở phân áp, có 2–3% cấp dự phòng. Van được bảo vệ bằng kích bảo vệ BOD và chống sét ZnO.",
        ],
        formula: "α_order = α0 − (Kp·e + Ki·∫e dt) ; β_order = arccos(cos γref − √2·Xc·Id/V_LL)",
        formulaTex: String.raw`\alpha_{order} = \alpha_0 - \left(K_p e + K_i\!\int e\,dt\right),\qquad \beta_{order} = \arccos\!\left(\cos\gamma_{ref} - \frac{\sqrt{2}\,X_c I_d}{V_{LL}}\right)`,
        labLink: { href: "/simulator#firing-char", label: "Thực hành đặc tính Vd–Id" },
        practice: [
          {
            href: "/simulator#firing-char",
            title: "Tab 2: Đặc tính Vd–Id",
            task: "Giảm điện áp AC chỉnh lưu từ 1,0 xuống 0,85 pu, sau đó giảm điện áp nghịch lưu. Điểm làm việc chuyển từ CC chỉnh lưu sang CC nghịch lưu, và dòng mất đúng bằng ΔId.",
          },
          {
            href: "/simulator#firing-dyn",
            title: "Tab 3: Đáp ứng động CC/CEA",
            task: "Cho sụt áp nghịch lưu 20 % trong 100 ms. Lặp lại khi bật chống sự cố chuyển mạch và khi tắt VDCOL, rồi so sánh số lần sự cố chuyển mạch, Id đỉnh và thời gian phục hồi.",
          },
        ],
      },
      {
        id: "0.7",
        title: "Bài 0.7: PWM, điều khiển vector và HVDC VSC/MMC",
        description:
          "Nguyên lý PWM, SPWM, bơm sóng hài bậc 3, SVPWM và điều chế đa mức; biến đổi Clarke–Park, vòng dòng dq có bù tách kênh, PLL; cấu trúc MMC, submodule và xử lý sự cố DC.",
        docRef: `${GT}, Ch. 11–12`,
        keyPoints: [
          "Nhánh nửa cầu chỉ cho ra +Ud/2 hoặc −Ud/2. Khi đóng cắt nhanh với hệ số làm việc biến thiên hình sin, giá trị trung bình cũng theo hình sin. Sóng hài nằm quanh tần số sóng mang nên dễ lọc.",
          "SPWM tuyến tính khi ma ≤ 1. Bơm thứ tự không (bậc 3 hoặc kiểu SVPWM) nâng giới hạn tuyến tính lên 2/√3 ≈ 1,155, tức thêm 15,5% điện áp.",
          "SVPWM tổng hợp vector đặt từ hai vector tích cực kề nhau (trong T1, T2) và vector không (trong T0). Giới hạn tuyến tính là đường tròn nội tiếp lục giác, bán kính Ud/√3.",
          "MMC chia điện áp thành hàng trăm submodule. Điều chế mức gần nhất (NLM) kèm sắp xếp điện áp tụ giúp mỗi IGBT chỉ đóng cắt khoảng 100–150 Hz, nên tổn hao trạm còn khoảng 1%.",
          "Biến đổi Clarke–Park đưa đại lượng ba pha về hệ dq quay đồng bộ. Khi trục d trùng điện áp lưới, P = 3/2·vd·id và Q = −3/2·vd·iq: id điều khiển P, iq điều khiển Q.",
          "Vòng dòng dq dùng bộ PI kèm bù tách kênh ωL và bù thuận điện áp lưới, chỉnh định theo IMC: Kp = L/τ, Ki = R/τ. Một trạm VSC giữ Udc, trạm kia giữ P, và mỗi trạm tự điều khiển Q.",
          "MMC nửa cầu không chặn được dòng sự cố DC vì dòng đi qua các diode ngược. MMC cầu đủ hoặc MMC lai chặn được, nên phù hợp với đường dây trên không.",
        ],
        formula: "V_LL,1 ≈ 0,612·ma·Ud ; P = 3/2·vd·id ; Q = −3/2·vd·iq ; Kp = L/τ, Ki = R/τ",
        formulaTex: String.raw`V_{LL,1} = \frac{\sqrt{3}}{2\sqrt{2}}m_a U_d \approx 0{,}612\,m_a U_d,\qquad P = \tfrac{3}{2}v_d i_d,\quad Q = -\tfrac{3}{2}v_d i_q`,
        labLink: { href: "/simulator#firing-pwm", label: "Thực hành PWM và SVPWM" },
        practice: [
          {
            href: "/simulator#firing-pwm",
            title: "Tab 4: PWM và SVPWM",
            task: "So sánh SPWM, bơm bậc 3 và SVPWM ở ma = 1,1, rồi đổi mf. Giới hạn tuyến tính là 1 với SPWM và 1,155 với hai phương pháp còn lại; phổ sóng hài dời theo mf.",
          },
          {
            href: "/simulator#firing-vec",
            title: "Tab 5: Điều khiển vector dq",
            task: "Bật và tắt bù tách kênh, rồi đổi τ từ 1 đến 10 ms. Quan sát độ lệch iq khi id đổi, và thời gian tăng xấp xỉ 2,2·τ.",
          },
          {
            href: "/simulator#vsc",
            title: "Điều khiển VSC-HVDC hai đầu",
            task: "Áp dụng ở cấp hệ thống: trạm 1 điều khiển P và Q, trạm 2 giữ Vdc. Đổi P1 và quan sát Vdc lệch thoáng qua rồi về giá trị đặt.",
          },
        ],
      },
      {
        id: "0.8",
        title: "Bài 0.8: Tích hợp: từ linh kiện đến liên kết HVDC hoàn chỉnh",
        description:
          "Ghép kiến thức Cấp độ 0 thành một chuỗi năm tầng: linh kiện, van, cầu 12 xung và MBA, trạm, hệ thống. Ví dụ thiết kế xuyên suốt liên kết ±500 kV, 3000 MW; liên hệ công việc vận hành, thí nghiệm, bảo vệ và định hướng HVDC trong Quy hoạch điện VIII điều chỉnh.",
        docRef: `${GT}; QĐ 768/QĐ-TTg ngày 15/4/2025`,
        keyPoints: [
          "Một liên kết HVDC LCC là năm tầng lồng nhau: linh kiện (thyristor), van (hàng chục cấp nối tiếp), cầu 12 xung cùng MBA Y/Y và Y/Δ, trạm (bộ lọc, kháng san bằng, điều khiển) và hệ thống (đường dây, hai lưới AC). Thông số của mỗi tầng do yêu cầu ở tầng trên quyết định.",
          "Đi từ trên xuống: P và điện áp cực cho ra Id. Id, α và dx cho ra V_LL phía van và Xc của MBA. V_LL cho ra điện áp đỉnh trên van. Chia điện áp đỉnh cho V_DRM của một thyristor được số cấp nối tiếp.",
          "Ví dụ liên kết lưỡng cực ±500 kV, 3000 MW: Id = 3 kA. Mỗi cầu 6 xung có V_LL ≈ 209 kV, Xc ≈ 7,9 Ω, μ ≈ 21°, đúng bằng bài tập 1. Mỗi trạm có 4 MBA khoảng 890 MVA và 24 van, mỗi van tối thiểu 35 cấp thyristor 8,5 kV.",
          "Ràng buộc còn đi ngược từ dưới lên. tq của thyristor đặt ra γmin. γmin cùng Xc quyết định lượng Q tiêu thụ, tức dung lượng bộ lọc. Q và độ cứng lưới (ESCR) quyết định LCC có dùng được tại điểm đấu nối hay phải chọn VSC.",
          "Trong ví dụ trên, SCR phía nhận bằng 3. Sau khi trừ khoảng 1.570 Mvar bộ lọc, ESCR chỉ còn ≈ 2,45, tức lưới yếu: điện áp AC sụt khoảng 18 % là đủ gây sự cố chuyển mạch.",
          "Quy hoạch điện VIII điều chỉnh (QĐ 768/QĐ-TTg ngày 15/4/2025) định hướng xây mới 26.000–36.000 MW trạm chuyển đổi HVDC và 3.500–6.600 km đường dây HVDC giai đoạn 2031–2035, trong đó có tuyến siêu cao áp một chiều nối Trung Trung Bộ, Nam Trung Bộ với Bắc Bộ.",
        ],
        formula: "Id = P_cực/Vd ; V_LL = (Vd/2)/(1,35·(cos α − dx)) ; Xc = dx·Vd0/((3/π)·Id) ; n ≥ √2·V_LL/V_DRM",
        formulaTex: String.raw`I_d = \frac{P/n_p}{V_d},\quad V_{LL} = \frac{V_d/2}{1{,}35\,(\cos\alpha - d_x)},\quad X_c = \frac{d_x V_{d0}}{(3/\pi)\,I_d},\quad n_{thy} \ge \frac{\sqrt{2}\,V_{LL}}{V_{DRM}}`,
        labLink: { href: "/simulator#firing-design", label: "Thiết kế sơ bộ một liên kết LCC" },
        practice: [
          {
            href: "/simulator#firing-design",
            title: "Tab 6: Tích hợp, liên kết LCC",
            task: "Giữ ví dụ chuẩn ±500 kV, 3000 MW và đối chiếu từng tầng với bài tập 1. Sau đó nâng lên ±800 kV và theo dõi Id, tổn hao, V_LL, số cấp thyristor; cuối cùng hạ SCR phía nhận xuống 2 để thấy ESCR và dự trữ chống sự cố chuyển mạch giảm.",
          },
          {
            href: "/simulator#planner",
            title: "Thiết kế sơ bộ tuyến HVDC",
            task: "Với cùng công suất và cự ly, xem công cụ quy hoạch gợi ý cấp điện áp và công nghệ nào, rồi quay lại tab 6 để kiểm tra phương án đó ở cấp van và linh kiện.",
          },
          {
            href: "/simulator#sld",
            title: "Sơ đồ đơn tuyến trạm biến đổi",
            task: "Định vị trên sơ đồ năm tầng vừa tính: van trong nhà van, MBA Y/Y và Y/Δ, bộ lọc AC, kháng san bằng, đường dây DC.",
          },
        ],
      },
    ],
  },
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
