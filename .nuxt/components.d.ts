
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const ShopeeAdsImportModal: typeof import("../components/ads/ShopeeAdsImportModal.vue")['default']
export const TikTokAdsImportModal: typeof import("../components/ads/TikTokAdsImportModal.vue")['default']
export const FinanceDetailModal: typeof import("../components/finance/FinanceDetailModal.vue")['default']
export const FinanceFormModal: typeof import("../components/finance/FinanceFormModal.vue")['default']
export const FinanceImportModal: typeof import("../components/finance/FinanceImportModal.vue")['default']
export const Header: typeof import("../components/layout/Header.vue")['default']
export const Sidebar: typeof import("../components/layout/Sidebar.vue")['default']
export const OrderImportModal: typeof import("../components/order/OrderImportModal.vue")['default']
export const OrderStatusBadge: typeof import("../components/order/OrderStatusBadge.vue")['default']
export const OrderSummaryModal: typeof import("../components/order/OrderSummaryModal.vue")['default']
export const OrderTable: typeof import("../components/order/OrderTable.vue")['default']
export const HppImportModal: typeof import("../components/product/HppImportModal.vue")['default']
export const HppModal: typeof import("../components/product/HppModal.vue")['default']
export const ImportModal: typeof import("../components/product/ImportModal.vue")['default']
export const ProductForm: typeof import("../components/product/ProductForm.vue")['default']
export const ProductTable: typeof import("../components/product/ProductTable.vue")['default']
export const StoreForm: typeof import("../components/store/StoreForm.vue")['default']
export const StoreTable: typeof import("../components/store/StoreTable.vue")['default']
export const AppBadge: typeof import("../components/ui/AppBadge.vue")['default']
export const AppButton: typeof import("../components/ui/AppButton.vue")['default']
export const AppInput: typeof import("../components/ui/AppInput.vue")['default']
export const AppModal: typeof import("../components/ui/AppModal.vue")['default']
export const AppPagination: typeof import("../components/ui/AppPagination.vue")['default']
export const UserForm: typeof import("../components/user/UserForm.vue")['default']
export const UserTable: typeof import("../components/user/UserTable.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyShopeeAdsImportModal: LazyComponent<typeof import("../components/ads/ShopeeAdsImportModal.vue")['default']>
export const LazyTikTokAdsImportModal: LazyComponent<typeof import("../components/ads/TikTokAdsImportModal.vue")['default']>
export const LazyFinanceDetailModal: LazyComponent<typeof import("../components/finance/FinanceDetailModal.vue")['default']>
export const LazyFinanceFormModal: LazyComponent<typeof import("../components/finance/FinanceFormModal.vue")['default']>
export const LazyFinanceImportModal: LazyComponent<typeof import("../components/finance/FinanceImportModal.vue")['default']>
export const LazyHeader: LazyComponent<typeof import("../components/layout/Header.vue")['default']>
export const LazySidebar: LazyComponent<typeof import("../components/layout/Sidebar.vue")['default']>
export const LazyOrderImportModal: LazyComponent<typeof import("../components/order/OrderImportModal.vue")['default']>
export const LazyOrderStatusBadge: LazyComponent<typeof import("../components/order/OrderStatusBadge.vue")['default']>
export const LazyOrderSummaryModal: LazyComponent<typeof import("../components/order/OrderSummaryModal.vue")['default']>
export const LazyOrderTable: LazyComponent<typeof import("../components/order/OrderTable.vue")['default']>
export const LazyHppImportModal: LazyComponent<typeof import("../components/product/HppImportModal.vue")['default']>
export const LazyHppModal: LazyComponent<typeof import("../components/product/HppModal.vue")['default']>
export const LazyImportModal: LazyComponent<typeof import("../components/product/ImportModal.vue")['default']>
export const LazyProductForm: LazyComponent<typeof import("../components/product/ProductForm.vue")['default']>
export const LazyProductTable: LazyComponent<typeof import("../components/product/ProductTable.vue")['default']>
export const LazyStoreForm: LazyComponent<typeof import("../components/store/StoreForm.vue")['default']>
export const LazyStoreTable: LazyComponent<typeof import("../components/store/StoreTable.vue")['default']>
export const LazyAppBadge: LazyComponent<typeof import("../components/ui/AppBadge.vue")['default']>
export const LazyAppButton: LazyComponent<typeof import("../components/ui/AppButton.vue")['default']>
export const LazyAppInput: LazyComponent<typeof import("../components/ui/AppInput.vue")['default']>
export const LazyAppModal: LazyComponent<typeof import("../components/ui/AppModal.vue")['default']>
export const LazyAppPagination: LazyComponent<typeof import("../components/ui/AppPagination.vue")['default']>
export const LazyUserForm: LazyComponent<typeof import("../components/user/UserForm.vue")['default']>
export const LazyUserTable: LazyComponent<typeof import("../components/user/UserTable.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
