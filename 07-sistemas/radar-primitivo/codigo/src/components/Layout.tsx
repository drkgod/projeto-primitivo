/* Layout Component - wraps the main content of the app with navigation */
import { Link, NavLink, Outlet } from 'react-router-dom'

const item = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
  }`

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            Radar Primitivo
          </Link>
          <nav aria-label="Navegação principal" className="flex items-center gap-1">
            <NavLink to="/perfis" className={item} end>
              Perfis de busca
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
