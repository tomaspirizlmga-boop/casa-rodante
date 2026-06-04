import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import NotaCard from '../components/public/NotaCard'
import { getNotes, getProgramas } from '../lib/supabase'

const SECCIONES_PRESENTACION = [
  { val: 'entrevista', nombre: 'El Pasajero',      tipo: 'Entrevista',  desc: 'El que sube a la casa rodante por un rato. Conversaciones con personas que tienen algo para contar.', color: 'var(--azul)',    icon: '🎙️' },
  { val: 'noticias',   nombre: 'La vuelta al mundo',tipo: 'Noticias',    desc: 'Lo que pasó en el planeta, contado desde acá. Sin filtros, con perspectiva.',                          color: 'var(--azul)',    icon: '🌍' },
  { val: 'columna',    nombre: 'La Ventana',        tipo: 'Columna',     desc: 'El punto de vista personal de uno de los tripulantes. Opinión que no pide permiso.',                    color: 'var(--naranja)', icon: '✍️' },
  { val: 'informe',    nombre: 'El Campamento',     tipo: 'Informe',     desc: 'Cuando la casa rodante para y se instala en un lugar a explorar de verdad.',                           color: '#1a1a2e',        icon: '🗺️' },
]

function getYouTubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]{11})/)
  return m ? m[1] : null
}

function SectionTitle({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--azul)', textTransform: 'uppercase', letterSpacing: 1.5, whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--borde)' }} />
    </div>
  )
}

