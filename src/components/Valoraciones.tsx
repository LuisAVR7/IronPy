import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  vendedorId: string
  anuncioId?: string
  mostrarFormulario?: boolean
}

export default function Valoraciones({ vendedorId, anuncioId, mostrarFormulario = false }: Props) {
  const [valoraciones, setValoraciones] = useState<any[]>([])
  const [promedio, setPromedio] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [yaValoro, setYaValoro] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [puntuacion, setPuntuacion] = useState(5)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    fetchValoraciones()
  }, [vendedorId])

  const fetchValoraciones = async () => {
    const { data } = await supabase
      .from('valoraciones')
      .select('*, profiles!comprador_id(nombre)')
      .eq('vendedor_id', vendedorId)
      .order('created_at', { ascending: false })
    setValoraciones(data || [])
    if (data && data.length > 0) {
      const prom = data.reduce((acc, v) => acc + v.puntuacion, 0) / data.length
      setPromedio(Math.round(prom * 10) / 10)
    }
  }

  useEffect(() => {
    if (user && anuncioId) {
      supabase
        .from('valoraciones')
        .select('id')
        .eq('anuncio_id', anuncioId)
        .eq('comprador_id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setYaValoro(true)
        })
    }
  }, [user, anuncioId])

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !anuncioId) return
    setEnviando(true)
    const { error } = await supabase.from('valoraciones').insert({
      vendedor_id: vendedorId,
      comprador_id: user.id,
      anuncio_id: anuncioId,
      puntuacion,
      comentario,
    })
    if (!error) {
      setEnviado(true)
      setMostrarForm(false)
      fetchValoraciones()
    }
    setEnviando(false)
  }

  const Estrellas = ({ valor, interactivo = false }: { valor: number, interactivo?: boolean }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => interactivo && setPuntuacion(i)}
          className={`text-lg ${interactivo ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${i <= valor ? 'text-orange-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  )

  return (
    <div>
      {/* Resumen */}
      {valoraciones.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <Estrellas valor={Math.round(promedio)} />
          <span className="text-sm font-medium text-gray-700">{promedio} de 5</span>
          <span className="text-sm text-gray-400">({valoraciones.length} {valoraciones.length === 1 ? 'valoración' : 'valoraciones'})</span>
        </div>
      )}

      {/* Botón para valorar */}
      {mostrarFormulario && user && anuncioId && !yaValoro && !enviado && (
        <div className="mb-4">
          {!mostrarForm ? (
            <button onClick={() => setMostrarForm(true)}
              className="text-sm border border-orange-300 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50">
              ★ Dejar valoración
            </button>
          ) : (
            <form onSubmit={handleEnviar} className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Tu valoración</p>
              <div className="mb-3">
                <Estrellas valor={puntuacion} interactivo={true} />
              </div>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={2}
                placeholder="Contá tu experiencia con este vendedor (opcional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 mb-3"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={enviando}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                  {enviando ? 'Enviando...' : 'Enviar valoración'}
                </button>
                <button type="button" onClick={() => setMostrarForm(false)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {enviado && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
          <p className="text-green-700 text-sm font-medium">✓ Valoración enviada, gracias</p>
        </div>
      )}

      {/* Lista de valoraciones */}
      {valoraciones.length === 0 ? (
        <p className="text-sm text-gray-400">Sin valoraciones todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {valoraciones.map((v) => (
            <div key={v.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{v.profiles?.nombre || 'Usuario'}</span>
                <Estrellas valor={v.puntuacion} />
              </div>
              {v.comentario && <p className="text-sm text-gray-600">{v.comentario}</p>}
              <p className="text-xs text-gray-400 mt-1">{new Date(v.created_at).toLocaleDateString('es-PY')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}