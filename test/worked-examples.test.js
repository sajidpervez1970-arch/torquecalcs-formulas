// Every test below is a worked example published on torquecalcs.com; the page is named above each one.
// If a formula here and a page ever disagree, one of them is wrong and gets fixed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as f from '../src/formulas.js';

const near = (actual, expected, tol, label = '') =>
  assert.ok(Math.abs(actual - expected) <= tol, `${label} expected ${expected} ± ${tol}, got ${actual}`);

// /bolt-torque-k-factor/
test('T = KDF: M20 8.8 at 110 kN, dry K 0.20 and moly K 0.12', () => {
  near(f.boltTorque(0.2, 110000, 0.02), 440, 1e-9);
  near(f.boltTorque(0.12, 110000, 0.02), 264, 1e-9);
  near(f.preloadFromTorque(440, 0.2, 0.02), 110000, 1e-6);
});

// /bolt-thread-calculator/
test('Metric thread geometry and stress areas: M12 × 1.75, M16 coarse and fine', () => {
  const m12 = f.metricThread(12, 1.75);
  near(m12.H, 1.516, 0.0005, 'H');
  near(m12.pitchDiameter, 12 - 0.649519 * 1.75, 1e-6, 'd2');
  near(m12.nutMinorDiameter, 12 - 1.082532 * 1.75, 1e-6, 'D1');
  near(m12.boltMinorDiameter, 12 - 1.226869 * 1.75, 1e-6, 'd3');
  near(f.stressAreaMetric(16, 2.0), 156.7, 0.05, 'M16');
  near(f.stressAreaMetric(16, 1.5), 167.2, 0.05, 'M16 × 1.5');
});

// /bolt-grades-proof-load/
test('Proof load: M12 class 8.8 = 48.9 kN; 1/2-13 Grade 5 = 12,062 lbf', () => {
  const as = f.stressAreaMetric(12, 1.75);
  near(as, 84.3, 0.05, 'As M12');
  near(f.proofLoad(580, as) / 1000, 48.9, 0.05, 'kN');
  const asIn = f.stressAreaInch(0.5, 13);
  near(asIn, 0.1419, 0.00005, 'As 1/2-13');
  near(f.proofLoad(85000, asIn), 12062, 5, 'lbf');
});

// /stainless-steel-bolt-torque/
test('Stainless M10 A2-70 at 70% of 450 MPa: 18.3 kN, about 55 N·m dry and 37 N·m lubricated; A4-80 about 73 N·m', () => {
  const as = f.stressAreaMetric(10, 1.5);
  const F = f.stainlessPreload(0.7, 450, as);
  near(F / 1000, 18.3, 0.05, 'preload kN');
  near(f.boltTorque(0.3, F, 0.01), 55, 0.5, 'dry');
  near(f.boltTorque(0.2, F, 0.01), 37, 0.6, 'lubricated');
  near(f.boltTorque(0.3, f.stainlessPreload(0.7, 600, as), 0.01), 73, 0.5, 'A4-80 dry');
});

// /torque-converter/
test('Torque units: 412 N·m = 303.9 lbf·ft; 905 lbf·in = 75.4 lbf·ft = 102.3 N·m; 82 N·m = 8.36 kgf·m', () => {
  near(f.convertTorque(412, 'N·m', 'lbf·ft'), 303.9, 0.05);
  near(f.convertTorque(905, 'lbf·in', 'lbf·ft'), 75.4, 0.05);
  near(f.convertTorque(905, 'lbf·in', 'N·m'), 102.3, 0.05);
  near(f.convertTorque(82, 'N·m', 'kgf·m'), 8.36, 0.005);
  near(f.convertTorque(1, 'lbf·in', 'ozf·in'), 16, 1e-9);
  assert.throws(() => f.convertTorque(1, 'N·m', 'ft·lb'));
});

// /welding-heat-input-calculator/
test('Heat input: 24 V, 110 A, 140 mm/min = 1.131 kJ/mm (28.7 kJ/in); ISO k 0.8 = 0.905 kJ/mm', () => {
  const hi = f.heatInput(24, 110, 140);
  near(hi, 1.131, 0.0005);
  near(hi * 25.4, 28.7, 0.05);
  near(f.heatInput(24, 110, 140, 0.8), 0.905, 0.0005);
});

