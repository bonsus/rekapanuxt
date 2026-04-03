<script setup lang="ts">
import type { Store, CreateStorePayload, UpdateStorePayload, StoreType } from '~/types'

type Mode = 'create' | 'edit'

const props = defineProps<{
  mode: Mode
  initialData?: Store
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  submit: [payload: CreateStorePayload | UpdateStorePayload]
  cancel: []
}>()

const STORE_TYPES: { value: StoreType; label: string }[] = [
  { value: 'SHOPEE', label: 'Shopee' },
  { value: 'TIKTOK', label: 'TikTok' },
]

const form = reactive({
  name: '',
  type: 'SHOPEE' as StoreType,
  description: '',
  link: '',
})

const formErrors = reactive({
  name: '',
  type: '',
  description: '',
  link: '',
})

watch(
  () => props.initialData,
  (store) => {
    if (store) {
      form.name = store.name
      form.type = store.type
      form.description = store.description ?? ''
      form.link = store.link ?? ''
    }
  },
  { immediate: true },
)

function validate(): boolean {
  let valid = true
  formErrors.name = ''
  formErrors.type = ''
  formErrors.link = ''

  if (!form.name || form.name.trim().length < 2) {
    formErrors.name = 'Store name must be at least 2 characters'
    valid = false
  }

  if (!form.type) {
    formErrors.type = 'Please select a store type'
    valid = false
  }

  if (form.link && !/^https?:\/\/.+/.test(form.link)) {
    formErrors.link = 'Link must be a valid URL (https://...)'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  const payload: Record<string, unknown> = {
    name: form.name.trim(),
    type: form.type,
    description: form.description.trim() || null,
    link: form.link.trim() || null,
  }

  emit('submit', payload as CreateStorePayload | UpdateStorePayload)
}

function reset() {
  form.name = ''
  form.type = 'SHOPEE'
  form.description = ''
  form.link = ''
  formErrors.name = ''
  formErrors.type = ''
  formErrors.description = ''
  formErrors.link = ''
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

    <!-- Store Name -->
    <AppInput
      v-model="form.name"
      label="Store Name"
      placeholder="My Shopee Store"
      required
      :error="formErrors.name"
    />

    <!-- Type -->
    <div>
      <label class="label">
        Type <span class="text-red-500">*</span>
      </label>
      <div class="flex gap-3">
        <label
          v-for="opt in STORE_TYPES"
          :key="opt.value"
          class="flex-1 flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all"
          :class="form.type === opt.value
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'"
        >
          <input v-model="form.type" type="radio" :value="opt.value" class="sr-only" />
          <img
            :src="opt.value === 'SHOPEE' ? '/icon/shopee.svg' : '/icon/tiktok.svg'"
            :alt="opt.label"
            class="w-6 h-6 shrink-0"
          />
          <span class="text-sm font-medium" :class="form.type === opt.value ? 'text-blue-700' : 'text-gray-700'">
            {{ opt.label }}
          </span>
        </label>
      </div>
      <p v-if="formErrors.type" class="mt-1 text-xs text-red-500">{{ formErrors.type }}</p>
    </div>

    <!-- Description -->
    <div>
      <label class="label">Description</label>
      <textarea
        v-model="form.description"
        rows="3"
        placeholder="Short description of the store…"
        class="input resize-none"
      />
    </div>

    <!-- Link -->
    <AppInput
      v-model="form.link"
      label="Store Link"
      placeholder="https://shopee.co.id/mystore"
      :error="formErrors.link"
    />

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-2">
      <button type="button" class="btn-secondary" @click="emit('cancel')">Cancel</button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ mode === 'create' ? 'Create Store' : 'Save Changes' }}
      </button>
    </div>
  </form>
</template>
