// ─── NTG Table 5: P. vivax CQ + PQ weight-band dosing ────────────────────────
// CQ = Cloroquina 150mg base tabs | PQ = Primaquina 15mg tabs
export const VIVAX_TABLE = [
  { wMin: 6,   wMax: 9,   cqD1: 0.5,  cqD2: 0.5,  cqD3: 0.25, pq: 0.25 },
  { wMin: 10,  wMax: 13,  cqD1: 0.75, cqD2: 0.75, cqD3: 0.5,  pq: 0.5  },
  { wMin: 14,  wMax: 19,  cqD1: 1,    cqD2: 1,    cqD3: 0.5,  pq: 0.5  },
  { wMin: 20,  wMax: 24,  cqD1: 1.5,  cqD2: 1.5,  cqD3: 0.75, pq: 0.75 },
  { wMin: 25,  wMax: 29,  cqD1: 1.5,  cqD2: 1.5,  cqD3: 0.75, pq: 1    },
  { wMin: 30,  wMax: 34,  cqD1: 2,    cqD2: 2,    cqD3: 1,    pq: 1    },
  { wMin: 35,  wMax: 39,  cqD1: 2.5,  cqD2: 2.5,  cqD3: 1.25, pq: 1    },
  { wMin: 40,  wMax: 44,  cqD1: 2.5,  cqD2: 2.5,  cqD3: 1.25, pq: 1.25 },
  { wMin: 45,  wMax: 49,  cqD1: 3,    cqD2: 3,    cqD3: 1.5,  pq: 1.5  },
  { wMin: 50,  wMax: 54,  cqD1: 3.5,  cqD2: 3.5,  cqD3: 1.75, pq: 1.75 },
  { wMin: 55,  wMax: 59,  cqD1: 3.5,  cqD2: 3.5,  cqD3: 1.75, pq: 1.75 },
  { wMin: 60,  wMax: 64,  cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 2    },
  { wMin: 65,  wMax: 69,  cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 2    },
  { wMin: 70,  wMax: 74,  cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 2.25 },
  { wMin: 75,  wMax: 79,  cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 2.5  },
  { wMin: 80,  wMax: 84,  cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 2.75 },
  { wMin: 85,  wMax: 89,  cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 2.75 },
  { wMin: 90,  wMax: 94,  cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 3    },
  { wMin: 95,  wMax: 99,  cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 3    },
  { wMin: 100, wMax: 104, cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 3.25 },
  { wMin: 105, wMax: 109, cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 3.5  },
  { wMin: 110, wMax: 114, cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 3.75 },
  { wMin: 115, wMax: 120, cqD1: 4,    cqD2: 4,    cqD3: 2,    pq: 3.75 },
];

// ─── AS+MQ dosing table (Tables 7–8, NTG) ────────────────────────────────────
// Children tabs: AS25+MQ50mg | Adult tabs: AS100+MQ200mg
export const ASMQ_TABLE = [
  { wMin: 5,  wMax: 9,   asMg: 25,  mqMg: 50,  tabsStr: '1 comp. (AS25+MQ50mg)' },
  { wMin: 10, wMax: 18,  asMg: 50,  mqMg: 100, tabsStr: '2 comp. (AS25+MQ50mg)' },
  { wMin: 19, wMax: 29,  asMg: 100, mqMg: 200, tabsStr: '1 comp. (AS100+MQ200mg)' },
  { wMin: 30, wMax: 49,  asMg: 200, mqMg: 400, tabsStr: '2 comp. (AS100+MQ200mg)' },
  { wMin: 50, wMax: 69,  asMg: 200, mqMg: 400, tabsStr: '2 comp. (AS100+MQ200mg)' },
  { wMin: 70, wMax: 89,  asMg: 200, mqMg: 400, tabsStr: '2 comp. (AS100+MQ200mg)' },
  { wMin: 90, wMax: 120, asMg: 200, mqMg: 400, tabsStr: '2 comp. (AS100+MQ200mg)' },
];

