import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Perfil() {
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [user, setUser] = useState<any>(null)
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
        .select('nombre, telefono, ciudad, email')
        .eq('id', session.user.id)
        .single()
      if (data) {
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
    }
    setGuardando(false)
  }

  if (loading) return <div className="max-w-xl mx-auto px-4 py-8 text-gray-500">Cargando...</div>

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi perfil</h1>

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
    </div>
  )
}