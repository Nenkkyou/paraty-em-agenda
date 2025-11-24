import { format, formatDistanceToNow, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatEventDate = (dateString: string): string => {
  const date = parseISO(dateString)
  return format(date, "d 'de' MMMM", { locale: ptBR })
}

export const formatEventTime = (dateString: string): string => {
  const date = parseISO(dateString)
  return format(date, 'HH:mm', { locale: ptBR })
}

export const formatEventDateTime = (dateString: string): string => {
  const date = parseISO(dateString)
  return format(date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
}

export const formatEventDateRange = (startString: string, endString: string): string => {
  const start = parseISO(startString)
  const end = parseISO(endString)
  
  if (isSameDay(start, end)) {
    return `${format(start, "d 'de' MMMM", { locale: ptBR })} • ${format(start, 'HH:mm', { locale: ptBR })} - ${format(end, 'HH:mm', { locale: ptBR })}`
  }
  
  return `${format(start, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })} - ${format(end, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}`
}

export const formatRelativeTime = (dateString: string): string => {
  const date = parseISO(dateString)
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
}

export const isEventStartingSoon = (dateString: string): boolean => {
  const date = parseISO(dateString)
  const now = new Date()
  const diffInMinutes = (date.getTime() - now.getTime()) / (1000 * 60)
  return diffInMinutes > 0 && diffInMinutes <= 30
}
