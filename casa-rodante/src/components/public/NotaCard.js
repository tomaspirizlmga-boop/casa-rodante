import React from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIA_COLORS = {
  noticias:    { bg: '#1B4FD8', label: 'Noticias' },
  columna:     { bg: '#F07A2A', label: 'Columna' },
  entrevista:  { bg: '#1B4FD8', label: 'Entrevista' },
  informe:     { bg: '#2a2a2e', label: 'Informe' },
}

export default function NotaCard({ nota, featured = false }) {
  const navigate = useNavigate()
  const cat = CATEGORIA_COLORS[nota.categoria] || CATEGORIA_COLORS.noticias

  if (featured) {
    return (
      <div
        onClick={() => navigate(`/nota/${nota.id}`)}
        style={{
          background: 'var(--azul)', borderRadius: 14, overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 230,
          cursor: 'pointer', marginBottom: 32,
        }}
      >
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ background: 'var(--naranja)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 11px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {cat.label}
            </span>
            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1.3, margin: '12px 0 10px' }}>{nota.titulo}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>{nota.resumen}</p>
          </div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ background: 'var(--naranja)', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 20px', fontSize: 13, fontWeight: 700 }}>
              Leer nota →
            </button>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
              {nota.autor} · {new Date(nota.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
        <div style={{ background: nota.foto_url ? 'transparent' : '#0f3aad', position: 'relative', overflow: 'hidden' }}>
          {nota.foto_url
            ? <img src={nota.foto_url} alt={nota.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'Pacifico, cursive', fontSize: 36, color: 'rgba(255,255,255,0.08)' }}>{nota.categoria}</div>
          }
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/nota/${nota.id}`)}
      style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--borde)', cursor: 'pointer', transition: 'transform 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: 130, background: nota.foto_url ? 'transparent' : cat.bg, position: 'relative', overflow: 'hidden' }}>
        {nota.foto_url
          ? <img src={nota.foto_url} alt={nota.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'Pacifico, cursive', fontSize: 20, color: 'rgba(255,255,255,0.15)' }}>{nota.categoria}</div>
        }
        <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.92)', color: cat.bg, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 10, textTransform: 'uppercase' }}>
          {cat.label}
        </span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35, marginBottom: 5 }}>{nota.titulo}</h4>
        <p style={{ fontSize: 12, color: 'var(--texto-suave)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {nota.resumen}
        </p>
      </div>
      <div style={{ padding: '8px 14px', borderTop: '1px solid var(--crema-dark)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa' }}>
        <span>{nota.autor} · {new Date(nota.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })}</span>
        <span style={{ color: 'var(--azul)', fontWeight: 600 }}>Leer →</span>
      </div>
    </div>
  )
}
