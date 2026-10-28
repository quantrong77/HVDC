/**
 * Mô hình tính cho phòng lab "Góc kích và điều chế" (Cấp độ 0), chuyển từ trang mô phỏng đi kèm
 * Giáo trình Điện tử công suất ứng dụng trong HVDC (docs/mo-phong-goc-kich-hvdc.html).
 * Mô hình lý tưởng hóa cho đào tạo, không thay thế phần mềm EMT như PSCAD/EMTDC.
 * Ký hiệu góc theo IEC 60633: α kích trễ, μ trùng dẫn, β = 180° − α, γ = β − μ.
 */

export const DEG = Math.PI / 180;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
export const linspace = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));

/* ---------- 1. Cầu 6/12 xung ---------- */

export interface BridgeParams {
  alpha: number; // độ
  id: number; // kA
  vll: number; // kV, điện áp dây phía van
  xc: number; // Ω
  gammaMin: number; // độ
  pulses: 6 | 12;
}

export interface BridgePoint {
  nb: number; // số cầu 6 xung nối tiếp
  vd0: number; // kV mỗi cầu
  k: number; // √2·Xc·Id/V_LL
  mu: number;
  beta: number;
  gamma: number;
  vd: number; // kV toàn bộ (6 hoặc 12 xung)
  cosPhi: number;
  q: number; // Mvar tiêu thụ
  failed: boolean; // cos(α+μ) < −1: dòng không chuyển hết trước khi áp van đổi dấu
}

export function bridgePoint(p: BridgeParams): BridgePoint {
  const nb = p.pulses === 12 ? 2 : 1;
  const vd0 = ((3 * Math.SQRT2) / Math.PI) * p.vll;
  const k = (Math.SQRT2 * p.xc * p.id) / p.vll;
  const c = Math.cos(p.alpha * DEG) - k;
  const failed = c < -1;
  const mu = failed ? 180 - p.alpha : Math.acos(c) / DEG - p.alpha;
  const beta = 180 - p.alpha;
  const gamma = failed ? 0 : 180 - p.alpha - mu;
  const vd = nb * (vd0 * Math.cos(p.alpha * DEG) - (3 / Math.PI) * p.xc * p.id);
  const a = p.alpha * DEG;
  const am = (p.alpha + mu) * DEG;
  const cosPhi = (Math.cos(a) + Math.cos(am)) / 2;
  // Q của thành phần cơ bản có xét trùng dẫn (Kimbark): Q = Vd0·Id·[2μ + sin2α − sin2(α+μ)] / [4(cosα − cos(α+μ))]
  const q =
    mu > 1e-6
      ? (nb * vd0 * p.id * (2 * mu * DEG + Math.sin(2 * a) - Math.sin(2 * am))) / (4 * (Math.cos(a) - Math.cos(am)))
      : nb * vd0 * p.id * Math.sin(a);
  return { nb, vd0, k, mu, beta, gamma, vd, cosPhi, q, failed };
}

/** Góc α để trạm nghịch lưu làm việc đúng tại γ cho trước (cos β = cos γ − k) */
export function alphaForGamma(gamma: number, p: BridgeParams): number {
  const k = (Math.SQRT2 * p.xc * p.id) / p.vll;
  const cb = Math.cos(gamma * DEG) - k;
  return cb < -1 ? 179 : 180 - Math.acos(cb) / DEG;
}

/**
 * Điện áp hai thanh cái cầu tại góc θ (theo pha A, va = Vm·cos θ).
 * Điểm chuyển mạch tự nhiên của V1 ở θ = −60°; trong μ độ đầu mỗi đoạn, thanh cái bằng trung bình hai pha.
 */
export function bridgeAt(th: number, alpha: number, mu: number, vm: number) {
  const ph = [0, -120, 120];
  const v = (k: number) => vm * Math.cos((th + ph[k]) * DEG);
  const wrap = (x: number) => ((x % 360) + 360) % 360;
  const rail = (start: number) => {
    const f = wrap(th - start);
    const k = Math.floor(f / 120);
    const w = f - 120 * k;
    return w < mu ? (v(k) + v((k + 2) % 3)) / 2 : v(k);
  };
  const up = rail(-60 + alpha);
  const lo = rail(120 + alpha);
  return { up, lo, ud: up - lo, va: v(0), vb: v(1), vc: v(2), fu: wrap(th - (-60 + alpha)), fl: wrap(th - (120 + alpha)) };
}

