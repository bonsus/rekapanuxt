// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  status: 'ACTIVE' | 'INACTIVE'
  expiredAt: string | null
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedApiResponse<T> {
  success: boolean
  data: T[]
  pagination: PaginationMeta
}

// ─── User Management ─────────────────────────────────────────────────────────

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'USER'
  status?: 'ACTIVE' | 'INACTIVE'
  expiredAt?: string | null
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  password?: string
  role?: 'ADMIN' | 'USER'
  status?: 'ACTIVE' | 'INACTIVE'
  expiredAt?: string | null
}

export interface UpdatePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UserFilters {
  search?: string
  role?: 'ADMIN' | 'USER' | ''
  status?: 'ACTIVE' | 'INACTIVE' | ''
  page?: number
  limit?: number
}

// ─── Store ────────────────────────────────────────────────────────────────────

export type StoreType = 'SHOPEE' | 'TIKTOK'

export interface Store {
  id: string
  name: string
  type: StoreType
  description: string | null
  link: string | null
  userId: string
  user?: { id: string; name: string; email: string }
  createdAt: string
  updatedAt: string
}

export interface CreateStorePayload {
  name: string
  type: StoreType
  description?: string | null
  link?: string | null
}

export interface UpdateStorePayload {
  name?: string
  type?: StoreType
  description?: string | null
  link?: string | null
}

export interface StoreFilters {
  search?: string
  type?: StoreType | ''
  page?: number
  limit?: number
}

// ─── Product / SKU ────────────────────────────────────────────────────────────

export type ProductStatus = 'ACTIVE' | 'INACTIVE'

export interface Sku {
  id: string
  mpSkuId: string
  sku: string
  price: string   // Prisma Decimal → string in JSON
  hpp: string
  variants: Record<string, string>
  productId: string
  storeId: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  mpProductId: string
  name: string
  description: string | null
  category: string | null
  status: ProductStatus
  variantTypes: string[]
  storeId: string
  skus?: Sku[]
  _count?: { skus: number }
  createdAt: string
  updatedAt: string
}

export interface SkuPayload {
  id?: string          // present when editing an existing SKU
  mpSkuId?: string
  sku?: string
  price: number
  hpp: number
  variants: Record<string, string>
}

export interface CreateProductPayload {
  storeId: string
  mpProductId: string
  name: string
  description?: string | null
  category?: string | null
  status?: ProductStatus
  variantTypes?: string[]
  skus: SkuPayload[]
}

export interface UpdateProductPayload {
  mpProductId?: string
  name?: string
  description?: string | null
  category?: string | null
  status?: ProductStatus
  variantTypes?: string[]
  skus?: SkuPayload[]
}

export interface ProductFilters {
  storeId: string
  search?: string
  status?: ProductStatus | ''
  page?: number
  limit?: number
}

// ── Order types ───────────────────────────────────────────────────────────────

export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'RETURNED'
export type CancelBy = 'SELLER' | 'USER' | 'SYSTEM'

export interface OrderItem {
  id: string
  orderId: string
  skuId: string | null
  productId: string | null
  sku: string
  mpSkuId: string
  productName: string
  productCategory: string | null
  qty: number
  price: string
  discount: string
  total: string
  hpp: string
  hppTotal: string
  createdAt: string
  updatedAt: string
}

export interface OrderCustomer {
  id: string
  orderId: string
  customerId: string | null
  name: string
  phone: string | null
  address: string | null
  country: string | null
  province: string | null
  city: string | null
  district: string | null
  zipcode: string | null
}

export interface OrderShipping {
  id: string
  orderId: string
  name: string | null
  serviceName: string | null
  trackingNumber: string | null
}

export interface Order {
  id: string
  orderNumber: string
  storeId: string
  createdDate: string
  shippedDate: string | null
  deliveredDate: string | null
  completedDate: string | null
  status: OrderStatus
  cancelBy: CancelBy | null
  cancelReason: string | null
  subtotal: string
  discount: string
  total: string
  shippingFee: string
  platformFee: string
  affiliateFee: string
  grandTotal: string
  totalHpp: string
  netTotal: string
  items?: OrderItem[]
  customer?: OrderCustomer | null
  shipping?: OrderShipping | null
  _count?: { items: number }
  createdAt: string
  updatedAt: string
}

export interface OrderItemPayload {
  skuId?: string | null
  productId?: string | null
  sku?: string
  mpSkuId?: string
  productName: string
  productCategory?: string | null
  qty: number
  price: number
  discount?: number
  hpp?: number
}

export interface OrderCustomerPayload {
  customerId?: string | null
  name: string
  phone?: string | null
  address?: string | null
  country?: string | null
  province?: string | null
  city?: string | null
  district?: string | null
  zipcode?: string | null
}

export interface OrderShippingPayload {
  name?: string | null
  serviceName?: string | null
  trackingNumber?: string | null
}

export interface CreateOrderPayload {
  storeId: string
  orderNumber: string
  createdDate: string
  shippedDate?: string | null
  deliveredDate?: string | null
  completedDate?: string | null
  status?: OrderStatus
  cancelBy?: CancelBy | null
  cancelReason?: string | null
  shippingFee?: number
  platformFee?: number
  affiliateFee?: number
  items: OrderItemPayload[]
  customer?: OrderCustomerPayload | null
  shipping?: OrderShippingPayload | null
}

