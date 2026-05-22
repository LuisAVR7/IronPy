import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchPerfil(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchPerfil(session.user.id)
      else setPerfil(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchPerfil = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('nombre')
      .eq('id', userId)
      .single()
    setPerfil(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Iron<span className="text-orange-500">PY</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/anuncios" className="text-sm text-gray-300 hover:text-white">Anuncios</Link>
          <Link to="/planes" className="text-sm text-gray-300 hover:text-white">Planes</Link>
          {user ? (
            <>
              <span className="text-sm text-gray-300">
                Hola, <span className="text-orange-500 font-medium">{perfil?.nombre || user.email}</span>
              </span>
              <Link to="/mis-anuncios" className="text-sm text-gray-300 hover:text-white">Mis anuncios</Link>
              <Link to="/publicar" className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600">
                Publicar
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-300 hover:text-white">Ingresar</Link>
              <Link to="/registro" className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}