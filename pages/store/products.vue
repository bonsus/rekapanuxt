<script setup lang="ts">
import type { Product, CreateProductPayload, UpdateProductPayload } from '~/types'

definePageMeta({ layout: 'store', middleware: ['auth'] })

const activeStoreStore = useActiveStoreStore()
const storeId = computed(() => activeStoreStore.store?.id ?? '')

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, isLoading, error } = useProducts()

// ── State ─────────────────────────────────────────────────────────────────────

const products = ref<Product[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20
const search = ref('')
const statusFilter = ref<'ACTIVE' | 'INACTIVE' | ''>('')
const formLoading = ref(false)
const formError = ref<string | null>(null)

// ── Modals ───────────────────────────────────────────────────────────────────

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showHppModal = ref(false)
const showImportModal = ref(false)
const showHppImportModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const hppProduct = ref<Product | null>(null)
const hppLoading = ref(false)
const hppError = ref<string | null>(null)

async function handleImported() {
  showImportModal.value = false
  await loadProducts()
}

async function handleHppUpdated() {
  showHppImportModal.value = false
  tableRefreshKey.value++
  await loadProducts()
}

async function openHppModal(product: Product) {
  hppError.value = null
  hppProduct.value = null
  showHppModal.value = true
  // Fetch full SKUs (may reuse cache from ProductTable expand)
  const res = await getProduct(product.id)
  if (res?.data) {
    hppProduct.value = res.data
  } else {
    showHppModal.value = false
  }
}

async function handleHppUpdate(payload: UpdateProductPayload) {
  if (!hppProduct.value) return
  hppLoading.value = true
  hppError.value = null
  const res = await updateProduct(hppProduct.value.id, payload)
  hppLoading.value = false
  if (res?.data) {
    showHppModal.value = false
    tableRefreshKey.value++
    await loadProducts()
  } else {
    hppError.value = error.value ?? 'Gagal menyimpan HPP'
  }
}

async function openEditModal(product: Product) {
  formError.value = null
  // Fetch full product with SKUs before opening
  const res = await getProduct(product.id)
  if (res?.data) {
    selectedProduct.value = res.data
    showEditModal.value = true
  }
}

function openDeleteModal(product: Product) {
  selectedProduct.value = product
  showDeleteModal.value = true
}

function openCreateModal() {
  selectedProduct.value = null
  formError.value = null
  showCreateModal.value = true
}

// ── Load products ─────────────────────────────────────────────────────────────

async function loadProducts() {
  if (!storeId.value) return
  const res = await getProducts({
    storeId: storeId.value,
    page: page.value,
    limit,
    search: search.value || undefined,
    status: statusFilter.value || undefined,
  })
  if (res) {
    products.value = res.data
    total.value = res.total
  }
}

watch([page, statusFilter], loadProducts)

let searchTimeout: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    loadProducts()
  }, 400)
})

onMounted(async () => {
  activeStoreStore.loadFromStorage()
  await loadProducts()
})

const tableRefreshKey = ref(0)

// ── CRUD handlers ─────────────────────────────────────────────────────────────

async function handleCreate(payload: CreateProductPayload | UpdateProductPayload) {
  formLoading.value = true
  formError.value = null
  const res = await createProduct(payload as CreateProductPayload)
  formLoading.value = false
  if (res?.data) {
    showCreateModal.value = false
    await loadProducts()
  } else {
    formError.value = error.value ?? 'Gagal menyimpan produk'
  }
}

async function handleUpdate(payload: CreateProductPayload | UpdateProductPayload) {
  if (!selectedProduct.value) return
  formLoading.value = true
  formError.value = null
  const res = await updateProduct(selectedProduct.value.id, payload as UpdateProductPayload)
  formLoading.value = false
  if (res?.data) {
    showEditModal.value = false
    await loadProducts()
  } else {
    formError.value = error.value ?? 'Gagal memperbarui produk'
  }
}

