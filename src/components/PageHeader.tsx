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
        'relative py-12 px-4 md:px-8 lg:px-16',
        gradient && 'bg-gradient-to-br from-primary via-accent to-secondary',
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          <h1
            className={cn(
              'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight',
              gradient ? 'text-white' : 'text-foreground'
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                'text-lg md:text-xl max-w-3xl',
                gradient ? 'text-white/90' : 'text-muted-foreground'
              )}
            >
              {description}
            </p>
          )}
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
}
