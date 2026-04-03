<script setup lang="ts">
import type { FinanceTransaction, TransactionType, CashFlow } from '~/types'

const props = defineProps<{
  storeId: string
  edit:    FinanceTransaction | null
}>()
const emit = defineEmits<{ close: []; saved: [] }>()

const { createTransaction, updateTransaction } = useFinance()

const isEdit = computed(() => !!props.edit)

// ── Form ─────────────────────────────────────────────────────────────────────
const form = reactive({
  date:        '',
  type:        'ORDER' as TransactionType,
  cashFlow:    'IN' as CashFlow,
  source:      '',
  referenceId: '',
  amount:      0,
  platformFee: 0,
  affiliateFee: 0,
  shippingFee: 0,
  note:        '',
})

const saving  = ref(false)
const error   = ref<string | null>(null)

// Auto-set cashFlow when type changes
watch(() => form.type, (t) => {
  if (t === 'ORDER')    form.cashFlow = 'IN'
  if (t === 'ADS')      form.cashFlow = 'OUT'
  if (t === 'LOGISTIC') form.cashFlow = 'OUT'
  if (t === 'WITHDRAW') form.cashFlow = 'OUT'
})

// Show platform/affiliate fee only for ORDER
const isOrder = computed(() => form.type === 'ORDER')

const netAmount = computed(() =>
  Math.max(0, form.amount - (isOrder.value ? form.platformFee + form.affiliateFee + form.shippingFee : 0))
)

// ── Init ──────────────────────────────────────────────────────────────────────
function toDateInput(v: string) {
  if (!v) return ''
  return new Date(v).toISOString().slice(0, 10)
}

onMounted(() => {
  if (props.edit) {
    const e = props.edit
    form.date         = toDateInput(e.date)
    form.type         = e.type
    form.cashFlow     = e.cashFlow
    form.source       = e.source ?? ''
    form.referenceId  = e.referenceId ?? ''
    form.amount       = Number(e.amount)
    form.platformFee  = Number(e.platformFee)
    form.affiliateFee = Number(e.affiliateFee)
    form.shippingFee  = Number(e.shippingFee)
    form.note         = e.note ?? ''
  } else {
    form.date = new Date().toISOString().slice(0, 10)
  }
})

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  error.value = null
  if (!form.date)   { error.value = 'Tanggal wajib diisi'; return }
  if (!form.amount) { error.value = 'Nilai transaksi wajib diisi'; return }

  saving.value = true
  try {
    const payload = {
      storeId:     props.storeId,
      date:        form.date,
      type:        form.type,
      cashFlow:    form.cashFlow,
      source:      form.source || null,
      referenceId: form.referenceId || null,
      amount:      form.amount,
      platformFee: isOrder.value ? form.platformFee : 0,
      affiliateFee: isOrder.value ? form.affiliateFee : 0,
      shippingFee: isOrder.value ? form.shippingFee : 0,
      note:        form.note || null,
    }

    if (isEdit.value && props.edit) {
      await updateTransaction(props.edit.id, payload)
    } else {
      await createTransaction(payload)
    }

    emit('saved')
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Gagal menyimpan'
  } finally {
    saving.value = false
  }
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
</script>

<template>
  <AppModal
    :is-open="true"
    :title="isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'"
    size="md"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <!-- Type + Date -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Tipe Transaksi <span class="text-red-500">*</span></label>
          <select v-model="form.type" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="ORDER">Order (Penghasilan)</option>
            <option value="ADS">Iklan (Ads)</option>
            <option value="LOGISTIC">Logistik (Kurir)</option>
            <option value="WITHDRAW">Tarik Saldo</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Tanggal <span class="text-red-500">*</span></label>
          <input v-model="form.date" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
      </div>

      <!-- Cash Flow + Source -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Arus Kas <span class="text-red-500">*</span></label>
          <select v-model="form.cashFlow" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="IN">Masuk (IN)</option>
            <option value="OUT">Keluar (OUT)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Source / Platform</label>
          <input v-model="form.source" type="text" placeholder="Contoh: TikTok, Shopee, Manual..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
      </div>

      <!-- Reference ID -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Reference ID</label>
        <input v-model="form.referenceId" type="text" placeholder="Nomor order, invoice, dll (opsional)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Nilai Transaksi <span class="text-red-500">*</span></label>
        <input v-model.number="form.amount" type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <!-- Platform + Affiliate + Shipping fee (ORDER only) -->
      <div v-if="isOrder" class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Platform Fee</label>
          <input v-model.number="form.platformFee" type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Affiliate Fee</label>
          <input v-model.number="form.affiliateFee" type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Shipping Fee</label>
          <input v-model.number="form.shippingFee" type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
      </div>

      <!-- Net total display -->
      <div class="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
        <span class="text-sm text-gray-500">Total Bersih</span>
        <span class="text-base font-bold" :class="form.cashFlow === 'IN' ? 'text-green-600' : 'text-red-500'">
          {{ form.cashFlow === 'OUT' ? '-' : '' }}{{ formatCurrency(netAmount) }}
        </span>
      </div>

      <!-- Note -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Keterangan</label>
        <input v-model="form.note" type="text" placeholder="Keterangan tambahan (opsional)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <p v-if="error" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ error }}</p>
    </div>

    <template #footer>
      <div class="flex gap-3 justify-end">
        <button class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" @click="emit('close')">Batal</button>
        <button
          :disabled="saving"
          class="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-60 flex items-center gap-2"
          @click="handleSubmit"
        >
          <svg v-if="saving" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {{ saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Transaksi') }}
        </button>
      </div>
    </template>
  </AppModal>
</template>
