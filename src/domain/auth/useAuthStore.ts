import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        if (email === 'admin@paraty.com' && password === 'admin123') {
          set({
            isAuthenticated: true,
            user: { email, name: 'Administrador' }
          })
          return true
        }
        
        return false
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null
        })
      }
    }),
    {
      name: 'paraty-auth-storage'
    }
  )
)
