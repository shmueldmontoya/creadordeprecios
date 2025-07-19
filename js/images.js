// ============================================================================
// MÓDULO DE MANEJO DE IMÁGENES DE PRODUCTOS
// ============================================================================
// Este archivo maneja la carga y visualización de imágenes de productos
// basadas en códigos de productos
// ============================================================================

// ============================================================================
// CONSTANTES
// ============================================================================
const IMAGE_CONFIG = {
  FOLDER_PATH: 'recursos/imagenes/',
  SUPPORTED_FORMATS: ['text/plain', 'application/octet-stream'], // Archivos de texto con Base64
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB para archivos Base64
  DEFAULT_POSITION: {
    top: '200px',
    left: '50px',
    width: '100px',
    height: '100px'
  }
};

// ============================================================================
// ESTADO DEL MÓDULO
// ============================================================================
const IMAGE_STATE = {
  currentImage: null,
  loadedImages: new Map(), // Cache de imágenes cargadas
  isLoading: false
};

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================

/**
 * Valida si un código es válido para buscar imágenes
 * @param {string} codigo - Código a validar
 * @returns {boolean} True si el código es válido
 */
const validarCodigoImagen = (codigo) => {
  if (!codigo || typeof codigo !== 'string') return false;
  
  // Solo permite códigos alfanuméricos
  return /^[a-zA-Z0-9]+$/.test(codigo.trim());
};

/**
 * Obtiene el elemento de imagen del DOM
 * @returns {HTMLElement|null} Elemento de imagen o null si no existe
 */
const obtenerElementoImagen = () => {
  return document.getElementById('imagen-producto');
};

/**
 * Valida si una cadena es Base64 válido
 * @param {string} str - Cadena a validar
 * @returns {boolean} True si es Base64 válido
 */
const esBase64Valido = (str) => {
  if (typeof str !== 'string') {
    console.warn('El contenido no es una cadena de texto');
    return false;
  }
  
  // Verificar que comience con data:image/
  if (!str.startsWith('data:image/')) {
    console.warn('El contenido no comienza con data:image/');
    return false;
  }
  
  // Verificar que tenga el formato correcto
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
  if (!base64Regex.test(str)) {
    console.warn('Formato de Base64 inválido. Debe ser: data:image/[tipo];base64,');
    return false;
  }
  
  // Verificar que el contenido Base64 sea válido
  try {
    const base64Data = str.split(',')[1];
    if (!base64Data) {
      console.warn('No se encontró contenido Base64 después de la coma');
      return false;
    }
    
    // Intentar decodificar para verificar que sea válido
    atob(base64Data);
    return true;
  } catch (error) {
    console.warn('Error al decodificar Base64:', error.message);
    return false;
  }
};

/**
 * Valida el tipo y tamaño de archivo
 * @param {Blob} blob - Archivo a validar
 * @returns {boolean} True si el archivo es válido
 */
const validarArchivoImagen = (blob) => {
  // Validar tipo de archivo (texto plano o octet-stream)
  if (!IMAGE_CONFIG.SUPPORTED_FORMATS.includes(blob.type)) {
    console.warn('Formato de archivo no soportado:', blob.type);
    return false;
  }
  
  // Validar tamaño
  if (blob.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    console.warn('Archivo demasiado grande:', blob.size, 'bytes');
    return false;
  }
  
  return true;
};

// ============================================================================
// FUNCIONES PRINCIPALES
// ============================================================================

/**
 * Carga y muestra la imagen del producto basada en el código
 * @param {string} codigo - Código del producto
 * @returns {Promise<boolean>} True si la imagen se cargó correctamente
 */
