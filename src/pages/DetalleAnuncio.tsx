import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function DetalleAnuncio() {
  const { id } = useParams()
  const [anuncio, setAnuncio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fotoActiva, setFotoActiva] = useState(0)
  const [_user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const fetchAnuncio = async () => {
      const { data } = await supabase
        .from('anuncios')
        .select('*, categorias(nombre)')
        .eq('id', id)
        .single()
      setAnuncio(data)
      setLoading(false)
    }
    fetchAnuncio()
  }, [id])

  const handleInteres = () => {
    if (!anuncio?.contacto_telefono) return
    const telefono = anuncio.contacto_telefono.replace(/\D/g, '')
    const mensaje = encodeURIComponent(`Hola, estoy interesado en tu anuncio: ${anuncio.titulo} publicado en IronPY.`)
    window.open(`https://wa.me/595${telefono}?text=${mensaje}`, '_blank')
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Cargando...</div>
  if (!anuncio) return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Anuncio no encontrado.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/anuncios" className="text-sm text-orange-500 hover:underline mb-4 inline-block">
        ← Volver a anuncios
      </Link>

      <div className="grid grid-cols-2 gap-8">
        {/* Fotos */}
        <div>
          <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center overflow-hidden mb-2">
            {anuncio.fotos?.[fotoActiva] ? (
              <img src={anuncio.fotos[fotoActiva]} alt={anuncio.titulo} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">Sin foto</span>
            )}
          </div>
          {anuncio.fotos?.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {anuncio.fotos.map((foto: string, i: number) => (
                <img key={i} src={foto} alt=""
                  onClick={() => setFotoActiva(i)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${fotoActiva === i ? 'border-orange-500' : 'border-transparent'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-orange-500 font-medium">{anuncio.categorias?.nombre}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${anuncio.estado === 'nuevo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {anuncio.estado === 'nuevo' ? 'Nuevo' : 'Usado'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{anuncio.titulo}</h1>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {anuncio.moneda} {anuncio.precio?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {anuncio.forma_pago === 'contado' && 'Solo contado'}
            {anuncio.forma_pago === 'financiado' && `Financiado en ${anuncio.cuotas} cuotas`}
            {anuncio.forma_pago === 'ambos' && `Contado o financiado${anuncio.cuotas ? ` en ${anuncio.cuotas} cuotas` : ''}`}
          </p>

          {/* Especificaciones */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
            {anuncio.marca && <div><p className="text-xs text-gray-500">Marca</p><p className="font-medium text-gray-900">{anuncio.marca}</p></div>}
            {anuncio.modelo && <div><p className="text-xs text-gray-500">Modelo</p><p className="font-medium text-gray-900">{anuncio.modelo}</p></div>}
            {anuncio.año && <div><p className="text-xs text-gray-500">Año</p><p className="font-medium text-gray-900">{anuncio.año}</p></div>}
            {anuncio.color && <div><p className="text-xs text-gray-500">Color</p><p className="font-medium text-gray-900">{anuncio.color}</p></div>}
            {anuncio.horas_uso && <div><p className="text-xs text-gray-500">Horas de uso</p><p className="font-medium text-gray-900">{anuncio.horas_uso.toLocaleString()} hs</p></div>}
            {anuncio.kilometraje && <div><p className="text-xs text-gray-500">Kilometraje</p><p className="font-medium text-gray-900">{anuncio.kilometraje.toLocaleString()} km</p></div>}
            {anuncio.garantia && <div><p className="text-xs text-gray-500">Garantía</p><p className="font-medium text-gray-900">{anuncio.garantia}</p></div>}
            {anuncio.departamento && <div><p className="text-xs text-gray-500">Departamento</p><p className="font-medium text-gray-900">{anuncio.departamento}</p></div>}
          </div>

          {anuncio.descripcion && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Descripción</p>
              <p className="text-sm text-gray-600 leading-relaxed">{anuncio.descripcion}</p>
            </div>
          )}

          {/* Contacto */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Contacto</p>
            {anuncio.contacto_nombre && <p className="text-sm text-gray-900 font-medium mb-2">{anuncio.contacto_nombre}</p>}
            {anuncio.contacto_telefono && (
              <button
                onClick={handleInteres}
                className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 mb-2 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactar por WhatsApp
              </button>
            )}
            {anuncio.contacto_email && (
              <a href={`mailto:${anuncio.contacto_email}`} className="block text-sm text-orange-500 hover:underline text-center">
                ✉️ {anuncio.contacto_email}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}