import * as XLSX from "xlsx";
import * as fs from "fs";

XLSX.set_fs(fs);

const SOURCE = process.argv[2] ?? "scripts/seguimiento.xlsx";
const OUTPUT = "C:/Proyectos/control-vencimientos-importar.xlsx";

function excelDateToISO(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value < 20000 || value > 80000) return null;
    const ms = Date.UTC(1899, 11, 30) + Math.round(value) * 86_400_000;
    return new Date(ms).toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    const m = value.trim().match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
    if (m) {
      let y = parseInt(m[3], 10);
      if (y < 100) y += 2000;
      const iso = `${y}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
      return iso >= "1995-01-01" && iso <= "2100-12-31" ? iso : null;
    }
  }
  return null;
}

const CATEGORY_RULES = [
  [/TESTIMONIO|PODER|CONSTANCIA/, "testimonio-poder"],
  [/ALQUILER|ARRENDAMIENTO/, "contrato-alquiler"],
  [/MATRICULA|SEPREC/i, "matricula-comercio"],
  [/IMPUESTOS NAC|NIT\b/i, "nit-padron"],
  [/PATENTE|LICENCIA/i, "licencia-funcionamiento"],
  [/SOAT/i, "soat"],
  [/\bRTV\b|\bITV\b|REVISTA TEC|REVISI[OÓ]N TEC/i, "rtv"],
  [/P[OÓ]LIZA|POLIZA|SEGURO/i, "poliza-seguro"],
  [/SANITARI|SENASAG/i, "registro-sanitario"],
  [/MARCA|SENAPI/i, "marca-senapi"],
  [/CONTRATO/i, "contrato-alquiler"],
];

function mapCategoria(tipo) {
  for (const [re, id] of CATEGORY_RULES) {
    if (re.test(tipo)) return id;
  }
  return tipo.trim().replace(/\s+/g, " ");
}

function daysUntil(iso) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function estadoLabel(days) {
  if (days < 0) return "Vencido";
  if (days <= 2) return "Crítico · ≤2 días";
  if (days <= 30) return "Alerta · ≤30 días";
  if (days <= 40) return "Aviso · ≤40 días";
  if (days <= 60) return "Seguimiento · ≤60 días";
  return "Vigente";
}

const clean = (v) => String(v ?? "").replace(/\s+/g, " ").trim();
const isNoise = (s) =>
  !s ||
  /^(AD-IT|Matriz de Seguimiento|Administración$|Versión|Pagina|Registro$)/i.test(s);

const wb = XLSX.readFile(SOURCE);
const outRows = [];
let skippedNoDate = 0;
let skippedEmpty = 0;

for (const sheetName of ["Documentos Societarios V2", "Contratos V2"]) {
  const ws = wb.Sheets[sheetName];
  if (!ws) continue;
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  let carryTipo = "";
  let imported = 0;

  for (const row of rows.slice(4)) {
    const cells = Array.isArray(row) ? row : [];
    const tipo = clean(cells[0]);
    const desc = clean(cells[1]);
    if (!desc) {
      if (tipo && !isNoise(tipo)) carryTipo = tipo.replace(/^\d+\.\s*/, "");
      skippedEmpty++;
      continue;
    }
    const vencimiento =
      excelDateToISO(cells[4]) ?? excelDateToISO(cells[3]);
    if (!vencimiento) {
      skippedNoDate++;
      continue;
    }
    const categoriaBase = tipo || carryTipo;
    const notasParts = [
      categoriaBase ? `Tipo original: ${categoriaBase}` : "",
      clean(cells[3]) ? `Vigencia declarada: ${clean(cells[3])}` : "",
      clean(cells[9]) ? `Estado en Excel: ${clean(cells[9])}` : "",
      clean(cells[7]) ? `Obs.: ${clean(cells[7])}` : "",
      clean(cells[8]) ? `Ubicación física: ${clean(cells[8])}` : "",
    ].filter(Boolean);
    const days = daysUntil(vencimiento);
    outRows.push([
      "Documento legal",
      mapCategoria(categoriaBase),
      desc,
      clean(cells[5]),
      "",
      "Administración",
      vencimiento,
      days,
      estadoLabel(days),
      notasParts.join(" · ").slice(0, 500),
    ]);
    imported++;
  }
  console.log(`${sheetName}: ${imported} registros importados`);
}

console.log(`Sin fecha utilizable (omitidos): ${skippedNoDate}`);
console.log(`Filas vacías/de sección: ${skippedEmpty}`);

const HEADERS = [
  "Área",
  "Categoría",
  "Nombre",
  "Detalle / Número",
  "Entidad o Emisor",
  "Responsable",
  "Vencimiento",
  "Días restantes",
  "Estado",
  "Notas",
];
const wsOut = XLSX.utils.aoa_to_sheet([HEADERS, ...outRows]);
wsOut["!cols"] = [
  { wch: 16 },
  { wch: 28 },
  { wch: 42 },
  { wch: 26 },
  { wch: 14 },
  { wch: 16 },
  { wch: 12 },
  { wch: 13 },
  { wch: 18 },
  { wch: 60 },
];
const wbOut = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbOut, wsOut, "Vencimientos");
XLSX.writeFile(wbOut, OUTPUT);
console.log(`\nGenerado: ${OUTPUT} (${outRows.length} registros)`);
