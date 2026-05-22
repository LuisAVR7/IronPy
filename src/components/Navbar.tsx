import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

function Logo() {
  return (
    <svg width="260" height="52" viewBox="0 0 260 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Tractor -->
      <circle cx="16" cy="36" r="12" fill="none" stroke="#F97316" strokeWidth="2"/>
      <circle cx="16" cy="36" r="5" fill="none" stroke="#F97316" strokeWidth="1.5"/>
      <circle cx="16" cy="36" r="1.5" fill="#F97316"/>
      <circle cx="46" cy="39" r="8" fill="none" stroke="#F97316" strokeWidth="2"/>
      <circle cx="46" cy="39" r="3" fill="none" stroke="#F97316" strokeWidth="1.5"/>
      <circle cx="46" cy="39" r="1" fill="#F97316"/>
      <rect x="26" y="24" width="22" height="18" rx="2" fill="#F97316"/>
      <rect x="16" y="17" width="15" height="15" rx="1.5" fill="#F97316"/>
      <rect x="18" y="19" width="11" height="8" rx="1" fill="#1F2937"/>
      <rect x="34" y="17" width="3" height="9" rx="1.5" fill="#EA580C"/>
      <rect x="16" y="43" width="38" height="4" rx="1.5" fill="#EA580C"/>

      <!-- Separador -->
      <rect x="62" y="10" width="1" height="32" rx="0.5" fill="#F97316" opacity="0.3"/>

      <!-- Camión -->
      <rect x="68" y="18" width="20" height="22" rx="2" fill="#F97316"/>
      <rect x="70" y="20" width="16" height="10" rx="1" fill="#1F2937"/>
      <rect x="88" y="22" width="36" height="18" rx="1.5" fill="#EA580C"/>
      <line x1="97" y1="22" x2="97" y2="40" stroke="#D97706" strokeWidth="0.8" opacity="0.6"/>
      <line x1="106" y1="22" x2="106" y2="40" stroke="#D97706" strokeWidth="0.8" opacity="0.6"/>
      <line x1="115" y1="22" x2="115" y2="40" stroke="#D97706" strokeWidth="0.8" opacity="0.6"/>
      <rect x="68" y="38" width="57" height="4" rx="1" fill="#D97706"/>
      <circle cx="78" cy="45" r="7" fill="none" stroke="#F97316" strokeWidth="2"/>
      <circle cx="78" cy="45" r="2.5" fill="none" stroke="#F97316" strokeWidth="1.5"/>
      <circle cx="78" cy="45" r="1" fill="#F97316"/>
      <circle cx="108" cy="45" r="7" fill="none" stroke="#F97316" strokeWidth="2"/>
      <circle cx="108" cy="45" r="2.5" fill="none" stroke="#F97316" strokeWidth="1.5"/>
      <circle cx="108" cy="45" r="1" fill="#F97316"/>
      <circle cx="119" cy="45" r="7" fill="none" stroke="#F97316" strokeWidth="2"/>
      <circle cx="119" cy="45" r="2.5" fill="none" stroke="#F97316" strokeWidth="1.5"/>
      <circle cx="119" cy="45" r="1" fill="#F97316"/>

      <!-- Separador antes del texto -->
      <rect x="134" y="10" width="1.5" height="32" rx="0.5" fill="#F97316" opacity="0.4"/>

      <!-- Texto IronPY -->
      <text x="142" y="34" fontFamily="Arial Black, sans-serif" fontSize="24" fontWeight="900" fill="white">Iron</text>
      <text x="200" y="34" fontFamily="Arial Black, sans-serif" fontSize="24" fontWeight="900" fill="#F97316">PY</text>

      <!-- Subtítulo -->
      <text x="142" y="46" fontFamily="Arial, sans-serif" fontSize="7.5" fill="#9CA3AF" letterSpacing="1.5">MAQUINARIAS PESADAS Y CAMIONES</text>
    </svg>
  )
}

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
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/">
          <Logo />
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