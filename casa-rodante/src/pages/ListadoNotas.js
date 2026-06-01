import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import NotaCard from '../components/public/NotaCard'
import { getNotes } from '../lib/supabase'

const PAGE_SIZE = 9

export default function ListadoNotas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaParam = searchParams.get('categoria') || 'todas'

  const [categoria, setCategoria] = useState(categoriaParam)
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setCategoria(categoriaParam)
    setPage(1)
  }, [categoriaParam])

  const handleCategoria = (val) => {
    setCategoria(val)
    setPage(1)
    setSearchParams(val === 'todas' ? {} : { categoria: val })
  }

  useEffect(() => {
    setLoading(true)
    getNotes({ categoria, page, pageSize: PAGE_SIZE }).then(({ data, count, error }) => {
      if (!error) { setNotas(data || []); setTotal(count || 0) }
      setLoading(false)
    })
  }, [categoria, page])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <Navbar categoriaActiva={categoria} onCategoria={handleCategoria} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 28px) 80px' }}>
        <h1 style={{ fontFamily: 'Pacifico, cursive', fontSize: 'clamp(22px, 4vw, 32px)', color: 'var(--azul)', marginBottom: 28 }}>
          {categoria === 'todas' ? 'Todas las notas' : {
            noticias: 'Noticias · La vuelta al mundo',
            columna: 'Columnas · La Ventana',
            entrevista: 'Entrevistas · El Pasajero',
            informe: 'Informes · El Campamento',
          }[categoria] || categoria}
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--texto-suave)', fontSize: 14 }}>Cargando...</div>
        ) : notas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--texto-suave)', fontSize: 14 }}>
            No hay notas en esta sección todavía.
            <br />
            <Link to="/" style={{ color: 'var(--azul)', fontWeight: 700, marginTop: 12, display: 'inline-block' }}>← Volver al inicio</Link>
          </div>
        ) : (
          <>
            <div className='cr-grid-notas' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 40 }}>
              {notas.map(n => <NotaCard key={n.id} nota={n} />)}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => { setPage(p); window.scrollTo(0, 0) }}
                    style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--borde)', background: p === page ? 'var(--azul)' : '#fff', color: p === page ? '#fff' : '#555', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
