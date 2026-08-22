import type { TrackItem } from "../types";

const ITEMS_KEY = "cv:items:v1";
const NOTIFIED_KEY = "cv:notified:v1";

function isTrackItem(value: unknown): value is TrackItem {
  if (typeof value !== "object" || value === null) return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    (o.area === "legal" || o.area === "mantenimiento") &&
    typeof o.categoria === "string" &&
    typeof o.nombre === "string" &&
    typeof o.vencimiento === "string"
  );
}

export function loadItems(): TrackItem[] {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTrackItem);
  } catch {
    return [];
  }
}

export function saveItems(items: TrackItem[]): void {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch {
    /* almacenamiento lleno o no disponible */
  }
}

type NotifiedMap = Record<string, true>;

export function loadNotified(): NotifiedMap {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: NotifiedMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (v === true) out[k] = true;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveNotifiedKeys(keys: string[], map: NotifiedMap): void {
  for (const k of keys) map[k] = true;
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(map));
  } catch {
    /* no crítico */
  }
}
