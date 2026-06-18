import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TopBar, Screen, Btn, Field, Input, Select, Alert, Toggle, RadioPills, Card } from '../components/Layout';
import { AccordionSection, useAccordion } from '../components/Accordion';
import { SEVERITY_SIGNS_HCP, G6PD_NOT_DONE_HCP, HB_INSTRUMENTS, SPECIES_HCP, classifyG6PD } from '../data/constants';

function Checklist({ items, selected, onToggle, noneLabel = 'Ninguno', noneFirst = true }) {
  const noneKey = '__none__';
  const isNone = selected.includes(noneKey);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {noneFirst && (
        <label style={{ alignItems: 'center', background: isNone ? '#e8f9f3' : 'var(--gray-light)', border: `1.5px solid ${isNone ? 'var(--green)' : 'var(--gray-mid)'}`, borderRadius: 10, cursor: 'pointer', display: 'flex', gap: 10, fontSize: 14, fontWeight: 600, padding: '11px 13px' }}>
          <input type="checkbox" checked={isNone} onChange={() => onToggle(noneKey)} style={{ accentColor: 'var(--green)', width: 18, height: 18, flexShrink: 0 }} />
          {noneLabel}
        </label>
      )}
      {items.map((item, i) => {
        const checked = selected.includes(item);
        return (
          <label key={i} style={{ alignItems: 'flex-start', background: checked ? '#fff0f0' : 'var(--gray-light)', border: `1.5px solid ${checked ? 'var(--red)' : 'var(--gray-mid)'}`, borderRadius: 10, cursor: 'pointer', display: 'flex', gap: 10, fontSize: 13, padding: '10px 13px', lineHeight: 1.4 }}>
            <input type="checkbox" checked={checked} onChange={() => onToggle(item)} style={{ accentColor: 'var(--red)', width: 18, height: 18, flexShrink: 0, marginTop: 1 }} />
            {item}
          </label>
        );
      })}
    </div>
  );
}

