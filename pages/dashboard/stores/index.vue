<script setup lang="ts">
import type { Store, CreateStorePayload, UpdateStorePayload, StoreType } from '~/types'
import { useActiveStoreStore } from '~/stores/activeStore'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const router = useRouter()
const activeStoreStore = useActiveStoreStore()
const { getStores, createStore, updateStore, deleteStore, isLoading, error } = useStores()

// ── State ──────────────────────────────────────────────────────────────────

const stores = ref<Store[]>([])
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 1 })

const search = ref('')
const typeFilter = ref<StoreType | ''>('')
const limitFilter = ref(10)
const currentPage = ref(1)

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedStore = ref<Store | null>(null)
const formRef = ref()
const formError = ref('')
const deleteLoading = ref(false)
const successMsg = ref('')
const loadError = ref('')

// ── Data loading ───────────────────────────────────────────────────────────

async function loadStores() {
  loadError.value = ''
  const res = await getStores({
    page: currentPage.value,
    limit: limitFilter.value,
    search: search.value || undefined,
    type: typeFilter.value || undefined,
  })
  if (res) {
    stores.value = res.data
    pagination.value = res.pagination
  } else if (error.value) {
    loadError.value = error.value
  }
}

let searchTimer: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    loadStores()
  }, 350)
})

watch(typeFilter, () => {
  currentPage.value = 1
  loadStores()
})

watch(limitFilter, () => {
  currentPage.value = 1
  loadStores()
})

function changePage(page: number) {
  currentPage.value = page
  loadStores()
}

onMounted(() => loadStores())

// ── Open store ─────────────────────────────────────────────────────────────

function openStore(store: Store) {
  activeStoreStore.setStore(store)
  router.push('/store/dashboard')
}

// ── Create ─────────────────────────────────────────────────────────────────

function openCreate() {
  formError.value = ''
  showCreateModal.value = true
  nextTick(() => formRef.value?.reset())
}

function closeCreate() {
  showCreateModal.value = false
  formError.value = ''
}

async function handleCreate(payload: CreateStorePayload) {
  formError.value = ''
  const res = await createStore(payload)
  if (res?.success) {
    successMsg.value = res.message ?? 'Store created'
    closeCreate()
    await loadStores()
    setTimeout(() => (successMsg.value = ''), 3000)
  } else {
    formError.value = error.value ?? 'Failed to create store'
  }
}

// ── Edit ───────────────────────────────────────────────────────────────────

function openEdit(store: Store) {
  selectedStore.value = store
  formError.value = ''
  showEditModal.value = true
}

function closeEdit() {
  showEditModal.value = false
  selectedStore.value = null
  formError.value = ''
}

async function handleEdit(payload: UpdateStorePayload) {
  if (!selectedStore.value) return
  formError.value = ''
  const res = await updateStore(selectedStore.value.id, payload)
  if (res?.success) {
    successMsg.value = res.message ?? 'Store updated'
    closeEdit()
    await loadStores()
    setTimeout(() => (successMsg.value = ''), 3000)
  } else {
    formError.value = error.value ?? 'Failed to update store'
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────

function openDelete(store: Store) {
  selectedStore.value = store
  showDeleteModal.value = true
}

function closeDelete() {
  showDeleteModal.value = false
  selectedStore.value = null
}

async function handleDelete() {
  if (!selectedStore.value) return
  deleteLoading.value = true
  const res = await deleteStore(selectedStore.value.id)
  deleteLoading.value = false
  if (res?.success) {
    successMsg.value = 'Store deleted'
    closeDelete()
    await loadStores()
    setTimeout(() => (successMsg.value = ''), 3000)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Stores</h1>
        <p class="text-sm text-gray-500 mt-1">Pilih toko untuk masuk ke aplikasi, atau kelola toko Anda</p>
      </div>
      <button class="btn-primary flex items-center gap-2" @click="openCreate">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Store
      </button>
    </div>

    <!-- Success message -->
    <div
      v-if="successMsg"
      class="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
    >
      <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd" />
      </svg>
      {{ successMsg }}
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <AppInput
        v-model="search"
        placeholder="Search stores…"
        class="w-56"
      />
      <select v-model="typeFilter" class="input w-36">
        <option value="">All types</option>
        <option value="SHOPEE">Shopee</option>
        <option value="TIKTOK">TikTok</option>
      </select>
      <select v-model="limitFilter" class="input w-24">
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
      </select>
      <span class="text-sm text-gray-500 ml-auto">{{ pagination.total }} stores</span>
    </div>

    <!-- Load error -->
    <div v-if="loadError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {{ loadError }}
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="flex justify-center items-center py-16 text-gray-400">
        <svg class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <StoreTable
        v-else
        :stores="stores"
        @open="openStore"
        @edit="openEdit"
        @delete="openDelete"
      />
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        v-for="p in pagination.totalPages"
        :key="p"
        class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
        :class="p === currentPage
          ? 'bg-blue-600 text-white border-blue-600'
          : 'border-gray-200 text-gray-600 hover:border-gray-400'"
        @click="changePage(p)"
      >
        {{ p }}
      </button>
    </div>

    <!-- Create Modal -->
    <AppModal :is-open="showCreateModal" title="Add Store" size="md" @close="closeCreate">
      <StoreForm
        ref="formRef"
        mode="create"
        :loading="isLoading"
        :error="formError"
        @submit="(p) => handleCreate(p as CreateStorePayload)"
        @cancel="closeCreate"
      />
    </AppModal>

    <!-- Edit Modal -->
    <AppModal :is-open="showEditModal" title="Edit Store" size="md" @close="closeEdit">
      <StoreForm
        mode="edit"
        :initial-data="selectedStore ?? undefined"
        :loading="isLoading"
        :error="formError"
        @submit="(p) => handleEdit(p as UpdateStorePayload)"
        @cancel="closeEdit"
      />
    </AppModal>

    <!-- Delete Modal -->
    <AppModal :is-open="showDeleteModal" title="Delete Store" size="sm" @close="closeDelete">
      <div class="space-y-4">
        <p class="text-sm text-gray-700">
          Are you sure you want to delete
          <strong>{{ selectedStore?.name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button class="btn-secondary" @click="closeDelete">Cancel</button>
          <button class="btn-danger" :disabled="deleteLoading" @click="handleDelete">
            <svg v-if="deleteLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </AppModal>
  </div>
</template>
