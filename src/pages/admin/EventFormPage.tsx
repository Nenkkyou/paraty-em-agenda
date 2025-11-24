import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEventsStore } from '@/domain/events/useEventsStore'
import { Event, EventCategory, EventStatus } from '@/domain/events/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EventCard } from '@/components/EventCard'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, FloppyDisk, Eye } from '@phosphor-icons/react'
import { getCategoryLabel } from '@/lib/categories'

const eventFormSchema = z.object({
  title: z.string().min(5, 'O título deve ter no mínimo 5 caracteres'),
  description: z.string().min(20, 'A descrição deve ter no mínimo 20 caracteres'),
  category: z.enum(['musica', 'gastronomia', 'cultura', 'natureza', 'infantil']),
  startDateTime: z.string().min(1, 'Data e hora inicial são obrigatórias'),
  endDateTime: z.string().min(1, 'Data e hora final são obrigatórias'),
  locationName: z.string().min(3, 'O nome do local é obrigatório'),
  address: z.string().min(5, 'O endereço é obrigatório'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  imageUrl: z.string().url('URL da imagem inválida'),
  ticketUrl: z.string().url('URL de ingresso inválida').optional().or(z.literal('')),
  isFeatured: z.boolean(),
  status: z.enum(['draft', 'scheduled', 'published', 'canceled'])
}).refine(
  (data) => {
    const start = new Date(data.startDateTime)
    const end = new Date(data.endDateTime)
    return end > start
  },
  {
    message: 'A data final deve ser posterior à data inicial',
    path: ['endDateTime']
  }
)

type EventForm = z.infer<typeof eventFormSchema>

const categories: EventCategory[] = ['musica', 'gastronomia', 'cultura', 'natureza', 'infantil']

export function EventFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { events, addEvent, updateEvent, loadEvents } = useEventsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditing = !!id
  const existingEvent = isEditing ? events.find((e) => e.id === id) : undefined

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset
  } = useForm<EventForm>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: existingEvent
      ? {
          title: existingEvent.title,
          description: existingEvent.description,
          category: existingEvent.category,
          startDateTime: existingEvent.startDateTime.slice(0, 16),
          endDateTime: existingEvent.endDateTime.slice(0, 16),
          locationName: existingEvent.locationName,
          address: existingEvent.address,
          latitude: existingEvent.latitude?.toString() || '',
          longitude: existingEvent.longitude?.toString() || '',
          imageUrl: existingEvent.imageUrl,
          ticketUrl: existingEvent.ticketUrl || '',
          isFeatured: existingEvent.isFeatured,
          status: existingEvent.status
        }
      : {
          title: '',
          description: '',
          category: 'musica',
          startDateTime: '',
          endDateTime: '',
          locationName: '',
          address: '',
          latitude: '',
          longitude: '',
          imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
          ticketUrl: '',
          isFeatured: false,
          status: 'draft'
        }
  })

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  useEffect(() => {
    setHasChanges(isDirty)
  }, [isDirty])

  const watchedValues = watch()

  const previewEvent: Event = {
    id: id || 'preview',
    slug: watchedValues.title?.toLowerCase().replace(/\s+/g, '-') || 'preview',
    title: watchedValues.title || 'Título do evento',
    description: watchedValues.description || 'Descrição do evento',
    category: watchedValues.category,
    startDateTime: watchedValues.startDateTime ? new Date(watchedValues.startDateTime).toISOString() : new Date().toISOString(),
    endDateTime: watchedValues.endDateTime ? new Date(watchedValues.endDateTime).toISOString() : new Date().toISOString(),
    locationName: watchedValues.locationName || 'Local do evento',
    address: watchedValues.address || 'Endereço completo',
    latitude: watchedValues.latitude ? parseFloat(watchedValues.latitude) : undefined,
    longitude: watchedValues.longitude ? parseFloat(watchedValues.longitude) : undefined,
    imageUrl: watchedValues.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    ticketUrl: watchedValues.ticketUrl || undefined,
    isFeatured: watchedValues.isFeatured,
    status: watchedValues.status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const onSubmit = async (data: EventForm, saveStatus: EventStatus) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const eventData: Event = {
        id: id || Date.now().toString(),
        slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        title: data.title,
        description: data.description,
        category: data.category,
        startDateTime: new Date(data.startDateTime).toISOString(),
        endDateTime: new Date(data.endDateTime).toISOString(),
        locationName: data.locationName,
        address: data.address,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        imageUrl: data.imageUrl,
        ticketUrl: data.ticketUrl || undefined,
        isFeatured: data.isFeatured,
        status: saveStatus,
        createdAt: existingEvent?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (isEditing) {
        updateEvent(id, eventData)
        toast.success('Evento atualizado com sucesso!')
      } else {
        addEvent(eventData)
        toast.success('Evento criado com sucesso!')
      }

      navigate('/admin/eventos')
    } catch (error) {
      toast.error('Erro ao salvar evento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (hasChanges) {
      setShowDiscardDialog(true)
    } else {
      navigate('/admin/eventos')
    }
  }

  const handleDiscard = () => {
    setShowDiscardDialog(false)
    navigate('/admin/eventos')
  }

  return (
    <>
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
              <ArrowLeft size={18} />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? 'Editar Evento' : 'Novo Evento'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditing ? 'Atualize as informações do evento' : 'Preencha os dados do novo evento'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border space-y-6">
              <h2 className="text-xl font-semibold">Informações básicas</h2>

              <div className="space-y-2">
                <Label htmlFor="title">Título do evento *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Festival de Jazz de Paraty 2024"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o evento em detalhes..."
                  rows={6}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {getCategoryLabel(cat)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da imagem *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  {...register('imageUrl')}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                )}
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border space-y-6">
              <h2 className="text-xl font-semibold">Data e horário</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDateTime">Data/hora inicial *</Label>
                  <Input
                    id="startDateTime"
                    type="datetime-local"
                    {...register('startDateTime')}
                  />
                  {errors.startDateTime && (
                    <p className="text-sm text-destructive">{errors.startDateTime.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDateTime">Data/hora final *</Label>
                  <Input
                    id="endDateTime"
                    type="datetime-local"
                    {...register('endDateTime')}
                  />
                  {errors.endDateTime && (
                    <p className="text-sm text-destructive">{errors.endDateTime.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border space-y-6">
              <h2 className="text-xl font-semibold">Localização</h2>

              <div className="space-y-2">
                <Label htmlFor="locationName">Nome do local *</Label>
                <Input
                  id="locationName"
                  placeholder="Ex: Praça da Matriz"
                  {...register('locationName')}
                />
                {errors.locationName && (
                  <p className="text-sm text-destructive">{errors.locationName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço completo *</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro, cidade - UF"
                  {...register('address')}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude (opcional)</Label>
                  <Input
                    id="latitude"
                    type="text"
                    placeholder="-23.2170"
                    {...register('latitude')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude (opcional)</Label>
                  <Input
                    id="longitude"
                    type="text"
                    placeholder="-44.7169"
                    {...register('longitude')}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border space-y-6">
              <h2 className="text-xl font-semibold">Configurações adicionais</h2>

              <div className="space-y-2">
                <Label htmlFor="ticketUrl">URL de ingressos (opcional)</Label>
                <Input
                  id="ticketUrl"
                  type="url"
                  placeholder="https://sympla.com.br/seu-evento"
                  {...register('ticketUrl')}
                />
                {errors.ticketUrl && (
                  <p className="text-sm text-destructive">{errors.ticketUrl.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isFeatured">Evento em destaque</Label>
                  <p className="text-sm text-muted-foreground">
                    Eventos em destaque aparecem com badge especial
                  </p>
                </div>
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isFeatured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status da publicação *</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="scheduled">Agendado</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="canceled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
                variant="outline"
                disabled={isSubmitting}
                className="gap-2"
              >
                <FloppyDisk size={18} />
                Salvar como rascunho
              </Button>
              <Button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, 'published'))}
                disabled={isSubmitting}
                className="gap-2"
              >
                <Eye size={18} />
                {isSubmitting ? 'Salvando...' : 'Publicar agora'}
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-card p-6 rounded-lg border border-border space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Eye size={24} />
                Preview
              </h2>
              <p className="text-sm text-muted-foreground">
                Veja como o evento aparecerá para os usuários
              </p>
              <div className="pt-4">
                <EventCard event={previewEvent} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descartar alterações?</DialogTitle>
            <DialogDescription>
              Você tem alterações não salvas. Tem certeza que deseja sair sem salvar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiscardDialog(false)}>
              Continuar editando
            </Button>
            <Button variant="destructive" onClick={handleDiscard}>
              Descartar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
