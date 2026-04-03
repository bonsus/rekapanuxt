
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

interface _GlobalComponents {
  ShopeeAdsImportModal: typeof import("../../components/ads/ShopeeAdsImportModal.vue")['default']
  TikTokAdsImportModal: typeof import("../../components/ads/TikTokAdsImportModal.vue")['default']
  FinanceDetailModal: typeof import("../../components/finance/FinanceDetailModal.vue")['default']
  FinanceFormModal: typeof import("../../components/finance/FinanceFormModal.vue")['default']
  FinanceImportModal: typeof import("../../components/finance/FinanceImportModal.vue")['default']
  Header: typeof import("../../components/layout/Header.vue")['default']
  Sidebar: typeof import("../../components/layout/Sidebar.vue")['default']
  OrderImportModal: typeof import("../../components/order/OrderImportModal.vue")['default']
  OrderStatusBadge: typeof import("../../components/order/OrderStatusBadge.vue")['default']
  OrderSummaryModal: typeof import("../../components/order/OrderSummaryModal.vue")['default']
  OrderTable: typeof import("../../components/order/OrderTable.vue")['default']
  HppImportModal: typeof import("../../components/product/HppImportModal.vue")['default']
  HppModal: typeof import("../../components/product/HppModal.vue")['default']
  ImportModal: typeof import("../../components/product/ImportModal.vue")['default']
  ProductForm: typeof import("../../components/product/ProductForm.vue")['default']
  ProductTable: typeof import("../../components/product/ProductTable.vue")['default']
  StoreForm: typeof import("../../components/store/StoreForm.vue")['default']
  StoreTable: typeof import("../../components/store/StoreTable.vue")['default']
  AppBadge: typeof import("../../components/ui/AppBadge.vue")['default']
  AppButton: typeof import("../../components/ui/AppButton.vue")['default']
  AppInput: typeof import("../../components/ui/AppInput.vue")['default']
  AppModal: typeof import("../../components/ui/AppModal.vue")['default']
  AppPagination: typeof import("../../components/ui/AppPagination.vue")['default']
  UserForm: typeof import("../../components/user/UserForm.vue")['default']
  UserTable: typeof import("../../components/user/UserTable.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyShopeeAdsImportModal: LazyComponent<typeof import("../../components/ads/ShopeeAdsImportModal.vue")['default']>
  LazyTikTokAdsImportModal: LazyComponent<typeof import("../../components/ads/TikTokAdsImportModal.vue")['default']>
  LazyFinanceDetailModal: LazyComponent<typeof import("../../components/finance/FinanceDetailModal.vue")['default']>
  LazyFinanceFormModal: LazyComponent<typeof import("../../components/finance/FinanceFormModal.vue")['default']>
  LazyFinanceImportModal: LazyComponent<typeof import("../../components/finance/FinanceImportModal.vue")['default']>
  LazyHeader: LazyComponent<typeof import("../../components/layout/Header.vue")['default']>
  LazySidebar: LazyComponent<typeof import("../../components/layout/Sidebar.vue")['default']>
  LazyOrderImportModal: LazyComponent<typeof import("../../components/order/OrderImportModal.vue")['default']>
  LazyOrderStatusBadge: LazyComponent<typeof import("../../components/order/OrderStatusBadge.vue")['default']>
  LazyOrderSummaryModal: LazyComponent<typeof import("../../components/order/OrderSummaryModal.vue")['default']>
  LazyOrderTable: LazyComponent<typeof import("../../components/order/OrderTable.vue")['default']>
  LazyHppImportModal: LazyComponent<typeof import("../../components/product/HppImportModal.vue")['default']>
  LazyHppModal: LazyComponent<typeof import("../../components/product/HppModal.vue")['default']>
  LazyImportModal: LazyComponent<typeof import("../../components/product/ImportModal.vue")['default']>
  LazyProductForm: LazyComponent<typeof import("../../components/product/ProductForm.vue")['default']>
  LazyProductTable: LazyComponent<typeof import("../../components/product/ProductTable.vue")['default']>
  LazyStoreForm: LazyComponent<typeof import("../../components/store/StoreForm.vue")['default']>
  LazyStoreTable: LazyComponent<typeof import("../../components/store/StoreTable.vue")['default']>
  LazyAppBadge: LazyComponent<typeof import("../../components/ui/AppBadge.vue")['default']>
  LazyAppButton: LazyComponent<typeof import("../../components/ui/AppButton.vue")['default']>
  LazyAppInput: LazyComponent<typeof import("../../components/ui/AppInput.vue")['default']>
  LazyAppModal: LazyComponent<typeof import("../../components/ui/AppModal.vue")['default']>
  LazyAppPagination: LazyComponent<typeof import("../../components/ui/AppPagination.vue")['default']>
  LazyUserForm: LazyComponent<typeof import("../../components/user/UserForm.vue")['default']>
  LazyUserTable: LazyComponent<typeof import("../../components/user/UserTable.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
