import * as XLSX from "xlsx";
import * as fs from "fs";

XLSX.set_fs(fs);

const wb = XLSX.readFile("C:/Proyectos/control-vencimientos-importar.xlsx");
const ws = wb.Sheets["Vencimientos"];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

console.log("Total filas:", rows.length - 1);
console.log("\n--- Muestra ---");
for (const r of rows.slice(1, 9)) {
  console.log(
    `${r[6]} | ${String(r[8]).padEnd(18)} | ${String(r[1]).slice(0, 24).padEnd(24)} | ${String(r[2]).slice(0, 42)}`
  );
}

const dias = rows.slice(1).map((r) => r[7]);
const vencidos = dias.filter((d) => d < 0).length;
const criticos = dias.filter((d) => d >= 0 && d <= 2).length;
const mes = dias.filter((d) => d > 2 && d <= 30).length;
const resto = dias.filter((d) => d > 30).length;
console.log(`\nVencidos: ${vencidos} | Criticos (<=2d): ${criticos} | <=30d: ${mes} | >30d: ${resto}`);

const anios = {};
for (const r of rows.slice(1)) {
  const y = String(r[6]).slice(0, 4);
  anios[y] = (anios[y] ?? 0) + 1;
}
console.log("Vencimientos por año:", JSON.stringify(anios));
