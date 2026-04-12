import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ArtPortfolio } from './components/ArtPortfolio'
import { Projects } from './components/Projects'
import { Resume } from './components/Resume'
import { Contact } from './components/Contact'
import { ScrollToTop } from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <ArtPortfolio />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <ScrollToTop />
    </div>
  )
}

export default App
