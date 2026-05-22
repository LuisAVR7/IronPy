import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PublicarAnuncio() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fotos, setFotos] = useState<File[]>([])
  const navigate = useNavigate()

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    moneda: 'USD',
    categoria_id: '',
    departamento: '',
    ciudad: '',
    año: '',
    horas_uso: '',
    kilometraje: '',
    marca: '',
    modelo: '',
    color: '',
    estado: 'usado',
    forma_pago: 'contado',
    cuotas: '',
    garantia: '',
    contacto_nombre: '',
    contacto_telefono: '',
    contacto_email: '',
  })

  const departamentos = [
    'Asunción', 'Alto Paraguay', 'Alto Paraná', 'Amambay', 'Boquerón',
    'Caaguazú', 'Caazapá', 'Canindeyú', 'Central', 'Concepción',
    'Cordillera', 'Guairá', 'Itapúa', 'Misiones', 'Ñeembucú',
    'Paraguarí', 'Presidente Hayes', 'San Pedro'
  ]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login')
      else setUser(session.user)
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFotos(Array.from(e.target.files).slice(0, 5))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const fotosUrls: string[] = []

      for (const foto of fotos) {
        const ext = foto.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('anuncios-fotos')
          .upload(path, foto)
        if (!uploadError) {
          const { data } = supabase.storage.from('anuncios-fotos').getPublicUrl(path)
          fotosUrls.push(data.publicUrl)
        }
      }

      const { error: insertError } = await supabase.from('anuncios').insert({
        user_id: user.id,
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: form.precio ? parseFloat(form.precio) : null,
        moneda: form.moneda,
        categoria_id: form.categoria_id ? parseInt(form.categoria_id) : null,
        departamento: form.departamento,
        ciudad: form.ciudad,
        año: form.año ? parseInt(form.año) : null,
        horas_uso: form.horas_uso ? parseInt(form.horas_uso) : null,
        kilometraje: form.kilometraje ? parseInt(form.kilometraje) : null,
        marca: form.marca,
        modelo: form.modelo,
        color: form.color,
        estado: form.estado,
        forma_pago: form.forma_pago,
        cuotas: form.cuotas ? parseInt(form.cuotas) : null,
        garantia: form.garantia,
        contacto_nombre: form.contacto_nombre,
        contacto_telefono: form.contacto_telefono,
        contacto_email: form.contacto_email,
        fotos: fotosUrls,
      })

      if (insertError) throw insertError
      navigate('/mis-anuncios')
    } catch (err) {
      setError('Error al publicar el anuncio. Intentá de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Publicar anuncio</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Información del equipo */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-medium text-gray-900 mb-4">Información del equipo</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
              <input name="titulo" value={form.titulo} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="Ej: Excavadora Komatsu PC200 2018" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Categoría *</label>
                <select name="categoria_id" value={form.categoria_id} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500">
                  <option value="">Seleccionar</option>
                  <option value="1">Maquinaria de construcción</option>
                  <option value="2">Maquinaria agrícola</option>
                  <option value="3">Camiones y transporte</option>
                  <option value="4">Implementos y accesorios</option>
                  <option value="5">Repuestos</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Estado</label>
                <select name="estado" value={form.estado} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500">
                  <option value="usado">Usado</option>
                  <option value="nuevo">Nuevo</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Marca</label>
                <input name="marca" value={form.marca} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ej: Caterpillar" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Modelo</label>
                <input name="modelo" value={form.modelo} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ej: 320D" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Año</label>
                <input name="año" value={form.año} onChange={handleChange} type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ej: 2019" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Horas de uso</label>
                <input name="horas_uso" value={form.horas_uso} onChange={handleChange} type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ej: 3500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Kilometraje</label>
                <input name="kilometraje" value={form.kilometraje} onChange={handleChange} type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ej: 50000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Color</label>
                <input name="color" value={form.color} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ej: Amarillo" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Garantía</label>
                <input name="garantia" value={form.garantia} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ej: 6 meses, sin garantía" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="Describí el estado, accesorios incluidos, historial de mantenimiento..." />
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-medium text-gray-900 mb-4">Ubicación</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Departamento *</label>
              <select name="departamento" value={form.departamento} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500">
                <option value="">Seleccionar</option>
                {departamentos.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Ciudad</label>
              <input name="ciudad" value={form.ciudad} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="Ej: Ciudad del Este" />
            </div>
          </div>
        </div>

        {/* Precio y forma de pago */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-medium text-gray-900 mb-4">Precio y forma de pago</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <select name="moneda" value={form.moneda} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500">
                <option value="USD">USD</option>
                <option value="PYG">PYG</option>
              </select>
              <input name="precio" value={form.precio} onChange={handleChange} type="number"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="Precio" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Forma de pago</label>
              <select name="forma_pago" value={form.forma_pago} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500">
                <option value="contado">Contado</option>
                <option value="financiado">Financiado</option>
                <option value="ambos">Contado o financiado</option>
              </select>
            </div>
            {(form.forma_pago === 'financiado' || form.forma_pago === 'ambos') && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Cantidad de cuotas</label>
                <input name="cuotas" value={form.cuotas} onChange={handleChange} type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ej: 12, 24, 36" />
              </div>
            )}
          </div>
        </div>

        {/* Fotos */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-medium text-gray-900 mb-4">Fotos (máx. 5)</h2>
          <input type="file" accept="image/*" multiple onChange={handleFotos}
            className="text-sm text-gray-600" />
          {fotos.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {fotos.map((f, i) => (
                <img key={i} src={URL.createObjectURL(f)} alt="" className="w-20 h-20 object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>

        {/* Contacto */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-medium text-gray-900 mb-4">Datos de contacto</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nombre</label>
              <input name="contacto_nombre" value={form.contacto_nombre} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="Nombre de contacto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Teléfono / WhatsApp</label>
                <input name="contacto_telefono" value={form.contacto_telefono} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="0981 000 000" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input name="contacto_email" value={form.contacto_email} onChange={handleChange} type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="contacto@email.com" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50">
          {loading ? 'Publicando...' : 'Publicar anuncio'}
        </button>
      </form>
    </div>
  )
}