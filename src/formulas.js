/**
 * Engineering formulas used by the TorqueCalcs calculators (https://torquecalcs.com/).
 * Plain functions, no dependencies. Units are stated on every function; nothing converts silently.
 * These are the textbook and code equations only: always check inputs and limits against the
 * current edition of the governing standard before using a result.
 */

const PI = Math.PI;

// ---------- Bolting ----------

/** Short-form torque equation T = K × F × d. K: nut factor, F: preload in N, d: nominal diameter in m. Returns N·m. */
export function boltTorque(K, F, d) {
  return K * F * d;
}

/** Preload from torque, F = T / (K × d). T in N·m, d in m. Returns N. */
export function preloadFromTorque(T, K, d) {
  return T / (K * d);
}

/** ISO 68-1 basic dimensions of a 60° metric thread from major diameter d and pitch P (both mm). */
export function metricThread(d, P) {
  const H = (Math.sqrt(3) / 2) * P;
  return {
    H,
    pitchDiameter: d - 0.75 * H, // d2 = d − 0.649519 P
    nutMinorDiameter: d - 1.25 * H, // D1 = d − 1.082532 P
    boltMinorDiameter: d - 1.25 * H - H / 6, // d3 = d − 1.226869 P
  };
}

/** Tensile stress area of a metric thread (ISO 898-1), As = π/4 × (d − 0.938194 P)². mm². */
export function stressAreaMetric(d, P) {
  return (PI / 4) * (d - 0.938194 * P) ** 2;
}

/** Tensile stress area of a unified inch thread, As = 0.7854 × (d − 0.9743 / n)². d in inches, n threads per inch. in². */
export function stressAreaInch(d, n) {
  return 0.7854 * (d - 0.9743 / n) ** 2;
}

/** Proof load = proof stress × stress area. MPa × mm² gives N; psi × in² gives lbf. */
export function proofLoad(proofStress, stressArea) {
  return proofStress * stressArea;
}

/** Stainless preload, F = fraction × Rp0.2 × As (ISO 3506-1). Rp0.2 in MPa, As in mm². Returns N. */
export function stainlessPreload(fraction, rp02, stressArea) {
  return fraction * rp02 * stressArea;
}

// ---------- Torque units (exact factors) ----------

const LBF = 4.4482216152605; // N
const FT = 0.3048; // m
const IN = 0.0254; // m
const KGF = 9.80665; // N

/** N·m per one unit. */
export const TORQUE_UNITS = Object.freeze({
  'N·m': 1,
  'N·cm': 0.01,
  'N·mm': 0.001,
  'kN·m': 1000,
  'lbf·ft': LBF * FT,
  'lbf·in': LBF * IN,
  'ozf·in': (LBF / 16) * IN,
  'kgf·m': KGF,
  'kgf·cm': KGF / 100,
});

export function convertTorque(value, from, to) {
  if (!(from in TORQUE_UNITS) || !(to in TORQUE_UNITS)) throw new Error(`Unknown torque unit: ${from} or ${to}`);
  return (value * TORQUE_UNITS[from]) / TORQUE_UNITS[to];
}

// ---------- Welding ----------

/** Arc energy in kJ/mm, V × A × 60 / (1000 × travel speed in mm/min). Multiply by k (thermal efficiency) for ISO/EN heat input. */
export function heatInput(volts, amps, speedMmPerMin, k = 1) {
  return (k * volts * amps * 60) / (1000 * speedMmPerMin);
}

/** Carbon equivalents from a mill certificate (all in wt%). */
export function carbonEquivalents({ C = 0, Mn = 0, Si = 0, Cr = 0, Mo = 0, V = 0, Ni = 0, Cu = 0, B = 0 }) {
  return {
    ceIIW: C + Mn / 6 + (Cr + Mo + V) / 5 + (Ni + Cu) / 15,
    cet: C + (Mn + Mo) / 10 + (Cr + Cu) / 20 + Ni / 40,
    pcm: C + Si / 30 + (Mn + Cu + Cr) / 20 + Ni / 60 + Mo / 15 + V / 10 + 5 * B,
  };
}

/**
 * EN 1011-2 Annex C, Method B preheat (°C):
 * Tp = 697 CET + 160 tanh(d/35) + 62 HD^0.35 + (53 CET − 32) Q − 328.
 * d: plate thickness mm, HD: diffusible hydrogen ml/100 g, Q: heat input kJ/mm.
 */
export function preheatMethodB(cet, d, HD, Q) {
  return 697 * cet + 160 * Math.tanh(d / 35) + 62 * HD ** 0.35 + (53 * cet - 32) * Q - 328;
}

