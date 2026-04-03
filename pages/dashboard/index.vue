<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['auth'],
})

// /dashboard always redirects to /dashboard/stores
onMounted(() => navigateTo('/dashboard/stores', { replace: true }))
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
</template>

