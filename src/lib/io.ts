import * as XLSX from "xlsx";
import type { Area, EnrichedItem, TrackItem } from "../types";
import { addDaysISO, statusFor } from "./status";
import { categoryById } from "./catalog";

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

function areaLabel(area: Area): string {
  return area === "legal" ? "Documento legal" : "Mantenimiento";
}

function parseArea(text: string): Area | null {
  const t = text.trim().toLowerCase();
  if (t.startsWith("doc")) return "legal";
  if (t.startsWith("mant")) return "mantenimiento";
  return null;
}

export function exportToExcel(items: EnrichedItem[]): void {
  const rows = items.map((it) => [
    areaLabel(it.area),
    it.categoria,
    it.nombre,
    it.detalle,
    it.emisor,
    it.responsable,
    it.vencimiento,
    it.days,
    statusFor(it.days).label,
    it.notas,
  ]);
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows]);
  ws["!cols"] = [
    { wch: 18 },
    { wch: 34 },
    { wch: 38 },
    { wch: 22 },
    { wch: 26 },
    { wch: 22 },
    { wch: 14 },
    { wch: 14 },
    { wch: 20 },
    { wch: 40 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vencimientos");
  XLSX.writeFile(wb, `control-vencimientos-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export async function importFromExcel(buffer: ArrayBuffer): Promise<TrackItem[]> {
  const wb = XLSX.read(buffer);
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("sin hojas");
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: "" });
  const startRow =
    aoa.findIndex(
      (row) =>
        Array.isArray(row) && String(row[0] ?? "").trim().toLowerCase() === "área"
    ) + 1 || 1;
  const items: TrackItem[] = [];
  for (const row of aoa.slice(startRow)) {
    if (!Array.isArray(row)) continue;
    const area = parseArea(String(row[0] ?? ""));
    const vencimiento = String(row[6] ?? "").trim();
    const nombre = String(row[2] ?? "").trim();
    if (!area || !nombre) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(vencimiento)) continue;
    const categoriaText = String(row[1] ?? "").trim();
    const cat = categoryById(categoriaText);
    items.push({
      id: crypto.randomUUID(),
      area,
      categoria: cat ? cat.id : categoriaText,
      nombre,
      detalle: String(row[3] ?? "").trim(),
      emisor: String(row[4] ?? "").trim(),
      responsable: String(row[5] ?? "").trim(),
      vencimiento,
      notas: String(row[9] ?? "").trim(),
    });
  }
  if (items.length === 0) throw new Error("sin filas válidas");
  return items;
}

export function buildExamples(): TrackItem[] {
  const mk = (
    area: Area,
    categoria: string,
    nombre: string,
    detalle: string,
    emisor: string,
    responsable: string,
    days: number
  ): TrackItem => ({
    id: crypto.randomUUID(),
    area,
    categoria,
    nombre,
    detalle,
    emisor,
    responsable,
    vencimiento: addDaysISO(days),
    notas: "",
  });
  return [
    mk("legal", "matricula-comercio", "Matrícula de Comercio SRL", "Mat. 00123456", "Fundempresa", "Administración", -5),
    mk("legal", "soat", "SOAT Camioneta flota", "Placa 123-XYZ", "Aseguradora", "Servicios Generales", 2),
    mk("legal", "poliza-seguro", "Póliza todo riesgo oficina central", "Póliza 88-4521", "Aseguradora", "Administración", 28),
    mk("legal", "contrato-alquiler", "Alquiler depósito zona sur", "Contrato 2024-11", "Propietario", "Legal", 40),
    mk("mantenimiento", "extintores", "Recarga extintores sede central", "48 unidades", "Empresa certificada", "Seguridad", 55),
    mk("mantenimiento", "aire-ac", "Limpieza A/A pisos 3-5", "12 equipos", "Proveedor HVAC", "Mantenimiento", 90),
  ];
}

export function describeImport(items: TrackItem[]): string {
  const legal = items.filter((i) => i.area === "legal").length;
  const mant = items.length - legal;
  return `${items.length} registro(s): ${legal} documento(s) legal(es), ${mant} mantenimiento(s).`;
}
