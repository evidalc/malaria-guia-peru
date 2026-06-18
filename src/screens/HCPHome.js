import { useNavigate, useLocation } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Alert } from '../components/Layout';

const mock = {
  encounters: 7,
  g6pdRate: 71,
  referrals: 2,
  pending: 3,
  recent: [
    { dni: '4521xxxx', parasite: 'P. vivax',      days: 1,  acs: 'ACS-01', status: 'active' },
    { dni: '3810xxxx', parasite: 'P. falciparum', days: 3,  acs: 'HCP',    status: 'active' },
    { dni: '6723xxxx', parasite: 'Mixta PfPv',    days: 8,  acs: 'ACS-02', status: 'discharged' },
    { dni: '9012xxxx', parasite: 'P. vivax',      days: 12, acs: 'ACS-01', status: 'lost' },
  ],
};

const statusBadge = { active: { bg: '#e8f4ff', color: 'var(--blue)', text: 'En seguimiento' }, discharged: { bg: '#e8f9f3', color: 'var(--green)', text: 'Alta completada' }, lost: { bg: '#f0f0f0', color: '#666', text: 'Perdido/Falleció' } };

export default function HCPHome() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ipress = state?.ipress || '12345678';

  return (
    <>
      <TopBar title="MalariaGuía Perú" badge="HCP" right={<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>IPRESS {ipress}</span>} />
      <Screen>
        {/* CTA */}
        <button onClick={() => navigate('/hcp/intake', { state: { role: 'hcp', ipress } })} style={{ background: 'linear-gradient(135deg, var(--dark-green), var(--green))', border: 'none', borderRadius: 16, color: '#fff', cursor: 'pointer', padding: '22px 18px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 16px rgba(29,158,117,.3)' }}>
          <span style={{ fontSize: 42 }}>📋</span>
          <span>
            <span style={{ display: 'block', fontSize: 20, fontWeight: 700 }}>Nueva visita</span>
            <span style={{ display: 'block', fontSize: 13, opacity: 0.85, marginTop: 2 }}>Visita inicial · seguimiento · verificación</span>
          </span>
        </button>

        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: '🩺', value: mock.encounters, label: 'Encuentros', sub: 'últimos 30 días' },
            { icon: '🔬', value: `${mock.g6pdRate}%`, label: 'G6PD realizado', sub: 'tasa global', color: mock.g6pdRate >= 80 ? 'var(--green)' : mock.g6pdRate >= 50 ? 'var(--amber)' : 'var(--red)' },
            { icon: '🚨', value: mock.referrals, label: 'Ref. sugeridas', sub: 'este mes' },
            { icon: '🔄', value: mock.pending, label: 'Sinc. pendientes', sub: '→ conectarse', color: mock.pending > 0 ? 'var(--amber)' : 'var(--green)' },
          ].map((m, i) => (
            <Card key={i} style={{ textAlign: 'center', padding: '14px 10px', cursor: 'pointer' }} onClick={() => navigate('/dashboard', { state: { ipress, role: 'hcp' } })}>
              <div style={{ fontSize: 22 }}>{m.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: m.color || 'var(--dark-green)', marginTop: 4 }}>{m.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{m.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.sub}</div>
            </Card>
          ))}
        </div>

        {/* Active cases table */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: 'var(--dark-green)', padding: '10px 14px' }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>ESTADO DE SEGUIMIENTO</span>
          </div>
          {mock.recent.map((r, i) => {
            const b = statusBadge[r.status];
            return (
              <div key={i} style={{ borderBottom: i < mock.recent.length - 1 ? '1px solid var(--gray-light)' : 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>DNI {r.dni}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.parasite} · D{r.days} · {r.acs}</p>
                </div>
                <span style={{ background: b.bg, color: b.color, borderRadius: 8, fontSize: 11, fontWeight: 700, padding: '3px 8px', flexShrink: 0 }}>{b.text}</span>
              </div>
            );
          })}
        </Card>

        <Alert type="warning">⚠️ Notificar casos de <strong>P. falciparum</strong> y malaria grave a epidemiología dentro de las 24 h.</Alert>

        <Btn variant="ghost" onClick={() => navigate('/')}>Cerrar sesión</Btn>
      </Screen>
    </>
  );
}
