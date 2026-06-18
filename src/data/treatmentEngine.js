import { classifyG6PD } from './constants';
import {
  lookupVivax, lookupASMQ, lookupAL, getTQDose,
  pqSingleDose, pqWeeklyDose, quinineDose, clindamycinDose,
  formatTabs, cqMgFromWeight,
} from './dosingTables';

// ─── Entry point ──────────────────────────────────────────────────────────────
export function generateCards(intake) {
  const {
    species, weight, ageMonths, pregnant, lactating,
    g6pdDone, g6pdValue, tqAvailable, role,
  } = intake;

  const w = parseFloat(weight) || 0;
  const am = parseFloat(ageMonths) || 0;

  // Pediatric gate: <6 months OR <5 kg
  if (am < 6 || w < 5) return { type: 'pediatric_referral' };

  const g6pdStatus = g6pdDone ? classifyG6PD(g6pdValue) : 'not_done';

  if (species === 'vivax')      return { type: 'cards', cards: vivaxCards({ w, am, pregnant, lactating, g6pdStatus, tqAvailable, role }) };
  if (species === 'falciparum') return { type: 'cards', cards: falciparumCards({ w, am, pregnant, role }) };
  if (species === 'malariae')   return { type: 'cards', cards: malariaeCards({ w, role }) };
  if (species === 'ovale')      return { type: 'cards', cards: ovaleCards({ w, am, pregnant, lactating, g6pdStatus, role }) };
  if (species === 'mixed')      return { type: 'cards', cards: mixedCards({ w, g6pdStatus, pregnant, role }) };
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cqDrug(w, role) {
  const vx = lookupVivax(w);
  const mg = cqMgFromWeight(w);
  return {
    name: 'Cloroquina',
    dotColor: 'cloroquina',
    daysLabel: 'D1, D2, D3',
    mgKgLabel: '10 / 10 / 5 mg/kg (D1/D2/D3)',
    totalMgLabel: role === 'hcp' ? `${mg.d1} mg / ${mg.d2} mg / ${mg.d3} mg` : null,
    pillCountLabel: vx ? `D1–D2: ${formatTabs(vx.cqD1)} · D3: ${formatTabs(vx.cqD3)}` : '— kg fuera de rango',
    formulation: 'CQ 150mg base/comp.',
    ntsRef: 'Tabla 5',
    ahaWarning: false,
  };
}

function pqDailyDrug(w, role) {
  const vx = lookupVivax(w);
  return {
    name: 'Primaquina diaria',
    dotColor: 'primaquinaDiaria',
    daysLabel: 'D1 – D7',
    mgKgLabel: '0.5 mg/kg/día × 7 días',
    totalMgLabel: role === 'hcp' ? `${Math.round(0.5 * w)} mg/día` : null,
    pillCountLabel: vx ? `${formatTabs(vx.pq)} de PQ 15mg/día × 7 días` : '—',
    formulation: 'PQ 15mg/comp.',
    ntsRef: 'Tabla 5',
    ahaWarning: true,
  };
}

function pqWeeklyDrug(w, role) {
  const dose = pqWeeklyDose(w);
  return {
    name: 'Primaquina semanal supervisada',
    dotColor: 'primaquinaSemanl',
    daysLabel: '1 vez/semana × 8 semanas',
    mgKgLabel: '0.75 mg/kg/semana × 8 semanas',
    totalMgLabel: role === 'hcp' ? `${dose.mg} mg/semana` : null,
    pillCountLabel: dose.tabsStr,
    formulation: 'PQ 15mg/comp.',
    ntsRef: 'Tabla 5',
    ahaWarning: true,
  };
}

function tqDrug(w, am, role) {
  const dose = getTQDose(w, am);
  if (!dose) return null;
  return {
    name: 'Tafenoquina',
    dotColor: 'tafenoquina',
    daysLabel: 'Dosis única D1',
    mgKgLabel: `Dosis fija por peso`,
    totalMgLabel: role === 'hcp' ? `${dose.mg} mg dosis única` : null,
    pillCountLabel: dose.tabsStr,
    formulation: dose.form,
    ntsRef: null,
    ahaWarning: true,
    tqConsideraciones: true,
  };
}

function asmqDrug(w, role) {
  const row = lookupASMQ(w);
  return {
    name: 'Artesunato + Mefloquina',
    dotColor: 'artesunato',
    daysLabel: 'D1, D2, D3 (dosis diaria × 3)',
    mgKgLabel: 'Dosis fija por peso (AS+MQ)',
    totalMgLabel: role === 'hcp' ? (row ? `AS ${row.asMg} mg + MQ ${row.mqMg} mg/día` : '—') : null,
    pillCountLabel: row ? `${row.tabsStr}/día × 3 días` : '— kg fuera de rango',
    formulation: 'AS+MQ comp. (25+50mg ó 100+200mg)',
    ntsRef: 'Tabla 7–8',
    ahaWarning: false,
    clinicalNote: 'Si hay alteración del estado mental: NO usar Mefloquina → usar AL',
  };
}

function alDrug(w, role) {
  const row = lookupAL(w);
  return {
    name: 'Artemeter + Lumefantrina (AL)',
    dotColor: 'artesunato',
    daysLabel: 'BID × 3 días (6 dosis)',
    mgKgLabel: 'Dosis fija por peso (AL)',
    totalMgLabel: role === 'hcp' ? (row ? `AL ${row.alMg} × 2/día` : '—') : null,
    pillCountLabel: row ? row.tabsStr : '—',
    formulation: 'AL comp. 20+120mg',
    ntsRef: 'Tabla 9–10',
    ahaWarning: false,
  };
}

function pqSingleDrug(w, role) {
  const dose = pqSingleDose(w);
  return {
    name: 'Primaquina dosis única (gametocidal)',
    dotColor: 'primaquinaDiaria',
    daysLabel: 'Dosis única D1',
    mgKgLabel: '0.25 mg/kg dosis única',
    totalMgLabel: role === 'hcp' ? `${dose.mg} mg` : null,
    pillCountLabel: dose.tabsStr,
    formulation: 'PQ 15mg/comp.',
    ntsRef: 'Tabla 7',
    ahaWarning: false,
    safeG6PD: true,
  };
}

// ─── P. vivax ─────────────────────────────────────────────────────────────────
function vivaxCards({ w, am, pregnant, lactating, g6pdStatus, tqAvailable, role }) {
  // Pregnant pathway
  if (pregnant) {
    return [
      {
        id: 'pv-preg-1',
        lineBadge: '1ra Línea',
        title: 'CQ semanal profiláctico',
        subtitle: 'Gestante · sin primaquina durante gestación',
        drugs: [{ name: 'Cloroquina profiláctica', dotColor: 'cloroquina', daysLabel: '1 vez/semana hasta el parto', mgKgLabel: '5 mg/kg/semana', totalMgLabel: role === 'hcp' ? `${Math.round(5 * w)} mg/semana` : null, pillCountLabel: `${formatTabs(Math.round(5 * w / 150 * 4) / 4)} de CQ 150mg/semana`, formulation: 'CQ 150mg base/comp.', ntsRef: null, ahaWarning: false }],
        warnings: [{ type: 'error', text: 'Primaquina CONTRAINDICADA durante la gestación. No administrar.' }],
        ntsRef: null,
      },
      {
        id: 'pv-preg-2',
        lineBadge: 'Postparto',
        title: 'PQ radical — postparto',
        subtitle: '≥ 1 mes después del parto · verificar G6PD antes',
        drugs: [{ name: 'Primaquina (cura radical postparto)', dotColor: 'primaquinaDiaria', daysLabel: 'D1–D7 (iniciar ≥1 mes postparto)', mgKgLabel: '0.5 mg/kg/día × 7 días', totalMgLabel: null, pillCountLabel: 'Calcular por peso al inicio del tratamiento', formulation: 'PQ 15mg/comp.', ntsRef: null, ahaWarning: true }],
        warnings: [
          { type: 'info', text: 'Verificar G6PD antes de iniciar primaquina postparto.' },
          ...(lactating ? [{ type: 'warning', text: 'Si lactando: no iniciar PQ en el primer mes postparto.' }] : []),
        ],
        ntsRef: null,
      },
    ];
  }

  const tqDose = getTQDose(w, am);
  const showTQ = tqAvailable && g6pdStatus === 'normal' && tqDose;

  const cq = cqDrug(w, role);
  const pqD = pqDailyDrug(w, role);
  const pqW = pqWeeklyDrug(w, role);

  const cqResistant1st = (pqType) => ({
    id: `pv-cqr-${pqType}`,
    lineBadge: 'CQ-Resistente',
    title: pqType === 'weekly' ? 'AS+MQ + PQ semanal' : 'AS+MQ + PQ diario',
    subtitle: 'Segunda línea · P. vivax resistente a CQ',
    drugs: [asmqDrug(w, role), pqType === 'weekly' ? pqWeeklyDrug(w, role) : pqDailyDrug(w, role)],
    warnings: [],
    ntsRef: 'Tabla 7–8',
  });

  if (g6pdStatus === 'not_done' || g6pdStatus === null) {
    return [
      { id: 'pv-nd-1', lineBadge: '1ra Línea', title: 'CQ + PQ diario', subtitle: 'G6PD no realizado · monitoreo AHA estrecho', drugs: [cq, pqD], warnings: [{ type: 'warning', text: 'G6PD no realizado. Monitoreo AHA estrecho requerido durante toda la primaquina.' }], ntsRef: 'Tabla 5' },
      cqResistant1st('daily'),
    ];
  }

  if (g6pdStatus === 'normal') {
    if (showTQ) {
      const tq = tqDrug(w, am, role);
      return [
        { id: 'pv-n-tq', lineBadge: '1ra Línea', title: 'CQ + Tafenoquina', subtitle: 'G6PD normal · TQ disponible', drugs: [cq, tq], warnings: [{ type: 'info', text: 'Tafenoquina disponible. Verificar ausencia de contraindicaciones (ver ⚠️).' }], ntsRef: null },
        { id: 'pv-n-pq', lineBadge: '2da Línea', title: 'CQ + PQ diario', subtitle: 'G6PD normal · alternativa sin TQ', drugs: [cq, pqD], warnings: [], ntsRef: 'Tabla 5' },
        cqResistant1st('daily'),
      ];
    }
    return [
      { id: 'pv-n-1', lineBadge: '1ra Línea', title: 'CQ + PQ diario', subtitle: 'G6PD normal', drugs: [cq, pqD], warnings: [], ntsRef: 'Tabla 5' },
      cqResistant1st('daily'),
    ];
  }

  if (g6pdStatus === 'intermedio') {
    return [
      { id: 'pv-i-1', lineBadge: '1ra Línea', title: 'CQ + PQ diario', subtitle: 'G6PD intermedio · TQ no elegible', drugs: [cq, pqD], warnings: [{ type: 'warning', text: 'G6PD intermedio: Tafenoquina contraindicada.' }], ntsRef: 'Tabla 5' },
      cqResistant1st('daily'),
    ];
  }

  if (g6pdStatus === 'deficiente') {
    return [
      { id: 'pv-d-1', lineBadge: '1ra Línea', title: 'CQ + PQ semanal supervisada', subtitle: 'G6PD deficiente · TQ contraindicada', drugs: [cq, pqW], warnings: [{ type: 'error', text: 'G6PD deficiente. Primaquina semanal SUPERVISADA. Tafenoquina contraindicada.' }], ntsRef: 'Tabla 5' },
      cqResistant1st('weekly'),
    ];
  }

  return [];
}

// ─── P. falciparum ────────────────────────────────────────────────────────────
function falciparumCards({ w, am, pregnant, role }) {
  if (pregnant) {
    return [{
      id: 'pf-preg',
      lineBadge: 'Gestante',
      title: 'Consulta urgente con médico',
      subtitle: 'P. falciparum en gestante',
      drugs: [],
      warnings: [
        { type: 'error', text: 'Mefloquina CONTRAINDICADA en primer trimestre. Artesunato puede usarse bajo supervisión médica estricta.' },
        { type: 'info', text: 'Referir a médico para manejo especializado de Pf en embarazo.' },
      ],
      ntsRef: null,
    }];
  }

  const pqS = pqSingleDrug(w, role);
  return [
    {
      id: 'pf-1',
      lineBadge: '1ra Línea',
      title: 'AS+MQ + PQ dosis única',
      subtitle: 'Primera línea Pf · PQ gametocidal D1',
      drugs: [asmqDrug(w, role), pqS],
      warnings: [{ type: 'warning', text: 'Si hay alteración del estado mental: NO usar Mefloquina. Usar AL (2da línea).' }],
      ntsRef: 'Tabla 7–8',
    },
    {
      id: 'pf-2',
      lineBadge: '2da Línea',
      title: 'AL + PQ dosis única',
      subtitle: 'Alternativa · Artemether-Lumefantrina',
      drugs: [alDrug(w, role), pqS],
      warnings: [],
      ntsRef: 'Tabla 9–10',
    },
    {
      id: 'pf-3',
      lineBadge: '3ra Línea',
      title: 'Quinina + Clindamicina + PQ',
      subtitle: 'Solo si resistencia confirmada + sin ACT disponible',
      drugs: [
        { name: 'Quinina sulfato', dotColor: 'artesunato', daysLabel: 'c/8h × 7 días', mgKgLabel: '10 mg sal/kg c/8h × 7 días', totalMgLabel: role === 'hcp' ? quinineDose(w).str : null, pillCountLabel: 'Calcular por presentación disponible', formulation: 'Quinina sulfato 300mg/comp.', ntsRef: 'Tabla 11', ahaWarning: false },
        { name: 'Clindamicina', dotColor: 'artesunato', daysLabel: 'c/12h × 7 días', mgKgLabel: '10 mg/kg c/12h × 7 días', totalMgLabel: role === 'hcp' ? clindamycinDose(w).str : null, pillCountLabel: 'Calcular por presentación disponible', formulation: 'Clindamicina 150/300mg', ntsRef: 'Tabla 11', ahaWarning: false },
        pqS,
      ],
      warnings: [{ type: 'warning', text: 'Solo si resistencia a ACT confirmada y ACT no disponible.' }],
      ntsRef: 'Tabla 11',
    },
  ];
}

// ─── P. malariae ──────────────────────────────────────────────────────────────
function malariaeCards({ w, role }) {
  const mg = cqMgFromWeight(w);
  return [{
    id: 'pm-1',
    lineBadge: 'Línea Única',
    title: 'CQ × 3 días + PQ dosis única',
    subtitle: 'P. malariae · G6PD no requerido',
    drugs: [
      { name: 'Cloroquina', dotColor: 'cloroquina', daysLabel: 'D1, D2, D3', mgKgLabel: '10/10/5 mg/kg', totalMgLabel: role === 'hcp' ? `${mg.d1}/${mg.d2}/${mg.d3} mg` : null, pillCountLabel: (() => { const vx = lookupVivax(w); return vx ? `D1–D2: ${formatTabs(vx.cqD1)} · D3: ${formatTabs(vx.cqD3)}` : '—'; })(), formulation: 'CQ 150mg base/comp.', ntsRef: 'Tabla 5', ahaWarning: false },
      pqSingleDrug(w, role),
    ],
    warnings: [{ type: 'info', text: 'G6PD no requerido. PQ 0.25 mg/kg es segura incluso si G6PD deficiente.' }],
    ntsRef: null,
  }];
}

// ─── P. ovale ─────────────────────────────────────────────────────────────────
function ovaleCards({ w, am, pregnant, lactating, g6pdStatus, role }) {
  // Same structure as P. vivax but NO tafenoquine
  const cards = vivaxCards({ w, am, pregnant, lactating, g6pdStatus, tqAvailable: false, role });
  // Remove TQ card if present; add pending MoH flag to all
  return cards.map(c => ({
    ...c,
    id: c.id.replace('pv-', 'po-'),
    warnings: [
      ...c.warnings,
      { type: 'info', text: '🚩 P. ovale: pendiente confirmación MINSA sobre requisito G6PD (NTG Tabla 2b). Consultar.' },
    ],
  }));
}

// ─── Mixed PfPv ───────────────────────────────────────────────────────────────
function mixedCards({ w, g6pdStatus, pregnant, role }) {
  if (pregnant) {
    return [{ id: 'mx-preg', lineBadge: 'Gestante', title: 'Consulta urgente con médico', subtitle: 'Mixta PfPv en gestante', drugs: [], warnings: [{ type: 'error', text: 'Gestante con infección mixta: referir a médico. Primaquina contraindicada. Manejo especializado.' }], ntsRef: null }];
  }

  const pqD = pqDailyDrug(w, role);
  const pqW = pqWeeklyDrug(w, role);
  const as = asmqDrug(w, role);

  const baseWarning = { type: 'error', text: 'Tafenoquina NUNCA para infección mixta PfPv (no combinar con ACT).' };

  if (g6pdStatus === 'deficiente') {
    return [{
      id: 'mx-d-1',
      lineBadge: '1ra Línea',
      title: 'AS+MQ + PQ semanal supervisada',
      subtitle: 'Mixta PfPv · G6PD deficiente',
      drugs: [as, pqW],
      warnings: [baseWarning, { type: 'error', text: 'G6PD deficiente: PQ semanal supervisada.' }],
      ntsRef: 'Tabla 7–8',
    }];
  }

  return [
    { id: 'mx-1', lineBadge: '1ra Línea', title: 'AS+MQ + PQ diario', subtitle: 'Mixta PfPv · cura radical componente vivax', drugs: [as, pqD], warnings: [baseWarning, ...(g6pdStatus === 'not_done' ? [{ type: 'warning', text: 'G6PD no realizado. Monitoreo AHA estrecho.' }] : [])], ntsRef: 'Tabla 7–8' },
    { id: 'mx-2', lineBadge: 'Alt. G6PD def.', title: 'AS+MQ + PQ semanal supervisada', subtitle: 'Si se confirma G6PD deficiente', drugs: [as, pqW], warnings: [baseWarning], ntsRef: 'Tabla 7–8' },
  ];
}
