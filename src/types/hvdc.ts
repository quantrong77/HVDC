/**
 * HVDC Platform - TypeScript Data Models & Types
 * Standardized based on EVNNPT Training Curricula
 */

export type HvdcTechnology = "LCC" | "VSC" | "MMC";

export type SystemTopology = "bipolar" | "monopolar-ground" | "monopolar-metallic" | "back-to-back";

export type ConverterMode = "rectifier" | "inverter";

export interface WaveformParams {
  alphaDeg: number;       // Góc kích Alpha (0° - 180°)
  muDeg?: number;         // Góc trùng dẫn mu (độ), mặc định 0
  vLL: number;            // Điện áp dây hiệu dụng phía van V_LL (kV rms)
  frequency: number;      // Tần số hệ thống (Hz, ví dụ 50Hz)
  is12Pulse: boolean;     // Cấu hình 6-pulse hay 12-pulse (2 cầu nối tiếp lệch 30°)
}

export interface WaveformPoint {
  wt: number;             // Góc điện (độ: 0° -> 360°)
  voltage: number;        // Điện áp tức thời DC Vd(t) [kV]
  vdAverage: number;      // Điện áp trung bình DC Vd [kV]
  phaseA?: number;        // Sóng sin pha A
  phaseB?: number;        // Sóng sin pha B
  phaseC?: number;        // Sóng sin pha C
}

export interface ElectricalMetrics {
  vd0: number;            // Điện áp DC lý thuyết không tải (kV)
  vd: number;             // Điện áp DC trung bình có xét α và μ (kV)
  gamma: number;          // Góc dập γ = 180° - (α + μ) (độ)
  powerActive: number;    // Công suất tác dụng P = Vd·Id (MW)
  powerReactive: number;  // Công suất phản kháng tiêu thụ Q = |P|·tan(φ) (MVAr)
  powerFactor: number;    // Hệ số công suất cos(φ) ≈ [cos α + cos(α+μ)] / 2
  rippleFrequency: number;// Tần số gợn sóng DC (Hz)
  rippleFactor: number;   // Hệ số gợn sóng = (Vmax - Vmin) / |Vd| (đỉnh-đỉnh)
  mode: ConverterMode;    // Chế độ: Chỉnh lưu hay Nghịch lưu
}

export interface ViCharacteristicParams {
  rectifierAcPu: number;  // Điện áp lưới AC phía chỉnh lưu (pu)
  inverterAcPu: number;   // Điện áp lưới AC phía nghịch lưu (pu)
  currentOrderPu: number; // Dòng đặt Id_ord (pu)
  marginPu: number;       // Biên dòng ΔI (pu), thường 0.1
}

export type ViControlRegime =
  | "rectifier-cc"        // Chỉnh lưu giữ dòng (CC), nghịch lưu giữ γ_min (CEA) - bình thường
  | "transition"          // Hai đặc tính α_min và CEA cắt nhau giữa vùng biên dòng
  | "inverter-cc"         // Chỉnh lưu chạm α_min, nghịch lưu chuyển sang giữ dòng
  | "collapse";           // Điện áp quá thấp - cần VDCOL / nguy cơ sụp đổ

export interface ViOperatingPoint {
  id: number;
  vd: number;
  regime: ViControlRegime;
}

export interface HvdcEquipment {
  id: string;
  name: string;
  vietnameseName: string;
  category: "transformer" | "converter" | "reactor" | "filter" | "transmission" | "switchgear";
  symbol: string;
  location: "AC Yard" | "Valve Hall" | "DC Yard" | "Transmission Line";
  voltageLevel: string;
  description: string;
  specifications: Record<string, string>;
  nptReference: string;
  roleInSystem: string;
}

export interface QuizQuestion {
  id: string;
  level: 1 | 2 | 3 | 4;
  topic: "Fundamentals" | "LCC" | "VSC" | "Filters" | "Protection";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  evnReference: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, number>;
  isSubmitted: boolean;
  score: number;
  showExplanation: boolean;
}

export interface LessonDetail {
  id: string;             // Ví dụ "1.1"
  title: string;
  description: string;
  docRef: string;
  keyPoints: string[];
  formula?: string;       // Công thức trọng tâm dạng văn bản thuần (dùng cho tìm kiếm, trợ lý)
  formulaTex?: string;    // Cùng công thức dạng LaTeX, render bằng KaTeX
  labLink?: { href: string; label: string };
}

export interface LearningLevel {
  level: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  iconName: string;
  lessonsCount: number;
  durationHours: number;
  topics: LessonDetail[];
}
