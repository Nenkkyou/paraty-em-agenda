import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useEventsStore } from '@/domain/events/useEventsStore'
import { EventStatus, EventCategory } from '@/domain/events/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, PencilSimple, Copy, Eye, EyeSlash, MagnifyingGlass } from '@phosphor-icons/react'
import { formatEventDateTime } from '@/lib/dates'
import { getCategoryLabel } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const statusLabels: Record<EventStatus, string> = {
  draft: 'Rascunho',
  scheduled: 'Agendado',
  published: 'Publicado',
  canceled: 'Cancelado'
}

const statusColors: Record<EventStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  scheduled: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
  canceled: 'bg-red-100 text-red-700'
}

export function EventsListPage() {
  const { events, loadEvents, isLoading, updateEvent } = useEventsStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const togglePublishStatus = (eventId: string, currentStatus: EventStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    updateEvent(eventId, { status: newStatus })
    toast.success(
      newStatus === 'published' ? 'Evento publicado!' : 'Evento despublicado'
    )
  }

  const duplicateEvent = (eventId: string) => {
    toast.info('Funcionalidade de duplicação será implementada em breve')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os eventos da plataforma
          </p>
        </div>
        <Link to="/admin/eventos/novo">
          <Button className="gap-2">
            <Plus size={20} />
            Novo evento
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as EventStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="scheduled">Agendado</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
            <SelectItem value="canceled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  Nenhum evento encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="line-clamp-2">{event.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(event.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatEventDateTime(event.startDateTime)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn('text-xs', statusColors[event.status])}
                    >
                      {statusLabels[event.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/eventos/${event.id}/editar`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <PencilSimple size={16} />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateEvent(event.id)}
                        className="gap-1"
                      >
                        <Copy size={16} />
                        <span className="hidden sm:inline">Duplicar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublishStatus(event.id, event.status)}
                        className="gap-1"
                      >
                        {event.status === 'published' ? (
                          <>
                            <EyeSlash size={16} />
                            <span className="hidden sm:inline">Despublicar</span>
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            <span className="hidden sm:inline">Publicar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
