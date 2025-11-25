import { Event } from '@/domain/events/types'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Ticket } from '@phosphor-icons/react'
import { formatEventTime, formatEventDate, isEventStartingSoon } from '@/lib/dates'
import { getCategoryLabel, getCategoryColor } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface EventCardProps {
  event: Event
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  const isStartingSoon = isEventStartingSoon(event.startDateTime)

  return (
    <Link
      to={`/evento/${event.slug}`}
      className={cn(
        'group block bg-card rounded-lg overflow-hidden border border-border transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background',
        'h-full flex flex-col',
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {event.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground border-0 shadow-md text-xs">
            Destaque
          </Badge>
        )}
        
        {isStartingSoon && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground border-0 shadow-md animate-pulse text-xs">
            Em breve
          </Badge>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 flex-1">
          <h3 className="font-semibold text-base sm:text-lg leading-tight text-card-foreground group-hover:text-accent transition-colors line-clamp-2">
            {event.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn('text-xs', getCategoryColor(event.category))}>
            {getCategoryLabel(event.category)}
          </Badge>
        </div>

        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="flex-shrink-0 sm:hidden" />
            <Calendar size={16} className="flex-shrink-0 hidden sm:block" />
            <span className="line-clamp-1">{formatEventDate(event.startDateTime)} às {formatEventTime(event.startDateTime)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin size={14} className="flex-shrink-0 sm:hidden" />
            <MapPin size={16} className="flex-shrink-0 hidden sm:block" />
            <span className="line-clamp-1">{event.locationName}</span>
          </div>
          
          {event.ticketUrl && (
            <div className="flex items-center gap-2 text-accent">
              <Ticket size={14} className="flex-shrink-0 sm:hidden" />
              <Ticket size={16} className="flex-shrink-0 hidden sm:block" />
              <span className="font-medium">Ingressos disponíveis</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
