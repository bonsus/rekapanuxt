<template>
  <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
    <table class="min-w-full divide-y divide-gray-200 text-sm">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-left font-semibold text-gray-600">No. Order</th>
          <th class="px-4 py-3 text-left font-semibold text-gray-600">Pelanggan</th>
          <th class="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
          <th class="px-4 py-3 text-center font-semibold text-gray-600">Item</th>
          <th class="px-4 py-3 text-right font-semibold text-gray-600">Grand Total</th>
          <th class="px-4 py-3 text-left font-semibold text-gray-600">Tanggal</th>
          <th class="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-if="orders.length === 0">
          <td colspan="7" class="px-4 py-10 text-center text-gray-400">Belum ada order</td>
        </tr>
        <tr
          v-for="order in orders"
          :key="order.id"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="px-4 py-3 font-mono whitespace-nowrap">
            <button class="text-blue-700 hover:underline font-medium" @click="$emit('detail', order)">
              {{ order.orderNumber }}
            </button>
          </td>
          <td class="px-4 py-3 text-gray-700">
            {{ order.customer?.name ?? '-' }}
          </td>
          <td class="px-4 py-3">
            <OrderStatusBadge :status="order.status" />
          </td>
          <td class="px-4 py-3 text-center text-gray-600">
            {{ order._count?.items ?? 0 }}
          </td>
          <td class="px-4 py-3 text-right font-semibold text-gray-800 whitespace-nowrap">
            {{ formatCurrency(order.grandTotal) }}
          </td>
          <td class="px-4 py-3 text-gray-500 whitespace-nowrap">
            {{ formatDate(order.createdDate) }}
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-center gap-2">
              <button
                class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit"
                @click="$emit('edit', order)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
                </svg>
              </button>
              <button
                class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                title="Hapus"
                @click="$emit('delete', order)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'

defineProps<{ orders: Order[] }>()
defineEmits<{
  detail: [order: Order]
  edit: [order: Order]
  delete: [order: Order]
}>()

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value))
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
