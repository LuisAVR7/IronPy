export default function Privacidad() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
      <p className="text-sm text-gray-500 mb-8">Última actualización: mayo de 2026</p>

      <div className="flex flex-col gap-6">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Responsable del tratamiento</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            IronPY es responsable del tratamiento de los datos personales recopilados a través de la plataforma, en cumplimiento de la <strong>Ley N° 7.593/2025 de Protección de Datos Personales</strong> de la República del Paraguay y la <strong>Ley N° 4.868/2013 de Comercio Electrónico</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Datos que recopilamos</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            IronPY recopila los siguientes datos personales: nombre completo, dirección de correo electrónico y número de teléfono al momento del registro; información de los anuncios publicados incluyendo fotos, descripción y datos de contacto; y documentos de identidad cargados voluntariamente por usuarios interesados en un anuncio.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Finalidad del tratamiento</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Los datos recopilados se utilizan exclusivamente para: gestionar el registro y la cuenta del usuario, permitir la publicación y visualización de anuncios, facilitar el contacto entre compradores y vendedores, y verificar la identidad de los usuarios que expresan interés formal en un anuncio. IronPY no utiliza los datos para fines publicitarios de terceros ni los cede a empresas externas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Documentos de identidad</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Las cédulas de identidad y demás documentos cargados por los usuarios son almacenados en servidores seguros y solo pueden ser visualizados por el vendedor del anuncio correspondiente. Estos documentos no son compartidos con terceros, no son utilizados para fines distintos a la verificación de identidad y pueden ser eliminados a solicitud del usuario.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Base legal del tratamiento</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            El tratamiento de datos personales se basa en el consentimiento libre, previo, expreso e informado del usuario al momento del registro, conforme a lo establecido por la Ley N° 7.593/2025. El usuario puede retirar su consentimiento en cualquier momento, lo que implicará la eliminación de su cuenta y datos asociados.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Derechos del usuario</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            En cumplimiento de la Ley N° 7.593/2025, el usuario tiene derecho a acceder a sus datos personales, rectificarlos si son inexactos, solicitar su eliminación, oponerse al tratamiento y solicitar la portabilidad de sus datos. Para ejercer estos derechos, el usuario puede contactarnos a través de los canales disponibles en la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Seguridad de los datos</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            IronPY implementa medidas técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida o destrucción. Los datos son almacenados en Supabase, plataforma que cumple con estándares internacionales de seguridad. Sin embargo, ningún sistema es completamente infalible y el usuario acepta este riesgo inherente al uso de plataformas digitales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Cookies</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            IronPY utiliza cookies técnicas necesarias para el funcionamiento de la plataforma, como la gestión de sesiones de usuario. No se utilizan cookies de seguimiento ni publicitarias de terceros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Modificaciones</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            IronPY se reserva el derecho de actualizar esta Política de Privacidad para adaptarla a cambios normativos o del servicio. Las modificaciones serán publicadas en esta página con indicación de la fecha de actualización.
          </p>
        </section>

      </div>
    </div>
  )
}