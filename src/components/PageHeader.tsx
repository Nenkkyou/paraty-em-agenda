import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  gradient?: boolean
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, gradient = false, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'relative py-12 sm:py-16 md:py-20 px-4 md:px-8 lg:px-16',
        gradient && 'bg-gradient-to-br from-primary via-accent to-secondary',
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 sm:space-y-6">
          <h1
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight',
              gradient ? 'text-white' : 'text-foreground'
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                'text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed',
                gradient ? 'text-white/90' : 'text-muted-foreground'
              )}
            >
              {description}
            </p>
          )}
        </div>
        {children && <div className="mt-8 sm:mt-10">{children}</div>}
      </div>
    </div>
  )
}
