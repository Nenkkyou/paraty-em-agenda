import { useEffect, useState } from 'react'
import { useEventsStore } from '@/domain/events/useEventsStore'
import { EventCategory } from '@/domain/events/types'
import { PageHeader } from '@/components/PageHeader'
import { FilterChips } from '@/components/FilterChips'
import { EventCard } from '@/components/EventCard'
import { EventCardSkeletonGrid } from '@/components/EventCardSkeleton'
import { EmptyState } from '@/components/EmptyState'
import { EventCarousel } from '@/components/EventCarousel'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass, CalendarBlank, Warning, Ticket } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function HomePage() {
  const {
    isLoading,
    error,
    loadEvents,
    getTodayEvents,
    getWeekendEvents,
    getUpcomingEvents,
    getEventsWithTickets,
    filters,
    setFilters,
    getFilteredEvents,
    showOnlyWithTickets
  } = useEventsStore()

  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ searchText: searchInput })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, setFilters])

  const todayEvents = getTodayEvents()
  const weekendEvents = getWeekendEvents()
  const upcomingEvents = getUpcomingEvents()
  const filteredEvents = getFilteredEvents()
  const eventsWithTickets = getEventsWithTickets()

  const handleCategorySelect = (category: EventCategory | 'all') => {
    setFilters({ category })
  }

  const handleRetry = () => {
    loadEvents()
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          title="Não foi possível carregar os eventos"
          description={error}
          icon={<Warning size={64} className="text-destructive" />}
          action={
            <Button onClick={handleRetry} variant="outline">
              Tentar novamente
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Descubra Paraty"
        description="Todos os eventos da cidade em um só lugar. Música, gastronomia, cultura e natureza."
      >
        <div className="flex flex-col items-center space-y-6 mt-8">
          {/* Campo de busca centralizado */}
          <div className="relative w-full max-w-2xl">
            <MagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70"
              weight="bold"
            />
            <Input
              type="search"
              placeholder="Buscar por evento, local ou palavra-chave..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-12 h-14 text-base bg-card/95 backdrop-blur-sm border-white/20 shadow-lg placeholder:text-white/70 placeholder:font-medium rounded-xl focus:ring-2 focus:ring-white/30 text-white"
            />
          </div>

          {/* Chips de filtro centralizados */}
          <div className="w-full flex justify-center">
            <FilterChips selected={filters.category} onSelect={handleCategorySelect} className="justify-center" />
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8 sm:py-10 md:py-12 space-y-12 sm:space-y-14 md:space-y-16">
        {isLoading ? (
          <EventCardSkeletonGrid count={8} />
        ) : (
          <>
            {filters.searchText || filters.category !== 'all' || showOnlyWithTickets ? (
              <section>
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {showOnlyWithTickets ? (
                    <>
                      <Ticket size={24} className="sm:w-7 sm:h-7 text-accent" />
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                        Eventos com Ingressos Disponíveis
                      </h2>
                    </>
                  ) : (
                    <>
                      <MagnifyingGlass size={24} className="sm:w-7 sm:h-7 text-accent" />
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                        Resultados da busca
                        {filters.category !== 'all' && ` em ${filters.category}`}
                      </h2>
                    </>
                  )}
                </div>

                {(showOnlyWithTickets ? eventsWithTickets : filteredEvents).length === 0 ? (
                  <EmptyState
                    title={showOnlyWithTickets ? "Nenhum evento com ingressos disponíveis" : "Nenhum evento encontrado"}
                    description={showOnlyWithTickets ? "Não há eventos com ingressos disponíveis no momento." : "Tente ajustar os filtros ou buscar por outros termos."}
                  />
                ) : (
                  <EventCarousel>
                    {(showOnlyWithTickets ? eventsWithTickets : filteredEvents).map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </EventCarousel>
                )}
              </section>
            ) : (
              <>
                <section id="hoje">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <CalendarBlank size={24} className="sm:w-7 sm:h-7 text-accent" weight="fill" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Hoje em Paraty</h2>
                  </div>

                  {todayEvents.length === 0 ? (
                    <EmptyState
                      title="Nenhum evento acontecendo hoje"
                      description="Confira os eventos do fim de semana e próximas semanas abaixo."
                    />
                  ) : (
                    <EventCarousel>
                      {todayEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </EventCarousel>
                  )}
                </section>

                <section id="fim-de-semana">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <CalendarBlank size={24} className="sm:w-7 sm:h-7 text-accent" weight="duotone" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Neste fim de semana</h2>
                  </div>

                  {weekendEvents.length === 0 ? (
                    <EmptyState
                      title="Nenhum evento neste fim de semana"
                      description="Confira os próximos eventos abaixo."
                    />
                  ) : (
                    <EventCarousel>
                      {weekendEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </EventCarousel>
                  )}
                </section>

                <section id="proximos">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <CalendarBlank size={24} className="sm:w-7 sm:h-7 text-accent" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Próximas semanas</h2>
                  </div>

                  {upcomingEvents.length === 0 ? (
                    <EmptyState
                      title="Nenhum evento programado"
                      description="Novos eventos serão adicionados em breve."
                    />
                  ) : (
                    <EventCarousel>
                      {upcomingEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </EventCarousel>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
