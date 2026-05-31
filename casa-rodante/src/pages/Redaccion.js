import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllNotes, createNote, updateNote, deleteNote, uploadFoto, signOut } from '../lib/supabase'

const CATEGORIAS = [
  { val: 'noticias',   label: 'Noticias · La vuelta al mundo' },
  { val: 'columna',    label: 'Columna · La Ventana' },
  { val: 'entrevista', label: 'Entrevista · El Pasajero' },
  { val: 'informe',    label: 'Informe · El Campamento' },
]

const CAT_COLORS = { noticias: '#1B4FD8', columna: '#F07A2A', entrevista: '#1B4FD8', informe: '#2a2a2e' }

const emptyForm = { titulo: '', resumen: '', cuerpo: '', categoria: 'entrevista', autor: '', publicada: false }

export default function Redaccion({ session }) {
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('notas')
  const [notas, setNotas] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [fotoFile, setFotoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const loadNotas = () => getAllNotes().then(({ data }) => setNotas(data || []))

  useEffect(() => { loadNotas() }, [])

  const handleSalir = async () => {
    await signOut()
    navigate('/redaccion/login')
  }

  const handleEdit = (nota) => {
    setForm({ titulo: nota.titulo, resumen: nota.resumen || '', cuerpo: nota.cuerpo || '', categoria: nota.categoria, autor: nota.autor, publicada: nota.publicada })
    setEditId(nota.id)
    setFotoFile(null)
    setSeccion('nueva')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta nota?')) return
    await deleteNote(id)
    loadNotas()
  }

  const handleSubmit = async (publicar = false) => {
    setSaving(true)
    setMsg('')
    try {
      const data = { ...form, publicada: publicar }
      let result
      if (editId) {
        result = await updateNote(editId, data)
      } else {
        result = await createNote(data)
      }
      if (result.error) throw result.error

      const notaId = result.data?.id || editId
      if (fotoFile && notaId) {
        try {
          const url = await uploadFoto(fotoFile, notaId)
          await updateNote(notaId, { foto_url: url })
        } catch (uploadErr) {
          console.error('Error subiendo foto:', uploadErr)
        }
      }

      setMsg(publicar ? '¡Nota publicada!' : 'Borrador guardado.')
      setForm(emptyForm)
      setEditId(null)
      setFotoFile(null)
      loadNotas()
      setTimeout(() => { setMsg(''); setSeccion('notas') }, 1500)
    } catch (e) {
      setMsg('Error al guardar. Revisá los campos.')
    }
    setSaving(false)
  }

  const userEmail = session?.user?.email || ''

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 200, background: 'var(--sidebar)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="logo-casa" style={{ fontSize: 13 }}>casa</div>
          <div className="logo-rodante" style={{ fontSize: 20, color: '#fff', marginTop: -2 }}>rodante</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{userEmail}</div>
        </div>

        <div style={{ padding: '12px 0', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, padding: '0 20px', marginBottom: 6 }}>Redacción</div>
          {[
            { id: 'nueva', icon: '✏️', label: 'Nueva nota' },
            { id: 'notas', icon: '📄', label: 'Mis notas' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setSeccion(item.id); if (item.id === 'nueva') { setForm(emptyForm); setEditId(null) } }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '9px 20px', background: seccion === item.id ? 'rgba(27,79,216,0.35)' : 'none',
                border: 'none', borderLeft: `2px solid ${seccion === item.id ? 'var(--naranja)' : 'transparent'}`,
                color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.6)',
                fontSize: 13, textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleSalir}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}
          >
            🚪 Salir
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: 'var(--crema)', overflow: 'auto' }}>
        {seccion === 'nueva' && (
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{editId ? 'Editar nota' : 'Nueva nota'}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleSubmit(false)} disabled={saving} style={{ background: '#fff', border: '1px solid var(--borde)', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 500 }}>
                  Guardar borrador
                </button>
                <button onClick={() => handleSubmit(true)} disabled={saving} style={{ background: 'var(--azul)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 700 }}>
                  {saving ? 'Guardando...' : '↑ Publicar'}
                </button>
              </div>
            </div>

            {msg && <div style={{ background: msg.includes('Error') ? '#fee' : '#efe', border: `1px solid ${msg.includes('Error') ? '#fcc' : '#cfc'}`, borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13 }}>{msg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Sección</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  style={{ width: '100%', background: '#fff', border: '1px solid var(--borde)', borderRadius: 8, padding: '10px 12px', fontSize: 13 }}>
                  {CATEGORIAS.map(c => <option key={c.val} value={c.val}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Autor/a</label>
                <input value={form.autor} onChange={e => setForm(f => ({ ...f, autor: e.target.value }))}
                  style={{ width: '100%', background: '#fff', border: '1px solid var(--borde)', borderRadius: 8, padding: '10px 12px', fontSize: 13 }} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Título</label>
              <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                style={{ width: '100%', background: '#fff', border: '1px solid var(--borde)', borderRadius: 8, padding: '10px 12px', fontSize: 15, fontWeight: 600 }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Resumen (se ve en la card)</label>
              <textarea value={form.resumen} onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))} rows={2}
                style={{ width: '100%', background: '#fff', border: '1px solid var(--borde)', borderRadius: 8, padding: '10px 12px', fontSize: 13, resize: 'vertical' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Foto de portada</label>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--borde)', borderRadius: 10, padding: 24, cursor: 'pointer', background: '#fff', textAlign: 'center' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFotoFile(e.target.files[0])} />
                <span style={{ fontSize: 24, marginBottom: 6 }}>📷</span>
                {fotoFile
                  ? <span style={{ fontSize: 13, color: 'var(--azul)', fontWeight: 600 }}>{fotoFile.name}</span>
                  : <span style={{ fontSize: 13, color: '#aaa' }}><strong style={{ color: 'var(--azul)' }}>Hacé click</strong> para subir imagen · JPG o PNG</span>
                }
              </label>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>
                Cuerpo de la nota
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 8, color: '#bbb' }}>Usá comillas dobles para destacar citas como blockquotes</span>
              </label>
              <textarea value={form.cuerpo} onChange={e => setForm(f => ({ ...f, cuerpo: e.target.value }))} rows={16}
                placeholder={'Escribí la nota acá...\n\nPodés usar párrafos separados.\n\n"Esta frase entre comillas dobles se mostrará como una cita destacada."'}
                style={{ width: '100%', background: '#fff', border: '1px solid var(--borde)', borderRadius: 8, padding: '12px 14px', fontSize: 14, lineHeight: 1.8, resize: 'vertical' }} />
            </div>
          </div>
        )}

        {seccion === 'notas' && (
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Notas</h2>
              <button onClick={() => { setForm(emptyForm); setEditId(null); setSeccion('nueva') }}
                style={{ background: 'var(--azul)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 700 }}>
                + Nueva nota
              </button>
            </div>

            {notas.length === 0
              ? <p style={{ color: 'var(--texto-suave)', fontSize: 14 }}>No hay notas todavía.</p>
              : notas.map(nota => (
                <div key={nota.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--borde)', padding: '12px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 4, height: 40, borderRadius: 2, background: CAT_COLORS[nota.categoria] || '#ccc', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nota.titulo}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>
                      {CATEGORIAS.find(c => c.val === nota.categoria)?.label} · {new Date(nota.created_at).toLocaleDateString('es-UY')} · {nota.autor}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: nota.publicada ? '#e6f4ea' : '#fff3e0', color: nota.publicada ? '#1a7a3a' : '#b45309', flexShrink: 0 }}>
                    {nota.publicada ? 'Publicada' : 'Borrador'}
                  </span>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => handleEdit(nota)} style={{ background: 'none', border: '1px solid var(--azul)', color: 'var(--azul)', borderRadius: 6, padding: '4px 10px', fontSize: 11 }}>Editar</button>
                    <button onClick={() => handleDelete(nota.id)} style={{ background: 'none', border: '1px solid #fcc', color: '#c00', borderRadius: 6, padding: '4px 10px', fontSize: 11 }}>Eliminar</button>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </main>
    </div>
  )
}
