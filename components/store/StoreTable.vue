<script setup lang="ts">
import type { Store } from '~/types'

defineProps<{
  stores: Store[]
  loading?: boolean
}>()

const emit = defineEmits<{
  open: [store: Store]
  edit: [store: Store]
  delete: [store: Store]
}>()

const TYPE_CONFIG = {
  SHOPEE: { label: 'Shopee', icon: '/icon/shopee.svg', variant: 'warning' as const },
  TIKTOK: { label: 'TikTok', icon: '/icon/tiktok.svg', variant: 'purple' as const },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-gray-200">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Store
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Link
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-100">
          <!-- Loading skeleton -->
          <tr v-if="loading" v-for="i in 5" :key="i">
            <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-40" /></td>
            <td class="px-6 py-4"><div class="h-5 bg-gray-100 rounded-full animate-pulse w-20" /></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-36" /></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
            <td class="px-6 py-4" />
          </tr>

          <!-- Empty state -->
          <tr v-else-if="stores.length === 0">
            <td colspan="5" class="px-6 py-16 text-center">
              <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="text-sm font-medium text-gray-500">No stores found</p>
              <p class="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-else
            v-for="store in stores"
            :key="store.id"
            class="hover:bg-blue-50/50 transition-colors cursor-pointer"
            @click="emit('open', store)"
          >
            <!-- Store name + description -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 p-1">
                  <img :src="TYPE_CONFIG[store.type].icon" :alt="TYPE_CONFIG[store.type].label" class="w-full h-full object-contain" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ store.name }}</p>
                  <p v-if="store.description" class="text-xs text-gray-400 truncate max-w-[200px]">
                    {{ store.description }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Type badge -->
            <td class="px-6 py-4 whitespace-nowrap">
              <AppBadge :variant="TYPE_CONFIG[store.type].variant">
                {{ TYPE_CONFIG[store.type].label }}
              </AppBadge>
            </td>

            <!-- Link -->
            <td class="px-6 py-4 whitespace-nowrap">
              <a
                v-if="store.link"
                :href="store.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 max-w-[160px] truncate"
              >
                <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {{ store.link.replace(/^https?:\/\//, '') }}
              </a>
              <span v-else class="text-xs text-gray-400">—</span>
            </td>

            <!-- Created date -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(store.createdAt) }}
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit store"
                  @click.stop="emit('edit', store)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete store"
                  @click.stop="emit('delete', store)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
