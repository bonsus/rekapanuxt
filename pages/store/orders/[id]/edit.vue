<script setup lang="ts">
import type { Order, SkuSearchResult, OrderItemPayload } from '~/types'

definePageMeta({ layout: 'store', middleware: ['auth'] })

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const activeStoreStore = useActiveStoreStore()
const storeId = computed(() => activeStoreStore.store?.id ?? '')
const { getOrder, updateOrder, loading, searchSkus } = useOrders()

interface FormItem {
  skuId: string | null
  productId: string | null
  sku: string
  mpSkuId: string
  productName: string
  productCategory: string
  qty: number
  price: number
  discount: number
  hpp: number
}

const form = reactive({
  orderNumber: '',
  createdDate: '',
  shippedDate: '',
  deliveredDate: '',
  completedDate: '',
  status: 'PENDING' as string,
  cancelBy: '' as string,
  cancelReason: '',
  shippingFee: 0,
  platformFee: 0,
  affiliateFee: 0,
})

const customerForm = reactive({ enabled: false, customerId: '', name: '', phone: '', address: '', country: '', province: '', city: '', district: '', zipcode: '' })
const shippingForm = reactive({ enabled: false, name: '', serviceName: '', trackingNumber: '' })
const items = ref<FormItem[]>([])
const pageLoading = ref(true)
const error = ref<string | null>(null)

function toDateInput(v?: string | Date | null) {
  if (!v) return ''
  return new Date(v).toISOString().slice(0, 10)
}

async function loadOrder() {
  try {
    const order: Order = await getOrder(id)
    form.orderNumber = order.orderNumber
    form.createdDate = toDateInput(order.createdDate)
    form.shippedDate = toDateInput(order.shippedDate)
    form.deliveredDate = toDateInput(order.deliveredDate)
    form.completedDate = toDateInput(order.completedDate)
    form.status = order.status
    form.cancelBy = order.cancelBy ?? ''
    form.cancelReason = order.cancelReason ?? ''
    form.shippingFee = Number(order.shippingFee)
    form.platformFee = Number(order.platformFee)
    form.affiliateFee = Number(order.affiliateFee)

    if (order.customer) {
      customerForm.enabled = true
      customerForm.customerId = order.customer.customerId ?? ''
      customerForm.name = order.customer.name
      customerForm.phone = order.customer.phone ?? ''
      customerForm.address = order.customer.address ?? ''
      customerForm.country = order.customer.country ?? ''
      customerForm.province = order.customer.province ?? ''
      customerForm.city = order.customer.city ?? ''
      customerForm.district = order.customer.district ?? ''
      customerForm.zipcode = order.customer.zipcode ?? ''
    }

    if (order.shipping) {
      shippingForm.enabled = true
      shippingForm.name = order.shipping.name ?? ''
      shippingForm.serviceName = order.shipping.serviceName ?? ''
      shippingForm.trackingNumber = order.shipping.trackingNumber ?? ''
    }

    items.value = (order.items ?? []).map(i => ({
      skuId: i.skuId ?? null,
      productId: i.productId ?? null,
      sku: i.sku,
      mpSkuId: i.mpSkuId,
      productName: i.productName,
      productCategory: i.productCategory ?? '',
      qty: i.qty,
      price: Number(i.price),
      discount: Number(i.discount),
      hpp: Number(i.hpp),
    }))
    items.value.forEach((_, idx) => initSkuSearch(idx))
  } catch {
    error.value = 'Gagal memuat order'
  } finally {
    pageLoading.value = false
  }
}

// SKU search
const skuQuery = ref<string[]>([])
const skuResults = ref<SkuSearchResult[][]>([])
const skuOpen = ref<boolean[]>([])
let debounceTimers: (ReturnType<typeof setTimeout> | null)[] = []

