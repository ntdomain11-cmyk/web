import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout/AdminLayout'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import SiteConfig from './pages/SiteConfig'
import HomeContent from './pages/HomeContent'
import FaqContent from './pages/FaqContent'
import TestimonialsContent from './pages/TestimonialsContent'
import BlogsContent from './pages/BlogsContent'
import AboutContent from './pages/AboutContent'
import Services from './pages/Services'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="services" element={<Services />} />
        <Route path="site-config" element={<SiteConfig />} />
        <Route path="content/home" element={<HomeContent />} />
        <Route path="content/about" element={<AboutContent />} />
        <Route path="content/faq" element={<FaqContent />} />
        <Route path="content/testimonials" element={<TestimonialsContent />} />
        <Route path="content/blogs" element={<BlogsContent />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
