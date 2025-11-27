import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { UserCircle, List, X, Moon, Sun, Ticket } from '@phosphor-icons/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'
import { useEventsStore } from '@/domain/events/useEventsStore'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { showOnlyWithTickets, setShowOnlyWithTickets, resetFilters } = useEventsStore()

  const navLinks = [
    { label: 'Hoje', href: '/', hash: '#hoje' },
    { label: 'Fim de semana', href: '/', hash: '#fim-de-semana' },
    { label: 'Próximos', href: '/', hash: '#proximos' },
  ]

  const isActive = (href: string) => location.pathname === href

  const handleTicketsClick = () => {
    if (showOnlyWithTickets) {
      resetFilters()
    } else {
      setShowOnlyWithTickets(true)
    }
    
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

            <nav className="hidden md:flex items-center gap-4">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
                aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </Button>
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <UserCircle size={18} />
                  Sou organizador
                </Button>
              </Link>
              <Button
                variant={showOnlyWithTickets ? "default" : "outline"}
                size="sm"
                onClick={handleTicketsClick}
                className="gap-2"
              >
                <Ticket size={18} />
                Comprar Ingressos
              </Button>
            </nav>

            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
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
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="w-full gap-2 justify-start"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                {theme === 'light' ? 'Tema escuro' : 'Tema claro'}
              </Button>
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <UserCircle size={18} />
                  Sou organizador
                </Button>
              </Link>
              <Button
                variant={showOnlyWithTickets ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  handleTicketsClick()
                  setMobileMenuOpen(false)
                }}
                className="w-full gap-2 justify-start"
              >
                <Ticket size={18} />
                Comprar Ingressos
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-card border-t border-border mt-12 sm:mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Paraty em Agenda</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Todos os eventos de Paraty em um só lugar. Conectando moradores, turistas e organizadores.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Links rápidos</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
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
              <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Sobre</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Portal de eventos de Paraty - RJ
              </p>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Paraty em Agenda. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