export default function HCPIntake() {
  const navigate = useNavigate();
  useLocation(); // consumed for future route state
  const { open, toggle } = useAccordion(0);

  // Sec 1: Registro
  const [dni, setDni] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [visitType] = useState('inicial');

  // Sec 2: Epi
  const [diasSx, setDiasSx] = useState('');
  const [lugarOrigen, setLugarOrigen] = useState('residencia');
  const [dept, setDept] = useState('');
  const [prov, setProv] = useState('');
  const [dist, setDist] = useState('');

  // Sec 3: Lab
  const [especie, setEspecie] = useState('');
  const [g6pdDone, setG6pdDone] = useState(null); // true | false | null
  const [g6pdValue, setG6pdValue] = useState('');
  const [g6pdReason, setG6pdReason] = useState('');
  const [hbValue, setHbValue] = useState('');
  const [hbInstrument, setHbInstrument] = useState('');

  // Sec 4: Demo
  const [peso, setPeso] = useState('');
  const [edad, setEdad] = useState('');
  const [edadUnit, setEdadUnit] = useState('años');
  const [sexo, setSexo] = useState('');
  const [gestante, setGestante] = useState(false);
  const [lactante, setLactante] = useState(false);

  // Sec 5: Clinical
  const [severity, setSeverity] = useState([]);

  const [submitError, setSubmitError] = useState('');

  const needsG6PD = ['vivax', 'ovale', 'mixed'].includes(especie);

  function toggleSeverity(item) {
    const noneKey = '__none__';
    if (item === noneKey) {
      setSeverity(prev => prev.includes(noneKey) ? [] : [noneKey]);
    } else {
      setSeverity(prev => {
        const next = prev.filter(s => s !== noneKey);
        return next.includes(item) ? next.filter(s => s !== item) : [...next, item];
      });
    }
  }

  function g6pdClass() {
    if (!g6pdDone || !g6pdValue) return null;
    return classifyG6PD(g6pdValue);
  }
  const g6Class = g6pdClass();
  const g6ClassLabel = { normal: '✓ Normal (≥6.1 U/g Hb)', intermedio: '⚠️ Intermedio (4.1–6.0)', deficiente: '🔴 Deficiente (≤4.0)' };
  const g6ClassColor = { normal: 'var(--green)', intermedio: 'var(--amber)', deficiente: 'var(--red)' };

  function handleSubmit() {
    setSubmitError('');
    if (!dni) { setSubmitError('Ingrese DNI del paciente (Sección 1).'); return; }
    if (!especie) { setSubmitError('Seleccione tipo de malaria (Sección 3 — Laboratorio).'); return; }
    if (!peso) { setSubmitError('Ingrese peso del paciente (Sección 4).'); return; }
    if (!sexo) { setSubmitError('Seleccione sexo del paciente (Sección 4).'); return; }

    // Severe gate
    const realSeverity = severity.filter(s => s !== '__none__');
    if (realSeverity.length > 0) {
      navigate('/severe-referral', { state: { role: 'hcp', patient: { dni, peso, especie, sexo }, severity: realSeverity } });
      return;
    }

    // Pediatric gate
    const ageMonths = edadUnit === 'meses' ? parseFloat(edad) : parseFloat(edad) * 12;
    if (ageMonths < 6 || parseFloat(peso) < 5) {
      navigate('/pediatric-referral', { state: { role: 'hcp', patient: { dni, peso, edad, edadUnit } } });
      return;
    }

    const intake = {
      role: 'hcp',
      dni, nombres, apellidos, fecha, visitType,
      diasSx, lugarOrigen, dept, prov, dist,
      especie, g6pdDone: g6pdDone === true, g6pdValue, g6pdReason, hbValue, hbInstrument,
      peso: parseFloat(peso), edad: parseFloat(edad), ageMonths, edadUnit, sexo,
      pregnant: gestante && sexo === 'F',
      lactating: lactante && sexo === 'F',
      severity: realSeverity,
      tqAvailable: false, // set on treatment page via toggle
    };

    navigate('/treatment', { state: { intake } });
  }

  const sec1Complete = dni && nombres && apellidos && fecha;
  const sec2Complete = diasSx && dept;
  const sec3Complete = especie && (needsG6PD ? g6pdDone !== null : true);
  const sec4Complete = peso && sexo;
  const sec5Complete = severity.length > 0;

  return (
    <>
      <TopBar title="Nueva Visita — HCP" back="/hcp/home" badge="HCP" />
      <Screen>
        <Card style={{ background: 'var(--dark-green)', padding: '11px 14px' }}>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>Complete las 5 secciones y toque <strong>BUSCAR TRATAMIENTO</strong></p>
        </Card>

        {/* ─── S1: Registro ─── */}
        <AccordionSection index={1} title="Registro" subtitle="DNI · nombre · fecha · tipo de visita" isOpen={open === 0} onToggle={() => toggle(0)} complete={sec1Complete}>
          <Field label="DNI del paciente" required>
            <Input value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="8 dígitos" inputMode="numeric" />
          </Field>
          <Field label="Nombres" required>
            <Input value={nombres} onChange={e => setNombres(e.target.value)} placeholder="Ej: Juan Carlos" />
          </Field>
          <Field label="Apellidos" required>
            <Input value={apellidos} onChange={e => setApellidos(e.target.value)} placeholder="Ej: Ríos Pérez" />
          </Field>
          <Field label="Fecha de visita" required>
            <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          </Field>
          <Field label="Tipo de visita">
            <RadioPills options={[{ value: 'inicial', label: 'Inicial' }, { value: 'seguimiento', label: 'Seguimiento' }, { value: 'final', label: 'Verif. Final' }]} value={visitType} onChange={() => {}} />
          </Field>
          <Btn variant="ghost" size="sm" onClick={() => toggle(1)}>Siguiente →</Btn>
        </AccordionSection>

        {/* ─── S2: Epi ─── */}
        <AccordionSection index={2} title="Epidemiológico" subtitle="Inicio de síntomas · lugar de infección" isOpen={open === 1} onToggle={() => toggle(1)} complete={sec2Complete}>
          <Field label="Días desde inicio de síntomas" required>
            <Input type="number" value={diasSx} onChange={e => setDiasSx(e.target.value)} placeholder="Ej: 3" min={0} max={365} />
          </Field>
          <Field label="Lugar probable de infección">
            <RadioPills options={[{ value: 'residencia', label: 'Mismo lugar de residencia' }, { value: 'otro', label: 'Otro lugar ⚠️' }]} value={lugarOrigen} onChange={setLugarOrigen} />
          </Field>
          {lugarOrigen === 'otro' && <Alert type="warning">⚠️ Caso de importación — completar  la Ficha Clínico-Epidemiológica (Anexo N° 07 NTS N° 233).</Alert>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Departamento" required><Input value={dept} onChange={e => setDept(e.target.value)} placeholder="Ej: Loreto" /></Field>
            <Field label="Provincia"><Input value={prov} onChange={e => setProv(e.target.value)} placeholder="Ej: Maynas" /></Field>
          </div>
          <Field label="Distrito"><Input value={dist} onChange={e => setDist(e.target.value)} placeholder="Ej: Iquitos" /></Field>
          <Btn variant="ghost" size="sm" onClick={() => toggle(2)}>Siguiente →</Btn>
        </AccordionSection>

        {/* ─── S3: Lab ─── */}
        <AccordionSection index={3} title="Laboratorio" subtitle="Tipo de malaria · G6PD · Hb" isOpen={open === 2} onToggle={() => toggle(2)} complete={sec3Complete}>
          <Field label="Tipo de malaria" required>
            <Select value={especie} onChange={e => setEspecie(e.target.value)}>
              <option value="">Seleccionar…</option>
              {SPECIES_HCP.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </Field>

          {needsG6PD && (
            <Field label="G6PD realizado">
              <RadioPills options={[{ value: 'si', label: 'Sí, se realizó' }, { value: 'no', label: 'No se realizó' }]} value={g6pdDone === true ? 'si' : g6pdDone === false ? 'no' : ''} onChange={v => setG6pdDone(v === 'si')} />
            </Field>
          )}

          {needsG6PD && g6pdDone === true && (
            <>
              <Field label="Valor G6PD (U/g Hb)" required>
                <Input type="number" value={g6pdValue} onChange={e => setG6pdValue(e.target.value)} placeholder="Ej: 6.8" step="0.1" min={0} max={30} />
              </Field>
              {g6Class && (
                <div style={{ background: g6Class === 'normal' ? '#e8f9f3' : g6Class === 'intermedio' ? '#fff8e6' : '#fff0f0', border: `1.5px solid ${g6ClassColor[g6Class]}`, borderRadius: 10, padding: '8px 12px', fontSize: 13, fontWeight: 700, color: g6ClassColor[g6Class] }}>
                  {g6ClassLabel[g6Class]}
                </div>
              )}
            </>
          )}

          {needsG6PD && g6pdDone === false && (
            <Field label="Razón no realizado">
              <Select value={g6pdReason} onChange={e => setG6pdReason(e.target.value)}>
                <option value="">Seleccionar motivo…</option>
                {G6PD_NOT_DONE_HCP.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>
          )}

          {!needsG6PD && especie && <Alert type="info">G6PD no requerido para {especie === 'falciparum' ? 'P. falciparum' : 'P. malariae'}.</Alert>}

          <Field label="Hemoglobina (g/dL)" hint="Opcional">
            <Input type="number" value={hbValue} onChange={e => setHbValue(e.target.value)} placeholder="Ej: 11.5" step="0.1" min={0} max={25} />
          </Field>
          {hbValue && (
            <Field label="Instrumento Hb">
              <Select value={hbInstrument} onChange={e => setHbInstrument(e.target.value)}>
                <option value="">Seleccionar…</option>
                {HB_INSTRUMENTS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
              </Select>
            </Field>
          )}
          <Btn variant="ghost" size="sm" onClick={() => toggle(3)}>Siguiente →</Btn>
        </AccordionSection>

        {/* ─── S4: Demográfico ─── */}
        <AccordionSection index={4} title="Demográfico" subtitle="Peso · edad · sexo" isOpen={open === 3} onToggle={() => toggle(3)} complete={sec4Complete}>
          <Field label="Peso (kg)" required>
            <Input type="number" value={peso} onChange={e => setPeso(e.target.value)} placeholder="Ej: 65" min={1} max={250} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Edad" required>
              <Input type="number" value={edad} onChange={e => setEdad(e.target.value)} placeholder="Ej: 32" min={0} />
            </Field>
            <Field label="Unidad">
              <RadioPills options={[{ value: 'años', label: 'Años' }, { value: 'meses', label: 'Meses' }]} value={edadUnit} onChange={setEdadUnit} />
            </Field>
          </div>
          <Field label="Sexo" required>
            <RadioPills options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }]} value={sexo} onChange={setSexo} />
          </Field>
          {sexo === 'F' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--gray-light)', borderRadius: 10, padding: '12px' }}>
              <Toggle checked={gestante} onChange={() => setGestante(v => !v)} label="¿Gestante?" />
              <Toggle checked={lactante} onChange={() => setLactante(v => !v)} label="¿Lactante?" />
            </div>
          )}
          <Btn variant="ghost" size="sm" onClick={() => toggle(4)}>Siguiente →</Btn>
        </AccordionSection>

        {/* ─── S5: Clínico ─── */}
        <AccordionSection index={5} title="Clínico — Signos de gravedad" subtitle="Seleccione Ninguno si no hay signos de alarma" isOpen={open === 4} onToggle={() => toggle(4)} complete={sec5Complete}>
          {severity.filter(s => s !== '__none__').length > 0 && (
            <Alert type="error">⚠️ <strong>{severity.filter(s => s !== '__none__').length} signo(s) de alarma</strong> — Esta visita se clasificará como MALARIA GRAVE.</Alert>
          )}
          <Checklist items={SEVERITY_SIGNS_HCP} selected={severity} onToggle={toggleSeverity} noneLabel="✓ Ninguno de los anteriores" />
        </AccordionSection>

        {submitError && <Alert type="error">{submitError}</Alert>}

        <Btn size="lg" onClick={handleSubmit}>BUSCAR TRATAMIENTO</Btn>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>NTS N°233-MINSA/DGIESP-2025 · Confirme dosis con criterio clínico</p>
      </Screen>
    </>
  );
}
