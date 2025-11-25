import { ReactNode, useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface EventCarouselProps {
  children: ReactNode[]
  className?: string
}

export function EventCarousel({ children, className }: EventCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  })
  
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  if (children.length === 0) return null

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)]"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-card shadow-lg border-2 z-10 hidden sm:flex"
          aria-label="Anterior"
        >
          <CaretLeft size={20} weight="bold" />
        </Button>
      )}

      {canScrollNext && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-10 w-10 rounded-full bg-card shadow-lg border-2 z-10 hidden sm:flex"
          aria-label="Próximo"
        >
          <CaretRight size={20} weight="bold" />
        </Button>
      )}

      {children.length > 1 && (
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="h-9 w-9 p-0"
            aria-label="Anterior"
          >
            <CaretLeft size={18} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="h-9 w-9 p-0"
            aria-label="Próximo"
          >
            <CaretRight size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}
