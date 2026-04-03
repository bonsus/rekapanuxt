import { readMultipartFormData, createError } from 'h3'
import XLSX from 'xlsx'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

// ── Helpers ───────────────────────────────────────────────────────────────────
function str(row: unknown[], idx: number): string {
  const v = row[idx]
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

function num(row: unknown[], idx: number): number {
  const v = row[idx]
  if (v === null || v === undefined || v === '') return 0
  return Number(v) || 0
}

function parseDate(s: string): Date | null {
  if (!s) return null
  // Supports "2026/03/13" or ISO
  const d = new Date(s.replace(/\//g, '-'))
  return isNaN(d.getTime()) ? null : d
}

// Map TikTok type string → TransactionType + CashFlow
function mapType(raw: string): { type: string; cashFlow: string } {
  const t = raw.trim().toLowerCase()
  if (t === 'order') return { type: 'ORDER', cashFlow: 'IN' }
  if (t.includes('ads') || t.includes('gmv payment')) return { type: 'ADS', cashFlow: 'OUT' }
  if (t.includes('logistics') || t.includes('logistic')) return { type: 'LOGISTIC', cashFlow: 'IN' }
  if (t.includes('withdrawal') || t.includes('withdraw')) return { type: 'WITHDRAW', cashFlow: 'OUT' }
  // fallback: positive netAmount → IN, negative → OUT
  return { type: 'ORDER', cashFlow: 'IN' } // determined later by value
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const formData = await readMultipartFormData(event)
  const storeId = formData?.find(f => f.name === 'storeId')?.data.toString()
  const file    = formData?.find(f => f.name === 'file')

  if (!storeId || !file?.data) {
    throw createError({ statusCode: 400, message: 'storeId dan file diperlukan' })
  }

  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Toko tidak ditemukan' })

  // ── Parse Excel ─────────────────────────────────────────────────────────────
  const wb = XLSX.read(file.data, { type: 'buffer' })

  // Use "Order details" sheet if exists, else first sheet
  const sheetName = wb.SheetNames.includes('Order details') ? 'Order details' : wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  const allRows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' }) as unknown[][]

  if (allRows.length < 2) {
    throw createError({ statusCode: 400, message: 'File tidak memiliki data' })
  }

  // ── Map header indices ───────────────────────────────────────────────────────
  const headers = (allRows[0] as string[]).map(h => String(h).trim().toLowerCase())

  function col(name: string): number {
    return headers.findIndex(h => h.includes(name.toLowerCase()))
  }

  const C = {
    REF_ID:            col('order/adjustment id'),
    TYPE:              col('type'),
    SETTLED_TIME:      col('order settled time'),
    NET_TOTAL:         col('total settlement amount'),
    TOTAL_REVENUE:     col('total revenue'),
    TOTAL_FEES:        col('total fees'),
    PLATFORM_FEE:      col('platform commission fee'),
    PRE_ORDER_FEE:     col('pre-order service fee'),
    MALL_FEE:          col('mall service fee'),
    PAYMENT_FEE:       col('payment fee'),
    SHIPPING_COST:     col('shipping cost'),       // seller's shipping cost (negative)
    SHIPPING_PLATFORM: col('shipping cost borne by the platform'), // platform reimbursement (positive)
    // Affiliate columns (may not exist in all exports)
    AFFILIATE_COMM:    col('affiliate commission'),
    AFFILIATE_PARTNER: col('affiliate partner commission'),
    AFFILIATE_SHOP:    col('affiliate shop ads commission'),
    ORDER_SOURCE:      col('order source'),
  }

  // Data starts at row 1 (row 0 = headers)
  const dataRows = allRows.slice(1).filter(r => str(r as unknown[], 0))

  let imported = 0
  let skipped  = 0
  let updated  = 0
  const errors: string[] = []

  for (const _row of dataRows) {
    const row = _row as unknown[]
    const refId = str(row, C.REF_ID)
    if (!refId) continue

    try {
      const rawType   = C.TYPE >= 0 ? str(row, C.TYPE) : ''
      const settledAt = C.SETTLED_TIME >= 0 ? parseDate(str(row, C.SETTLED_TIME)) : null
      const txDate    = settledAt ?? new Date()

      // ── Financial calculations ───────────────────────────────────────────────
      const netTotal     = C.NET_TOTAL      >= 0 ? num(row, C.NET_TOTAL)     : 0
      const totalRevenue = C.TOTAL_REVENUE  >= 0 ? num(row, C.TOTAL_REVENUE) : 0

      // Affiliate fee = sum of affiliate columns (values are negative, take abs)
      const affiliateFee = [C.AFFILIATE_COMM, C.AFFILIATE_PARTNER, C.AFFILIATE_SHOP]
        .filter(c => c >= 0)
        .reduce((sum, c) => sum + Math.abs(num(row, c)), 0)

      // Platform fee = |Total Fees| - affiliate fee
      //   but use individual columns if available for accuracy
      const platformFeeRaw = [C.PLATFORM_FEE, C.PRE_ORDER_FEE, C.MALL_FEE, C.PAYMENT_FEE]
        .filter(c => c >= 0)
        .reduce((sum, c) => sum + Math.abs(num(row, c)), 0)
      const platformFee = platformFeeRaw > 0 ? platformFeeRaw
        : (C.TOTAL_FEES >= 0 ? Math.max(0, Math.abs(num(row, C.TOTAL_FEES)) - affiliateFee) : 0)

      // Shipping fee = |seller shipping cost| - |platform reimbursement|
      const shippingCost     = C.SHIPPING_COST     >= 0 ? Math.abs(num(row, C.SHIPPING_COST))     : 0
      const shippingPlatform = C.SHIPPING_PLATFORM >= 0 ? Math.abs(num(row, C.SHIPPING_PLATFORM)) : 0
      const shippingFee      = Math.max(0, shippingCost - shippingPlatform)

      // Gross amount: use totalRevenue if available, otherwise reconstruct from abs(net) + fees
      const finalAmount = totalRevenue > 0
        ? totalRevenue
        : (Math.abs(netTotal) + platformFee + affiliateFee + shippingFee)

      const source = C.ORDER_SOURCE >= 0 && str(row, C.ORDER_SOURCE) ? str(row, C.ORDER_SOURCE) : 'TikTok'

      // Map transaction type + cashFlow
      const isOrderType = rawType.trim().toLowerCase() === 'order'
      let { type, cashFlow } = mapType(rawType)
      // For ORDER type: cashFlow is determined by sign of netTotal (negative settlement = money owed to platform)
      // ADS and WITHDRAW always OUT; LOGISTIC always IN — preserved from mapType
      if (isOrderType) {
        cashFlow = netTotal >= 0 ? 'IN' : 'OUT'
      }

      // netAmount = absolute value of settlement; cashFlow (IN/OUT) captures direction
      const netAmount = Math.abs(netTotal)

      // ── Check if finance transaction already exists ────────────────────────
      // @ts-ignore
      const existingTx = await prisma.financeTransaction.findFirst({
        where: { storeId, referenceId: refId },
      })
      if (existingTx) {
        skipped++
        // Still check if order needs updating (for ORDER type)
        if (type === 'ORDER') {
          await maybeUpdateOrder(storeId, refId, platformFee, affiliateFee, shippingFee)
            .then(ok => { if (ok) updated++ })
            .catch(() => {})
        }
        continue
      }

      // ── Insert finance transaction ─────────────────────────────────────────
      // @ts-ignore
      await prisma.financeTransaction.create({
        data: {
          storeId,
          date:        txDate,
          type:        type as string,
          cashFlow:    cashFlow as string,
          source:      source as string,
          referenceId: refId,
          amount:      finalAmount,
          platformFee,
          affiliateFee,
          shippingFee,
          netAmount:   Math.abs(netTotal),
          note:        null,
        },
      })

      imported++

      // ── Update matching Order ──────────────────────────────────────────────
      if (type === 'ORDER') {
        await maybeUpdateOrder(storeId, refId, platformFee, affiliateFee, shippingFee)
          .then(ok => { if (ok) updated++ })
          .catch(() => {})
      }
    } catch (e: unknown) {
      errors.push(`Row ${refId}: ${(e as Error).message ?? 'Unknown error'}`)
    }
  }

  // ── Process "Withdrawal records" sheet ──────────────────────────────────────
  const wdrSheet = wb.Sheets['Withdrawal records']
  if (wdrSheet) {
    const wdrRows = XLSX.utils.sheet_to_json<unknown[]>(wdrSheet, { header: 1, defval: '' }) as unknown[][]
    if (wdrRows.length >= 2) {
      const wdrHeaders = (wdrRows[0] as string[]).map(h => String(h).trim().toLowerCase())
      const wdrCol = (name: string) => wdrHeaders.findIndex(h => h.includes(name.toLowerCase()))

      const W = {
        TYPE:         wdrCol('type'),
        REF_ID:       wdrCol('reference id'),
        AMOUNT:       wdrCol('amount'),
        STATUS:       wdrCol('status'),
        SUCCESS_TIME: wdrCol('success time'),
      }

      const wdrDataRows = wdrRows.slice(1).filter(r => {
        const row = r as unknown[]
        return W.REF_ID >= 0 ? str(row, W.REF_ID) : str(row, 1)
      })

      for (const _row of wdrDataRows) {
        const row = _row as unknown[]
        const wdrType   = W.TYPE   >= 0 ? str(row, W.TYPE).toLowerCase()   : ''
        const wdrStatus = W.STATUS >= 0 ? str(row, W.STATUS).toLowerCase() : ''

        // Only import Withdrawal rows with Transferred status
        if (wdrType !== 'withdrawal' || wdrStatus !== 'transferred') continue

        const refId = W.REF_ID >= 0 ? str(row, W.REF_ID) : ''
        if (!refId) continue

        try {
          const rawAmount = W.AMOUNT       >= 0 ? num(row, W.AMOUNT) : 0
          const successAt = W.SUCCESS_TIME >= 0 ? parseDate(str(row, W.SUCCESS_TIME)) : null
          const txDate    = successAt ?? new Date()
          const amount    = Math.abs(rawAmount)

          // @ts-ignore
          const existingTx = await prisma.financeTransaction.findFirst({
            where: { storeId, referenceId: refId },
          })
          if (existingTx) { skipped++; continue }

          // @ts-ignore
          await prisma.financeTransaction.create({
            data: {
              storeId,
              date:        txDate,
              type:        'WITHDRAW',
              cashFlow:    'OUT',
              source:      'TikTok',
              referenceId: refId,
              amount,
              platformFee:  0,
              affiliateFee: 0,
              shippingFee:  0,
              netAmount:    amount,
              note:         null,
            },
          })

          imported++
        } catch (e: unknown) {
          errors.push(`Withdrawal ${refId}: ${(e as Error).message ?? 'Unknown error'}`)
        }
      }
    }
  }

  return {
    success: true,
    imported,
    skipped,
    updated,
    total: dataRows.length,
    errors,
  }
})

// Update order platformFee, affiliateFee, shippingFee and recalculate totals
async function maybeUpdateOrder(
  storeId: string,
  orderNumber: string,
  platformFee: number,
  affiliateFee: number,
  shippingFee: number,
): Promise<boolean> {
  const order = await prisma.order.findUnique({
    where: { orderNumber_storeId: { orderNumber, storeId } },
  })
  if (!order) return false

  const sF = shippingFee > 0 ? shippingFee : Number(order.shippingFee)
  const pF = platformFee  > 0 ? platformFee  : Number(order.platformFee)
  const aF = affiliateFee > 0 ? affiliateFee : Number(order.affiliateFee)
  const total     = Number(order.total)
  const totalHpp  = Number(order.totalHpp)
  const grandTotal = total + sF - pF - aF
  const netTotal   = grandTotal - totalHpp

  await prisma.order.update({
    where: { id: order.id },
    data: {
      shippingFee:  sF,
      platformFee:  pF,
      affiliateFee: aF,
      grandTotal,
      netTotal,
    },
  })

  return true
}
