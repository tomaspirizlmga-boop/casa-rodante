import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SECCIONES = [
  { label: 'Todas', val: 'todas' },
  { label: 'Noticias', val: 'noticias' },
  { label: 'Columnas', val: 'columna' },
  { label: 'Entrevistas', val: 'entrevista' },
  { label: 'Informes', val: 'informe' },
]

export default function Navbar({ categoriaActiva, onCategoria }) {
  return (
    <nav style={{ background: 'var(--azul)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="logo-casa" style={{ fontSize: 16 }}>casa&nbsp;</span>
          <span className="logo-rodante" style={{ fontSize: 22, color: '#fff' }}>rodante</span>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          {SECCIONES.map(s => (
            <button
              key={s.val}
              onClick={() => onCategoria && onCategoria(s.val)}
              style={{
                background: categoriaActiva === s.val ? 'rgba(255,255,255,0.18)' : 'none',
                border: 'none', color: categoriaActiva === s.val ? '#fff' : 'rgba(255,255,255,0.7)',
                fontSize: 13, fontWeight: 500, padding: '6px 13px',
                borderRadius: 20, transition: 'all 0.15s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
