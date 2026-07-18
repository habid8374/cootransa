import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import AboutPage from './pages/AboutPage'
import LegalPage from './pages/LegalPage'
import PolicyPage from './pages/PolicyPage'
import NoticiaPage from './pages/NoticiaPage'
import TarifasPage from './pages/TarifasPage'
import HorariosPage from './pages/HorariosPage'
import TarifaPreferencialPage from './pages/TarifaPreferencialPage'
import CarnetPage from './pages/CarnetPage'
import VerificarPage from './pages/VerificarPage'
import AdminApp from './pages/admin/AdminApp'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/nosotros/:slug" element={<AboutPage />} />
        <Route path="/legal/:slug" element={<LegalPage />} />
        <Route path="/politicas/:slug" element={<PolicyPage />} />
        <Route path="/noticias/:slug" element={<NoticiaPage />} />
        <Route path="/tarifas" element={<TarifasPage />} />
        <Route path="/horarios" element={<HorariosPage />} />
        <Route path="/tarifa-preferencial" element={<TarifaPreferencialPage />} />
        <Route path="/carnet/:codigo" element={<CarnetPage />} />
        <Route path="/verificar" element={<VerificarPage />} />
        <Route path="/verificar/:codigo" element={<VerificarPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
