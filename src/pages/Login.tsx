import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { validarEmail, validarPassword, useRateLimit } from '../lib/validaciones'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { puedeEnviar, registrarEnvio, tiempoRestante } = useRateLimit(15)

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {}
    const errEmail = validarEmail(email)
    const errPassword = validarPassword(password)
    if (errEmail) nuevosErrores.email = errEmail
    if (errPassword) nuevosErrores.password = errPassword
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validar()) return

    if (!puedeEnviar('login')) {
      const restante = tiempoRestante('login')
      setError(`Esperá ${restante} segundos antes de intentar de nuevo.`)
      return
    }

    setLoading(true)
    setError('')
    registrarEnvio('login')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos.')
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ingresar</h1>
        <p className="text-sm text-gray-500 mb-6">
          ¿No tenés cuenta? <Link to="/registro" className="text-orange-500 hover:underline">Registrate gratis</Link>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            <label className="text-sm font-medium text-gray-700 block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${errores.password ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-500'}`}
              placeholder="••••••••"
            />
            {errores.password && <p className="text-xs text-red-500 mt-1">{errores.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}