// ─── AL (Artemether-Lumefantrine) dosing table (Tables 9–10) ─────────────────
// Tab 20+120mg, BID × 3 days
export const AL_TABLE = [
  { wMin: 5,  wMax: 15,  alMg: '20+120mg', tabs: 1, tabsStr: '1 comp. (20+120mg) × BID × 3 días' },
  { wMin: 15, wMax: 25,  alMg: '40+240mg', tabs: 2, tabsStr: '2 comp. (20+120mg) × BID × 3 días' },
  { wMin: 25, wMax: 35,  alMg: '60+360mg', tabs: 3, tabsStr: '3 comp. (20+120mg) × BID × 3 días' },
  { wMin: 35, wMax: 120, alMg: '80+480mg', tabs: 4, tabsStr: '4 comp. (20+120mg) × BID × 3 días' },
];

// ─── Tafenoquine dosing ───────────────────────────────────────────────────────
export function getTQDose(weight, ageMonths) {
  if (ageMonths < 24) return null; // < 2 years: not eligible
  if (weight <= 10) return null;   // ≤ 10kg: not eligible
  if (weight <= 20) return { mg: 100, tabsStr: '2 comprimidos amarillos (pTQ 50mg dispersible)', form: 'pTQ 50mg' };
  if (weight <= 35) return { mg: 200, tabsStr: '4 comprimidos amarillos (pTQ 50mg dispersible)', form: 'pTQ 50mg' };
  return { mg: 300, tabsStr: '2 comprimidos rosados (aTQ 150mg)', form: 'aTQ 150mg' };
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────
export function lookupVivax(weight) {
  return VIVAX_TABLE.find(r => weight >= r.wMin && weight <= r.wMax) || null;
}

export function lookupASMQ(weight) {
  return ASMQ_TABLE.find(r => weight >= r.wMin && weight <= r.wMax) || null;
}

export function lookupAL(weight) {
  return AL_TABLE.find(r => weight >= r.wMin && weight <= r.wMax) || null;
}

// ─── PQ single dose (Pf / Pm / Po) ──────────────────────────────────────────
// 0.25 mg/kg single dose · PQ 15mg tab
export function pqSingleDose(weight) {
  const mg = Math.round(0.25 * weight * 10) / 10;
  const tabs = mg / 15;
  return { mg, tabsStr: `${formatTabs(tabs)} de PQ 15mg`, tabs };
}

// ─── PQ weekly supervised (G6PD deficient Pv) ────────────────────────────────
// 0.75 mg/kg per week × 8 weeks · PQ 15mg tab
export function pqWeeklyDose(weight) {
  const mg = Math.round(0.75 * weight * 10) / 10;
  const tabs = mg / 15;
  return { mg, tabsStr: `${formatTabs(tabs)} de PQ 15mg por semana × 8 semanas`, tabs };
}

// ─── Quinine dose (resistance fallback) ──────────────────────────────────────
export function quinineDose(weight) {
  return { mg: Math.round(10 * weight), str: `${Math.round(10 * weight)} mg (10 mg sal/kg) c/8h × 7 días` };
}
export function clindamycinDose(weight) {
  return { mg: Math.round(10 * weight), str: `${Math.round(10 * weight)} mg (10 mg/kg) c/12h × 7 días` };
}

// ─── Format tablet fractions ──────────────────────────────────────────────────
export function formatTabs(n) {
  if (!n && n !== 0) return '—';
  const whole = Math.floor(n);
  const frac = Math.round((n - whole) * 4) / 4; // round to nearest quarter
  const fracMap = { 0.25: '¼', 0.5: '½', 0.75: '¾', 0: '' };
  const fracStr = fracMap[frac] ?? '';
  if (whole === 0) return fracStr ? `${fracStr} comp.` : '0';
  if (!fracStr) return `${whole} comp.`;
  return `${whole}${fracStr} comp.`;
}

// ─── CQ mg/kg doses for HCP display ─────────────────────────────────────────
// D1=D2: 10mg/kg base | D3: 5mg/kg base
export function cqMgFromWeight(weight) {
  return {
    d1: Math.round(10 * weight),
    d2: Math.round(10 * weight),
    d3: Math.round(5 * weight),
  };
}
