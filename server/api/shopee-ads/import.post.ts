import { readMultipartFormData, createError } from 'h3'
import XLSX from 'xlsx'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

function str(row: unknown[], idx: number): string {
  if (idx < 0) return ''
  const v = row[idx]
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

function num(row: unknown[], idx: number): number {
  if (idx < 0) return 0
  const v = row[idx]
  if (v === null || v === undefined || v === '' || v === '-') return 0
  return Number(v) || 0
}

// Parse date from "DD/MM/YYYY" format
function parseDMY(s: string): Date | null {
  if (!s) return null
  const parts = s.trim().split(/[\/\-]/)
  if (parts.length < 3) return null
  const [dd, mm, yyyy] = parts
  const d = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`)
  return isNaN(d.getTime()) ? null : d
}

// Parse period string "01/01/2026 - 31/01/2026" → start date
function parsePeriodStart(s: string): Date | null {
  const start = s.split(' - ')[0].trim()
  return parseDMY(start)
}

export default defineEventHandler(async (event) => {
  const user     = await requireAuth(event)
  const formData = await readMultipartFormData(event)

  const storeId  = formData?.find(f => f.name === 'storeId')?.data.toString()
  const files    = formData?.filter(f => f.name === 'files') ?? []

  if (!storeId) throw createError({ statusCode: 400, message: 'storeId diperlukan' })
  if (!files.length) throw createError({ statusCode: 400, message: 'Tidak ada file yang dikirim' })

  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Toko tidak ditemukan' })

  let totalImported = 0
  let totalSkipped  = 0
  let totalRows     = 0
  const allErrors: string[] = []

  for (const file of files) {
    const fileName = file.filename ?? 'file'

    let allRows: unknown[][]
    try {
      const wb  = XLSX.read(file.data, { type: 'buffer' })
      const ws  = wb.Sheets[wb.SheetNames[0]]
      allRows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' }) as unknown[][]
    } catch {
      allErrors.push(`${fileName}: Gagal membaca file`)
      continue
    }

    // Find "Periode" row for the date
    const periodeRow = allRows.find(r => String((r as unknown[])[0]).trim().toLowerCase() === 'periode') as unknown[] | undefined
    const periodeStr = periodeRow ? String(periodeRow[1]).trim() : ''
    const fileDate   = parsePeriodStart(periodeStr)

    if (!fileDate) {
      allErrors.push(`${fileName}: Baris "Periode" tidak ditemukan atau format salah`)
      continue
    }

    // Find header row (starts with "Urutan")
    const headerRowIdx = allRows.findIndex(r => String((r as unknown[])[0]).trim().toLowerCase() === 'urutan')
    if (headerRowIdx < 0) {
      allErrors.push(`${fileName}: Baris header tidak ditemukan`)
      continue
    }

    const headers = (allRows[headerRowIdx] as unknown[]).map(h => String(h).trim())
    // Exact match for column names
    const col = (name: string) => headers.findIndex(h => h === name)

    const C = {
      AD_NAME:     col('Nama Iklan'),
      AD_TYPE:     col('Jenis Iklan'),
      PRODUCT:     col('Kode Produk'),
      BIDDING:     col('Mode Bidding'),
      PLACEMENT:   col('Penempatan Iklan'),
      IMPRESSIONS: col('Dilihat'),
      CLICKS:      col('Jumlah Klik'),
      CONVERSIONS: col('Konversi'),
      REVENUE:     col('Omzet Penjualan'),
      COST:        col('Biaya'),
    }

    const dataRows = allRows
      .slice(headerRowIdx + 1)
      .filter(r => {
        const row = r as unknown[]
        return row[0] !== '' && row[0] !== null && row[0] !== undefined
      })

    totalRows += dataRows.length

    for (const _row of dataRows) {
      const row    = _row as unknown[]
      const adName = str(row, C.AD_NAME)
      if (!adName) continue

      try {
        // @ts-ignore
        const existing = await prisma.shopeeAd.findFirst({
          where: { storeId, date: fileDate, adName },
        })

        const data = {
          storeId,
          date:        fileDate,
          adName,
          adType:      str(row, C.AD_TYPE),
          productCode: str(row, C.PRODUCT),
          biddingMode: str(row, C.BIDDING),
          adPlacement: str(row, C.PLACEMENT),
          impressions: Math.round(num(row, C.IMPRESSIONS)),
          clicks:      Math.round(num(row, C.CLICKS)),
          conversions: Math.round(num(row, C.CONVERSIONS)),
          grossRevenue: num(row, C.REVENUE),
          cost:         num(row, C.COST),
        }

        if (existing) {
          // @ts-ignore
          await prisma.shopeeAd.update({ where: { id: existing.id }, data })
          totalSkipped++
        } else {
          // @ts-ignore
          await prisma.shopeeAd.create({ data })
          totalImported++
        }
      } catch (e: unknown) {
        allErrors.push(`${fileName} / ${adName}: ${(e as Error).message ?? 'Error'}`)
      }
    }
  }

  return {
    success:  true,
    imported: totalImported,
    skipped:  totalSkipped,
    total:    totalRows,
    errors:   allErrors,
  }
})
