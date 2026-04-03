<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUsers } from '~/composables/useUsers'

definePageMeta({
  layout: 'dashboard',
  middleware: ['admin'],
})

const authStore = useAuthStore()
const { getUsers } = useUsers()

// Stats
const stats = reactive({
  total: 0,
  admins: 0,
  users: 0,
})

// Recent users
const recentUsers = ref<{ id: string; name: string; email: string; role: string; createdAt: string }[]>([])
const isLoading = ref(false)

async function loadStats() {
  isLoading.value = true
  try {
    const [allRes, adminsRes] = await Promise.all([
      getUsers({ page: 1, limit: 1 }),
      getUsers({ page: 1, limit: 1, role: 'ADMIN' }),
    ])
    stats.total = allRes?.pagination.total ?? 0
    stats.admins = adminsRes?.pagination.total ?? 0
    stats.users = stats.total - stats.admins

    // Get recent 5 users
    const recentRes = await getUsers({ page: 1, limit: 5 })
    recentUsers.value = recentRes?.data ?? []
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

onMounted(() => loadStats())
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">
          Hello, {{ authStore.user?.name?.split(' ')[0] }} 👋
        </h2>
        <p class="text-sm text-gray-500 mt-0.5">Here's what's happening in your system.</p>
      </div>
      <NuxtLink to="/admin/users">
        <AppButton>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add User
        </AppButton>
      </NuxtLink>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="card p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-medium text-gray-500">Total Users</p>
          <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-800">
          <span v-if="isLoading" class="animate-pulse">—</span>
          <span v-else>{{ stats.total }}</span>
        </p>
        <p class="text-xs text-gray-400 mt-1">All registered accounts</p>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-medium text-gray-500">Admins</p>
          <div class="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-800">
          <span v-if="isLoading" class="animate-pulse">—</span>
          <span v-else>{{ stats.admins }}</span>
        </p>
        <p class="text-xs text-gray-400 mt-1">Administrator accounts</p>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-medium text-gray-500">Regular Users</p>
          <div class="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-800">
          <span v-if="isLoading" class="animate-pulse">—</span>
          <span v-else>{{ stats.users }}</span>
        </p>
        <p class="text-xs text-gray-400 mt-1">Standard user accounts</p>
      </div>
    </div>

    <!-- Recent users -->
    <div class="card">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 class="font-semibold text-gray-800">Recent Users</h3>
        <NuxtLink to="/admin/users" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all →
        </NuxtLink>
      </div>

      <div class="divide-y divide-gray-50">
        <div
          v-if="isLoading"
          v-for="i in 5"
          :key="i"
          class="flex items-center gap-3 px-6 py-3.5"
        >
          <div class="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          <div class="flex-1 space-y-1.5">
            <div class="h-3.5 bg-gray-100 rounded animate-pulse w-32" />
            <div class="h-3 bg-gray-100 rounded animate-pulse w-48" />
          </div>
        </div>

        <div
          v-else-if="recentUsers.length === 0"
          class="px-6 py-10 text-center text-sm text-gray-400"
        >
          No users yet
        </div>

        <div
          v-else
          v-for="u in recentUsers"
          :key="u.id"
          class="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors"
        >
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0"
          >
            {{ u.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">{{ u.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ u.email }}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <AppBadge :variant="u.role === 'ADMIN' ? 'purple' : 'info'">
              {{ u.role }}
            </AppBadge>
            <span class="text-xs text-gray-400 hidden sm:block">{{ formatDate(u.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
