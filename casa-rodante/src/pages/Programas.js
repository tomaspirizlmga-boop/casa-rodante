import React, { useState, useEffect } from 'react'
import Navbar from '../components/public/Navbar'
import { getProgramas } from '../lib/supabase'

function getYouTubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]{11})/)
  return m ? m[1] : null
}

export default function Programas() {
  const [programas, setProgramas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProgramas().then(({ data }) => {
      setProgramas(data || [])
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--crema)' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'var(--azul)', padding: '48px 28px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--naranja)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Casa Rodante</div>
          <h1 style={{ fontFamily: 'Pacifico, cursive', fontSize: 36, color: '#fff', margin: 0, marginBottom: 10 }}>Programas</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, margin: 0 }}>Todos los episodios on demand</p>
        </div>
        <svg style={{ position: 'absolute', bottom: -1, left: 0, right: 0, width: '100%' }} viewBox="0 0 1100 36" preserveAspectRatio="none">
          <path d="M0,18 C275,36 825,0 1100,18 L1100,36 L0,36 Z" fill="#F5F0E8"/>
        </svg>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 28px 64px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--texto-suave)', fontSize: 14 }}>Cargando...</div>
        ) : programas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--texto-suave)', fontSize: 14 }}>No hay programas cargados todavía.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {programas.map(p => {
              const ytId = getYouTubeId(p.url)
              return (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block', background: '#fff', borderRadius: 14, border: '1px solid var(--borde)', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', aspectRatio: '16/9', background: '#111', overflow: 'hidden' }}>
                    {ytId ? (
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                        alt={p.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sidebar)' }}>
                        <span style={{ fontSize: 32 }}>📺</span>
                      </div>
                    )}
                    {/* Play overlay */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(240,122,42,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--texto)', lineHeight: 1.4, marginBottom: 6 }}>{p.titulo}</div>
                    {p.descripcion && (
                      <div style={{ fontSize: 12, color: 'var(--texto-suave)', lineHeight: 1.5, marginBottom: 8 }}>{p.descripcion}</div>
                    )}
                    <div style={{ fontSize: 11, color: '#aaa' }}>
                      {p.fecha ? new Date(p.fecha + 'T12:00:00').toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
