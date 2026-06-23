import { useLocation, useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Alert } from '../components/Layout';

export default function SevereReferral() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role, patient, severity } = state || {};
  const isACS = role === 'acs';

  return (
    <>
      <TopBar title={isACS ? '¡Referir URGENTE!' : 'Malaria Grave — Referencia'} back={-1} />
      <Screen>
        <div style={{ background: 'var(--red)', borderRadius: 16, color: '#fff', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>🚨</div>
          <h2 style={{ fontSize: 21, fontWeight: 700, marginTop: 8 }}>MALARIA GRAVE</h2>
          <p style={{ fontSize: 14, opacity: 0.9, marginTop: 6, lineHeight: 1.4 }}>
            {isACS
              ? 'Este paciente necesita atención médica INMEDIATA. Traslada ahora.'
              : 'Criterios de gravedad presentes. Referir a establecimiento de mayor complejidad.'}
          </p>
        </div>

        {/* Severity signs */}
        {severity?.length > 0 && (
          <Card style={{ border: '1.5px solid var(--red)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)', marginBottom: 10 }}>Señales de alarma identificadas:</p>
            {severity.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>⚠</span>
                <span style={{ fontSize: 13 }}>{s}</span>
              </div>
            ))}
          </Card>
        )}

        {isACS ? (
          /* ACS: simple plain-language steps */
          <>
            <Card>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark-green)', marginBottom: 14 }}>¿Qué hacer AHORA?</p>
              {[
                { n: '1', icon: '📞', text: 'Llama a tu establecimiento de salud de inmediato' },
                { n: '2', icon: '🗣️', text: 'Diles que tienes un paciente con malaria grave' },
                { n: '3', icon: '🚫', text: 'NO le des pastillas por la boca si vomita o está inconsciente' },
                { n: '4', icon: '🚑', text: 'Traslada al paciente inmediatamente' },
                { n: '5', icon: '👥', text: 'Acompáñalo o manda a un familiar de confianza' },
              ].map(s => (
                <div key={s.n} style={{ alignItems: 'flex-start', display: 'flex', gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--gray-light)' }}>
                  <div style={{ alignItems: 'center', background: 'var(--red)', borderRadius: '50%', color: '#fff', display: 'flex', flexShrink: 0, fontSize: 13, fontWeight: 700, height: 30, justifyContent: 'center', width: 30 }}>{s.n}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </Card>

            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--blue)', border: 'none', borderRadius: 14, color: '#fff', cursor: 'pointer', fontSize: 17, fontWeight: 700, padding: '16px 20px', width: '100%' }}>
              <span style={{ fontSize: 24 }}>📞</span>
              Llamar al establecimiento
            </button>
          </>
        ) : (
          /* HCP: clinical pre-referral guidance */
          <>
            <Alert type="info">
              Consulte la sección de <strong>Malaria Grave</strong> de la NTS N°233-MINSA/DGIESP-2025 para el manejo completo.
            </Alert>

            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ background: 'var(--dark-green)', padding: '10px 14px' }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>ACCIONES PRE-REFERENCIA INMEDIATAS</span>
              </div>
              {[
                { icon: '💉', title: 'Artesunato IV/IM (si disponible)', detail: '2.4 mg/kg IV bolo → repetir a las 12 h → luego c/24 h hasta vía oral' },
                { icon: '🩸', title: 'Acceso venoso periférico', detail: 'Suero fisiológico 0.9% a goteo de mantenimiento' },
                { icon: '🩺', title: 'Monitoreo de signos vitales', detail: 'FC, FR, PA, temperatura, SpO₂ cada 15 min' },
                { icon: '🍬', title: 'Corregir hipoglucemia si presente', detail: 'Dextrosa 10% 5 mL/kg en bolo lento si glucosa < 2.2 mmol/L' },
                { icon: '📞', title: 'Comunicar al establecimiento receptor', detail: 'Avisar antes de trasladar. Coordinar cama y médico de guardia.' },
                { icon: '📄', title: 'Llevar hoja de referencia completa', detail: 'Datos del paciente, hallazgos, tratamiento dado y hora de inicio.' },
              ].map((s, i) => (
                <div key={i} style={{ alignItems: 'flex-start', borderBottom: i < 5 ? '1px solid var(--gray-light)' : 'none', display: 'flex', gap: 12, padding: '13px 14px' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{s.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{s.detail}</p>
                  </div>
                </div>
              ))}
            </Card>

            {/* Artesunato dose calc */}
            {patient?.peso && (
              <Card style={{ border: '1.5px solid var(--blue)' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)', marginBottom: 8 }}>Artesunato IV — Dosis calculada</p>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Peso</p><p style={{ fontSize: 18, fontWeight: 700 }}>{patient.peso} kg</p></div>
                  <div><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dosis (2.4 mg/kg)</p><p style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue)' }}>{Math.round(2.4 * parseFloat(patient.peso))} mg IV</p></div>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Bolo IV lento (1–2 min). Repetir a las 12 h, luego c/24 h.</p>
              </Card>
            )}

            <Card style={{ background: 'var(--gray-light)', padding: '11px 14px' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                📋 <strong>NTS N°233-MINSA/DGIESP-2025 · Sección: Malaria Grave</strong><br />
                Criterios WHO 2015 adaptados. Notificar a DIRESA/GERESA de forma inmediata.
              </p>
            </Card>
          </>
        )}

        <Btn variant="danger" onClick={() => navigate(isACS ? '/acs/home' : '/hcp/home')}>← Volver al inicio</Btn>
      </Screen>
    </>
  );
}
