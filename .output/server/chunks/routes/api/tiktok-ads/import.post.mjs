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
  if (idx < 0) return "";
  const v = row[idx];
  if (v === null || v === void 0) return "";
  return String(v).trim();
}
function num(row, idx) {
  if (idx < 0) return 0;
  const v = row[idx];
  if (v === null || v === void 0 || v === "") return 0;
  return Number(v) || 0;
}
function parseDate(s) {
  if (!s) return null;
  const d = new Date(s.replace(/\//g, "-"));
  return isNaN(d.getTime()) ? null : d;
}
const import_post = defineEventHandler(async (event) => {
  var _a, _b;
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
  const ws = wb.Sheets[wb.SheetNames[0]];
  const allRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (allRows.length < 2) {
    throw createError({ statusCode: 400, message: "File tidak memiliki data" });
  }
  const headers = allRows[0].map((h) => String(h).trim().toLowerCase());
  const col = (name) => headers.findIndex((h) => h.includes(name.toLowerCase()));
  const C = {
    ACCOUNT_ID: col("account id"),
    ACCOUNT_NAME: col("account name"),
    CAMPAIGN_ID: col("campaign id"),
    CAMPAIGN_NAME: col("campaign name"),
    AD_GROUP_ID: col("ad group id"),
    AD_GROUP_NAME: col("ad group name"),
    DATE: col("by day"),
    COST: col("cost"),
    IMPRESSIONS: col("impressions"),
    CLICKS: col("clicks"),
    CONVERSIONS: col("conversions"),
    GROSS_REVENUE: col("gross revenue")
  };
  const dataRows = allRows.slice(1).filter((r) => str(r, C.DATE >= 0 ? C.DATE : 0));
  let imported = 0;
  let skipped = 0;
  const errors = [];
  for (const _row of dataRows) {
    const row = _row;
    const dateStr = str(row, C.DATE);
    const adGroupId = str(row, C.AD_GROUP_ID);
    const txDate = parseDate(dateStr);
    if (!txDate || !adGroupId) continue;
    try {
      const existing = await prisma.tikTokAd.findFirst({
        where: { storeId, adGroupId, date: txDate }
      });
      const data = {
        storeId,
        date: txDate,
        accountId: str(row, C.ACCOUNT_ID),
        accountName: str(row, C.ACCOUNT_NAME),
        campaignId: str(row, C.CAMPAIGN_ID),
        campaignName: str(row, C.CAMPAIGN_NAME),
        adGroupId,
        adGroupName: str(row, C.AD_GROUP_NAME),
        cost: num(row, C.COST),
        impressions: Math.round(num(row, C.IMPRESSIONS)),
        clicks: Math.round(num(row, C.CLICKS)),
        conversions: Math.round(num(row, C.CONVERSIONS)),
        grossRevenue: num(row, C.GROSS_REVENUE)
      };
      if (existing) {
        await prisma.tikTokAd.update({ where: { id: existing.id }, data });
        skipped++;
      } else {
        await prisma.tikTokAd.create({ data });
        imported++;
      }
    } catch (e) {
      errors.push(`${dateStr} / ${adGroupId}: ${(_b = e.message) != null ? _b : "Unknown error"}`);
    }
  }
  return {
    success: true,
    imported,
    skipped,
    total: dataRows.length,
    errors
  };
});

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
