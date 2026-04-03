import { d as defineEventHandler, a as getQuery, c as createError, h as setResponseHeader, i as send } from '../../../nitro/nitro.mjs';
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

const hppExport_get = defineEventHandler(async (event) => {
  var _a, _b;
  const payload = await requireAuth(event);
  const query = getQuery(event);
  const storeId = String((_a = query.storeId) != null ? _a : "").trim();
  if (!storeId) throw createError({ statusCode: 400, message: "storeId is required" });
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Forbidden" });
  const productIdsRaw = String((_b = query.productIds) != null ? _b : "").trim();
  const productIds = productIdsRaw ? productIdsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const skus = await prisma.sku.findMany({
    where: {
      storeId,
      ...productIds.length > 0 ? { productId: { in: productIds } } : {}
    },
    include: {
      product: { select: { name: true, variantTypes: true } }
    },
    orderBy: [{ product: { name: "asc" } }, { createdAt: "asc" }]
  });
  const headerRow = ["sku_id", "nama_produk", "sku", "variasi", "harga_hpp"];
  const dataRows = skus.map((s) => {
    var _a2;
    const variantTypes = (_a2 = s.product.variantTypes) != null ? _a2 : [];
    const variants = s.variants;
    const variasiStr = variantTypes.length > 0 ? variantTypes.map((t) => {
      var _a3;
      return (_a3 = variants[t]) != null ? _a3 : "";
    }).filter(Boolean).join(", ") : "";
    return [
      s.id,
      s.product.name,
      s.sku,
      variasiStr,
      parseFloat(String(s.hpp))
    ];
  });
  const ws = xlsxExports.utils.aoa_to_sheet([headerRow, ...dataRows]);
  ws["!cols"] = [
    { wch: 38 },
    // sku_id
    { wch: 40 },
    // nama_produk
    { wch: 20 },
    // sku
    { wch: 25 },
    // variasi
    { wch: 15 }
    // harga_hpp
  ];
  const wb = xlsxExports.utils.book_new();
  xlsxExports.utils.book_append_sheet(wb, ws, "HPP");
  const buffer = xlsxExports.write(wb, { type: "buffer", bookType: "xlsx" });
  setResponseHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  setResponseHeader(event, "Content-Disposition", 'attachment; filename="hpp_template.xlsx"');
  setResponseHeader(event, "Cache-Control", "no-store");
  await send(event, buffer);
});

export { hppExport_get as default };
//# sourceMappingURL=hpp-export.get.mjs.map
