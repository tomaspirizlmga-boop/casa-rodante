import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SECCIONES = [
  { label: 'Todas', val: 'todas' },
  { label: 'Noticias', val: 'noticias' },
  { label: 'Columnas', val: 'columna' },
  { label: 'Entrevistas', val: 'entrevista' },
  { label: 'Informes', val: 'informe' },
]

export default function Navbar({ categoriaActiva, onCategoria }) {
  const location = useLocation()
  const enNosotros = location.pathname === '/nosotros'
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{ background: 'var(--azul)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'Pacifico, cursive', fontSize: 11, color: 'var(--naranja)' }}>casa</span>
          <span style={{ fontFamily: 'Pacifico, cursive', fontSize: 18, color: '#fff', marginTop: 1 }}>rodante</span>
        </Link>

        {/* Desktop links */}
        <div className="cr-nav-links" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {!enNosotros && SECCIONES.map(s => (
            <button key={s.val} onClick={() => onCategoria && onCategoria(s.val)}
              style={{ background: categoriaActiva === s.val ? 'rgba(255,255,255,0.18)' : 'none', border: 'none', color: categoriaActiva === s.val ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: categoriaActiva === s.val ? 700 : 500, padding: '6px 12px', borderRadius: 20, cursor: 'pointer' }}>
              {s.label}
            </button>
          ))}
          <Link to="/nosotros" style={{ background: enNosotros ? 'rgba(255,255,255,0.18)' : 'none', color: enNosotros ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: enNosotros ? 700 : 500, padding: '6px 12px', borderRadius: 20, marginLeft: 4 }}>
            Nosotros
          </Link>
          <a href="https://www.youtube.com/@CasaRodante2026" target="_blank" rel="noopener noreferrer"
            style={{ marginLeft: 8, background: 'var(--naranja)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <span style={{ width: 7, height: 7, background: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />
            En vivo
          </a>
        </div>

        {/* Mobile: Nosotros + hamburger */}
        <div style={{ display: 'none', alignItems: 'center', gap: 10 }} className="cr-nav-mobile">
          <Link to="/nosotros" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600 }}>Nosotros</Link>
          <a href="https://www.youtube.com/@CasaRodante2026" target="_blank" rel="noopener noreferrer"
            style={{ background: 'var(--naranja)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
            <span style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', animation: 'pulse 1.2s infinite' }} />
            En vivo
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, padding: '4px', lineHeight: 1 }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: '#1340b0', padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SECCIONES.map(s => (
            <button key={s.val} onClick={() => { onCategoria && onCategoria(s.val); setMenuOpen(false) }}
              style={{ background: categoriaActiva === s.val ? 'rgba(255,255,255,0.15)' : 'none', border: 'none', color: '#fff', fontSize: 14, fontWeight: categoriaActiva === s.val ? 700 : 400, padding: '8px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer' }}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </nav>
  )
}
