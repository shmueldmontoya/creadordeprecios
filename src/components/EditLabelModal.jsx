import React, { useState, useEffect } from "react";
import { useAppConfig } from "../context/AppConfigContext";

const EditLabelModal = ({ open, data, units, backgrounds, onChange, onUnitChange, onBackgroundChange, onSave, onCancel }) => {
  const { labels } = useAppConfig();
  const [editData, setEditData] = useState(data);

  // Detectar si es fondo de 4 paneles
  const is4Paneles = data.fondo && labels.backgrounds.find(bg => bg.id === data.fondo)?.es4Paneles;

  // Separar datos para edición de 4 paneles
  const [panelData, setPanelData] = useState({
    productos: ['', '', '', ''],
    codigos: ['', '', '', ''],
    actuales: ['', '', '', ''],
    anteriores: ['', '', '', ''],
    promos: ['', '', '', ''],
    unidades: ['', '', '', '']
  });

  // Estado para controlar paneles expandidos/colapsados
  const [expandedPanels, setExpandedPanels] = useState([true, false, false, false]); // Primer panel abierto por defecto

  useEffect(() => {
    if (open && data) {
      setEditData(data);

      if (is4Paneles) {
        // Separar datos combinados para 4 paneles
        setPanelData({
          productos: data.producto ? data.producto.split(' | ') : ['', '', '', ''],
          codigos: data.codigo ? data.codigo.split(' | ') : ['', '', '', ''],
          actuales: data.actual ? data.actual.split(' | ') : ['', '', '', ''],
          anteriores: data.anterior ? data.anterior.split(' | ') : ['', '', '', ''],
          promos: data.promo ? data.promo.split(' | ') : ['', '', '', ''],
          unidades: data.unidad ? data.unidad.split(' | ') : ['', '', '', '']
        });
      }
    }
  }, [open, data, is4Paneles]);

  const togglePanel = (panelIndex) => {
    const newExpanded = [...expandedPanels];
    newExpanded[panelIndex] = !newExpanded[panelIndex];
    setExpandedPanels(newExpanded);
  };

  const handlePanelChange = (panelIndex, field, value) => {
    const newPanelData = { ...panelData };
    newPanelData[field][panelIndex] = value;
    setPanelData(newPanelData);

    // Actualizar editData con datos combinados
    const combinedData = {
      ...editData,
      producto: newPanelData.productos.join(' | '),
      codigo: newPanelData.codigos.join(' | '),
      actual: newPanelData.actuales.join(' | '),
      anterior: newPanelData.anteriores.join(' | '),
      promo: newPanelData.promos.join(' | '),
      unidad: newPanelData.unidades.join(' | ')
    };
    setEditData(combinedData);
    onChange({ target: { name: 'combined', value: combinedData } });
  };

  const handleSave = () => {
    onSave(editData);
  };

  if (!open) return null;

  return (
    <div className="modal-editar-rotulo" style={{ display: "flex" }}>
      <div className="modal-editar-overlay" onClick={onCancel}></div>
      <div className="modal-editar-content">
        <div className="modal-editar-header">
          <h3>Editar rótulo {is4Paneles ? '(4 Paneles)' : ''}</h3>
          <button className="cerrar-modal-editar" onClick={onCancel}>×</button>
        </div>
        <div className="modal-editar-scroll">
          <form className="formEditarRotulo" autoComplete="off" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            {is4Paneles ? (
              // Formulario para 4 paneles
              <>
                {[0, 1, 2, 3].map(panelIndex => (
                  <div key={panelIndex} className="panel-edit-section">
                    <div className="panel-header" onClick={() => togglePanel(panelIndex)}>
                      <h4>Panel {panelIndex + 1}</h4>
                      <button
                        type="button"
                        className="panel-toggle-btn"
                        aria-expanded={expandedPanels[panelIndex]}
                        aria-controls={`panel-content-${panelIndex}`}
                      >
                        {expandedPanels[panelIndex] ? '−' : '+'}
                      </button>
                    </div>
                    <div
                      id={`panel-content-${panelIndex}`}
                      className={`panel-content ${expandedPanels[panelIndex] ? 'expanded' : 'collapsed'}`}
                    >
                      <div className="campo-modal">
                        <label htmlFor={`editarProducto-${panelIndex}`}>Producto</label>
                        <input
                          type="text"
                          id={`editarProducto-${panelIndex}`}
                          value={panelData.productos[panelIndex]}
                          onChange={(e) => handlePanelChange(panelIndex, 'productos', e.target.value)}
                        />
                      </div>
                      <div className="campo-modal">
                        <label htmlFor={`editarCodigo-${panelIndex}`}>Código</label>
                        <input
                          type="text"
                          id={`editarCodigo-${panelIndex}`}
                          value={panelData.codigos[panelIndex]}
                          onChange={(e) => handlePanelChange(panelIndex, 'codigos', e.target.value)}
                        />
                      </div>
                      <div className="campo-modal">
                        <label htmlFor={`editarActual-${panelIndex}`}>Precio actual</label>
                        <input
                          type="number"
                          id={`editarActual-${panelIndex}`}
                          value={panelData.actuales[panelIndex]}
                          onChange={(e) => handlePanelChange(panelIndex, 'actuales', e.target.value)}
                        />
                      </div>
                      <div className="campo-modal">
                        <label htmlFor={`editarAnterior-${panelIndex}`}>Precio anterior</label>
                        <input
                          type="number"
                          id={`editarAnterior-${panelIndex}`}
                          value={panelData.anteriores[panelIndex]}
                          onChange={(e) => handlePanelChange(panelIndex, 'anteriores', e.target.value)}
                        />
                      </div>
                      <div className="campo-modal">
                        <label htmlFor={`editarPromo-${panelIndex}`}>Promoción x cantidad</label>
                        <input
                          type="number"
                          id={`editarPromo-${panelIndex}`}
                          value={panelData.promos[panelIndex]}
                          onChange={(e) => handlePanelChange(panelIndex, 'promos', e.target.value)}
                        />
                      </div>
                      <div className="campo-modal">
                        <label>Unidad de medida:</label>
                        <div className="radio-group">
                          {units.map(unit => (
                            <label key={unit.value} className="radio-option">
                              <input
                                type="radio"
                                name={`unidad-${panelIndex}`}
                                value={unit.value}
                                checked={panelData.unidades[panelIndex] === unit.value}
                                onChange={(e) => handlePanelChange(panelIndex, 'unidades', e.target.value)}
                              />
                              {unit.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Formulario normal para rótulos sencillos
              <>
                <div className="campo-modal">
                  <label htmlFor="editarProducto">Producto</label>
                  <input type="text" id="editarProducto" name="producto" value={editData.producto || ''} onChange={onChange} />
                </div>
                <div className="campo-modal">
                  <label htmlFor="editarCodigo">Código</label>
                  <input type="text" id="editarCodigo" name="codigo" value={editData.codigo || ''} onChange={onChange} />
                </div>
                <div className="campo-modal">
                  <label htmlFor="editarActual">Precio actual</label>
                  <input type="number" id="editarActual" name="actual" value={editData.actual || ''} onChange={onChange} />
                </div>
                <div className="campo-modal">
                  <label htmlFor="editarAnterior">Precio anterior</label>
                  <input type="number" id="editarAnterior" name="anterior" value={editData.anterior || ''} onChange={onChange} />
                </div>
                <div className="campo-modal">
                  <label htmlFor="editarPromo">Promoción x cantidad</label>
                  <input type="number" id="editarPromo" name="promo" value={editData.promo || ''} onChange={onChange} />
                </div>
              </>
            )}

            {!is4Paneles && (
              <div className="campo-modal" id="campoUnidadesModal">
                <span>Unidad de medida:</span>
                {units.map(unit => (
                  <label key={unit.value}>
                    <input
                      type="radio"
                      name="unidad"
                      value={unit.value}
                      checked={editData.unidad === unit.value}
                      onChange={onUnitChange}
                    />
                    {unit.label}
                  </label>
                ))}
              </div>
            )}
            <div className="campo-modal">
              <label htmlFor="editarFondo">Diseño de fondo</label>
              <select id="editarFondo" name="fondo" value={editData.fondo} onChange={onBackgroundChange}>
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