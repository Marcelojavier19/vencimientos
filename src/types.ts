export type Area = "legal" | "mantenimiento";

export interface TrackItem {
  id: string;
  area: Area;
  categoria: string;
  nombre: string;
  detalle: string;
  emisor: string;
  responsable: string;
  vencimiento: string;
  notas: string;
}

export type StatusKey =
  | "vencido"
  | "critico"
  | "mes30"
  | "dias40"
  | "dias60"
  | "vigente";

export interface StatusInfo {
  key: StatusKey;
  label: string;
  className: string;
}

export interface EnrichedItem extends TrackItem {
  days: number;
  status: StatusInfo;
}
