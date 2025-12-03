export type EventStatus = 'draft' | 'scheduled' | 'published' | 'canceled'

export type EventCategory = 'musica' | 'gastronomia' | 'cultura' | 'natureza' | 'infantil' | 'hospedagens'

export type TicketType = 'single' | 'multiple'

export interface TicketPrice {
  type: 'inteira' | 'meia' | 'infantil' | 'single'
  price: number
  description?: string
}

export interface Event {
  id: string
  slug: string
  title: string
  description: string
  category: EventCategory
  startDateTime: string
  endDateTime: string
  locationName: string
  address: string
  latitude?: number
  longitude?: number
  imageUrl: string
  isFeatured: boolean
  ticketUrl?: string
  hasOnlineTickets?: boolean
  ticketType?: TicketType
  ticketPrices?: TicketPrice[]
  createdAt: string
  updatedAt: string
  status: EventStatus
}

export interface EventFilters {
  searchText: string
  category: EventCategory | 'all'
  dateRange: 'today' | 'weekend' | 'upcoming' | 'all'
}
