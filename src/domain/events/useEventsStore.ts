import { create } from 'zustand'
import { Event, EventFilters, EventCategory } from './types'
import { mockEvents } from './mocks'

interface EventsState {
  events: Event[]
  filters: EventFilters
  isLoading: boolean
  error: string | null
  showOnlyWithTickets: boolean
  
  setFilters: (filters: Partial<EventFilters>) => void
  resetFilters: () => void
  getFilteredEvents: () => Event[]
  getTodayEvents: () => Event[]
  getWeekendEvents: () => Event[]
  getUpcomingEvents: () => Event[]
  getEventsWithTickets: () => Event[]
  setShowOnlyWithTickets: (show: boolean) => void
  getEventBySlug: (slug: string) => Event | undefined
  addEvent: (event: Event) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void
  loadEvents: () => Promise<void>
}

const defaultFilters: EventFilters = {
  searchText: '',
  category: 'all',
  dateRange: 'all'
}

const isToday = (date: Date): boolean => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const isThisWeekend = (date: Date): boolean => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 0
  const daysUntilSunday = dayOfWeek <= 0 ? 0 : 7 - dayOfWeek
  
  const nextFriday = new Date(today)
  nextFriday.setDate(today.getDate() + daysUntilFriday)
  nextFriday.setHours(0, 0, 0, 0)
  
  const nextSunday = new Date(today)
  nextSunday.setDate(today.getDate() + daysUntilSunday)
  nextSunday.setHours(23, 59, 59, 999)
  
  return date >= nextFriday && date <= nextSunday
}

const isUpcoming = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date > today
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,
  showOnlyWithTickets: false,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }))
  },

  resetFilters: () => {
    set({ filters: defaultFilters, showOnlyWithTickets: false })
  },

  setShowOnlyWithTickets: (show) => {
    set({ showOnlyWithTickets: show })
  },

  getFilteredEvents: () => {
    const { events, filters, showOnlyWithTickets } = get()
    let filtered = events.filter(event => event.status === 'published')

    if (showOnlyWithTickets) {
      filtered = filtered.filter(event => event.ticketUrl || event.hasOnlineTickets)
    }

    if (filters.searchText) {
      const search = filters.searchText.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(search) ||
          event.description.toLowerCase().includes(search) ||
          event.locationName.toLowerCase().includes(search) ||
          event.address.toLowerCase().includes(search)
      )
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter((event) => event.category === filters.category)
    }

    if (filters.dateRange === 'today') {
      filtered = filtered.filter((event) => isToday(new Date(event.startDateTime)))
    } else if (filters.dateRange === 'weekend') {
      filtered = filtered.filter((event) => isThisWeekend(new Date(event.startDateTime)))
    } else if (filters.dateRange === 'upcoming') {
      filtered = filtered.filter((event) => isUpcoming(new Date(event.startDateTime)))
    }

    return filtered.sort((a, b) => 
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    )
  },

  getTodayEvents: () => {
    const { events } = get()
    return events
      .filter((event) => event.status === 'published' && isToday(new Date(event.startDateTime)))
      .sort((a, b) => 
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      )
  },

  getWeekendEvents: () => {
    const { events } = get()
    return events
      .filter((event) => event.status === 'published' && isThisWeekend(new Date(event.startDateTime)))
      .sort((a, b) => 
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      )
  },

  getUpcomingEvents: () => {
    const { events } = get()
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    return events
      .filter((event) => {
        const eventDate = new Date(event.startDateTime)
        return event.status === 'published' && eventDate > today && !isThisWeekend(eventDate)
      })
      .sort((a, b) => 
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      )
      .slice(0, 12)
  },

  getEventsWithTickets: () => {
    const { events } = get()
    return events
      .filter((event) => event.status === 'published' && (event.ticketUrl || event.hasOnlineTickets))
      .sort((a, b) => 
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      )
  },

  getEventBySlug: (slug) => {
    const { events } = get()
    return events.find((event) => event.slug === slug)
  },

  addEvent: (event) => {
    set((state) => ({
      events: [...state.events, event]
    }))
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updates, updatedAt: new Date().toISOString() } : event
      )
    }))
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id)
    }))
  },

  loadEvents: async () => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      set({ events: mockEvents, isLoading: false })
    } catch (error) {
      set({ error: 'Não foi possível carregar os eventos', isLoading: false })
    }
  }
}))
