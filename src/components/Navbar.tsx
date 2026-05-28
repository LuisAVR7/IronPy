import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

function Logo() {
  return (
    <svg width="280" height="52" viewBox="0 0 280 52" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <rect x="62" y="10" width="1" height="32" rx="0.5" fill="#F97316" opacity="0.3"/>
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
      <rect x="134" y="10" width="1.5" height="32" rx="0.5" fill="#F97316" opacity="0.4"/>
      <text x="142" y="34" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" fill="white">Maq</text>
      <text x="186" y="34" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" fill="#F97316">Market</text>
      <text x="142" y="47" fontFamily="Arial, sans-serif" fontSize="6" fill="#9CA3AF" letterSpacing="0.8">MAQUINARIAS PESADAS Y CAMIONES</text>
    </svg>
  )
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)
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
      .select('nombre, es_admin, plan')
      .eq('id', userId)
      .single()
    setPerfil(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuAbierto(false)
    navigate('/')
  }

  const esPremium = perfil?.plan === 'premium' || perfil?.es_admin

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/anuncios" className="text-sm text-gray-300 hover:text-white">Anuncios</Link>
          <Link to="/planes" className="text-sm text-gray-300 hover:text-white">Planes</Link>
          {esPremium && (
            <Link to="/directorio" className="text-sm text-orange-400 hover:text-orange-300 font-medium">
              Directorio
            </Link>
          )}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                <span>Hola, <span className="text-orange-500 font-medium">{perfil?.nombre || user.email}</span></span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuAbierto && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <Link to="/mis-anuncios" onClick={() => setMenuAbierto(false)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                    📋 Mis anuncios
                  </Link>
                  <Link to="/publicar" onClick={() => setMenuAbierto(false)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                    ➕ Publicar anuncio
                  </Link>
                  <Link to="/perfil" onClick={() => setMenuAbierto(false)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                    👤 Mi perfil
                  </Link>
                  {esPremium && (
                    <Link to="/directorio" onClick={() => setMenuAbierto(false)}
                      className="block px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 border-b border-gray-100 font-medium">
                      📋 Directorio Premium
                    </Link>
                  )}
                  {perfil?.es_admin && (
                    <Link to="/admin" onClick={() => setMenuAbierto(false)}
                      className="block px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 border-b border-gray-100 font-medium">
                      ⚙️ Panel admin
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50">
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </div>
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