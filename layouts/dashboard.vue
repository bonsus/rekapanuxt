<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useSidebar } from '~/composables/useSidebar'

const authStore = useAuthStore()
const { isSidebarOpen, closeSidebar } = useSidebar()
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
    <Sidebar />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
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
