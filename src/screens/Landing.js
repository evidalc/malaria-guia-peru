import { useNavigate } from 'react-router-dom';

const LANGS = [
  { code: 'es', label: '🇵🇪 Español', active: true },
  { code: 'aw', label: 'Awajún',       active: false },
  { code: 'sh', label: 'Shipibo',      active: false },
  { code: 'en', label: 'EN',           active: false },
  { code: 'pt', label: 'PT',           active: false },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg, var(--dark-green) 0%, var(--green) 65%, #2bb88a 100%)', padding: '0 18px 32px' }}>
      {/* Language row */}
      <div style={{ display: 'flex', gap: 6, padding: '14px 0 0', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {LANGS.map(l => (
          <span key={l.code} style={{ background: l.active ? 'rgba(255,255,255,0.22)' : 'transparent', border: `1px solid ${l.active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 8, color: l.active ? '#fff' : 'rgba(255,255,255,0.35)', cursor: l.active ? 'default' : 'not-allowed', fontSize: 12, fontWeight: l.active ? 700 : 400, padding: '4px 9px', userSelect: 'none' }}>
            {l.label}
          </span>
        ))}
      </div>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 24, paddingBottom: 28 }}>
        <div style={{ fontSize: 64, lineHeight: 1 }}>🦟</div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.1 }}>MalariaGuía<br />Perú</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>Guía de tratamiento · NTS N°233<br />MINSA/DGIESP-2025</p>
        </div>
      </div>

      {/* Role selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600, textAlign: 'center', letterSpacing: 0.6, textTransform: 'uppercase' }}>Selecciona tu perfil</p>

        <button onClick={() => navigate('/hcp/login')} style={{ background: '#fff', border: 'none', borderRadius: 16, cursor: 'pointer', padding: '18px 18px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 20px rgba(0,0,0,.14)' }}>
          <span style={{ fontSize: 34 }}>🩺</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: 'var(--dark-green)' }}>Profesional de Salud</span>
            <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}></span>
          </span>
          <span style={{ color: 'var(--green)', fontSize: 20, fontWeight: 700 }}>›</span>
        </button>

        <button onClick={() => navigate('/acs/login')} style={{ background: 'rgba(255,255,255,0.13)', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 16, cursor: 'pointer', padding: '18px 18px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 34 }}>🏘️</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: '#fff' }}>Agente Comunitario de Salud</span>
            <span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 2 }}></span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 20, fontWeight: 700 }}>›</span>
        </button>

        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, textAlign: 'center', marginTop: 4 }}>Uso exclusivo para personal capacitado · v1.0-beta</p>
      </div>
    </div>
  );
}
