import React, { useState, useEffect } from 'react'
import Navbar from '../components/public/Navbar'
import NotaCard from '../components/public/NotaCard'
import { getNotes } from '../lib/supabase'

export default function Portal() {
  const [categoria, setCategoria] = useState('todas')
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const PAGE_SIZE = 9

  useEffect(() => {
    setPage(1)
  }, [categoria])

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

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--texto-suave)', fontSize: 14 }}>Cargando notas...</div>
        ) : notas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--texto-suave)', fontSize: 14 }}>No hay notas en esta sección todavía.</div>
        ) : (
          <>
            {featured && <NotaCard nota={featured} featured />}

            {rest.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--azul)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                  Últimas notas
                  <span style={{ flex: 1, height: 1, background: 'var(--borde)', display: 'block' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 }}>
                  {rest.map(n => <NotaCard key={n.id} nota={n} />)}
                </div>
              </>
            )}

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width: 36, height: 36, borderRadius: 8, border: '1px solid var(--borde)',
                      background: p === page ? 'var(--azul)' : '#fff',
                      color: p === page ? '#fff' : '#555',
                      fontSize: 13, fontWeight: 500,
                    }}
                  >{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <footer style={{ background: 'var(--sidebar)', padding: '40px 32px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            {/* Logo y eslogan */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, marginBottom: 8 }}>
                <span className="logo-casa" style={{ fontSize: 14 }}>casa</span>
                <span className="logo-rodante" style={{ fontSize: 22, color: '#fff', marginTop: 2 }}>rodante</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>nos hace bien ser diferentes</div>
            </div>

            {/* Links */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Seguinos</div>
              <a
                href="https://www.youtube.com/@CasaRodante2026"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} Casa Rodante · Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  )
}
