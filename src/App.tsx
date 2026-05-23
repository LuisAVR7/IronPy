import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Anuncios from './pages/Anuncios'
import DetalleAnuncio from './pages/DetalleAnuncio'
import PublicarAnuncio from './pages/PublicarAnuncio'
import EditarAnuncio from './pages/EditarAnuncio'
import Login from './pages/Login'
import Registro from './pages/Registro'
import MisAnuncios from './pages/MisAnuncios'
import Perfil from './pages/Perfil'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'
import Planes from './pages/Planes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anuncios" element={<Anuncios />} />
            <Route path="/anuncios/:id" element={<DetalleAnuncio />} />
            <Route path="/publicar" element={<PublicarAnuncio />} />
            <Route path="/anuncios/:id/editar" element={<EditarAnuncio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/mis-anuncios" element={<MisAnuncios />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/planes" element={<Planes />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App