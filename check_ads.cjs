const XLSX = require('xlsx');
const wb = XLSX.readFile('data/datatitktok/tiktok_ads.xlsx');
console.log('Sheets:', wb.SheetNames);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
rows.slice(0, 5).forEach(function(r, i) { console.log('Row', i, JSON.stringify(r)); });
