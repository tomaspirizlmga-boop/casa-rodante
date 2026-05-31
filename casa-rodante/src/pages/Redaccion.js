import React, { useState, useEffect, useRef, useCallback } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useNavigate } from 'react-router-dom'
import { getAllNotes, createNote, updateNote, deleteNote, uploadFoto, uploadInlineImage, signOut } from '../lib/supabase'

const CATEGORIAS = [
  { val: 'noticias',   label: 'Noticias · La vuelta al mundo' },
  { val: 'columna',    label: 'Columna · La Ventana' },
  { val: 'entrevista', label: 'Entrevista · El Pasajero' },
  { val: 'informe',    label: 'Informe · El Campamento' },
]

const CAT_COLORS = { noticias: '#1B4FD8', columna: '#F07A2A', entrevista: '#1B4FD8', informe: '#2a2a2e' }

const emptyForm = {
  titulo: '', resumen: '', cuerpo: '', categoria: 'entrevista',
  autor: '', publicada: false, orden: 0,
  fecha_publicacion: new Date().toISOString().split('T')[0],
}

function RichEditor({ value, onChange, notaId }) {
  const editorRef = useRef(null)
  const lastValueRef = useRef(null)
  const imageInputRef = useRef(null)

  // Load content whenever value changes externally (new note, edit note, clear form)
  useEffect(() => {
    if (editorRef.current && value !== lastValueRef.current) {
      const active = document.activeElement
      const hasFocus = editorRef.current === active || editorRef.current.contains(active)
      if (!hasFocus) {
        editorRef.current.innerHTML = value || ''
        lastValueRef.current = value
      }
    }
  }, [value])

  // On mount, set initial content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || ''
      lastValueRef.current = value
    }
  }, [])

  const exec = (cmd, val = null) => {
    editorRef.current.focus()
    document.execCommand(cmd, false, val)
    handleInput()
  }

  const handleInput = () => {
    const html = editorRef.current.innerHTML
    lastValueRef.current = html
    onChange(html)
  }

  const insertBlockquote = () => {
    editorRef.current.focus()
    const sel = window.getSelection()
    const text = sel && sel.toString() ? sel.toString() : 'Escribí la cita acá'
    document.execCommand('insertHTML', false, `<blockquote style="border-left:3px solid #F07A2A;padding:12px 20px;margin:20px 0;background:#fff8f4;border-radius:0 8px 8px 0;font-style:italic;color:#444">${text}</blockquote><p><br></p>`)
    handleInput()
  }

  const insertImage = async (file) => {
    if (!file) return
    try {
      const url = await uploadInlineImage(file, notaId || 'temp-' + Date.now())
      editorRef.current.focus()
      document.execCommand('insertHTML', false,
        `<img src="${url}" alt="" style="max-width:100%;border-radius:8px;margin:12px 0;display:block;" />`)
      handleInput()
    } catch (e) {
      alert('Error al subir la imagen: ' + e.message)
    }
  }

  const btnStyle = (active = false) => ({
    background: active ? '#e8f0fe' : 'none',
    border: 'none', padding: '5px 8px', borderRadius: 5,
    cursor: 'pointer', fontSize: 13, color: '#444',
    fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
  })

  return (
    <div>
      {/* Toolbar */}
      <div style={{ background: '#fff', border: '1px solid var(--borde)', borderBottom: 'none', borderRadius: '8px 8px 0 0', padding: '6px 10px', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <button style={btnStyle()} onMouseDown={e => { e.preventDefault(); exec('bold') }} title="Negrita"><b>N</b></button>
        <button style={btnStyle()} onMouseDown={e => { e.preventDefault(); exec('italic') }} title="Cursiva"><i>K</i></button>
        <button style={{ ...btnStyle(), textDecoration: 'underline' }} onMouseDown={e => { e.preventDefault(); exec('underline') }} title="Subrayado">S</button>
        <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />
        <button style={btnStyle()} onMouseDown={e => { e.preventDefault(); exec('justifyLeft') }} title="Izquierda">≡</button>
        <button style={btnStyle()} onMouseDown={e => { e.preventDefault(); exec('justifyCenter') }} title="Centrar">☰</button>
        <button style={btnStyle()} onMouseDown={e => { e.preventDefault(); exec('justifyRight') }} title="Derecha">≡</button>
        <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />
        <select onMouseDown={e => e.stopPropagation()} onChange={e => { exec('fontSize', e.target.value); e.target.value = '' }}
          defaultValue=""
          style={{ border: '1px solid #ddd', borderRadius: 5, padding: '3px 6px', fontSize: 12, background: '#fff', cursor: 'pointer' }}>
          <option value="" disabled>Tamaño</option>
          <option value="1">Pequeño</option>
          <option value="3">Normal</option>
          <option value="5">Grande</option>
          <option value="7">Muy grande</option>
        </select>
        <select onMouseDown={e => e.stopPropagation()} onChange={e => { exec('foreColor', e.target.value); e.target.value = '' }}
          defaultValue=""
          style={{ border: '1px solid #ddd', borderRadius: 5, padding: '3px 6px', fontSize: 12, background: '#fff', cursor: 'pointer' }}>
          <option value="" disabled>Color</option>
          <option value="#1a1a1a">Negro</option>
          <option value="#1B4FD8">Azul</option>
          <option value="#F07A2A">Naranja</option>
          <option value="#c00">Rojo</option>
          <option value="#2a7a2a">Verde</option>
        </select>
        <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />
        <button style={{ ...btnStyle(), fontSize: 11, padding: '5px 10px', background: '#fff8f4', border: '1px solid #F07A2A', color: '#F07A2A', borderRadius: 6 }}
          onMouseDown={e => { e.preventDefault(); insertBlockquote() }} title="Insertar cita destacada">
          " Cita
        </button>
        <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />
        <button style={{ ...btnStyle(), fontSize: 11, padding: '5px 10px', background: '#f0f4ff', border: '1px solid #1B4FD8', color: '#1B4FD8', borderRadius: 6 }}
          onMouseDown={e => { e.preventDefault(); imageInputRef.current && imageInputRef.current.click() }} title="Insertar imagen">
          🖼️ Foto
        </button>
        <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files[0]; e.target.value = ''; if (f) insertImage(f) }} />
      </div>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        style={{
          width: '100%', background: '#fff', border: '1px solid var(--borde)',
          borderRadius: '0 0 8px 8px', padding: '14px 16px',
          fontSize: 14, lineHeight: 1.8, minHeight: 240,
          outline: 'none', fontFamily: 'DM Sans, sans-serif',
        }}
      />
      <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>
        Tip: usá el botón <strong style={{ color: '#F07A2A' }}>" Cita</strong> para insertar una frase destacada. Los párrafos se respetan tal cual los escribís.
      </div>
    </div>
  )
}

