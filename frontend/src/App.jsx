import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './App.css'
import 'aos/dist/aos.css'
import Header from './components/Header'
import AppRoutes from './AppRoutes'
import Footer from './components/Footer'
import ElasticCursor from './components/ElasticCursor'
import ScrollToTop from './components/ScrollToTop'
import Preloader from './components/Preloader'
import WhatsAppButton from './components/WhatsAppButton'
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext'
import { getApiPendingCount, subscribeApiPending } from './lib/api'
import { initAosOnce, refreshAos } from './lib/aos'

function AppFrame() {
  const { loading: siteLoading } = useSiteConfig()
  const location = useLocation()
  const [apiPending, setApiPending] = useState(0)
  const [minDelayDone, setMinDelayDone] = useState(false)
  const [routeArmed, setRouteArmed] = useState(false)
  const navSeq = useRef(0)
  const aosInited = useRef(false)

  useEffect(() => {
    return subscribeApiPending(setApiPending)
  }, [])

  useEffect(() => {
    if (aosInited.current) return
    initAosOnce()
    aosInited.current = true
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => setMinDelayDone(true), 900)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    navSeq.current += 1
    const mySeq = navSeq.current

    setRouteArmed(true)

    const t = window.setTimeout(() => {
      if (navSeq.current !== mySeq) return
      if (getApiPendingCount() === 0) setRouteArmed(false)
    }, 350)

    return () => window.clearTimeout(t)
  }, [location.pathname])

  useEffect(() => {
    const t = window.setTimeout(() => {
      refreshAos()
    }, 0)
    return () => window.clearTimeout(t)
  }, [location.pathname])

  useEffect(() => {
    if (apiPending !== 0) return
    const t = window.setTimeout(() => {
      refreshAos()
    }, 0)
    return () => window.clearTimeout(t)
  }, [apiPending])

  useEffect(() => {
    if (!routeArmed) return
    if (apiPending === 0) setRouteArmed(false)
  }, [apiPending, routeArmed])

  const routeLoading = routeArmed && apiPending > 0
  const preloaderHidden = !siteLoading && !routeLoading && apiPending === 0 && minDelayDone

  return (
    <>
      <Preloader hidden={preloaderHidden} />
      <div className="nt-app">
        <ElasticCursor />
        <ScrollToTop />
        <Header />
        <main className="nt-page">
          <AppRoutes />
        </main>
        <WhatsAppButton />
        <Footer />
      </div>
    </>
  )
}

function App() {
  return (
    <SiteConfigProvider>
      <AppFrame />
    </SiteConfigProvider>
  )
}

export default App
