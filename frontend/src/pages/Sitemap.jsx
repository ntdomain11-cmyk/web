import { Link } from 'react-router-dom'

export default function Sitemap() {
  return (
    <div className="nt-container" style={{ padding: '34px 18px 56px' }}>
      <h1 className="nt-pageTitle">Sitemap</h1>
      <ul className="nt-list">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/testimonials">Testimonials</Link>
        </li>
        <li>
          <Link to="/faq">FAQs</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/book">Book</Link>
        </li>
      </ul>
    </div>
  )
}
