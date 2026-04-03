import { d as defineEventHandler, f as readMultipartFormData, c as createError } from '../../../nitro/nitro.mjs';
import { a as xlsxExports } from '../../../_/xlsx.mjs';
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

function parseHppSheet(buffer) {
  const wb = xlsxExports.read(buffer, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rawRows = xlsxExports.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (rawRows.length < 2) return [];
  const headerRow = rawRows[0].map((h) => String(h).trim().toLowerCase());
  const skuIdIdx = headerRow.indexOf("sku_id");
  const hppIdx = headerRow.indexOf("harga_hpp");
  if (skuIdIdx === -1 || hppIdx === -1) {
    throw new Error("Header kolom tidak valid. Pastikan file menggunakan template yang diunduh dari sistem.");
  }
  return rawRows.slice(1).filter((row) => row[skuIdIdx] && String(row[skuIdIdx]).trim() !== "").map((row) => {
    var _a;
    return {
      skuId: String(row[skuIdIdx]).trim(),
      hpp: parseFloat(String((_a = row[hppIdx]) != null ? _a : "0")) || 0
    };
  });
}
const hppImport_post = defineEventHandler(async (event) => {
  var _a, _b;
  const payload = await requireAuth(event);
  const formData = await readMultipartFormData(event);
  if (!formData) throw createError({ statusCode: 400, message: "Form data is required" });
  const filePart = formData.find((f) => f.name === "file");
  const storeIdPart = formData.find((f) => f.name === "storeId");
  if (!(filePart == null ? void 0 : filePart.data)) throw createError({ statusCode: 400, message: "File is required" });
  if (!(storeIdPart == null ? void 0 : storeIdPart.data)) throw createError({ statusCode: 400, message: "storeId is required" });
  const storeId = new TextDecoder().decode(storeIdPart.data).trim();
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Forbidden" });
  let rows;
  try {
    rows = parseHppSheet(filePart.data);
  } catch (err) {
    const e = err;
    throw createError({ statusCode: 400, message: (_a = e.message) != null ? _a : "Gagal membaca file Excel" });
  }
  if (rows.length === 0) {
    throw createError({ statusCode: 400, message: "File tidak memiliki data HPP" });
  }
  const skuIds = rows.map((r) => r.skuId);
  const existingSkus = await prisma.sku.findMany({
    where: { id: { in: skuIds }, storeId },
    select: { id: true }
  });
  const validIds = new Set(existingSkus.map((s) => s.id));
  let updated = 0;
  let skipped = 0;
  const errors = [];
  for (const row of rows) {
    if (!validIds.has(row.skuId)) {
      skipped++;
      continue;
    }
    if (row.hpp < 0) {
      errors.push(`SKU ${row.skuId}: HPP tidak boleh negatif`);
      continue;
    }
    try {
      await prisma.sku.update({
        where: { id: row.skuId },
        data: { hpp: row.hpp }
      });
      updated++;
    } catch (err) {
      const e = err;
      errors.push(`SKU ${row.skuId}: ${(_b = e.message) != null ? _b : "Unknown error"}`);
    }
  }
  return {
    success: true,
    updated,
    skipped,
    total: rows.length,
    errors
  };
});

export { hppImport_post as default };
//# sourceMappingURL=hpp-import.post.mjs.map