function EquipoPreview() {
  const conductores = [
    { id: 1, nombre: 'Manu',  bg: '#F07A2A' },
    { id: 2, nombre: 'Euge',  bg: '#1B4FD8' },
    { id: 3, nombre: 'Magui', bg: '#F07A2A' },
  ]
  return (
    <div style={{ background: 'var(--crema-dark)', padding: '40px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {conductores.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginLeft: i > 0 ? -16 : 0, zIndex: conductores.length - i }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', background: p.bg, border: '3px solid var(--crema-dark)', flexShrink: 0 }}>
                <img src={`/equipo/${p.id}.gif`} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--texto)', marginBottom: 4 }}>Manu, Euge y Magui</div>
          <div style={{ fontSize: 13, color: 'var(--texto-suave)', marginBottom: 14 }}>Los conductores de Casa Rodante</div>
          <Link to="/nosotros"
            style={{ display: 'inline-block', background: 'var(--azul)', color: '#fff', padding: '9px 20px', borderRadius: 24, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Conocé al equipo →
          </Link>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div>
      <div style={{ background: 'var(--azul)', padding: '60px 28px 90px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 13, color: 'var(--naranja)', marginBottom: 4 }}>casa</div>
          <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 52, color: '#fff', lineHeight: 1, marginBottom: 16 }}>rodante</div>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 28 }}>
            nos hace bien ser diferentes
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://www.youtube.com/@CasaRodante2026" target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--naranja)', color: '#fff', padding: '11px 22px', borderRadius: 24, fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              YouTube
            </a>
            <a href="https://www.instagram.com/somos.casarodante/" target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '11px 22px', borderRadius: 24, fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              Instagram
            </a>
            <a href="https://x.com/casarodante2026" target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '11px 22px', borderRadius: 24, fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </a>
          </div>
        </div>
        <svg style={{ position: 'absolute', bottom: -1, left: 0, right: 0, width: '100%' }} viewBox="0 0 1100 48" preserveAspectRatio="none">
          <path d="M0,24 C275,48 825,0 1100,24 L1100,48 L0,48 Z" fill="#F5F0E8"/>
        </svg>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 28px 32px' }}>
        <SectionTitle label="Qué vas a encontrar acá" />
        <div className='cr-secciones-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 48 }}>
          {SECCIONES_PRESENTACION.map(s => (
            <div key={s.val} style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--borde)', padding: '24px 26px', display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 100, height: 100, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={s.img} alt={s.nombre} style={{ width: 100, height: 100, objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{s.tipo}</div>
                <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 17, color: 'var(--texto)', marginBottom: 5 }}>{s.nombre}</div>
                <p style={{ fontSize: 13, color: 'var(--texto-suave)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EquipoPreview />
    </div>
  )
}

function ProgramasPreview({ programas }) {
  if (!programas || programas.length === 0) return null
  return (
    <div style={{ background: 'var(--sidebar)', padding: '48px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--naranja)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Últimos programas</span>
            <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <Link to="/programas" style={{ fontSize: 13, fontWeight: 700, color: 'var(--naranja)', textDecoration: 'none' }}>Ver todos →</Link>
        </div>
        <div style={{ display: 'grid', gap: 18 }} className='cr-grid-programas'>
          {programas.map(p => {
            const ytId = getYouTubeId(p.url)
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
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
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 32 }}>📺</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(240,122,42,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 4 }}>{p.titulo}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    {p.fecha ? new Date(p.fecha + 'T12:00:00').toLocaleDateString('es-UY', { day: 'numeric', month: 'long' }) : ''}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Portal() {
  const [categoria, setCategoria] = useState('todas')
  const [notas, setNotas] = useState([])
  const [programas, setProgramas] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const PAGE_SIZE = 9

  useEffect(() => { setPage(1) }, [categoria])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getNotes({ categoria, page, pageSize: PAGE_SIZE }),
      getProgramas({ limit: 5 }),
    ]).then(([notasRes, programasRes]) => {
      if (!notasRes.error) { setNotas(notasRes.data || []); setTotal(notasRes.count || 0) }
      if (!programasRes.error) setProgramas(programasRes.data || [])
      setLoading(false)
    })
  }, [categoria, page])

  const last3 = notas.slice(0, 3)

  return (
    <div>
      <Navbar categoriaActiva={categoria} onCategoria={setCategoria} />

      {/* Hero GIF */}
      <div style={{ width: '100%', lineHeight: 0 }}>
        <img
          src="/portada.gif"
          alt="Casa Rodante"
          style={{ width: '100%', display: 'block', objectFit: 'contain' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 100, color: 'var(--texto-suave)', fontSize: 14 }}>Cargando...</div>
      ) : notas.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(16px, 4vw, 36px) clamp(16px, 4vw, 28px) 64px' }}>
          <SectionTitle label="Últimas publicaciones" />
          <style>{`
            .cr-grid-notas { grid-template-columns: repeat(5, 1fr) !important; }
            .cr-grid-programas { grid-template-columns: repeat(5, 1fr) !important; }
            @media (max-width: 768px) {
              .cr-grid-notas { grid-template-columns: repeat(3, 1fr) !important; }
              .cr-grid-programas { grid-template-columns: repeat(3, 1fr) !important; }
            }
          `}</style>
          <div className='cr-grid-notas' style={{ display: 'grid', gap: 18, marginBottom: 40 }}>
            {notas.slice(0, 5).map(n => <NotaCard key={n.id} nota={n} />)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/notas" style={{ background: 'var(--azul)', color: '#fff', padding: '10px 28px', borderRadius: 24, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Ver todas las notas →
            </Link>
          </div>
        </div>
      )}

      {/* Últimos programas */}
      <ProgramasPreview programas={programas} />

      <EquipoPreview />

      <footer style={{ background: 'var(--sidebar)', padding: '48px 28px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className='cr-footer-inner' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <div>
                <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 12, color: 'var(--naranja)', lineHeight: 1 }}>casa</div>
                <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 26, color: '#fff', lineHeight: 1, marginTop: 2, marginBottom: 8 }}>rodante</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>nos hace bien ser diferentes</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Seguinos</div>
              <a href="https://www.youtube.com/@CasaRodante2026" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 10 }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
              <a href="https://www.instagram.com/somos.casarodante/" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 10 }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                Instagram
              </a>
              <a href="https://x.com/casarodante2026" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X (Twitter)
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
