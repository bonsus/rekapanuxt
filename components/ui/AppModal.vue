<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title?: string
    size?: Size
    hideClose?: boolean
  }>(),
  { size: 'md', hideClose: false },
)

const emit = defineEmits<{ close: [] }>()

const sizeClasses: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

// Guard: only render Teleport after client-side mount (prevents SSR hydration mismatch)
const isMounted = ref(false)
onMounted(() => { isMounted.value = true })

// Close on Escape key — lifecycle hooks must be called at the top level of setup
const handler = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) emit('close')
}
onMounted(() => window.addEventListener('keydown', handler))
onUnmounted(() => window.removeEventListener('keydown', handler))
</script>

<template>
  <Teleport v-if="isMounted" to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="emit('close')"
        />

        <!-- Panel -->
        <div
          class="relative w-full bg-white rounded-2xl shadow-2xl animate-fade-in my-auto"
          :class="sizeClasses[size]"
          @click.stop
        >
          <!-- Header -->
          <div
            v-if="title || !hideClose"
            class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
          >
            <h3 v-if="title" class="text-lg font-semibold text-gray-800">
              {{ title }}
            </h3>

            <button
              v-if="!hideClose"
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
              @click="emit('close')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-4 overflow-y-auto max-h-[calc(100dvh-10rem)]">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
