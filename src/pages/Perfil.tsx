import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Perfil() {
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [cedula, setCedula] = useState<File | null>(null)
  const [subiendoCedula, setSubiendoCedula] = useState(false)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    ciudad: '',
    email: '',
  })

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return }
      setUser(session.user)
      const { data } = await supabase
        .from('profiles')
        .select('nombre, telefono, ciudad, email, verificado, cedula_url')
        .eq('id', session.user.id)
        .single()
      if (data) {
        setPerfil(data)
        setForm({
          nombre: data.nombre || '',
          telefono: data.telefono || '',
          ciudad: data.ciudad || '',
          email: data.email || session.user.email || '',
        })
      }
      setLoading(false)
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')
    const { error } = await supabase
      .from('profiles')
      .update({
        nombre: form.nombre,
        telefono: form.telefono,
        ciudad: form.ciudad,
      })
      .eq('id', user.id)
    if (error) {
      setMensaje('Error al guardar. Intentá de nuevo.')
    } else {
      setMensaje('Perfil actualizado correctamente.')
      setPerfil({ ...perfil, nombre: form.nombre, telefono: form.telefono, ciudad: form.ciudad })
    }
    setGuardando(false)
  }

  const handleCedula = async () => {
    if (!cedula || !user) return
    setSubiendoCedula(true)
    try {
      const ext = cedula.name.split('.').pop()
      const path = `${user.id}/cedula_propia.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('documentos-interesados')
        .upload(path, cedula, { upsert: true })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('documentos-interesados')
          .getPublicUrl(path)

        const perfilCompleto = form.nombre && form.telefono && form.ciudad

        await supabase.from('profiles').update({
          cedula_url: urlData.publicUrl,
          verificado: perfilCompleto,
        }).eq('id', user.id)

        setPerfil({ ...perfil, cedula_url: urlData.publicUrl, verificado: perfilCompleto })
        setMensaje(perfilCompleto ? '✓ Cédula cargada. Tu perfil quedó verificado.' : '✓ Cédula cargada. Completá nombre, teléfono y ciudad para verificar tu perfil.')
        setCedula(null)
      }
    } catch (err) {
      setMensaje('Error al cargar la cédula. Intentá de nuevo.')
    }
    setSubiendoCedula(false)
  }

  if (loading) return <div className="max-w-xl mx-auto px-4 py-8 text-gray-500">Cargando...</div>

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        {perfil?.verificado && (
          <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            ✓ Vendedor verificado
          </span>
        )}
      </div>

      {!perfil?.verificado && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-orange-700 mb-1">¿Cómo verificar tu perfil?</p>
          <p className="text-sm text-orange-600">Completá tu nombre, teléfono y ciudad, y cargá tu cédula de identidad. El badge de vendedor verificado genera más confianza en los compradores.</p>
        </div>
      )}

      {mensaje && (
        <div className={`text-sm rounded-lg px-4 py-3 mb-4 ${mensaje.includes('Error') ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleGuardar} className="flex flex-col gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-medium text-gray-900 mb-4">Datos personales</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nombre completo</label>
              <input name="nombre" value={form.nombre} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="Tu nombre completo" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input value={form.email} disabled
                className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">El email no se puede modificar</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Teléfono / WhatsApp</label>
                <input name="telefono" value={form.telefono} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="0981 000 000" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Ciudad</label>
                <input name="ciudad" value={form.ciudad} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ej: Asunción" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={guardando}
          className="bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50">
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      {/* Sección cédula */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mt-5">
        <h2 className="font-medium text-gray-900 mb-1">Verificación de identidad</h2>
        <p className="text-xs text-gray-500 mb-4">Tu cédula es privada y solo es usada para verificar tu identidad como vendedor.</p>

        {perfil?.cedula_url ? (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-green-700 text-sm font-medium">✓ Cédula cargada correctamente</p>
          </div>
        ) : null}

        <div className="flex gap-2 mb-3">
          <label className="flex-1 border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
            <span className="text-2xl">📷</span>
            <p className="text-xs text-gray-600 mt-1">Usar cámara</p>
            <input type="file" accept="image/*" capture="environment"
              onChange={(e) => setCedula(e.target.files?.[0] || null)}
              className="hidden" />
          </label>
          <label className="flex-1 border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
            <span className="text-2xl">🖼️</span>
            <p className="text-xs text-gray-600 mt-1">Desde galería</p>
            <input type="file" accept="image/*"
              onChange={(e) => setCedula(e.target.files?.[0] || null)}
              className="hidden" />
          </label>
        </div>

        {cedula && (
          <p className="text-xs text-green-600 mb-3">✓ Archivo seleccionado: {cedula.name}</p>
        )}

        <button onClick={handleCedula} disabled={!cedula || subiendoCedula}
          className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
          {subiendoCedula ? 'Subiendo...' : perfil?.cedula_url ? 'Actualizar cédula' : 'Cargar cédula'}
        </button>
      </div>
    </div>
  )
}