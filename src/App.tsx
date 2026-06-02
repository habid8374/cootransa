import { useLenis } from './hooks/useLenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import MapSection from './components/MapSection'
import Fleet from './components/Fleet'
import Impact from './components/Impact'
import Policies from './components/Policies'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  useLenis()

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section id="inicio"><Hero /></section>
        <section id="stats"><Stats /></section>
        <section id="servicios"><Services /></section>
        <section id="rutas"><MapSection /></section>
        <section id="nosotros"><Fleet /><Impact /></section>
        <section id="politicas"><Policies /></section>
        <section id="contacto"><Contact /></section>
      </main>
      <Footer />
    </div>
  )
}

export default App
