import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Directorio() {
  const [contactos, setContactos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [acceso, setAcceso] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [rubro, setRubro] = useState('')
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()

  const rubros = [
    'Constructoras',
    'Arquitectos',
    'Materiales de construcción',
    'Sanitarios y pisos',
    'Metalúrgicas',
    'Altura y seguridad',
    'Prevención de incendios',
  ]

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return }

      const { data: perfil } = await supabase
        .from('profiles')
        .select('plan, es_admin')
        .eq('id', session.user.id)
        .single()

      if (perfil?.plan === 'premium' || perfil?.es_admin) {
        setAcceso(true)
        fetchContactos()
      } else {
        setLoading(false)
      }
    })
  }, [])

  const fetchContactos = async () => {
    setLoading(true)
    let query = supabase
      .from('directorio')
      .select('*', { count: 'exact' })
      .order('nombre', { ascending: true })

    if (rubro) query = query.eq('rubro', rubro)
    if (busqueda) query = query.ilike('nombre', `%${busqueda}%`)

    const { data, count } = await query.limit(100)
    setContactos(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  useEffect(() => {
    if (acceso) fetchContactos()
  }, [rubro, busqueda, acceso])

  if (!acceso && !loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Directorio exclusivo</h1>
        <p className="text-gray-500 mb-6">
          El directorio de constructoras y contratistas está disponible exclusivamente para el plan Premium. Accedé a más de 2.270 contactos del sector construcción en Paraguay.
        </p>
        <a href="/planes" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 inline-block">
          Ver planes
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Directorio del sector construcción</h1>
          <p className="text-sm text-gray-500 mt-1">{total.toLocaleString('es-PY')} contactos disponibles</p>
        </div>
        <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full font-medium">Plan Premium</span>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:border-orange-500"
        />
        <select
          value={rubro}
          onChange={(e) => setRubro(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
        >
          <option value="">Todos los rubros</option>
          {rubros.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {(busqueda || rubro) && (
          <button onClick={() => { setBusqueda(''); setRubro('') }}
            className="text-sm text-orange-500 hover:underline px-2">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : contactos.length === 0 ? (
        <p className="text-gray-500">No se encontraron contactos.</p>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Nombre</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Rubro</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Teléfono</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Ciudad</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contactos.map((contacto) => (
                  <tr key={contacto.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{contacto.nombre}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        {contacto.rubro}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {contacto.telefono ? (
                        <a href={`https://wa.me/595${contacto.telefono.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, te contacto a través del directorio de IronPY.')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-sm text-green-600 hover:underline flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          {contacto.telefono}
                        </a>
                      ) : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{contacto.ciudad || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      {contacto.email ? (
                        <a href={`mailto:${contacto.email}`} className="text-sm text-orange-500 hover:underline truncate block max-w-48">
                          {contacto.email}
                        </a>
                      ) : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > 100 && (
            <p className="text-xs text-gray-400 text-center">
              Mostrando 100 de {total.toLocaleString('es-PY')} contactos. Usá los filtros para encontrar lo que buscás.
            </p>
          )}
        </>
      )}
    </div>
  )
}