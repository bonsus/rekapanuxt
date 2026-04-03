<script setup lang="ts">
import type { User, CreateUserPayload, UpdateUserPayload } from '~/types'

type Mode = 'create' | 'edit'

const props = defineProps<{
  mode: Mode
  initialData?: User
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  submit: [payload: CreateUserPayload | UpdateUserPayload]
  cancel: []
}>()

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'USER' as 'ADMIN' | 'USER',
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  expiredAt: '' as string,
})

const formErrors = reactive({
  name: '',
  email: '',
  password: '',
  role: '',
})

// Populate form for edit mode
watch(
  () => props.initialData,
  (user) => {
    if (user) {
      form.name = user.name
      form.email = user.email
      form.password = ''
      form.role = user.role
      form.status = user.status
      form.expiredAt = user.expiredAt ? user.expiredAt.slice(0, 16) : ''
    }
  },
  { immediate: true },
)

function validate(): boolean {
  let valid = true
  formErrors.name = ''
  formErrors.email = ''
  formErrors.password = ''
  formErrors.role = ''

  if (!form.name || form.name.trim().length < 2) {
    formErrors.name = 'Name must be at least 2 characters'
    valid = false
  }

  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    formErrors.email = 'Please enter a valid email address'
    valid = false
  }

  if (props.mode === 'create') {
    if (!form.password || form.password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters'
      valid = false
    }
  } else if (form.password && form.password.length < 8) {
    formErrors.password = 'New password must be at least 8 characters'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  const payload: Record<string, unknown> = {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    role: form.role,
    status: form.status,
    expiredAt: form.expiredAt ? new Date(form.expiredAt).toISOString() : null,
  }

  if (form.password) {
    payload.password = form.password
  }

  emit('submit', payload as CreateUserPayload | UpdateUserPayload)
}

function reset() {
  form.name = ''
  form.email = ''
  form.password = ''
  form.role = 'USER'
  form.status = 'ACTIVE'
  form.expiredAt = ''
  formErrors.name = ''
  formErrors.email = ''
  formErrors.password = ''
  formErrors.role = ''
}

defineExpose({ reset })
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Error alert -->
    <div
      v-if="error"
      class="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
    >
      <svg class="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd" />
      </svg>
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <!-- Name -->
    <AppInput
      v-model="form.name"
      label="Full Name"
      placeholder="John Doe"
      required
      :error="formErrors.name"
    />

    <!-- Email -->
    <AppInput
      v-model="form.email"
      label="Email Address"
      type="email"
      placeholder="john@example.com"
      required
      :error="formErrors.email"
    />

    <!-- Password -->
    <AppInput
      v-model="form.password"
      label="Password"
      type="password"
      :placeholder="mode === 'edit' ? 'Leave blank to keep current password' : 'Min. 8 characters'"
      :required="mode === 'create'"
      :error="formErrors.password"
      :hint="mode === 'edit' ? 'Leave blank to keep the current password' : undefined"
    />

    <!-- Role -->
    <div>
      <label class="label">
        Role <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.role"
        class="input"
        :class="{ 'input-error': !!formErrors.role }"
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
      <p v-if="formErrors.role" class="mt-1 text-xs text-red-500">
        {{ formErrors.role }}
      </p>
    </div>

    <!-- Status -->
    <div>
      <label class="label">
        Status <span class="text-red-500">*</span>
      </label>
      <select v-model="form.status" class="input">
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>

    <!-- Expired At -->
    <div>
      <label class="label">Expired At</label>
      <input
        v-model="form.expiredAt"
        type="datetime-local"
        class="input"
      />
      <p class="mt-1 text-xs text-gray-400">Leave empty for no expiry</p>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-2">
      <AppButton variant="secondary" type="button" @click="emit('cancel')">
        Cancel
      </AppButton>
      <AppButton type="submit" :loading="loading">
        {{ mode === 'create' ? 'Create User' : 'Save Changes' }}
      </AppButton>
    </div>
  </form>
</template>
