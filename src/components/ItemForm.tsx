import { useState } from "react";
import type { Area, TrackItem } from "../types";
import { categoriesByArea, categoryById } from "../lib/catalog";

interface Props {
  initial: TrackItem | null;
  onSave: (item: TrackItem) => void;
  onClose: () => void;
}

export default function ItemForm({ initial, onSave, onClose }: Props) {
  const [area, setArea] = useState<Area>(initial?.area ?? "legal");
  const [categoria, setCategoria] = useState(initial?.categoria ?? "");
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [detalle, setDetalle] = useState(initial?.detalle ?? "");
  const [emisor, setEmisor] = useState(initial?.emisor ?? "");
  const [responsable, setResponsable] = useState(initial?.responsable ?? "");
  const [vencimiento, setVencimiento] = useState(initial?.vencimiento ?? "");
  const [notas, setNotas] = useState(initial?.notas ?? "");

  const cats = categoriesByArea(area);
  const selectedCat = categoryById(categoria);
  const valid = nombre.trim() !== "" && /^\d{4}-\d{2}-\d{2}$/.test(vencimiento);

  const changeArea = (next: Area) => {
    setArea(next);
    setCategoria("");
    if (!initial) setEmisor("");
  };

  const changeCategoria = (id: string) => {
    setCategoria(id);
    if (!initial) {
      const cat = categoryById(id);
      if (cat) setEmisor(cat.entidad);
    }
  };

  const submit = () => {
    if (!valid) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      area,
      categoria,
      nombre: nombre.trim(),
      detalle: detalle.trim(),
      emisor: emisor.trim(),
      responsable: responsable.trim(),
      vencimiento,
      notas: notas.trim(),
    });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initial ? "Editar registro" : "Nuevo registro"}</h3>

        <div className="form-grid">
          <label className="field">
            <span>Tipo</span>
            <select
              value={area}
              onChange={(e) => changeArea(e.target.value as Area)}
            >
              <option value="legal">Documento legal</option>
              <option value="mantenimiento">Mantenimiento preventivo</option>
            </select>
          </label>

          <label className="field">
            <span>Categoría</span>
            <select value={categoria} onChange={(e) => changeCategoria(e.target.value)}>
              <option value="">— Seleccione —</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
              <option value="">Otra (personalizada)</option>
            </select>
          </label>

          <label className="field wide">
            <span>Nombre del registro *</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej.: Póliza todo riesgo sede central"
            />
          </label>

          <label className="field">
            <span>Detalle / Número</span>
            <input
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="N° de póliza, placa, contrato…"
            />
          </label>

          <label className="field">
            <span>Entidad o Emisor</span>
            <input
              value={emisor}
              onChange={(e) => setEmisor(e.target.value)}
              placeholder="Fundempresa, Municipio, aseguradora…"
            />
          </label>

          <label className="field">
            <span>Responsable interno</span>
            <input
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              placeholder="Área o persona a cargo"
            />
          </label>

          <label className="field">
            <span>Fecha de vencimiento *</span>
            <input
              type="date"
              value={vencimiento}
              onChange={(e) => setVencimiento(e.target.value)}
            />
          </label>

          <label className="field wide">
            <span>Notas</span>
            <textarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones, costo de renovación, gestor externo…"
            />
          </label>
        </div>

        {selectedCat && (
          <div className="tips-box">
            <strong>Qué debe verificar en este documento:</strong>
            <ul>
              {selectedCat.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="alert-note">
          Recibirá avisos automáticos a los <b>60</b>, <b>40</b>, <b>30</b> y{" "}
          <b>2</b> días antes de la fecha de vencimiento.
        </p>

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!valid}
            onClick={submit}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
