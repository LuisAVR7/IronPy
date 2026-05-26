import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { validarEmail, validarPassword, validarNombre, validarTelefono, useRateLimit } from '../lib/validaciones'

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [_tiempoEspera, setTiempoEspera] = useState(0)
  const navigate = useNavigate()
  const { puedeEnviar, registrarEnvio, tiempoRestante } = useRateLimit(30)

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {}
    const errNombre = validarNombre(nombre)
    const errEmail = validarEmail(email)
    const errPassword = validarPassword(password)
    const errTelefono = validarTelefono(telefono)
    if (errNombre) nuevosErrores.nombre = errNombre
    if (errEmail) nuevosErrores.email = errEmail
    if (errPassword) nuevosErrores.password = errPassword
    if (errTelefono) nuevosErrores.telefono = errTelefono
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validar()) return

    if (!puedeEnviar('registro')) {
      const restante = tiempoRestante('registro')
      setTiempoEspera(restante)
      setError(`Esperá ${restante} segundos antes de intentar de nuevo.`)
      return
    }

    setLoading(true)
    setError('')
    registrarEnvio('registro')

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError('Error al registrarse. Intentá con otro email.')
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase
        .from('profiles')
        .update({ nombre, telefono })
        .eq('id', data.user.id)
    }

    navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
        <p className="text-sm text-gray-500 mb-6">
          ¿Ya tenés cuenta? <Link to="/login" className="text-orange-500 hover:underline">Ingresá acá</Link>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegistro} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${errores.nombre ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-500'}`}
              placeholder="Juan Pérez"
            />
            {errores.nombre && <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${errores.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-500'}`}
              placeholder="tu@email.com"
            />
            {errores.email && <p className="text-xs text-red-500 mt-1">{errores.email}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${errores.telefono ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-500'}`}
              placeholder="0981 000 000"
            />
            {errores.telefono && <p className="text-xs text-red-500 mt-1">{errores.telefono}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${errores.password ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-500'}`}
              placeholder="Mínimo 6 caracteres"
            />
            {errores.password && <p className="text-xs text-red-500 mt-1">{errores.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}