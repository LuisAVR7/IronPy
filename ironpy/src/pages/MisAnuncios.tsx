import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MisAnuncios() {
  const [anuncios, setAnuncios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login')
      else {
        setUser(session.user)
        fetchAnuncios(session.user.id)
      }
    })
  }, [])

  const fetchAnuncios = async (userId: string) => {
    const { data } = await supabase
      .from('anuncios')
      .select('*, categorias(nombre)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setAnuncios(data || [])
    setLoading(false)
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Seguro que querés eliminar este anuncio?')) return
    await supabase.from('anuncios').delete().eq('id', id)
    setAnuncios(anuncios.filter((a) => a.id !== id))
  }

  const handleToggleActivo = async (id: string, activo: boolean) => {
    await supabase.from('anuncios').update({ activo: !activo }).eq('id', id)
    setAnuncios(anuncios.map((a) => a.id === id ? { ...a, activo: !activo } : a))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis anuncios</h1>
        <Link to="/publicar" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
          + Publicar nuevo
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : anuncios.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Todavía no publicaste ningún anuncio.</p>
          <Link to="/publicar" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600">
            Publicar mi primer anuncio
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {anuncios.map((anuncio) => (
            <div key={anuncio.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {anuncio.fotos?.[0] ? (
                  <img src={anuncio.fotos[0]} alt={anuncio.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-orange-500 font-medium">{anuncio.categorias?.nombre}</p>
                <h3 className="font-medium text-gray-900 truncate">{anuncio.titulo}</h3>
                <p className="text-sm text-gray-500">{anuncio.moneda} {anuncio.precio?.toLocaleString()}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${anuncio.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {anuncio.activo ? 'Activo' : 'Pausado'}
                </span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link to={`/anuncios/${anuncio.id}`}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  Ver
                </Link>
                <button onClick={() => handleToggleActivo(anuncio.id, anuncio.activo)}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  {anuncio.activo ? 'Pausar' : 'Activar'}
                </button>
                <button onClick={() => handleEliminar(anuncio.id)}
                  className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}