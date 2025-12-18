import './App.css'
import Header from './components/Header'
import AppRoutes from './AppRoutes'
import Footer from './components/Footer'
import ElasticCursor from './components/ElasticCursor'
import ScrollToTop from './components/ScrollToTop'
import { SiteConfigProvider } from './context/SiteConfigContext'
import { useLocation } from 'react-router-dom'

function PageTransition({ children }) {
  const location = useLocation()
  return (
    <div key={location.pathname} className="nt-pageTransition">
      {children}
    </div>
  )
}

function App() {
  return (
    <SiteConfigProvider>
      <div className="nt-app">
        <ElasticCursor />
        <ScrollToTop />
        <Header />
        <main className="nt-page">
          <PageTransition>
            <AppRoutes />
          </PageTransition>
        </main>
        <Footer />
      </div>
    </SiteConfigProvider>
  )
}

export default App
