import { ref } from 'vue';

const isSidebarOpen = ref(false);
function useSidebar() {
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
  function closeSidebar() {
    isSidebarOpen.value = false;
  }
  function openSidebar() {
    isSidebarOpen.value = true;
  }
  return { isSidebarOpen, toggleSidebar, closeSidebar, openSidebar };
}

export { useSidebar as u };
//# sourceMappingURL=useSidebar-U986f8wU.mjs.map