function initSkuSearch(idx: number) {
  const item = items.value[idx]
  skuQuery.value[idx] = item ? (item.productName + (item.sku ? ` (${item.sku})` : '')) : ''
  skuResults.value[idx] = []
  skuOpen.value[idx] = false
}

async function onSkuInput(idx: number) {
  const q = skuQuery.value[idx] ?? ''
  if (debounceTimers[idx]) clearTimeout(debounceTimers[idx]!)
  if (q.length < 1) { skuOpen.value[idx] = false; return }
  debounceTimers[idx] = setTimeout(async () => {
    const results = await searchSkus(storeId.value, q)
    skuResults.value[idx] = results
    skuOpen.value[idx] = results.length > 0
  }, 280)
}

function selectSku(idx: number, result: SkuSearchResult) {
  const item = items.value[idx]
  if (!item) return
  item.skuId = result.skuId
  item.productId = result.productId
  item.sku = result.sku
  item.mpSkuId = result.mpSkuId ?? ''
  item.productName = result.productName
  item.productCategory = result.productCategory ?? ''
  item.price = result.price
  item.hpp = result.hpp
  skuQuery.value[idx] = result.productName + (result.sku ? ` (${result.sku})` : '')
  skuOpen.value[idx] = false
}

function addEmptyItem() {
  items.value.push({ skuId: null, productId: null, sku: '', mpSkuId: '', productName: '', productCategory: '', qty: 1, price: 0, discount: 0, hpp: 0 })
  initSkuSearch(items.value.length - 1)
}

function removeItem(idx: number) { items.value.splice(idx, 1) }

const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
const discount = computed(() => items.value.reduce((s, i) => s + i.discount * i.qty, 0))
const total = computed(() => subtotal.value - discount.value)
const totalHpp = computed(() => items.value.reduce((s, i) => s + i.hpp * i.qty, 0))
const grandTotal = computed(() => total.value + form.shippingFee - form.platformFee - form.affiliateFee)
const netTotal = computed(() => grandTotal.value - totalHpp.value)

function formatCurrency(v: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}

async function handleSubmit() {
  error.value = null
  if (!form.orderNumber.trim()) { error.value = 'Nomor order wajib diisi'; return }
  if (items.value.length === 0) { error.value = 'Minimal satu item'; return }
  if (items.value.some(i => !i.productName.trim())) { error.value = 'Nama produk item wajib diisi'; return }

  const payload = {
    orderNumber: form.orderNumber.trim(),
    createdDate: form.createdDate,
    shippedDate: form.shippedDate || null,
    completedDate: form.completedDate || null,
    deliveredDate: form.deliveredDate || null,
    status: form.status,
    cancelBy: form.cancelBy || null,
    cancelReason: form.cancelReason || null,
    shippingFee: form.shippingFee,
    platformFee: form.platformFee,
    affiliateFee: form.affiliateFee,
    items: items.value.map(i => ({
      skuId: i.skuId,
      productId: i.productId,
      sku: i.sku,
      mpSkuId: i.mpSkuId,
      productName: i.productName,
      productCategory: i.productCategory || null,
      qty: i.qty,
      price: i.price,
      discount: i.discount,
      hpp: i.hpp,
    } as OrderItemPayload)),
    customer: customerForm.enabled ? {
      customerId: customerForm.customerId || null,
      name: customerForm.name,
      phone: customerForm.phone || null,
      address: customerForm.address || null,
      country: customerForm.country || null,
      province: customerForm.province || null,
      city: customerForm.city || null,
      district: customerForm.district || null,
      zipcode: customerForm.zipcode || null,
    } : null,
    shipping: shippingForm.enabled ? {
      name: shippingForm.name || null,
      serviceName: shippingForm.serviceName || null,
      trackingNumber: shippingForm.trackingNumber || null,
    } : null,
  }

  try {
    await updateOrder(id, payload as never)
    router.push('/store/orders')
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Gagal memperbarui order'
  }
}

onMounted(() => {
  activeStoreStore.loadFromStorage()
  loadOrder()
})