function CropModal({ file, onConfirm, onCancel }) {
  const [imgSrc, setImgSrc] = useState(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const imgRef = useRef(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = e => setImgSrc(e.target.result)
    reader.readAsDataURL(file)
  }, [file])

  const onImageLoad = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget
    // Start with a free-form crop covering 90% of the image
    setCrop({ unit: '%', x: 5, y: 5, width: 90, height: 90 })
  }

  const handleConfirm = useCallback(() => {
    if (!completedCrop || !imgRef.current) return
    const canvas = document.createElement('canvas')
    const img = imgRef.current
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height
    canvas.width = Math.round(completedCrop.width * scaleX)
    canvas.height = Math.round(completedCrop.height * scaleY)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(
      img,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0, canvas.width, canvas.height
    )
    canvas.toBlob(blob => {
      onConfirm(new File([blob], file.name, { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.92)
  }, [completedCrop, file.name, onConfirm])

  if (!imgSrc) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 620, width: '100%' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Recortar foto de portada</div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Arrastrá el recuadro y ajustá las esquinas para elegir el área libremente</div>
        <div style={{ maxHeight: '60vh', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            minWidth={80}
          >
            <img ref={imgRef} src={imgSrc} alt="recortar" onLoad={onImageLoad} style={{ maxWidth: '100%', maxHeight: '55vh' }} />
          </ReactCrop>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
          <button onClick={handleConfirm} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--azul)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Usar esta foto</button>
        </div>
      </div>
    </div>
  )
}


export default function Redaccion({ session }) {
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('notas')
  const [notas, setNotas] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [fotoFile, setFotoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [cropFile, setCropFile] = useState(null)

  const loadNotas = () => getAllNotes().then(({ data }) => setNotas(data || []))
  useEffect(() => { loadNotas() }, [])

  const handleSalir = async () => { await signOut(); navigate('/redaccion/login') }

  const handleEdit = (nota) => {
    setForm({
      titulo: nota.titulo || '',
      resumen: nota.resumen || '',
      cuerpo: nota.cuerpo || '',
      categoria: nota.categoria || 'entrevista',
      autor: nota.autor || '',
      publicada: nota.publicada || false,
      orden: nota.orden || 0,
      fecha_publicacion: nota.fecha_publicacion
        ? nota.fecha_publicacion.split('T')[0]
        : new Date(nota.created_at).toISOString().split('T')[0],
    })
    setEditId(nota.id)
    setFotoFile(null)
    setSeccion('nueva')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta nota?')) return
    await deleteNote(id); loadNotas()
  }

  const handleSubmit = async (publicar = false) => {
    setSaving(true); setMsg('')
    try {
      const data = { ...form, publicada: publicar }
      let result
      if (editId) result = await updateNote(editId, data)
      else result = await createNote(data)
      if (result.error) throw result.error

      const notaId = result.data?.id || editId
      if (fotoFile && notaId) {
        try {
          const url = await uploadFoto(fotoFile, notaId)
          await updateNote(notaId, { foto_url: url })
        } catch (e) { console.error('Error foto:', e) }
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

  const moverNota = async (nota, dir) => {
    const sorted = [...notas].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    const idx = sorted.findIndex(n => n.id === nota.id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    // Normalize positions 0,1,2... then swap the two
    const updates = sorted.map((n, i) => ({ id: n.id, orden: i }))
    const temp = updates[idx].orden
    updates[idx].orden = updates[swapIdx].orden
    updates[swapIdx].orden = temp
    // Update local state immediately so UI responds without waiting for DB
    const newNotas = notas.map(n => {
      const u = updates.find(x => x.id === n.id)
      return u ? { ...n, orden: u.orden } : n
    })
    setNotas(newNotas)
    // Persist to DB — no loadNotas() after, to avoid overwriting local state before DB settles
    await Promise.all(updates.map(u => updateNote(u.id, { orden: u.orden })))
  }

  const userEmail = session?.user?.email || ''

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 200, background: 'var(--sidebar)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 13, color: 'var(--naranja)' }}>casa</div>
          <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 18, color: '#fff', marginTop: -2 }}>rodante</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{userEmail}</div>
        </div>
        <div style={{ padding: '12px 0', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, padding: '0 20px', marginBottom: 6 }}>Redacción</div>
          {[{ id: 'nueva', icon: '✏️', label: 'Nueva nota' }, { id: 'notas', icon: '📄', label: 'Mis notas' }].map(item => (
            <button key={item.id}
              onClick={() => { setSeccion(item.id); if (item.id === 'nueva') { setForm(emptyForm); setEditId(null) } }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 20px', background: seccion === item.id ? 'rgba(27,79,216,0.35)' : 'none', border: 'none', borderLeft: `2px solid ${seccion === item.id ? 'var(--naranja)' : 'transparent'}`, color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 13, textAlign: 'left', transition: 'all 0.15s' }}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleSalir} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            🚪 Salir
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: 'var(--crema)', overflow: 'auto' }}>
        {seccion === 'nueva' && (
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{editId ? 'Editar nota' : 'Nueva nota'}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleSubmit(false)} disabled={saving} style={{ background: '#fff', border: '1px solid var(--borde)', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 500 }}>Guardar borrador</button>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Fecha de publicación</label>
                <input type="date" value={form.fecha_publicacion} onChange={e => setForm(f => ({ ...f, fecha_publicacion: e.target.value }))}
                  style={{ width: '100%', background: '#fff', border: '1px solid var(--borde)', borderRadius: 8, padding: '10px 12px', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Orden (menor = primero)</label>
                <input type="number" value={form.orden} onChange={e => setForm(f => ({ ...f, orden: parseInt(e.target.value) || 0 }))}
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
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--borde)', borderRadius: 10, padding: 20, cursor: 'pointer', background: '#fff', textAlign: 'center' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setCropFile(e.target.files[0]); e.target.value = '' }} />
                <span style={{ fontSize: 22, marginBottom: 6 }}>📷</span>
                {fotoFile
                  ? <span style={{ fontSize: 13, color: 'var(--azul)', fontWeight: 600 }}>{fotoFile.name}</span>
                  : <span style={{ fontSize: 13, color: '#aaa' }}><strong style={{ color: 'var(--azul)' }}>Hacé click</strong> para subir imagen</span>
                }
              </label>
              {cropFile && (
                <CropModal
                  file={cropFile}
                  onConfirm={croppedFile => { setFotoFile(croppedFile); setCropFile(null) }}
                  onCancel={() => setCropFile(null)}
                />
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Cuerpo de la nota</label>
              <RichEditor key={editId || 'new'} value={form.cuerpo} onChange={val => setForm(f => ({ ...f, cuerpo: val }))} notaId={editId} />
            </div>
          </div>
        )}

        {seccion === 'notas' && (
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Notas</h2>
              <button onClick={() => { setForm(emptyForm); setEditId(null); setSeccion('nueva') }}
                style={{ background: 'var(--azul)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 700 }}>
                + Nueva nota
              </button>
            </div>
            {notas.length === 0
              ? <p style={{ color: 'var(--texto-suave)', fontSize: 14 }}>No hay notas todavía.</p>
              : [...notas].sort((a, b) => (a.orden || 0) - (b.orden || 0)).map((nota, idx, arr) => (
                <div key={nota.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--borde)', padding: '12px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Orden */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button onClick={() => moverNota(nota, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: idx === 0 ? '#ddd' : '#888', padding: '1px 4px' }}>▲</button>
                    <button onClick={() => moverNota(nota, 1)} disabled={idx === arr.length - 1} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: idx === arr.length - 1 ? '#ddd' : '#888', padding: '1px 4px' }}>▼</button>
                  </div>
                  <div style={{ width: 4, height: 40, borderRadius: 2, background: CAT_COLORS[nota.categoria] || '#ccc', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nota.titulo}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>
                      {CATEGORIAS.find(c => c.val === nota.categoria)?.label} · {nota.fecha_publicacion ? new Date(nota.fecha_publicacion).toLocaleDateString('es-UY') : new Date(nota.created_at).toLocaleDateString('es-UY')} · {nota.autor}
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
