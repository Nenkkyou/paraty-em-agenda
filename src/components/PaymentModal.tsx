import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Calendar, 
  MapPin, 
  Ticket, 
  Lock,
  User,
  Envelope,
  Phone,
  Check
} from '@phosphor-icons/react'
import { Event } from '@/domain/events/types'
import { formatEventDateRange } from '@/lib/dates'
import { toast } from 'sonner'

interface PaymentModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

interface TicketOption {
  id: string
  name: string
  price: number
  description: string
  quantity: number
}

export function PaymentModal({ event, isOpen, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'tickets' | 'details' | 'payment' | 'success'>('tickets')
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: ''
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  const ticketOptions: TicketOption[] = event.hasOnlineTickets && event.ticketPrices 
    ? event.ticketPrices.map(ticket => ({
        id: ticket.type,
        name: ticket.type === 'single' ? 'Ingresso' : 
              ticket.type === 'inteira' ? 'Ingresso Inteira' :
              ticket.type === 'meia' ? 'Meia Entrada' : 'Infantil',
        price: ticket.price,
        description: ticket.description || 'Acesso ao evento',
        quantity: 0
      }))
    : []

  // Se não houver preços definidos, não exibe o modal
  if (!event.hasOnlineTickets || !event.ticketPrices || event.ticketPrices.length === 0) {
    return null
  }

  const updateTicketQuantity = (ticketId: string, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: Math.max(0, quantity)
    }))
  }

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    return ticketOptions.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.id] || 0
      return total + (ticket.price * quantity)
    }, 0)
  }

  const handleNextStep = () => {
    if (step === 'tickets') {
      if (getTotalTickets() === 0) {
        toast.error('Selecione pelo menos um ingresso')
        return
      }
      setStep('details')
    } else if (step === 'details') {
      if (!customerData.name || !customerData.email || !customerData.phone) {
        toast.error('Preencha todos os campos obrigatórios')
        return
      }
      setStep('payment')
    } else if (step === 'payment') {
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        toast.error('Preencha todos os dados do cartão')
        return
      }
      processPayment()
    }
  }

  const processPayment = async () => {
    setIsProcessing(true)
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('success')
      toast.success('Pagamento realizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep('tickets')
    setSelectedTickets({})
    setCustomerData({ name: '', email: '', phone: '', cpf: '' })
    setPaymentData({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket size={20} />
            {step === 'success' ? 'Compra Realizada!' : 'Comprar Ingressos'}
          </DialogTitle>
          <DialogDescription>
            {step === 'success' ? 'Seus ingressos foram enviados por email' : event.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Evento */}
          {step !== 'success' && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h3 className="font-medium">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>{formatEventDateRange(event.startDateTime, event.endDateTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>{event.locationName}</span>
              </div>
            </div>
          )}

          {/* Etapa 1: Seleção de Ingressos */}
          {step === 'tickets' && (
            <div className="space-y-4">
              <h3 className="font-medium">Selecione seus ingressos:</h3>
              {ticketOptions.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{ticket.name}</h4>
                    <p className="text-sm text-muted-foreground">{ticket.description}</p>
                    <p className="text-lg font-bold text-primary">R$ {ticket.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTicketQuantity(ticket.id, (selectedTickets[ticket.id] || 0) - 1)}
                      disabled={!selectedTickets[ticket.id]}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{selectedTickets[ticket.id] || 0}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTicketQuantity(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
              
              {getTotalTickets() > 0 && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total: {getTotalTickets()} ingresso(s)</span>
                    <span className="text-xl font-bold text-primary">R$ {getTotalPrice()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Etapa 2: Dados Pessoais */}
          {step === 'details' && (
            <div className="space-y-4">
              <h3 className="font-medium">Seus dados:</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={customerData.cpf}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Etapa 3: Pagamento */}
          {step === 'payment' && (
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Lock size={18} />
                Dados do cartão:
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="cardNumber">Número do cartão *</Label>
                  <Input
                    id="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Nome no cartão *</Label>
                  <Input
                    id="cardName"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                    placeholder="Nome como está no cartão"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Validade *</Label>
                    <Input
                      id="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total a pagar:</span>
                  <span className="text-xl font-bold text-primary">R$ {getTotalPrice()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Etapa 4: Sucesso */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-green-600">Pagamento Aprovado!</h3>
                <p className="text-muted-foreground mt-2">
                  Seus ingressos foram enviados para o email <strong>{customerData.email}</strong>
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-left">
                <h4 className="font-medium mb-2">Detalhes da compra:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Ingressos:</span>
                    <span>{getTotalTickets()} unidade(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total pago:</span>
                    <span className="font-medium">R$ {getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evento:</span>
                    <span>{event.title}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            {step === 'success' ? (
              <Button onClick={handleClose} className="w-full">
                Fechar
              </Button>
            ) : (
              <>
                {step !== 'tickets' && (
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(step === 'details' ? 'tickets' : 'details')}
                    className="w-full"
                  >
                    Voltar
                  </Button>
                )}
                <Button 
                  onClick={handleNextStep} 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </div>
                  ) : step === 'payment' ? (
                    'Finalizar Pagamento'
                  ) : (
                    'Continuar'
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}