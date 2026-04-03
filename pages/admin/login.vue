<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const { login, isLoading, error } = useAuth()

const form = reactive({ email: '', password: '' })
const formErrors = reactive({ email: '', password: '' })
const roleError = ref('')

function validate(): boolean {
  formErrors.email = ''
  formErrors.password = ''
  roleError.value = ''
  let valid = true

  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    formErrors.email = 'Please enter a valid email address'
    valid = false
  }
  if (!form.password) {
    formErrors.password = 'Password is required'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validate()) return

  const result = await login(form)

  if (result?.success) {
    const user = authStore.user
    if (user?.role !== 'ADMIN') {
      authStore.clearAuth()
      roleError.value = 'Access denied. This portal is for admins only.'
      return
    }
    await navigateTo('/admin/dashboard')
  }
}

onMounted(() => {
  authStore.loadFromStorage()
  if (authStore.isAuthenticated && authStore.isAdmin) {
    navigateTo('/admin/dashboard')
  }
})
</script>

<template>
  <div>
    <div class="text-center mb-6">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-3">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        Admin Portal
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Admin Sign In</h2>
      <p class="text-sm text-gray-500 mt-1">Access the admin dashboard</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <AppInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="admin@example.com"
        required
        :error="formErrors.email"
      />

      <AppInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        :error="formErrors.password"
      />

      <!-- Role error -->
      <div
        v-if="roleError"
        class="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg"
      >
        <svg class="w-4 h-4 text-orange-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-orange-700">{{ roleError }}</p>
      </div>

      <!-- Server error -->
      <div
        v-if="error"
        class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
      >
        <svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>

      <AppButton type="submit" class="w-full" :loading="isLoading">
        Sign in as Admin
      </AppButton>
    </form>

    <div class="mt-6 pt-6 border-t border-gray-100 text-center">
      <NuxtLink
        to="/login"
        class="text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back to user login
      </NuxtLink>
    </div>
  </div>
</template>
