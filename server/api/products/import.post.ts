import { readMultipartFormData, createError } from 'h3'
import * as XLSX from 'xlsx'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

interface TiktokRow {
  product_id: string
  category: string
  product_name: string
  sku_id: string
  variation_value: string
  price: string | number
  seller_sku: string
}

function parseTiktokSheet(buffer: Uint8Array): TiktokRow[] {
  const wb = XLSX.read(buffer, { type: 'buffer' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rawRows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' })

  // Row 0 = machine keys, Row 2 = Indonesian labels, data starts at row 5
  const keys = rawRows[0] as string[]
  const dataRows = rawRows.slice(5) as string[][]

  const colIndex = {
    product_id: keys.indexOf('product_id'),
    category: keys.indexOf('category'),
    product_name: keys.indexOf('product_name'),
    sku_id: keys.indexOf('sku_id'),
    variation_value: keys.indexOf('variation_value'),
    price: keys.indexOf('price'),
    seller_sku: keys.indexOf('seller_sku'),
  }

  return dataRows
    .filter((row) => row[colIndex.product_id] && row[colIndex.product_id] !== '')
    .map((row) => ({
      product_id: String(row[colIndex.product_id] ?? '').trim(),
      category: String(row[colIndex.category] ?? '').trim(),
      product_name: String(row[colIndex.product_name] ?? '').trim(),
      sku_id: String(row[colIndex.sku_id] ?? '').trim(),
      variation_value: String(row[colIndex.variation_value] ?? '').trim(),
      price: row[colIndex.price] ?? 0,
      seller_sku: String(row[colIndex.seller_sku] ?? '').trim(),
    }))
}

function buildVariants(variationValue: string, variantTypes: string[]): Record<string, string> {
  if (!variationValue || variantTypes.length === 0) return {}
  const parts = variationValue.split(', ')
  const result: Record<string, string> = {}
  variantTypes.forEach((type, i) => {
    const val = parts[i]?.trim() ?? ''
    if (val && val !== '-') result[type] = val
  })
  return result
}

function detectVariantTypes(rows: TiktokRow[]): string[] {
  const maxParts = Math.max(
    ...rows.map((r) => {
      if (!r.variation_value) return 0
      const parts = r.variation_value.split(', ')
      const allDash = parts.every((p) => p.trim() === '-')
      if (allDash) return 0
      return parts.length
    }),
  )
  if (maxParts === 0) return []
  if (maxParts === 1) return ['Variasi']
  return ['Variasi 1', 'Variasi 2']
}

function stripCategoryId(category: string): string {
  // "Memancing (603818)" → "Memancing"
  return category.replace(/\s*\(\d+\)\s*$/, '').trim()
}

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, message: 'Form data is required' })

  const filePart = formData.find((f) => f.name === 'file')
  const storeIdPart = formData.find((f) => f.name === 'storeId')

  if (!filePart?.data) throw createError({ statusCode: 400, message: 'File is required' })
  if (!storeIdPart?.data) throw createError({ statusCode: 400, message: 'storeId is required' })

  const storeId = new TextDecoder().decode(storeIdPart.data).trim()

  // Verify store belongs to user
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Forbidden' })

  // Parse xlsx
  let rows: TiktokRow[]
  try {
    rows = parseTiktokSheet(filePart.data as Uint8Array)
  } catch {
    throw createError({ statusCode: 400, message: 'Gagal membaca file Excel. Pastikan format file sesuai template TikTok.' })
  }

  if (rows.length === 0) {
    throw createError({ statusCode: 400, message: 'File tidak memiliki data produk' })
  }

  // Group rows by product_id
  const productMap = new Map<string, TiktokRow[]>()
  for (const row of rows) {
    if (!productMap.has(row.product_id)) productMap.set(row.product_id, [])
    productMap.get(row.product_id)!.push(row)
  }

  let imported = 0
  let updated = 0
  const errors: string[] = []

  for (const [mpProductId, skuRows] of productMap) {
    const firstRow = skuRows[0]
    const variantTypes = detectVariantTypes(skuRows)
    const category = stripCategoryId(firstRow.category)

    try {
      // Upsert product
      const product = await prisma.product.upsert({
        where: { mpProductId_storeId: { mpProductId, storeId } },
        create: {
          mpProductId,
          name: firstRow.product_name,
          category: category || null,
          status: 'ACTIVE',
          variantTypes,
          storeId,
        },
        update: {
          name: firstRow.product_name,
          category: category || null,
          variantTypes,
        },
      })

      let isNew = product.createdAt.getTime() >= Date.now() - 3000

      // Upsert each SKU
      for (const row of skuRows) {
        if (!row.sku_id) continue
        const variants = buildVariants(row.variation_value, variantTypes)
        const price = typeof row.price === 'number' ? row.price : parseFloat(String(row.price)) || 0

        await prisma.sku.upsert({
          where: { mpSkuId_storeId: { mpSkuId: row.sku_id, storeId } },
          create: {
            mpSkuId: row.sku_id,
            sku: row.seller_sku,
            price,
            hpp: 0,
            variants,
            productId: product.id,
            storeId,
          },
          update: {
            sku: row.seller_sku,
            price,
            variants,
          },
        })
      }

      if (isNew) imported++
      else updated++
    } catch (err: unknown) {
      const e = err as { message?: string }
      errors.push(`Produk ${firstRow.product_name}: ${e.message ?? 'Unknown error'}`)
    }
  }

  return {
    success: true,
    imported,
    updated,
    total: productMap.size,
    skuCount: rows.length,
    errors,
  }
})
