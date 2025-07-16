// ============================================================================
// UTILIDADES DE LA APLICACIÓN
// ============================================================================
// Este archivo contiene funciones utilitarias reutilizables
// ============================================================================

window.Utils = {};

/**
 * Formatea un precio con la moneda configurada
 * @param {number} precio - Precio a formatear
 * @param {string} currency - Moneda (opcional, usa la configurada por defecto)
 * @returns {string} Precio formateado
 */
window.Utils.formatearPrecio = (precio, currency = null) => {
  const config = window.APP_CONFIG;
  const moneda = currency || config.store.currency;
  
  if (isNaN(precio) || precio === null || precio === undefined) {
    return `${moneda}0`;
  }
  
  // Formatear según la configuración
  let precioFormateado;
  
  if (config.format && config.format.useThousandSeparator) {
    // Usar separadores de miles
    const separadorMiles = config.format.thousandSeparator || ",";
    const separadorDecimal = config.format.decimalSeparator || ".";
    
    // Convertir a string y agregar separadores de miles
    precioFormateado = precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles);
  } else {
    // Sin separadores de miles
    precioFormateado = precio.toString();
  }
  
  return `${moneda}${precioFormateado}`;
};

/**
 * Valida si un precio es válido según la configuración
 * @param {number} precio - Precio a validar
 * @returns {boolean} True si es válido
 */
window.Utils.esPrecioValido = (precio) => {
  const config = window.APP_CONFIG.validation;
  const valor = parseFloat(precio);
  
  return !isNaN(valor) && 
         valor >= config.minPrice && 
         valor <= config.maxPrice;
};

/**
 * Valida un campo de texto según la configuración
 * @param {string} texto - Texto a validar
 * @param {string} tipo - Tipo de validación ('product', 'code')
 * @returns {boolean} True si es válido
 */
window.Utils.validarTexto = (texto, tipo) => {
  const config = window.APP_CONFIG.validation;
  
  if (!texto || texto.trim() === '') {
    return false;
  }
  
  switch (tipo) {
    case 'product':
      return texto.trim().length <= config.maxProductLength;
    case 'code':
      return texto.trim().length <= config.maxCodeLength;
    default:
      return true;
  }
};

/**
 * Calcula el ahorro entre dos precios
 * @param {number} precioAnterior - Precio anterior
 * @param {number} precioActual - Precio actual
 * @returns {number} Ahorro calculado
 */
window.Utils.calcularAhorro = (precioAnterior, precioActual) => {
  const anterior = parseFloat(precioAnterior) || 0;
  const actual = parseFloat(precioActual) || 0;
  return Math.max(0, anterior - actual);
};



/**
 * Descarga un archivo desde un blob
 * @param {Blob} blob - Blob del archivo
 * @param {string} filename - Nombre del archivo
 */
window.Utils.descargarArchivo = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Descarga un canvas como imagen
 * @param {HTMLCanvasElement} canvas - Canvas a descargar
 * @param {string} filename - Nombre del archivo
 * @param {string} format - Formato de imagen (png, jpeg)
 * @param {number} quality - Calidad de imagen (0-1, solo para jpeg)
 */
