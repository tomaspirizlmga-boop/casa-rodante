import React, { useState } from 'react'
import Navbar from '../components/public/Navbar'

const EQUIPO = [
  { id: 1,  nombre: 'Manu',   bg: '#F07A2A' },
  { id: 2,  nombre: 'Euge',   bg: '#1B4FD8' },
  { id: 3,  nombre: 'Magui',  bg: '#F07A2A' },
  { id: 4,  nombre: 'Cata',   bg: '#1B4FD8' },
  { id: 5,  nombre: 'Delfi',  bg: '#F07A2A' },
  { id: 6,  nombre: 'Agus',   bg: '#1B4FD8' },
  { id: 7,  nombre: 'Tomás',  bg: '#F07A2A' },
  { id: 8,  nombre: 'Mateo',  bg: '#1B4FD8' },
  { id: 9,  nombre: 'Guille', bg: '#F07A2A' },
  { id: 10, nombre: 'Martu',  bg: '#1B4FD8' },
  { id: 11, nombre: 'Romi',   bg: '#F07A2A' },
  { id: 12, nombre: 'Juan',   bg: '#1B4FD8' },
]

export default function Nosotros() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'var(--azul)', padding: '56px 28px 72px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '4px 16px', fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
            nos hace bien ser diferentes
          </div>
          <h1 style={{ fontFamily: 'Pacifico, cursive', fontSize: 48, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            <span style={{ color: 'var(--naranja)' }}>los</span> tripulantes
          </h1>
          {/* Ilustración casa rodante */}
          <img src="/ilustraciones/casa-rodante.png" alt="Casa Rodante" style={{ width: 340, margin: '16px auto 0', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))', mixBlendMode: 'multiply' }} />
        </div>
        <svg style={{ position: 'absolute', bottom: -1, left: 0, right: 0, width: '100%' }} viewBox="0 0 1100 48" preserveAspectRatio="none">
          <path d="M0,24 C275,48 825,0 1100,24 L1100,48 L0,48 Z" fill="#F5F0E8"/>
        </svg>
      </div>

      {/* Grid del equipo — solo GIF con nombre */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 28px 72px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {EQUIPO.map(persona => (
            <div
              key={persona.id}
              onMouseEnter={() => setHoveredId(persona.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                borderRadius: 16, overflow: 'hidden',
                background: persona.bg,
                transition: 'transform 0.2s, box-shadow 0.2s',
                transform: hoveredId === persona.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredId === persona.id ? '0 16px 40px rgba(0,0,0,0.18)' : '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={`/equipo/${persona.id}.gif`}
                  alt={persona.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
                  padding: '32px 20px 16px',
                }}>
                  <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 28, color: '#fff', lineHeight: 1 }}>{persona.nombre}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ background: 'var(--sidebar)', padding: '48px 28px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
            <div>
              <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 12, color: 'var(--naranja)', lineHeight: 1 }}>casa</div>
              <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 26, color: '#fff', lineHeight: 1, marginTop: 2, marginBottom: 10 }}>rodante</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>nos hace bien ser diferentes</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Seguinos</div>
              <a href="https://www.youtube.com/@CasaRodante2026" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} Casa Rodante · Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  )
}
