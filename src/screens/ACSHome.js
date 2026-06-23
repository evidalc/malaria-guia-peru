import { useNavigate, useLocation } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Alert } from '../components/Layout';

export default function ACSHome() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dni = state?.dni || '—';
  const ipress = state?.ipress || '—';

  return (
    <>
      <TopBar title="MalariaGuía Perú" badge="PS" />
      <Screen>
        {/* Greeting */}
        <div style={{ background: 'linear-gradient(135deg, var(--dark-green), var(--green))', borderRadius: 16, color: '#fff', padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 38 }}>🏘️</div>
          <div>
            <p style={{ fontSize: 13, opacity: 0.8 }}>¡Hola, Promotor!</p>
            <p style={{ fontSize: 17, fontWeight: 700 }}>DNI: {dni}</p>
            <p style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>IPRESS de referencia: {ipress}</p>
          </div>
        </div>

        {/* Nueva visita */}
        <button onClick={() => navigate('/acs/intake', { state: { role: 'acs', dni, ipress } })}
          style={{ background: 'var(--green)', border: 'none', borderRadius: 18, boxShadow: '0 4px 16px rgba(29,158,117,.35)', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '26px 20px', width: '100%' }}>
          <span style={{ fontSize: 48 }}>📋</span>
          <span style={{ fontSize: 22, fontWeight: 700 }}>Nueva visita</span>
          <span style={{ fontSize: 14, opacity: 0.85 }}>Registrar paciente</span>
        </button>

        {/* Dashboard */}
        <button onClick={() => navigate('/ps/dashboard')}
          style={{ background: '#fff', border: '1.5px solid var(--gray-mid)', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', width: '100%', textAlign: 'left' }}>
          <span style={{ fontSize: 28 }}>📊</span>
          <span>
            <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: 'var(--dark-green)' }}>Mi resumen</span>
            <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Pacientes · visitas · estado</span>
          </span>
          <span style={{ marginLeft: 'auto', color: 'var(--green)', fontSize: 18, fontWeight: 700 }}>›</span>
        </button>

        {/* Sync status */}
        <Card style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🟡</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700 }}>3 registros pendientes de sincronización</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Se sincronizarán cuando tengas conexión a internet</p>
          </div>
        </Card>

        {/* Danger signs reminder */}
        <Card>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)', marginBottom: 10 }}>🚨 SEÑALES DE PELIGRO — Referir ahora</p>
          {['No puede caminar ni sentarse solo', 'Está inconsciente o tiene convulsiones', 'Vomita todo lo que toma', 'Está amarillo (piel u ojos)', 'Orina muy oscura (marrón o negra)', 'Sangrado sin razón'].map((s, i) => (
            <div key={i} style={{ alignItems: 'flex-start', display: 'flex', gap: 8, marginBottom: 6 }}>
              <span style={{ color: 'var(--red)', fontWeight: 700, flexShrink: 0 }}>✕</span>
              <span style={{ fontSize: 14, color: 'var(--text)' }}>{s}</span>
            </div>
          ))}
        </Card>

        <Alert type="info">Si el paciente tiene señales de peligro, <strong>no esperes</strong>. Llama al establecimiento y traslada ahora.</Alert>

        <Btn variant="ghost" onClick={() => navigate('/')}>Salir</Btn>
      </Screen>
    </>
  );
}
