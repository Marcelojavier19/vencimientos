import { Fragment, useState } from "react";
import type { EnrichedItem } from "../types";
import { formatDays, formatLongDate } from "../lib/status";
import { categoryById } from "../lib/catalog";

interface Props {
  items: EnrichedItem[];
  onEdit: (item: EnrichedItem) => void;
  onDelete: (item: EnrichedItem) => void;
}

export default function ItemTable({ items, onEdit, onDelete }: Props) {
  const [openTips, setOpenTips] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="empty-state">
        No hay registros que coincidan con el filtro o la búsqueda.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="items-table">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Registro</th>
            <th>Categoría</th>
            <th>Entidad / Emisor</th>
            <th>Responsable</th>
            <th>Vencimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => {
            const cat = categoryById(it.categoria);
            return (
              <Fragment key={it.id}>
                <tr>
                  <td>
                    <span className={`chip ${it.status.className}`}>
                      {formatDays(it.days)}
                    </span>
                  </td>
                  <td>
                    <strong>{it.nombre}</strong>
                    {it.detalle && <span className="sub">{it.detalle}</span>}
                  </td>
                  <td>{cat?.label ?? it.categoria}</td>
                  <td>{it.emisor || "—"}</td>
                  <td>{it.responsable || "—"}</td>
                  <td>{formatLongDate(it.vencimiento)}</td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() => setOpenTips(openTips === it.id ? null : it.id)}
                    >
                      Consejos
                    </button>
                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() => onEdit(it)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-danger-ghost"
                      onClick={() => onDelete(it)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
                {openTips === it.id &&
                  (cat ? (
                    <tr className="tips-row">
                      <td colSpan={7}>
                        <div className="tips-box inline">
                          <strong>Verificación sugerida — {cat.label}:</strong>
                          <ul>
                            {cat.tips.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr className="tips-row">
                      <td colSpan={7}>
                        Categoría personalizada: sin consejos precargados.
                      </td>
                    </tr>
                  ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
