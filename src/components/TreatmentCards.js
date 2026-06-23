import { useState } from 'react';
import { DOT_COLORS, TQ_DRUG_INTERACTIONS } from '../data/constants';
import { Alert } from './Layout';

// ─── Day dots ─────────────────────────────────────────────────────────────────
function DayDots({ dotColor, daysLabel }) {
  const color = DOT_COLORS[dotColor] || '#888';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
      {daysLabel.split(',').flatMap(seg => seg.trim().split('–')).slice(0, 8).map((_, i) => (
        <div key={i} style={{ background: color, borderRadius: '50%', height: 8, width: 8, flexShrink: 0 }} />
      ))}
      <span style={{ fontSize: 11, color: '#888', marginLeft: 2 }}>{daysLabel}</span>
    </div>
  );
}

// ─── Single drug row ──────────────────────────────────────────────────────────
function DrugRow({ drug, role }) {
  const [showPills, setShowPills] = useState(false);
  const [showTQ, setShowTQ] = useState(false);

  return (
    <div style={{ background: 'var(--gray-light)', borderRadius: 10, padding: '11px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ background: DOT_COLORS[drug.dotColor] || '#888', borderRadius: 4, width: 4, alignSelf: 'stretch', flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{drug.name}</span>
            {drug.ahaWarning && <span title="Monitoreo AHA requerido" style={{ background: '#A32D2D22', border: '1px solid var(--red)', borderRadius: 6, color: 'var(--red)', fontSize: 10, fontWeight: 700, padding: '1px 5px' }}>🔴 AHA</span>}
            {drug.tqConsideraciones && (
              <button onClick={() => setShowTQ(v => !v)} style={{ background: '#fff8e622', border: '1px solid var(--amber)', borderRadius: 6, color: 'var(--amber)', cursor: 'pointer', fontSize: 10, fontWeight: 700, padding: '1px 6px' }}>⚠️ Consideraciones</button>
            )}
            {drug.safeG6PD && <span style={{ background: '#e8f9f3', border: '1px solid var(--green)', borderRadius: 6, color: 'var(--dark-green)', fontSize: 10, fontWeight: 700, padding: '1px 5px' }}>G6PD ✓</span>}
          </div>
          <DayDots dotColor={drug.dotColor} daysLabel={drug.daysLabel} />
          {role === 'hcp' && drug.mgKgLabel && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{drug.mgKgLabel}{drug.totalMgLabel && <span style={{ fontWeight: 600, color: 'var(--dark-green)' }}> → {drug.totalMgLabel}</span>}</div>}
          {role === 'hcp' && drug.ntsRef && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>NTS {drug.ntsRef}</span>}
          {/* ACS: show pill count directly */}
          {role === 'acs' && <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark-green)', marginTop: 3 }}>{drug.pillCountLabel}</div>}
          {/* HCP: tap to reveal */}
          {role === 'hcp' && (
            <button onClick={() => setShowPills(v => !v)} style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: '2px 0', marginTop: 2 }}>
              💊 {showPills ? 'Ocultar' : 'Ver número de tabletas'}
            </button>
          )}
          {role === 'hcp' && showPills && (
            <div style={{ background: '#fff', border: '1px solid var(--blue)', borderRadius: 8, color: 'var(--text)', fontSize: 12, padding: '8px 10px', marginTop: 4, lineHeight: 1.5 }}>
              <strong>{drug.pillCountLabel}</strong><br />
              <span style={{ color: 'var(--text-muted)' }}>Presentación: {drug.formulation} · Verifique presentación disponible en su IPRESS</span>
            </div>
          )}
          {drug.clinicalNote && <div style={{ background: '#fff8e6', border: '1px solid var(--amber)', borderRadius: 8, color: '#6b4200', fontSize: 12, padding: '6px 10px', marginTop: 4 }}>⚠️ {drug.clinicalNote}</div>}
        </div>
      </div>
      {showTQ && (
        <div style={{ background: '#fff8e6', border: '1px solid var(--amber)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#6b4200' }}>
          La tafenoquina y la primaquina pueden causar anemia hemolítica aguda (AHA) en personas con deficiencia de G6PD. Instruya al paciente o familiar a regresar si presenta orina oscura, ictericia, palidez, fatiga de nueva aparición o fiebre persistente.
        </div>
      )}
    </div>
  );
}

