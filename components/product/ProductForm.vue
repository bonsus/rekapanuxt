<script setup lang="ts">
import type { Product, ProductStatus, CreateProductPayload, UpdateProductPayload, SkuPayload } from '~/types'

const props = defineProps<{
  mode: 'create' | 'edit'
  initialData?: Product
  storeId: string
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  submit: [payload: CreateProductPayload | UpdateProductPayload]
  cancel: []
}>()

// ── Form SKU interface ────────────────────────────────────────────────────────

interface FormSku {
  _key: string
  id?: string
  mpSkuId: string
  sku: string
  price: string
  hpp: string
  variants: Record<string, string>
}

function makeKey() {
  return Math.random().toString(36).slice(2)
}

// ── Form state ────────────────────────────────────────────────────────────────

const mpProductId = ref('')
const name = ref('')
const description = ref('')
const category = ref('')
const status = ref<ProductStatus>('ACTIVE')
const variantTypes = ref<string[]>([])
const formSkus = ref<FormSku[]>([])

// Populate from initialData on open / when mode is 'edit'
watch(
  () => props.initialData,
  (data) => {
    if (data) {
      mpProductId.value = data.mpProductId
      name.value = data.name
      description.value = data.description ?? ''
      category.value = data.category ?? ''
      status.value = data.status
      variantTypes.value = [...data.variantTypes]
      formSkus.value = (data.skus ?? []).map((s) => ({
        _key: makeKey(),
        id: s.id,
        mpSkuId: s.mpSkuId,
        sku: s.sku,
        price: String(s.price),
        hpp: String(s.hpp),
        variants: { ...(s.variants as Record<string, string>) },
      }))
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  mpProductId.value = ''
  name.value = ''
  description.value = ''
  category.value = ''
  status.value = 'ACTIVE'
  variantTypes.value = []
  formSkus.value = []
}

// ── Variant type helpers ──────────────────────────────────────────────────────

function addVariantType() {
  if (variantTypes.value.length < 2) {
    variantTypes.value.push('')
  }
}

function removeVariantType(index: number) {
  const removed = variantTypes.value[index]
  variantTypes.value.splice(index, 1)
  // Remove this key from all SKU variant objects
  if (removed) {
    formSkus.value.forEach((s) => {
      delete s.variants[removed]
    })
  }
}

function onVariantTypeRename(index: number, oldName: string, newName: string) {
  // Rename key in all SKU variants
  formSkus.value.forEach((s) => {
    if (oldName && oldName in s.variants) {
      const val = s.variants[oldName]
      delete s.variants[oldName]
      s.variants[newName] = val
    } else if (newName) {
      s.variants[newName] = s.variants[newName] ?? ''
    }
  })
  variantTypes.value[index] = newName
}

function handleVariantTypeInput(index: number, newName: string) {
  const oldName = variantTypes.value[index]
  onVariantTypeRename(index, oldName, newName)
}

// ── SKU helpers ───────────────────────────────────────────────────────────────

function addSku() {
  const variants: Record<string, string> = {}
  variantTypes.value.forEach((t) => {
    if (t) variants[t] = ''
  })
  formSkus.value.push({
    _key: makeKey(),
    mpSkuId: '',
    sku: '',
    price: '',
    hpp: '',
    variants,
  })
}

function removeSku(index: number) {
  formSkus.value.splice(index, 1)
}

// ── Submit ────────────────────────────────────────────────────────────────────

const errors = ref<Record<string, string>>({})

function validate() {
  errors.value = {}
  if (!name.value.trim()) errors.value.name = 'Nama produk wajib diisi'
  if (!mpProductId.value.trim()) errors.value.mpProductId = 'MP Product ID wajib diisi'
  if (formSkus.value.length === 0) errors.value.skus = 'Minimal satu SKU diperlukan'

  variantTypes.value.forEach((t, i) => {
    if (!t.trim()) errors.value[`vt_${i}`] = 'Nama varian tidak boleh kosong'
  })

  formSkus.value.forEach((s, i) => {
    if (!s.price || isNaN(Number(s.price))) errors.value[`sku_price_${i}`] = 'Harga tidak valid'
    if (!s.hpp || isNaN(Number(s.hpp))) errors.value[`sku_hpp_${i}`] = 'HPP tidak valid'
  })

  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return

  const skus: SkuPayload[] = formSkus.value.map((s) => ({
    ...(s.id ? { id: s.id } : {}),
    mpSkuId: s.mpSkuId.trim(),
    sku: s.sku.trim(),
    price: Number(s.price),
    hpp: Number(s.hpp),
    variants: { ...s.variants },
  }))

  if (props.mode === 'create') {
    const payload: CreateProductPayload = {
      mpProductId: mpProductId.value.trim(),
      name: name.value.trim(),
      description: description.value.trim() || null,
      category: category.value.trim() || null,
      status: status.value,
      variantTypes: variantTypes.value.filter((t) => t.trim()),
      storeId: props.storeId,
      skus,
    }
    emit('submit', payload)
  } else {
    const payload: UpdateProductPayload = {
      mpProductId: mpProductId.value.trim(),
      name: name.value.trim(),
      description: description.value.trim() || null,
      category: category.value.trim() || null,
      status: status.value,
      variantTypes: variantTypes.value.filter((t) => t.trim()),
      skus,
    }
    emit('submit', payload)
  }
}
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
    <!-- Error banner -->
    <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <!-- ── Basic info ─────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Name -->
      <div class="sm:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nama Produk <span class="text-red-500">*</span>
        </label>
        <input
          v-model="name"
          type="text"
          placeholder="cth. Kaos Polos Premium"
          class="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          :class="errors.name ? 'border-red-400' : 'border-gray-300'"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <!-- MP Product ID -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          MP Product ID <span class="text-red-500">*</span>
        </label>
        <input
          v-model="mpProductId"
          type="text"
          placeholder="cth. PROD-001"
          class="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          :class="errors.mpProductId ? 'border-red-400' : 'border-gray-300'"
        />
        <p v-if="errors.mpProductId" class="mt-1 text-xs text-red-500">{{ errors.mpProductId }}</p>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <div class="flex gap-3">
          <label
            v-for="opt in [{ value: 'ACTIVE', label: 'Aktif' }, { value: 'INACTIVE', label: 'Tidak Aktif' }]"
            :key="opt.value"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              v-model="status"
              type="radio"
              :value="opt.value"
              class="accent-blue-600"
            />
            <span class="text-sm text-gray-700">{{ opt.label }}</span>
          </label>
        </div>
      </div>

      <!-- Description -->
      <div class="sm:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          v-model="description"
          rows="2"
          placeholder="Opsional"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        />
      </div>

      <!-- Category -->
      <div class="sm:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
        <input
          v-model="category"
          type="text"
          placeholder="cth. Pakaian, Elektronik, Aksesoris"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
    </div>

    <!-- ── Variant types ───────────────────────────────────────────────────── -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-gray-700">Tipe Varian <span class="text-gray-400 font-normal">(maks. 2)</span></label>
        <button
          v-if="variantTypes.length < 2"
          type="button"
          class="text-xs text-blue-600 hover:text-blue-700 font-medium"
          @click="addVariantType"
        >+ Tambah Varian</button>
      </div>

      <div v-if="variantTypes.length === 0" class="text-xs text-gray-400 italic">
        Tidak ada varian — semua SKU akan bernilai default
      </div>

      <div class="flex flex-col gap-2">
        <div
          v-for="(vt, index) in variantTypes"
          :key="index"
          class="flex items-center gap-2"
        >
          <input
            :value="vt"
            type="text"
            :placeholder="`cth. ${index === 0 ? 'Warna' : 'Ukuran'}`"
            class="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            :class="errors[`vt_${index}`] ? 'border-red-400' : 'border-gray-300'"
            @input="handleVariantTypeInput(index, ($event.target as HTMLInputElement).value)"
          />
          <button
            type="button"
            class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
            @click="removeVariantType(index)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p v-if="errors[`vt_${index}`]" class="mt-1 text-xs text-red-500">{{ errors[`vt_${index}`] }}</p>
        </div>
      </div>
    </div>

    <!-- ── SKU list ────────────────────────────────────────────────────────── -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-gray-700">
          Daftar SKU <span class="text-red-500">*</span>
        </label>
        <button
          type="button"
          class="text-xs text-blue-600 hover:text-blue-700 font-medium"
          @click="addSku"
        >+ Tambah SKU</button>
      </div>

      <p v-if="errors.skus" class="mb-2 text-xs text-red-500">{{ errors.skus }}</p>

      <div v-if="formSkus.length === 0" class="border border-dashed border-gray-300 rounded-lg py-8 text-center">
        <p class="text-sm text-gray-400">Belum ada SKU. Klik "Tambah SKU" untuk mulai.</p>
      </div>

      <!-- SKU rows -->
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="(sku, idx) in formSkus"
          :key="sku._key"
          class="border border-gray-200 rounded-lg p-3 bg-gray-50 relative"
        >
          <!-- Row index label + remove -->
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-gray-500 uppercase">SKU #{{ idx + 1 }}</span>
            <button
              v-if="formSkus.length > 1"
              type="button"
              class="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
              @click="removeSku(idx)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <!-- MP SKU ID -->
            <div>
              <label class="block text-xs text-gray-500 mb-0.5">MP SKU ID</label>
              <input
                v-model="sku.mpSkuId"
                type="text"
                placeholder="ID marketplace"
                class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
              />
            </div>

            <!-- SKU Code -->
            <div>
              <label class="block text-xs text-gray-500 mb-0.5">Kode SKU</label>
              <input
                v-model="sku.sku"
                type="text"
                placeholder="cth. SKU-001"
                class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
              />
            </div>

            <!-- Variant values -->
            <div
              v-for="vt in variantTypes.filter(t => t.trim())"
              :key="vt"
            >
              <label class="block text-xs text-gray-500 mb-0.5">{{ vt }}</label>
              <input
                v-model="sku.variants[vt]"
                type="text"
                :placeholder="`Nilai ${vt}`"
                class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
              />
            </div>

            <!-- Price -->
            <div>
              <label class="block text-xs text-gray-500 mb-0.5">Harga (Rp) <span class="text-red-400">*</span></label>
              <input
                v-model="sku.price"
                type="number"
                min="0"
                placeholder="0"
                class="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                :class="errors[`sku_price_${idx}`] ? 'border-red-400' : 'border-gray-300'"
              />
              <p v-if="errors[`sku_price_${idx}`]" class="mt-0.5 text-xs text-red-500">{{ errors[`sku_price_${idx}`] }}</p>
            </div>

            <!-- HPP -->
            <div>
              <label class="block text-xs text-gray-500 mb-0.5">HPP / Modal (Rp) <span class="text-red-400">*</span></label>
              <input
                v-model="sku.hpp"
                type="number"
                min="0"
                placeholder="0"
                class="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                :class="errors[`sku_hpp_${idx}`] ? 'border-red-400' : 'border-gray-300'"
              />
              <p v-if="errors[`sku_hpp_${idx}`]" class="mt-0.5 text-xs text-red-500">{{ errors[`sku_hpp_${idx}`] }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Footer actions ────────────────────────────────────────────────── -->
    <div class="flex justify-end gap-3 pt-2 border-t border-gray-100">
      <button
        type="button"
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Batal
      </button>
      <button
        type="submit"
        class="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"
        :disabled="loading"
      >
        <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        {{ mode === 'create' ? 'Simpan Produk' : 'Update Produk' }}
      </button>
    </div>
  </form>
</template>
