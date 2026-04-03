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

function parseTiktokSheet(buffer) {
  const wb = xlsxExports.read(buffer, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rawRows = xlsxExports.utils.sheet_to_json(ws, { header: 1, defval: "" });
  const keys = rawRows[0];
  const dataRows = rawRows.slice(5);
  const colIndex = {
    product_id: keys.indexOf("product_id"),
    category: keys.indexOf("category"),
    product_name: keys.indexOf("product_name"),
    sku_id: keys.indexOf("sku_id"),
    variation_value: keys.indexOf("variation_value"),
    price: keys.indexOf("price"),
    seller_sku: keys.indexOf("seller_sku")
  };
  return dataRows.filter((row) => row[colIndex.product_id] && row[colIndex.product_id] !== "").map((row) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
      product_id: String((_a = row[colIndex.product_id]) != null ? _a : "").trim(),
      category: String((_b = row[colIndex.category]) != null ? _b : "").trim(),
      product_name: String((_c = row[colIndex.product_name]) != null ? _c : "").trim(),
      sku_id: String((_d = row[colIndex.sku_id]) != null ? _d : "").trim(),
      variation_value: String((_e = row[colIndex.variation_value]) != null ? _e : "").trim(),
      price: (_f = row[colIndex.price]) != null ? _f : 0,
      seller_sku: String((_g = row[colIndex.seller_sku]) != null ? _g : "").trim()
    };
  });
}
function buildVariants(variationValue, variantTypes) {
  if (!variationValue || variantTypes.length === 0) return {};
  const parts = variationValue.split(", ");
  const result = {};
  variantTypes.forEach((type, i) => {
    var _a, _b;
    const val = (_b = (_a = parts[i]) == null ? void 0 : _a.trim()) != null ? _b : "";
    if (val && val !== "-") result[type] = val;
  });
  return result;
}
function detectVariantTypes(rows) {
  const maxParts = Math.max(
    ...rows.map((r) => {
      if (!r.variation_value) return 0;
      const parts = r.variation_value.split(", ");
      const allDash = parts.every((p) => p.trim() === "-");
      if (allDash) return 0;
      return parts.length;
    })
  );
  if (maxParts === 0) return [];
  if (maxParts === 1) return ["Variasi"];
  return ["Variasi 1", "Variasi 2"];
}
function stripCategoryId(category) {
  return category.replace(/\s*\(\d+\)\s*$/, "").trim();
}
const import_post = defineEventHandler(async (event) => {
  var _a;
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
    rows = parseTiktokSheet(filePart.data);
  } catch {
    throw createError({ statusCode: 400, message: "Gagal membaca file Excel. Pastikan format file sesuai template TikTok." });
  }
  if (rows.length === 0) {
    throw createError({ statusCode: 400, message: "File tidak memiliki data produk" });
  }
  const productMap = /* @__PURE__ */ new Map();
  for (const row of rows) {
    if (!productMap.has(row.product_id)) productMap.set(row.product_id, []);
    productMap.get(row.product_id).push(row);
  }
  let imported = 0;
  let updated = 0;
  const errors = [];
  for (const [mpProductId, skuRows] of productMap) {
    const firstRow = skuRows[0];
    const variantTypes = detectVariantTypes(skuRows);
    const category = stripCategoryId(firstRow.category);
    try {
      const product = await prisma.product.upsert({
        where: { mpProductId_storeId: { mpProductId, storeId } },
        create: {
          mpProductId,
          name: firstRow.product_name,
          category: category || null,
          status: "ACTIVE",
          variantTypes,
          storeId
        },
        update: {
          name: firstRow.product_name,
          category: category || null,
          variantTypes
        }
      });
      let isNew = product.createdAt.getTime() >= Date.now() - 3e3;
      for (const row of skuRows) {
        if (!row.sku_id) continue;
        const variants = buildVariants(row.variation_value, variantTypes);
        const price = typeof row.price === "number" ? row.price : parseFloat(String(row.price)) || 0;
        await prisma.sku.upsert({
          where: { mpSkuId_storeId: { mpSkuId: row.sku_id, storeId } },
          create: {
            mpSkuId: row.sku_id,
            sku: row.seller_sku,
            price,
            hpp: 0,
            variants,
            productId: product.id,
            storeId
          },
          update: {
            sku: row.seller_sku,
            price,
            variants
          }
        });
      }
      if (isNew) imported++;
      else updated++;
    } catch (err) {
      const e = err;
      errors.push(`Produk ${firstRow.product_name}: ${(_a = e.message) != null ? _a : "Unknown error"}`);
    }
  }
  return {
    success: true,
    imported,
    updated,
    total: productMap.size,
    skuCount: rows.length,
    errors
  };
});

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