// ─── Single treatment card ────────────────────────────────────────────────────
function TreatmentCard({ card, role, onMark, marked }) {
  const badgeColors = { '1ra Línea': 'var(--green)', '2da Línea': 'var(--blue)', '3ra Línea': 'var(--amber)', 'CQ-Resistente': '#9B4A6B', 'Línea Única': 'var(--dark-green)', 'Postparto': 'var(--blue)', 'Gestante': 'var(--red)', 'Alt. G6PD def.': 'var(--amber)' };
  const badgeBg = badgeColors[card.lineBadge] || 'var(--dark-green)';

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 3px 12px rgba(8,80,65,.12)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ background: badgeBg, borderRadius: 8, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', flexShrink: 0, marginTop: 2 }}>{card.lineBadge}</span>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{card.title}</p>
          {card.subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{card.subtitle}</p>}
        </div>
      </div>

      {/* Warnings */}
      {card.warnings?.map((w, i) => (
        <Alert key={i} type={w.type}>{w.text}</Alert>
      ))}

      {/* Drugs */}
      {card.drugs?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {card.drugs.map((d, i) => <DrugRow key={i} drug={d} role={role} />)}
        </div>
      )}

      {/* NTS ref (HCP only) */}
      {role === 'hcp' && card.ntsRef && (
        <p style={{ fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid var(--gray-light)', paddingTop: 8 }}>📋 Referencia NTS: {card.ntsRef}</p>
      )}

      {/* Administered tick */}
      <label style={{ alignItems: 'flex-start', cursor: 'pointer', display: 'flex', gap: 10, background: marked ? '#e8f9f3' : 'var(--gray-light)', border: `1.5px solid ${marked ? 'var(--green)' : 'var(--gray-mid)'}`, borderRadius: 10, padding: '11px 12px', userSelect: 'none', transition: 'all .2s' }}>
        <input type="checkbox" checked={marked} onChange={onMark} style={{ marginTop: 2, accentColor: 'var(--green)', width: 18, height: 18, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: marked ? 'var(--dark-green)' : 'var(--text-muted)' }}>
          {marked ? '✓ Tratamiento marcado como administrado' : 'Marcar como tratamiento administrado'}
        </span>
      </label>
    </div>
  );
}

// ─── Swipeable card carousel ──────────────────────────────────────────────────
export function TreatmentCarousel({ cards, role, onRegister }) {
  const [idx, setIdx] = useState(0);
  const [marked, setMarked] = useState({});

  const total = cards.length;
  const anyMarked = Object.values(marked).some(Boolean);

  return (
    <div>
      {/* Card */}
      <TreatmentCard card={cards[idx]} role={role} marked={!!marked[idx]} onMark={() => setMarked(m => ({ ...m, [idx]: !m[idx] }))} />

      {/* Prev / Next */}
      {total > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 10 }}>
          <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} style={{ background: 'var(--gray-light)', border: 'none', borderRadius: 10, color: 'var(--text)', cursor: idx === 0 ? 'default' : 'pointer', fontSize: 13, fontWeight: 600, opacity: idx === 0 ? 0.35 : 1, padding: '9px 16px' }}>‹ Anterior</button>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {cards.map((_, i) => <div key={i} onClick={() => setIdx(i)} style={{ background: i === idx ? 'var(--dark-green)' : 'var(--gray-mid)', borderRadius: '50%', cursor: 'pointer', height: i === idx ? 10 : 7, width: i === idx ? 10 : 7, transition: 'all .2s' }} />)}
          </div>
          <button onClick={() => setIdx(i => Math.min(total - 1, i + 1))} disabled={idx === total - 1} style={{ background: 'var(--gray-light)', border: 'none', borderRadius: 10, color: 'var(--text)', cursor: idx === total - 1 ? 'default' : 'pointer', fontSize: 13, fontWeight: 600, opacity: idx === total - 1 ? 0.35 : 1, padding: '9px 16px' }}>Siguiente ›</button>
        </div>
      )}

      {/* Register button — enabled only after ticking a treatment */}
      {!anyMarked && (
        <p style={{ fontSize: 12, color: 'var(--red)', textAlign: 'center', marginTop: 12, fontWeight: 500 }}>
          ⚠️ Marque el tratamiento administrado antes de registrar la visita
        </p>
      )}
      <button
        onClick={anyMarked ? onRegister : undefined}
        disabled={!anyMarked}
        style={{
          marginTop: 10,
          width: '100%',
          padding: '16px',
          borderRadius: 14,
          border: 'none',
          fontSize: 16,
          fontWeight: 700,
          cursor: anyMarked ? 'pointer' : 'not-allowed',
          background: anyMarked ? 'var(--dark-green)' : 'var(--gray-light)',
          color: anyMarked ? '#fff' : 'var(--text-muted)',
          transition: 'background .2s, color .2s',
          boxShadow: anyMarked ? '0 4px 14px rgba(29,158,117,.35)' : 'none',
        }}
      >
        {anyMarked ? '✅ Registrar visita' : 'Registrar visita'}
      </button>
    </div>
  );
}
