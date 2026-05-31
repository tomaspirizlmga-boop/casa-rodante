import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

export const getNotes = async ({ categoria, page = 1, pageSize = 9 } = {}) => {
  let query = supabase
    .from('notas')
    .select('id, titulo, resumen, categoria, autor, foto_url, created_at, orden, fecha_publicacion', { count: 'exact' })
    .eq('publicada', true)
    .order('orden', { ascending: true })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)
  if (categoria && categoria !== 'todas') query = query.eq('categoria', categoria)
  return query
}

export const getNoteById = async (id) =>
  supabase.from('notas').select('*').eq('id', id).eq('publicada', true).single()

export const getAllNotes = async () =>
  supabase.from('notas').select('*').order('orden', { ascending: true }).order('created_at', { ascending: false })

export const createNote = async (nota) =>
  supabase.from('notas').insert([nota]).select().single()

export const updateNote = async (id, nota) =>
  supabase.from('notas').update(nota).eq('id', id).select().single()

export const deleteNote = async (id) =>
  supabase.from('notas').delete().eq('id', id)

export const uploadFoto = async (file, notaId) => {
  const ext = file.name.split('.').pop()
  const path = `notas/${notaId}.${ext}`
  const { error } = await supabase.storage.from('fotos').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('fotos').getPublicUrl(path)
  return data.publicUrl
}

export const uploadInlineImage = async (file, notaId) => {
  const ext = file.name.split('.').pop()
  const path = `inline/${notaId}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('fotos').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('fotos').getPublicUrl(path)
  return data.publicUrl
}
