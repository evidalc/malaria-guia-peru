// ─── Species available per role ────────────────────────────────────────────
export const SPECIES_HCP = [
  { value: 'vivax',      label: 'P. vivax' },
  { value: 'falciparum', label: 'P. falciparum' },
  { value: 'malariae',   label: 'P. malariae' },
  { value: 'ovale',      label: 'P. ovale' },
  { value: 'mixed',      label: 'Mixta PfPv' },
];
export const SPECIES_ACS = [
  { value: 'vivax',      label: 'P. vivax' },
  { value: 'falciparum', label: 'P. falciparum' },
  { value: 'mixed',      label: 'Mixta PfPv' },
];

// ─── Severity signs ─────────────────────────────────────────────────────────
export const SEVERITY_SIGNS_HCP = [
  'Postración o incapacidad para caminar/sentarse sin apoyo',
  'Alteración de consciencia o convulsiones',
  'Dificultad respiratoria o respiración profunda',
  'Vómitos repetidos (incapacidad de retener medicación oral)',
  'Ictericia clínica + evidencia de disfunción orgánica',
  'Sangrado anormal',
  'Orina oscura (hemoglobinuria)',
  'Hipoglicemia (< 2.2 mmol/L)',
];
export const SEVERITY_SIGNS_ACS = [
  'No puede caminar ni sentarse solo',
  'Está inconsciente o tiene convulsiones',
  'Le cuesta respirar mucho',
  'Vomita todo lo que toma',
  'Está amarillo (piel u ojos)',
  'Tiene sangrado sin razón',
  'Su orina está muy oscura (marrón o negra)',
  'Tiene el azúcar baja (se le midió)',
];

// ─── AHA signs ───────────────────────────────────────────────────────────────
export const AHA_SIGNS_HCP = [
  'Orina color marrón oscuro o roja',
  'Ictericia (coloración amarilla de piel u ojos)',
  'Palidez nueva o que empeora',
  'Fatiga, mareos o dificultad respiratoria nuevos o que empeoran',
  'Dolor de espalda nuevo o que empeora',
  'Taquicardia nueva o que empeora',
  'Fiebre, náuseas y/o vómitos nuevos o que empeoran',
];
export const AHA_SIGNS_ACS = [
  { label: 'Orina muy oscura (roja o negra)', icon: '🟫' },
  { label: 'Está amarillo (piel u ojos)',      icon: '🟡' },
  { label: 'Está más pálido que antes',        icon: '😶' },
  { label: 'Siente mucho cansancio, mareo o le cuesta respirar', icon: '😮‍💨' },
  { label: 'Le duele la espalda (dolor nuevo)', icon: '🔲' },
  { label: 'El corazón le late muy rápido',    icon: '💓' },
  { label: 'La fiebre no baja con el tratamiento', icon: '🌡️' },
];

// ─── G6PD not-done reasons ───────────────────────────────────────────────────
export const G6PD_NOT_DONE_HCP = [
  'No aplica (P. falciparum, P. malariae o gestante)',
  'Sin insumos / desabastecimiento',
  'Prueba defectuosa o resultado inválido',
  'Paciente rechazó la prueba',
  'No hubo tiempo / emergencia',
  'Otro',
];
export const G6PD_NOT_DONE_ACS = [
  'No aplica (P. falciparum)',
  'No aplica (paciente gestante)',
  'No tengo insumos',
  'La prueba salió defectuosa',
  'El paciente rechazó la prueba',
  'Otro motivo',
];

// ─── Parasite clearance not-done reasons ─────────────────────────────────────
export const CLEARANCE_NOT_DONE_HCP = [
  'Insumos no disponibles en el IPRESS',
  'Microscopio no disponible o no funciona',
  'Paciente se negó a la prueba',
  'Otro',
];
export const CLEARANCE_NOT_DONE_ACS = [
  'PDR no disponible',
  'Paciente se negó a la prueba',
  'Otro',
];

// ─── Episode status options ──────────────────────────────────────────────────
export const EPISODE_STATUS_FOLLOWUP = [
  { value: 'continuar',  label: 'Continuar seguimiento' },
  { value: 'referido',   label: 'Referido' },
];
export const EPISODE_STATUS_VERIFICATION = [
  { value: 'alta',       label: 'Alta' },
  { value: 'continuar',  label: 'Continuar seguimiento' },
  { value: 'perdido',    label: 'Perdido' },
  { value: 'referido',   label: 'Referido' },
  { value: 'fallecido',  label: 'Fallecido' },
];

// ─── Adherence options ──────────────────────────────────────────────────────
export const ADHERENCE_OPTIONS = [
  { value: 'completo',     label: 'Sí, completó todo' },
  { value: 'incompleto',   label: 'No, no completó' },
  { value: 'no_sabe',      label: 'No sabe / no recuerda' },
];
export const ADHERENCE_INCOMPLETE_REASONS = [
  'Olvidó dosis',
  'Efectos adversos',
  'Otro',
];
export const ADHERENCE_OPTIONS_ACS = [
  { value: 'completo',   label: 'Sí, tomó todas las pastillas' },
  { value: 'incompleto', label: 'No, no terminó de tomarlas' },
  { value: 'no_sabe',    label: 'No sabe' },
];
export const ADHERENCE_INCOMPLETE_REASONS_ACS = [
  'Se le olvidó',
  'Le cayó mal (efectos adversos)',
  'Otro motivo',
];

// ─── Hb instrument selector ──────────────────────────────────────────────────
export const HB_INSTRUMENTS = [
  { value: 'sd_biosensor', label: 'SD Biosensor G6PD/Hb' },
  { value: 'hemocue',      label: 'HemoCue' },
  { value: 'otro',         label: 'Otro' },
];

// ─── G6PD classification ─────────────────────────────────────────────────────
export function classifyG6PD(value) {
  const v = parseFloat(value);
  if (isNaN(v)) return null;
  if (v >= 6.1) return 'normal';
  if (v >= 4.1) return 'intermedio';
  return 'deficiente';
}

// ─── Day dot colors ──────────────────────────────────────────────────────────
export const DOT_COLORS = {
  cloroquina:       '#A32D2D',  // red
  primaquinaDiaria: '#185FA5',  // blue
  primaquinaSemanl: '#BA7517',  // amber
  tafenoquina:      '#1D9E75',  // green
  artesunato:       '#9B4A6B',  // dark pink/mauve
  lumefantrina:     '#9B4A6B',
  mefloquina:       '#9B4A6B',
  quinina:          '#9B4A6B',
  clindamicina:     '#9B4A6B',
};

// ─── TQ drug interactions ─────────────────────────────────────────────────────
export const TQ_DRUG_INTERACTIONS = [
  'doxorubicina', 'nitrofurantoína', 'furazolidona', 'fenazopiridina',
  'azul de metileno', 'ácido nalidíxico', 'sulfametoxazol', 'dapsona',
  'acetanilida',
];
