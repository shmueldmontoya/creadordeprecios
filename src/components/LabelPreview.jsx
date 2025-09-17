import React from "react";
import { useAppConfig } from "../context/AppConfigContext";
import useImageSize from "../hooks/useImageSize";

const LabelPreview = ({ producto, actual, anterior, promo, unidad, fondo, codigo }) => {
  const { labels, store, format } = useAppConfig();

  // Detectar el archivo de imagen según el fondo seleccionado
  const fondoConfig = labels.backgrounds.find(bg => bg.id === fondo);
  const fondoImageFile = fondoConfig ? `${fondoConfig.id}.png` : null;
  const realSize = useImageSize(fondoImageFile);

  // Función utilitaria para formatear números según la configuración
  const formatNumber = (number) => {
    if (!number || isNaN(Number(number))) return number;
    const num = Number(number);
    
    if (format && format.useThousandSeparator) {
      let formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: true
      });
      return formatted;
    }
    
    return num.toString();
  };

  // Utilidad para obtener texto desde CSS
  function getTextoDesdeCSS(variable, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).replace(/"/g, "") || fallback;
  }

  // Cálculo de ahorro si aplica
  let ahorro = "";
  const textoPrecioAnterior = fondoConfig?.textoPrecioAnterior;
  const textoAhorro = fondoConfig?.textoAhorro;
  if (anterior && actual && Number(anterior) > Number(actual)) {
    const diff = Number(anterior) - Number(actual);
    ahorro = `${store.currency}${formatNumber(diff)}`;
  }

  // Selección de fondo
  const fondoClass = fondoConfig ? `rotulo rotulo-preview ${fondoConfig.id}` : "rotulo rotulo-preview";

  // Calcular dimensiones del contenedor basadas en las proporciones del fondo
  const containerWidth = realSize.width && realSize.height
    ? Math.min(400, realSize.width * 0.4)  // Máximo 400px, escala 0.4
    : 307;  // Valor por defecto

  const containerHeight = realSize.width && realSize.height
    ? Math.min(400, realSize.height * 0.4)  // Máximo 400px, escala 0.4
    : 397;  // Valor por defecto

  // Calcular la escala para el elemento interno basada en las proporciones
  const scaleX = containerWidth / (realSize.width || 768);
  const scaleY = containerHeight / (realSize.height || 993);
  const scale = Math.min(scaleX, scaleY);

  return (
    <div className={`previsualizacion ${fondo}`}>
      <h3>Vista Previa del Rótulo</h3>
      <div
        className="contenedor-rotulo"
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          maxWidth: '400px',
          maxHeight: '400px'
        }}
      >
        <div
          className={fondoClass}
          id="rotulo"
          style={{
            width: realSize.width || 768,
            height: realSize.height || 993,
            transform: `translate(-50%, -50%) scale(${scale})`
          }}
        >
          <div className="producto" id="texto-producto">{producto}</div>
          <div className="precio-actual" id="texto-actual">
            {promo && promo > 0 && (
              <span className="promo" id="texto-promo">
                {promo}x&nbsp;
              </span>
            )}
            {store.currency}{formatNumber(actual)}
            {unidad && <span className="unidad"> / {unidad}</span>}
          </div>
          <div className="antes" id="texto-anterior">
            {anterior && Number(anterior) > Number(actual)
              ? `${textoPrecioAnterior} ${store.currency}${formatNumber(anterior)}`
              : ""}
          </div>
          <div className="ahorre" id="texto-ahorre">{ahorro && `${textoAhorro} ${ahorro}`}</div>
        </div>
      </div>
      <div className="indicador-tamaño" id="indicadorTamaño">
        {realSize.width && realSize.height ? (
          <>
            Tamaño real: {realSize.width} x {realSize.height} píxeles |
            Vista previa: {Math.round(realSize.width * labels.dimensions.previewScale)} x {Math.round(realSize.height * labels.dimensions.previewScale)} píxeles
          </>
        ) : (
          <>Tamaño real: No disponible</>
        )}
      </div>
    </div>
  );
};

export default LabelPreview; 