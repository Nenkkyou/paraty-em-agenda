import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEventsStore } from '@/domain/events/useEventsStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/EmptyState'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Ticket, 
  Clock,
  Warning,
  MapTrifold
} from '@phosphor-icons/react'
import { formatEventDateRange, isEventStartingSoon } from '@/lib/dates'
import { getCategoryLabel, getCategoryColor } from '@/lib/categories'
import { cn } from '@/lib/utils'

export function EventDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const { getEventBySlug, loadEvents, isLoading } = useEventsStore()

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const event = slug ? getEventBySlug(slug) : undefined

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Carregando evento...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          title="Evento não encontrado"
          description="O evento que você está procurando não existe ou foi removido."
          icon={<Warning size={64} className="text-muted-foreground" />}
          action={
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft size={18} />
                Voltar para a página inicial
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const isCanceled = event.status === 'canceled'
  const isStartingSoon = isEventStartingSoon(event.startDateTime)
  const mapsUrl = event.latitude && event.longitude 
    ? `https://www.google.com/maps?q=${event.latitude},${event.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-6">
            <ArrowLeft size={18} />
            Voltar
          </Button>
        </Link>

        {isCanceled && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <Warning size={24} className="text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Evento Cancelado</h3>
              <p className="text-sm text-muted-foreground">
                Este evento foi cancelado. Verifique a descrição para mais informações.
              </p>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg overflow-hidden border border-border shadow-lg">
          <div className="relative aspect-[21/9] overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {event.isFeatured && !isCanceled && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground border-0 shadow-lg">
                Destaque
              </Badge>
            )}
            {isStartingSoon && !isCanceled && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground border-0 shadow-lg animate-pulse">
                Começando em breve
              </Badge>
            )}
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className={cn('text-sm', getCategoryColor(event.category))}>
                  {getCategoryLabel(event.category)}
                </Badge>
                {isCanceled && (
                  <Badge variant="destructive" className="text-sm">
                    Cancelado
                  </Badge>
                )}
                {event.status === 'scheduled' && (
                  <Badge variant="secondary" className="text-sm">
                    Agendado
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {event.title}
              </h1>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Calendar size={24} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Data e horário</div>
                  <div className="font-medium">{formatEventDateRange(event.startDateTime, event.endDateTime)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin size={24} className="text-accent flex-shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Local</div>
                  <div className="font-medium">{event.locationName}</div>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline mt-1 inline-block truncate w-full"
                  >
                    {event.address}
                  </a>
                </div>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold mb-3">Sobre o evento</h2>
              <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {event.description}
              </div>
            </div>

            {(event.latitude && event.longitude) && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Localização</h2>
                <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <MapTrifold size={48} className="text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Mapa interativo</p>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="gap-2">
                          <MapPin size={16} />
                          Abrir no Google Maps
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {event.ticketUrl && !isCanceled && (
              <div className="pt-6 border-t border-border">
                <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full gap-3 text-base h-14">
                    <Ticket size={24} />
                    Ver ingressos
                  </Button>
                </a>
              </div>
            )}
            
            {!event.ticketUrl && !isCanceled && (
              <div className="pt-6 border-t border-border">
                <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
                  <Ticket size={24} className="text-accent" />
                  <span className="font-medium text-accent">Entrada gratuita</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