window.Utils.descargarCanvas = (canvas, filename, format = 'png', quality = 0.95) => {
  try {
    // Convertir canvas a blob
    canvas.toBlob((blob) => {
      if (blob) {
        window.Utils.descargarArchivo(blob, filename);
      } else {
        console.error('Error al convertir canvas a blob');
      }
    }, `image/${format}`, quality);
  } catch (error) {
    console.error('Error al descargar canvas:', error);
    // Fallback: usar data URL
    const dataURL = canvas.toDataURL(`image/${format}`, quality);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Crea un archivo ZIP con múltiples archivos
 * @param {Array} archivos - Array de objetos {name, content}
 * @param {string} nombreArchivo - Nombre del archivo ZIP
 * @returns {Promise<Blob>} Blob del archivo ZIP
 */
window.Utils.crearZIP = async (archivos, nombreArchivo) => {
  const JSZip = window.JSZip;
  const zip = new JSZip();
  
  archivos.forEach(archivo => {
    zip.file(archivo.name, archivo.content);
  });
  
  return await zip.generateAsync({ type: 'blob' });
};

/**
 * Guarda datos en localStorage
 * @param {string} key - Clave de almacenamiento
 * @param {any} data - Datos a guardar
 */
window.Utils.guardarEnStorage = (key, data) => {
  try {
    const config = window.APP_CONFIG.storage;
    if (config.enableLocalStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.warn('Error al guardar en localStorage:', error);
  }
};

/**
 * Carga datos desde localStorage
 * @param {string} key - Clave de almacenamiento
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} Datos cargados
 */
window.Utils.cargarDeStorage = (key, defaultValue = null) => {
  try {
    const config = window.APP_CONFIG.storage;
    if (config.enableLocalStorage) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    }
  } catch (error) {
    console.warn('Error al cargar de localStorage:', error);
  }
  return defaultValue;
};

/**
 * Limpia datos de localStorage
 * @param {string} key - Clave a limpiar
 */
window.Utils.limpiarStorage = (key) => {
  try {
    const config = window.APP_CONFIG.storage;
    if (config.enableLocalStorage) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('Error al limpiar localStorage:', error);
  }
};

/**
 * Debounce function para optimizar performance
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
window.Utils.debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function para optimizar performance
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} Función con throttle
 */
window.Utils.throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Valida si el navegador soporta las funcionalidades necesarias
 * @returns {Object} Objeto con el estado de compatibilidad
 */
window.Utils.verificarCompatibilidad = () => {
  const compatibilidad = {
    html2canvas: typeof html2canvas !== 'undefined',
    jszip: typeof JSZip !== 'undefined',
    localStorage: typeof Storage !== 'undefined',
    canvas: !!document.createElement('canvas').getContext,
    fileAPI: !!(window.File && window.FileReader && window.FileList && window.Blob),
    es6: typeof Promise !== 'undefined' && typeof Array.prototype.find !== 'undefined'
  };
  
  compatibilidad.todoSoportado = Object.values(compatibilidad).every(Boolean);
  
  return compatibilidad;
};

/**
 * Muestra una notificación temporal
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación (success, info, warning, error)
 */
window.Utils.mostrarNotificacion = (mensaje, tipo = 'info') => {
  // Cerrar todas las notificaciones existentes antes de mostrar una nueva
  const notificacionesExistentes = document.querySelectorAll('.notificacion');
  notificacionesExistentes.forEach(notif => {
    notif.classList.remove('visible');
    setTimeout(() => {
      notif.remove();
    }, 300);
  });
  
  // Usar la función de templates para crear la notificación
  const notificacion = window.Templates.crearNotificacion(mensaje, tipo);
  
  // Agregar al body
  document.body.appendChild(notificacion);
  
  // Mostrar con animación
  setTimeout(() => {
    notificacion.classList.add('visible');
  }, 10);
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    notificacion.classList.remove('visible');
    setTimeout(() => {
      notificacion.remove();
    }, 300);
  }, 3000);
};

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error
 */
window.Utils.mostrarError = (mensaje) => {
  window.Utils.mostrarNotificacion(mensaje, 'warning');
};

/**
 * Muestra un mensaje de error de compatibilidad
 * @param {Object} compatibilidad - Objeto de compatibilidad
 */
window.Utils.mostrarErrorCompatibilidad = (compatibilidad) => {
  const errores = [];
  
  if (!compatibilidad.html2canvas) {
    errores.push('html2canvas (para generar imágenes)');
  }
  
  if (!compatibilidad.jszip) {
    errores.push('JSZip (para archivos ZIP)');
  }
  
  if (!compatibilidad.localStorage) {
    errores.push('localStorage (para guardar datos)');
  }
  
  if (!compatibilidad.canvas) {
    errores.push('Canvas API (para generar imágenes)');
  }
  
  if (errores.length > 0) {
    const mensaje = `Tu navegador no soporta las siguientes funcionalidades: ${errores.join(', ')}. Por favor, actualiza tu navegador.`;
    alert(mensaje);
  }
}; 