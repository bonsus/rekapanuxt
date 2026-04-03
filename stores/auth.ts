import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isUser = computed(() => user.value?.role === 'USER')

  function setAuth(newUser: User, token: string) {
    user.value = newUser
    accessToken.value = token
    if (import.meta.client) {
      localStorage.setItem('access_token', token)
      localStorage.setItem('auth_user', JSON.stringify(newUser))
    }
  }

  function setToken(token: string) {
    accessToken.value = token
    if (import.meta.client) {
      localStorage.setItem('access_token', token)
    }
  }

  function setUser(newUser: User) {
    user.value = newUser
    if (import.meta.client) {
      localStorage.setItem('auth_user', JSON.stringify(newUser))
    }
  }

  function clearAuth() {
    user.value = null
    accessToken.value = null
    if (import.meta.client) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_user')
    }
  }

  function loadFromStorage() {
    if (!import.meta.client) return false
    const token = localStorage.getItem('access_token')
    const userStr = localStorage.getItem('auth_user')
    if (token && userStr) {
      try {
        accessToken.value = token
        user.value = JSON.parse(userStr) as User
        return true
      } catch {
        clearAuth()
        return false
      }
    }
    return false
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isAdmin,
    isUser,
    setAuth,
    setToken,
    setUser,
    clearAuth,
    loadFromStorage,
  }
})
