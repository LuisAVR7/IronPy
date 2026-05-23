import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { formatPrecio } from '../lib/utils'

export default function DetalleAnuncio() {
  const { id } = useParams()
  const [anuncio, setAnuncio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fotoActiva, setFotoActiva] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [cedula, setCedula] = useState<File | null>(null)
  const [subiendoCedula, setSubiendoCedula] = useState(false)
  const [cedulaSubida, setCedulaSubida] = useState(false)
  const [mostrarFormCedula, setMostrarFormCedula] = useState(false)
  const [documentoExtra, setDocumentoExtra] = useState<File | null>(null)
  const [subiendoDoc, setSubiendoDoc] = useState(false)
  const [docSubido, setDocSubido] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [mostrarReporte, setMostrarReporte] = useState(false)
  const [motivoReporte, setMotivoReporte] = useState('')
  const [descripcionReporte, setDescripcionReporte] = useState('')
  const [enviandoReporte, setEnviandoReporte] = useState(false)
  const [reporteEnviado, setReporteEnviado] = useState(false)
  const navigate = useNavigate()

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
      await supabase.from('visitas').insert({ anuncio_id: id })
    }
    fetchAnuncio()
  }, [id])

  const handleWhatsApp = () => {
    if (!anuncio?.contacto_telefono) return
    const telefono = anuncio.contacto_telefono.replace(/\D/g, '')
    const mensaje = encodeURIComponent(`Hola, estoy interesado en tu anuncio: ${anuncio.titulo} publicado en IronPY.`)
    window.open(`https://wa.me/595${telefono}?text=${mensaje}`, '_blank')
  }

  const handleCedula = async () => {
    if (!cedula || !user) return
    setSubiendoCedula(true)
    try {
      const ext = cedula.name.split('.').pop()
      const path = `${user.id}/${id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('documentos-interesados')
        .upload(path, cedula)

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('documentos-interesados')
          .getPublicUrl(path)

        await supabase.from('interesados').upsert({
          anuncio_id: id,
          user_id: user.id,
          cedula_url: urlData.publicUrl,
          estado: 'pendiente'
        }, { onConflict: 'anuncio_id,user_id' })

        if (anuncio?.contacto_telefono) {
          const telefono = anuncio.contacto_telefono.replace(/\D/g, '')
          const mensaje = encodeURIComponent(`Hola, un usuario de IronPY ha cargado su cédula y está formalmente interesado en tu anuncio: ${anuncio.titulo}. Ingresá a tu panel para ver los detalles.`)
          window.open(`https://wa.me/595${telefono}?text=${mensaje}`, '_blank')
        }
        setCedulaSubida(true)
        setMostrarFormCedula(false)
      }
    } catch (err) {
      console.error(err)
    }
    setSubiendoCedula(false)
  }

  const handleDocumentoExtra = async () => {
    if (!documentoExtra || !user) return
    setSubiendoDoc(true)
    try {
      const ext = documentoExtra.name.split('.').pop()
      const path = `${user.id}/${id}/doc_${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('documentos-interesados')
        .upload(path, documentoExtra)

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('documentos-interesados')
          .getPublicUrl(path)

        const { data: interesado } = await supabase
          .from('interesados')
          .select('documentos_urls')
          .eq('anuncio_id', id)
          .eq('user_id', user.id)
          .single()

        const docsActuales = interesado?.documentos_urls || []
        await supabase.from('interesados').upsert({
          anuncio_id: id,
          user_id: user.id,
          documentos_urls: [...docsActuales, urlData.publicUrl],
        }, { onConflict: 'anuncio_id,user_id' })

        setDocSubido(true)
        setDocumentoExtra(null)
      }
    } catch (err) {
      console.error(err)
    }
    setSubiendoDoc(false)
  }

  const handleCompartirWhatsApp = () => {
    const texto = encodeURIComponent(`${anuncio.titulo} — ${anuncio.moneda} ${anuncio.precio?.toLocaleString('es-PY')} — Ver en IronPY: ${window.location.href}`)
    window.open(`https://wa.me/?text=${texto}`, '_blank')
  }

  const handleCompartirFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
  }

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  const handleReporte = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !motivoReporte) return
    setEnviandoReporte(true)
    const { error } = await supabase.from('reportes').insert({
      anuncio_id: id,
      user_id: user.id,
      motivo: motivoReporte,
      descripcion: descripcionReporte,
    })
    if (!error) {
      setReporteEnviado(true)
      setMostrarReporte(false)
    }
    setEnviandoReporte(false)
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Cargando...</div>
  if (!anuncio) return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Anuncio no encontrado.</div>

  const esFinanciable = anuncio.forma_pago === 'financiado' || anuncio.forma_pago === 'ambos'

  return (
    <>
      <Helmet>
        <title>{anuncio.titulo} — IronPY</title>
        <meta name="description" content={`${anuncio.marca || ''} ${anuncio.modelo || ''} ${anuncio.año || ''} — ${anuncio.moneda} ${anuncio.precio?.toLocaleString('es-PY')} — ${anuncio.departamento} — IronPY Maquinarias Paraguay`} />
        <meta property="og:title" content={`${anuncio.titulo} — IronPY`} />
        <meta property="og:description" content={`${anuncio.moneda} ${anuncio.precio?.toLocaleString('es-PY')} — ${anuncio.departamento}`} />
        {anuncio.fotos?.[0] && <meta property="og:image" content={anuncio.fotos[0]} />}
        <meta property="og:url" content={window.location.href} />
        <meta name="robots" content={anuncio.plan === 'gratuito' ? 'noindex' : 'index, follow'} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/anuncios" className="text-sm text-orange-500 hover:underline">
            ← Volver a anuncios
          </Link>
          {user && !reporteEnviado && (
            <button onClick={() => setMostrarReporte(!mostrarReporte)}
              className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
              🚩 Reportar anuncio
            </button>
          )}
          {reporteEnviado && (
            <span className="text-xs text-green-600">✓ Reporte enviado, gracias</span>
          )}
        </div>

        {/* Formulario de reporte */}
        {mostrarReporte && user && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-red-700 mb-3">Reportar este anuncio</h3>
            <form onSubmit={handleReporte} className="flex flex-col gap-3">
              <select value={motivoReporte} onChange={(e) => setMotivoReporte(e.target.value)} required
                className="border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400 bg-white">
                <option value="">Seleccioná un motivo</option>
                <option value="fraude">Posible fraude o estafa</option>
                <option value="falso">Información falsa o engañosa</option>
                <option value="duplicado">Anuncio duplicado</option>
                <option value="precio">Precio irreal o abusivo</option>
                <option value="otro">Otro motivo</option>
              </select>
              <textarea value={descripcionReporte} onChange={(e) => setDescripcionReporte(e.target.value)}
                rows={2} placeholder="Describí brevemente el problema (opcional)"
                className="border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
              <div className="flex gap-2">
                <button type="submit" disabled={enviandoReporte || !motivoReporte}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50">
                  {enviandoReporte ? 'Enviando...' : 'Enviar reporte'}
                </button>
                <button type="button" onClick={() => setMostrarReporte(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

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

            {/* Compartir */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Compartir este anuncio</p>
              <div className="flex gap-2">
                <button onClick={handleCompartirWhatsApp}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-green-600 flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button onClick={handleCompartirFacebook}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button onClick={handleCopiarLink}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-800 flex items-center justify-center gap-1">
                  {linkCopiado ? '✓ Copiado' : '🔗 Copiar link'}
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-orange-500 font-medium">{anuncio.categorias?.nombre}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${anuncio.estado === 'nuevo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {anuncio.estado === 'nuevo' ? 'Nuevo' : 'Usado'}
              </span>
              {anuncio.vendido ? (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">Vendido</span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">Disponible</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{anuncio.titulo}</h1>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {anuncio.precio ? formatPrecio(anuncio.precio, anuncio.moneda) : 'Consultar precio'}
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
              {anuncio.horas_uso && <div><p className="text-xs text-gray-500">Horas de uso</p><p className="font-medium text-gray-900">{anuncio.horas_uso.toLocaleString('es-PY')} hs</p></div>}
              {anuncio.kilometraje && <div><p className="text-xs text-gray-500">Kilometraje</p><p className="font-medium text-gray-900">{anuncio.kilometraje.toLocaleString('es-PY')} km</p></div>}
              {anuncio.garantia && <div><p className="text-xs text-gray-500">Garantía</p><p className="font-medium text-gray-900">{anuncio.garantia}</p></div>}
              {anuncio.departamento && <div><p className="text-xs text-gray-500">Departamento</p><p className="font-medium text-gray-900">{anuncio.departamento}</p></div>}
              {anuncio.ciudad && <div><p className="text-xs text-gray-500">Ciudad</p><p className="font-medium text-gray-900">{anuncio.ciudad}</p></div>}
            </div>

            {anuncio.descripcion && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Descripción</p>
                <p className="text-sm text-gray-600 leading-relaxed">{anuncio.descripcion}</p>
              </div>
            )}

            {/* Contacto */}
            {user ? (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Contacto</p>
                {anuncio.contacto_nombre && <p className="text-sm text-gray-900 font-medium mb-2">{anuncio.contacto_nombre}</p>}
                {anuncio.contacto_telefono && (
                  <button onClick={handleWhatsApp}
                    className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 mb-3 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contactar por WhatsApp
                  </button>
                )}

                {cedulaSubida ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center mb-3">
                    <p className="text-green-700 text-sm font-medium">✓ Cédula enviada correctamente</p>
                    <p className="text-green-600 text-xs mt-1">El vendedor fue notificado por WhatsApp</p>
                  </div>
                ) : mostrarFormCedula ? (
                  <div className="border border-gray-200 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-2">Seleccioná una opción para subir tu cédula:</p>
                    <div className="flex gap-2 mb-3">
                      <label className="flex-1 border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50">
                        <span className="text-lg">📷</span>
                        <p className="text-xs text-gray-600 mt-1">Usar cámara</p>
                        <input type="file" accept="image/*" capture="environment"
                          onChange={(e) => setCedula(e.target.files?.[0] || null)}
                          className="hidden" />
                      </label>
                      <label className="flex-1 border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50">
                        <span className="text-lg">🖼️</span>
                        <p className="text-xs text-gray-600 mt-1">Desde galería</p>
                        <input type="file" accept="image/*"
                          onChange={(e) => setCedula(e.target.files?.[0] || null)}
                          className="hidden" />
                      </label>
                    </div>
                    {cedula && <p className="text-xs text-green-600 mb-2">✓ Archivo seleccionado: {cedula.name}</p>}
                    <div className="flex gap-2">
                      <button onClick={handleCedula} disabled={!cedula || subiendoCedula}
                        className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                        {subiendoCedula ? 'Enviando...' : 'Enviar cédula'}
                      </button>
                      <button onClick={() => setMostrarFormCedula(false)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <button onClick={() => setMostrarFormCedula(true)}
                      className="w-full border border-orange-300 text-orange-600 py-2 rounded-lg text-sm font-medium hover:bg-orange-50">
                      📎 Cargar cédula de identidad
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      Para verificación de datos y formalización del interés
                    </p>
                  </div>
                )}

                {/* Documentos adicionales para crédito */}
                {esFinanciable && cedulaSubida && (
                  <div className="border-t border-orange-100 pt-3 mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Documentos para gestión de crédito</p>
                    <p className="text-xs text-gray-400 mb-2">Opcional — podés entregar los documentos personalmente al vendedor si preferís.</p>
                    {docSubido && (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center mb-2">
                        <p className="text-green-700 text-xs font-medium">✓ Documento enviado</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <label className="flex-1 border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50">
                        <span className="text-base">📷</span>
                        <p className="text-xs text-gray-600 mt-0.5">Cámara</p>
                        <input type="file" accept="image/*,application/pdf" capture="environment"
                          onChange={(e) => setDocumentoExtra(e.target.files?.[0] || null)}
                          className="hidden" />
                      </label>
                      <label className="flex-1 border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50">
                        <span className="text-base">📁</span>
                        <p className="text-xs text-gray-600 mt-0.5">Galería/Archivo</p>
                        <input type="file" accept="image/*,application/pdf"
                          onChange={(e) => setDocumentoExtra(e.target.files?.[0] || null)}
                          className="hidden" />
                      </label>
                    </div>
                    {documentoExtra && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600 mb-2">✓ {documentoExtra.name}</p>
                        <button onClick={handleDocumentoExtra} disabled={subiendoDoc}
                          className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
                          {subiendoDoc ? 'Enviando...' : 'Enviar documento'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {anuncio.contacto_email && (
                  <a href={`mailto:${anuncio.contacto_email}`} className="block text-sm text-orange-500 hover:underline text-center mt-3">
                    ✉️ {anuncio.contacto_email}
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Registrate gratis para ver los datos de contacto y comunicarte con el vendedor
                </p>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/registro')}
                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
                    Registrarse gratis
                  </button>
                  <button onClick={() => navigate('/login')}
                    className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Ingresar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}