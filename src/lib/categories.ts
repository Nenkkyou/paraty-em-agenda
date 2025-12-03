import { EventCategory } from '@/domain/events/types'
import { 
  MusicNotes, 
  ForkKnife, 
  Palette, 
  Tree, 
  Balloon,
  House
} from '@phosphor-icons/react'

export const categoryConfig: Record<EventCategory, { label: string; icon: typeof MusicNotes; color: string }> = {
  musica: {
    label: 'Música',
    icon: MusicNotes,
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  gastronomia: {
    label: 'Gastronomia',
    icon: ForkKnife,
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  cultura: {
    label: 'Cultura',
    icon: Palette,
    color: 'bg-pink-100 text-pink-700 border-pink-200'
  },
  natureza: {
    label: 'Natureza',
    icon: Tree,
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  infantil: {
    label: 'Infantil',
    icon: Balloon,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  hospedagens: {
    label: 'Hospedagens',
    icon: House,
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  }
}

export const getCategoryLabel = (category: EventCategory): string => {
  return categoryConfig[category]?.label || category
}

export const getCategoryIcon = (category: EventCategory) => {
  return categoryConfig[category]?.icon || MusicNotes
}

export const getCategoryColor = (category: EventCategory): string => {
  return categoryConfig[category]?.color || 'bg-gray-100 text-gray-700'
}
