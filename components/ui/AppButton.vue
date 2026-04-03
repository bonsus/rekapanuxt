<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
  },
)

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 shadow-sm',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  ghost:
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
}

const classes = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150',
  'focus:outline-none focus:ring-2 focus:ring-offset-1',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
  >
    <!-- Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-0.5 w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <slot />
  </button>
</template>
