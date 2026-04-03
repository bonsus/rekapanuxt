<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const authStore = useAuthStore()
const { fetchWithAuth } = useApi()

const user = computed(() => authStore.user)
const isEditing = ref(false)
const successMsg = ref('')
const isLoading = ref(false)
const apiError = ref('')

// Update password form
const pwForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const pwErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

function validatePassword(): boolean {
  pwErrors.currentPassword = ''
  pwErrors.newPassword = ''
  pwErrors.confirmPassword = ''
  let valid = true

  if (!pwForm.currentPassword) {
    pwErrors.currentPassword = 'Current password is required'
    valid = false
  }
  if (!pwForm.newPassword || pwForm.newPassword.length < 8) {
    pwErrors.newPassword = 'New password must be at least 8 characters'
    valid = false
  }
  if (pwForm.newPassword !== pwForm.confirmPassword) {
    pwErrors.confirmPassword = 'Passwords do not match'
    valid = false
  }
  return valid
}

async function handleUpdatePassword() {
  if (!validatePassword()) return

  isLoading.value = true
  apiError.value = ''
  successMsg.value = ''

  try {
    await fetchWithAuth('/api/user/password', {
      method: 'PUT',
      body: {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword,
      },
    })

    successMsg.value = 'Password updated successfully!'
    pwForm.currentPassword = ''
    pwForm.newPassword = ''
    pwForm.confirmPassword = ''
    isEditing.value = false
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string }
    apiError.value = e.data?.message ?? e.message ?? 'Failed to update password'
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <!-- Success alert -->
    <Transition name="fade">
      <div
        v-if="successMsg"
        class="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl"
      >
        <svg class="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        <p class="text-sm font-medium text-green-700">{{ successMsg }}</p>
        <button
          class="ml-auto text-green-400 hover:text-green-600"
          @click="successMsg = ''"
        >
          ✕
        </button>
      </div>
    </Transition>

    <!-- Profile info card -->
    <div class="card p-6">
      <div class="flex items-center gap-4 mb-6">
        <div
          class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white"
        >
          {{ user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-800">{{ user?.name }}</h2>
          <p class="text-sm text-gray-500">{{ user?.email }}</p>
          <AppBadge :variant="user?.role === 'ADMIN' ? 'purple' : 'info'" class="mt-1">
            {{ user?.role }}
          </AppBadge>
        </div>
      </div>

      <div class="space-y-0 divide-y divide-gray-50">
        <div class="flex items-center justify-between py-3">
          <span class="text-sm text-gray-500">Full Name</span>
          <span class="text-sm font-medium text-gray-800">{{ user?.name }}</span>
        </div>
        <div class="flex items-center justify-between py-3">
          <span class="text-sm text-gray-500">Email Address</span>
          <span class="text-sm font-medium text-gray-800">{{ user?.email }}</span>
        </div>
        <div class="flex items-center justify-between py-3">
          <span class="text-sm text-gray-500">Role</span>
          <AppBadge :variant="user?.role === 'ADMIN' ? 'purple' : 'info'">
            {{ user?.role }}
          </AppBadge>
        </div>
        <div class="flex items-center justify-between py-3">
          <span class="text-sm text-gray-500">Member Since</span>
          <span class="text-sm font-medium text-gray-800">{{ formatDate(user?.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Change password card -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-semibold text-gray-800">Password</h3>
          <p class="text-sm text-gray-500 mt-0.5">Update your account password</p>
        </div>
        <AppButton
          v-if="!isEditing"
          variant="secondary"
          size="sm"
          @click="isEditing = true"
        >
          Change Password
        </AppButton>
      </div>

      <Transition name="fade">
        <form v-if="isEditing" class="space-y-4" @submit.prevent="handleUpdatePassword">
          <!-- API error -->
          <div
            v-if="apiError"
            class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-red-700">{{ apiError }}</p>
          </div>

          <AppInput
            v-model="pwForm.currentPassword"
            label="Current Password"
            type="password"
            placeholder="••••••••"
            required
            :error="pwErrors.currentPassword"
          />
          <AppInput
            v-model="pwForm.newPassword"
            label="New Password"
            type="password"
            placeholder="Min. 8 characters"
            required
            :error="pwErrors.newPassword"
          />
          <AppInput
            v-model="pwForm.confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            required
            :error="pwErrors.confirmPassword"
          />

          <div class="flex gap-3 pt-1">
            <AppButton type="submit" :loading="isLoading">
              Update Password
            </AppButton>
            <AppButton
              variant="secondary"
              type="button"
              @click="isEditing = false; apiError = ''"
            >
              Cancel
            </AppButton>
          </div>
        </form>
      </Transition>

      <p v-if="!isEditing" class="text-sm text-gray-400">
        ••••••••••••
      </p>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