const cargarImagenProducto = async (codigo) => {
  const imagenProducto = obtenerElementoImagen();
  
  if (!imagenProducto) {
    console.error('Elemento de imagen no encontrado');
    return false;
  }
  
  // Limpiar imagen si no hay código
  if (!codigo) {
    ocultarImagenProducto();
    return false;
  }
  
  // Validar código
  if (!validarCodigoImagen(codigo)) {
    console.warn('Código de imagen inválido:', codigo);
    ocultarImagenProducto();
    return false;
  }
  
  // Verificar cache
  if (IMAGE_STATE.loadedImages.has(codigo)) {
    mostrarImagenDesdeCache(codigo);
    return true;
  }
  
  // Evitar carga duplicada
  if (IMAGE_STATE.isLoading && IMAGE_STATE.currentImage === codigo) {
    return false;
  }
  
  IMAGE_STATE.isLoading = true;
  IMAGE_STATE.currentImage = codigo;
  
  try {
    const url = `${IMAGE_CONFIG.FOLDER_PATH}${codigo}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Imagen no encontrada para código: ${codigo}`);
      ocultarImagenProducto();
      return false;
    }
    
    const blob = await response.blob();
    
    console.log(`Archivo cargado para código ${codigo}:`, {
      type: blob.type,
      size: blob.size,
      bytes: blob.size
    });
    
    if (!validarArchivoImagen(blob)) {
      ocultarImagenProducto();
      return false;
    }
    
    // Leer el contenido del archivo de texto
    const texto = await blob.text();
    
    console.log(`Contenido leído para código ${codigo}:`, {
      length: texto.length,
      preview: texto.substring(0, 50) + '...'
    });
    
    // Validar que el contenido sea Base64 válido
    if (!esBase64Valido(texto)) {
      console.warn('Contenido Base64 inválido para código:', codigo);
      console.warn('Primeros 100 caracteres:', texto.substring(0, 100));
      ocultarImagenProducto();
      return false;
    }
    
    // Guardar en cache
    IMAGE_STATE.loadedImages.set(codigo, texto);
    
    // Mostrar imagen
    mostrarImagenProducto(codigo, texto);
    
    return true;
    
  } catch (error) {
    console.error(`Error al cargar imagen para código ${codigo}:`, error);
    ocultarImagenProducto();
    return false;
  } finally {
    IMAGE_STATE.isLoading = false;
    IMAGE_STATE.currentImage = null;
  }
};

/**
 * Muestra una imagen desde el cache
 * @param {string} codigo - Código de la imagen
 */
const mostrarImagenDesdeCache = (codigo) => {
  const base64 = IMAGE_STATE.loadedImages.get(codigo);
  if (base64) {
    mostrarImagenProducto(codigo, base64);
  }
};

/**
 * Muestra la imagen en el DOM
 * @param {string} codigo - Código de la imagen
 * @param {string} base64 - Datos base64 de la imagen
 */
const mostrarImagenProducto = (codigo, base64) => {
  const imagenProducto = obtenerElementoImagen();
  
  if (!imagenProducto) return;
  
  imagenProducto.style.backgroundImage = `url('${base64}')`;
  imagenProducto.style.display = 'block';
  imagenProducto.setAttribute('data-codigo', codigo);
  
  // Disparar evento personalizado
  const event = new CustomEvent('imagenCargada', {
    detail: { codigo, base64 }
  });
  document.dispatchEvent(event);
};

/**
 * Oculta la imagen del producto
 */
const ocultarImagenProducto = () => {
  const imagenProducto = obtenerElementoImagen();
  
  if (!imagenProducto) return;
  
  imagenProducto.style.display = 'none';
  imagenProducto.removeAttribute('data-codigo');
  imagenProducto.style.backgroundImage = '';
  
  // Disparar evento personalizado
  const event = new CustomEvent('imagenOcultada');
  document.dispatchEvent(event);
};

/**
 * Limpia el cache de imágenes
 */
const limpiarCacheImagenes = () => {
  IMAGE_STATE.loadedImages.clear();
  console.log('Cache de imágenes limpiado');
};

/**
 * Obtiene información de la imagen actual
 * @returns {Object|null} Información de la imagen o null si no hay imagen
 */
const obtenerImagenActual = () => {
  const imagenProducto = obtenerElementoImagen();
  
  if (!imagenProducto || imagenProducto.style.display === 'none') {
    return null;
  }
  
  return {
    codigo: imagenProducto.getAttribute('data-codigo'),
    visible: true,
    backgroundImage: imagenProducto.style.backgroundImage
  };
};

/**
 * Verifica si una imagen existe para un código específico
 * @param {string} codigo - Código a verificar
 * @returns {Promise<boolean>} True si la imagen existe
 */
const verificarExistenciaImagen = async (codigo) => {
  if (!validarCodigoImagen(codigo)) return false;
  
  try {
    const url = `${IMAGE_CONFIG.FOLDER_PATH}${codigo}`;
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// ============================================================================
// EVENTOS
// ============================================================================

/**
 * Inicializa los event listeners del módulo
 */
const inicializarEventosImagenes = () => {
  // Evento para limpiar cache cuando se cambia de fondo
  document.addEventListener('fondoCambiado', limpiarCacheImagenes);
  
  // Evento para limpiar cache cuando se limpia el formulario
  document.addEventListener('formularioLimpio', ocultarImagenProducto);
};

// ============================================================================
// API PÚBLICA
// ============================================================================

// Hacer las funciones disponibles globalmente
window.ImageManager = {
  cargarImagen: cargarImagenProducto,
  ocultarImagen: ocultarImagenProducto,
  obtenerImagenActual: obtenerImagenActual,
  verificarExistencia: verificarExistenciaImagen,
  limpiarCache: limpiarCacheImagenes,
  inicializar: inicializarEventosImagenes
};

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEventosImagenes);
} else {
  inicializarEventosImagenes();
} 