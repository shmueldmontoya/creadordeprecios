import React from "react";
import { useAppConfig } from "../context/AppConfigContext";
import useImageSize from "../hooks/useImageSize";

const LabelPreview = ({ producto, actual, anterior, promo, unidad, fondo, codigo }) => {
  const { labels, store, format } = useAppConfig();

  // Detectar el archivo de imagen según el fondo seleccionado
  const fondoConfig = labels.backgrounds.find(bg => bg.id === fondo);
  const fondoImageFile = fondoConfig ? `${fondoConfig.id}.png` : null;
  const realSize = useImageSize(fondoImageFile);

  // Detectar si es fondo de 4 paneles
  const is4Paneles = fondoConfig?.es4Paneles || false;

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

  // Preparar datos para renderizado
  let productos = [];
  let actuales = [];
  let anteriores = [];
  let promos = [];
  let ahorros = [];
  let unidades = [];

  if (is4Paneles) {
    // Separar datos combinados para 4 paneles
    productos = producto ? producto.split(' | ') : ['', '', '', ''];
    actuales = actual ? actual.split(' | ') : ['', '', '', ''];
    anteriores = anterior ? anterior.split(' | ') : ['', '', '', ''];
    promos = promo ? promo.split(' | ') : ['', '', '', ''];
    unidades = unidad ? unidad.split(' | ') : ['', '', '', ''];

    // Limitar productos a 39 caracteres y formatear con saltos de línea respetando palabras
    productos = productos.map(prod => {
      if (!prod) return '';
      // Limitar a 39 caracteres máximo
      let limitedProd = prod.length > 39 ? prod.substring(0, 39) : prod;

      // Función para formatear texto respetando palabras
      const formatTextWithWordBreaks = (text, maxLineLength = 13) => {
        if (text.length <= maxLineLength) return text;

        let result = '';
        let currentLine = '';
        let words = text.split(' ');

        for (let i = 0; i < words.length; i++) {
          let word = words[i];
          let potentialLine = currentLine + (currentLine ? ' ' : '') + word;

          // Si la línea potencial es demasiado larga
          if (potentialLine.length > maxLineLength) {
            // Si ya tenemos algo en currentLine, terminamos la línea
            if (currentLine) {
              result += (result ? '\n' : '') + currentLine;
              currentLine = word;
            } else {
              // La palabra sola es demasiado larga, la cortamos
              if (word.length > maxLineLength) {
                if (currentLine) {
                  result += (result ? '\n' : '') + currentLine;
                }
                // Cortar palabra larga
                let remainingWord = word;
                while (remainingWord.length > 0) {
                  let chunk = remainingWord.substring(0, maxLineLength);
                  result += (result ? '\n' : '') + chunk;
                  remainingWord = remainingWord.substring(maxLineLength);
                }
                currentLine = '';
              } else {
                currentLine = word;
              }
            }
          } else {
            currentLine = potentialLine;
          }
        }

        // Agregar la última línea
        if (currentLine) {
          result += (result ? '\n' : '') + currentLine;
        }

        return result;
      };

      return formatTextWithWordBreaks(limitedProd);
    });

    // Aplicar límite de caracteres también a productos individuales si es necesario
    productos = productos.map(prod => {
      if (!prod) return '';
      return prod.length > 39 ? prod.substring(0, 39) : prod;
    });
  } else {
    // Datos únicos para fondos normales
    productos = [producto];
    actuales = [actual];
    anteriores = [anterior];
    promos = [promo];
    unidades = [unidad];
  }

  const textoPrecioAnterior = fondoConfig?.textoPrecioAnterior;
  const textoAhorro = fondoConfig?.textoAhorro;

  // Calcular ahorro para cada panel
  ahorros = anteriores.map((ant, index) => {
    if (ant && actuales[index] && Number(ant) > Number(actuales[index])) {
      const diff = Number(ant) - Number(actuales[index]);
      return `${store.currency}${formatNumber(diff)}`;
    }
    return "";
  });

  // Selección de fondo
  const fondoClass = fondoConfig ? `rotulo rotulo-preview ${fondoConfig.id}` : "rotulo rotulo-preview";

  // Calcular dimensiones del contenedor basadas en las proporciones del fondo
  const containerWidth = realSize.width && realSize.height
    ? Math.min(400, realSize.width * 0.4)  // Máximo 400px, escala 0.4
    : 307;  // Valor por defecto

  // Para fondos de 4 paneles, usar altura fija de 310px
  const containerHeight = is4Paneles
    ? 310  // Altura fija para fondos de 4 paneles
    : (realSize.width && realSize.height
        ? Math.min(400, realSize.height * 0.4)  // Máximo 400px, escala 0.4
        : 397);  // Valor por defecto

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
          {is4Paneles ? (
            // Renderizar elementos para cada panel en 4 paneles
            [1, 2, 3, 4].map(panelIndex => (
              <React.Fragment key={panelIndex}>
                <div className={`producto producto-panel${panelIndex}`} id={`texto-producto-${panelIndex}`}>
                  {productos[panelIndex - 1]}
                </div>
                <div className={`precio-actual precio-actual-panel${panelIndex}`} id={`texto-actual-${panelIndex}`}>
                  {promos[panelIndex - 1] && promos[panelIndex - 1] > 0 && (
                    <span className={`promo promo-panel${panelIndex}`} id={`texto-promo-${panelIndex}`}>
                      {promos[panelIndex - 1]}x&nbsp;
                    </span>
                  )}
                  {actuales[panelIndex - 1] && actuales[panelIndex - 1] !== '' ? `${store.currency}${formatNumber(actuales[panelIndex - 1])}` : ''}
                  {unidades[panelIndex - 1] && unidades[panelIndex - 1] !== '' && actuales[panelIndex - 1] && actuales[panelIndex - 1] !== '' && <span className={`unidad unidad-panel${panelIndex}`}> / {unidades[panelIndex - 1]}</span>}
                </div>
                <div className={`antes antes-panel${panelIndex}`} id={`texto-anterior-${panelIndex}`}>
                  {anteriores[panelIndex - 1] && anteriores[panelIndex - 1] !== '' && Number(anteriores[panelIndex - 1]) > Number(actuales[panelIndex - 1])
                    ? `${textoPrecioAnterior} ${store.currency}${formatNumber(anteriores[panelIndex - 1])}`
                    : ""}
                </div>
                <div className={`ahorre ahorre-panel${panelIndex}`} id={`texto-ahorre-${panelIndex}`}>
                  {ahorros[panelIndex - 1] && `${textoAhorro} ${ahorros[panelIndex - 1]}`}
                </div>
              </React.Fragment>
            ))
          ) : (
            // Renderizar elementos únicos para fondos normales
            <>
              <div className="producto" id="texto-producto">{producto}</div>
              <div className="precio-actual" id="texto-actual">
                {promo && promo > 0 && (
                  <span className="promo" id="texto-promo">
                    {promo}x&nbsp;
                  </span>
                )}
                {actual && actual !== '' ? `${store.currency}${formatNumber(actual)}` : ''}
                {unidad && unidad !== '' && actual && actual !== '' && <span className="unidad"> / {unidad}</span>}
              </div>
              <div className="antes" id="texto-anterior">
                {anterior && anterior !== '' && Number(anterior) > Number(actual)
                  ? `${textoPrecioAnterior} ${store.currency}${formatNumber(anterior)}`
                  : ""}
              </div>
              <div className="ahorre" id="texto-ahorre">{ahorros[0] && `${textoAhorro} ${ahorros[0]}`}</div>
            </>
          )}
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