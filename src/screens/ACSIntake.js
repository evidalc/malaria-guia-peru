import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TopBar, Screen, Btn, Field, Input, Alert, Card } from '../components/Layout';
import { AccordionSection, useAccordion } from '../components/Accordion';
import { SEVERITY_SIGNS_ACS, SPECIES_ACS } from '../data/constants';

function BigBtn({ label, sub, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{ alignItems: 'center', background: active ? 'var(--green)' : '#fff', border: `2px solid ${active ? 'var(--green)' : 'var(--gray-mid)'}`, borderRadius: 14, color: active ? '#fff' : 'var(--text)', cursor: 'pointer', display: 'flex', gap: 12, padding: '15px 14px', textAlign: 'left', width: '100%', transition: 'all .15s' }}>
      {icon && <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>}
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: 16, fontWeight: 700 }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 12, opacity: active ? 0.85 : 0.7, marginTop: 1 }}>{sub}</span>}
      </span>
      {active && <span style={{ fontSize: 20, fontWeight: 700 }}>✓</span>}
    </button>
  );
}

function DangerBtn({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{ alignItems: 'center', background: active ? '#fff0f0' : '#fff', border: `2px solid ${active ? 'var(--red)' : 'var(--gray-mid)'}`, borderRadius: 14, color: active ? 'var(--red)' : 'var(--text)', cursor: 'pointer', display: 'flex', gap: 12, fontSize: 15, fontWeight: active ? 700 : 400, padding: '13px 14px', textAlign: 'left', width: '100%', transition: 'all .15s', minHeight: 52 }}>
      <span style={{ fontSize: 26, flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, lineHeight: 1.3 }}>{label}</span>
      <div style={{ alignItems: 'center', background: active ? 'var(--red)' : 'var(--gray-light)', borderRadius: 8, color: active ? '#fff' : 'var(--gray-mid)', display: 'flex', fontSize: 14, fontWeight: 700, height: 28, justifyContent: 'center', width: 28, flexShrink: 0 }}>{active ? '✓' : ''}</div>
    </button>
  );
}

const DANGER_ICONS = ['🚶', '⚡', '😮‍💨', '🤮', '🟡', '🩸', '🟫', '🍬'];

