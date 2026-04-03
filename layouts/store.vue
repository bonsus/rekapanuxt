<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useActiveStoreStore } from '~/stores/activeStore'
import { useSidebar } from '~/composables/useSidebar'
import { useAuth } from '~/composables/useAuth'

const authStore = useAuthStore()
const activeStoreStore = useActiveStoreStore()
const { logout } = useAuth()
const router = useRouter()
const route = useRoute()
const { isSidebarOpen, closeSidebar, toggleSidebar } = useSidebar()

const store = computed(() => activeStoreStore.store)

const storeNavItems = [
  { label: 'Dashboard', href: '/store/dashboard', icon: 'home' },
  { label: 'Produk', href: '/store/products', icon: 'box' },
  { label: 'Order', href: '/store/orders', icon: 'clipboard' },
  { label: 'TikTok Ads', href: '/store/ads', icon: 'chart' },
  { label: 'Shopee Ads', href: '/store/shopee-ads', icon: 'shopbag' },
  { label: 'Finance', href: '/store/finance', icon: 'wallet' },
]

const TYPE_ICON: Record<string, string> = {
  SHOPEE: '/icon/shopee.svg',
  TIKTOK: '/icon/tiktok.svg',
}

const userInitial = computed(
  () => authStore.user?.name?.charAt(0).toUpperCase() ?? '?',
)

// Close sidebar on navigation (mobile)
watch(() => route.path, () => closeSidebar())

function switchStore() {
  router.push('/dashboard/stores')
}

// Guard: if no active store selected, redirect to store picker
onMounted(() => {
  activeStoreStore.loadFromStorage()
  if (!activeStoreStore.store) {
    router.replace('/dashboard/stores')
  }
})
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Mobile overlay backdrop -->
    <Transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-30 lg:hidden bg-black/50"
        @click="closeSidebar"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed lg:relative inset-y-0 left-0 z-40 lg:z-10 w-64 shrink-0 bg-slate-900 text-white flex flex-col h-full shadow-xl transform transition-transform duration-300 ease-in-out"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Store info header -->
      <div class="px-4 py-4 border-b border-slate-700/60">
        <div v-if="store" class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shrink-0">
            <img
              :src="TYPE_ICON[store.type]"
              :alt="store.type"
              class="w-full h-full object-contain"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white leading-tight truncate">{{ store.name }}</p>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ store.type === 'SHOPEE' ? 'Shopee' : 'TikTok' }}
            </p>
          </div>
        </div>

        <!-- Switch store button -->
        <button
          class="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          @click="switchStore"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Ganti Toko
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p class="px-3 pt-1 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Menu
        </p>

        <NuxtLink
          v-for="item in storeNavItems"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all duration-150 text-sm font-medium"
          :class="{
            'bg-blue-600 text-white hover:bg-blue-600': route.path === item.href,
          }"
        >
          <!-- Home -->
          <template v-if="item.icon === 'home'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </template>
          <!-- Box / Produk -->
          <template v-else-if="item.icon === 'box'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </template>
          <!-- Clipboard / Order -->
          <template v-else-if="item.icon === 'clipboard'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </template>
          <!-- Chart / Ads -->
          <template v-else-if="item.icon === 'chart'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </template>
          <!-- Wallet / Finance -->
          <template v-else-if="item.icon === 'wallet'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </template>
          <!-- Shopbag / Shopee Ads -->
          <template v-else-if="item.icon === 'shopbag'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
          @click="logout"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign out</span>
        </button>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Mobile top bar (hamburger) -->
      <div class="hidden max-lg:flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <button
          class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
          @click="toggleSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="text-sm font-semibold text-gray-800">{{ store?.name ?? 'Menu' }}</span>
      </div>
      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
