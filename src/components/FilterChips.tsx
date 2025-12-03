import { EventCategory } from '@/domain/events/types'
import { getCategoryIcon, getCategoryLabel } from '@/lib/categories'
import { cn } from '@/lib/utils'

interface FilterChipsProps {
  selected: EventCategory | 'all'
  onSelect: (category: EventCategory | 'all') => void
  className?: string
}

const categories: (EventCategory | 'all')[] = ['all', 'musica', 'gastronomia', 'cultura', 'natureza', 'infantil', 'hospedagens']

export function FilterChips({ selected, onSelect, className }: FilterChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {categories.map((category) => {
        const isSelected = selected === category
        const Icon = category !== 'all' ? getCategoryIcon(category as EventCategory) : null
        const label = category === 'all' ? 'Todos' : getCategoryLabel(category as EventCategory)

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              'inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300',
              'border-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent',
              'active:scale-95 backdrop-blur-sm',
              isSelected
                ? 'bg-white/20 text-white border-white/40 shadow-lg'
                : 'bg-white/10 text-white/90 border-white/20 hover:border-white/40 hover:bg-white/15'
            )}
            aria-pressed={isSelected}
            aria-label={`Filtrar por ${label}`}
          >
            {Icon && <Icon size={18} className="sm:w-5 sm:h-5" weight={isSelected ? 'fill' : 'regular'} />}
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
