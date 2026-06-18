import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar, Screen, Card } from '../components/Layout';

export default function RecursosHub() {
  const navigate = useNavigate();
  const [errorInput, setErrorInput] = useState('');

  return (
    <>
      <TopBar title="Recursos" back={-1} />
      <Screen>
        {/* G6PD analyzer error lookup */}
        <Card style={{ padding: '16px' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark-green)', marginBottom: 4 }}>🔬 Analizador G6PD — Código de error</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
            Ingrese el mensaje o código de error que aparece en el analizador para saber qué significa y qué hacer.
          </p>
          <input
            value={errorInput}
            onChange={e => setErrorInput(e.target.value)}
            placeholder="Ej: E3, ERR, LO, HI..."
            style={{ width: '100%', border: '1.5px solid var(--gray-mid)', borderRadius: 8, fontSize: 13, padding: '9px 10px', boxSizing: 'border-box', marginBottom: 8 }}
          />
          <div style={{ background: 'var(--gray-light)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
            Contenido de códigos de error próximamente.
          </div>
        </Card>

        {/* Other MoH resources placeholder */}
        <Card style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>★</div>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark-green)', marginBottom: 8 }}>Más recursos próximamente</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Esta sección incluirá recursos del MINSA sobre diagnóstico, tratamiento y vigilancia de malaria.
          </p>
        </Card>
      </Screen>
    </>
  );
}
