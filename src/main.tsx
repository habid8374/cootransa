import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import AboutPage from './pages/AboutPage'
import LegalPage from './pages/LegalPage'
import PolicyPage from './pages/PolicyPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/nosotros/:slug" element={<AboutPage />} />
        <Route path="/legal/:slug" element={<LegalPage />} />
        <Route path="/politicas/:slug" element={<PolicyPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
