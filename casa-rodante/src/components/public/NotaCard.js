import React from 'react'
import { useNavigate } from 'react-router-dom'

export const CATEGORIAS = {
  noticias:   { label: 'Noticias', sub: 'La vuelta al mundo', color: 'var(--azul)', textColor: '#fff' },
  columna:    { label: 'Columna',  sub: 'La Ventana',         color: 'var(--naranja)', textColor: '#fff' },
  entrevista: { label: 'Entrevista', sub: 'El Pasajero',      color: 'var(--azul)', textColor: '#fff' },
  informe:    { label: 'Informe',  sub: 'El Campamento',      color: '#1a1a2e', textColor: '#fff' },
}

export default function NotaCard({ nota, featured = false }) {
  const navigate = useNavigate()
  const cat = CATEGORIAS[nota.categoria] || CATEGORIAS.noticias

  if (featured) {
    return (
      <div
        onClick={() => navigate(`/nota/${nota.id}`)}
        style={{
          background: 'var(--azul)', borderRadius: 16, overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 260,
          cursor: 'pointer', marginBottom: 36,
          boxShadow: '0 8px 32px rgba(27,79,216,0.25)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 12px 4px 4px', marginBottom: 16 }}>
              <span style={{ background: 'var(--naranja)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>{cat.label}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{cat.sub}</span>
            </div>
            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, lineHeight: 1.3, marginBottom: 12 }}>{nota.titulo}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7 }}>{nota.resumen}</p>
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ background: 'var(--naranja)', color: '#fff', border: 'none', borderRadius: 20, padding: '9px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Leer nota →
            </button>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
              {nota.autor} · {new Date(nota.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', background: '#0f3aad' }}>
          {nota.foto_url
            ? <img src={nota.foto_url} alt={nota.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Pacifico, cursive', fontSize: 40, color: 'rgba(255,255,255,0.07)', textAlign: 'center', padding: 20, lineHeight: 1.3 }}>{cat.sub}</div>
          }
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/nota/${nota.id}`)}
      style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--borde)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      <div style={{ height: 140, background: nota.foto_url ? 'transparent' : cat.color, position: 'relative', overflow: 'hidden' }}>
        {nota.foto_url
          ? <img src={nota.foto_url} alt={nota.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Pacifico, cursive', fontSize: 18, color: 'rgba(255,255,255,0.12)', textAlign: 'center', padding: 16 }}>{cat.sub}</div>
        }
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.93)', color: cat.color, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          {cat.label}
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 6, color: 'var(--texto)' }}>{nota.titulo}</h4>
        <p style={{ fontSize: 12, color: 'var(--texto-suave)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{nota.resumen}</p>
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--crema-dark)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#bbb' }}>
        <span>{nota.autor} · {new Date(nota.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })}</span>
        <span style={{ color: 'var(--azul)', fontWeight: 700 }}>Leer →</span>
      </div>
    </div>
  )
}
