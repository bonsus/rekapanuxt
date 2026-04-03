import { d as defineEventHandler, f as readMultipartFormData, c as createError } from '../../../nitro/nitro.mjs';
import { a as requireAuth } from '../../../_/auth.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import { a as xlsxExports } from '../../../_/xlsx.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../../../_/jwt.mjs';
import 'jose';
import '@prisma/client';
import '/Users/macbookpro/Documents/1.Saas/REKAPA/rekapnuxt/node_modules/xlsx/dist/cpexcel.js';
import 'fs';
import 'stream';

const C = {
  ORDER_ID: 0,
  STATUS: 1,
  SKU_ID: 5,
  // Platform SKU ID → mpSkuId
  SELLER_SKU: 6,
  PRODUCT_NAME: 7,
  VARIATION: 8,
  QTY: 9,
  PRICE: 11,
  // SKU Unit Original Price
  SELLER_DISCOUNT: 14,
  // SKU Seller Discount
  SHIPPING_FEE: 18,
  // Shipping Fee Seller Discount → ongkir
  CREATED_TIME: 29,
  SHIPPED_TIME: 32,
  DELIVERED_TIME: 33,
  CANCELLED_TIME: 34,
  CANCEL_BY: 35,
  CANCEL_REASON: 36,
  TRACKING_ID: 39,
  DELIVERY_OPTION: 40,
  SHIPPING_PROVIDER: 41,
  BUYER_USERNAME: 43,
  RECIPIENT: 44,
  PHONE: 45,
  ZIPCODE: 46,
  COUNTRY: 47,
  PROVINCE: 48,
  CITY: 49,
  DISTRICT: 50,
  ADDRESS: 52,
  PRODUCT_CATEGORY: 56
};
function parseDate(s) {
  if (!s) return null;
  const str2 = String(s).trim();
  if (!str2) return null;
  const [datePart, timePart = "00:00:00"] = str2.split(" ");
  const [d, m, y] = datePart.split("/");
  if (!d || !m || !y) return null;
  return /* @__PURE__ */ new Date(`${y}-${m}-${d}T${timePart}`);
}
const STATUS_MAP = {
  "Selesai": "COMPLETED",
  "Completed": "COMPLETED",
  "Dibatalkan": "CANCELLED",
  "Cancelled": "CANCELLED",
  "Dalam Pengiriman": "SHIPPED",
  "In Transit": "SHIPPED",
  "Siap Dikirim": "PENDING",
  "Ready to Ship": "PENDING",
  "Menunggu Pembayaran": "PENDING",
  "Unpaid": "PENDING",
  "Diproses": "PENDING",
  "Processing": "PENDING"
};
const CANCEL_BY_MAP = {
  Seller: "SELLER",
  User: "USER",
  System: "SYSTEM"
};
function str(row, col) {
  var _a;
  return String((_a = row[col]) != null ? _a : "").trim();
}
function num(row, col) {
  return Number(row[col]) || 0;
}
const import_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  const user = await requireAuth(event);
  const formData = await readMultipartFormData(event);
  const storeId = (_a = formData == null ? void 0 : formData.find((f) => f.name === "storeId")) == null ? void 0 : _a.data.toString();
  const file = formData == null ? void 0 : formData.find((f) => f.name === "file");
  if (!storeId || !(file == null ? void 0 : file.data)) {
    throw createError({ statusCode: 400, message: "storeId dan file diperlukan" });
  }
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Toko tidak ditemukan" });
  const wb = xlsxExports.read(file.data, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const allRows = xlsxExports.utils.sheet_to_json(ws, { header: 1, defval: "" });
  const dataRows = allRows.slice(2).filter((r) => str(r, C.ORDER_ID));
  const orderMap = /* @__PURE__ */ new Map();
  for (const row of dataRows) {
    const orderId = str(row, C.ORDER_ID);
    if (!orderMap.has(orderId)) orderMap.set(orderId, []);
    orderMap.get(orderId).push(row);
  }
  const allSkus = await prisma.sku.findMany({
    where: { storeId },
    include: { product: { select: { id: true } } }
  });
  const skuByMpId = new Map(allSkus.map((s) => [s.mpSkuId, s]));
  let imported = 0;
  let skipped = 0;
  const errors = [];
  for (const [orderId, rows] of orderMap) {
    const first = rows[0];
    try {
      const existing = await prisma.order.findUnique({
        where: { orderNumber_storeId: { orderNumber: orderId, storeId } }
      });
      if (existing) {
        skipped++;
        continue;
      }
      const rawStatus = str(first, C.STATUS);
      const status = (_b = STATUS_MAP[rawStatus]) != null ? _b : "PENDING";
      const cancelByRaw = str(first, C.CANCEL_BY);
      const cancelBy = (_c = CANCEL_BY_MAP[cancelByRaw]) != null ? _c : null;
      const createdDate = (_d = parseDate(str(first, C.CREATED_TIME))) != null ? _d : /* @__PURE__ */ new Date();
      const shippedDate = parseDate(str(first, C.SHIPPED_TIME));
      const deliveredDate = parseDate(str(first, C.DELIVERED_TIME));
      const completedDate = status === "COMPLETED" ? deliveredDate != null ? deliveredDate : shippedDate : null;
      const shippingFee = num(first, C.SHIPPING_FEE);
      let subtotal = 0;
      let discount = 0;
      let totalHpp = 0;
      const items = rows.map((row) => {
        var _a2, _b2;
        const mpSkuId = str(row, C.SKU_ID);
        const qty = num(row, C.QTY) || 1;
        const price = num(row, C.PRICE);
        const itemDiscount = num(row, C.SELLER_DISCOUNT);
        const itemTotal = price * qty - itemDiscount;
        subtotal += price * qty;
        discount += itemDiscount;
        const skuRecord = skuByMpId.get(mpSkuId);
        const hpp = skuRecord ? Number(skuRecord.hpp) : 0;
        const hppTotal = hpp * qty;
        totalHpp += hppTotal;
        return {
          skuId: (_a2 = skuRecord == null ? void 0 : skuRecord.id) != null ? _a2 : null,
          productId: (_b2 = skuRecord == null ? void 0 : skuRecord.productId) != null ? _b2 : null,
          sku: str(row, C.SELLER_SKU),
          mpSkuId,
          productName: str(row, C.PRODUCT_NAME),
          productCategory: str(row, C.PRODUCT_CATEGORY) || null,
          qty,
          price,
          discount: itemDiscount,
          total: itemTotal,
          hpp,
          hppTotal
        };
      });
      const total = subtotal - discount;
      const grandTotal = total + shippingFee;
      const netTotal = grandTotal - totalHpp;
      const recipient = str(first, C.RECIPIENT);
      const buyerUsername = str(first, C.BUYER_USERNAME);
      const hasCustomer = !!(recipient || buyerUsername);
      const trackingId = str(first, C.TRACKING_ID);
      const shippingProvider = str(first, C.SHIPPING_PROVIDER);
      const hasShipping = !!(trackingId || shippingProvider);
      await prisma.order.create({
        data: {
          orderNumber: orderId,
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
          platformFee: 0,
          affiliateFee: 0,
          grandTotal,
          totalHpp,
          netTotal,
          items: { create: items },
          ...hasCustomer ? {
            customer: {
              create: {
                customerId: buyerUsername || null,
                name: recipient || buyerUsername || "Unknown",
                phone: str(first, C.PHONE) || null,
                address: str(first, C.ADDRESS) || null,
                country: str(first, C.COUNTRY) || null,
                province: str(first, C.PROVINCE) || null,
                city: str(first, C.CITY) || null,
                district: str(first, C.DISTRICT) || null,
                zipcode: str(first, C.ZIPCODE) || null
              }
            }
          } : {},
          ...hasShipping ? {
            shipping: {
              create: {
                trackingNumber: trackingId || null,
                serviceName: str(first, C.DELIVERY_OPTION) || null,
                name: shippingProvider || null
              }
            }
          } : {}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
      });
      imported++;
    } catch (e) {
      errors.push(`Order ${orderId}: ${(_e = e.message) != null ? _e : "Unknown error"}`);
    }
  }
  return {
    success: true,
    imported,
    skipped,
    total: orderMap.size,
    errors
  };
});

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