export interface BridgeWaves {
  th: number[];
  va: number[];
  vb: number[];
  vc: number[];
  up: number[];
  lo: number[];
  ud6: number[];
  ud12: number[];
  vValve: number[]; // điện áp trên van V1
  ia: number[]; // dòng pha A phía van
  vdIntegrated: number; // trung bình số của dạng sóng, để đối chiếu công thức
  vm: number;
}

export function bridgeWaves(p: BridgeParams, r: BridgePoint, n = 1441): BridgeWaves {
  const vm = (Math.SQRT2 * p.vll) / Math.sqrt(3);
  const th = linspace(-90, 450, n);
  const out: BridgeWaves = { th, va: [], vb: [], vc: [], up: [], lo: [], ud6: [], ud12: [], vValve: [], ia: [], vdIntegrated: 0, vm };
  const den = Math.cos(p.alpha * DEG) - Math.cos((p.alpha + r.mu) * DEG);
  const ramp = (x: number) => (r.mu > 0 && den !== 0 ? (Math.cos(p.alpha * DEG) - Math.cos((p.alpha + x) * DEG)) / den : 1);
  const cur = (f: number) => (f < r.mu ? p.id * ramp(f) : f < 120 ? p.id : f < 120 + r.mu ? p.id * (1 - ramp(f - 120)) : 0);
  for (const t of th) {
    const b = bridgeAt(t, p.alpha, r.mu, vm);
    const b2 = bridgeAt(t - 30, p.alpha, r.mu, vm);
    out.va.push(b.va);
    out.vb.push(b.vb);
    out.vc.push(b.vc);
    out.up.push(b.up);
    out.lo.push(b.lo);
    out.ud6.push(b.ud);
    out.ud12.push(b.ud + b2.ud);
    out.vValve.push(b.fu < 120 + r.mu ? 0 : b.va - b.up);
    out.ia.push(cur(b.fu) - cur(b.fl));
  }
  let s = 0;
  for (let i = 0; i < 3600; i++) {
    const t = i / 10;
    const b = bridgeAt(t, p.alpha, r.mu, vm);
    s += r.nb === 2 ? b.ud + bridgeAt(t - 30, p.alpha, r.mu, vm).ud : b.ud;
  }
  out.vdIntegrated = s / 3600;
  return out;
}

/* ---------- 2. Đặc tính Vd–Id hai trạm (pu) ---------- */

export const VI_CONST = { VD0R: 1.17, VD0I: 1.15, RC: 0.092, RL: 0.03 };
const { VD0R, VD0I, RC, RL } = VI_CONST;

/** VDCOL: 1,0 pu khi Vd ≥ 0,7; 0,3 pu khi Vd ≤ 0,3; nội suy tuyến tính ở giữa */
export const vdcolLimit = (u: number) => (u >= 0.7 ? 1 : u <= 0.3 ? 0.3 : 0.3 + ((u - 0.3) / 0.4) * 0.7);

export interface CharParams {
  vacR: number;
  vacI: number;
  idRef: number;
  margin: number;
  alphaMin: number;
  gammaRef: number;
  vdcol: boolean;
}

export type CharMode = "rectifier-cc" | "transition" | "inverter-cc";

