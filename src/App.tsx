import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { EnrichedItem, TrackItem } from "./types";
import { daysUntil, statusFor, todayISO } from "./lib/status";
import { loadItems, saveItems, loadNotified, saveNotifiedKeys } from "./lib/storage";
import { buildExamples, describeImport, exportToExcel, importFromExcel } from "./lib/io";
import Dashboard from "./components/Dashboard";
import AlertBanner from "./components/AlertBanner";
import ItemTable from "./components/ItemTable";
import ItemForm from "./components/ItemForm";
import "./App.css";

type View = "panel" | "registros";
type Filter = "todos" | "vencidos" | "mes" | "legal" | "mantenimiento";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "vencidos", label: "Vencidos o críticos" },
  { key: "mes", label: "Próximos 30 días" },
  { key: "legal", label: "Documentos legales" },
  { key: "mantenimiento", label: "Mantenimientos" },
];

export default function App() {
  const [items, setItems] = useState<TrackItem[]>(() => loadItems());
  const [view, setView] = useState<View>("panel");
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<TrackItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(false);
  const [flash, setFlash] = useState("");
  const [notifPermission, setNotifPermission] = useState<string>(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => saveItems(items), 300);
    return () => clearTimeout(timer);
  }, [items]);

  const enriched = useMemo<EnrichedItem[]>(
    () =>
      items
        .map((it) => {
          const days = daysUntil(it.vencimiento);
          return { ...it, days, status: statusFor(days) };
        })
        .sort((a, b) => a.days - b.days || a.nombre.localeCompare(b.nombre)),
    [items]
  );

  const alerts = useMemo(
    () => enriched.filter((it) => it.status.key !== "vigente"),
    [enriched]
  );

  useEffect(() => {
    document.title =
      alerts.length > 0
        ? `(${alerts.length}) Control de Vencimientos`
        : "Control de Vencimientos";
  }, [alerts]);

  useEffect(() => {
    if (notifPermission !== "granted") return;
    const today = todayISO();
    const notified = loadNotified();
    const pending = alerts.filter(
      (it) => !notified[`${it.id}|${it.vencimiento}|${today}`]
    );
    if (pending.length === 0) return;
    for (const it of pending.slice(0, 6)) {
      new Notification("Control de Vencimientos", {
        body:
          it.days < 0
            ? `VENCIDO: ${it.nombre} venció el ${it.vencimiento}`
            : `Aviso: ${it.nombre} vence en ${it.days} día(s)`,
        tag: `${it.id}|${today}`,
      });
    }
    saveNotifiedKeys(pending.map((it) => `${it.id}|${it.vencimiento}|${today}`), notified);
  }, [alerts, notifPermission]);

  const requestNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === "granted") setFlash("Notificaciones activadas");
  };

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleSave = (item: TrackItem) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      return exists ? prev.map((p) => (p.id === item.id ? item : p)) : [...prev, item];
    });
    setFormOpen(false);
    setFlash("Registro guardado");
  };

  const handleDelete = (item: EnrichedItem) => {
    if (!window.confirm(`¿Eliminar "${item.nombre}" del registro?`)) return;
    setItems((prev) => prev.filter((p) => p.id !== item.id));
    setFlash("Registro eliminado");
  };

  const clearAll = () => {
    if (!window.confirm("¿Eliminar TODOS los registros? Esta acción no se puede deshacer.")) return;
    setItems([]);
    setFlash("Se eliminaron todos los registros");
  };

  const onImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const imported = await importFromExcel(await file.arrayBuffer());
      setItems((prev) => [...prev, ...imported]);
      setFlash(`Importado: ${describeImport(imported)}`);
    } catch {
      window.alert(
        "No se pudieron leer registros válidos. Verifique que el archivo use las columnas de la exportación (Área, Categoría, Nombre…)."
      );
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((it) => {
      if (
        filter === "vencidos" &&
        it.status.key !== "vencido" &&
        it.status.key !== "critico"
      )
        return false;
      if (filter === "mes" && !(it.days >= 0 && it.days <= 30)) return false;
      if ((filter === "legal" || filter === "mantenimiento") && it.area !== filter)
        return false;
      if (q) {
        const hay = `${it.nombre} ${it.detalle} ${it.emisor} ${it.responsable} ${it.categoria} ${it.notas}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enriched, filter, query]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 4000);
    return () => clearTimeout(t);
  }, [flash]);

  const longToday = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="app-shell">
      <header className="header-top">
        <div className="brand">
          <h1>Control de Vencimientos</h1>
          <span>Documentos legales y mantenimientos · Bolivia</span>
        </div>
        <div className="head-actions">
          <span className="today">{longToday}</span>
          {notifPermission === "default" && (
            <button type="button" className="btn btn-ghost" onClick={requestNotifications}>
              Activar notificaciones
            </button>
          )}
          {notifPermission === "denied" && (
            <span className="notif-warn">Notificaciones bloqueadas en el navegador</span>
          )}
          <button type="button" className="btn btn-primary" onClick={openNew}>
            + Nuevo registro
          </button>
        </div>
      </header>

      <main className="content">
        {view === "panel" && !bannerHidden && (
          <AlertBanner alerts={alerts} onDismiss={() => setBannerHidden(true)} />
        )}

        <nav className="tabs">
          <button
            type="button"
            className={`tab ${view === "panel" ? "active" : ""}`}
            onClick={() => setView("panel")}
          >
            Panel de control
          </button>
          <button
            type="button"
            className={`tab ${view === "registros" ? "active" : ""}`}
            onClick={() => setView("registros")}
          >
            Registros ({items.length})
          </button>
        </nav>

        {flash && <div className="flash">{flash}</div>}

        {items.length === 0 ? (
          <div className="empty-state big">
            <h3>Bienvenida</h3>
            <p>
              Registre sus documentos legales y mantenimientos preventivos para recibir
              avisos a los <b>60</b>, <b>40</b>, <b>30</b> y <b>2</b> días antes del
              vencimiento, con consejos de verificación por tipo de trámite.
            </p>
            <div className="empty-actions">
              <button type="button" className="btn btn-primary" onClick={openNew}>
                Crear primer registro
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setItems(buildExamples())}
              >
                Cargar datos de ejemplo
              </button>
            </div>
          </div>
        ) : view === "panel" ? (
          <>
            <Dashboard items={enriched} onEdit={(it) => { setEditing(it); setFormOpen(true); }} />
            <div className="toolbar">
              <button type="button" className="btn" onClick={() => exportToExcel(enriched)}>
                Exportar a Excel
              </button>
              <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
                Importar Excel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="toolbar">
              <div className="filter-chips">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`fchip ${filter === f.key ? "on" : ""}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <input
                className="search"
                placeholder="Buscar por nombre, número, responsable…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="button" className="btn" onClick={() => exportToExcel(visible)}>
                Exportar a Excel
              </button>
              <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
                Importar Excel
              </button>
              <button type="button" className="btn btn-danger-ghost" onClick={clearAll}>
                Vaciar todo
              </button>
            </div>
            <ItemTable items={visible} onEdit={(it) => { setEditing(it); setFormOpen(true); }} onDelete={handleDelete} />
          </>
        )}
      </main>

      <footer className="footer-note">
        Los datos se guardan localmente en este navegador. Exporte a Excel
        periódicamente como respaldo.
      </footer>

      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={onImportFile} hidden />

      {formOpen && (
        <ItemForm initial={editing} onSave={handleSave} onClose={() => setFormOpen(false)} />
      )}
    </div>
  );
}
