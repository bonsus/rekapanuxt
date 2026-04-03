<script setup lang="ts">
import type { Product, UpdateProductPayload } from '~/types'

const props = defineProps<{
  product: Product | null
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  submit: [payload: UpdateProductPayload]
  cancel: []
}>()

interface HppRow {
  id: string
  sku: string
  mpSkuId: string
  variants: Record<string, string>
  price: string
  hpp: string
}

const rows = ref<HppRow[]>([])
const bulkHpp = ref('')
const bulkError = ref('')
const hppErrors = ref<Record<number, string>>({})

watch(
  () => props.product,
  (p) => {
    bulkHpp.value = ''
    bulkError.value = ''
    hppErrors.value = {}
    if (p?.skus) {
      rows.value = p.skus.map((s) => ({
        id: s.id,
        sku: s.sku,
        mpSkuId: s.mpSkuId,
        variants: { ...(s.variants as Record<string, string>) },
        price: String(s.price),
        hpp: String(s.hpp),
      }))
    } else {
      rows.value = []
    }
  },
  { immediate: true },
)

function applyBulk() {
  bulkError.value = ''
  if (!bulkHpp.value || isNaN(Number(bulkHpp.value))) {
    bulkError.value = 'Masukkan angka yang valid'
    return
  }
  rows.value.forEach((r) => { r.hpp = bulkHpp.value })
}

function variantLabel(variants: Record<string, string>) {
  const entries = Object.entries(variants)
  if (!entries.length) return ''
  return entries.map(([k, v]) => `${k}: ${v}`).join(' · ')
}

function formatPrice(v: string) {
  return Number(v).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
}

function validate() {
  hppErrors.value = {}
  rows.value.forEach((r, i) => {
    if (r.hpp === '' || isNaN(Number(r.hpp)) || Number(r.hpp) < 0) {
      hppErrors.value[i] = 'Tidak valid'
    }
  })
  return Object.keys(hppErrors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  const payload: UpdateProductPayload = {
    skus: rows.value.map((r) => ({
      id: r.id,
      mpSkuId: r.mpSkuId,
      sku: r.sku,
      price: Number(r.price),
      hpp: Number(r.hpp),
      variants: r.variants,
    })),
  }
  emit('submit', payload)
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Error banner -->
    <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <!-- Bulk HPP input -->
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <p class="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">HPP Massal</p>
      <p class="text-xs text-amber-600 mb-3">Isi nilai HPP yang sama ke semua SKU sekaligus.</p>
      <div class="flex gap-2">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">Rp</span>
          <input
            v-model="bulkHpp"
            type="number"
            min="0"
            placeholder="0"
            class="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition bg-white"
            :class="bulkError ? 'border-red-400' : 'border-amber-200'"
            @keyup.enter="applyBulk"
          />
        </div>
        <button
          type="button"
          class="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
          @click="applyBulk"
        >
          Terapkan ke Semua
        </button>
      </div>
      <p v-if="bulkError" class="mt-1.5 text-xs text-red-500">{{ bulkError }}</p>
    </div>

    <!-- SKU list -->
    <div v-if="rows.length === 0" class="text-sm text-gray-400 text-center py-6">
      Tidak ada SKU
    </div>

    <div v-else class="flex flex-col divide-y divide-gray-100">
      <div
        v-for="(row, idx) in rows"
        :key="row.id"
        class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
      >
        <!-- SKU info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">{{ row.sku || '—' }}</p>
          <p v-if="variantLabel(row.variants)" class="text-xs text-gray-400 truncate">
            {{ variantLabel(row.variants) }}
          </p>
          <p class="text-xs text-gray-400">Harga jual: {{ formatPrice(row.price) }}</p>
        </div>

        <!-- HPP input -->
        <div class="w-36 shrink-0">
          <label class="block text-xs text-gray-500 mb-1">HPP (Rp)</label>
          <div class="relative">
            <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rp</span>
            <input
              v-model="row.hpp"
              type="number"
              min="0"
              placeholder="0"
              class="w-full pl-7 pr-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              :class="hppErrors[idx] ? 'border-red-400' : 'border-gray-300'"
            />
          </div>
          <p v-if="hppErrors[idx]" class="mt-0.5 text-xs text-red-500">{{ hppErrors[idx] }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-end gap-3 pt-2 border-t border-gray-100">
      <button
        type="button"
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Batal
      </button>
      <button
        type="button"
        class="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"
        :disabled="loading || rows.length === 0"
        @click="handleSubmit"
      >
        <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Simpan HPP
      </button>
    </div>
  </div>
</template>