export default function ACSIntake() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { open, toggle } = useAccordion(0);

  // S1: Registro
  const [dni, setDni] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fecha] = useState(new Date().toISOString().slice(0, 10));

  // S2: Epi
  const [diasSx, setDiasSx] = useState('');
  const [comunidad, setComunidad] = useState('');

  // S3: Lab
  const [especie, setEspecie] = useState('');

  // S4: Demo
  const [peso, setPeso] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [gestante, setGestante] = useState(false);
  const [lactante, setLactante] = useState(false);

  // S5: Clinical
  const [severity, setSeverity] = useState([]);

  const [submitError, setSubmitError] = useState('');

  function toggleSev(item) {
    if (item === '__none__') {
      setSeverity(prev => prev.includes('__none__') ? [] : ['__none__']);
    } else {
      setSeverity(prev => {
        const next = prev.filter(s => s !== '__none__');
        return next.includes(item) ? next.filter(s => s !== item) : [...next, item];
      });
    }
  }

  function handleSubmit() {
    setSubmitError('');
    if (!peso) { setSubmitError('Ingresa el peso del paciente (paso 4).'); return; }
    if (!especie) { setSubmitError('Selecciona el resultado de la prueba (paso 3).'); return; }
    if (!sexo) { setSubmitError('Selecciona si el paciente es hombre o mujer (paso 4).'); return; }

    const realSeverity = severity.filter(s => s !== '__none__');
    if (realSeverity.length > 0) {
      navigate('/severe-referral', { state: { role: 'acs', patient: { dni, peso, especie, sexo }, severity: realSeverity, ipress: state?.ipress } });
      return;
    }

    const ageMonths = 12 * (parseFloat(edad) || 99); // ACS records age in años
    if (parseFloat(peso) < 5 || ageMonths < 6) {
      navigate('/pediatric-referral', { state: { role: 'acs', patient: { dni, peso, edad } } });
      return;
    }

    navigate('/treatment', {
      state: {
        intake: {
          role: 'acs', dni, nombres, apellidos, fecha,
          diasSx, comunidad,
          especie, g6pdDone: false, g6pdValue: '',
          peso: parseFloat(peso), edad: parseFloat(edad), ageMonths, edadUnit: 'años', sexo,
          pregnant: gestante && sexo === 'F',
          lactating: lactante && sexo === 'F',
          severity: realSeverity,
          tqAvailable: false,
        },
      },
    });
  }

  const sec1Complete = dni && nombres && apellidos;
  const sec2Complete = diasSx || comunidad;
  const sec3Complete = !!especie;
  const sec4Complete = peso && sexo;
  const sec5Complete = severity.length > 0;

  return (
    <>
      <TopBar title="Nueva Visita" back="/acs/home" badge="ACS" />
      <Screen>
        <Card style={{ background: 'var(--dark-green)', padding: '12px 14px' }}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Toca cada paso. Al final toca <strong>VER MEDICAMENTO</strong>.</p>
        </Card>

        {/* S1: Registro */}
        <AccordionSection index={1} title="¿Quién es el paciente?" subtitle="DNI · nombre · fecha" isOpen={open === 0} onToggle={() => toggle(0)} complete={sec1Complete}>
          <Field label="DNI del paciente" hint="8 dígitos de su documento">
            <Input value={dni} onChange={e => setDni(e.target.value.replace(/\D/g,'').slice(0,8))} placeholder="Ej: 12345678" inputMode="numeric" large />
          </Field>
          <Field label="Nombres">
            <Input value={nombres} onChange={e => setNombres(e.target.value)} placeholder="Ej: Juan Carlos" large />
          </Field>
          <Field label="Apellidos">
            <Input value={apellidos} onChange={e => setApellidos(e.target.value)} placeholder="Ej: Ríos Pérez" large />
          </Field>
          <Field label="Fecha de hoy"><Input type="date" value={fecha} readOnly large /></Field>
          <Btn variant="ghost" size="sm" onClick={() => toggle(1)}>Siguiente →</Btn>
        </AccordionSection>

        {/* S2: Epi */}
        <AccordionSection index={2} title="¿De dónde viene?" subtitle="Comunidad y cuánto tiempo con fiebre" isOpen={open === 1} onToggle={() => toggle(1)} complete={sec2Complete}>
          <Field label="¿De qué comunidad o caserío viene?">
            <Input value={comunidad} onChange={e => setComunidad(e.target.value)} placeholder="Nombre del caserío o comunidad" large />
          </Field>
          <Field label="¿Cuántos días lleva con fiebre?">
            <Input type="number" value={diasSx} onChange={e => setDiasSx(e.target.value)} placeholder="Ej: 3" inputMode="numeric" large />
          </Field>
          <Btn variant="ghost" size="sm" onClick={() => toggle(2)}>Siguiente →</Btn>
        </AccordionSection>

        {/* S3: Lab */}
        <AccordionSection index={3} title="Resultado de la prueba" subtitle="¿Qué encontró la gota gruesa o PDR?" isOpen={open === 2} onToggle={() => toggle(2)} complete={sec3Complete}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.4 }}>¿Qué tipo de parásito encontró la prueba?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SPECIES_ACS.map(s => (
              <BigBtn key={s.value} label={s.label} icon={s.value === 'vivax' ? '🟢' : s.value === 'falciparum' ? '🟡' : '🟠'} sub={s.value === 'vivax' ? 'Malaria vivax' : s.value === 'falciparum' ? 'Malaria falciparum' : 'Infección mixta'} active={especie === s.value} onClick={() => setEspecie(s.value)} />
            ))}
          </div>
          <Btn variant="ghost" size="sm" onClick={() => toggle(3)}>Siguiente →</Btn>
        </AccordionSection>

        {/* S4: Demo */}
        <AccordionSection index={4} title="Datos del paciente" subtitle="Peso, edad y sexo" isOpen={open === 3} onToggle={() => toggle(3)} complete={sec4Complete}>
          <Field label="Peso en kilogramos (kg)" required hint="Pesa al paciente si puedes">
            <Input type="number" value={peso} onChange={e => setPeso(e.target.value)} placeholder="Ej: 60" inputMode="decimal" large style={{ fontSize: 24, fontWeight: 700, padding: '15px 14px' }} />
          </Field>
          <Field label="Edad (años)">
            <Input type="number" value={edad} onChange={e => setEdad(e.target.value)} placeholder="Ej: 35" inputMode="numeric" large />
          </Field>
          <Field label="¿Es hombre o mujer?" required>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <BigBtn label="Hombre" icon="👨" active={sexo === 'M'} onClick={() => setSexo('M')} />
              <BigBtn label="Mujer" icon="👩" active={sexo === 'F'} onClick={() => setSexo('F')} />
            </div>
          </Field>
          {sexo === 'F' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--gray-light)', borderRadius: 12, padding: '12px 14px' }}>
              <BigBtn label="Está embarazada" icon="🤰" active={gestante} onClick={() => setGestante(v => !v)} />
              <BigBtn label="Está dando de lactar" icon="🤱" active={lactante} onClick={() => setLactante(v => !v)} />
            </div>
          )}
          <Btn variant="ghost" size="sm" onClick={() => toggle(4)}>Siguiente →</Btn>
        </AccordionSection>

        {/* S5: Signos */}
        <AccordionSection index={5} title="¿Tiene señales de peligro?" subtitle="Toca las que tiene AHORA el paciente" isOpen={open === 4} onToggle={() => toggle(4)} complete={sec5Complete}>
          {severity.filter(s => s !== '__none__').length > 0 && (
            <Alert type="error">⚠️ <strong>¡ATENCIÓN!</strong> Marcaste {severity.filter(s => s !== '__none__').length} señal(es) de peligro. Este paciente necesita ir al establecimiento YA.</Alert>
          )}
          <BigBtn label="Ninguna de las anteriores" icon="✅" sub="El paciente no tiene señales de peligro" active={severity.includes('__none__')} onClick={() => toggleSev('__none__')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SEVERITY_SIGNS_ACS.map((sign, i) => (
              <DangerBtn key={i} label={sign} icon={DANGER_ICONS[i] || '🔴'} active={severity.includes(sign)} onClick={() => toggleSev(sign)} />
            ))}
          </div>
        </AccordionSection>

        {submitError && <Alert type="error">{submitError}</Alert>}

        <Btn size="lg" style={{ background: 'var(--green)', fontSize: 18, padding: '18px', borderRadius: 16 }} onClick={handleSubmit}>
          VER QUÉ MEDICAMENTO DAR →
        </Btn>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>NTS N°233 MINSA 2025 · Confirma con el establecimiento de salud</p>
      </Screen>
    </>
  );
}
