<script setup lang="ts">
import type { User } from '~/types'

defineProps<{
  users: User[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
}>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isExpired(expiredAt: string | null) {
  if (!expiredAt) return false
  return new Date(expiredAt) < new Date()
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-gray-200">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Expired At
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-100">
          <!-- Loading skeleton -->
          <tr v-if="loading" v-for="i in 5" :key="i">
            <td class="px-6 py-4">
              <div class="h-4 bg-gray-100 rounded animate-pulse w-36" />
            </td>
            <td class="px-6 py-4">
              <div class="h-4 bg-gray-100 rounded animate-pulse w-48" />
            </td>
            <td class="px-6 py-4">
              <div class="h-5 bg-gray-100 rounded-full animate-pulse w-16" />
            </td>
            <td class="px-6 py-4">
              <div class="h-5 bg-gray-100 rounded-full animate-pulse w-16" />
            </td>
            <td class="px-6 py-4">
              <div class="h-4 bg-gray-100 rounded animate-pulse w-32" />
            </td>
            <td class="px-6 py-4">
              <div class="h-4 bg-gray-100 rounded animate-pulse w-28" />
            </td>
            <td class="px-6 py-4" />
          </tr>

          <!-- Empty state -->
          <tr v-else-if="users.length === 0">
            <td colspan="7" class="px-6 py-16 text-center">
              <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p class="text-sm font-medium text-gray-500">No users found</p>
              <p class="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-else
            v-for="user in users"
            :key="user.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0"
                >
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <AppBadge :variant="user.role === 'ADMIN' ? 'purple' : 'info'">
                {{ user.role }}
              </AppBadge>
            </td>            <td class="px-6 py-4 whitespace-nowrap">
              <AppBadge :variant="user.status === 'ACTIVE' ? 'success' : 'warning'">
                {{ user.status === 'ACTIVE' ? 'Active' : 'Inactive' }}
              </AppBadge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isExpired(user.expiredAt) ? 'text-red-500 font-medium' : 'text-gray-500'">
              {{ formatDateTime(user.expiredAt) }}
            </td>            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit user"
                  @click="emit('edit', user)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete user"
                  @click="emit('delete', user)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
