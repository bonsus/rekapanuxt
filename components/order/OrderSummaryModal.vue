<script setup lang="ts">
import type { Order, OrderStatus } from '~/types'
import { useApi } from '~/composables/useApi'

const props = defineProps<{
  storeId:     string
  orderNumber: string
}>()
const emit = defineEmits<{ close: [] }>()

const { fetchWithAuth } = useApi()

// ── State ─────────────────────────────────────────────────────────────────────
const order   = ref<Order | null>(null)
const loading = ref(true)
const error   = ref<string | null>(null)

// ── Fetch ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await fetchWithAuth<{ success: boolean; data: Order | null }>(
      '/api/orders/by-number',
      { params: { storeId: props.storeId, orderNumber: props.orderNumber } },
    )
    order.value = res?.data ?? null
    if (!order.value) error.value = 'Order tidak ditemukan'
  } catch {
    error.value = 'Gagal memuat data order'
  } finally {
    loading.value = false
  }
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n))
}
function fmtDate(s: string | null | undefined) {
  if (!s) return '-'
  return new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:   'Pending',
  SHIPPED:   'Dikirim',
  DELIVERED: 'Terkirim',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
  RETURNED:  'Retur',
}
const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  SHIPPED:   'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
  RETURNED:  'bg-orange-100 text-orange-600',
}
</script>

<template>
  <AppModal
    :is-open="true"
    :title="`Order #${orderNumber}`"
    size="md"
    @close="emit('close')"
  >
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="py-8 text-center text-sm text-gray-500">{{ error }}</div>

    <!-- Content -->
    <div v-else-if="order" class="space-y-4">
      <!-- Status + Order number -->
      <div class="flex items-center gap-3">
        <span :class="['text-xs px-2.5 py-1 rounded-full font-medium', STATUS_COLOR[order.status]]">
          {{ STATUS_LABEL[order.status] }}
        </span>
        <span class="font-mono text-xs text-gray-500">{{ order.orderNumber }}</span>
      </div>

      <!-- Customer + Dates -->
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="bg-gray-50 rounded-xl p-3 space-y-1">
          <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Pelanggan</p>
          <p class="font-medium text-gray-800">{{ order.customer?.name || '-' }}</p>
          <p v-if="order.customer?.phone" class="text-xs text-gray-500">{{ order.customer.phone }}</p>
          <p v-if="order.customer?.address" class="text-xs text-gray-500 leading-snug">{{ order.customer.address }}</p>
          <p v-if="order.customer?.city" class="text-xs text-gray-500">
            {{ [order.customer.city, order.customer.province].filter(Boolean).join(', ') }}
          </p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3 space-y-1">
          <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Tanggal</p>
          <div class="text-xs space-y-0.5">
            <div class="flex justify-between gap-2"><span class="text-gray-400">Order</span><span class="text-gray-700">{{ fmtDate(order.createdDate) }}</span></div>
            <div class="flex justify-between gap-2"><span class="text-gray-400">Kirim</span><span class="text-gray-700">{{ fmtDate(order.shippedDate) }}</span></div>
            <div class="flex justify-between gap-2"><span class="text-gray-400">Tiba</span><span class="text-gray-700">{{ fmtDate(order.deliveredDate) }}</span></div>
            <div class="flex justify-between gap-2"><span class="text-gray-400">Selesai</span><span class="text-gray-700">{{ fmtDate(order.completedDate) }}</span></div>
          </div>
          <template v-if="order.shipping?.trackingNumber">
            <p class="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide pt-2 border-t border-gray-200">Resi</p>
            <p class="text-xs font-mono text-gray-700">{{ order.shipping.trackingNumber }}</p>
            <p v-if="order.shipping.serviceName" class="text-xs text-gray-500">{{ order.shipping.serviceName }}</p>
          </template>
        </div>
      </div>

      <!-- Items -->
      <div v-if="order.items && order.items.length">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Items ({{ order.items.length }})</p>
        <div class="rounded-xl border border-gray-100 overflow-hidden">
          <table class="w-full text-xs">
            <thead class="bg-gray-50 text-gray-500">
              <tr>
                <th class="px-3 py-2 text-left font-medium">Produk</th>
                <th class="px-3 py-2 text-center font-medium">Qty</th>
                <th class="px-3 py-2 text-right font-medium">Harga</th>
                <th class="px-3 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="item in order.items" :key="item.id" class="hover:bg-gray-50/50">
                <td class="px-3 py-2">
                  <p class="font-medium text-gray-700 leading-tight">{{ item.productName }}</p>
                  <p v-if="item.sku" class="text-gray-400 font-mono">{{ item.sku }}</p>
                </td>
                <td class="px-3 py-2 text-center text-gray-600">{{ item.qty }}</td>
                <td class="px-3 py-2 text-right text-gray-600">{{ fmt(item.price) }}</td>
                <td class="px-3 py-2 text-right font-medium text-gray-700">{{ fmt(item.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Financials -->
      <div class="rounded-xl bg-gray-50 px-4 py-3 space-y-1.5 text-sm">
        <div class="flex justify-between text-gray-500">
          <span>Subtotal</span><span>{{ fmt(order.subtotal) }}</span>
        </div>
        <div v-if="Number(order.discount) > 0" class="flex justify-between text-gray-500">
          <span>Diskon</span><span class="text-orange-500">-{{ fmt(order.discount) }}</span>
        </div>
        <div class="flex justify-between text-gray-700 font-medium border-t border-gray-200 pt-1.5">
          <span>Total Produk</span><span>{{ fmt(order.total) }}</span>
        </div>
        <div v-if="Number(order.shippingFee) > 0" class="flex justify-between text-gray-500">
          <span>Ongkir</span><span>{{ fmt(order.shippingFee) }}</span>
        </div>
        <div v-if="Number(order.platformFee) > 0" class="flex justify-between text-gray-500">
          <span>Biaya Platform</span><span class="text-red-400">-{{ fmt(order.platformFee) }}</span>
        </div>
        <div v-if="Number(order.affiliateFee) > 0" class="flex justify-between text-gray-500">
          <span>Affiliate Fee</span><span class="text-red-400">-{{ fmt(order.affiliateFee) }}</span>
        </div>
        <div v-if="Number(order.totalHpp) > 0" class="flex justify-between text-gray-500">
          <span>HPP</span><span class="text-red-400">-{{ fmt(order.totalHpp) }}</span>
        </div>
        <div class="flex justify-between font-bold text-gray-800 border-t border-gray-300 pt-1.5">
          <span>Grand Total</span><span>{{ fmt(order.grandTotal) }}</span>
        </div>
        <div class="flex justify-between font-bold" :class="Number(order.netTotal) >= 0 ? 'text-green-600' : 'text-red-500'">
          <span>Net Profit</span><span>{{ fmt(order.netTotal) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 justify-end">
        <button
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          @click="emit('close')"
        >
          Tutup
        </button>
        <NuxtLink
          v-if="order"
          :to="`/store/orders/${order.id}`"
          class="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          @click="emit('close')"
        >
          Lihat Detail Order
        </NuxtLink>
      </div>
    </template>
  </AppModal>
</template>
