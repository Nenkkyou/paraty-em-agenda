import { EventCategory } from '@/domain/events/types'
import { getCategoryIcon, getCategoryLabel } from '@/lib/categories'
import { cn } from '@/lib/utils'

interface FilterChipsProps {
  selected: EventCategory | 'all'
  onSelect: (category: EventCategory | 'all') => void
  className?: string
}

const categories: (EventCategory | 'all')[] = ['all', 'musica', 'gastronomia', 'cultura', 'natureza', 'infantil']

export function FilterChips({ selected, onSelect, className }: FilterChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {categories.map((category) => {
        const isSelected = selected === category
        const Icon = category !== 'all' ? getCategoryIcon(category as EventCategory) : null
        const label = category === 'all' ? 'Todos' : getCategoryLabel(category as EventCategory)

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              'inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200',
              'border hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent',
              'active:scale-95',
              isSelected
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card text-card-foreground border-border hover:border-primary/50 hover:shadow-sm'
            )}
            aria-pressed={isSelected}
            aria-label={`Filtrar por ${label}`}
          >
            {Icon && <Icon size={16} className="sm:w-[18px] sm:h-[18px]" weight={isSelected ? 'fill' : 'regular'} />}
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
