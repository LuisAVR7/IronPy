export function formatPrecio(precio: number, moneda: string = 'USD'): string {
  if (moneda === 'PYG') {
    return `₲ ${precio.toLocaleString('es-PY')}`
  }
  return `USD ${precio.toLocaleString('es-PY')}`
}