import { readMultipartFormData, createError } from 'h3'
import * as XLSX from 'xlsx'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

interface HppRow {
  skuId: string
  hpp: number
}

function parseHppSheet(buffer: Uint8Array): HppRow[] {
  const wb = XLSX.read(buffer, { type: 'buffer' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rawRows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' }) as string[][]

  if (rawRows.length < 2) return []

  const headerRow = rawRows[0].map((h) => String(h).trim().toLowerCase())
  const skuIdIdx = headerRow.indexOf('sku_id')
  const hppIdx = headerRow.indexOf('harga_hpp')

  if (skuIdIdx === -1 || hppIdx === -1) {
    throw new Error('Header kolom tidak valid. Pastikan file menggunakan template yang diunduh dari sistem.')
  }

  return rawRows
    .slice(1)
    .filter((row) => row[skuIdIdx] && String(row[skuIdIdx]).trim() !== '')
    .map((row) => ({
      skuId: String(row[skuIdIdx]).trim(),
      hpp: parseFloat(String(row[hppIdx] ?? '0')) || 0,
    }))
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
  let rows: HppRow[]
  try {
    rows = parseHppSheet(filePart.data as Uint8Array)
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 400, message: e.message ?? 'Gagal membaca file Excel' })
  }

  if (rows.length === 0) {
    throw createError({ statusCode: 400, message: 'File tidak memiliki data HPP' })
  }

  // Verify all sku ids belong to this store
  const skuIds = rows.map((r) => r.skuId)
  const existingSkus = await prisma.sku.findMany({
    where: { id: { in: skuIds }, storeId },
    select: { id: true },
  })
  const validIds = new Set(existingSkus.map((s) => s.id))

  let updated = 0
  let skipped = 0
  const errors: string[] = []

  for (const row of rows) {
    if (!validIds.has(row.skuId)) {
      skipped++
      continue
    }
    if (row.hpp < 0) {
      errors.push(`SKU ${row.skuId}: HPP tidak boleh negatif`)
      continue
    }
    try {
      await prisma.sku.update({
        where: { id: row.skuId },
        data: { hpp: row.hpp },
      })
      updated++
    } catch (err: unknown) {
      const e = err as { message?: string }
      errors.push(`SKU ${row.skuId}: ${e.message ?? 'Unknown error'}`)
    }
  }

  return {
    success: true,
    updated,
    skipped,
    total: rows.length,
    errors,
  }
})