/** Geometric unsharpness Ug = F × t / d (ASME V T-274). F focal spot, t object-to-film, d source-to-object; same length unit. */
export function geometricUnsharpness(F, t, d) {
  return (F * t) / d;
}

/** Minimum source-to-object distance for a Ug limit, d = F × t / Ug. */
export function minimumSOD(F, t, ugMax) {
  return (F * t) / ugMax;
}

// ---------- Piping ----------

/**
 * ASME B31.3 304.1.2 pressure design thickness and the nominal wall it needs.
 * P and S in the same pressure unit, D outside diameter, c allowances (same length unit as D), millTol as a fraction (0.125).
 */
export function pipeWall({ P, D, S, E, W = 1, Y = 0.4, c = 0, millTol = 0.125 }) {
  const t = (P * D) / (2 * (S * E * W + P * Y));
  const tm = t + c;
  return { t, tm, nominal: tm / (1 - millTol), thickWall: t >= D / 6, highPressure: P / (S * E) > 0.385 };
}

/** Carbon steel pipe mass (7.85 g/cm³): kg/m = 0.0246615 × (OD − t) × t, OD and t in mm. */
export function pipeMassMetric(OD, t) {
  return 0.0246615 * (OD - t) * t;
}

/** Carbon steel pipe mass: lb/ft = 10.69 × (OD − t) × t, OD and t in inches. */
export function pipeMassImperial(OD, t) {
  return 10.69 * (OD - t) * t;
}

/** Water inside the bore, kg/m, OD and t in mm. */
export function waterMassMetric(OD, t) {
  const bore = (OD - 2 * t) / 1000;
  return (PI / 4) * bore ** 2 * 1000;
}

// ---------- Construction ----------

/** Rebar nominal mass, kg/m = π/4 × d² × 7850 / 10⁶ (d in mm); the site rule of thumb is d²/162. */
export function rebarMass(d) {
  return ((PI / 4) * d ** 2 * 7850) / 1e6;
}

/** Concrete volume of a slab, footing or wall (any consistent unit). */
export function slabVolume(length, width, thickness) {
  return length * width * thickness;
}

/** Concrete volume of a round column, π/4 × D² × h. */
export function roundColumnVolume(diameter, height) {
  return (PI / 4) * diameter ** 2 * height;
}

/** Second moment of area of a rectangle, I = b h³ / 12. */
export function rectangleI(b, h) {
  return (b * h ** 3) / 12;
}

/**
 * Maximum deflection for the four standard cases. Consistent units (N, mm, N/mm, N/mm² gives mm).
 * w: uniform load per length, W: point load.
 */
export const beamDeflection = Object.freeze({
  simpleUniform: (w, L, E, I) => (5 * w * L ** 4) / (384 * E * I),
  simpleCentrePoint: (W, L, E, I) => (W * L ** 3) / (48 * E * I),
  cantileverUniform: (w, L, E, I) => (w * L ** 4) / (8 * E * I),
  cantileverEndPoint: (W, L, E, I) => (W * L ** 3) / (3 * E * I),
});

// ---------- Quality ----------

/** Standard normal upper-tail probability (Abramowitz and Stegun 7.1.26 via erfc, |error| < 1.5e-7). */
export function normalTail(z) {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const erfc = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) * Math.exp(-x * x);
  return z >= 0 ? erfc / 2 : 1 - erfc / 2;
}

/** Cp, Cpu, Cpl, Cpk and expected PPM. Leave usl or lsl undefined for a one-sided specification. */
export function capability({ usl, lsl, mean, sigma }) {
  const cpu = usl === undefined ? undefined : (usl - mean) / (3 * sigma);
  const cpl = lsl === undefined ? undefined : (mean - lsl) / (3 * sigma);
  const cp = usl !== undefined && lsl !== undefined ? (usl - lsl) / (6 * sigma) : undefined;
  const cpk = Math.min(cpu ?? Infinity, cpl ?? Infinity);
  const ppm = 1e6 * ((cpu === undefined ? 0 : normalTail(3 * cpu)) + (cpl === undefined ? 0 : normalTail(3 * cpl)));
  return { cp, cpu, cpl, cpk, ppm };
}

/** OEE = Availability × Performance × Quality. Times in minutes, ideal cycle time in seconds per piece. */
export function oee({ plannedMin, downtimeMin, idealCycleSec, totalCount, goodCount }) {
  const runMin = plannedMin - downtimeMin;
  const availability = runMin / plannedMin;
  const performance = (idealCycleSec * totalCount) / (runMin * 60);
  const quality = goodCount / totalCount;
  return { availability, performance, quality, oee: availability * performance * quality };
}
