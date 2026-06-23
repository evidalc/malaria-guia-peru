import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Alert } from '../components/Layout';

const MONTH_LABEL = 'Mayo 2026';

const ESTADO_BADGE = {
  alta:        { bg: '#eff6ff', border: '#1d4ed8', color: '#1d4ed8', label: 'Alta', icon: '🏠' },
  seguimiento: { bg: '#e0f2fe', border: '#60a5fa', color: '#0369a1', label: 'En seguimiento', icon: '🔄' },
  perdido:     { bg: '#f3f4f6', border: '#9ca3af', color: '#6b7280', label: 'Perdido', icon: '❓' },
  referido:    { bg: '#fff0f0', border: '#f87171', color: '#b91c1c', label: 'Referido', icon: '🏥' },
  fallecido:   { bg: '#e5e7eb', border: '#6b7280', color: '#374151', label: 'Fallecido', icon: '🕊️' },
};

const SPECIES_LABEL = { vivax: 'P. vivax', falciparum: 'P. falciparum', mixed: 'Mixta PfPv' };

const MY_PATIENTS = [
  { firstName: 'Juan',    lastName: 'García',    dni: '45678901', visits: 3, daysSince: 12, status: 'alta',        species: 'vivax'      },
  { firstName: 'María',   lastName: 'Torres',    dni: '23456789', visits: 2, daysSince: 8,  status: 'seguimiento', species: 'vivax'      },
  { firstName: 'Carlos',  lastName: 'Panduro',   dni: '12345670', visits: 1, daysSince: 3,  status: 'seguimiento', species: 'falciparum' },
  { firstName: 'Ana',     lastName: 'Ríos',      dni: '98765432', visits: 2, daysSince: 10, status: 'referido',    species: 'mixed'      },
  { firstName: 'Pedro',   lastName: 'Alvarado',  dni: '66554433', visits: 1, daysSince: 15, status: 'perdido',     species: 'vivax'      },
];

const TOTAL_ENC = MY_PATIENTS.reduce((s, p) => s + p.visits, 0);
const EN_SEGUIMIENTO = MY_PATIENTS.filter(p => p.status === 'seguimiento').length;

export default function PSDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState(null);

  if (view === 'pacientes') {
    return (
      <>
        <TopBar title="Mis pacientes" back={() => setView(null)} badge="PS" />
        <Screen>
          <Btn variant="ghost" size="sm" onClick={() => setView(null)}>← Volver</Btn>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'var(--dark-green)', padding: '10px 16px' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>MIS PACIENTES — {MONTH_LABEL.toUpperCase()}</span>
            </div>
            {MY_PATIENTS.map((p, i) => {
              const badge = ESTADO_BADGE[p.status] || ESTADO_BADGE.perdido;
              return (
                <div key={i} style={{ borderBottom: i < MY_PATIENTS.length - 1 ? '1px solid var(--gray-light)' : 'none', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{p.lastName}, {p.firstName}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{SPECIES_LABEL[p.species]} · D{p.daysSince} · {p.visits} visita{p.visits > 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ background: badge.bg, border: `1.5px solid ${badge.border}`, borderRadius: 20, color: badge.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>{badge.icon}</span> {badge.label}
                  </div>
                </div>
              );
            })}
          </Card>

          <Card style={{ background: 'var(--gray-light)', padding: '10px 14px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              NTS N°233-MINSA/DGIESP-2025 · Datos del prototipo — no reales
            </p>
          </Card>
        </Screen>
      </>
    );
  }

  return (
    <>
      <TopBar title="Mi resumen" back="/acs/home" badge="PS" />
      <Screen>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setView('pacientes')} style={{ background: '#fff', border: '1.5px solid var(--gray-mid)', borderRadius: 14, cursor: 'pointer', padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 22 }}>👥</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--dark-green)', marginTop: 4 }}>{MY_PATIENTS.length}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Mis pacientes</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{MONTH_LABEL}</div>
            <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600, marginTop: 4 }}>Toca para ver →</div>
          </button>

          <div style={{ background: '#fff', border: '1.5px solid var(--gray-mid)', borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 22 }}>🔄</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--blue)', marginTop: 4 }}>{EN_SEGUIMIENTO}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>En seguimiento</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>pendientes de alta</div>
          </div>

          <div style={{ background: '#fff', border: '1.5px solid var(--gray-mid)', borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 22 }}>📋</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--dark-green)', marginTop: 4 }}>{TOTAL_ENC}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Visitas totales</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{MONTH_LABEL}</div>
          </div>

          <div style={{ background: '#fff', border: '1.5px solid var(--gray-mid)', borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 22 }}>🟡</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--amber)', marginTop: 4 }}>2</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Sinc. pendientes</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>sin conexión</div>
          </div>
        </div>

        <Card style={{ border: '1.5px solid var(--amber)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🟡</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700 }}>2 registros pendientes de sincronización</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Se sincronizarán cuando tengas conexión a internet</p>
          </div>
        </Card>

        <Alert type="info">
          Si tienes pacientes <strong>en seguimiento</strong>, recuerda visitarlos según el calendario de tratamiento.
        </Alert>

        <Card style={{ background: 'var(--gray-light)', padding: '10px 14px' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            NTS N°233-MINSA/DGIESP-2025 · Datos del prototipo — no reales
          </p>
        </Card>

        <Btn variant="ghost" onClick={() => navigate('/acs/home')}>← Volver al inicio</Btn>
      </Screen>
    </>
  );
}
