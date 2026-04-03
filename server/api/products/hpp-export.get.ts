import { getQuery, createError, setResponseHeader, send } from 'h3'
import * as XLSX from 'xlsx'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const query = getQuery(event)

  const storeId = String(query.storeId ?? '').trim()
  if (!storeId) throw createError({ statusCode: 400, message: 'storeId is required' })

  // Verify store belongs to user
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Forbidden' })

  // Optional product filter
  const productIdsRaw = String(query.productIds ?? '').trim()
  const productIds = productIdsRaw ? productIdsRaw.split(',').map((s) => s.trim()).filter(Boolean) : []

  const skus = await prisma.sku.findMany({
    where: {
      storeId,
      ...(productIds.length > 0 ? { productId: { in: productIds } } : {}),
    },
    include: {
      product: { select: { name: true, variantTypes: true } },
    },
    orderBy: [{ product: { name: 'asc' } }, { createdAt: 'asc' }],
  })

  // Build rows
  const headerRow = ['sku_id', 'nama_produk', 'sku', 'variasi', 'harga_hpp']
  const dataRows = skus.map((s) => {
    const variantTypes: string[] = s.product.variantTypes ?? []
    const variants = s.variants as Record<string, string>
    const variasiStr = variantTypes.length > 0
      ? variantTypes.map((t) => variants[t] ?? '').filter(Boolean).join(', ')
      : ''
    return [
      s.id,
      s.product.name,
      s.sku,
      variasiStr,
      parseFloat(String(s.hpp)),
    ]
  })

  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows])

  // Column widths
  ws['!cols'] = [
    { wch: 38 }, // sku_id
    { wch: 40 }, // nama_produk
    { wch: 20 }, // sku
    { wch: 25 }, // variasi
    { wch: 15 }, // harga_hpp
  ]

  // Protect sku_id, nama_produk, sku, variasi columns visually (lock first 4 cols)
  // Not enforcing xlsx protection - just a convention

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'HPP')

  const buffer: Uint8Array = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  setResponseHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setResponseHeader(event, 'Content-Disposition', 'attachment; filename="hpp_template.xlsx"')
  setResponseHeader(event, 'Cache-Control', 'no-store')

  await send(event, buffer)
})
