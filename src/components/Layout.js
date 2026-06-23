import { useNavigate } from 'react-router-dom';

// ─── Top navigation bar ───────────────────────────────────────────────────────
export function TopBar({ title, back, badge, right }) {
  const navigate = useNavigate();
  return (
    <div style={{ background: 'var(--dark-green)', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, minHeight: 56, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
      {back !== undefined && (
        <button onClick={() => (back === -1 ? navigate(-1) : navigate(back))} style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '4px 10px', flexShrink: 0 }}>‹</button>
      )}
      <span style={{ flex: 1, fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>{title}</span>
      {badge && <span style={{ background: 'var(--green)', borderRadius: 12, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, padding: '3px 8px', textTransform: 'uppercase' }}>{badge}</span>}
      {right}
    </div>
  );
}

// ─── Screen wrapper ───────────────────────────────────────────────────────────
export function Screen({ children, style, noPad }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', padding: noPad ? 0 : '18px 14px 96px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', ...style }}>
      {children}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(8,80,65,.1)', padding: 16, ...style }}>{children}</div>;
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', style, disabled, type = 'button', size = 'md' }) {
  const base = { border: 'none', borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 600, width: '100%', opacity: disabled ? 0.5 : 1, transition: 'opacity .15s', letterSpacing: 0.2, lineHeight: 1.2 };
  const sizes = { sm: { fontSize: 13, padding: '10px 14px' }, md: { fontSize: 15, padding: '14px 18px' }, lg: { fontSize: 17, padding: '17px 20px' } };
  const variants = { primary: { background: 'var(--green)', color: '#fff' }, danger: { background: 'var(--red)', color: '#fff' }, amber: { background: 'var(--amber)', color: '#fff' }, blue: { background: 'var(--blue)', color: '#fff' }, outline: { background: 'transparent', color: 'var(--green)', border: '2px solid var(--green)' }, ghost: { background: 'var(--gray-light)', color: 'var(--text)' } };
  return <button type={type} style={{ ...base, ...sizes[size], ...variants[variant], ...style }} onClick={onClick} disabled={disabled}>{children}</button>;
}

// ─── Form field ───────────────────────────────────────────────────────────────
export function Field({ label, hint, children, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}{required && <span style={{ color: 'var(--red)' }}> *</span>}</label>
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{hint}</span>}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ style, large, ...rest }) {
  return <input style={{ background: 'var(--gray-light)', border: '1.5px solid var(--gray-mid)', borderRadius: 10, color: 'var(--text)', fontSize: large ? 18 : 15, outline: 'none', padding: large ? '13px 14px' : '11px 13px', width: '100%', ...style }} {...rest} />;
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ children, style, ...rest }) {
  return <select style={{ background: 'var(--gray-light)', border: '1.5px solid var(--gray-mid)', borderRadius: 10, color: 'var(--text)', fontSize: 15, outline: 'none', padding: '11px 36px 11px 13px', width: '100%', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%234a6a4a' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', ...style }} {...rest}>{children}</select>;
}

// ─── Alert box ────────────────────────────────────────────────────────────────
export function Alert({ children, type = 'warning', style }) {
  const map = { warning: { bg: '#fff8e6', border: 'var(--amber)', color: '#6b4200' }, error: { bg: '#fff0f0', border: 'var(--red)', color: '#6b0000' }, info: { bg: '#e8f4ff', border: 'var(--blue)', color: '#0c3560' }, success: { bg: '#e8f9f3', border: 'var(--green)', color: '#085041' } };
  const c = map[type];
  return <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 12, color: c.color, fontSize: 13, fontWeight: 500, padding: '11px 13px', lineHeight: 1.5, ...style }}>{children}</div>;
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ alignItems: 'center', cursor: 'pointer', display: 'flex', gap: 10, userSelect: 'none' }}>
      <div onClick={onChange} style={{ background: checked ? 'var(--green)' : 'var(--gray-mid)', borderRadius: 12, cursor: 'pointer', height: 24, position: 'relative', transition: 'background .2s', width: 44, flexShrink: 0 }}>
        <div style={{ background: '#fff', borderRadius: '50%', height: 18, left: checked ? 22 : 3, position: 'absolute', top: 3, transition: 'left .2s', width: 18 }} />
      </div>
      {label && <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{label}</span>}
    </label>
  );
}

// ─── Radio group (pill style) ─────────────────────────────────────────────────
export function RadioPills({ options, value, onChange, large }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map(opt => (
        <label key={opt.value} style={{ flex: opt.flex || '1 1 auto', minWidth: opt.minWidth || 60, textAlign: 'center', background: value === opt.value ? 'var(--dark-green)' : 'var(--gray-light)', border: `1.5px solid ${value === opt.value ? 'var(--dark-green)' : 'var(--gray-mid)'}`, borderRadius: 10, color: value === opt.value ? '#fff' : 'var(--text)', cursor: 'pointer', fontSize: large ? 16 : 14, fontWeight: 600, padding: large ? '13px 10px' : '10px 8px', transition: 'all .15s' }}>
          <input type="radio" value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} style={{ display: 'none' }} />
          {opt.icon && <span style={{ marginRight: 4 }}>{opt.icon}</span>}{opt.label}
        </label>
      ))}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--gray-light)', margin: '2px 0' }} />;
}

// ─── Persistent bottom navigation bar ────────────────────────────────────────
const NAV_ITEMS = [
  { icon: '+', label: 'NTS Malaria',      action: () => window.open('/NTS-233-2025.pdf', '_blank') },
  { icon: '♥', label: 'Recomendaciones', route: '/recursos/salud' },
  { icon: '★', label: 'Recursos',        route: '/recursos/hub' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const color = 'var(--dark-green)';
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#f5f7f5', borderTop: '1.5px solid var(--gray-light)', display: 'flex', gap: 8, padding: '8px 10px 10px', zIndex: 200, boxShadow: '0 -2px 12px rgba(8,80,65,.10)' }}>
      {NAV_ITEMS.map(({ icon, label, action, route }) => (
        <button
          key={label}
          onClick={action || (() => navigate(route))}
          style={{ flex: 1, background: '#fff', border: '1.5px solid #d0d8d0', borderRadius: 10, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '10px 4px 12px' }}
        >
          <span style={{ fontSize: 30, color, lineHeight: 1, fontWeight: 900 }}>{icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color, textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Section header inside a card ─────────────────────────────────────────────
export function SectionLabel({ children }) {
  return <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>{children}</p>;
}
