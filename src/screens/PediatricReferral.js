import { useLocation, useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Alert } from '../components/Layout';

export default function PediatricReferral() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role, patient } = state || {};
  const isACS = role === 'acs';

  return (
    <>
      <TopBar title="Referencia Pediátrica" back={-1} />
      <Screen>
        <div style={{ background: 'var(--amber)', borderRadius: 16, color: '#fff', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>👶</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>Niño menor de 6 meses o &lt;5 kg</h2>
          <p style={{ fontSize: 14, opacity: 0.9, marginTop: 6, lineHeight: 1.4 }}>Referencia inmediata. No iniciar tratamiento sin supervisión médica.</p>
        </div>

        {patient && (
          <Card>
            <div style={{ display: 'flex', gap: 16 }}>
              {patient.peso && <div><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Peso</p><p style={{ fontSize: 16, fontWeight: 700 }}>{patient.peso} kg</p></div>}
              {patient.edad && <div><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Edad</p><p style={{ fontSize: 16, fontWeight: 700 }}>{patient.edad} {patient.edadUnit || 'años'}</p></div>}
            </div>
          </Card>
        )}

        <Alert type="warning">
          Niños menores de 6 meses o con peso inferior a 5 kg requieren <strong>manejo especializado</strong> en un establecimiento de mayor complejidad, sin importar la especie parasitaria.
        </Alert>

        <Card>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark-green)', marginBottom: 10 }}>¿Qué hacer?</p>
          {(isACS ? ['Llama al establecimiento de salud de tu referencia', 'Traslada al niño inmediatamente', 'No le des ningún medicamento sin indicación médica'] : ['Referir de inmediato al nivel de atención con capacidad pediátrica', 'Consultar NTS N°233 Sección: Casos especiales < 6 meses / < 5 kg', 'Artesunato IV/IM puede usarse bajo supervisión especializada']).map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <span style={{ color: 'var(--amber)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: 14 }}>{t}</span>
            </div>
          ))}
        </Card>

        {isACS && (
          <button style={{ alignItems: 'center', background: 'var(--blue)', border: 'none', borderRadius: 14, color: '#fff', cursor: 'pointer', display: 'flex', fontSize: 17, fontWeight: 700, gap: 10, justifyContent: 'center', padding: '16px', width: '100%' }}>
            <span style={{ fontSize: 24 }}>📞</span> Llamar al establecimiento
          </button>
        )}

        <Btn variant="ghost" onClick={() => navigate(isACS ? '/acs/home' : '/hcp/home')}>← Volver al inicio</Btn>
      </Screen>
    </>
  );
}
