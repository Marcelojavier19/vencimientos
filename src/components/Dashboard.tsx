import type { EnrichedItem } from "../types";
import { formatDays, formatLongDate } from "../lib/status";
import { categoryById } from "../lib/catalog";

interface Props {
  items: EnrichedItem[];
  onEdit: (item: EnrichedItem) => void;
}

interface CardDef {
  key: string;
  label: string;
  hint: string;
  className: string;
}

const CARDS: CardDef[] = [
  { key: "vencido", label: "Vencidos", hint: "requieren acción inmediata", className: "st-vencido" },
  { key: "critico", label: "Críticos", hint: "≤ 2 días", className: "st-critico" },
  { key: "mes30", label: "En alerta", hint: "≤ 30 días", className: "st-mes30" },
  { key: "dias40", label: "Aviso", hint: "31 – 40 días", className: "st-dias40" },
  { key: "dias60", label: "Seguimiento", hint: "41 – 60 días", className: "st-dias60" },
  { key: "vigente", label: "Vigentes", hint: "> 60 días", className: "st-vigente" },
];

export default function Dashboard({ items, onEdit }: Props) {
  const counts = new Map<string, number>();
  for (const it of items) {
    counts.set(it.status.key, (counts.get(it.status.key) ?? 0) + 1);
  }
  const urgent = items
    .filter((it) => it.status.key !== "vigente")
    .slice(0, 12);

  return (
    <section>
      <div className="stats-grid">
        {CARDS.map((c) => (
          <div key={c.key} className={`stat-card ${c.className}`}>
            <span className="stat-num">{counts.get(c.key) ?? 0}</span>
            <span className="stat-label">{c.label}</span>
            <span className="stat-hint">{c.hint}</span>
          </div>
        ))}
      </div>

      <h3 className="section-title">
        Atención inmediata{" "}
        {urgent.length > 0 && <span className="count-pill">{urgent.length}</span>}
      </h3>

      {urgent.length === 0 ? (
        <p className="all-good">
          Todo en orden: ningún documento o mantenimiento entra en la ventana de
          alerta de 60 días.
        </p>
      ) : (
        <ul className="dash-list">
          {urgent.map((it) => (
            <li key={it.id} className="dash-row">
              <span className={`chip ${it.status.className}`}>{formatDays(it.days)}</span>
              <button type="button" className="dash-main" onClick={() => onEdit(it)}>
                <strong>{it.nombre}</strong>
                <span className="dash-meta">
                  {categoryById(it.categoria)?.label ?? it.categoria}
                  {it.emisor ? ` · ${it.emisor}` : ""} · vence {formatLongDate(it.vencimiento)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
