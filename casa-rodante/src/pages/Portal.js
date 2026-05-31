import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import NotaCard from '../components/public/NotaCard'
import { getNotes } from '../lib/supabase'

const SECCIONES_PRESENTACION = [
  { val: 'entrevista', nombre: 'El Pasajero',      tipo: 'Entrevista',  desc: 'El que sube a la casa rodante por un rato. Conversaciones con personas que tienen algo para contar.', color: 'var(--azul)',    icon: '🎙️' },
  { val: 'noticias',   nombre: 'La vuelta al mundo',tipo: 'Noticias',    desc: 'Lo que pasó en el planeta, contado desde acá. Sin filtros, con perspectiva.',                          color: 'var(--azul)',    icon: '🌍' },
  { val: 'columna',    nombre: 'La Ventana',        tipo: 'Columna',     desc: 'El punto de vista personal de uno de los tripulantes. Opinión que no pide permiso.',                    color: 'var(--naranja)', icon: '✍️' },
  { val: 'informe',    nombre: 'El Campamento',     tipo: 'Informe',     desc: 'Cuando la casa rodante para y se instala en un lugar a explorar de verdad.',                           color: '#1a1a2e',        icon: '🗺️' },
]

function SectionTitle({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--azul)', textTransform: 'uppercase', letterSpacing: 1.5, whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--borde)' }} />
    </div>
  )
}

function EquipoPreview() {
  const preview = [
    { id: 1, nombre: 'Manu',  bg: '#F07A2A' },
    { id: 2, nombre: 'Euge',  bg: '#1B4FD8' },
    { id: 3, nombre: 'Magui', bg: '#F07A2A' },
    { id: 4, nombre: 'Cata',  bg: '#1B4FD8' },
    { id: 5, nombre: 'Delfi', bg: '#F07A2A' },
    { id: 6, nombre: 'Agus',  bg: '#1B4FD8' },
  ]
  return (
    <div style={{ background: 'var(--crema-dark)', padding: '48px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--azul)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Los tripulantes</span>
            <div style={{ width: 40, height: 1, background: 'var(--borde)' }} />
          </div>
          <Link to="/nosotros" style={{ fontSize: 13, fontWeight: 700, color: 'var(--azul)', textDecoration: 'none' }}>Ver todos →</Link>
        </div>
        <div className='cr-equipo-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {preview.map(p => (
            <Link to="/nosotros" key={p.id} style={{ textDecoration: 'none' }}>
              <div
                style={{ borderRadius: 12, overflow: 'hidden', background: p.bg, aspectRatio: '3/4', position: 'relative', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src={`/equipo/${p.id}.gif`} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '20px 10px 8px' }}>
                  <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 14, color: '#fff' }}>{p.nombre}</div>
                </div>
              </div>
            </Link>
          ))}
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
          <a href="https://www.youtube.com/@CasaRodante2026" target="_blank" rel="noopener noreferrer"
            style={{ background: 'var(--naranja)', color: '#fff', padding: '11px 28px', borderRadius: 24, fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            Seguinos en YouTube
          </a>
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
          ))}
        </div>
      </div>

      <EquipoPreview />
    </div>
  )
}

export default function Portal() {
  const [categoria, setCategoria] = useState('todas')
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const PAGE_SIZE = 9

  useEffect(() => { setPage(1) }, [categoria])

  useEffect(() => {
    setLoading(true)
    getNotes({ categoria, page, pageSize: PAGE_SIZE }).then(({ data, count, error }) => {
      if (!error) { setNotas(data || []); setTotal(count || 0) }
      setLoading(false)
    })
  }, [categoria, page])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const featured = notas[0]
  const rest = notas.slice(1)

  return (
    <div>
      <Navbar categoriaActiva={categoria} onCategoria={setCategoria} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 100, color: 'var(--texto-suave)', fontSize: 14 }}>Cargando...</div>
      ) : notas.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(16px, 4vw, 36px) clamp(16px, 4vw, 28px) 64px' }}>
          {featured && <NotaCard nota={featured} featured />}
          {rest.length > 0 && (
            <>
              <SectionTitle label="Últimas notas" />
              <div className='cr-grid-notas' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 40 }}>
                {rest.map(n => <NotaCard key={n.id} nota={n} />)}
              </div>
            </>
          )}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--borde)', background: p === page ? 'var(--azul)' : '#fff', color: p === page ? '#fff' : '#555', fontSize: 13, fontWeight: 600 }}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}

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
