import { Gear } from '@phosphor-icons/react'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as configurações da plataforma
        </p>
      </div>

      <div className="bg-card p-12 rounded-lg border border-border text-center">
        <Gear size={64} className="text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Em desenvolvimento</h2>
        <p className="text-muted-foreground">
          Esta seção estará disponível em breve.
        </p>
      </div>
    </div>
  )
}
