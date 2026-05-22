import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrecio } from '../lib/utils'

export default function Home() {
  const [anuncios, setAnuncios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnuncios = async () => {
      const { data } = await supabase
        .from('anuncios')
        .select('*, categorias(nombre)')
        .eq('activo', true)
        .order('created_at', { ascending: false })
        .limit(6)
      setAnuncios(data || [])
      setLoading(false)
    }
    fetchAnuncios()
  }, [])

  const categorias = [
    {
      nombre: 'Construcción',
      slug: 'construccion',
      svg: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="38" width="60" height="10" rx="2" fill="#F97316"/>
          <rect x="2" y="44" width="12" height="10" rx="2" fill="#EA580C"/>
          <circle cx="10" cy="54" r="6" fill="#1F2937" stroke="#F97316" strokeWidth="2"/>
          <circle cx="10" cy="54" r="2" fill="#F97316"/>
          <circle cx="52" cy="54" r="6" fill="#1F2937" stroke="#F97316" strokeWidth="2"/>
          <circle cx="52" cy="54" r="2" fill="#F97316"/>
          <rect x="14" y="30" width="30" height="10" rx="1" fill="#EA580C"/>
          <path d="M44 30 L54 38 L44 38 Z" fill="#F97316"/>
          <rect x="6" y="34" width="8" height="6" rx="1" fill="#FED7AA"/>
          <path d="M44 20 L44 30 L36 30 L36 20 Z" fill="#D97706"/>
          <path d="M44 20 L52 28 L52 38 L44 38 Z" fill="#F97316" opacity="0.5"/>
        </svg>
      )
    },
    {
      nombre: 'Agrícola',
      slug: 'agricola',
      svg: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="28" width="35" height="18" rx="3" fill="#F97316"/>
          <rect x="8" y="28" width="14" height="10" rx="2" fill="#FED7AA"/>
          <rect x="10" y="30" width="10" height="7" rx="1" fill="#BAE6FD"/>
          <circle cx="18" cy="50" r="10" fill="#1F2937" stroke="#F97316" strokeWidth="2"/>
          <circle cx="18" cy="50" r="5" fill="#374151" stroke="#F97316" strokeWidth="1.5"/>
          <circle cx="18" cy="50" r="2" fill="#F97316"/>
          <circle cx="48" cy="52" r="7" fill="#1F2937" stroke="#F97316" strokeWidth="2"/>
          <circle cx="48" cy="52" r="3" fill="#374151" stroke="#F97316" strokeWidth="1.5"/>
          <circle cx="48" cy="52" r="1.5" fill="#F97316"/>
          <path d="M43 28 L43 18 L50 18 L50 28" fill="#EA580C"/>
          <path d="M38 28 L43 18" stroke="#D97706" strokeWidth="2"/>
          <rect x="43" y="34" width="12" height="6" rx="1" fill="#EA580C"/>
          <path d="M55 34 L60 37 L55 40 Z" fill="#F97316"/>
        </svg>
      )
    },
    {
      nombre: 'Camiones',
      slug: 'camiones',
      svg: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="24" width="38" height="22" rx="2" fill="#F97316"/>
          <rect x="2" y="24" width="14" height="14" rx="2" fill="#EA580C"/>
          <rect x="4" y="26" width="10" height="10" rx="1" fill="#BAE6FD"/>
          <rect x="40" y="30" width="20" height="16" rx="2" fill="#EA580C"/>
          <path d="M40 30 L52 24 L60 24 L60 30 Z" fill="#F97316"/>
          <circle cx="12" cy="48" r="7" fill="#1F2937" stroke="#F97316" strokeWidth="2"/>
          <circle cx="12" cy="48" r="3" fill="#374151"/>
          <circle cx="12" cy="48" r="1.5" fill="#F97316"/>
          <circle cx="30" cy="48" r="7" fill="#1F2937" stroke="#F97316" strokeWidth="2"/>
          <circle cx="30" cy="48" r="3" fill="#374151"/>
          <circle cx="30" cy="48" r="1.5" fill="#F97316"/>
          <circle cx="52" cy="48" r="7" fill="#1F2937" stroke="#F97316" strokeWidth="2"/>
          <circle cx="52" cy="48" r="3" fill="#374151"/>
          <circle cx="52" cy="48" r="1.5" fill="#F97316"/>
        </svg>
      )
    },
    {
      nombre: 'Implementos',
      slug: 'implementos',
      svg: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 48 L8 20 L20 20 L20 48 Z" fill="#F97316"/>
          <path d="M20 20 L32 14 L32 48 L20 48 Z" fill="#EA580C"/>
          <path d="M32 14 L44 20 L44 48 L32 48 Z" fill="#F97316"/>
          <path d="M44 20 L56 20 L56 48 L44 48 Z" fill="#EA580C"/>
          <rect x="4" y="46" width="56" height="6" rx="2" fill="#D97706"/>
          <path d="M8 20 L56 20" stroke="#D97706" strokeWidth="2"/>
        </svg>
      )
    },
    {
      nombre: 'Repuestos',
      slug: 'repuestos',
      svg: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="20" fill="#1F2937" stroke="#F97316" strokeWidth="3"/>
          <circle cx="32" cy="32" r="8" fill="#F97316"/>
          <circle cx="32" cy="32" r="3" fill="#1F2937"/>
          <rect x="30" y="10" width="4" height="8" rx="2" fill="#F97316"/>
          <rect x="30" y="46" width="4" height="8" rx="2" fill="#F97316"/>
          <rect x="10" y="30" width="8" height="4" rx="2" fill="#F97316"/>
          <rect x="46" y="30" width="8" height="4" rx="2" fill="#F97316"/>
        </svg>
      )
    },
  ]

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gray-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-medium px-3 py-1 rounded-full mb-4">
            100% Paraguay — Vendedores locales
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Comprá y vendé maquinaria pesada en <span className="text-orange-500">Paraguay</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            El clasificado local especializado en maquinaria de construcción, agrícola y camiones.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/anuncios" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600">
              Ver anuncios
            </Link>
            <Link to="/publicar" className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900">
              Publicar gratis
            </Link>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
        <div className="grid grid-cols-5 gap-4 mb-12">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              to={`/anuncios?categoria=${cat.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-orange-500 hover:shadow-md transition-all"
            >
              <div className="flex justify-center mb-3">{cat.svg}</div>
              <div className="font-medium text-gray-900 text-sm">{cat.nombre}</div>
            </Link>
          ))}
        </div>

        {/* Anuncios recientes */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Anuncios recientes</h2>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : anuncios.length === 0 ? (
          <p className="text-gray-500">No hay anuncios todavía.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {anuncios.map((anuncio) => (
              <Link
                key={anuncio.id}
                to={`/anuncios/${anuncio.id}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {anuncio.fotos?.[0] ? (
                    <img src={anuncio.fotos[0]} alt={anuncio.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">Sin foto</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-orange-500 font-medium">{anuncio.categorias?.nombre}</p>
                    {anuncio.vendido ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">Vendido</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">Disponible</span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 truncate">{anuncio.titulo}</h3>
                  <p className="text-sm text-gray-500 mb-2">{anuncio.departamento}</p>
                  <p className="font-bold text-gray-900">
                    {anuncio.precio ? formatPrecio(anuncio.precio, anuncio.moneda) : 'Consultar'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/anuncios" className="text-orange-500 font-medium hover:underline">
            Ver todos los anuncios →
          </Link>
        </div>
      </div>
    </div>
  )
}