<script setup lang="ts">
import type { Product, Sku } from '~/types'

const props = defineProps<{
  products: Product[]
  loading?: boolean
  refreshKey?: number
}>()

const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
  'edit-hpp': [product: Product]
}>()

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatPrice(v: string | number) {
  return Number(v).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
}

// ── Expand / SKU drawer ───────────────────────────────────────────────────────

const expandedId = ref<string | null>(null)
const skuCache = ref<Record<string, Sku[]>>({})
const skuLoading = ref<Record<string, boolean>>({})

// Bust SKU cache when parent signals a refresh (e.g. after HPP save)
watch(() => props.refreshKey, () => {
  skuCache.value = {}
})

const { getProduct } = useProducts()

async function toggleExpand(product: Product) {
  if (expandedId.value === product.id) {
    expandedId.value = null
    return
  }
  expandedId.value = product.id
  if (skuCache.value[product.id]) return   // already loaded

  skuLoading.value[product.id] = true
  const res = await getProduct(product.id)
  skuLoading.value[product.id] = false
  if (res?.data?.skus) {
    skuCache.value[product.id] = res.data.skus
  }
}

function variantLabel(sku: Sku) {
  const entries = Object.entries(sku.variants as Record<string, string>)
  if (!entries.length) return '—'
  return entries.map(([k, v]) => `${k}: ${v}`).join(' · ')
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">MP Product ID</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">SKU</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Varian</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Dibuat</th>
          <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
        <!-- Loading skeleton -->
        <tr v-if="loading" v-for="i in 5" :key="i">
          <td class="px-4 py-3"><div class="h-4 bg-gray-100 rounded animate-pulse w-40" /></td>
          <td class="px-4 py-3 hidden md:table-cell"><div class="h-4 bg-gray-100 rounded animate-pulse w-28" /></td>
          <td class="px-4 py-3 hidden sm:table-cell"><div class="h-4 bg-gray-100 rounded animate-pulse w-12" /></td>
          <td class="px-4 py-3 hidden lg:table-cell"><div class="h-4 bg-gray-100 rounded animate-pulse w-20" /></td>
          <td class="px-4 py-3"><div class="h-5 bg-gray-100 rounded-full animate-pulse w-16" /></td>
          <td class="px-4 py-3 hidden lg:table-cell"><div class="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
          <td class="px-4 py-3" />
        </tr>

        <!-- Empty state -->
        <tr v-else-if="products.length === 0">
          <td colspan="7" class="px-4 py-16 text-center">
            <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p class="text-sm font-medium text-gray-500">Belum ada produk</p>
            <p class="text-xs text-gray-400 mt-1">Klik "Tambah Produk" untuk mulai</p>
          </td>
        </tr>

        <!-- Data rows -->
        <template
          v-else
          v-for="product in products"
          :key="product.id"
        >
          <!-- Product row -->
          <tr
            class="hover:bg-gray-50 transition-colors cursor-pointer"
            :class="expandedId === product.id ? 'bg-blue-50/40' : ''"
            @click="toggleExpand(product)"
          >
            <!-- Expand chevron + Name -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200"
                  :class="expandedId === product.id ? 'rotate-90' : ''"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate max-w-[160px]">{{ product.name }}</p>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <p v-if="product.description" class="text-xs text-gray-400 truncate max-w-[160px]">{{ product.description }}</p>
                    <span v-if="product.category" class="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full font-medium">{{ product.category }}</span>
                  </div>
                </div>
              </div>
            </td>

            <!-- MP Product ID -->
            <td class="px-4 py-3 hidden md:table-cell" @click.stop>
              <span class="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{{ product.mpProductId }}</span>
            </td>

            <!-- SKU count -->
            <td class="px-4 py-3 hidden sm:table-cell">
              <span class="text-sm text-gray-700">{{ product._count?.skus ?? 0 }}</span>
            </td>

            <!-- Variant types -->
            <td class="px-4 py-3 hidden lg:table-cell">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="v in product.variantTypes"
                  :key="v"
                  class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                >{{ v }}</span>
                <span v-if="product.variantTypes.length === 0" class="text-xs text-gray-400">—</span>
              </div>
            </td>

            <!-- Status badge -->
            <td class="px-4 py-3 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="product.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'"
              >
                {{ product.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </td>

            <!-- Created date -->
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
              {{ formatDate(product.createdAt) }}
            </td>

            <!-- Actions -->
            <td class="px-4 py-3 whitespace-nowrap text-right" @click.stop>
              <div class="flex items-center justify-end gap-1.5">
                <button
                  class="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Edit HPP"
                  @click="emit('edit-hpp', product)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit produk"
                  @click="emit('edit', product)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus produk"
                  @click="emit('delete', product)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <!-- SKU expand row -->
          <tr v-if="expandedId === product.id" class="bg-gray-50/60">
            <td colspan="7" class="px-0 py-0">
              <div class="sku-drawer">
                <!-- Loading -->
                <div v-if="skuLoading[product.id]" class="flex items-center gap-2 px-10 py-4 text-sm text-gray-400">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Memuat SKU...
                </div>

                <!-- Empty SKUs -->
                <div
                  v-else-if="!skuCache[product.id]?.length"
                  class="px-10 py-4 text-sm text-gray-400 italic"
                >
                  Tidak ada SKU
                </div>

                <!-- SKU table -->
                <table v-else class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="px-10 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Kode SKU</th>
                      <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">MP SKU ID</th>
                      <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Varian</th>
                      <th class="px-4 py-2 text-right font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                      <th class="px-4 py-2 text-right font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">HPP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="sku in skuCache[product.id]"
                      :key="sku.id"
                      class="border-b border-gray-100 last:border-0"
                    >
                      <td class="px-10 py-2 font-mono text-gray-700">{{ sku.sku || '—' }}</td>
                      <td class="px-4 py-2 font-mono text-gray-500 hidden md:table-cell">{{ sku.mpSkuId || '—' }}</td>
                      <td class="px-4 py-2 text-gray-600 hidden sm:table-cell">{{ variantLabel(sku) }}</td>
                      <td class="px-4 py-2 text-right text-gray-800 font-medium">{{ formatPrice(sku.price) }}</td>
                      <td class="px-4 py-2 text-right text-gray-500 hidden sm:table-cell">{{ formatPrice(sku.hpp) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.sku-drawer {
  animation: slideDown 0.2s ease-out;
  overflow: hidden;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
