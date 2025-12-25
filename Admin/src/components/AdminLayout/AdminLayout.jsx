import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import './adminLayout.css'

export default function AdminLayout() {
  return (
    <div className="nt-adminShell nt-adminLayout">
      <Sidebar />
      <div className="nt-adminMain">
        <Topbar />
        <main className="nt-adminContent">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
