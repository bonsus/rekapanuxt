<script setup lang="ts">
import type { Order, OrderStatus } from '~/types'

definePageMeta({ layout: 'store', middleware: ['auth'] })

const router = useRouter()
const activeStoreStore = useActiveStoreStore()
const storeId = computed(() => activeStoreStore.store?.id ?? '')
const { getOrders, deleteOrder, loading } = useOrders()

const orders = ref<Order[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20

const search = ref('')
const statusFilter = ref<OrderStatus | ''>('')
const dateFrom = ref('')
const dateTo = ref('')

const deleteTarget = ref<Order | null>(null)
const deleteLoading = ref(false)
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)

const showImportModal = ref(false)

function handleImported() {
  toast.value = { message: 'Order berhasil diimport', type: 'success' }
  load()
}

const totalPages = computed(() => Math.ceil(total.value / limit))

async function load() {
  if (!storeId.value) return
  const res = await getOrders({
    storeId: storeId.value,
    search: search.value || undefined,
    status: (statusFilter.value || undefined) as OrderStatus | undefined,
    dateFrom: dateFrom.value || undefined,
    dateTo: dateTo.value || undefined,
    page: page.value,
    limit,
  })
  orders.value = res?.data ?? []
  total.value = res?.total ?? 0
}

let filterDebounce: ReturnType<typeof setTimeout> | null = null
watch([search, statusFilter, dateFrom, dateTo], () => {
  page.value = 1
  if (filterDebounce) clearTimeout(filterDebounce)
  filterDebounce = setTimeout(load, 300)
})

watch(page, load)

onMounted(() => {
  activeStoreStore.loadFromStorage()
  load()
})

function handleDetail(order: Order) {
  router.push(`/store/orders/${order.id}`)
}

function handleEdit(order: Order) {
  router.push(`/store/orders/${order.id}/edit`)
}

function handleDelete(order: Order) {
  deleteTarget.value = order
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  try {
    await deleteOrder(deleteTarget.value.id)
    toast.value = { message: 'Order berhasil dihapus', type: 'success' }
    deleteTarget.value = null
    load()
  } catch {
    toast.value = { message: 'Gagal menghapus order', type: 'error' }
  } finally {
    deleteLoading.value = false
  }
}

watch(toast, (v) => {
  if (v) setTimeout(() => { toast.value = null }, 3000)
})

const statusOptions: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'Semua Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SHIPPED', label: 'Dikirim' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
  { value: 'RETURNED', label: 'Retur' },
]
</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Order</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manajemen pesanan toko</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-medium transition-colors shadow-sm"
          @click="showImportModal = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import TikTok
        </button>
        <NuxtLink
          to="/store/orders/create"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Order
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-end">
      <div class="flex-1 min-w-[180px]">
        <label class="block text-xs text-gray-500 mb-1">Cari No. Order</label>
        <input
          v-model="search"
          type="text"
          placeholder="Cari nomor order..."
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
      <div class="min-w-[160px]">
        <label class="block text-xs text-gray-500 mb-1">Status</label>
        <select
          v-model="statusFilter"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Dari Tanggal</label>
        <input
          v-model="dateFrom"
          type="date"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Sampai Tanggal</label>
        <input
          v-model="dateTo"
          type="date"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
      <button
        v-if="search || statusFilter || dateFrom || dateTo"
        class="text-xs text-gray-400 hover:text-red-500 px-2 py-2 transition-colors"
        @click="search = ''; statusFilter = ''; dateFrom = ''; dateTo = ''"
      >Reset</button>
    </div>

    <!-- Table -->
    <div>
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
      <OrderTable
        v-else
        :orders="orders"
        @detail="handleDetail"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between text-sm text-gray-500">
      <span>{{ total }} order ditemukan</span>
      <div class="flex items-center gap-1">
        <button
          :disabled="page === 1"
          class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          @click="page--"
        >Prev</button>
        <span class="px-3 py-1.5">{{ page }} / {{ totalPages }}</span>
        <button
          :disabled="page >= totalPages"
          class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          @click="page++"
        >Next</button>
      </div>
    </div>

    <!-- Import Modal -->
    <OrderImportModal
      v-if="showImportModal && storeId"
      :store-id="storeId"
      @close="showImportModal = false"
      @imported="handleImported"
    />

    <!-- Delete Confirm Modal -->
    <AppModal
      :is-open="!!deleteTarget"
      title="Hapus Order"
      size="sm"
      @close="deleteTarget = null"
    >
      <p class="text-sm text-gray-600">
        Hapus order <span class="font-semibold text-gray-900">{{ deleteTarget?.orderNumber }}</span>?
        Tindakan ini tidak dapat dibatalkan.
      </p>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <button
            class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            @click="deleteTarget = null"
          >Batal</button>
          <button
            :disabled="deleteLoading"
            class="px-4 py-2 text-sm rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60"
            @click="confirmDelete"
          >
            {{ deleteLoading ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </template>
    </AppModal>

    <!-- Toast -->
    <Transition name="slide-up">
      <div
        v-if="toast"
        :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg z-50"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 12px); }
</style>
