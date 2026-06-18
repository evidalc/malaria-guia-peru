import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Alert } from '../components/Layout';

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTH_LABEL = 'Mayo 2026';

// Minimum days required by NTG before discharge (D7 clearance)
const MIN_DAYS_TO_DISCHARGE = { vivax: 7, falciparum: 7, malariae: 7, ovale: 7, mixed: 7 };

// Species short labels
const SPECIES_SHORT = { vivax: 'Pv', falciparum: 'Pf', malariae: 'Pm', ovale: 'Po', mixed: 'PfPv' };

// Species that require G6PD testing
const NEEDS_G6PD = new Set(['vivax', 'ovale', 'mixed']);

// Episode status → bar colors (bar chart — 3 groups; referido/fallecido collapse into grey)
const EPISODE = {
  alta:        { bar: '#1d4ed8', label: 'Alta completada'              },
  seguimiento: { bar: '#88bcfb', label: 'En seguimiento'               },
  perdido:     { bar: '#b5bac3', label: 'Perdido, referido o fallecido' },
};
// Map any terminal status to its bar entry
function barEpisode(status) {
  return EPISODE[status] ?? EPISODE.perdido;
}

// Estado de seguimiento → granular badge styles (5 statuses)
const ESTADO_BADGE = {
  alta:        { bg: '#eff6ff', border: '#1d4ed8', color: '#1d4ed8', label: 'Alta completada'    },
  seguimiento: { bg: '#e0f2fe', border: '#60a5fa', color: '#0369a1', label: 'En seguimiento'     },
  perdido:     { bg: '#f3f4f6', border: '#9ca3af', color: '#6b7280', label: 'Perdido'            },
  referido:    { bg: '#fff0f0', border: '#f87171', color: '#b91c1c', label: 'Referido'           },
  fallecido:   { bg: '#e5e7eb', border: '#6b7280', color: '#374151', label: 'Fallecido'          },
};

// G6PD activity value → style
const G6PD_STYLE = {
  normal:     { color: 'var(--green)', bg: '#e8f9f3' },
  intermedio: { color: 'var(--amber)', bg: '#fff8e6' },
  deficiente: { color: 'var(--red)',   bg: '#fff0f0' },
  none:       { color: '#9ca3af',      bg: '#f3f4f6' },
};
function g6pdKey(val) {
  if (val === null || val === undefined) return 'none';
  if (val >= 6.1) return 'normal';
  if (val >= 4.1) return 'intermedio';
  return 'deficiente';
}

// ── Mock patient data (HCP's own encounters this month) ───────────────────────
// Each patient: one first name + one last name
const MY_PATIENTS = [
  { firstName: 'Juan',    lastName: 'García',    dni: '45678901', visits: 3, daysSince: 12, status: 'alta',        species: 'vivax',      g6pd: 7.2  },
  { firstName: 'María',   lastName: 'Torres',    dni: '23456789', visits: 2, daysSince: 8,  status: 'seguimiento', species: 'vivax',      g6pd: 5.1  },
  { firstName: 'Carlos',  lastName: 'Panduro',   dni: '12345670', visits: 1, daysSince: 3,  status: 'seguimiento', species: 'falciparum', g6pd: null },
  { firstName: 'Ana',     lastName: 'Ríos',      dni: '98765432', visits: 2, daysSince: 10, status: 'referido',    species: 'mixed',      g6pd: 3.2  },
  { firstName: 'Rosa',    lastName: 'Tapullima', dni: '55443322', visits: 3, daysSince: 21, status: 'fallecido',   species: 'vivax',      g6pd: 6.8  },
  { firstName: 'Pedro',   lastName: 'Alvarado',  dni: '66554433', visits: 1, daysSince: 15, status: 'perdido',     species: 'malariae',   g6pd: null },
  { firstName: 'Luis',    lastName: 'Huanca',    dni: '11223344', visits: 1, daysSince: 4,  status: 'alta',        species: 'vivax',      g6pd: 3.8  }, // ⚠️ early discharge
];

const TOTAL_ENC   = MY_PATIENTS.reduce((s, p) => s + p.visits, 0);
const REF_NOTE    = 'Las referencias sugeridas son recomendaciones del sistema. Su concreción depende del criterio clínico del profesional de salud.';

// ── Helpers ───────────────────────────────────────────────────────────────────
// Bar fill % — full for all terminal statuses, progressive for seguimiento (D7 target)
function barPct(p) {
  if (p.status === 'seguimiento') {
    const minDays = MIN_DAYS_TO_DISCHARGE[p.species] ?? 7;
    return Math.min(Math.round((p.daysSince / minDays) * 100), 85);
  }
  return 100; // alta, perdido, referido, fallecido → full bar
}