export interface UpdateOrderPayload {
  orderNumber?: string
  createdDate?: string
  shippedDate?: string | null
  deliveredDate?: string | null
  completedDate?: string | null
  status?: OrderStatus
  cancelBy?: CancelBy | null
  cancelReason?: string | null
  shippingFee?: number
  platformFee?: number
  affiliateFee?: number
  items?: OrderItemPayload[]
  customer?: OrderCustomerPayload | null
  shipping?: OrderShippingPayload | null
}

export interface OrderFilters {
  storeId: string
  search?: string
  status?: OrderStatus | ''
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

// SKU search result for order form item picker
export interface SkuSearchResult {
  skuId: string
  productId: string
  sku: string
  mpSkuId: string
  productName: string
  productCategory: string | null
  price: number
  hpp: number
  variants: Record<string, string>
}

// ─── Finance ──────────────────────────────────────────────────────────────────

export type TransactionType = 'ORDER' | 'ADS' | 'LOGISTIC' | 'WITHDRAW'
export type CashFlow        = 'IN' | 'OUT'

export interface FinanceTransaction {
  id:          string
  storeId:     string
  date:        string
  type:        TransactionType
  cashFlow:    CashFlow
  source:      string | null
  referenceId: string | null
  amount:      string
  platformFee: string
  affiliateFee: string
  shippingFee: string
  netAmount:   string
  note:        string | null
  createdAt:   string
  updatedAt:   string
}

export interface CreateFinancePayload {
  storeId:      string
  date:         string
  type:         TransactionType
  cashFlow:     CashFlow
  source?:      string | null
  referenceId?: string | null
  amount:       number
  platformFee?: number
  affiliateFee?: number
  shippingFee?: number
  note?:        string | null
}

export interface UpdateFinancePayload {
  date?:        string
  type?:        TransactionType
  cashFlow?:    CashFlow
  source?:      string | null
  referenceId?: string | null
  amount?:      number
  platformFee?: number
  affiliateFee?: number
  shippingFee?: number
  note?:        string | null
}

export interface FinanceSummary {
  totalBalance:       number
  totalIn:            number
  totalOut:           number
  totalOrder:         number
  totalAds:           number
  totalLogistic:      number
  totalWithdraw:      number
  txCount:            number
  totalPlatformFee:   number
  totalAffiliateFee:  number
  totalShippingFee:   number
  pendingOrderCount:  number
  pendingOrderAmount: number
  shippedOrderCount:  number
  shippedOrderAmount: number
}

export interface FinanceListQuery {
  storeId:    string
  type?:      TransactionType | ''
  cashFlow?:  CashFlow | ''
  source?:    string
  dateFrom?:  string
  dateTo?:    string
  search?:    string
  page?:      number
  limit?:     number
}

// ── TikTok Ads ────────────────────────────────────────────────────────────────

export interface TikTokAd {
  id:           string
  storeId:      string
  date:         string
  accountId:    string
  accountName:  string
  campaignId:   string
  campaignName: string
  adGroupId:    string
  adGroupName:  string
  cost:         string | number
  impressions:  number
  clicks:       number
  conversions:  number
  grossRevenue: string | number
  createdAt:    string
  updatedAt:    string
}

export interface TikTokAdSummary {
  totalCost:            number
  totalImpressions:     number
  totalClicks:          number
  totalConversions:     number
  totalGrossRevenue:    number
  roas:                 number
  avgCtr:               number
  avgCpc:               number
  avgCostPerConversion: number
  recordCount:          number
}

export interface TikTokAdListQuery {
  storeId:     string
  dateFrom?:   string
  dateTo?:     string
  campaignId?: string
  search?:     string
  page?:       number
  limit?:      number
}

export interface TikTokAdGroupRow {
  campaignId:        string
  campaignName:      string
  adGroupId:         string | null
  adGroupName:       string | null
  cost:              number
  impressions:       number
  clicks:            number
  conversions:       number
  grossRevenue:      number
  ctr:               number
  cvr:               number
  cpc:               number
  roas:              number
  costPerConversion: number
}

// ─── Shopee Ads ───────────────────────────────────────────────────────────────

export interface ShopeeAd {
  id:          string
  storeId:     string
  date:        string
  adName:      string
  adType:      string
  productCode: string
  biddingMode: string
  adPlacement: string
  cost:        string | number
  impressions: number
  clicks:      number
  conversions: number
  grossRevenue: string | number
  createdAt:   string
  updatedAt:   string
}

export interface ShopeeAdSummary {
  totalCost:            number
  totalImpressions:     number
  totalClicks:          number
  totalConversions:     number
  totalGrossRevenue:    number
  roas:                 number
  avgCtr:               number
  avgCpc:               number
  avgCostPerConversion: number
  recordCount:          number
}

export interface ShopeeAdGroupRow {
  key:               string
  adName:            string
  adType:            string
  productCode:       string
  biddingMode:       string
  adPlacement:       string
  cost:              number
  impressions:       number
  clicks:            number
  conversions:       number
  grossRevenue:      number
  ctr:               number
  cvr:               number
  cpc:               number
  roas:              number
  costPerConversion: number
}

export interface ShopeeAdListQuery {
  storeId:    string
  dateFrom?:  string
  dateTo?:    string
  adType?:    string
  search?:    string
  page?:      number
  limit?:     number
}
