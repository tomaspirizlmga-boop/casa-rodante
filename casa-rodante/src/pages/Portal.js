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

      <footer style={{ background: 'var(--sidebar)', padding: '28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="logo-casa" style={{ fontSize: 14 }}>casa&nbsp;</span>
            <span className="logo-rodante" style={{ fontSize: 20, color: '#fff' }}>rodante</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3, fontStyle: 'italic' }}>de cada pueblo un paisano</div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© {new Date().getFullYear()} Casa Rodante</div>
      </footer>
    </div>
  )
}
