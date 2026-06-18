import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Alert, Toggle } from '../components/Layout';
import { TreatmentCarousel } from '../components/TreatmentCards';
import { generateCards } from '../data/treatmentEngine';
import { classifyG6PD } from '../data/constants';

const SPECIES_LABEL = { vivax: 'P. vivax', falciparum: 'P. falciparum', malariae: 'P. malariae', ovale: 'P. ovale', mixed: 'Mixta PfPv' };
const SPECIES_COLOR = { vivax: 'var(--green)', falciparum: 'var(--amber)', malariae: 'var(--blue)', ovale: 'var(--blue)', mixed: '#9B4A6B' };

export default function Treatment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const intake = state?.intake;

  const [tqAvailable, setTqAvailable] = useState(false);

  if (!intake) { navigate('/'); return null; }

  const { role, especie, peso, g6pdDone, g6pdValue, pregnant, lactating, ageMonths, edad, fecha } = intake;

  // D7 follow-up date: visit date (D1) + 6 days
  const d7Date = (() => {
    if (!fecha) return null;
    const d = new Date(fecha + 'T12:00:00');
    d.setDate(d.getDate() + 6);
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  })();
  const g6pdStatus = g6pdDone ? classifyG6PD(g6pdValue) : 'not_done';

  // treatmentEngine uses 'species' and 'weight' — map from intake field names
  const result = generateCards({
    ...intake,
    species: especie,
    weight: peso,
    tqAvailable,
    ageMonths: ageMonths || (parseFloat(edad || 99) * 12),
  });

  if (result?.type === 'pediatric_referral') {
    navigate('/pediatric-referral', { state: { role, patient: intake } });
    return null;
  }

  const cards = result?.cards || [];
  const isACS = role === 'acs';

  const showTQToggle = especie === 'vivax' && !pregnant && !lactating && g6pdStatus === 'normal';

  const g6ClassColor = { normal: 'var(--green)', intermedio: 'var(--amber)', deficiente: 'var(--red)', not_done: 'var(--text-muted)' };
  const g6ClassLabel = { normal: 'G6PD Normal (≥6.1)', intermedio: 'G6PD Intermedio (4.1–6.0)', deficiente: 'G6PD Deficiente (≤4.0)', not_done: 'G6PD no realizado' };

  return (
    <>
      <TopBar title={isACS ? 'Medicamento a dar' : 'Recomendación de Tratamiento'} back={-1} badge={role.toUpperCase()} />
      <Screen>
        {/* Species header */}
        <div style={{ background: `${SPECIES_COLOR[especie]}18`, border: `2px solid ${SPECIES_COLOR[especie]}`, borderRadius: 16, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>💊</div>
          <h2 style={{ color: SPECIES_COLOR[especie], fontSize: 18, fontWeight: 700, marginTop: 6 }}>{SPECIES_LABEL[especie] || especie}</h2>
          {pregnant && <p style={{ color: 'var(--red)', fontSize: 13, fontWeight: 700, marginTop: 4 }}>🤰 Gestante — protocolo especial</p>}
        </div>

        {/* Patient summary */}
        <Card style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['Peso', `${peso} kg`], ['Especie', SPECIES_LABEL[especie] || especie], g6pdDone ? ['G6PD', g6ClassLabel[g6pdStatus]] : null, pregnant ? ['Estado', 'Gestante'] : null].filter(Boolean).map(([k, v]) => (
              <div key={k}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{k}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: k === 'G6PD' ? g6ClassColor[g6pdStatus] : 'var(--text)' }}>{v}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* TQ toggle (HCP, P. vivax, G6PD normal only) */}
        {showTQToggle && !isACS && (
          <Card style={{ padding: '12px 14px', border: '1.5px solid var(--green)' }}>
            <Toggle checked={tqAvailable} onChange={() => setTqAvailable(v => !v)} label="Tafenoquina disponible en esta IPRESS" />
            {tqAvailable && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Los esquemas se reorganizan para mostrar TQ como 1ra línea.</p>}
          </Card>
        )}

        {/* Treatment cards */}
        {cards.length > 0 ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {isACS ? 'Esquema de medicamento' : 'Esquema de tratamiento'}
              </p>
              {cards.length > 1 && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Desliza para ver {cards.length} opciones →</p>}
            </div>
            <TreatmentCarousel cards={cards} role={role} />
          </>
        ) : (
          <Alert type="error">No se pudo generar esquema. Verifique los datos del formulario.</Alert>
        )}

        {/* AHA monitoring reminder */}
        <Alert type="warning">
          🔴 <strong>Monitoreo AHA:</strong> Instruya al paciente/familiar a regresar si presenta orina oscura, ictericia, palidez, fatiga nueva o fiebre que no cede.
        </Alert>

        {/* Follow-up reminder */}
        <Card style={{ background: 'var(--gray-light)', padding: '12px 14px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark-green)', marginBottom: 6 }}>📅 Seguimiento requerido:</p>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
            {especie === 'falciparum' || especie === 'mixed'
              ? 'Control D3, D7 y D28. Notificar a epidemiología dentro de las 24 h.'
              : <>Control D7 (verificación de aclaramiento parasitario){d7Date ? <strong> — {d7Date}</strong> : ''}.</>}
          </p>
        </Card>


        <Btn onClick={() => navigate(isACS ? '/acs/home' : '/hcp/home')}>← Nueva visita</Btn>
      </Screen>
    </>
  );
}