async function confirmDelete() {
  if (!selectedProduct.value) return
  await deleteProduct(selectedProduct.value.id)
  showDeleteModal.value = false
  if (!error.value) {
    if (products.value.length === 1 && page.value > 1) page.value--
    await loadProducts()
  }
}

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))
</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Produk</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ total }} produk di toko ini</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          @click="showHppImportModal = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Import HPP
        </button>
        <button
          class="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          @click="showImportModal = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Import TikTok
        </button>
        <button
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          @click="openCreateModal"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Cari produk..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <select
        v-model="statusFilter"
        class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
        @change="page = 1"
      >
        <option value="">Semua Status</option>
        <option value="ACTIVE">Aktif</option>
        <option value="INACTIVE">Tidak Aktif</option>
      </select>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <ProductTable
        :products="products"
        :loading="isLoading"
        :refresh-key="tableRefreshKey"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @edit-hpp="openHppModal"
      />

      <!-- Pagination -->
      <div
        v-if="total > limit"
        class="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-600"
      >
        <span>Halaman {{ page }} dari {{ totalPages }}</span>
        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 transition"
            :disabled="page <= 1"
            @click="page--"
          >Sebelumnya</button>
          <button
            class="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 transition"
            :disabled="page >= totalPages"
            @click="page++"
          >Berikutnya</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ── HPP Import modal ── -->
  <AppModal :is-open="showHppImportModal" title="Import HPP dari Excel" size="lg" @close="showHppImportModal = false">
    <HppImportModal :store-id="storeId" @close="showHppImportModal = false" @updated="handleHppUpdated" />
  </AppModal>

  <!-- ── Import modal ── -->
  <AppModal :is-open="showImportModal" title="Import Produk dari TikTok" size="lg" @close="showImportModal = false">
    <ImportModal :store-id="storeId" @close="showImportModal = false" @imported="handleImported" />
  </AppModal>

  <!-- ── HPP modal ── -->
  <AppModal :is-open="showHppModal" title="Edit HPP" size="md" @close="showHppModal = false">
    <div v-if="!hppProduct" class="flex items-center justify-center py-10 gap-2 text-sm text-gray-400">
      <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Memuat SKU...
    </div>
    <HppModal
      v-else
      :product="hppProduct"
      :loading="hppLoading"
      :error="hppError"
      @submit="handleHppUpdate"
      @cancel="showHppModal = false"
    />
  </AppModal>

  <!-- ── Create modal ── -->
  <AppModal :is-open="showCreateModal" title="Tambah Produk" size="lg" @close="showCreateModal = false">
    <ProductForm
      mode="create"
      :store-id="storeId"
      :loading="formLoading"
      :error="formError"
      @submit="handleCreate"
      @cancel="showCreateModal = false"
    />
  </AppModal>

  <!-- ── Edit modal ── -->
  <AppModal :is-open="showEditModal" title="Edit Produk" size="lg" @close="showEditModal = false">
    <ProductForm
      mode="edit"
      :store-id="storeId"
      :initial-data="selectedProduct ?? undefined"
      :loading="formLoading"
      :error="formError"
      @submit="handleUpdate"
      @cancel="showEditModal = false"
    />
  </AppModal>

  <!-- ── Delete confirm modal ── -->
  <AppModal :is-open="showDeleteModal" title="Hapus Produk" size="sm" @close="showDeleteModal = false">
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Yakin ingin menghapus produk
        <span class="font-semibold text-gray-900">{{ selectedProduct?.name }}</span>?
        Semua SKU akan ikut terhapus dan tindakan ini tidak dapat dibatalkan.
      </p>
      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          @click="showDeleteModal = false"
        >Batal</button>
        <button
          class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition flex items-center gap-2"
          :disabled="isLoading"
          @click="confirmDelete"
        >
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Hapus
        </button>
      </div>
    </div>
  </AppModal>
</template>
