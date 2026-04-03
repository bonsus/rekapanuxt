<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
  total: number
  limit: number
}>()

const emit = defineEmits<{ change: [page: number] }>()

const from = computed(() => (props.currentPage - 1) * props.limit + 1)
const to = computed(() => Math.min(props.currentPage * props.limit, props.total))

// Generate page numbers with ellipsis
const pageNumbers = computed(() => {
  const pages: (number | '...')[] = []
  const { totalPages, currentPage } = props

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }

  pages.push(1)

  if (currentPage > 3) pages.push('...')

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (currentPage < totalPages - 2) pages.push('...')

  pages.push(totalPages)

  return pages
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
    <!-- Count summary -->
    <p class="text-sm text-gray-600">
      Showing <span class="font-medium">{{ from }}</span> –
      <span class="font-medium">{{ to }}</span> of
      <span class="font-medium">{{ total }}</span> results
    </p>

    <!-- Page buttons -->
    <div class="flex items-center gap-1" v-if="totalPages > 1">
      <!-- Previous -->
      <button
        :disabled="currentPage === 1"
        class="px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="emit('change', currentPage - 1)"
      >
        ←
      </button>

      <!-- Page numbers -->
      <template v-for="p in pageNumbers" :key="String(p)">
        <span v-if="p === '...'" class="px-2 text-gray-400 text-sm">…</span>
        <button
          v-else
          class="w-8 h-8 text-sm rounded-lg border transition-colors"
          :class="
            p === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          "
          @click="emit('change', p)"
        >
          {{ p }}
        </button>
      </template>

      <!-- Next -->
      <button
        :disabled="currentPage === totalPages"
        class="px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="emit('change', currentPage + 1)"
      >
        →
      </button>
    </div>
  </div>
</template>
