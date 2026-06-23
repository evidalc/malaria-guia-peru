import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TopBar, Screen, Btn, Field, Input, Select, Alert, Card } from '../components/Layout';
import { AccordionSection, useAccordion } from '../components/Accordion';
import {
  SEVERITY_SIGNS_ACS, AHA_SIGNS_ACS, SPECIES_ACS, CLEARANCE_NOT_DONE_ACS,
  EPISODE_STATUS_FOLLOWUP, EPISODE_STATUS_VERIFICATION,
  ADHERENCE_OPTIONS_ACS, ADHERENCE_INCOMPLETE_REASONS_ACS,
} from '../data/constants';

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

function DangerBtn({ label, icon, active, onClick, color = 'var(--red)', bgActive = '#fff0f0' }) {
  return (
    <button onClick={onClick} style={{ alignItems: 'center', background: active ? bgActive : '#fff', border: `2px solid ${active ? color : 'var(--gray-mid)'}`, borderRadius: 14, color: active ? color : 'var(--text)', cursor: 'pointer', display: 'flex', gap: 12, fontSize: 15, fontWeight: active ? 700 : 400, padding: '13px 14px', textAlign: 'left', width: '100%', transition: 'all .15s', minHeight: 52 }}>
      <span style={{ fontSize: 26, flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, lineHeight: 1.3 }}>{label}</span>
      <div style={{ alignItems: 'center', background: active ? color : 'var(--gray-light)', borderRadius: 8, color: active ? '#fff' : 'var(--gray-mid)', display: 'flex', fontSize: 14, fontWeight: 700, height: 28, justifyContent: 'center', width: 28, flexShrink: 0 }}>{active ? '✓' : ''}</div>
    </button>
  );
}

