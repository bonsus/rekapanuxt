<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const authStore = useAuthStore()

onMounted(() => {
  authStore.loadFromStorage()
  if (authStore.isAuthenticated) {
    navigateTo(authStore.isAdmin ? '/admin/dashboard' : '/dashboard/stores')
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
      <p class="text-sm text-gray-500">Redirecting…</p>
    </div>
  </div>
</template>
