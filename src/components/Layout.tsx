import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="layout">
      <nav className="app-nav">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            JobTracker
          </Link>
          <div className="nav-links">
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className={location.pathname === '/history' ? 'active' : ''}
            >
              History
            </Link>
          </div>
        </div>
      </nav>
      <main className="app-main">{children}</main>
    </div>
  )
}
