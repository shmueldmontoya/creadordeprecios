// ============================================================================
// VALIDACIÓN DE FORMULARIOS
// ============================================================================
// Este archivo maneja todas las validaciones de la aplicación
// ============================================================================

window.Validation = {};

/**
 * Valida los datos de un rótulo completo
 * @param {Object} datos - Datos del rótulo a validar
 * @returns {Object} Resultado de la validación {isValid, errors}
 */
window.Validation.validarRotulo = (datos) => {
  const config = window.APP_CONFIG.validation;
  const errors = [];
  
  // Validar producto
  if (config.requireProduct) {
    if (!datos.producto) {
      errors.push('El nombre del producto es requerido');
    }
    if (!window.Utils.validarTexto(datos.producto, 'product')) {
      errors.push('El nombre del producto debe tener máximo ' + config.maxProductLength + ' caracteres');
    }
  }
  
  // Validar precio actual
  if (config.requireCurrentPrice) {
    if (!datos.actual) {
      errors.push('El precio actual es requerido');
    }
    if (!window.Utils.esPrecioValido(datos.actual) || parseFloat(datos.actual) === 0) {
      errors.push('El precio actual debe ser mayor a ' + config.minPrice + ' y menor a ' + config.maxPrice);
    }
    
  }
  
  
  // Validar precio anterior (si se proporciona)
  if (datos.anterior && !window.Utils.esPrecioValido(datos.anterior)) {
    errors.push('El precio anterior debe ser mayor a ' + config.minPrice);
  }
  
  // Validar promoción (si se proporciona)
  if (datos.promo && (isNaN(datos.promo) || datos.promo <= 0)) {
    errors.push('La promoción debe ser un número mayor a 0');
  }
  
  // Validar que el precio anterior sea mayor al actual si ambos están presentes
  if (datos.anterior && datos.actual) {
    const anterior = parseFloat(datos.anterior);
    const actual = parseFloat(datos.actual);
    if (anterior <= actual) {
      errors.push('El precio anterior debe ser mayor al precio actual');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Valida un campo individual
 * @param {string} campo - Nombre del campo
 * @param {any} valor - Valor del campo
 * @param {Object} opciones - Opciones adicionales de validación
 * @returns {Object} Resultado de la validación {isValid, error}
 */
window.Validation.validarCampo = (campo, valor, opciones = {}) => {
  const config = window.APP_CONFIG.validation;
  
  switch (campo) {
    case 'producto':
      if (config.requireProduct && (!valor || valor.trim() === '')) {
        return { isValid: false, error: 'El nombre del producto es requerido' };
      }
      if (valor && !window.Utils.validarTexto(valor, 'product')) {
        return { isValid: false, error: `El nombre debe tener máximo ${config.maxProductLength} caracteres` };
      }
      break;
      
    case 'actual':
      if (config.requireCurrentPrice && !window.Utils.esPrecioValido(valor)) {
        return { isValid: false, error: `El precio debe ser mayor a ${config.minPrice}` };
      }
      break;
      
    case 'anterior':
      if (valor && !window.Utils.esPrecioValido(valor)) {
        return { isValid: false, error: `El precio debe ser mayor a ${config.minPrice}` };
      }
      break;
      
    case 'codigo':
      if (config.requireCode && (!valor || valor.trim() === '')) {
        return { isValid: false, error: 'El código es requerido' };
      }
      if (valor && !window.Utils.validarTexto(valor, 'code')) {
        return { isValid: false, error: `El código debe tener máximo ${config.maxCodeLength} caracteres` };
      }
      break;
      
    case 'promo':
      if (valor && (isNaN(valor) || parseFloat(valor) <= 0)) {
        return { isValid: false, error: 'La promoción debe ser un número mayor a 0' };
      }
      break;
      
    case 'unidad':
      if (window.APP_CONFIG && window.APP_CONFIG.labels && window.APP_CONFIG.labels.units) {
        const unidadesValidas = window.APP_CONFIG.labels.units.map(u => u.value);
        if (valor && !unidadesValidas.includes(valor)) {
          return { isValid: false, error: 'Unidad de medida no válida' };
        }
      }
      break;
      
    case 'fondo':
      if (window.APP_CONFIG && window.APP_CONFIG.labels && window.APP_CONFIG.labels.backgrounds) {
        const fondosValidos = window.APP_CONFIG.labels.backgrounds.map(b => b.id);
        if (valor && !fondosValidos.includes(valor)) {
          return { isValid: false, error: 'Diseño de fondo no válido' };
        }
      }
      break;
  }
  
  return { isValid: true, error: null };
};

/**
 * Valida en tiempo real un campo mientras el usuario escribe
 * @param {HTMLElement} input - Elemento input a validar
 * @param {string} tipo - Tipo de validación
 */
window.Validation.validarCampoEnTiempoReal = (input, tipo) => {
  const valor = input.value;
  const resultado = window.Validation.validarCampo(tipo, valor);
  
  // Remover clases de validación anteriores
  input.classList.remove('campo-valido', 'campo-invalido');
  
  if (valor.trim() !== '') {
    if (resultado.isValid) {
      input.classList.add('campo-valido');
    } else {
      input.classList.add('campo-invalido');
    }
  }
  
  return resultado;
};

/**
 * Muestra errores de validación en la interfaz
 * @param {Array} errors - Array de errores
 * @param {HTMLElement} contenedor - Contenedor donde mostrar los errores
 */
window.Validation.mostrarErrores = (errors, contenedor = null) => {
  if (!contenedor) {
    contenedor = document.body;
  }
  
  // Limpiar errores anteriores
  const erroresAnteriores = contenedor.querySelectorAll('.error-validacion');
  erroresAnteriores.forEach(error => error.remove());
  
  if (errors.length === 0) return;
  
  // Crear contenedor de errores
  const contenedorErrores = document.createElement('div');
  contenedorErrores.className = 'contenedor-errores';
  
  errors.forEach(error => {
    const elementoError = document.createElement('div');
    elementoError.className = 'error-validacion';
    elementoError.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${error}`;
    contenedorErrores.appendChild(elementoError);
  });
  
  contenedor.appendChild(contenedorErrores);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (contenedorErrores.parentNode) {
      contenedorErrores.remove();
    }
  }, 5000);
};

/**
 * Limpia todos los errores de validación de la interfaz
 */
window.Validation.limpiarErrores = () => {
  const errores = document.querySelectorAll('.error-validacion, .contenedor-errores');
  errores.forEach(error => error.remove());
  
  // Limpiar clases de validación de inputs
  const inputs = document.querySelectorAll('.campo-valido, .campo-invalido');
  inputs.forEach(input => {
    input.classList.remove('campo-valido', 'campo-invalido');
  });
};

/**
 * Valida que la cola no exceda el límite máximo
 * @param {Array} cola - Cola actual
 * @returns {Object} Resultado de la validación
 */
window.Validation.validarCola = (cola) => {
  const config = window.APP_CONFIG.storage;
  
  if (cola.length >= config.maxQueueSize) {
    return {
      isValid: false,
      error: `La cola no puede tener más de ${config.maxQueueSize} rótulos`
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Valida que el navegador soporte todas las funcionalidades necesarias
 * @returns {Object} Resultado de la validación
 */
window.Validation.validarCompatibilidad = () => {
  const compatibilidad = window.Utils.verificarCompatibilidad();
  
  if (!compatibilidad.todoSoportado) {
    window.Utils.mostrarErrorCompatibilidad(compatibilidad);
    return { isValid: false, error: 'Navegador no compatible' };
  }
  
  return { isValid: true, error: null };
}; 