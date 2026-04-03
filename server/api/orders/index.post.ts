import { readBody, createError } from 'h3'
import { z } from 'zod'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import type { OrderStatus } from '@prisma/client'

const ItemSchema = z.object({
  skuId: z.string().nullable().optional(),
  productId: z.string().nullable().optional(),
  sku: z.string().default(''),
  mpSkuId: z.string().default(''),
  productName: z.string().min(1),
  productCategory: z.string().nullable().optional(),
  qty: z.number().int().min(1),
  price: z.number().min(0),
  discount: z.number().min(0).default(0),
  hpp: z.number().min(0).default(0),
})

const CustomerSchema = z.object({
  customerId: z.string().nullable().optional(),
  name: z.string().min(1),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  zipcode: z.string().nullable().optional(),
}).nullable().optional()

const ShippingSchema = z.object({
  name: z.string().nullable().optional(),
  serviceName: z.string().nullable().optional(),
  trackingNumber: z.string().nullable().optional(),
}).nullable().optional()

const CreateOrderSchema = z.object({
  storeId: z.string().min(1),
  orderNumber: z.string().min(1),
  createdDate: z.string().min(1),
  shippedDate: z.string().nullable().optional(),
  deliveredDate: z.string().nullable().optional(),
  completedDate: z.string().nullable().optional(),
  status: z.enum(['PENDING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED']).default('PENDING'),
  cancelBy: z.enum(['SELLER', 'USER', 'SYSTEM']).nullable().optional(),
  cancelReason: z.string().nullable().optional(),
  shippingFee: z.number().min(0).default(0),
  platformFee: z.number().min(0).default(0),
  affiliateFee: z.number().min(0).default(0),
  items: z.array(ItemSchema).min(1, 'At least one item required'),
  customer: CustomerSchema,
  shipping: ShippingSchema,
})

function calcItems(items: z.infer<typeof ItemSchema>[]) {
  let subtotal = 0, discount = 0, totalHpp = 0
  const mapped = items.map(i => {
    const lineTotal = i.price * i.qty - i.discount * i.qty
    const lineHpp = i.hpp * i.qty
    subtotal += i.price * i.qty
    discount += i.discount * i.qty
    totalHpp += lineHpp
    return {
      skuId: i.skuId ?? null,
      productId: i.productId ?? null,
      sku: i.sku,
      mpSkuId: i.mpSkuId,
      productName: i.productName,
      productCategory: i.productCategory ?? null,
      qty: i.qty,
      price: i.price,
      discount: i.discount,
      total: lineTotal,
      hpp: i.hpp,
      hppTotal: lineHpp,
    }
  })
  return { mapped, subtotal, discount, totalHpp }
}

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const body = await readBody(event)
  const parsed = CreateOrderSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.errors[0]?.message ?? 'Validation error' })
  }

  const d = parsed.data
  const store = await prisma.store.findFirst({ where: { id: d.storeId, userId: payload.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Forbidden' })

  const { mapped, subtotal, discount, totalHpp } = calcItems(d.items)
  const total = subtotal - discount
  const grandTotal = total + d.shippingFee - d.platformFee - d.affiliateFee
  const netTotal = grandTotal - totalHpp

  const order = await prisma.order.create({
    data: {
      orderNumber: d.orderNumber,
      storeId: d.storeId,
      createdDate: new Date(d.createdDate),
      shippedDate: d.shippedDate ? new Date(d.shippedDate) : null,
      // @ts-ignore: deliveredDate added in latest migration, stale TS cache
      deliveredDate: d.deliveredDate ? new Date(d.deliveredDate) : null,
      completedDate: d.completedDate ? new Date(d.completedDate) : null,
      status: d.status as OrderStatus,
      cancelBy: d.cancelBy ?? null,
      cancelReason: d.cancelReason ?? null,
      subtotal,
      discount,
      total,
      shippingFee: d.shippingFee,
      platformFee: d.platformFee,
      affiliateFee: d.affiliateFee,
      grandTotal,
      totalHpp,
      netTotal,
      items: { create: mapped },
      ...(d.customer ? { customer: { create: d.customer } } : {}),
      ...(d.shipping ? { shipping: { create: d.shipping } } : {}),
    },
    include: { items: true, customer: true, shipping: true },
  })

  return { success: true, message: 'Order created', data: order }
})
