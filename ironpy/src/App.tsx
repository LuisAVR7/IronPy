import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Anuncios from './pages/Anuncios'
import DetalleAnuncio from './pages/DetalleAnuncio'
import PublicarAnuncio from './pages/PublicarAnuncio'
import Login from './pages/Login'
import Registro from './pages/Registro'
import MisAnuncios from './pages/MisAnuncios'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anuncios" element={<Anuncios />} />
          <Route path="/anuncios/:id" element={<DetalleAnuncio />} />
          <Route path="/publicar" element={<PublicarAnuncio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-anuncios" element={<MisAnuncios />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App