<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const { login, isLoading, error } = useAuth()

const form = reactive({ email: '', password: '' })
const formErrors = reactive({ email: '', password: '' })

function validate(): boolean {
  formErrors.email = ''
  formErrors.password = ''
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
    await navigateTo(user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard/stores')
  }
}

onMounted(() => {
  authStore.loadFromStorage()
  if (authStore.isAuthenticated) {
    navigateTo(authStore.isAdmin ? '/admin/dashboard' : '/dashboard/stores')
  }
})
</script>

<template>
  <div>
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Welcome back</h2>
      <p class="text-sm text-gray-500 mt-1">Sign in to your account</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <AppInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
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
        Sign in
      </AppButton>
    </form>

    <div class="mt-6 pt-6 border-t border-gray-100 text-center">
      <NuxtLink
        to="/admin/login"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Admin login →
      </NuxtLink>
    </div>
  </div>
</template>
