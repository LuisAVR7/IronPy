export const validarEmail = (email: string): string => {
  if (!email) return 'El email es obligatorio'
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) return 'El email no es válido'
  return ''
}

export const validarPassword = (password: string): string => {
  if (!password) return 'La contraseña es obligatoria'
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
  return ''
}

export const validarTelefono = (telefono: string): string => {
  if (!telefono) return ''
  const limpio = telefono.replace(/\D/g, '')
  if (limpio.length < 9 || limpio.length > 12) return 'El teléfono debe tener entre 9 y 12 dígitos'
  return ''
}

export const validarPrecio = (precio: string): string => {
  if (!precio) return ''
  const num = parseFloat(precio)
  if (isNaN(num) || num <= 0) return 'El precio debe ser un número mayor a 0'
  if (num > 10000000) return 'El precio parece demasiado alto, verificá que esté en la moneda correcta'
  return ''
}

export const validarTitulo = (titulo: string): string => {
  if (!titulo) return 'El título es obligatorio'
  if (titulo.length < 10) return 'El título debe tener al menos 10 caracteres'
  if (titulo.length > 100) return 'El título no puede superar los 100 caracteres'
  return ''
}

export const validarNombre = (nombre: string): string => {
  if (!nombre) return 'El nombre es obligatorio'
  if (nombre.length < 3) return 'El nombre debe tener al menos 3 caracteres'
  return ''
}

export const useRateLimit = (segundos: number = 30) => {
  const puedeEnviar = (clave: string): boolean => {
    const ultimo = localStorage.getItem(`rl_${clave}`)
    if (!ultimo) return true
    const diferencia = (Date.now() - parseInt(ultimo)) / 1000
    return diferencia >= segundos
  }

  const registrarEnvio = (clave: string): void => {
    localStorage.setItem(`rl_${clave}`, Date.now().toString())
  }

  const tiempoRestante = (clave: string): number => {
    const ultimo = localStorage.getItem(`rl_${clave}`)
    if (!ultimo) return 0
    const diferencia = (Date.now() - parseInt(ultimo)) / 1000
    return Math.max(0, Math.ceil(segundos - diferencia))
  }

  return { puedeEnviar, registrarEnvio, tiempoRestante }
}