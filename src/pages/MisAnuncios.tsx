import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MisAnuncios() {
  const [anuncios, setAnuncios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [_user, setUser] = useState<any>(null)
  const [interesadosPor, setInteresadosPor] = useState<Record<string, any[]>>({})
  const [anuncioAbierto, setAnuncioAbierto] = useState<string | null>(null)
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

  const fetchInteresados = async (anuncioId: string) => {
    if (anuncioAbierto === anuncioId) {
      setAnuncioAbierto(null)
      return
    }
    const { data } = await supabase
      .from('interesados')
      .select('*, profiles(nombre, email, telefono)')
      .eq('anuncio_id', anuncioId)
      .order('created_at', { ascending: false })
    setInteresadosPor((prev) => ({ ...prev, [anuncioId]: data || [] }))
    setAnuncioAbierto(anuncioId)
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

  const handleToggleVendido = async (id: string, vendido: boolean) => {
    await supabase.from('anuncios').update({ vendido: !vendido }).eq('id', id)
    setAnuncios(anuncios.map((a) => a.id === id ? { ...a, vendido: !vendido } : a))
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
        <div className="flex flex-col gap-4">
          {anuncios.map((anuncio) => (
            <div key={anuncio.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              
              {/* Fila del anuncio */}
              <div className="p-4 flex gap-4 items-center">
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
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${anuncio.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {anuncio.activo ? 'Activo' : 'Pausado'}
                    </span>
                    {anuncio.vendido && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                        Vendido
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  <Link to={`/anuncios/${anuncio.id}`}
                    className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    Ver
                  </Link>
                  <button onClick={() => handleToggleActivo(anuncio.id, anuncio.activo)}
                    className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    {anuncio.activo ? 'Pausar' : 'Activar'}
                  </button>
                  <button onClick={() => handleToggleVendido(anuncio.id, anuncio.vendido)}
                    className={`text-xs border px-3 py-1.5 rounded-lg ${anuncio.vendido ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}>
                    {anuncio.vendido ? 'Marcar disponible' : 'Marcar vendido'}
                  </button>
                  <button onClick={() => fetchInteresados(anuncio.id)}
                    className="text-xs border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-50">
                    👥 Interesados
                  </button>
                  <button onClick={() => handleEliminar(anuncio.id)}
                    className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50">
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Panel de interesados */}
              {anuncioAbierto === anuncio.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Interesados</h4>
                  {!interesadosPor[anuncio.id] || interesadosPor[anuncio.id].length === 0 ? (
                    <p className="text-sm text-gray-400">Ningún interesado todavía.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {interesadosPor[anuncio.id].map((interesado) => (
                        <div key={interesado.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{interesado.profiles?.nombre || 'Sin nombre'}</p>
                            <p className="text-xs text-gray-500">{interesado.profiles?.email}</p>
                            {interesado.profiles?.telefono && (
                              <p className="text-xs text-gray-500">{interesado.profiles?.telefono}</p>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${interesado.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                              {interesado.estado}
                            </span>
                          </div>
                          {interesado.cedula_url && (
                            <a href={interesado.cedula_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600">
                              Ver cédula
                            </a>
                          )}
                          {interesado.profiles?.telefono && (
                            <a href={`https://wa.me/595${interesado.profiles.telefono.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, te contacto desde IronPY en relación a tu interés en mi anuncio.')}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600">
                              WhatsApp
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}