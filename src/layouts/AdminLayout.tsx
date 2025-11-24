import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, SignOut, Calendar, Gear } from '@phosphor-icons/react'
import { useAuthStore } from '@/domain/auth/useAuthStore'
import { cn } from '@/lib/utils'

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navLinks = [
    { label: 'Eventos', href: '/admin/eventos', icon: Calendar },
    { label: 'Configurações', href: '/admin/configuracoes', icon: Gear },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-8 h-16">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Voltar ao site</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-bold">Painel Administrativo</h1>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <SignOut size={18} />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-64 border-r border-border bg-card min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname.startsWith(link.href)
              
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon size={20} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around p-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname.startsWith(link.href)
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium transition-colors min-w-[80px]',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
