import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

import Portal from './pages/Portal'
import Nota from './pages/Nota'
import Login from './pages/Login'
import Redaccion from './pages/Redaccion'
import Nosotros from './pages/Nosotros'

function PrivateRoute({ session, children }) {
  if (session === null) return <Navigate to="/redaccion/login" replace />
  if (session === undefined) return null
  return children
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Portal />} />
      <Route path="/nota/:id" element={<Nota />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/redaccion/login" element={<Login session={session} />} />
      <Route path="/redaccion" element={
        <PrivateRoute session={session}>
          <Redaccion session={session} />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
