import { d as defineEventHandler, f as readMultipartFormData, c as createError } from '../../../nitro/nitro.mjs';
import { X as XLSX } from '../../../_/xlsx.mjs';
import { a as requireAuth } from '../../../_/auth.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '/Users/macbookpro/Documents/1.Saas/REKAPA/rekapnuxt/node_modules/xlsx/dist/cpexcel.js';
import 'fs';
import 'stream';
import '../../../_/jwt.mjs';
import 'jose';
import '@prisma/client';

function str(row, idx) {
  const v = row[idx];
  if (v === null || v === void 0) return "";
  return String(v).trim();
}
function num(row, idx) {
  const v = row[idx];
  if (v === null || v === void 0 || v === "") return 0;
  return Number(v) || 0;
}
function parseDate(s) {
  if (!s) return null;
  const d = new Date(s.replace(/\//g, "-"));
  return isNaN(d.getTime()) ? null : d;
}
function mapType(raw) {
  const t = raw.trim().toLowerCase();
  if (t === "order") return { type: "ORDER", cashFlow: "IN" };
  if (t.includes("ads") || t.includes("gmv payment")) return { type: "ADS", cashFlow: "OUT" };
  if (t.includes("logistics") || t.includes("logistic")) return { type: "LOGISTIC", cashFlow: "IN" };
  if (t.includes("withdrawal") || t.includes("withdraw")) return { type: "WITHDRAW", cashFlow: "OUT" };
  return { type: "ORDER", cashFlow: "IN" };
}
const import_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const user = await requireAuth(event);
  const formData = await readMultipartFormData(event);
  const storeId = (_a = formData == null ? void 0 : formData.find((f) => f.name === "storeId")) == null ? void 0 : _a.data.toString();
  const file = formData == null ? void 0 : formData.find((f) => f.name === "file");
  if (!storeId || !(file == null ? void 0 : file.data)) {
    throw createError({ statusCode: 400, message: "storeId dan file diperlukan" });
  }
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Toko tidak ditemukan" });
  const wb = XLSX.read(file.data, { type: "buffer" });
  const sheetName = wb.SheetNames.includes("Order details") ? "Order details" : wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const allRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (allRows.length < 2) {
    throw createError({ statusCode: 400, message: "File tidak memiliki data" });
  }
  const headers = allRows[0].map((h) => String(h).trim().toLowerCase());
  function col(name) {
    return headers.findIndex((h) => h.includes(name.toLowerCase()));
  }
  const C = {
    REF_ID: col("order/adjustment id"),
    TYPE: col("type"),
    SETTLED_TIME: col("order settled time"),
    NET_TOTAL: col("total settlement amount"),
    TOTAL_REVENUE: col("total revenue"),
    TOTAL_FEES: col("total fees"),
    PLATFORM_FEE: col("platform commission fee"),
    PRE_ORDER_FEE: col("pre-order service fee"),
    MALL_FEE: col("mall service fee"),
    PAYMENT_FEE: col("payment fee"),
    SHIPPING_COST: col("shipping cost"),
    // seller's shipping cost (negative)
    SHIPPING_PLATFORM: col("shipping cost borne by the platform"),
    // platform reimbursement (positive)
    // Affiliate columns (may not exist in all exports)
    AFFILIATE_COMM: col("affiliate commission"),
    AFFILIATE_PARTNER: col("affiliate partner commission"),
    AFFILIATE_SHOP: col("affiliate shop ads commission"),
    ORDER_SOURCE: col("order source")
  };
  const dataRows = allRows.slice(1).filter((r) => str(r, 0));
  let imported = 0;
  let skipped = 0;
  let updated = 0;
  const errors = [];
  for (const _row of dataRows) {
    const row = _row;
    const refId = str(row, C.REF_ID);
    if (!refId) continue;
    try {
      const rawType = C.TYPE >= 0 ? str(row, C.TYPE) : "";
      const settledAt = C.SETTLED_TIME >= 0 ? parseDate(str(row, C.SETTLED_TIME)) : null;
      const txDate = settledAt != null ? settledAt : /* @__PURE__ */ new Date();
      const netTotal = C.NET_TOTAL >= 0 ? num(row, C.NET_TOTAL) : 0;
      const totalRevenue = C.TOTAL_REVENUE >= 0 ? num(row, C.TOTAL_REVENUE) : 0;
      const affiliateFee = [C.AFFILIATE_COMM, C.AFFILIATE_PARTNER, C.AFFILIATE_SHOP].filter((c) => c >= 0).reduce((sum, c) => sum + Math.abs(num(row, c)), 0);
      const platformFeeRaw = [C.PLATFORM_FEE, C.PRE_ORDER_FEE, C.MALL_FEE, C.PAYMENT_FEE].filter((c) => c >= 0).reduce((sum, c) => sum + Math.abs(num(row, c)), 0);
      const platformFee = platformFeeRaw > 0 ? platformFeeRaw : C.TOTAL_FEES >= 0 ? Math.max(0, Math.abs(num(row, C.TOTAL_FEES)) - affiliateFee) : 0;
      const shippingCost = C.SHIPPING_COST >= 0 ? Math.abs(num(row, C.SHIPPING_COST)) : 0;
      const shippingPlatform = C.SHIPPING_PLATFORM >= 0 ? Math.abs(num(row, C.SHIPPING_PLATFORM)) : 0;
      const shippingFee = Math.max(0, shippingCost - shippingPlatform);
      const finalAmount = totalRevenue > 0 ? totalRevenue : Math.abs(netTotal) + platformFee + affiliateFee + shippingFee;
      const source = C.ORDER_SOURCE >= 0 && str(row, C.ORDER_SOURCE) ? str(row, C.ORDER_SOURCE) : "TikTok";
      const isOrderType = rawType.trim().toLowerCase() === "order";
      let { type, cashFlow } = mapType(rawType);
      if (isOrderType) {
        cashFlow = netTotal >= 0 ? "IN" : "OUT";
      }
      const netAmount = Math.abs(netTotal);
      const existingTx = await prisma.financeTransaction.findFirst({
        where: { storeId, referenceId: refId }
      });
      if (existingTx) {
        skipped++;
        if (type === "ORDER") {
          await maybeUpdateOrder(storeId, refId, platformFee, affiliateFee, shippingFee).then((ok) => {
            if (ok) updated++;
          }).catch(() => {
          });
        }
        continue;
      }
      await prisma.financeTransaction.create({
        data: {
          storeId,
          date: txDate,
          type,
          cashFlow,
          source,
          referenceId: refId,
          amount: finalAmount,
          platformFee,
          affiliateFee,
          shippingFee,
          netAmount: Math.abs(netTotal),
          note: null
        }
      });
      imported++;
      if (type === "ORDER") {
        await maybeUpdateOrder(storeId, refId, platformFee, affiliateFee, shippingFee).then((ok) => {
          if (ok) updated++;
        }).catch(() => {
        });
      }
    } catch (e) {
      errors.push(`Row ${refId}: ${(_b = e.message) != null ? _b : "Unknown error"}`);
    }
  }
  const wdrSheet = wb.Sheets["Withdrawal records"];
  if (wdrSheet) {
    const wdrRows = XLSX.utils.sheet_to_json(wdrSheet, { header: 1, defval: "" });
    if (wdrRows.length >= 2) {
      const wdrHeaders = wdrRows[0].map((h) => String(h).trim().toLowerCase());
      const wdrCol = (name) => wdrHeaders.findIndex((h) => h.includes(name.toLowerCase()));
      const W = {
        TYPE: wdrCol("type"),
        REF_ID: wdrCol("reference id"),
        AMOUNT: wdrCol("amount"),
        STATUS: wdrCol("status"),
        SUCCESS_TIME: wdrCol("success time")
      };
      const wdrDataRows = wdrRows.slice(1).filter((r) => {
        const row = r;
        return W.REF_ID >= 0 ? str(row, W.REF_ID) : str(row, 1);
      });
      for (const _row of wdrDataRows) {
        const row = _row;
        const wdrType = W.TYPE >= 0 ? str(row, W.TYPE).toLowerCase() : "";
        const wdrStatus = W.STATUS >= 0 ? str(row, W.STATUS).toLowerCase() : "";
        if (wdrType !== "withdrawal" || wdrStatus !== "transferred") continue;
        const refId = W.REF_ID >= 0 ? str(row, W.REF_ID) : "";
        if (!refId) continue;
        try {
          const rawAmount = W.AMOUNT >= 0 ? num(row, W.AMOUNT) : 0;
          const successAt = W.SUCCESS_TIME >= 0 ? parseDate(str(row, W.SUCCESS_TIME)) : null;
          const txDate = successAt != null ? successAt : /* @__PURE__ */ new Date();
          const amount = Math.abs(rawAmount);
          const existingTx = await prisma.financeTransaction.findFirst({
            where: { storeId, referenceId: refId }
          });
          if (existingTx) {
            skipped++;
            continue;
          }
          await prisma.financeTransaction.create({
            data: {
              storeId,
              date: txDate,
              type: "WITHDRAW",
              cashFlow: "OUT",
              source: "TikTok",
              referenceId: refId,
              amount,
              platformFee: 0,
              affiliateFee: 0,
              shippingFee: 0,
              netAmount: amount,
              note: null
            }
          });
          imported++;
        } catch (e) {
          errors.push(`Withdrawal ${refId}: ${(_c = e.message) != null ? _c : "Unknown error"}`);
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
    errors
  };
});
async function maybeUpdateOrder(storeId, orderNumber, platformFee, affiliateFee, shippingFee) {
  const order = await prisma.order.findUnique({
    where: { orderNumber_storeId: { orderNumber, storeId } }
  });
  if (!order) return false;
  const sF = shippingFee > 0 ? shippingFee : Number(order.shippingFee);
  const pF = platformFee > 0 ? platformFee : Number(order.platformFee);
  const aF = affiliateFee > 0 ? affiliateFee : Number(order.affiliateFee);
  const total = Number(order.total);
  const totalHpp = Number(order.totalHpp);
  const grandTotal = total + sF - pF - aF;
  const netTotal = grandTotal - totalHpp;
  await prisma.order.update({
    where: { id: order.id },
    data: {
      shippingFee: sF,
      platformFee: pF,
      affiliateFee: aF,
      grandTotal,
      netTotal
    }
  });
  return true;
}

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
