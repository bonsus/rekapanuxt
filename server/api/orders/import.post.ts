import { readMultipartFormData, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import * as XLSX from 'xlsx'
import type { OrderStatus, CancelBy } from '@prisma/client'

// ── Column indexes (0-based) ───────────────────────────────────────────────
const C = {
  ORDER_ID:          0,
  STATUS:            1,
  SKU_ID:            5,   // Platform SKU ID → mpSkuId
  SELLER_SKU:        6,
  PRODUCT_NAME:      7,
  VARIATION:         8,
  QTY:               9,
  PRICE:             11,  // SKU Unit Original Price
  SELLER_DISCOUNT:   14,  // SKU Seller Discount
  SHIPPING_FEE:      18,  // Shipping Fee Seller Discount → ongkir
  CREATED_TIME:      29,
  SHIPPED_TIME:      32,
  DELIVERED_TIME:    33,
  CANCELLED_TIME:    34,
  CANCEL_BY:         35,
  CANCEL_REASON:     36,
  TRACKING_ID:       39,
  DELIVERY_OPTION:   40,
  SHIPPING_PROVIDER: 41,
  BUYER_USERNAME:    43,
  RECIPIENT:         44,
  PHONE:             45,
  ZIPCODE:           46,
  COUNTRY:           47,
  PROVINCE:          48,
  CITY:              49,
  DISTRICT:          50,
  ADDRESS:           52,
  PRODUCT_CATEGORY:  56,
}

// TikTok date format: "DD/MM/YYYY HH:MM:SS"
function parseDate(s: unknown): Date | null {
  if (!s) return null
  const str = String(s).trim()
  if (!str) return null
  const [datePart, timePart = '00:00:00'] = str.split(' ')
  const [d, m, y] = datePart.split('/')
  if (!d || !m || !y) return null
  return new Date(`${y}-${m}-${d}T${timePart}`)
}

const STATUS_MAP: Record<string, OrderStatus> = {
  'Selesai':            'COMPLETED',
  'Completed':          'COMPLETED',
  'Dibatalkan':         'CANCELLED',
  'Cancelled':          'CANCELLED',
  'Dalam Pengiriman':   'SHIPPED',
  'In Transit':         'SHIPPED',
  'Siap Dikirim':       'PENDING',
  'Ready to Ship':      'PENDING',
  'Menunggu Pembayaran': 'PENDING',
  'Unpaid':             'PENDING',
  'Diproses':           'PENDING',
  'Processing':         'PENDING',
}

const CANCEL_BY_MAP: Record<string, CancelBy> = {
  Seller: 'SELLER',
  User:   'USER',
  System: 'SYSTEM',
}

function str(row: unknown[], col: number): string {
  return String(row[col] ?? '').trim()
}
function num(row: unknown[], col: number): number {
  return Number(row[col]) || 0
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const formData = await readMultipartFormData(event)
  const storeId = formData?.find(f => f.name === 'storeId')?.data.toString()
  const file    = formData?.find(f => f.name === 'file')

  if (!storeId || !file?.data) {
    throw createError({ statusCode: 400, message: 'storeId dan file diperlukan' })
  }

  // Verify store ownership
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Toko tidak ditemukan' })

  // Parse Excel
  const wb = XLSX.read(file.data, { type: 'buffer' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const allRows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' }) as unknown[][]

  // Row 0 = header, Row 1 = descriptions → data starts row 2
  const dataRows = allRows.slice(2).filter(r => str(r, C.ORDER_ID))

  // Group by Order ID → one order may have multiple SKU rows
  const orderMap = new Map<string, unknown[][]>()
  for (const row of dataRows) {
    const orderId = str(row, C.ORDER_ID)
    if (!orderMap.has(orderId)) orderMap.set(orderId, [])
    orderMap.get(orderId)!.push(row)
  }

  // Pre-load all SKUs for this store (for HPP lookup)
  const allSkus = await prisma.sku.findMany({
    where: { storeId },
    include: { product: { select: { id: true } } },
  })
  const skuByMpId = new Map(allSkus.map(s => [s.mpSkuId, s]))

  let imported = 0
  let skipped  = 0
  const errors: string[] = []

  for (const [orderId, rows] of orderMap) {
    const first = rows[0]

    try {
      // Skip if already exists
      const existing = await prisma.order.findUnique({
        where: { orderNumber_storeId: { orderNumber: orderId, storeId } },
      })
      if (existing) { skipped++; continue }

      const rawStatus = str(first, C.STATUS)
      const status: OrderStatus = STATUS_MAP[rawStatus] ?? 'PENDING'

      const cancelByRaw = str(first, C.CANCEL_BY)
      const cancelBy = CANCEL_BY_MAP[cancelByRaw] ?? null

      const createdDate   = parseDate(str(first, C.CREATED_TIME)) ?? new Date()
      const shippedDate   = parseDate(str(first, C.SHIPPED_TIME))
      const deliveredDate = parseDate(str(first, C.DELIVERED_TIME))
      const completedDate = status === 'COMPLETED' ? (deliveredDate ?? shippedDate) : null

      const shippingFee = num(first, C.SHIPPING_FEE)

      // Build items and accumulate totals
      let subtotal  = 0
      let discount  = 0
      let totalHpp  = 0

      const items = rows.map(row => {
        const mpSkuId      = str(row, C.SKU_ID)
        const qty          = num(row, C.QTY) || 1
        const price        = num(row, C.PRICE)
        const itemDiscount = num(row, C.SELLER_DISCOUNT)
        const itemTotal    = price * qty - itemDiscount

        subtotal += price * qty
        discount += itemDiscount

        const skuRecord = skuByMpId.get(mpSkuId)
        const hpp        = skuRecord ? Number(skuRecord.hpp) : 0
        const hppTotal   = hpp * qty
        totalHpp += hppTotal

        return {
          skuId:           skuRecord?.id       ?? null,
          productId:       skuRecord?.productId ?? null,
          sku:             str(row, C.SELLER_SKU),
          mpSkuId,
          productName:     str(row, C.PRODUCT_NAME),
          productCategory: str(row, C.PRODUCT_CATEGORY) || null,
          qty,
          price,
          discount:        itemDiscount,
          total:           itemTotal,
          hpp,
          hppTotal,
        }
      })

      const total      = subtotal - discount
      const grandTotal = total + shippingFee
      const netTotal   = grandTotal - totalHpp

      const recipient      = str(first, C.RECIPIENT)
      const buyerUsername  = str(first, C.BUYER_USERNAME)
      const hasCustomer    = !!(recipient || buyerUsername)
      const trackingId     = str(first, C.TRACKING_ID)
      const shippingProvider = str(first, C.SHIPPING_PROVIDER)
      const hasShipping    = !!(trackingId || shippingProvider)

      // @ts-ignore: stale TS cache for deliveredDate/completedDate and XOR create type
      await prisma.order.create({
        data: {
          orderNumber:  orderId,
          storeId,
          createdDate,
          shippedDate,
          deliveredDate,
          completedDate,
          status,
          cancelBy,
          cancelReason: str(first, C.CANCEL_REASON) || null,
          subtotal,
          discount,
          total,
          shippingFee,
          platformFee:  0,
          affiliateFee: 0,
          grandTotal,
          totalHpp,
          netTotal,
          items: { create: items },
          ...(hasCustomer ? {
            customer: {
              create: {
                customerId: buyerUsername || null,
                name:       recipient || buyerUsername || 'Unknown',
                phone:      str(first, C.PHONE)    || null,
                address:    str(first, C.ADDRESS)  || null,
                country:    str(first, C.COUNTRY)  || null,
                province:   str(first, C.PROVINCE) || null,
                city:       str(first, C.CITY)     || null,
                district:   str(first, C.DISTRICT) || null,
                zipcode:    str(first, C.ZIPCODE)  || null,
              },
            },
          } : {}),
          ...(hasShipping ? {
            shipping: {
              create: {
                trackingNumber: trackingId     || null,
                serviceName:    str(first, C.DELIVERY_OPTION)   || null,
                name:           shippingProvider || null,
              },
            },
          } : {}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      })

      imported++
    } catch (e: unknown) {
      errors.push(`Order ${orderId}: ${(e as Error).message ?? 'Unknown error'}`)
    }
  }

  return {
    success: true,
    imported,
    skipped,
    total: orderMap.size,
    errors,
  }
})
