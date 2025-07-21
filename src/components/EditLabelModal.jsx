import React from "react";

const EditLabelModal = ({ open, data, units, backgrounds, onChange, onUnitChange, onBackgroundChange, onSave, onCancel }) => {
  if (!open) return null;
  return (
    <div className="modal-editar-rotulo" style={{ display: "flex" }}>
      <div className="modal-editar-overlay" onClick={onCancel}></div>
      <div className="modal-editar-content">
        <div className="modal-editar-header">
          <h3>Editar rótulo</h3>
          <button className="cerrar-modal-editar" onClick={onCancel}>×</button>
        </div>
        <div className="modal-editar-scroll">
          <form className="formEditarRotulo" autoComplete="off" onSubmit={e => { e.preventDefault(); onSave(); }}>
            <div className="campo-modal">
              <label htmlFor="editarProducto">Producto</label>
              <input type="text" id="editarProducto" name="producto" value={data.producto} onChange={onChange} />
            </div>
            <div className="campo-modal">
              <label htmlFor="editarCodigo">Código</label>
              <input type="text" id="editarCodigo" name="codigo" value={data.codigo} onChange={onChange} />
            </div>
            <div className="campo-modal">
              <label htmlFor="editarActual">Precio actual</label>
              <input type="number" id="editarActual" name="actual" value={data.actual} onChange={onChange} />
            </div>
            <div className="campo-modal">
              <label htmlFor="editarAnterior">Precio anterior</label>
              <input type="number" id="editarAnterior" name="anterior" value={data.anterior} onChange={onChange} />
            </div>
            <div className="campo-modal">
              <label htmlFor="editarPromo">Promoción x cantidad</label>
              <input type="number" id="editarPromo" name="promo" value={data.promo} onChange={onChange} />
            </div>
            <div className="campo-modal" id="campoUnidadesModal">
              <span>Unidad de medida:</span>
              {units.map(unit => (
                <label key={unit.value}>
                  <input
                    type="radio"
                    name="unidad"
                    value={unit.value}
                    checked={data.unidad === unit.value}
                    onChange={onUnitChange}
                  />
                  {unit.label}
                </label>
              ))}
            </div>
            <div className="campo-modal">
              <label htmlFor="editarFondo">Diseño de fondo</label>
              <select id="editarFondo" name="fondo" value={data.fondo} onChange={onBackgroundChange}>
                {backgrounds.map(bg => (
                  <option key={bg.id} value={bg.id}>{bg.name}</option>
                ))}
              </select>
            </div>
            <div className="modal-editar-botones">
              <button type="submit" className="guardar-modal-editar">Guardar</button>
              <button type="button" className="cancelar-modal-editar" onClick={onCancel}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLabelModal; 