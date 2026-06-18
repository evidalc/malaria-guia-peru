import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Field, Input, Alert } from '../components/Layout';

export default function ACSLogin() {
  const navigate = useNavigate();
  const [dni, setDni] = useState('');
  const [ipress, setIpress] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function submit(e) {
    e.preventDefault();
    setError('');
    if (!dni || !ipress) { setError('Ingresa tu DNI y el código de tu establecimiento.'); return; }
    if (dni.length !== 8) { setError('El DNI debe tener exactamente 8 dígitos.'); return; }
    setBusy(true);
    setTimeout(() => {
      if (dni === '12345678' && ipress === '12345678') {
        navigate('/acs/home', { state: { dni, ipress, role: 'acs' } });
      } else {
        setError('DNI o código de establecimiento incorrecto.');
        setBusy(false);
      }
    }, 500);
  }

  return (
    <>
      <TopBar title="Acceso — Agente Comunitario" back="/" badge="ACS" />
      <Screen>
        <div style={{ textAlign: 'center', padding: '10px 0 2px' }}>
          <div style={{ fontSize: 44 }}>🏘️</div>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark-green)', marginTop: 6 }}>Agente de Salud Comunitario</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Tu DNI + código de tu establecimiento de referencia</p>
        </div>

        <Card>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Tu DNI (8 dígitos)" hint="Número de tu documento de identidad">
              <Input value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="Ej: 12345678" inputMode="numeric" large />
            </Field>
            <Field label="Código del establecimiento (IPRESS)" hint="Te lo da el responsable de malaria de tu IPRESS">
              <Input value={ipress} onChange={e => setIpress(e.target.value)} placeholder="Ej: 12345678" large />
            </Field>
            {error && <Alert type="error">{error}</Alert>}
            <Btn type="submit" size="lg" disabled={busy}>{busy ? 'Verificando…' : '✓ Entrar'}</Btn>
          </form>
        </Card>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          ¿Problemas para entrar?{' '}
          <span style={{ color: 'var(--blue)', fontWeight: 600 }}>Contacta al responsable de malaria de tu establecimiento</span>
        </p>

        <Alert type="info">
          <strong>Prototipo:</strong> DNI <code>12345678</code> · IPRESS <code>12345678</code>
        </Alert>
      </Screen>
    </>
  );
}
