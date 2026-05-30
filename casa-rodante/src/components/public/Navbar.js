import React from 'react'
import { Link } from 'react-router-dom'

const SECCIONES = [
  { label: 'Todas', val: 'todas' },
  { label: 'Noticias', val: 'noticias' },
  { label: 'Columnas', val: 'columna' },
  { label: 'Entrevistas', val: 'entrevista' },
  { label: 'Informes', val: 'informe' },
]

export default function Navbar({ categoriaActiva, onCategoria }) {
  return (
    <nav style={{ background: 'var(--azul)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'Pacifico, cursive', fontSize: 12, color: 'var(--naranja)', letterSpacing: 0.5 }}>casa</span>
          <span style={{ fontFamily: 'Pacifico, cursive', fontSize: 20, color: '#fff', marginTop: 1 }}>rodante</span>
        </Link>

        {/* Secciones */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {SECCIONES.map(s => (
            <button
              key={s.val}
              onClick={() => onCategoria && onCategoria(s.val)}
              style={{
                background: categoriaActiva === s.val ? 'rgba(255,255,255,0.18)' : 'none',
                border: 'none',
                color: categoriaActiva === s.val ? '#fff' : 'rgba(255,255,255,0.7)',
                fontSize: 13, fontWeight: categoriaActiva === s.val ? 700 : 500,
                padding: '7px 14px', borderRadius: 20, transition: 'all 0.15s', cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}

          {/* En vivo */}
          <a
            href="https://www.youtube.com/@CasaRodante2026"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: 8,
              background: 'var(--naranja)', color: '#fff',
              fontSize: 12, fontWeight: 700,
              padding: '7px 16px', borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 6,
              textDecoration: 'none', transition: 'background 0.15s',
            }}
          >
            <span style={{ width: 7, height: 7, background: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />
            En vivo
          </a>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </nav>
  )
}
