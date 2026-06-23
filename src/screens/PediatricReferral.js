import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Alert } from '../components/Layout';

export default function PediatricReferral() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role, patient } = state || {};
  const isACS = role === 'acs';
  const [showTabla, setShowTabla] = useState(false);

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
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark-green)', marginBottom: 14 }}>¿Qué hacer AHORA?</p>
          {(isACS ? [
            { icon: '📞', text: 'Llama a tu establecimiento de salud de inmediato' },
            { icon: '🗣️', text: 'Diles que tienes un niño menor de 6 meses o que pesa menos de 5 kilos con malaria que necesita manejo especializado' },
            { icon: '🚫', text: 'No le des ningún medicamento sin indicación médica' },
            { icon: '🚑', text: 'Traslada al niño inmediatamente' },
            { icon: '👥', text: 'Acompáñalo o manda a un familiar de confianza' },
          ] : [
            { icon: '1', text: 'Referir de inmediato al nivel de atención con capacidad pediátrica' },
            { icon: '2', text: 'Estabilizar al paciente e iniciar tratamiento pre-referencia si corresponde (ver Tabla 14 abajo)' },
            { icon: '3', text: 'Coordinar traslado con establecimiento receptor' },
          ]).map((s, i) => (
            <div key={i} style={{ alignItems: 'flex-start', display: 'flex', gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: i < (isACS ? 4 : 2) ? '1px solid var(--gray-light)' : 'none' }}>
              {isACS ? (
                <>
                  <div style={{ alignItems: 'center', background: 'var(--amber)', borderRadius: '50%', color: '#fff', display: 'flex', flexShrink: 0, fontSize: 13, fontWeight: 700, height: 30, justifyContent: 'center', width: 30 }}>{i + 1}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{s.text}</p>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ color: 'var(--amber)', fontWeight: 700, flexShrink: 0 }}>{s.icon}.</span>
                  <span style={{ fontSize: 14 }}>{s.text}</span>
                </>
              )}
            </div>
          ))}
        </Card>

        {!isACS && (
          <Card style={{ border: '1.5px solid var(--blue)', padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => setShowTabla(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', width: '100%' }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>📋 NTS Tabla 14 — Referencia para establecimiento receptor</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{showTabla ? '▲' : '▼'}</span>
            </button>
            {showTabla && (
              <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  Tratamiento de malaria en niños &lt;6 meses y/o &lt;5 kg — todas las especies (P. vivax, P. falciparum, P. ovale, P. malariae)
                </p>
                <div style={{ background: 'var(--gray-light)', borderRadius: 10, padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ background: '#9B4A6B', borderRadius: 4, width: 4, alignSelf: 'stretch', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>Artesunato + Mefloquina</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tab. 25 mg + 50 mg (formulación pediátrica)</p>
                    </div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gray-light)', paddingBottom: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peso</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dosis AS+MQ</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>&lt;5 kg (&lt;6 meses)</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>25+50 mg (1 comp.) × 3 días</span>
                    </div>
                  </div>
                </div>
                <Alert type="error">
                  <strong>No administrar primaquina</strong> en menores de 6 meses o &lt;5 kg.
                </Alert>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  📋 NTS N°233-MINSA/DGIESP-2025 · Sección e) · Tabla 14
                </p>
              </div>
            )}
          </Card>
        )}

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
