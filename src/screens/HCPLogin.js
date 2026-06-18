import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card, Btn, Field, Input, Alert } from '../components/Layout';

export default function HCPLogin() {
  const navigate = useNavigate();
  const [ipress, setIpress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function submit(e) {
    e.preventDefault();
    setError('');
    if (!ipress || !password) { setError('Ingrese código IPRESS y contraseña.'); return; }
    setBusy(true);
    setTimeout(() => {
      if (ipress === '12345678' && password === 'ABC') {
        navigate('/hcp/home', { state: { ipress, role: 'hcp' } });
      } else {
        setError('Código IPRESS o contraseña incorrectos.');
        setBusy(false);
      }
    }, 500);
  }

  return (
    <>
      <TopBar title="Acceso — Profesional de Salud" back="/" badge="HCP" />
      <Screen>
        <div style={{ textAlign: 'center', padding: '10px 0 2px' }}>
          <div style={{ fontSize: 44 }}>🩺</div>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark-green)', marginTop: 6 }}>Establecimiento de Salud</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Credenciales asignadas por CDC-Perú</p>
        </div>

        <Card>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Código IPRESS" hint="Asignado por CDC-Perú a su establecimiento">
              <Input value={ipress} onChange={e => setIpress(e.target.value)} placeholder="Ej: 12345678" autoComplete="username" />
            </Field>
            <Field label="Contraseña">
              <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" autoComplete="current-password" />
            </Field>
            {error && <Alert type="error">{error}</Alert>}
            <Btn type="submit" size="lg" disabled={busy}>{busy ? 'Verificando…' : 'Ingresar'}</Btn>
          </form>
        </Card>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          ¿Olvidó su contraseña?{' '}
          <span style={{ color: 'var(--blue)', fontWeight: 600 }}>Contacte a CDC-Perú para restablecer su acceso</span>
        </p>

        <Alert type="info">
          <strong>Prototipo:</strong> Ingrese IPRESS <code>12345678</code> · Contraseña <code>ABC</code>
        </Alert>
      </Screen>
    </>
  );
}
