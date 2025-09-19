import React, { useRef, useState } from "react";

const ProductForm = ({
  values,
  units,
  backgrounds,
  onChange,
  onUnitChange,
  onBackgroundChange,
  onDownload,
  onAddToQueue,
  errors,
  autocompleteOptions,
  onAutocompleteSelect,
  panelIndex,
  hideBackgroundSelector = false,
  hideButtons = false
}) => {
  const inputRef = useRef();

  return (
    <form className="formulario" autoComplete="off" onSubmit={e => e.preventDefault()} aria-label="Formulario de producto">
      <div className="campo-input">
        <i className="fas fa-barcode" aria-hidden="true"></i>
        <input
          type="number"
          onWheel={(e) => e.target.blur()}
          id="codigo"
          name="codigo"
          value={values.codigo}
          onChange={onChange}
          autoComplete="off"
          className={
            errors.codigo
              ? "campo-invalido no-vacio"
              : values.codigo
              ? "campo-valido no-vacio"
              : ""
          }
          aria-label="Código del producto"
        />
        <label htmlFor="codigo">Código</label>
      </div>
      <div className="campo-input" style={{ position: "relative" }}>
        <i className="fas fa-box" aria-hidden="true"></i>
        <input
          type="text"
          id="producto"
          name="producto"
          value={values.producto}
          onChange={onChange}
          autoComplete="off"
          className={
            errors.producto
              ? "campo-invalido no-vacio"
              : values.producto
              ? "campo-valido no-vacio"
              : ""
          }
          aria-label="Nombre del producto"
        />
        <label htmlFor="producto">Producto</label>
      </div>
      <div className="campo-input">
        <i className="fas fa-times-circle" aria-hidden="true"></i>
        <input
          type="number"
          onWheel={(e) => e.target.blur()}
          id="promo"
          name="promo"
          value={values.promo}
          onChange={onChange}
          autoComplete="off"
          className={
            errors.promo
              ? "campo-invalido no-vacio"
              : values.promo
              ? "campo-valido no-vacio"
              : ""
          }
          aria-label="Promoción por cantidad"
        />
        <label htmlFor="promo">Promoción x cantidad (si aplica)</label>
      </div>
      <div className="campo-input">
        <i className="fas fa-dollar-sign" aria-hidden="true"></i>
        <input
          type="number"
          onWheel={(e) => e.target.blur()}
          id="actual"
          name="actual"
          value={values.actual}
          onChange={onChange}
          autoComplete="off"
          className={
            errors.actual
              ? "campo-invalido no-vacio"
              : values.actual
              ? "campo-valido no-vacio"
              : ""
          }
          aria-label="Precio actual"
        />
        <label htmlFor="actual">Precio actual</label>
      </div>
      <div className="campo-input">
        <i className="fas fa-tag" aria-hidden="true"></i>
        <input
          type="number"
          onWheel={(e) => e.target.blur()}
          id="anterior"
          name="anterior"
          value={values.anterior}
          onChange={onChange}
          autoComplete="off"
          className={
            errors.anterior
              ? "campo-invalido no-vacio"
              : values.anterior
              ? "campo-valido no-vacio"
              : ""
          }
          aria-label="Precio anterior"
        />
        <label htmlFor="anterior">Precio anterior</label>
      </div>
      <div className="campo-radio" id="campoUnidades">
        <span>Unidad de medida:</span>
        {units.map(unit => (
          <label key={unit.value}>
            <input
              type="radio"
              name="unidad"
              value={unit.value}
              checked={values.unidad === unit.value}
              onChange={onUnitChange}
              aria-label={unit.label}
            />
            {unit.label}
          </label>
        ))}
      </div>
      {!hideBackgroundSelector && (
        <div className="campo-fondo">
          <span className="etiqueta-fondo">Diseño de fondo:</span>
          <select
            id="selectorFondo"
            className="selector-fondo"
            value={values.fondo}
            onChange={onBackgroundChange}
            aria-label="Diseño de fondo"
          >
            {backgrounds.map(bg => (
              <option key={bg.id} value={bg.id}>{bg.name}</option>
            ))}
          </select>
        </div>
      )}
      {!hideButtons && (
        <div className="botones-formulario">
          <button
            id="botonDescargarRotulo"
            className="botonDescargarRotulo ripple"
            type="button"
            onClick={onDownload}
            aria-label="Descargar imagen del rótulo"
          >
            Descargar imagen
          </button>
          <button
            id="botonAgregarCola"
            className="botonAgregarCola ripple"
            type="button"
            onClick={onAddToQueue}
            aria-label="Agregar rótulo a la cola"
          >
            Agregar a la cola
          </button>
        </div>
      )}
    </form>
  );
};

export default ProductForm; 