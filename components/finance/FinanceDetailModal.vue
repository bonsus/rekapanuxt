<script setup lang="ts">
import type { FinanceTransaction, TransactionType } from '~/types'

const props = defineProps<{ tx: FinanceTransaction }>()
const emit  = defineEmits<{ close: []; edit: [tx: FinanceTransaction] }>()

const TYPE_LABEL: Record<TransactionType, string> = {
  ORDER: 'Order', ADS: 'Iklan', LOGISTIC: 'Logistik', WITHDRAW: 'Tarik Saldo',
}
const TYPE_COLOR: Record<TransactionType, string> = {
  ORDER:    'bg-blue-100 text-blue-700',
  ADS:      'bg-purple-100 text-purple-700',
  LOGISTIC: 'bg-orange-100 text-orange-700',
  WITHDRAW: 'bg-gray-100 text-gray-600',
}

function fmt(n: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n))
}
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <AppModal :is-open="true" title="Detail Transaksi" size="sm" @close="emit('close')">
    <div class="space-y-4">
      <!-- Type + cashflow chips -->
      <div class="flex items-center gap-2">
        <span :class="['text-xs px-2.5 py-1 rounded-full font-medium', TYPE_COLOR[tx.type]]">
          {{ TYPE_LABEL[tx.type] }}
        </span>
        <span
          :class="[
            'text-xs px-2.5 py-1 rounded-full font-medium',
            tx.cashFlow === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600',
          ]"
        >
          {{ tx.cashFlow === 'IN' ? 'Uang Masuk' : 'Uang Keluar' }}
        </span>
      </div>

      <!-- Net amount large display -->
      <div class="rounded-xl bg-gray-50 px-5 py-4">
        <p class="text-xs text-gray-400 mb-1">Total Bersih (Net)</p>
        <p class="text-2xl font-bold" :class="tx.cashFlow === 'IN' ? 'text-green-600' : 'text-red-500'">
          {{ tx.cashFlow === 'OUT' ? '-' : '' }}{{ fmt(tx.netAmount) }}
        </p>
      </div>

      <!-- Fields -->
      <dl class="divide-y divide-gray-50 text-sm">
        <div class="flex justify-between py-2.5">
          <dt class="text-gray-500">Tanggal</dt>
          <dd class="font-medium text-gray-800">{{ fmtDate(tx.date) }}</dd>
        </div>
        <div class="flex justify-between py-2.5">
          <dt class="text-gray-500">Nilai Transaksi</dt>
          <dd class="font-medium text-gray-800">{{ fmt(tx.amount) }}</dd>
        </div>
        <div v-if="Number(tx.platformFee) > 0" class="flex justify-between py-2.5">
          <dt class="text-gray-500">Platform Fee</dt>
          <dd class="text-red-500 font-medium">-{{ fmt(tx.platformFee) }}</dd>
        </div>
        <div v-if="Number(tx.affiliateFee) > 0" class="flex justify-between py-2.5">
          <dt class="text-gray-500">Affiliate Fee</dt>
          <dd class="text-red-500 font-medium">-{{ fmt(tx.affiliateFee) }}</dd>
        </div>
        <div v-if="Number((tx as unknown as Record<string, unknown>).shippingFee ?? 0) > 0" class="flex justify-between py-2.5">
          <dt class="text-gray-500">Shipping Fee</dt>
          <dd class="text-red-500 font-medium">-{{ fmt((tx as unknown as Record<string, unknown>).shippingFee as string) }}</dd>
        </div>
        <div v-if="tx.source" class="flex justify-between py-2.5">
          <dt class="text-gray-500">Source</dt>
          <dd class="text-gray-700">{{ tx.source }}</dd>
        </div>
        <div class="flex justify-between py-2.5">
          <dt class="text-gray-500">Reference ID</dt>
          <dd class="font-mono text-xs text-gray-600 text-right max-w-[60%] break-all">{{ tx.referenceId || '-' }}</dd>
        </div>
        <div v-if="tx.note" class="flex justify-between py-2.5">
          <dt class="text-gray-500">Keterangan</dt>
          <dd class="text-gray-700 text-right max-w-[60%]">{{ tx.note }}</dd>
        </div>
        <div class="flex justify-between py-2.5">
          <dt class="text-gray-500">Dibuat</dt>
          <dd class="text-gray-500 text-xs">{{ fmtDate(tx.createdAt) }}</dd>
        </div>
      </dl>
    </div>

    <template #footer>
      <div class="flex gap-3 justify-end">
        <button
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          @click="emit('close')"
        >
          Tutup
        </button>
        <button
          class="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          @click="emit('edit', tx); emit('close')"
        >
          Edit
        </button>
      </div>
    </template>
  </AppModal>
</template>
