import { MagnifyingGlass } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center', className)}>
      <div className="mb-3 sm:mb-4 text-muted-foreground">
        {icon || <MagnifyingGlass size={48} className="sm:w-16 sm:h-16" weight="light" />}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-4 sm:mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
