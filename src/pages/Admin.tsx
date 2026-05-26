import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [actualizando, setActualizando] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return }
      const { data: perfil } = await supabase
        .from('profiles')
        .select('es_admin')
        .eq('id', session.user.id)
        .single()
      if (!perfil?.es_admin) { navigate('/'); return }
      fetchUsuarios()
    })
  }, [])

  const fetchUsuarios = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, anuncios(count)')
      .order('created_at', { ascending: false })
    setUsuarios(data || [])
    setLoading(false)
  }

  const handleCambiarPlan = async (userId: string, plan: string) => {
    setActualizando(userId)
    await supabase.from('profiles').update({ plan }).eq('id', userId)
    setUsuarios(usuarios.map((u) => u.id === userId ? { ...u, plan } : u))
    setActualizando(null)
  }

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const totalPorPlan = {
    gratuito: usuarios.filter((u) => !u.plan || u.plan === 'gratuito').length,
    profesional: usuarios.filter((u) => u.plan === 'profesional').length,
    premium: usuarios.filter((u) => u.plan === 'premium').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
        <span className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full">Admin</span>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Plan Gratuito</p>
          <p className="text-2xl font-bold text-gray-900">{totalPorPlan.gratuito}</p>
          <p className="text-xs text-gray-400">usuarios</p>
        </div>
        <div className="bg-white border border-orange-200 rounded-xl p-4">
          <p className="text-xs text-orange-500 mb-1">Plan Profesional</p>
          <p className="text-2xl font-bold text-gray-900">{totalPorPlan.profesional}</p>
          <p className="text-xs text-gray-400">usuarios</p>
        </div>
        <div className="bg-white border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-700 mb-1">Plan Premium</p>
          <p className="text-2xl font-bold text-gray-900">{totalPorPlan.premium}</p>
          <p className="text-xs text-gray-400">usuarios</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Lista de usuarios */}
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Usuario</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Teléfono</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Anuncios</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Verificado</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Plan actual</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Cambiar plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{usuario.nombre || '—'}</p>
                    <p className="text-xs text-gray-500">{usuario.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">{usuario.telefono || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">{usuario.anuncios?.[0]?.count || 0}</p>
                  </td>
                  <td className="px-4 py-3">
                    {usuario.verificado ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Verificado</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">No verificado</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      usuario.plan === 'premium' ? 'bg-gray-900 text-white' :
                      usuario.plan === 'profesional' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {usuario.plan || 'gratuito'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {actualizando === usuario.id ? (
                      <span className="text-xs text-gray-400">Guardando...</span>
                    ) : (
                      <select
                        value={usuario.plan || 'gratuito'}
                        onChange={(e) => handleCambiarPlan(usuario.id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
                      >
                        <option value="gratuito">Gratuito</option>
                        <option value="profesional">Profesional</option>
                        <option value="premium">Premium</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuariosFiltrados.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No se encontraron usuarios.</p>
          )}
        </div>
      )}
    </div>
  )
}