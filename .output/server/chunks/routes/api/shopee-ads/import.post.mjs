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
  if (v === null || v === void 0 || v === "" || v === "-") return 0;
  return Number(v) || 0;
}
function parseDMY(s) {
  if (!s) return null;
  const parts = s.trim().split(/[\/\-]/);
  if (parts.length < 3) return null;
  const [dd, mm, yyyy] = parts;
  const d = /* @__PURE__ */ new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`);
  return isNaN(d.getTime()) ? null : d;
}
function parsePeriodStart(s) {
  const start = s.split(" - ")[0].trim();
  return parseDMY(start);
}
const import_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const user = await requireAuth(event);
  const formData = await readMultipartFormData(event);
  const storeId = (_a = formData == null ? void 0 : formData.find((f) => f.name === "storeId")) == null ? void 0 : _a.data.toString();
  const files = (_b = formData == null ? void 0 : formData.filter((f) => f.name === "files")) != null ? _b : [];
  if (!storeId) throw createError({ statusCode: 400, message: "storeId diperlukan" });
  if (!files.length) throw createError({ statusCode: 400, message: "Tidak ada file yang dikirim" });
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Toko tidak ditemukan" });
  let totalImported = 0;
  let totalSkipped = 0;
  let totalRows = 0;
  const allErrors = [];
  for (const file of files) {
    const fileName = (_c = file.filename) != null ? _c : "file";
    let allRows;
    try {
      const wb = XLSX.read(file.data, { type: "buffer" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      allRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    } catch {
      allErrors.push(`${fileName}: Gagal membaca file`);
      continue;
    }
    const periodeRow = allRows.find((r) => String(r[0]).trim().toLowerCase() === "periode");
    const periodeStr = periodeRow ? String(periodeRow[1]).trim() : "";
    const fileDate = parsePeriodStart(periodeStr);
    if (!fileDate) {
      allErrors.push(`${fileName}: Baris "Periode" tidak ditemukan atau format salah`);
      continue;
    }
    const headerRowIdx = allRows.findIndex((r) => String(r[0]).trim().toLowerCase() === "urutan");
    if (headerRowIdx < 0) {
      allErrors.push(`${fileName}: Baris header tidak ditemukan`);
      continue;
    }
    const headers = allRows[headerRowIdx].map((h) => String(h).trim());
    const col = (name) => headers.findIndex((h) => h === name);
    const C = {
      AD_NAME: col("Nama Iklan"),
      AD_TYPE: col("Jenis Iklan"),
      PRODUCT: col("Kode Produk"),
      BIDDING: col("Mode Bidding"),
      PLACEMENT: col("Penempatan Iklan"),
      IMPRESSIONS: col("Dilihat"),
      CLICKS: col("Jumlah Klik"),
      CONVERSIONS: col("Konversi"),
      REVENUE: col("Omzet Penjualan"),
      COST: col("Biaya")
    };
    const dataRows = allRows.slice(headerRowIdx + 1).filter((r) => {
      const row = r;
      return row[0] !== "" && row[0] !== null && row[0] !== void 0;
    });
    totalRows += dataRows.length;
    for (const _row of dataRows) {
      const row = _row;
      const adName = str(row, C.AD_NAME);
      if (!adName) continue;
      try {
        const existing = await prisma.shopeeAd.findFirst({
          where: { storeId, date: fileDate, adName }
        });
        const data = {
          storeId,
          date: fileDate,
          adName,
          adType: str(row, C.AD_TYPE),
          productCode: str(row, C.PRODUCT),
          biddingMode: str(row, C.BIDDING),
          adPlacement: str(row, C.PLACEMENT),
          impressions: Math.round(num(row, C.IMPRESSIONS)),
          clicks: Math.round(num(row, C.CLICKS)),
          conversions: Math.round(num(row, C.CONVERSIONS)),
          grossRevenue: num(row, C.REVENUE),
          cost: num(row, C.COST)
        };
        if (existing) {
          await prisma.shopeeAd.update({ where: { id: existing.id }, data });
          totalSkipped++;
        } else {
          await prisma.shopeeAd.create({ data });
          totalImported++;
        }
      } catch (e) {
        allErrors.push(`${fileName} / ${adName}: ${(_d = e.message) != null ? _d : "Error"}`);
      }
    }
  }
  return {
    success: true,
    imported: totalImported,
    skipped: totalSkipped,
    total: totalRows,
    errors: allErrors
  };
});

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