export function solveCharacteristic(p: CharParams) {
  const ur = (i: number) => VD0R * p.vacR * Math.cos(p.alphaMin * DEG) - RC * i;
  // Đặc tính nghịch lưu quy về phía chỉnh lưu (cộng sụt áp đường dây)
  const ui = (i: number) => VD0I * p.vacI * Math.cos(p.gammaRef * DEG) - RC * i + RL * i;
  const solve = (io: number): { i: number; u: number; mode: CharMode } => {
    const ii = io - p.margin;
    if (ur(io) >= ui(io)) return { i: io, u: ui(io), mode: "rectifier-cc" };
    const is = (VD0R * p.vacR * Math.cos(p.alphaMin * DEG) - VD0I * p.vacI * Math.cos(p.gammaRef * DEG)) / RL;
    if (is >= ii && is <= io) return { i: is, u: ur(is), mode: "transition" };
    return { i: ii, u: Math.max(0, ur(ii)), mode: "inverter-cc" };
  };
  let io = p.idRef;
  let op = solve(io);
  if (p.vdcol) {
    for (let k = 0; k < 60; k++) {
      io = 0.5 * io + 0.5 * Math.min(p.idRef, vdcolLimit(op.u));
      op = solve(io);
    }
  }
  const us = linspace(0, 1.4, 200);
  const rect = { i: [] as number[], u: [] as number[] };
  linspace(0, io, 40).forEach((i) => {
    rect.i.push(i);
    rect.u.push(ur(i));
  });
  us.filter((u) => u <= ur(io))
    .reverse()
    .forEach((u) => {
      rect.i.push(p.vdcol ? Math.min(p.idRef, vdcolLimit(u)) : p.idRef);
      rect.u.push(u);
    });
  const ii = io - p.margin;
  const inv = { i: [] as number[], u: [] as number[] };
  us.filter((u) => u <= ui(ii)).forEach((u) => {
    inv.i.push(p.vdcol ? Math.min(p.idRef, vdcolLimit(u)) - p.margin : ii);
    inv.u.push(u);
  });
  linspace(ii, 1.4, 40).forEach((i) => {
    inv.i.push(i);
    inv.u.push(ui(i));
  });
  const vdcol = { i: us.map((u) => Math.min(1.2, vdcolLimit(u))), u: us };
  const alphaR = op.mode === "rectifier-cc" ? Math.acos(clamp((op.u + RC * op.i) / (VD0R * p.vacR), -1, 1)) / DEG : p.alphaMin;
  const gammaI = op.mode === "inverter-cc" ? Math.acos(clamp((op.u - RL * op.i + RC * op.i) / (VD0I * p.vacI), -1, 1)) / DEG : p.gammaRef;
  return { op, io, rect, inv, vdcol, alphaR, gammaI, vdAtZero: { rect: ur(0), inv: ui(1.36) } };
}

/* ---------- 3. Đáp ứng động CC/CEA (mô hình giá trị trung bình) ---------- */

export type DynScenario = "inv" | "rec" | "step";

export interface DynParams {
  scenario: DynScenario;
  depth: number; // % sụt áp
  durationMs: number;
  kp: number;
  ki: number;
  vdcol: boolean;
  cfPrevention: boolean; // tăng γ khi phát hiện sụt áp
  margin?: number;
}

/** γ thực tế nhỏ hơn ngưỡng này (≈ thời gian phục hồi tq của thyristor) thì ghi nhận sự cố chuyển mạch */
export const GAMMA_CRIT = 7;

