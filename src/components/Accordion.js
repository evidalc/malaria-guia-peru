import { useState } from 'react';

export function useAccordion(initial = 0) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    toggle: (i) => setOpen(prev => (prev === i ? null : i)),
    setOpen,
  };
}

export function AccordionSection({ index, title, subtitle, isOpen, onToggle, complete, disabled, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(8,80,65,.08)', overflow: 'hidden', border: `2px solid ${disabled ? 'var(--gray-mid)' : isOpen ? 'var(--green)' : 'transparent'}`, opacity: disabled ? 0.55 : 1, transition: 'border-color .2s' }}>
      <button onClick={disabled ? undefined : onToggle} style={{ alignItems: 'center', background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', display: 'flex', gap: 12, padding: '14px 16px', textAlign: 'left', width: '100%' }}>
        <span style={{ alignItems: 'center', background: complete ? 'var(--green)' : isOpen ? 'var(--dark-green)' : 'var(--gray-mid)', borderRadius: '50%', color: '#fff', display: 'flex', flexShrink: 0, fontSize: 12, fontWeight: 700, height: 26, justifyContent: 'center', width: 26, transition: 'background .2s' }}>
          {complete ? '✓' : index}
        </span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: disabled ? 'var(--text-muted)' : 'var(--text)' }}>{title}</span>
          {subtitle && <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</span>}
        </span>
        {!disabled && <span style={{ color: 'var(--text-muted)', fontSize: 18, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', lineHeight: 1 }}>⌄</span>}
        {disabled && <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--gray-light)', borderRadius: 8, padding: '2px 8px' }}>No aplica</span>}
      </button>
      {isOpen && !disabled && (
        <div style={{ borderTop: '1px solid var(--gray-light)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {children}
        </div>
      )}
    </div>
  );
}
