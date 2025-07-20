import React from "react";
import { useAppConfig } from "../context/AppConfigContext";

const LabelQueue = ({ queue, zipName, onZipNameChange, onDownloadAll, onClearQueue, onEdit, onDelete }) => {
  const { labels } = useAppConfig();

  const getBackgroundName = (backgroundId) => {
    const background = labels.backgrounds.find(bg => bg.id === backgroundId);
    return background ? background.name : backgroundId;
  };

  return (
    <div className="cola-rotulos">
      <div className="cola-header">
        <h3>Cola de Rótulos</h3>
        <div className="cola-controles">
          <span className="contador-rotulos">{queue.length} rótulos</span>
          <input
            type="text"
            className="nombreArchivoZip"
            placeholder="Nombre del archivo"
            value={zipName}
            onChange={onZipNameChange}
          />
          <button
            className="botonDescargarLote ripple"
            onClick={onDownloadAll}
            disabled={queue.length === 0}
          >
            Descargar todos
          </button>
          <button
            className="botonLimpiarCola ripple"
            onClick={onClearQueue}
            disabled={queue.length === 0}
          >
            Limpiar cola
          </button>
        </div>
      </div>
      <div className="lista-rotulos">
        {queue.length === 0 ? (
          <div className="mensaje-cola-vacia">
            <i className="fas fa-list"></i>
            <p>No hay rótulos en la cola</p>
            <span>Agrega productos usando el botón "Agregar a la cola"</span>
          </div>
        ) : (
          queue.map((item, idx) => (
            <div className="item-rotulo" key={item.id}>
              <div className="info-rotulo">
                <span className="nombre-producto">{item.producto}</span>
                <div className="detalles-rotulo">
                  <span className="detalle-item"><i className="fas fa-barcode"></i> {item.codigo}</span>
                  <span className="detalle-item"><i className="fas fa-dollar-sign"></i> {item.actual}</span>
                  {item.anterior && <span className="detalle-item"><i className="fas fa-tag"></i> {item.anterior}</span>}
                  {item.promo && <span className="detalle-item"><i className="fas fa-times-circle"></i> {item.promo}</span>}
                  <span className="detalle-item"><i className="fas fa-ruler"></i> {item.unidad}</span>
                  <span className="detalle-item"><i className="fas fa-image"></i> {getBackgroundName(item.fondo)}</span>
                </div>
              </div>
              <div className="acciones-rotulo">
                <button className="boton-editar-rotulo" onClick={() => onEdit(item, idx)} title="Editar"><i className="fas fa-edit"></i></button>
                <button className="boton-eliminar-rotulo" onClick={() => onDelete(item.id)} title="Eliminar"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LabelQueue; 