import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi, setToken } from '../services/Api'

interface AuthStore {
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,

      login: async (username: string, password: string) => {
        const data = await authApi.login(username, password)
        setToken(data.access_token)
        set({ token: data.access_token })
      },

      register: async (username: string, password: string) => {
        const data = await authApi.registration(username, password)
        setToken(data.access_token)
        set({ token: data.access_token })
      },

      logout: () => {
        setToken(null)
        set({ token: null })
      },
    }),
    {
      name: 'react_education_auth',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setToken(state.token)
        }
      },
    }
  )
)
