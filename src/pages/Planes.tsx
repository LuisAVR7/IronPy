export default function Planes() {
  const planes = [
    {
      nombre: 'Gratuito',
      precio: '₲ 0',
      periodo: 'siempre gratis',
      descripcion: 'Para vendedores que quieren empezar sin costo.',
      color: 'border-gray-200',
      badge: null,
      features: [
        { texto: 'Anuncios ilimitados', incluido: true },
        { texto: '5 fotos por anuncio', incluido: true },
        { texto: 'Visible en el listado general', incluido: true },
        { texto: 'Sello de vendedor verificado', incluido: true },
        { texto: 'Anuncios destacados', incluido: false },
        { texto: 'Estadísticas de visitas', incluido: false },
        { texto: 'Indexado en Google', incluido: false },
        { texto: 'Acceso al directorio de constructoras', incluido: false },
      ],
      boton: 'Publicar gratis',
      href: '/registro',
      estilo: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
    },
    {
      nombre: 'Profesional',
      precio: '₲ 150.000',
      periodo: 'por mes',
      descripcion: 'Para vendedores activos que quieren más visibilidad.',
      color: 'border-orange-500',
      badge: 'Más elegido',
      features: [
        { texto: 'Anuncios ilimitados', incluido: true },
        { texto: '10 fotos por anuncio', incluido: true },
        { texto: 'Anuncios destacados en el listado', incluido: true },
        { texto: 'Sello de vendedor verificado', incluido: true },
        { texto: 'Estadísticas básicas de visitas', incluido: true },
        { texto: 'Indexado en Google', incluido: true },
        { texto: 'Soporte prioritario', incluido: true },
        { texto: 'Acceso al directorio de constructoras', incluido: false },
      ],
      boton: 'Consultar por WhatsApp',
      href: null,
      estilo: 'bg-orange-500 text-white hover:bg-orange-600',
    },
    {
      nombre: 'Premium',
      precio: '₲ 350.000',
      periodo: 'por mes',
      descripcion: 'Para importadores y empresas que quieren máxima exposición.',
      color: 'border-gray-200',
      badge: null,
      features: [
        { texto: 'Anuncios ilimitados', incluido: true },
        { texto: 'Fotos ilimitadas por anuncio', incluido: true },
        { texto: 'Primeros resultados siempre', incluido: true },
        { texto: 'Sello de vendedor verificado', incluido: true },
        { texto: 'Estadísticas completas de visitas', incluido: true },
        { texto: 'Indexado en Google', incluido: true },
        { texto: 'Soporte prioritario', incluido: true },
        { texto: 'Acceso al directorio de constructoras', incluido: true },
      ],
      boton: 'Consultar por WhatsApp',
      href: null,
      estilo: 'bg-gray-900 text-white hover:bg-gray-800',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Planes de publicación</h1>
        <p className="text-gray-500">Elegí el plan que mejor se adapta a tu necesidad. Todos incluyen anuncios ilimitados.</p>
      </div>

      {/* Gancho vendedor verificado */}
      <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 mb-8 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">✓ Vendedor verificado</span>
            <span className="text-xs text-green-700 font-medium">Disponible en todos los planes</span>
          </div>
          <p className="text-sm text-green-700">Verificá tu identidad con tu cédula y obtené el sello ✓ que le indica a los compradores que sos un vendedor real y confiable. Gratis desde tu perfil.</p>
        </div>
        <a href="/perfil" className="flex-shrink-0 bg-green-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-600 whitespace-nowrap">
          Verificar perfil
        </a>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12">
        {planes.map((plan) => (
          <div key={plan.nombre} className={`bg-white border-2 ${plan.color} rounded-xl p-6 flex flex-col relative`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              </div>
            )}
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">{plan.nombre}</h2>
              <p className="text-3xl font-bold text-gray-900 mb-1">{plan.precio}</p>
              <p className="text-xs text-gray-500 mb-3">{plan.periodo}</p>
              <p className="text-sm text-gray-500">{plan.descripcion}</p>
            </div>

            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  {f.incluido ? (
                    <span className="text-green-500 flex-shrink-0">✓</span>
                  ) : (
                    <span className="text-gray-300 flex-shrink-0">✗</span>
                  )}
                  <span className={f.incluido ? 'text-gray-700' : 'text-gray-400'}>{f.texto}</span>
                </li>
              ))}
            </ul>

            {plan.href ? (
              <a href={plan.href}
                className={`w-full py-2.5 rounded-lg text-sm font-medium text-center block ${plan.estilo}`}>
                {plan.boton}
              </a>
            ) : (
              <button
                onClick={() => window.open(`https://wa.me/595XXXXXXXXX?text=${encodeURIComponent(`Hola, estoy interesado en el plan ${plan.nombre} de MaqMarket.`)}`, '_blank')}
                className={`w-full py-2.5 rounded-lg text-sm font-medium ${plan.estilo}`}>
                {plan.boton}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Diferenciador Google */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔍</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Aparecé en Google con los planes Profesional y Premium</h3>
            <p className="text-sm text-gray-600">Los anuncios de planes gratuitos no son indexados por Google. Con un plan pago, tu excavadora, tractor o camión puede aparecer cuando alguien busca "excavadora usada Paraguay" o "tractor agrícola en venta". Es la diferencia entre esperar que te encuentren y ser encontrado.</p>
          </div>
        </div>
      </div>

      {/* Directorio */}
      <div className="bg-gray-900 text-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Directorio de constructoras y contratistas</h2>
        <p className="text-gray-400 text-sm mb-4 max-w-xl mx-auto">
          Accedé a más de 2.000 contactos del sector construcción en Paraguay: constructoras, contratistas, empresas de materiales y metalúrgicas. Disponible exclusivamente para el plan Premium.
        </p>
        <button
          onClick={() => window.open(`https://wa.me/595XXXXXXXXX?text=${encodeURIComponent('Hola, quiero más información sobre el directorio de constructoras de MaqMarket.')}`, '_blank')}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600">
          Consultar acceso al directorio
        </button>
      </div>
    </div>
  )
}