import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { UserCircle, List, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { label: 'Hoje', href: '/', hash: '#hoje' },
    { label: 'Fim de semana', href: '/', hash: '#fim-de-semana' },
    { label: 'Próximos', href: '/', hash: '#proximos' },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
                <span className="text-xl font-bold text-foreground">Paraty em Agenda</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.hash}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-accent',
                    isActive(link.href) ? 'text-accent' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </a>
              ))}
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <UserCircle size={18} />
                  Sou organizador
                </Button>
              </Link>
            </nav>

            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="flex flex-col p-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.hash}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive(link.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </a>
              ))}
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <UserCircle size={18} />
                  Sou organizador
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-card border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Paraty em Agenda</h3>
              <p className="text-sm text-muted-foreground">
                Todos os eventos de Paraty em um só lugar. Conectando moradores, turistas e organizadores.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#hoje" className="text-muted-foreground hover:text-accent transition-colors">
                    Eventos hoje
                  </a>
                </li>
                <li>
                  <a href="#fim-de-semana" className="text-muted-foreground hover:text-accent transition-colors">
                    Fim de semana
                  </a>
                </li>
                <li>
                  <Link to="/admin/login" className="text-muted-foreground hover:text-accent transition-colors">
                    Área do organizador
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sobre</h4>
              <p className="text-sm text-muted-foreground">
                Portal de eventos de Paraty - RJ
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Paraty em Agenda. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