export function simulateCcCea(p: DynParams) {
  const dt = 5e-5;
  const T = 0.6;
  const L = 0.008;
  const KX = (2 * RC) / VD0I;
  const margin = p.margin ?? 0.1;
  let id = 1;
  const b0 = Math.acos(Math.cos(17 * DEG) - KX * id);
  const udi0 = VD0I * Math.cos(b0) + RC * id;
  const udr0 = udi0 + RL * id;
  const a0 = Math.acos((udr0 + RC * id) / VD0R);
  let xr = 0;
  let xi = -0.1;
  let uif = 1;
  let udf = udr0;
  let cf = 0;
  let cfCount = 0;
  let cfStart: number | null = null;
  let peakI = 0;
  let minGamma = 99;
  const bands: [number, number][] = [];
  const out = { t: [] as number[], vacR: [] as number[], vacI: [] as number[], id: [] as number[], io: [] as number[], vdr: [] as number[], vdi: [] as number[], alpha: [] as number[], beta: [] as number[], gamma: [] as (number | null)[] };

  for (let n = 0; n * dt <= T; n++) {
    const t = n * dt;
    const on = t >= 0.1 && t < 0.1 + p.durationMs / 1000;
    const ur = p.scenario === "rec" && on ? 1 - p.depth / 100 : 1;
    const ui = p.scenario === "inv" && on ? 1 - p.depth / 100 : 1;
    const iref = p.scenario === "step" ? (t >= 0.1 && t < 0.35 ? 0.6 : 1) : 1;
    uif += ((ui - uif) * dt) / 0.015;
    const io = p.vdcol ? Math.min(iref, vdcolLimit(udf)) : iref;

    // Điều khiển dòng (CC) ở chỉnh lưu: PI chống bão hòa tích phân
    const e = io - id;
    const xrn = xr + p.ki * e * dt;
    let a = a0 - (p.kp * e + xrn);
    if (a < 5 * DEG || a > 160 * DEG) a = clamp(a, 5 * DEG, 160 * DEG);
    else xr = xrn;

    // CEA dự đoán (tính β từ điện áp AC đã lọc) và CC nghịch lưu
    const dg = p.cfPrevention && ui < 0.95 ? Math.min(25, (0.95 - ui) * 120) * DEG : 0;
    const bC = Math.acos(clamp(Math.cos(17 * DEG + dg) - (KX * id) / Math.max(uif, 0.2), -1, 1));
    const ei = io - margin - id;
    xi = clamp(xi + 40 * ei * dt, -0.1, 1.2);
    const b = Math.min(bC + Math.max(0, 1.0 * ei + xi), 100 * DEG);
    const cg = Math.cos(b) + (KX * id) / Math.max(ui, 0.05);
    const g = cg >= 1 ? 0 : Math.acos(cg);
    if (cf <= 0 && g / DEG < GAMMA_CRIT && t > 0.01) {
      cf = 0.01;
      cfCount++;
    }
    const vdr = VD0R * ur * Math.cos(a) - RC * id;
    const vdi = cf > 0 ? 0 : VD0I * ui * Math.cos(g) - RC * id;
    if (cf > 0) {
      if (cfStart === null) cfStart = t;
      cf -= dt;
    } else if (cfStart !== null) {
      bands.push([cfStart, t]);
      cfStart = null;
    }
    id = Math.max(0, id + ((vdr - vdi - RL * id) / L) * dt);
    udf += ((vdr - udf) * dt) / (vdr > udf ? 0.05 : 0.01);
    peakI = Math.max(peakI, id);
    if (t > 0.09) minGamma = Math.min(minGamma, cf > 0 ? 0 : g / DEG);
    if (n % 10 === 0) {
      out.t.push(t * 1000);
      out.vacR.push(ur);
      out.vacI.push(ui);
      out.id.push(id);
      out.io.push(io);
      out.vdr.push(vdr);
      out.vdi.push(vdi);
      out.alpha.push(a / DEG);
      out.beta.push(b / DEG);
      out.gamma.push(cf > 0 ? null : g / DEG);
    }
  }
  if (cfStart !== null) bands.push([cfStart, T]);
  return { ...out, bands, cfCount, peakI, minGamma, alpha0: a0 / DEG, beta0: b0 / DEG };
}

/* ---------- 4. PWM hai mức và SVPWM ---------- */

export type PwmMode = "spwm" | "thi" | "sv";

export function pwmLinearLimit(mode: PwmMode) {
  return mode === "spwm" ? 1 : 2 / Math.sqrt(3);
}

/** Sóng điều chế, sóng mang và điện áp ra một chu kỳ; điện áp tính theo đơn vị Ud */
export function pwmWaves(ma: number, mf: number, mode: PwmMode, n = 8000) {
  const ra: number[] = [];
  const rb: number[] = [];
  const tri: number[] = [];
  const va: number[] = [];
  const vab: number[] = [];
  for (let i = 0; i < n; i++) {
    const th = (2 * Math.PI * i) / n;
    let a = ma * Math.cos(th);
    let b = ma * Math.cos(th - (2 * Math.PI) / 3);
    const c = ma * Math.cos(th + (2 * Math.PI) / 3);
    let z = 0;
    if (mode === "thi") z = (-ma / 6) * Math.cos(3 * th);
    else if (mode === "sv") z = -(Math.max(a, b, c) + Math.min(a, b, c)) / 2;
    a += z;
    b += z;
    const ph = ((mf * i) / n) % 1;
    const cr = 4 * Math.abs(ph - 0.5) - 1;
    const sa = a > cr ? 0.5 : -0.5;
    const sb = b > cr ? 0.5 : -0.5;
    ra.push(a);
    rb.push(b);
    tri.push(cr);
    va.push(sa);
    vab.push(sa - sb);
  }
  return { ra, rb, tri, va, vab };
}

/** Phổ biên độ (đơn vị Ud) bậc 1..H, kèm pha của sóng cơ bản */
export function spectrum(x: number[], hMax: number) {
  const n = x.length;
  const amps: number[] = [];
  let phi = 0;
  for (let h = 1; h <= hMax; h++) {
    let a = 0;
    let b = 0;
    for (let i = 0; i < n; i++) {
      const t = (2 * Math.PI * h * i) / n;
      a += x[i] * Math.cos(t);
      b += x[i] * Math.sin(t);
    }
    amps.push((2 / n) * Math.hypot(a, b));
    if (h === 1) phi = Math.atan2(b, a);
  }
  const thd = (Math.sqrt(amps.slice(1).reduce((s, A) => s + A * A, 0)) / amps[0]) * 100;
  return { amps, phi, thd };
}

