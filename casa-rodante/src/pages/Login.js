import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../lib/supabase'

export default function Login({ session }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) navigate('/redaccion', { replace: true })
  }, [session, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { setError('Email o contraseña incorrectos.'); setLoading(false) }
    else navigate('/redaccion', { replace: true })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sidebar)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
            <span className="logo-casa" style={{ fontSize: 16 }}>casa&nbsp;</span>
            <span className="logo-rodante" style={{ fontSize: 22, color: 'var(--azul)' }}>rodante</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--texto-suave)' }}>Acceso redacción</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', border: '1px solid var(--borde)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Contraseña</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', border: '1px solid var(--borde)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none' }}
            />
          </div>

          {error && <p style={{ color: '#c00', fontSize: 13, marginBottom: 14 }}>{error}</p>}

          <button
            type="submit" disabled={loading}
            style={{ width: '100%', background: 'var(--azul)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 700, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
