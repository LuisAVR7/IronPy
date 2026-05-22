import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Anuncios() {
  const [anuncios, setAnuncios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [busqueda, setBusqueda] = useState('')
  const [departamento, setDepartamento] = useState('')
  const categoriaFiltro = searchParams.get('categoria') || ''

  const departamentos = [
    'Asunción', 'Alto Paraguay', 'Alto Paraná', 'Amambay', 'Boquerón',
    'Caaguazú', 'Caazapá', 'Canindeyú', 'Central', 'Concepción',
    'Cordillera', 'Guairá', 'Itapúa', 'Misiones', 'Ñeembucú',
    'Paraguarí', 'Presidente Hayes', 'San Pedro'
  ]

  useEffect(() => {
    const fetchAnuncios = async () => {
      setLoading(true)
      let query = supabase
        .from('anuncios')
        .select('*, categorias(nombre, slug)')
        .eq('activo', true)
        .order('destacado', { ascending: false })
        .order('created_at', { ascending: false })

      if (categoriaFiltro) {
        const { data: cat } = await supabase
          .from('categorias')
          .select('id')
          .eq('slug', categoriaFiltro)
          .single()
        if (cat) query = query.eq('categoria_id', cat.id)
      }

      if (departamento) query = query.eq('departamento', departamento)
      if (busqueda) query = query.ilike('titulo', `%${busqueda}%`)

      const { data } = await query
      setAnuncios(data || [])
      setLoading(false)
    }
    fetchAnuncios()
  }, [categoriaFiltro, departamento, busqueda])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Anuncios</h1>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:border-orange-500"
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setSearchParams(e.target.value ? { categoria: e.target.value } : {})}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
        >
          <option value="">Todas las categorías</option>
          <option value="construccion">Construcción</option>
          <option value="agricola">Agrícola</option>
          <option value="camiones">Camiones</option>
          <option value="implementos">Implementos y accesorios</option>
          <option value="repuestos">Repuestos</option>
        </select>
        <select
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
        >
          <option value="">Todos los departamentos</option>
          {departamentos.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Listado */}
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : anuncios.length === 0 ? (
        <p className="text-gray-500">No se encontraron anuncios.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {anuncios.map((anuncio) => (
            <Link
              key={anuncio.id}
              to={`/anuncios/${anuncio.id}`}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
            >
              {anuncio.destacado && (
                <div className="bg-orange-500 text-white text-xs text-center py-1 font-medium">
                  Destacado
                </div>
              )}
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {anuncio.fotos?.[0] ? (
                  <img src={anuncio.fotos[0]} alt={anuncio.titulo} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">Sin foto</span>
                )}
              </div>
              <div className="p-4">
  <div className="flex items-center justify-between mb-1">
    <p className="text-xs text-orange-500 font-medium">{anuncio.categorias?.nombre}</p>
    {anuncio.vendido ? (
      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">Vendido</span>
    ) : (
      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">Disponible</span>
    )}
  </div>
  <h3 className="font-medium text-gray-900 mb-1 truncate">{anuncio.titulo}</h3>
  <p className="text-sm text-gray-500 mb-2">{anuncio.departamento}</p>
  <p className="font-bold text-gray-900">{anuncio.moneda} {anuncio.precio?.toLocaleString()}</p>
</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}