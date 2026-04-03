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
  if (v === null || v === undefined || v === '') return 0
  return Number(v) || 0
}

function parseDate(s: string): Date | null {
  if (!s) return null
  const d = new Date(s.replace(/\//g, '-'))
  return isNaN(d.getTime()) ? null : d
}

export default defineEventHandler(async (event) => {
  const user     = await requireAuth(event)
  const formData = await readMultipartFormData(event)
  const storeId  = formData?.find(f => f.name === 'storeId')?.data.toString()
  const file     = formData?.find(f => f.name === 'file')

  if (!storeId || !file?.data) {
    throw createError({ statusCode: 400, message: 'storeId dan file diperlukan' })
  }

  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Toko tidak ditemukan' })

  const wb  = XLSX.read(file.data, { type: 'buffer' })
  const ws  = wb.Sheets[wb.SheetNames[0]]
  const allRows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' }) as unknown[][]

  if (allRows.length < 2) {
    throw createError({ statusCode: 400, message: 'File tidak memiliki data' })
  }

  // Auto-detect column indices by header name
  const headers = (allRows[0] as string[]).map(h => String(h).trim().toLowerCase())
  const col = (name: string) => headers.findIndex(h => h.includes(name.toLowerCase()))

  const C = {
    ACCOUNT_ID:    col('account id'),
    ACCOUNT_NAME:  col('account name'),
    CAMPAIGN_ID:   col('campaign id'),
    CAMPAIGN_NAME: col('campaign name'),
    AD_GROUP_ID:   col('ad group id'),
    AD_GROUP_NAME: col('ad group name'),
    DATE:          col('by day'),
    COST:          col('cost'),
    IMPRESSIONS:   col('impressions'),
    CLICKS:        col('clicks'),
    CONVERSIONS:   col('conversions'),
    GROSS_REVENUE: col('gross revenue'),
  }

  const dataRows = allRows.slice(1).filter(r => str(r as unknown[], C.DATE >= 0 ? C.DATE : 0))

  let imported = 0
  let skipped  = 0
  const errors: string[] = []

  for (const _row of dataRows) {
    const row = _row as unknown[]

    const dateStr    = str(row, C.DATE)
    const adGroupId  = str(row, C.AD_GROUP_ID)
    const txDate     = parseDate(dateStr)

    if (!txDate || !adGroupId) continue

    try {
      // @ts-ignore
      const existing = await prisma.tikTokAd.findFirst({
        where: { storeId, adGroupId, date: txDate },
      })

      const data = {
        storeId,
        date:         txDate,
        accountId:    str(row, C.ACCOUNT_ID),
        accountName:  str(row, C.ACCOUNT_NAME),
        campaignId:   str(row, C.CAMPAIGN_ID),
        campaignName: str(row, C.CAMPAIGN_NAME),
        adGroupId,
        adGroupName:  str(row, C.AD_GROUP_NAME),
        cost:         num(row, C.COST),
        impressions:  Math.round(num(row, C.IMPRESSIONS)),
        clicks:       Math.round(num(row, C.CLICKS)),
        conversions:  Math.round(num(row, C.CONVERSIONS)),
        grossRevenue: num(row, C.GROSS_REVENUE),
      }

      if (existing) {
        // Update existing row
        // @ts-ignore
        await prisma.tikTokAd.update({ where: { id: existing.id }, data })
        skipped++
      } else {
        // @ts-ignore
        await prisma.tikTokAd.create({ data })
        imported++
      }
    } catch (e: unknown) {
      errors.push(`${dateStr} / ${adGroupId}: ${(e as Error).message ?? 'Unknown error'}`)
    }
  }

  return {
    success: true,
    imported,
    skipped,
    total: dataRows.length,
    errors,
  }
})
