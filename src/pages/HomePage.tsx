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
import { MagnifyingGlass, CalendarBlank, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function HomePage() {
  const {
    isLoading,
    error,
    loadEvents,
    getTodayEvents,
    getWeekendEvents,
    getUpcomingEvents,
    filters,
    setFilters,
    getFilteredEvents
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
        gradient
      >
        <div className="space-y-4 mt-8">
          <div className="relative max-w-2xl">
            <MagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60"
              weight="bold"
            />
            <Input
              type="search"
              placeholder="Buscar por evento, local ou palavra-chave..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-12 h-12 text-base bg-card border-border shadow-sm placeholder:text-muted-foreground placeholder:font-medium"
            />
          </div>

          <FilterChips selected={filters.category} onSelect={handleCategorySelect} />
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8 sm:py-10 md:py-12 space-y-12 sm:space-y-14 md:space-y-16">
        {isLoading ? (
          <EventCardSkeletonGrid count={8} />
        ) : (
          <>
            {filters.searchText || filters.category !== 'all' ? (
              <section>
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <MagnifyingGlass size={24} className="sm:w-7 sm:h-7 text-accent" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    Resultados da busca
                    {filters.category !== 'all' && ` em ${filters.category}`}
                  </h2>
                </div>

                {filteredEvents.length === 0 ? (
                  <EmptyState
                    title="Nenhum evento encontrado"
                    description="Tente ajustar os filtros ou buscar por outros termos."
                  />
                ) : (
                  <EventCarousel>
                    {filteredEvents.map((event) => (
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
