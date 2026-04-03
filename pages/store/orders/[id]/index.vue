<script setup lang="ts">
import type { Order } from '~/types'

definePageMeta({ layout: 'store', middleware: ['auth'] })

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const { getOrder, loading } = useOrders()
const order = ref<Order | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    order.value = await getOrder(id)
  } catch {
    error.value = 'Gagal memuat detail order'
  }
})

function formatCurrency(v: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(v))
}

function formatDate(v: string | Date | null | undefined) {
  if (!v) return '-'
  return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-10">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-bold text-gray-900">Detail Order</h1>
          <p v-if="order" class="text-sm text-gray-500 font-mono">{{ order.orderNumber }}</p>
        </div>
      </div>
      <NuxtLink
        v-if="order"
        :to="`/store/orders/${order.id}/edit`"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
        </svg>
        Edit Order
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{{ error }}</div>

    <template v-else-if="order">

      <!-- Order Info + Status -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div class="flex items-start justify-between gap-4 flex-wrap mb-4">
          <h2 class="font-semibold text-gray-800">Informasi Order</h2>
          <OrderStatusBadge :status="order.status" />
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p class="text-xs text-gray-400 mb-0.5">No. Order</p>
            <p class="font-mono font-semibold text-gray-800">{{ order.orderNumber }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Tanggal Order</p>
            <p class="text-gray-700">{{ formatDate(order.createdDate) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Tanggal Kirim</p>
            <p class="text-gray-700">{{ formatDate(order.shippedDate) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Tanggal Sampai</p>
            <p class="text-gray-700">{{ formatDate(order.deliveredDate) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Tanggal Selesai</p>
            <p class="text-gray-700">{{ formatDate(order.completedDate) }}</p>
          </div>
          <div v-if="order.cancelBy">
            <p class="text-xs text-gray-400 mb-0.5">Dibatalkan Oleh</p>
            <p class="text-gray-700">{{ order.cancelBy }}</p>
          </div>
          <div v-if="order.cancelReason" class="sm:col-span-2">
            <p class="text-xs text-gray-400 mb-0.5">Alasan Pembatalan</p>
            <p class="text-gray-700">{{ order.cancelReason }}</p>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 class="font-semibold text-gray-800 mb-4">Item Pesanan</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left text-xs text-gray-400 font-medium pb-2">Produk</th>
                <th class="text-center text-xs text-gray-400 font-medium pb-2">Qty</th>
                <th class="text-right text-xs text-gray-400 font-medium pb-2">Harga</th>
                <th class="text-right text-xs text-gray-400 font-medium pb-2">Diskon</th>
                <th class="text-right text-xs text-gray-400 font-medium pb-2">Subtotal</th>
                <th class="text-right text-xs text-gray-400 font-medium pb-2">HPP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="item in order.items" :key="item.id">
                <td class="py-3 pr-4">
                  <p class="font-medium text-gray-800">{{ item.productName }}</p>
                  <div class="flex gap-2 mt-0.5 flex-wrap">
                    <span v-if="item.sku" class="text-xs text-gray-400">SKU: {{ item.sku }}</span>
                    <span v-if="item.productCategory" class="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full">{{ item.productCategory }}</span>
                  </div>
                </td>
                <td class="py-3 text-center text-gray-700">{{ item.qty }}</td>
                <td class="py-3 text-right text-gray-700 whitespace-nowrap">{{ formatCurrency(item.price) }}</td>
                <td class="py-3 text-right text-gray-500 whitespace-nowrap">{{ formatCurrency(item.discount) }}</td>
                <td class="py-3 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(item.total) }}</td>
                <td class="py-3 text-right text-gray-400 whitespace-nowrap">{{ formatCurrency(item.hppTotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Financial Summary -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 class="font-semibold text-gray-800 mb-4">Ringkasan Keuangan</h2>
        <div class="max-w-xs ml-auto space-y-2 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span><span>{{ formatCurrency(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Diskon</span><span>-{{ formatCurrency(order.discount) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Total</span><span>{{ formatCurrency(order.total) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Ongkos Kirim</span><span>+{{ formatCurrency(order.shippingFee) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Biaya Platform</span><span>-{{ formatCurrency(order.platformFee) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Biaya Afiliasi</span><span>-{{ formatCurrency(order.affiliateFee) }}</span>
          </div>
          <div class="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
            <span>Grand Total</span><span>{{ formatCurrency(order.grandTotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-500">
            <span>Total HPP</span><span>{{ formatCurrency(order.totalHpp) }}</span>
          </div>
          <div
            class="flex justify-between font-semibold"
            :class="Number(order.netTotal) >= 0 ? 'text-green-700' : 'text-red-600'"
          >
            <span>Net (Laba)</span><span>{{ formatCurrency(order.netTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Customer + Shipping -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- Customer -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 class="font-semibold text-gray-800 mb-4">Pelanggan</h2>
          <div v-if="order.customer" class="space-y-2 text-sm">
            <div v-if="order.customer.customerId">
              <p class="text-xs text-gray-400">Customer ID</p>
              <p class="font-mono text-gray-700">{{ order.customer.customerId }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Nama</p>
              <p class="font-medium text-gray-800">{{ order.customer.name }}</p>
            </div>
            <div v-if="order.customer.phone">
              <p class="text-xs text-gray-400">No. Telepon</p>
              <p class="text-gray-700">{{ order.customer.phone }}</p>
            </div>
            <div v-if="order.customer.address">
              <p class="text-xs text-gray-400">Alamat Detail</p>
              <p class="text-gray-700">{{ order.customer.address }}</p>
            </div>
            <div v-if="order.customer.province || order.customer.city">
              <p class="text-xs text-gray-400">Kota/Provinsi</p>
              <p class="text-gray-700">
                {{ [order.customer.district, order.customer.city, order.customer.province, order.customer.zipcode].filter(Boolean).join(', ') }}
              </p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400">Tidak ada data pelanggan</p>
        </div>

        <!-- Shipping -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 class="font-semibold text-gray-800 mb-4">Pengiriman</h2>
          <div v-if="order.shipping" class="space-y-2 text-sm">
            <div v-if="order.shipping.name">
              <p class="text-xs text-gray-400">Kurir</p>
              <p class="font-medium text-gray-800">{{ order.shipping.name }}</p>
            </div>
            <div v-if="order.shipping.serviceName">
              <p class="text-xs text-gray-400">Layanan</p>
              <p class="text-gray-700">{{ order.shipping.serviceName }}</p>
            </div>
            <div v-if="order.shipping.trackingNumber">
              <p class="text-xs text-gray-400">No. Resi</p>
              <p class="font-mono font-semibold text-blue-700">{{ order.shipping.trackingNumber }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400">Tidak ada data pengiriman</p>
        </div>
      </div>

    </template>
  </div>
</template>
