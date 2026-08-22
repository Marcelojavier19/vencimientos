import * as XLSX from "xlsx";
import * as fs from "fs";

XLSX.set_fs(fs);

const path = process.argv[2];
const wb = XLSX.readFile(path);
console.log("HOJAS:", JSON.stringify(wb.SheetNames));

for (const name of wb.SheetNames.slice(7)) {
  const ws = wb.Sheets[name];
  const ref = ws["!ref"] ?? "A1";
  const range = XLSX.utils.decode_range(ref);
  console.log(`\n===== HOJA: ${name} | filas ${range.e.r + 1} x cols ${range.e.c + 1} =====`);
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  const preview = rows.slice(0, 12);
  for (let i = 0; i < preview.length; i++) {
    const cells = preview[i].map((c) => String(c).replace(/\s+/g, " ").trim().slice(0, 28));
    if (cells.every((c) => c === "")) continue;
    console.log(`F${i}:`, JSON.stringify(cells));
  }
}
