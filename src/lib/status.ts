import type { StatusInfo } from "../types";

export const THRESHOLDS = [60, 40, 30, 2];

const MS_DAY = 86_400_000;

export function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export function daysUntil(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00`);
  return Math.round((target.getTime() - startOfToday().getTime()) / MS_DAY);
}

export function todayISO(): string {
  return startOfToday().toISOString().slice(0, 10);
}

export function addDaysISO(days: number): string {
  const d = startOfToday();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function formatLongDate(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDays(days: number): string {
  if (days < 0) return `venció hace ${Math.abs(days)} d`;
  if (days === 0) return "vence hoy";
  if (days === 1) return "vence mañana";
  return `en ${days} días`;
}

export function statusFor(days: number): StatusInfo {
  if (days < 0) {
    return { key: "vencido", label: "Vencido", className: "st-vencido" };
  }
  if (days <= 2) {
    return { key: "critico", label: "Crítico · ≤2 días", className: "st-critico" };
  }
  if (days <= 30) {
    return { key: "mes30", label: "Alerta · ≤30 días", className: "st-mes30" };
  }
  if (days <= 40) {
    return { key: "dias40", label: "Aviso · ≤40 días", className: "st-dias40" };
  }
  if (days <= 60) {
    return { key: "dias60", label: "Seguimiento · ≤60 días", className: "st-dias60" };
  }
  return { key: "vigente", label: "Vigente", className: "st-vigente" };
}
