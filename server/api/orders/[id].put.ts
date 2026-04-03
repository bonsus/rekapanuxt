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

const UpdateOrderSchema = z.object({
  orderNumber: z.string().min(1).optional(),
  createdDate: z.string().min(1).optional(),
  shippedDate: z.string().nullable().optional(),
  deliveredDate: z.string().nullable().optional(),
  completedDate: z.string().nullable().optional(),
  status: z.enum(['PENDING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED']).optional(),
  cancelBy: z.enum(['SELLER', 'USER', 'SYSTEM']).nullable().optional(),
  cancelReason: z.string().nullable().optional(),
  shippingFee: z.number().min(0).optional(),
  platformFee: z.number().min(0).optional(),
  affiliateFee: z.number().min(0).optional(),
  items: z.array(ItemSchema).min(1).optional(),
  customer: z.object({
    customerId: z.string().nullable().optional(),
    name: z.string().min(1),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    zipcode: z.string().nullable().optional(),
  }).nullable().optional(),
  shipping: z.object({
    name: z.string().nullable().optional(),
    serviceName: z.string().nullable().optional(),
    trackingNumber: z.string().nullable().optional(),
  }).nullable().optional(),
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
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })

  const body = await readBody(event)
  const parsed = UpdateOrderSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.errors[0]?.message ?? 'Validation error' })
  }

  const existing = await prisma.order.findFirst({
    where: { id },
    include: { store: { select: { userId: true } } },
  })
  if (!existing) throw createError({ statusCode: 404, message: 'Order not found' })
  if (existing.store.userId !== payload.sub) throw createError({ statusCode: 403, message: 'Forbidden' })

  const d = parsed.data
  const shippingFee = d.shippingFee ?? Number(existing.shippingFee)
  const platformFee = d.platformFee ?? Number(existing.platformFee)
  const affiliateFee = d.affiliateFee ?? Number(existing.affiliateFee)

  let financials: Record<string, number> = {}
  let itemOps: object = {}

  if (d.items) {
    const { mapped, subtotal, discount, totalHpp } = calcItems(d.items)
    const total = subtotal - discount
    const grandTotal = total + shippingFee - platformFee - affiliateFee
    const netTotal = grandTotal - totalHpp
    financials = { subtotal, discount, total, grandTotal, totalHpp, netTotal }
    itemOps = {
      items: {
        deleteMany: { orderId: id },
        create: mapped,
      },
    }
  } else if (d.shippingFee !== undefined || d.platformFee !== undefined || d.affiliateFee !== undefined) {
    const subtotal = Number(existing.subtotal)
    const discount = Number(existing.discount)
    const total = Number(existing.total)
    const totalHpp = Number(existing.totalHpp)
    const grandTotal = total + shippingFee - platformFee - affiliateFee
    const netTotal = grandTotal - totalHpp
    financials = { grandTotal, netTotal, shippingFee, platformFee, affiliateFee }
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(d.orderNumber !== undefined ? { orderNumber: d.orderNumber } : {}),
      ...(d.createdDate !== undefined ? { createdDate: new Date(d.createdDate) } : {}),
      ...(d.shippedDate !== undefined ? { shippedDate: d.shippedDate ? new Date(d.shippedDate) : null } : {}),
      ...(d.deliveredDate !== undefined ? { deliveredDate: d.deliveredDate ? new Date(d.deliveredDate) : null } : {}),
      ...(d.completedDate !== undefined ? { completedDate: d.completedDate ? new Date(d.completedDate) : null } : {}),
      ...(d.status !== undefined ? { status: d.status as OrderStatus } : {}),
      ...(d.cancelBy !== undefined ? { cancelBy: d.cancelBy ?? null } : {}),
      ...(d.cancelReason !== undefined ? { cancelReason: d.cancelReason ?? null } : {}),
      ...financials,
      ...itemOps,
      ...(d.customer !== undefined ? (d.customer
        ? { customer: { upsert: { create: d.customer, update: d.customer } } }
        : { customer: { delete: true } }
      ) : {}),
      ...(d.shipping !== undefined ? (d.shipping
        ? { shipping: { upsert: { create: d.shipping, update: d.shipping } } }
        : { shipping: { delete: true } }
      ) : {}),
    },
    include: { items: true, customer: true, shipping: true },
  })

  return { success: true, message: 'Order updated', data: order }
})
