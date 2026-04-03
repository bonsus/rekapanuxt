<script setup lang="ts">
import type { User, CreateUserPayload, UpdateUserPayload } from '~/types'

definePageMeta({
  layout: 'dashboard',
  middleware: ['admin'],
})

const { getUsers, createUser, updateUser, deleteUser, isLoading, error } = useUsers()

// ── State ──────────────────────────────────────────────────────────────────

const users = ref<User[]>([])
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 1 })

const search = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const limitFilter = ref(10)
const currentPage = ref(1)

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref<User | null>(null)
const formRef = ref()
const formError = ref('')
const deleteLoading = ref(false)
const successMsg = ref('')
const loadError = ref('')

// ── Data loading ───────────────────────────────────────────────────────────

async function loadUsers() {
  loadError.value = ''
  const res = await getUsers({
    page: currentPage.value,
    limit: limitFilter.value,
    search: search.value || undefined,
    role: (roleFilter.value as 'ADMIN' | 'USER') || undefined,
    status: (statusFilter.value as 'ACTIVE' | 'INACTIVE') || undefined,
  })
  if (res) {
    users.value = res.data
    pagination.value = res.pagination
  } else if (error.value) {
    loadError.value = error.value
  }
}

// Debounced search
let searchTimer: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    loadUsers()
  }, 350)
})

watch(roleFilter, () => {
  currentPage.value = 1
  loadUsers()
})

watch(statusFilter, () => {
  currentPage.value = 1
  loadUsers()
})

watch(limitFilter, () => {
  currentPage.value = 1
  loadUsers()
})

function changePage(page: number) {
  currentPage.value = page
  loadUsers()
}

// ── CRUD handlers ──────────────────────────────────────────────────────────

function openCreate() {
  formError.value = ''
  showCreateModal.value = true
  nextTick(() => formRef.value?.reset?.())
}

function openEdit(user: User) {
  selectedUser.value = { ...user }
  formError.value = ''
  showEditModal.value = true
}

function openDelete(user: User) {
  selectedUser.value = user
  showDeleteModal.value = true
}

function closeCreate() {
  showCreateModal.value = false
  formError.value = ''
}

function closeEdit() {
  showEditModal.value = false
  formError.value = ''
  selectedUser.value = null
}

function closeDelete() {
  showDeleteModal.value = false
  selectedUser.value = null
}

async function handleCreate(payload: CreateUserPayload | UpdateUserPayload) {
  formError.value = ''
  const res = await createUser(payload as CreateUserPayload)
  if (res?.success) {
    closeCreate()
    successMsg.value = 'User created successfully!'
    await loadUsers()
    setTimeout(() => (successMsg.value = ''), 4000)
  } else {
    formError.value = error.value ?? 'Failed to create user'
  }
}

async function handleEdit(payload: CreateUserPayload | UpdateUserPayload) {
  if (!selectedUser.value) return
  formError.value = ''
  const res = await updateUser(selectedUser.value.id, payload as UpdateUserPayload)
  if (res?.success) {
    closeEdit()
    successMsg.value = 'User updated successfully!'
    await loadUsers()
    setTimeout(() => (successMsg.value = ''), 4000)
  } else {
    formError.value = error.value ?? 'Failed to update user'
  }
}

async function handleDelete() {
  if (!selectedUser.value) return
  deleteLoading.value = true
  const res = await deleteUser(selectedUser.value.id)
  deleteLoading.value = false
  if (res?.success) {
    closeDelete()
    successMsg.value = 'User deleted successfully!'
    await loadUsers()
    setTimeout(() => (successMsg.value = ''), 4000)
  } else if (error.value) {
    loadError.value = error.value
  }
}

onMounted(() => loadUsers())
</script>

<template>
  <div class="space-y-5">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">User Management</h2>
        <p class="text-sm text-gray-500 mt-0.5">
          {{ pagination.total }} total user{{ pagination.total !== 1 ? 's' : '' }}
        </p>
      </div>
      <button
        class="btn-primary"
        @click="openCreate"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New User
      </button>
    </div>

    <!-- Success alert -->
    <div
      v-if="successMsg"
      class="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl"
    >
      <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd" />
      </svg>
      <p class="text-sm font-medium text-green-700">{{ successMsg }}</p>
      <button class="ml-auto text-green-400 hover:text-green-600" @click="successMsg = ''">✕</button>
    </div>

    <!-- Load error alert -->
    <div
      v-if="loadError"
      class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
    >
      <svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd" />
      </svg>
      <p class="text-sm font-medium text-red-700">{{ loadError }}</p>
      <button class="ml-auto text-red-400 hover:text-red-600" @click="loadError = ''">✕</button>
    </div>

    <!-- Search & Filter toolbar -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="relative flex-1">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Search by name or email…"
            class="input pl-9"
          />
        </div>

        <!-- Role filter -->
        <select v-model="roleFilter" class="input sm:w-40">
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>

        <!-- Status filter -->
        <select v-model="statusFilter" class="input sm:w-40">
          <option value="">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <!-- Rows per page -->
        <select v-model="limitFilter" class="input sm:w-36">
          <option :value="10">10 per page</option>
          <option :value="25">25 per page</option>
          <option :value="50">50 per page</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <UserTable
      :users="users"
      :loading="isLoading"
      @edit="openEdit"
      @delete="openDelete"
    />

    <!-- Pagination -->
    <AppPagination
      v-if="pagination.total > 0"
      :current-page="pagination.page"
      :total-pages="pagination.totalPages"
      :total="pagination.total"
      :limit="pagination.limit"
      @change="changePage"
    />

    <!-- ── Create Modal ─────────────────────────────────────────────────── -->
    <AppModal
      :is-open="showCreateModal"
      title="Create New User"
      @close="closeCreate"
    >
      <UserForm
        ref="formRef"
        mode="create"
        :loading="isLoading"
        :error="formError"
        @submit="handleCreate"
        @cancel="closeCreate"
      />
    </AppModal>

    <!-- ── Edit Modal ──────────────────────────────────────────────────── -->
    <AppModal
      :is-open="showEditModal"
      title="Edit User"
      @close="closeEdit"
    >
      <UserForm
        mode="edit"
        :initial-data="selectedUser ?? undefined"
        :loading="isLoading"
        :error="formError"
        @submit="handleEdit"
        @cancel="closeEdit"
      />
    </AppModal>

    <!-- ── Delete Confirmation Modal ───────────────────────────────────── -->
    <AppModal
      :is-open="showDeleteModal"
      title="Delete User"
      size="sm"
      @close="closeDelete"
    >
      <div class="text-center py-2">
        <div
          class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h4 class="text-base font-semibold text-gray-800">Delete user?</h4>
        <p class="text-sm text-gray-500 mt-1">
          Are you sure you want to delete
          <span class="font-semibold text-gray-700">{{ selectedUser?.name }}</span>?
          This action cannot be undone.
        </p>
      </div>

      <template #footer>
        <button class="btn-secondary" @click="closeDelete">Cancel</button>
        <button class="btn-danger" :disabled="deleteLoading" @click="handleDelete">
          <span v-if="deleteLoading">Deleting…</span>
          <span v-else>Delete</span>
        </button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