// /carbon-equivalent-calculator/
test('S355 certificate: CE 0.44, CET 0.33, Pcm 0.27; EN 1011-2 Method B preheat table', () => {
  const ce = f.carbonEquivalents({ C: 0.18, Mn: 1.4, Si: 0.3, Cr: 0.05, Mo: 0.02, V: 0.01, Ni: 0.05, Cu: 0.1 });
  near(ce.ceIIW, 0.44, 0.005);
  near(ce.cet, 0.33, 0.005);
  near(ce.pcm, 0.27, 0.005);
  const up = (d, HD, Q) => Math.ceil(f.preheatMethodB(ce.cet, d, HD, Q));
  assert.equal(up(30, 5, 1.5), 101);
  assert.equal(up(30, 10, 1.5), 131);
  assert.equal(up(30, 15, 1.5), 152);
  assert.equal(up(50, 5, 1.5), 133);
  assert.equal(up(20, 5, 1.5), 73);
  assert.equal(up(30, 5, 1.0), 109);
});

// /geometric-unsharpness-calculator/
test('Ug: 2.5 mm spot, 25 mm plate, 600 mm SOD = 0.104 mm; minimum SOD for 0.508 mm = 123 mm', () => {
  near(f.geometricUnsharpness(2.5, 25, 600), 0.104, 0.0005);
  near(f.minimumSOD(2.5, 25, 0.508), 123, 0.5);
  near(f.geometricUnsharpness(0.12, 6.0, 18), 0.04, 1e-9);
});

// /pipe-wall-thickness-calculator/
test('B31.3: NPS 6, 2.0 MPa, S 137.9, E 1, c 3 mm, 12.5% mill: t 1.213, tm 4.213, nominal 4.82 mm', () => {
  const r = f.pipeWall({ P: 2.0, D: 168.3, S: 137.9, E: 1, c: 3 });
  near(r.t, 1.213, 0.0005);
  near(r.tm, 4.213, 0.0005);
  near(r.nominal, 4.82, 0.005);
  assert.equal(r.thickWall, false);
  assert.equal(r.highPressure, false);
});

// /pipe-weight-calculator/
test('Pipe weight: NPS 6 Sch 40 = 28.26 kg/m steel, 18.65 kg/m water; NPS 4 Sch 40 = 15.00 lb/ft', () => {
  near(f.pipeMassMetric(168.3, 7.11), 28.26, 0.005);
  near(f.waterMassMetric(168.3, 7.11), 18.65, 0.005);
  near(f.pipeMassImperial(4.5, 0.337), 15.0, 0.005);
});

// /rebar-weight-calculator/
test('Rebar: 12 mm bar = 0.888 kg/m (rule of thumb 144 / 162 = 0.889)', () => {
  near(f.rebarMass(12), 0.888, 0.0005);
  near(12 ** 2 / 162, 0.889, 0.0005);
});

// /concrete-volume-calculator/
test('Concrete: 6 × 4 m slab 150 mm + four 300 mm columns 3 m = 4.448 m³, 10,676 kg; 10 × 12 ft × 4 in = 1.48 yd³', () => {
  const v = f.slabVolume(6, 4, 0.15) + 4 * f.roundColumnVolume(0.3, 3);
  near(v, 4.448, 0.0005);
  near(v * 2400, 10676, 1);
  near(f.slabVolume(10, 12, 4 / 12) / 27, 1.48, 0.005);
});

// /beam-deflection-calculator/
test('Beam: 75 × 300 joist, 4.2 m, 2.4 kN/m, E 11 GPa = 5.239 mm; point load at mid-span is 1.6 times worse', () => {
  const I = f.rectangleI(75, 300);
  assert.equal(I, 168750000);
  const uniform = f.beamDeflection.simpleUniform(2.4, 4200, 11000, I);
  near(uniform, 5.239, 0.0005);
  near(f.beamDeflection.simpleCentrePoint(2.4 * 4200, 4200, 11000, I) / uniform, 1.6, 1e-9);
  near(4200 / 360, 11.7, 0.05);
});

// /cp-cpk-calculator/
test('Cpk: 10.0 ± 0.5 mm, mean 10.2, s 0.1: Cp 1.67, Cpk 1.00, about 1,350 PPM', () => {
  const r = f.capability({ usl: 10.5, lsl: 9.5, mean: 10.2, sigma: 0.1 });
  near(r.cp, 1.67, 0.005);
  near(r.cpu, 1.0, 1e-9);
  near(r.cpl, 2.33, 0.005);
  near(r.cpk, 1.0, 1e-9);
  near(r.ppm, 1350, 1);
  near(f.normalTail(4) * 1e6, 32, 0.5); // Cpk 1.33 row: 4 sigma, about 32 PPM
});

// /oee-calculator/
test('OEE: 420 planned min, 47 down, 1.0 s cycle, 19,271 made, 18,848 good = 74.79%', () => {
  const r = f.oee({ plannedMin: 420, downtimeMin: 47, idealCycleSec: 1, totalCount: 19271, goodCount: 18848 });
  near(r.availability * 100, 88.81, 0.005);
  near(r.performance * 100, 86.11, 0.005);
  near(r.quality * 100, 97.8, 0.005);
  near(r.oee * 100, 74.79, 0.005);
});
