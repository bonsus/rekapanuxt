<script setup lang="ts">
type InputType = 'text' | 'email' | 'password' | 'number' | 'search'

withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    type?: InputType
    error?: string
    disabled?: boolean
    required?: boolean
    hint?: string
  }>(),
  {
    type: 'text',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="input"
      :class="{ 'input-error': !!error }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" class="mt-1 text-xs text-red-500 flex items-center gap-1">
      <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>

    <p v-else-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>
