import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  gradient?: boolean
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, gradient = false, children, className }: PageHeaderProps) {
  const backgroundImage = 'url("https://euamoparaty.com.br/wp-content/uploads/euamoparaty_lote8_web18052020@fotosincriveis.com_.br-613.jpg")';

  return (
    <div
      className={cn(
        'relative py-12 sm:py-16 md:py-20 px-4 md:px-8 lg:px-16 bg-cover bg-center',
        gradient && 'bg-gradient-to-br from-primary via-accent to-secondary',
        className
      )}
      style={gradient ? {} : { backgroundImage }}
    >
      {/* Overlay escuro para melhorar legibilidade do texto */}
      {gradient && <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-accent/80 to-secondary/80" />}
      {!gradient && <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-blue-700/70" />}
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 sm:space-y-6">
          <h1
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white'
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                'text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-white/90'
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
