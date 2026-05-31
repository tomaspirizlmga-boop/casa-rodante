import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getNoteById } from '../lib/supabase'
import Navbar from '../components/public/Navbar'

const CATEGORIA_LABELS = {
  noticias: 'Noticias · La vuelta al mundo',
  columna: 'Columna · La Ventana',
  entrevista: 'Entrevista · El Pasajero',
  informe: 'Informe · El Campamento',
}

export default function Nota() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [nota, setNota] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNoteById(id).then(({ data, error }) => {
      if (error || !data) navigate('/')
      else setNota(data)
      setLoading(false)
    })
  }, [id, navigate])

  if (loading) return <div><Navbar /><div style={{ textAlign: 'center', padding: 100 }}>Cargando...</div></div>
  if (!nota) return null

  const fecha = nota.fecha_publicacion
    ? new Date(nota.fecha_publicacion).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date(nota.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px 80px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--azul)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, padding: 0, cursor: 'pointer' }}>
          ← Volver
        </button>
        <span style={{ background: 'var(--azul)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 13px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block', marginBottom: 16 }}>
          {CATEGORIA_LABELS[nota.categoria] || nota.categoria}
        </span>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, lineHeight: 1.25, marginBottom: 12 }}>{nota.titulo}</h1>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span>{fecha}</span><span>·</span><span>Por {nota.autor}</span>
        </div>
        {nota.foto_url && (
          <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 32, aspectRatio: '16/9' }}>
            <img src={nota.foto_url} alt={nota.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div
          className="nota-cuerpo"
          dangerouslySetInnerHTML={{ __html: nota.cuerpo }}
        />
      </div>
      <style>{`
        .nota-cuerpo {
          font-size: 16px;
          line-height: 1.85;
          color: #2a2a2a;
        }
        .nota-cuerpo p { margin-bottom: 1.2em; }
        .nota-cuerpo br { display: block; content: ""; margin-top: 0.5em; }
        .nota-cuerpo blockquote {
          border-left: 3px solid var(--naranja, #F07A2A);
          padding: 12px 20px;
          margin: 24px 0;
          background: #fff8f3;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #444;
          font-size: 17px;
          line-height: 1.7;
        }
        .nota-cuerpo ul { padding-left: 24px; margin-bottom: 1em; }
        .nota-cuerpo li { margin-bottom: 0.4em; }
      `}</style>
    </div>
  )
}