/** Thời gian T1, T2, T0 (theo Ts) của SVPWM với |Vref| = ma·Ud/2 tại góc θ (độ) */
export function svTimes(ma: number, thetaDeg: number) {
  const v = ma / 2;
  const sector = Math.floor((((thetaDeg % 360) + 360) % 360) / 60);
  const ts = thetaDeg - 60 * sector;
  let t1 = Math.sqrt(3) * v * Math.sin((60 - ts) * DEG);
  let t2 = Math.sqrt(3) * v * Math.sin(ts * DEG);
  let t0 = 1 - t1 - t2;
  const over = t0 < 0;
  if (over) {
    const s = t1 + t2;
    t1 /= s;
    t2 /= s;
    t0 = 0;
  }
  return { v, sector, thetaInSector: ts, t1, t2, t0, over };
}

/* ---------- 5. Vòng dòng trong hệ dq ---------- */

export interface DqParams {
  x: number; // pu
  tauMs: number;
  decoupling: boolean;
  feedforward: boolean;
}

export function simulateDqCurrent(p: DqParams) {
  const w0 = 2 * Math.PI * 50;
  const R = 0.005;
  const lp = p.x / w0;
  const tau = p.tauMs / 1000;
  const kp = lp / tau;
  const ki = R / tau;
  const dt = 2e-5;
  const T = 0.14;
  const tv = 3e-4;
  const vg = 1;
  let id = 0;
  let iq = 0;
  let xd = 0;
  let xq = 0;
  let vcd = vg;
  let vcq = 0;
  let dev = 0;
  const o = { t: [] as number[], id: [] as number[], iq: [] as number[], idRef: [] as number[], iqRef: [] as number[], p: [] as number[], q: [] as number[], ia: [] as number[], ib: [] as number[], ic: [] as number[] };
  for (let n = 0; n * dt <= T; n++) {
    const t = n * dt;
    const idr = t < 0.01 ? 0 : t < 0.09 ? 1 : 0.5;
    const iqr = t < 0.05 ? 0 : -0.5;
    const ed = idr - id;
    const eq = iqr - iq;
    xd += ki * ed * dt;
    xq += ki * eq * dt;
    const vdS = (p.feedforward ? vg : 0) + kp * ed + xd - (p.decoupling ? p.x * iq : 0);
    const vqS = kp * eq + xq + (p.decoupling ? p.x * id : 0);
    vcd += ((vdS - vcd) * dt) / tv;
    vcq += ((vqS - vcq) * dt) / tv;
    const did = (vcd - vg - R * id + p.x * iq) / lp;
    const diq = (vcq - R * iq - p.x * id) / lp;
    id += did * dt;
    iq += diq * dt;
    if (t > 0.01 && t < 0.05) dev = Math.max(dev, Math.abs(iq - iqr));
    if (n % 5 === 0) {
      const th = w0 * t;
      o.t.push(t * 1000);
      o.id.push(id);
      o.iq.push(iq);
      o.idRef.push(idr);
      o.iqRef.push(iqr);
      o.p.push(vg * id);
      o.q.push(-vg * iq);
      o.ia.push(id * Math.cos(th) - iq * Math.sin(th));
      o.ib.push(id * Math.cos(th - (2 * Math.PI) / 3) - iq * Math.sin(th - (2 * Math.PI) / 3));
      o.ic.push(id * Math.cos(th + (2 * Math.PI) / 3) - iq * Math.sin(th + (2 * Math.PI) / 3));
    }
  }
  let t10: number | null = null;
  let t90: number | null = null;
  for (let i = 0; i < o.t.length; i++) {
    if (o.t[i] < 10) continue;
    if (t10 === null && o.id[i] >= 0.1) t10 = o.t[i];
    if (t90 === null && o.id[i] >= 0.9) {
      t90 = o.t[i];
      break;
    }
  }
  return { ...o, dev, rise: t10 !== null && t90 !== null ? t90 - t10 : null, kp, ki };
}