// Early discharge: discharged before NTG minimum days
function isEarlyDischarge(p) {
  if (p.status !== 'alta') return false;
  return p.daysSince < (MIN_DAYS_TO_DISCHARGE[p.species] ?? 7);
}

// Text color on bar — white for dark-blue alta, near-black for lighter fills
function barTextColor(status) {
  if (status === 'alta') return '#fff';   // dark blue → white
  return '#111827';                        // light blue or light grey → near-black
}

// ── Sub-view: Encuentros del mes ──────────────────────────────────────────────
function EncuentrosView({ onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Btn variant="ghost" size="sm" onClick={onBack}>← Volver</Btn>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Dark header — no G6PD label here */}
        <div style={{ background: 'var(--dark-green)', padding: '10px 16px' }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
            ENCUENTROS DEL MES — {MONTH_LABEL.toUpperCase()}
          </span>
        </div>

        {/* Column label row: G6PD* above the pill column */}
        <div style={{ display: 'flex', gap: 8, padding: '8px 16px 2px', alignItems: 'center' }}>
          <div style={{ width: 118, flexShrink: 0 }} />  {/* name column spacer */}
          <div style={{ flex: 1 }} />                    {/* bar column spacer */}
          <div style={{ width: 56, flexShrink: 0, textAlign: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.3 }}>G6PD*</span>
          </div>
        </div>

        {/* Patient rows */}
        <div style={{ padding: '2px 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MY_PATIENTS.map((p, i) => {
            const ep      = barEpisode(p.status);
            const pct     = barPct(p);
            const early   = isEarlyDischarge(p);
            const needG6  = NEEDS_G6PD.has(p.species);
            const gk      = g6pdKey(p.g6pd);
            const gc      = G6PD_STYLE[needG6 ? gk : 'none'];
            const spLabel = SPECIES_SHORT[p.species] ?? p.species;
            const txtCol  = barTextColor(p.status);

            return (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                  {/* Name + DNI */}
                  <div style={{ width: 118, flexShrink: 0, lineHeight: 1.3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                      {p.lastName}, {p.firstName}
                    </span>
                    {early && (
                      <span style={{ fontSize: 13, marginLeft: 3 }} title="Alta registrada antes de lo estipulado en la NTS — verificar aclaramiento parasitario">⚠️</span>
                    )}
                    <br />
                    <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>(DNI {p.dni})</span>
                  </div>

                  {/* Bar with species overlay */}
                  <div style={{ flex: 1, position: 'relative', background: '#e9ecef', borderRadius: 6, height: 22, overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0,
                      background: ep.bar, borderRadius: 6,
                      height: '100%', width: `${pct}%`,
                      transition: 'width .4s',
                    }} />
                    <span style={{
                      position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 11, fontWeight: 700, color: txtCol,
                      letterSpacing: 0.3, whiteSpace: 'nowrap', lineHeight: 1,
                    }}>
                      {spLabel}
                    </span>
                  </div>

                  {/* G6PD pill — always shown as pill; colored if value available, grey if N/A or not done */}
                  {(() => {
                    const showVal = needG6 && p.g6pd !== null;
                    const ps = showVal ? gc : G6PD_STYLE.none;
                    return (
                      <div style={{ width: 56, flexShrink: 0 }}>
                        <div style={{
                          background: ps.bg, border: `1.5px solid ${ps.color}`,
                          borderRadius: 20, color: ps.color,
                          fontSize: 11, fontWeight: 700, padding: '3px 4px', textAlign: 'center',
                        }}>
                          {showVal ? p.g6pd : '—'}
                        </div>
                      </div>
                    );
                  })()}

                </div>

              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ borderTop: '1px solid var(--gray-light)', padding: '10px 16px', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Episode status legend */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.values(EPISODE).map(ep => (
              <div key={ep.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ background: ep.bar, borderRadius: 3, height: 10, width: 10, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{ep.label}</span>
              </div>
            ))}
          </div>
          {/* G6PD footnote — "G6PD" removed from title per spec */}
          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            *Actividad (U/g Hb):{' '}
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>Normal ≥6.1</span>
            {' · '}
            <span style={{ color: 'var(--amber)', fontWeight: 700 }}>Intermedio 4.1–6.0</span>
            {' · '}
            <span style={{ color: 'var(--red)', fontWeight: 700 }}>Deficiente ≤4.0</span>
            {' · '}
            <span style={{ color: '#9ca3af', fontWeight: 700 }}>— no realizado / no requerido</span>
          </p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
            Barra = Progreso del episodio
          </p>
          {MY_PATIENTS.some(p => isEarlyDischarge(p)) && (
            <p style={{ fontSize: 10, color: 'var(--red)', margin: '3px 0 0', fontWeight: 600, lineHeight: 1.4 }}>
              ⚠️ Alta registrada antes de lo estipulado en la NTS — verificar aclaramiento parasitario
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

// ── Sub-view: Estado de seguimiento ───────────────────────────────────────────
function EstadoView({ onBack, refSugeridas }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Btn variant="ghost" size="sm" onClick={onBack}>← Volver</Btn>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--dark-green)', padding: '10px 16px' }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
            ESTADO DE SEGUIMIENTO — {MONTH_LABEL.toUpperCase()}
          </span>
        </div>
        <div style={{ padding: '0 16px' }}>
          {MY_PATIENTS.map((p, i) => {
            const badge = ESTADO_BADGE[p.status] ?? ESTADO_BADGE.perdido;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0',
                borderBottom: i < MY_PATIENTS.length - 1 ? '1px solid var(--gray-light)' : 'none',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                    {p.lastName}, {p.firstName}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    D{p.daysSince} desde visita inicial
                  </p>
                </div>
                <span style={{
                  background: badge.bg, border: `1.5px solid ${badge.border}`, borderRadius: 8,
                  color: badge.color, fontSize: 11, fontWeight: 700,
                  padding: '4px 8px', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {refSugeridas > 0 && (
        <Alert type="warning">
          <strong>{refSugeridas} referencia(s) sugerida(s) este mes.</strong>{' '}{REF_NOTE}
        </Alert>
      )}
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ icon, val, label, sub, color, action }) {
  const base = {
    textAlign: 'center', padding: '14px 10px',
    background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(8,80,65,.1)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  };
  const inner = (
    <>
      <span style={{ fontSize: 24 }}>{icon}</span>
      {val !== '' && <span style={{ fontSize: 26, fontWeight: 700, color, marginTop: 4 }}>{val}</span>}
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginTop: val === '' ? 6 : 0 }}>{label}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</span>
      {action && <span style={{ fontSize: 10, color, marginTop: 5, fontWeight: 700 }}>Toca para ver →</span>}
    </>
  );
  if (action) {
    return (
      <button onClick={action} style={{ ...base, border: `1.5px solid ${color}33`, cursor: 'pointer', fontFamily: 'inherit' }}>
        {inner}
      </button>
    );
  }
  return <div style={base}>{inner}</div>;
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const ipress    = state?.ipress || '12345678';
  const [view, setView] = useState(null); // null | 'encuentros' | 'estado'

  const pendingSync  = 3;
  const refSugeridas = 2;
  const activeCases  = MY_PATIENTS.filter(p => p.status === 'seguimiento').length;

  return (
    <>
      <TopBar title="Dashboard — Responsable Malaria" back="/hcp/home" badge="HCP" />
      <Screen>

        {view === 'encuentros' && <EncuentrosView onBack={() => setView(null)} />}
        {view === 'estado'     && <EstadoView onBack={() => setView(null)} refSugeridas={refSugeridas} />}

        {view === null && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <MetricCard
                icon="👥" val={TOTAL_ENC} label="Encuentros totales" sub={MONTH_LABEL}
                color="var(--dark-green)" action={() => setView('encuentros')}
              />
              <MetricCard
                icon="📋" val={activeCases} label="Estado de seguimiento" sub={`${activeCases} en seguimiento`}
                color="var(--dark-green)" action={() => setView('estado')}
              />
              <MetricCard
                icon="🚨" val={refSugeridas} label="Ref. sugeridas" sub="⚠️ no confirmadas"
                color="var(--amber)" action={null}
              />
              <MetricCard
                icon="🔄" val={pendingSync} label="Sinc. pendientes" sub="sin conexión"
                color="var(--amber)" action={null}
              />
            </div>

            <Card style={{ padding: '12px 14px', border: `1.5px solid ${pendingSync > 0 ? 'var(--amber)' : 'var(--green)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{pendingSync > 0 ? '🟡' : '🟢'}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>
                    {pendingSync > 0
                      ? `${pendingSync} registros pendientes de sincronización`
                      : 'Todo sincronizado'}
                  </p>
                  {pendingSync > 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>ACS-02: 2 registros · ACS-03: 1 registro</p>
                  )}
                </div>
              </div>
            </Card>

            <Card style={{ padding: '11px 14px', background: 'var(--gray-light)' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                IPRESS {ipress} · NTS N°233-MINSA/DGIESP-2025 · Datos del prototipo — no reales
              </p>
            </Card>

            <Btn variant="ghost" onClick={() => navigate('/hcp/home')}>← Volver al inicio</Btn>
          </>
        )}
      </Screen>
    </>
  );
}
