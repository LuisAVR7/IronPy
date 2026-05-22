import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-3 gap-8">
        <div>
          <span className="text-xl font-bold text-white">Iron<span className="text-orange-500">PY</span></span>
          <p className="text-sm mt-2 leading-relaxed">
            El clasificado local especializado en maquinaria de construcción, agrícola y camiones en Paraguay.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Categorías</h3>
          <ul className="flex flex-col gap-2">
            <li><Link to="/anuncios?categoria=construccion" className="text-sm hover:text-orange-500">Construcción</Link></li>
            <li><Link to="/anuncios?categoria=agricola" className="text-sm hover:text-orange-500">Agrícola</Link></li>
            <li><Link to="/anuncios?categoria=camiones" className="text-sm hover:text-orange-500">Camiones</Link></li>
            <li><Link to="/anuncios?categoria=implementos" className="text-sm hover:text-orange-500">Implementos</Link></li>
            <li><Link to="/anuncios?categoria=repuestos" className="text-sm hover:text-orange-500">Repuestos</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Legal</h3>
          <ul className="flex flex-col gap-2">
            <li><Link to="/planes" className="text-sm hover:text-orange-500">Planes y precios</Link></li>
            <li><Link to="/terminos" className="text-sm hover:text-orange-500">Términos y condiciones</Link></li>
            <li><Link to="/privacidad" className="text-sm hover:text-orange-500">Política de privacidad</Link></li>
          </ul>
          <h3 className="text-sm font-medium text-white mb-3 mt-5">Contacto</h3>
          <p className="text-sm">contacto@ironpy.com.py</p>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} IronPY — Todos los derechos reservados — República del Paraguay
      </div>
    </footer>
  )
}