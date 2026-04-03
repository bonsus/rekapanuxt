<script setup lang="ts">
import { useActiveStoreStore } from '~/stores/activeStore'

definePageMeta({ layout: 'store', middleware: ['auth'] })

const { store } = storeToRefs(useActiveStoreStore())
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Ringkasan performa toko <strong>{{ store?.name }}</strong></p>
    </div>

    <!-- Coming soon placeholder -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
      <svg class="w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <div class="text-center">
        <p class="text-base font-semibold text-gray-400">Fitur Segera Hadir</p>
        <p class="text-sm text-gray-300 mt-1">Dashboard akan menampilkan statistik penjualan toko Anda</p>
      </div>
    </div>
  </div>
</template>
