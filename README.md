# TorqueCalcs formulas

The engineering formulas behind the free calculators on **[TorqueCalcs](https://torquecalcs.com/)**, written out in one place, with the code that implements them and every worked example from the site turned into a test.

Each calculator page shows its formula, the code clause it follows and a worked example. This repository keeps those pieces open, so anyone can check a result by hand or in code, and so a mistake on either side shows up as a failing test.

- `src/formulas.js`: plain JavaScript functions, no dependencies, units stated on every function.
- `test/worked-examples.test.js`: the published worked examples (inputs, expected result and the page they come from).
- Run the checks with Node.js 18 or later: `npm test`

> These are the textbook and code equations only. Check inputs, limits and the current edition of the governing standard before you rely on a result for design, inspection or purchasing.

## Bolting and mechanical

| Calculator | Formula | Reference |
| --- | --- | --- |
| [Bolt torque calculator](https://torquecalcs.com/bolt-torque-calculator/) | T = K × F × d, preload as a percentage of proof load | ISO 898-1, SAE J429 |
| [Bolt torque K factor (T = KDF)](https://torquecalcs.com/bolt-torque-k-factor/) | K by finish and lubricant; same preload, lower K, lower torque | Short-form torque equation |
| [Bolt torque chart](https://torquecalcs.com/bolt-torque-chart/) | Metric 8.8/10.9/12.9 and SAE Grade 5/8 at 75% of proof load, K 0.20 and 0.15 | ISO 898-1, SAE J429 |
| [Stainless steel bolt torque](https://torquecalcs.com/stainless-steel-bolt-torque/) | F = % × Rp0.2 × As, T = K × F × d | ISO 3506-1 (A2-70, A4-80) |
| [Bolt grades and proof load](https://torquecalcs.com/bolt-grades-proof-load/) | Proof load = proof stress × As | ISO 898-1, SAE J429 |
| [Bolt thread calculator](https://torquecalcs.com/bolt-thread-calculator/) | H = 0.866025 P, d2 = d − 0.649519 P, d3 = d − 1.226869 P, As = π/4 × (d − 0.938194 P)² | ISO 68-1, ISO 898-1, ASME B1.1 |
| [Thread pitch chart](https://torquecalcs.com/thread-pitch-chart/) | Metric coarse and fine, UNC and UNF, tap drills and stress areas | ISO 261, ASME B1.1 |
| [Torque converter](https://torquecalcs.com/torque-converter/) | Exact factors: 1 lbf = 4.4482216152605 N, 1 kgf = 9.80665 N | SI definitions |
| [Beam deflection calculator](https://torquecalcs.com/beam-deflection-calculator/) | I = bh³/12, δ = 5wL⁴/384EI (simply supported, uniform load), span limits such as L/360 | Elastic beam theory |

## Piping

| Calculator | Formula | Reference |
| --- | --- | --- |
| [Pipe wall thickness calculator](https://torquecalcs.com/pipe-wall-thickness-calculator/) | t = PD / 2(SEW + PY), plus allowances, divided by (1 − mill tolerance) | ASME B31.3 304.1.2 |
| [Pipe weight calculator](https://torquecalcs.com/pipe-weight-calculator/) | kg/m = 0.0246615 × (OD − t) × t; lb/ft = 10.69 × (OD − t) × t | Carbon steel, 7.85 g/cm³ |
| [Pipe schedule chart](https://torquecalcs.com/pipe-schedule-chart/) | Bore = OD − 2t, mass = π × t × (OD − t) × density | ASME B36.10M |

## Welding and NDT

| Calculator | Formula | Reference |
| --- | --- | --- |
| [Welding heat input calculator](https://torquecalcs.com/welding-heat-input-calculator/) | HI (kJ/mm) = V × A × 60 / (1000 × travel speed in mm/min), × k for ISO | ASME IX, ISO 15614-1, EN 1011-1 |
| [Carbon equivalent calculator](https://torquecalcs.com/carbon-equivalent-calculator/) | CE (IIW), CET and Pcm; preheat Tp = 697 CET + 160 tanh(d/35) + 62 HD^0.35 + (53 CET − 32) Q − 328 | IIW, EN 1011-2 Method B |
| [Geometric unsharpness calculator](https://torquecalcs.com/geometric-unsharpness-calculator/) | Ug = F × t / d; minimum SOD = F × t / Ug max | ASME V T-274 |

## Quality and production

| Calculator | Formula | Reference |
| --- | --- | --- |
| [AQL calculator](https://torquecalcs.com/aql-calculator/) | Lot size and inspection level give the code letter, then n, Ac and Re, with the arrow rules applied | ANSI/ASQ Z1.4, ISO 2859-1 |
| [AQL reference](https://torquecalcs.com/aql-reference/) | How code letters and arrow rules work, and the common misreadings | ANSI/ASQ Z1.4 |
| [Cp Cpk calculator](https://torquecalcs.com/cp-cpk-calculator/) | Cp = (USL − LSL)/6s, Cpk = min(USL − mean, mean − LSL)/3s, PPM from the normal tail | Process capability |
| [Gauge R&R calculator](https://torquecalcs.com/gauge-rr-calculator/) | ANOVA or Average and Range; %GRR under 10% acceptable, over 30% unacceptable; ndc of 5 or more | AIAG MSA 4th edition |
| [OEE calculator](https://torquecalcs.com/oee-calculator/) | OEE = Availability × Performance × Quality, with every loss in minutes | TPM practice |

The Z1.4 and ISO 2859-1 sampling tables are copyrighted, so they are not reproduced here; the AQL calculator applies them.

## Construction

| Calculator | Formula | Reference |
| --- | --- | --- |
| [Concrete volume calculator](https://torquecalcs.com/concrete-volume-calculator/) | V = L × W × t; round column V = π/4 × D² × h; 1 yd³ = 27 ft³ | Geometry |
| [Concrete mix ratio calculator](https://torquecalcs.com/concrete-mix-ratio-calculator/) | Nominal mixes M5 1:5:10 to M20 1:1.5:3; design mixes from the water-cement ratio | IS 456, ACI 211.1 |
| [Rebar weight calculator](https://torquecalcs.com/rebar-weight-calculator/) | kg/m = π/4 × d² × 7850 / 10⁶, about d²/162 with d in mm | Steel density 7,850 kg/m³ |

All calculators by discipline: [engineering calculators](https://torquecalcs.com/engineering-calculators/) · [mechanical](https://torquecalcs.com/mechanical-calculators/) · [welding](https://torquecalcs.com/welding-calculators/) · [QA](https://torquecalcs.com/qa-calculators/) · [construction](https://torquecalcs.com/construction-calculators/)

## Example

```js
import { boltTorque, stressAreaMetric, heatInput } from './src/formulas.js';

stressAreaMetric(12, 1.75);        // 84.3 mm², M12 coarse
boltTorque(0.20, 110000, 0.020);   // 440 N·m, M20 8.8 at 110 kN, dry
heatInput(24, 110, 140);           // 1.131 kJ/mm, ASME IX arc energy
heatInput(24, 110, 140, 0.8);      // 0.905 kJ/mm, ISO 15614-1 with k = 0.8 (SMAW)
```

## Found an error?

Open an issue with the inputs, the result you expected and the clause it comes from, or use the [contact page](https://torquecalcs.com/contacts/). Corrections are fixed on the site and here together.

## Author

Sajid Pervez is a mechanical, quality and welding engineer and the founder of TorqueCalcs, where he publishes free, code-referenced calculators for bolting, QA sampling, welding and piping. [Author page](https://torquecalcs.com/engineering-calculator-author/) · [LinkedIn](https://www.linkedin.com/in/engr-sajid-pervez-memon-088891416/)

## Licence

MIT. See [LICENSE](LICENSE).
