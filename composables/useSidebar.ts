// Module-level singleton ref — shared across all components that call useSidebar()
const isSidebarOpen = ref(false)

export function useSidebar() {
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function openSidebar() {
    isSidebarOpen.value = true
  }

  return { isSidebarOpen, toggleSidebar, closeSidebar, openSidebar }
}
