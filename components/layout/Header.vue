<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'
import { useSidebar } from '~/composables/useSidebar'

const authStore = useAuthStore()
const { logout, logoutAdmin } = useAuth()
const { toggleSidebar } = useSidebar()
const route = useRoute()

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/profile': 'My Profile',
  '/dashboard/stores': 'My Stores',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/store/dashboard': 'Dashboard',
  '/store/products': 'Produk',
  '/store/orders': 'Order',
  '/store/ads': 'Ads',
  '/store/finance': 'Finance',
}

const pageTitle = computed(
  () => pageTitles[route.path] ?? 'Dashboard',
)

function handleLogout() {
  if (authStore.isAdmin) {
    logoutAdmin()
  } else {
    logout()
  }
}
</script>

<template>
  <header
    class="h-16 shrink-0 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm"
  >
    <!-- Left: hamburger + title -->
    <div class="flex items-center gap-3">
      <!-- Hamburger (mobile only) -->
      <button
        class="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
        @click="toggleSidebar"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="text-base font-semibold text-gray-800 lg:text-lg">{{ pageTitle }}</h1>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-3">
      <!-- Role badge -->
      <span
        class="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="
          authStore.isAdmin
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        "
      >
        {{ authStore.user?.role }}
      </span>

      <!-- User name -->
      <span class="hidden md:block text-sm text-gray-600 truncate max-w-[120px]">
        {{ authStore.user?.name }}
      </span>

      <!-- Logout button -->
      <button
        class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50"
        @click="handleLogout"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="hidden sm:block">Sign out</span>
      </button>
    </div>
  </header>
</template>