function DisabledSection({ message }) {
  return (
    <div style={{ background: 'var(--gray-light)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>{message}</p>
    </div>
  );
}

const DANGER_ICONS = ['🚶', '⚡', '😮‍💨', '🤮', '🟡', '🩸', '🟫', '🍬'];
const AHA_ICONS_FALLBACK = ['🟫', '🟡', '😶', '😮‍💨', '🔲', '💓', '🌡️'];

export default function ACSIntake() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { open, toggle } = useAccordion(0);

  // S1: Registro
  const [dni, setDni] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fecha] = useState(new Date().toISOString().slice(0, 10));
  const [visitType, setVisitType] = useState('inicial');

  // S2: Epi (Rama A only)
  const [diasSx, setDiasSx] = useState('');
  const [comunidad, setComunidad] = useState('');

  // S3: Lab (Rama A: species; Rama C: parasitemia)
  const [especie, setEspecie] = useState('');
  const [clearanceDone, setClearanceDone] = useState(null);
  const [clearanceResult, setClearanceResult] = useState('');
  const [clearanceReason, setClearanceReason] = useState('');

  // S4: Demo
  const [peso, setPeso] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [gestante, setGestante] = useState(false);
  const [lactante, setLactante] = useState(false);
  const [demoConfirmed, setDemoConfirmed] = useState(false);

  // S5: Clinical
  const [severity, setSeverity] = useState([]);
  const [ahaSigns, setAhaSigns] = useState([]);
  const [adherence, setAdherence] = useState('');
  const [adherenceReason, setAdherenceReason] = useState('');

  // S6: Episode status (Rama B & C)
  const [episodeStatus, setEpisodeStatus] = useState('');

  const [submitError, setSubmitError] = useState('');

  const isInicial = visitType === 'inicial';
  const isSeguimiento = visitType === 'seguimiento';
  const isFinal = visitType === 'final';
  const isOverrideStatus = episodeStatus === 'perdido' || episodeStatus === 'fallecido';

  function toggleList(setter) {
    return (item) => {
      const noneKey = '__none__';
      if (item === noneKey) {
        setter(prev => prev.includes(noneKey) ? [] : [noneKey]);
      } else {
        setter(prev => {
          const next = prev.filter(s => s !== noneKey);
          return next.includes(item) ? next.filter(s => s !== item) : [...next, item];
        });
      }
    };
  }

  function handleSubmit() {
    setSubmitError('');
    if (!dni) { setSubmitError('Ingresa el DNI del paciente (paso 1).'); return; }

    if (isInicial) {
      if (!especie) { setSubmitError('Selecciona el resultado de la prueba rápida (paso 3).'); return; }
      if (!peso) { setSubmitError('Ingresa el peso del paciente (paso 4).'); return; }
      if (!sexo) { setSubmitError('Selecciona si el paciente es hombre o mujer (paso 4).'); return; }

      const realSeverity = severity.filter(s => s !== '__none__');
      if (realSeverity.length > 0) {
        navigate('/severe-referral', { state: { role: 'acs', patient: { dni, peso, especie, sexo }, severity: realSeverity, ipress: state?.ipress } });
        return;
      }

      const ageMonths = 12 * (parseFloat(edad) || 99);
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

    if (isSeguimiento) {
      if (severity.length === 0) { setSubmitError('Completa las señales de peligro (paso 5).'); return; }
      if (!episodeStatus) { setSubmitError('Selecciona el estado del paciente (paso 6).'); return; }

      const realSeverity = severity.filter(s => s !== '__none__');
      if (realSeverity.length > 0) {
        navigate('/severe-referral', { state: { role: 'acs', patient: { dni, peso, especie, sexo }, severity: realSeverity, ipress: state?.ipress } });
        return;
      }

      navigate('/acs/home');
    }

    if (isFinal) {
      if (!episodeStatus) { setSubmitError('Selecciona el estado del paciente (paso 6).'); return; }
      if (!isOverrideStatus) {
        if (clearanceDone === null) { setSubmitError('Indica si se hizo la prueba rápida (paso 3).'); return; }
        if (severity.length === 0) { setSubmitError('Completa las señales de peligro (paso 5).'); return; }
      }

      const realSeverity = severity.filter(s => s !== '__none__');
      if (realSeverity.length > 0) {
        navigate('/severe-referral', { state: { role: 'acs', patient: { dni, peso, especie, sexo }, severity: realSeverity, ipress: state?.ipress } });
        return;
      }

      navigate('/acs/home');
    }
  }

  const sec1Complete = dni && nombres && apellidos;
  const sec2Complete = isInicial ? (diasSx || comunidad) : true;
  const sec3Complete = isInicial ? !!especie : isFinal ? (isOverrideStatus || clearanceDone !== null) : true;
  const sec4Complete = isInicial ? (peso && sexo) : (isSeguimiento ? demoConfirmed : true);
  const sec5Complete = isInicial
    ? severity.length > 0
    : (isOverrideStatus || (severity.length > 0 && (isFinal ? !!adherence : true)));
  const sec6Complete = !!episodeStatus;

  const submitLabel = isInicial ? 'VER QUÉ MEDICAMENTO DAR →' : isSeguimiento ? 'REGISTRAR VISITA DE SEGUIMIENTO' : 'REGISTRAR VISITA DE VERIFICACIÓN';
  const topInstruction = isInicial
    ? <>Toca cada paso. Al final toca <strong>VER MEDICAMENTO</strong>.</>
    : isSeguimiento
      ? <>Completa los pasos y toca <strong>REGISTRAR SEGUIMIENTO</strong>.</>
      : <>Completa los pasos y toca <strong>REGISTRAR VERIFICACIÓN</strong>.</>;

  return (
    <>
      <TopBar title="Nueva Visita" back="/acs/home" badge="PS" />
      <Screen>
        <Card style={{ background: 'var(--dark-green)', padding: '12px 14px' }}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{topInstruction}</p>
        </Card>

        {/* ─── S1: ¿Quién es el paciente? ─── */}
        <AccordionSection index={1} title="¿Quién es el paciente?" subtitle="DNI · nombre · tipo de visita" isOpen={open === 0} onToggle={() => toggle(0)} complete={sec1Complete}>
          <Field label="DNI del paciente" hint="8 dígitos de su documento">
            <Input value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="Ej: 12345678" inputMode="numeric" large />
          </Field>
          {isInicial ? (
            <>
              <Field label="Nombres">
                <Input value={nombres} onChange={e => setNombres(e.target.value)} placeholder="Ej: Juan Carlos" large />
              </Field>
              <Field label="Apellidos">
                <Input value={apellidos} onChange={e => setApellidos(e.target.value)} placeholder="Ej: Ríos Pérez" large />
              </Field>
            </>
          ) : nombres ? (
            <div style={{ background: 'var(--gray-light)', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Paciente: <strong style={{ color: 'var(--text)' }}>{apellidos}, {nombres}</strong></p>
            </div>
          ) : null}
          <Field label="Fecha de hoy"><Input type="date" value={fecha} readOnly large /></Field>
          <Field label="Tipo de visita">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <BigBtn label="Visita inicial" icon="📋" active={visitType === 'inicial'} onClick={() => setVisitType('inicial')} />
              <BigBtn label="Seguimiento" icon="🔄" active={visitType === 'seguimiento'} onClick={() => setVisitType('seguimiento')} />
              <BigBtn label="Verificación final" icon="✅" active={visitType === 'final'} onClick={() => setVisitType('final')} />
            </div>
          </Field>
          <Btn variant="ghost" size="sm" onClick={() => toggle(1)}>Siguiente →</Btn>
        </AccordionSection>

        {/* ─── S2: ¿De dónde viene? (Rama A only) ─── */}
        <AccordionSection index={2} title="¿De dónde viene?" subtitle={isInicial ? 'Comunidad y cuánto tiempo con fiebre' : 'No aplica en esta visita'} isOpen={open === 1} onToggle={() => toggle(1)} complete={sec2Complete}>
          {isInicial ? (
            <>
              <Field label="¿De qué comunidad o caserío viene?">
                <Input value={comunidad} onChange={e => setComunidad(e.target.value)} placeholder="Nombre del caserío o comunidad" large />
              </Field>
              <Field label="¿Cuántos días lleva con fiebre?">
                <Input type="number" value={diasSx} onChange={e => setDiasSx(e.target.value)} placeholder="Ej: 3" inputMode="numeric" large />
              </Field>
              <Btn variant="ghost" size="sm" onClick={() => toggle(2)}>Siguiente →</Btn>
            </>
          ) : (
            <DisabledSection message={isSeguimiento ? 'No aplica en visita de seguimiento' : 'No aplica en visita de verificación'} />
          )}
        </AccordionSection>

        {/* ─── S3: Prueba / Lab ─── */}
        <AccordionSection index={3} title={isInicial ? 'Resultado de la prueba rápida' : isFinal ? '¿Se hizo prueba rápida?' : 'Laboratorio'} subtitle={isInicial ? '¿Qué encontró la prueba rápida?' : isFinal ? 'Verificación de parásitos' : 'No aplica'} isOpen={open === 2} onToggle={() => toggle(2)} complete={sec3Complete}>
          {isInicial && (
            <>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.4 }}>¿Qué tipo de parásito encontró la prueba rápida?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SPECIES_ACS.map(s => (
                  <BigBtn key={s.value} label={s.label} icon={s.value === 'vivax' ? '🟢' : s.value === 'falciparum' ? '🟡' : '🟠'} sub={s.value === 'vivax' ? 'Malaria vivax' : s.value === 'falciparum' ? 'Malaria falciparum' : 'Infección mixta'} active={especie === s.value} onClick={() => setEspecie(s.value)} />
                ))}
              </div>
              <Btn variant="ghost" size="sm" onClick={() => toggle(3)}>Siguiente →</Btn>
            </>
          )}

          {isSeguimiento && (
            <DisabledSection message="No aplica en visita de seguimiento" />
          )}

          {isFinal && !isOverrideStatus && (
            <>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 8 }}>¿Le hiciste la prueba rápida al paciente?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <BigBtn label="Sí, le hice la prueba" icon="🔬" active={clearanceDone === true} onClick={() => setClearanceDone(true)} />
                <BigBtn label="No, no le hice la prueba" icon="❌" active={clearanceDone === false} onClick={() => setClearanceDone(false)} />
              </div>
              {clearanceDone === true && (
                <>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12, marginBottom: 8 }}>¿Qué salió en la prueba?</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <BigBtn label="Negativa — sin parásitos" icon="✅" sub="El paciente ya no tiene malaria" active={clearanceResult === 'negativa'} onClick={() => setClearanceResult('negativa')} />
                    <BigBtn label="Positiva — todavía tiene parásitos" icon="⚠️" sub="Consulta con tu establecimiento" active={clearanceResult === 'positiva'} onClick={() => setClearanceResult('positiva')} />
                  </div>
                  {clearanceResult === 'negativa' && (
                    <Alert type="info">✅ ¡Buena noticia! El paciente puede recibir el <strong>alta</strong>.</Alert>
                  )}
                  {clearanceResult === 'positiva' && (
                    <Alert type="error">⚠️ El paciente todavía tiene parásitos. <strong>Llama a tu establecimiento</strong> para saber qué hacer.</Alert>
                  )}
                </>
              )}
              {clearanceDone === false && (
                <Field label="¿Por qué no?">
                  <Select value={clearanceReason} onChange={e => setClearanceReason(e.target.value)}>
                    <option value="">Seleccionar motivo…</option>
                    {CLEARANCE_NOT_DONE_ACS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </Field>
              )}
              <Btn variant="ghost" size="sm" onClick={() => toggle(3)}>Siguiente →</Btn>
            </>
          )}

          {isFinal && isOverrideStatus && (
            <DisabledSection message={`No necesario — marcaste "${episodeStatus}"`} />
          )}
        </AccordionSection>

        {/* ─── S4: Datos del paciente ─── */}
        <AccordionSection index={4} title="Datos del paciente" subtitle={isInicial ? 'Peso, edad y sexo' : 'Datos de la primera visita'} isOpen={open === 3} onToggle={() => toggle(3)} complete={sec4Complete}>
          {isInicial ? (
            <>
              <Field label="Peso en kilogramos (kg)" required hint="Pesa al paciente si tienes balanza. Si no, pregúntale cuánto pesa.">
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
            </>
          ) : isSeguimiento ? (
            <>
              <Alert type="info">Datos de la primera visita. Revisa si algo cambió.</Alert>
              <div style={{ background: 'var(--gray-light)', borderRadius: 12, padding: '12px 14px', opacity: 0.6 }}>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Peso: <strong>{peso || '—'} kg</strong> · Edad: <strong>{edad || '—'} años</strong> · Sexo: <strong>{sexo === 'M' ? 'Hombre' : sexo === 'F' ? 'Mujer' : '—'}</strong></p>
              </div>
              {sexo === 'F' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#fff8e6', border: '1.5px solid var(--amber)', borderRadius: 12, padding: '12px 14px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)' }}>¿Cambió algo? (puede haber cambiado)</p>
                  <BigBtn label="Está embarazada" icon="🤰" active={gestante} onClick={() => setGestante(v => !v)} />
                  <BigBtn label="Está dando de lactar" icon="🤱" active={lactante} onClick={() => setLactante(v => !v)} />
                </div>
              )}
              <BigBtn label="Confirmo que los datos están bien" icon="✅" active={demoConfirmed} onClick={() => setDemoConfirmed(v => !v)} />
            </>
          ) : (
            <>
              <DisabledSection message="Datos de la primera visita (no se cambian en verificación)" />
              {peso && <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>Peso: {peso} kg · Edad: {edad} años · Sexo: {sexo === 'M' ? 'Hombre' : sexo === 'F' ? 'Mujer' : '—'}</p>}
            </>
          )}
          <Btn variant="ghost" size="sm" onClick={() => toggle(4)}>Siguiente →</Btn>
        </AccordionSection>

        {/* ─── S5: Señales de peligro / AHA / Adherencia ─── */}
        <AccordionSection
          index={5}
          title={isInicial ? '¿Tiene señales de peligro?' : '¿Cómo está el paciente?'}
          subtitle={isInicial ? 'Marca las que tiene AHORA el paciente' : 'Señales de peligro · reacciones al medicamento' + (isFinal ? ' · ¿tomó las pastillas?' : '')}
          isOpen={open === 4}
          onToggle={() => toggle(4)}
          complete={sec5Complete}
        >
          {isFinal && isOverrideStatus ? (
            <DisabledSection message={`No necesario — marcaste "${episodeStatus}"`} />
          ) : (
            <>
              {/* Adherence (Rama C only) */}
              {isFinal && (
                <>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark-green)', marginBottom: 8 }}>¿Tomó todas las pastillas?</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    {ADHERENCE_OPTIONS_ACS.map(a => (
                      <BigBtn key={a.value} label={a.label} active={adherence === a.value} onClick={() => { setAdherence(a.value); if (a.value !== 'incompleto') setAdherenceReason(''); }} />
                    ))}
                  </div>
                  {adherence === 'incompleto' && (
                    <Field label="¿Por qué no terminó?">
                      <Select value={adherenceReason} onChange={e => setAdherenceReason(e.target.value)}>
                        <option value="">Seleccionar…</option>
                        {ADHERENCE_INCOMPLETE_REASONS_ACS.map(r => <option key={r} value={r}>{r}</option>)}
                      </Select>
                    </Field>
                  )}
                </>
              )}

              {/* Severity signs */}
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--red)', marginBottom: 8, marginTop: isFinal ? 10 : 0 }}>Señales de peligro</p>
              {severity.filter(s => s !== '__none__').length > 0 && (
                <Alert type="error">⚠️ <strong>¡ATENCIÓN!</strong> Marcaste {severity.filter(s => s !== '__none__').length} señal(es) de peligro. {isInicial ? 'Este paciente necesita ir al establecimiento YA.' : 'Referencia urgente.'}</Alert>
              )}
              <BigBtn label="Ninguna de las anteriores" icon="✅" sub="El paciente no tiene señales de peligro" active={severity.includes('__none__')} onClick={() => toggleList(setSeverity)('__none__')} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SEVERITY_SIGNS_ACS.map((sign, i) => (
                  <DangerBtn key={i} label={sign} icon={DANGER_ICONS[i] || '🔴'} active={severity.includes(sign)} onClick={() => toggleList(setSeverity)(sign)} />
                ))}
              </div>

              {/* AHA signs (Rama B & C) */}
              {!isInicial && (
                <>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--amber)', marginTop: 16, marginBottom: 8 }}>¿Tiene reacciones al medicamento?</p>
                  {ahaSigns.filter(s => s !== '__none__').length > 0 && (
                    <Alert type="warning">
                      ⚠️ <strong>{ahaSigns.filter(s => s !== '__none__').length} reacción(es) detectada(s)</strong> —
                      {isSeguimiento
                        ? ' Deja de darle la primaquina. Llama al establecimiento.'
                        : ' Llama al establecimiento.'}
                    </Alert>
                  )}
                  <BigBtn label="Ninguna reacción" icon="✅" sub="El paciente no tiene reacciones" active={ahaSigns.includes('__none__')} onClick={() => toggleList(setAhaSigns)('__none__')} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {AHA_SIGNS_ACS.map((sign, i) => (
                      <DangerBtn
                        key={i}
                        label={sign.label}
                        icon={sign.icon || AHA_ICONS_FALLBACK[i]}
                        active={ahaSigns.includes(sign.label)}
                        onClick={() => toggleList(setAhaSigns)(sign.label)}
                        color="var(--amber)"
                        bgActive="#fff8e6"
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </AccordionSection>

        {/* ─── S6: Estado del paciente (Rama B & C) ─── */}
        {!isInicial && (
          <AccordionSection index={6} title="¿Qué pasa con el paciente?" subtitle="Selecciona el estado actual" isOpen={open === 5} onToggle={() => toggle(5)} complete={sec6Complete}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(isSeguimiento ? EPISODE_STATUS_FOLLOWUP : EPISODE_STATUS_VERIFICATION).map(s => (
                <BigBtn
                  key={s.value}
                  label={s.label}
                  icon={s.value === 'alta' ? '🏠' : s.value === 'continuar' ? '🔄' : s.value === 'perdido' ? '❓' : s.value === 'referido' ? '🏥' : '🕊️'}
                  active={episodeStatus === s.value}
                  onClick={() => setEpisodeStatus(s.value)}
                />
              ))}
            </div>
            {isFinal && isOverrideStatus && (
              <Alert type="info">Al marcar {episodeStatus === 'perdido' ? '"Perdido"' : '"Fallecido"'}, no necesitas completar los pasos de prueba rápida ni señales de peligro.</Alert>
            )}
          </AccordionSection>
        )}

        {submitError && <Alert type="error">{submitError}</Alert>}

        <Btn size="lg" style={{ background: 'var(--green)', fontSize: 18, padding: '18px', borderRadius: 16 }} onClick={handleSubmit}>
          {submitLabel}
        </Btn>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>NTS N°233 MINSA 2025 · Confirma con el establecimiento de salud</p>
      </Screen>
    </>
  );
}