function closeDropdown(idx: number) {
  setTimeout(() => { skuOpen.value[idx] = false }, 200)
}

const statusOptions = ['PENDING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED']
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-10">
    <div class="flex items-center gap-3">
      <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">Edit Order</h1>
        <p class="text-sm text-gray-500 font-mono">{{ form.orderNumber }}</p>
      </div>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-20">
      <svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>

    <template v-else>
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{{ error }}</div>

      <!-- Order Info -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h2 class="font-semibold text-gray-800">Informasi Order</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">No. Order <span class="text-red-500">*</span></label>
            <input v-model="form.orderNumber" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Tanggal Order <span class="text-red-500">*</span></label>
            <input v-model="form.createdDate" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Status</label>
            <select v-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Tanggal Kirim</label>
            <input v-model="form.shippedDate" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Tanggal Sampai</label>
            <input v-model="form.deliveredDate" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Tanggal Selesai</label>
            <input v-model="form.completedDate" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div v-if="form.status === 'CANCELLED'">
            <label class="block text-xs text-gray-500 mb-1">Dibatalkan Oleh</label>
            <select v-model="form.cancelBy" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-</option>
              <option value="SELLER">SELLER</option>
              <option value="USER">USER</option>
              <option value="SYSTEM">SYSTEM</option>
            </select>
          </div>
          <div v-if="form.status === 'CANCELLED'" class="sm:col-span-2">
            <label class="block text-xs text-gray-500 mb-1">Alasan Pembatalan</label>
            <input v-model="form.cancelReason" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-gray-800">Item Pesanan</h2>
          <button class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors" @click="addEmptyItem">+ Tambah Item</button>
        </div>
        <div v-if="items.length === 0" class="text-center py-8 text-gray-400 text-sm">Belum ada item</div>
        <div v-for="(item, idx) in items" :key="idx" class="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
          <div class="flex items-start gap-3">
            <div class="flex-1 relative">
              <label class="block text-xs text-gray-500 mb-1">Produk / SKU</label>
              <input
                v-model="skuQuery[idx]"
                type="text"
                placeholder="Cari produk atau SKU..."
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                @input="onSkuInput(idx)"
                @blur="closeDropdown(idx)"
              >
              <div v-if="skuOpen[idx] && skuResults[idx]?.length" class="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                <button
                  v-for="result in skuResults[idx]"
                  :key="result.skuId"
                  class="w-full text-left px-3 py-2.5 hover:bg-blue-50 text-sm border-b border-gray-50 last:border-0 transition-colors"
                  @mousedown.prevent="selectSku(idx, result)"
                >
                  <div class="font-medium text-gray-800">{{ result.productName }}</div>
                  <div class="text-xs text-gray-500 flex gap-2 mt-0.5">
                    <span v-if="result.sku">SKU: {{ result.sku }}</span>
                    <span v-if="result.productCategory">{{ result.productCategory }}</span>
                    <span class="text-blue-600">{{ formatCurrency(result.price) }}</span>
                  </div>
                </button>
              </div>
            </div>
            <button class="mt-6 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0" @click="removeItem(idx)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="!item.skuId" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Nama Produk <span class="text-red-500">*</span></label>
              <input v-model="item.productName" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Kategori</label>
              <input v-model="item.productCategory" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Qty</label>
              <input v-model.number="item.qty" type="number" min="1" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Harga</label>
              <input v-model.number="item.price" type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Diskon / unit</label>
              <input v-model.number="item.discount" type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">HPP / unit</label>
              <input v-model.number="item.hpp" type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          <div class="text-xs text-right text-gray-500">
            Subtotal: <span class="font-semibold text-gray-800">{{ formatCurrency(item.price * item.qty - item.discount * item.qty) }}</span>
          </div>
        </div>
      </div>

      <!-- Fees -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h2 class="font-semibold text-gray-800">Biaya Tambahan</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Ongkos Kirim</label>
            <input v-model.number="form.shippingFee" type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Biaya Platform</label>
            <input v-model.number="form.platformFee" type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Biaya Afiliasi</label>
            <input v-model.number="form.affiliateFee" type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <!-- Customer -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div class="flex items-center gap-3">
          <h2 class="font-semibold text-gray-800">Pelanggan</h2>
          <label class="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input v-model="customerForm.enabled" type="checkbox" class="rounded">Isi data pelanggan
          </label>
        </div>
        <div v-if="customerForm.enabled" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label class="block text-xs text-gray-500 mb-1">Customer ID</label><input v-model="customerForm.customerId" type="text" placeholder="ID pelanggan (opsional)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-xs text-gray-500 mb-1">Nama <span class="text-red-500">*</span></label><input v-model="customerForm.name" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-xs text-gray-500 mb-1">No. Telepon</label><input v-model="customerForm.phone" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div class="sm:col-span-2"><label class="block text-xs text-gray-500 mb-1">Alamat Detail</label><input v-model="customerForm.address" type="text" placeholder="Nama jalan, nomor rumah, dll" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-xs text-gray-500 mb-1">Provinsi</label><input v-model="customerForm.province" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-xs text-gray-500 mb-1">Kota</label><input v-model="customerForm.city" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-xs text-gray-500 mb-1">Kecamatan</label><input v-model="customerForm.district" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-xs text-gray-500 mb-1">Kode Pos</label><input v-model="customerForm.zipcode" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
        </div>
      </div>

      <!-- Shipping -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div class="flex items-center gap-3">
          <h2 class="font-semibold text-gray-800">Pengiriman</h2>
          <label class="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input v-model="shippingForm.enabled" type="checkbox" class="rounded">Isi data pengiriman
          </label>
        </div>
        <div v-if="shippingForm.enabled" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label class="block text-xs text-gray-500 mb-1">Kurir</label><input v-model="shippingForm.name" type="text" placeholder="JNE, TIKI, dll" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-xs text-gray-500 mb-1">Layanan</label><input v-model="shippingForm.serviceName" type="text" placeholder="REG, YES, dll" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-xs text-gray-500 mb-1">No. Resi</label><input v-model="shippingForm.trackingNumber" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 class="font-semibold text-gray-800 mb-3">Ringkasan</h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-600"><span>Subtotal</span><span>{{ formatCurrency(subtotal) }}</span></div>
          <div class="flex justify-between text-gray-600"><span>Diskon</span><span>-{{ formatCurrency(discount) }}</span></div>
          <div class="flex justify-between text-gray-600"><span>Total</span><span>{{ formatCurrency(total) }}</span></div>
          <div class="flex justify-between text-gray-600"><span>Ongkos Kirim</span><span>+{{ formatCurrency(form.shippingFee) }}</span></div>
          <div class="flex justify-between text-gray-600"><span>Biaya Platform</span><span>-{{ formatCurrency(form.platformFee) }}</span></div>
          <div class="flex justify-between text-gray-600"><span>Biaya Afiliasi</span><span>-{{ formatCurrency(form.affiliateFee) }}</span></div>
          <div class="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base"><span>Grand Total</span><span>{{ formatCurrency(grandTotal) }}</span></div>
          <div class="flex justify-between text-gray-500"><span>Total HPP</span><span>{{ formatCurrency(totalHpp) }}</span></div>
          <div class="flex justify-between font-semibold" :class="netTotal >= 0 ? 'text-green-700' : 'text-red-600'">
            <span>Net (Laba)</span><span>{{ formatCurrency(netTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-end gap-3">
        <button class="px-5 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" @click="router.back()">Batal</button>
        <button
          :disabled="loading"
          class="px-6 py-2.5 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-60 shadow-sm"
          @click="handleSubmit"
        >
          {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </template>
  </div>
</template>
