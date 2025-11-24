import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { EventDetailsPage } from '@/pages/EventDetailsPage'
import { LoginPage } from '@/pages/admin/LoginPage'
import { EventsListPage } from '@/pages/admin/EventsListPage'
import { EventFormPage } from '@/pages/admin/EventFormPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/evento/:slug" element={<EventDetailsPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/eventos" replace />} />
          <Route path="eventos" element={<EventsListPage />} />
          <Route path="eventos/novo" element={<EventFormPage />} />
          <Route path="eventos/:id/editar" element={<EventFormPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App