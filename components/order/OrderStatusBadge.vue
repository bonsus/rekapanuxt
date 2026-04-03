<template>
  <span :class="badgeClass" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types'

const props = defineProps<{ status: OrderStatus }>()

const map: Record<OrderStatus, { label: string; class: string }> = {
  PENDING:   { label: 'Pending',    class: 'bg-yellow-100 text-yellow-800' },
  SHIPPED:   { label: 'Dikirim',    class: 'bg-blue-100 text-blue-800' },
  DELIVERED: { label: 'Sampai',     class: 'bg-indigo-100 text-indigo-800' },
  COMPLETED: { label: 'Selesai',    class: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Dibatalkan', class: 'bg-red-100 text-red-800' },
  RETURNED:  { label: 'Retur',      class: 'bg-gray-100 text-gray-700' },
}

const badgeClass = computed(() => map[props.status]?.class ?? 'bg-gray-100 text-gray-700')
const label      = computed(() => map[props.status]?.label ?? props.status)
</script>
