import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Blog from './pages/Blog'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Book from './pages/Book'
import Terms from './pages/Terms'
import TermsCondition from './pages/TermsCondition'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Sitemap from './pages/Sitemap'
import Programs from './pages/Programs'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<ServiceDetail />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/book" element={<Book />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/terms-condition" element={<TermsCondition />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
