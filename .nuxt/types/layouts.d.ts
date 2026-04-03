import type { ComputedRef, MaybeRef } from 'vue'

type ComponentProps<T> = T extends new(...args: any) => { $props: infer P } ? NonNullable<P>
  : T extends (props: infer P, ...args: any) => any ? P
  : {}

declare module 'nuxt/app' {
  interface NuxtLayouts {
    auth: ComponentProps<typeof import("/Users/macbookpro/Documents/1.Saas/REKAPA/rekapnuxt/layouts/auth.vue").default>,
    dashboard: ComponentProps<typeof import("/Users/macbookpro/Documents/1.Saas/REKAPA/rekapnuxt/layouts/dashboard.vue").default>,
    store: ComponentProps<typeof import("/Users/macbookpro/Documents/1.Saas/REKAPA/rekapnuxt/layouts/store.vue").default>,
}
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}