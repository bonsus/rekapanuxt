<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'
import { useSidebar } from '~/composables/useSidebar'

const authStore = useAuthStore()
const { logout, logoutAdmin } = useAuth()
const route = useRoute()
const { isSidebarOpen, closeSidebar } = useSidebar()

// Close sidebar on navigation (mobile)
watch(() => route.path, () => closeSidebar())

function handleLogout() {
  if (authStore.isAdmin) {
    logoutAdmin()
  } else {
    logout()
  }
}

const userNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'home',
  },
  {
    label: 'Stores',
    href: '/dashboard/stores',
    icon: 'store',
  },
]

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'home',
  },
  {
    label: 'User Management',
    href: '/admin/users',
    icon: 'users',
  },
]

const navItems = computed(() =>
  authStore.isAdmin ? adminNavItems : userNavItems,
)

const userInitial = computed(
  () => authStore.user?.name?.charAt(0).toUpperCase() ?? '?',
)
</script>

<template>
  <aside
    class="fixed lg:relative inset-y-0 left-0 z-40 lg:z-10 w-64 shrink-0 bg-slate-900 text-white flex flex-col h-full shadow-xl transform transition-transform duration-300 ease-in-out"
    :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Logo -->
    <div class="px-6 py-5 border-b border-slate-700/60">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <p class="font-bold text-white leading-none">RekapNuxt</p>
          <p class="text-xs text-slate-400 capitalize mt-0.5">
            {{ authStore.user?.role?.toLowerCase() }} panel
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      <p class="px-3 pt-2 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Navigation
      </p>

      <NuxtLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all duration-150 text-sm font-medium"
        :class="{
          'bg-blue-600 text-white hover:bg-blue-600': route.path === item.href,
        }"
      >
        <!-- Home icon -->
        <template v-if="item.icon === 'home'">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </template>

        <!-- User icon -->
        <template v-else-if="item.icon === 'user'">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </template>

        <!-- Users icon -->
        <template v-else-if="item.icon === 'users'">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </template>

        <!-- Store icon -->
        <template v-else-if="item.icon === 'store'">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </template>

        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User section -->
    <div class="px-3 pb-4 pt-2 border-t border-slate-700/60 space-y-0.5">
      <!-- Avatar + name + email -->
      <div class="flex items-center gap-3 px-3 py-2.5">
        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
          {{ userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ authStore.user?.name }}</p>
          <p class="text-xs text-slate-400 truncate">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <!-- Profile link -->
      <NuxtLink
        to="/dashboard/profile"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all duration-150 text-sm font-medium"
        :class="{ 'bg-blue-600 text-white hover:bg-blue-600': route.path === '/dashboard/profile' }"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Profile</span>
      </NuxtLink>

      <!-- Logout -->
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-150 text-sm font-medium"
        @click="handleLogout"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Sign out</span>
      </button>
    </div>
  </aside>
</template>
