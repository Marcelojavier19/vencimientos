import type { EnrichedItem } from "../types";
import { formatDays } from "../lib/status";

interface Props {
  alerts: EnrichedItem[];
  onDismiss: () => void;
}

export default function AlertBanner({ alerts, onDismiss }: Props) {
  if (alerts.length === 0) return null;
  const expired = alerts.filter((a) => a.days < 0).length;
  return (
    <div className="banner-alert" role="alert">
      <div>
        <strong>
          {alerts.length} vencimiento(s) dentro de la ventana de alerta
          {expired > 0 ? ` · ${expired} ya vencido(s)` : ""}
        </strong>
        <ul>
          {alerts.slice(0, 5).map((a) => (
            <li key={a.id}>
              {a.nombre} — {formatDays(a.days)}
            </li>
          ))}
          {alerts.length > 5 && <li>…y {alerts.length - 5} más (ver Registros)</li>}
        </ul>
      </div>
      <button type="button" className="banner-close" onClick={onDismiss}>
        Ocultar hoy
      </button>
    </div>
  );
}
