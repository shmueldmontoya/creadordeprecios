// ============================================================================
// GENERADOR DE RÓTULOS - CÓDIGO PRINCIPAL
// ============================================================================
// Este archivo maneja toda la lógica del generador de rótulos, incluyendo:
// - Actualización en tiempo real del rótulo
// - Descarga de imágenes
// - Autocompletado de productos
// - Efectos visuales y validaciones
// ============================================================================

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================
const CONFIG = {
  ERROR_DISPLAY_TIME: 3000,
  TRANSITION_DURATION: 300,
  DEFAULT_FONDO: 'css/fondo.css'
};

// ============================================================================
// ELEMENTOS DEL DOM - CACHEADO PARA MEJOR PERFORMANCE
// ============================================================================
const DOM_ELEMENTS = {
  // Botones principales
  botonDescargarRotulo: document.getElementById('botonDescargarRotulo'),
  botonAgregarCola: document.getElementById('botonAgregarCola'),
  botonDescargarLote: document.getElementById('botonDescargarLote'),
  botonLimpiarCola: document.getElementById('botonLimpiarCola'),
  botonModoOscuro: document.getElementById('botonModoOscuro'),
  botonAyuda: document.getElementById('botonAyuda'),
  
  // Campos de entrada
  producto: document.getElementById('producto'),
  actual: document.getElementById('actual'),
  anterior: document.getElementById('anterior'),
  promo: document.getElementById('promo'),
  codigo: document.getElementById('codigo'),
  nombreArchivoZip: document.getElementById('nombreArchivoZip'),
  
  // Campos de tipo de venta
  inputkg: document.getElementById('inputkg'),
  inputud: document.getElementById('inputud'),
  inputempty: document.getElementById('inputempty'),
  
  // Elementos del rótulo
  rotulo: document.getElementById('rotulo'),
  textoProducto: document.getElementById('texto-producto'),
  textoActual: document.getElementById('texto-actual'),
  textoAnterior: document.getElementById('texto-anterior'),
  textoAhorre: document.getElementById('texto-ahorre'),
  
  // Contenedor de previsualización
  contenedorRotulo: document.getElementById('contenedorRotulo'),
  
  // Elementos de la cola
  colaRotulos: document.getElementById('colaRotulos'),
  listaRotulos: document.getElementById('listaRotulos'),
  contadorRotulos: document.getElementById('contadorRotulos'),
  
  // Selector de fondo
  selectorFondo: document.getElementById('selectorFondo'),
  
  // Contenedores dinámicos
  campoUnidades: document.getElementById('campoUnidades'),
  campoUnidadesModal: document.getElementById('campoUnidadesModal'),
  selectorFondoModal: document.getElementById('editarFondo'),
  indicadorTamaño: document.getElementById('indicadorTamaño'),
  tituloApp: document.getElementById('tituloApp')
};

// ============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================================================
const APP_STATE = {
  baseDatos: [],
  linkFondo: null,
  modoOscuro: false,
  colaRotulos: [],
  editandoIndice: null, // null si no se está editando
  unidadSeleccionada: '', // Unidad seleccionada actualmente
  fondoSeleccionado: '' // Fondo seleccionado actualmente
};

// ============================================================================
// FUNCIONES DE INICIALIZACIÓN DINÁMICA
// ============================================================================

/**
 * Genera dinámicamente las opciones de unidades de medida
 */
const generarOpcionesUnidades = () => {
  if (!window.APP_CONFIG) return;
  
  const config = window.APP_CONFIG;
  const contenedor = DOM_ELEMENTS.campoUnidades;
  const contenedorModal = DOM_ELEMENTS.campoUnidadesModal;
  
  if (!contenedor || !contenedorModal) return;
  
  // Limpiar contenedores
  contenedor.innerHTML = '<span>Unidad de medida:</span>';
  contenedorModal.innerHTML = '<span>Unidad de medida:</span>';
  
  // Generar opciones para el formulario principal
  config.labels.units.forEach((unidad, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    
    input.type = 'radio';
    input.name = 'tipoVenta';
    input.value = unidad.value;
    input.id = `input${unidad.value || 'empty'}`;
    
    // Marcar como checked si es la unidad por defecto
    if (unidad.value === config.products.defaultUnit || (index === config.labels.units.length - 1 && !config.products.defaultUnit)) {
      input.checked = true;
      APP_STATE.unidadSeleccionada = unidad.value;
    }
    
    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${unidad.label}`));
    
    contenedor.appendChild(label);
  });
  
  // Generar opciones para el modal
  config.labels.units.forEach((unidad, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    
    input.type = 'radio';
    input.name = 'editarUnidad';
    input.value = unidad.value;
    input.id = `editar${unidad.value || 'Empty'}`;
    
    // Marcar como checked si es la unidad por defecto
    if (unidad.value === config.products.defaultUnit || (index === config.labels.units.length - 1 && !config.products.defaultUnit)) {
      input.checked = true;
    }
    
    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${unidad.label}`));
    
    contenedorModal.appendChild(label);
  });
};

/**
 * Genera dinámicamente las opciones de fondos
 */
const generarOpcionesFondos = () => {
  if (!window.APP_CONFIG) return;
  
  const config = window.APP_CONFIG;
  const selector = DOM_ELEMENTS.selectorFondo;
  const selectorModal = DOM_ELEMENTS.selectorFondoModal;
  
  if (!selector || !selectorModal) return;
  
  // Limpiar selectores
  selector.innerHTML = '';
  selectorModal.innerHTML = '';
  
  // Generar opciones para el formulario principal
  config.labels.backgrounds.forEach((fondo) => {
    const option = document.createElement('option');
    option.value = fondo.id;
    option.textContent = fondo.name;
    
    // Marcar como seleccionado si es el fondo por defecto
    if (fondo.id === config.labels.defaultBackground) {
      option.selected = true;
      APP_STATE.fondoSeleccionado = fondo.id;
    }
    
    selector.appendChild(option);
  });
  
  // Generar opciones para el modal
  config.labels.backgrounds.forEach((fondo) => {
    const option = document.createElement('option');
    option.value = fondo.id;
    option.textContent = fondo.name;
    
    // Marcar como seleccionado si es el fondo por defecto
    if (fondo.id === config.labels.defaultBackground) {
      option.selected = true;
    }
    
    selectorModal.appendChild(option);
  });
};

/**
 * Actualiza el indicador de tamaño dinámicamente
 */
const actualizarIndicadorTamaño = () => {
  if (!window.APP_CONFIG || !DOM_ELEMENTS.indicadorTamaño) return;
  
  const config = window.APP_CONFIG;
  const { width, height, previewScale } = config.labels.dimensions;
  const previewWidth = Math.round(width * previewScale);
  const previewHeight = Math.round(height * previewScale);
  
  DOM_ELEMENTS.indicadorTamaño.textContent = 
    `Tamaño real: ${width} x ${height} píxeles | Vista previa: ${previewWidth} x ${previewHeight} píxeles`;
};

/**
 * Actualiza el título de la aplicación
 */
const actualizarTituloApp = () => {
  if (!window.APP_CONFIG || !DOM_ELEMENTS.tituloApp) return;
  
  const config = window.APP_CONFIG;
  DOM_ELEMENTS.tituloApp.textContent = `Generador de Rótulos - ${config.store.name}`;
};

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================

/**
 * Obtiene los valores de precios y calcula el ahorro
 * @returns {Object} Objeto con actual, anterior y ahorro
 */
const obtenerValoresPrecios = () => {
  const actual = parseInt(DOM_ELEMENTS.actual.value) || 0;
  const anterior = parseInt(DOM_ELEMENTS.anterior.value) || 0;
  const ahorro = anterior - actual;
  const promo = parseInt(DOM_ELEMENTS.promo.value) || 0;
  
  return { actual, anterior, ahorro, promo };
};





// ============================================================================
// FUNCIONES DE MODO OSCURO
// ============================================================================

/**
 * Cambia entre modo claro y oscuro
 */
const toggleModoOscuro = () => {
  APP_STATE.modoOscuro = !APP_STATE.modoOscuro;
  
  if (APP_STATE.modoOscuro) {
    document.documentElement.setAttribute('data-theme', 'dark');
    DOM_ELEMENTS.botonModoOscuro.innerHTML = '<i class="fas fa-sun"></i>';
    DOM_ELEMENTS.botonModoOscuro.title = 'Cambiar a modo claro';
  } else {
    document.documentElement.removeAttribute('data-theme');
    DOM_ELEMENTS.botonModoOscuro.innerHTML = '<i class="fas fa-moon"></i>';
    DOM_ELEMENTS.botonModoOscuro.title = 'Cambiar a modo oscuro';
  }
  
  // Guardar preferencia en localStorage
  localStorage.setItem('modoOscuro', APP_STATE.modoOscuro);
};

/**
 * Carga la preferencia de modo oscuro desde localStorage
 */
const cargarPreferenciaModoOscuro = () => {
  const modoOscuroGuardado = localStorage.getItem('modoOscuro');
  
  if (modoOscuroGuardado === 'true') {
    APP_STATE.modoOscuro = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    DOM_ELEMENTS.botonModoOscuro.innerHTML = '<i class="fas fa-sun"></i>';
    DOM_ELEMENTS.botonModoOscuro.title = 'Cambiar a modo claro';
  }
};

/**
 * Inicializa el sistema de modo oscuro
 */
const inicializarModoOscuro = () => {
  // Cargar preferencia guardada
  cargarPreferenciaModoOscuro();
  
  // Event listener para el botón
  DOM_ELEMENTS.botonModoOscuro?.addEventListener('click', toggleModoOscuro);
  DOM_ELEMENTS.botonAyuda?.addEventListener('click', mostrarAyuda);
};

// ============================================================================
// FUNCIONES DE PREVISUALIZACIÓN
// ============================================================================

/**
 * Inicializa los controles de previsualización
 */
const inicializarControlesPreview = () => {
  // Por ahora no hay controles adicionales
  // Solo la previsualización estática
};

// ============================================================================
// FUNCIONES DE ATAJOS DE TECLADO
// ============================================================================



/**
 * Limpia todos los campos del formulario
 */
const limpiarFormulario = () => {
  // Limpiar campos de entrada
  DOM_ELEMENTS.producto.value = '';
  DOM_ELEMENTS.actual.value = '';
  DOM_ELEMENTS.anterior.value = '';
  DOM_ELEMENTS.promo.value = '';
  DOM_ELEMENTS.codigo.value = '';
  
  // Resetear radio buttons a la unidad por defecto
  if (window.APP_CONFIG) {
    const config = window.APP_CONFIG;
    const unidadDefault = config.products.defaultUnit || '';
    const radioDefault = document.querySelector(`input[name="tipoVenta"][value="${unidadDefault}"]`);
    if (radioDefault) {
      radioDefault.checked = true;
      APP_STATE.unidadSeleccionada = unidadDefault;
    }
  }
  
  // Resetear selector de fondo al fondo por defecto
  if (window.APP_CONFIG && DOM_ELEMENTS.selectorFondo) {
    const config = window.APP_CONFIG;
    DOM_ELEMENTS.selectorFondo.value = config.labels.defaultBackground;
    APP_STATE.fondoSeleccionado = config.labels.defaultBackground;
    
    // Cambiar el fondo visual
    if (APP_STATE.linkFondo) {
      const fondoSeleccionado = config.labels.backgrounds.find(b => b.id === config.labels.defaultBackground);
      if (fondoSeleccionado) {
        APP_STATE.linkFondo.href = fondoSeleccionado.cssFile;
      }
    }
  }
  
  // Actualizar rótulo
  actualizarRotulo();
  
  // Remover clases no-vacio
  document.querySelectorAll('.campo-input input').forEach(input => {
    input.classList.remove('no-vacio');
  });
  
  window.Utils.mostrarNotificacion('Formulario borrado', 'success');
};

/**
 * Muestra la ayuda con los atajos disponibles
 * Usa funciones de templates para mejor separación de responsabilidades
 */
const mostrarAyuda = () => {
  // Verificar si ya existe un modal de ayuda abierto
  const modalExistente = document.querySelector('.modal-ayuda');
  if (modalExistente) {
    modalExistente.remove();
    return;
  }
  
  // Crear modal usando templates
  const modal = window.Templates.crearModalAyuda();
  document.body.appendChild(modal);
  
  // Event listeners para cerrar
  const overlay = modal.querySelector('.modal-ayuda-overlay');
  const botonCerrar = modal.querySelector('.cerrar-ayuda');
  
  const cerrarModal = () => {
    modal.remove();
  };
  
  overlay.addEventListener('click', cerrarModal);
  botonCerrar.addEventListener('click', cerrarModal);
  
  // Cerrar con Escape
  const manejarEscape = (e) => {
    if (e.key === 'Escape') {
      cerrarModal();
      document.removeEventListener('keydown', manejarEscape);
    }
  };
  document.addEventListener('keydown', manejarEscape);
};

/**
 * Maneja los atajos de teclado
 * @param {KeyboardEvent} e - Evento de teclado
 */
const manejarAtajosTeclado = (e) => {
  // Solo procesar si no estamos en un campo de entrada
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
    return;
  }
  
  // Ctrl + Enter: Agregar a la cola
  if (e.ctrlKey && e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    agregarRotuloACola();
  }
  
  // Ctrl + Shift + Enter: Descargar lote
  if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
    e.preventDefault();
    descargarLoteRotulos();
  }
  
  // F1: Mostrar ayuda
  if (e.key === 'F1') {
    e.preventDefault();
    mostrarAyuda();
  }
  
  // Escape: Limpiar formulario
  if (e.key === 'Escape') {
    e.preventDefault();
    limpiarFormulario();
  }
};

/**
 * Inicializa los atajos de teclado
 */
const inicializarAtajosTeclado = () => {
  document.addEventListener('keydown', manejarAtajosTeclado);
};

// ============================================================================
// FUNCIONES DE PREVISUALIZACIÓN Y ACTUALIZACIÓN
// ============================================================================

/**
 * Actualiza la previsualización del rótulo en tiempo real
 */
const actualizarRotulo = () => {
  const { producto, actual, anterior, ahorro } = obtenerValoresPrecios();
  const productoTexto = DOM_ELEMENTS.producto.value.trim();
  
  // Actualizar texto del producto
  DOM_ELEMENTS.textoProducto.textContent = productoTexto || 'Nombre del producto';
  
  // Actualizar precio actual
  if (actual > 0) {
    const precioFormateado = window.Utils.formatearPrecio(actual);
    const promoValue = DOM_ELEMENTS.promo.value;
    
    if (APP_STATE.unidadSeleccionada) {
      // Si hay unidad seleccionada
      if (promoValue > 0) {
        // Si también hay promoción, mostrar ambos
        DOM_ELEMENTS.textoActual.innerHTML = `<span class="promo">${promoValue}x </span>${precioFormateado}<span class="unidad">/${APP_STATE.unidadSeleccionada}</span>`;
      } else {
        // Solo unidad
        DOM_ELEMENTS.textoActual.innerHTML = `${precioFormateado}<span class="unidad">/${APP_STATE.unidadSeleccionada}</span>`;
      }
    } else if (promoValue > 0) {
      // Solo promoción (sin unidad)
      DOM_ELEMENTS.textoActual.innerHTML = `<span class="promo">${promoValue}x </span>${precioFormateado}`;
    } else {
      // Solo precio
      DOM_ELEMENTS.textoActual.textContent = precioFormateado;
    }
  } else {
    DOM_ELEMENTS.textoActual.textContent = 'Precio actual';
  }
  
  // Actualizar precio anterior y ahorro
  if (window.Utils.esPrecioValido(anterior)) {
    if (ahorro > 0) {
      DOM_ELEMENTS.textoAnterior.textContent = `Precio regular: ${window.Utils.formatearPrecio(anterior)}`;
      DOM_ELEMENTS.textoAhorre.textContent = `Ahorro: ${window.Utils.formatearPrecio(ahorro)}`;
    } else {
      DOM_ELEMENTS.textoAnterior.textContent = '';
      DOM_ELEMENTS.textoAhorre.textContent = '';
    }
  } else {
    DOM_ELEMENTS.textoAnterior.textContent = '';
    DOM_ELEMENTS.textoAhorre.textContent = '';
  }
  
  // Actualizar imagen si hay código
  const codigo = DOM_ELEMENTS.codigo.value.trim();
  if (codigo) {
    cargarImagenProducto(codigo);
  }
};

/**
 * Descarga la imagen del rótulo actual
 */
const descargarImagen = async () => {
  const datos = obtenerDatosRotulo();
  
  if (!validarDatosRotulo(datos)) {
    return;
  }
  
  try {
    window.Utils.mostrarNotificacion('Generando imagen...', 'info');
    
    // Generar canvas del rótulo
    const canvas = await generarCanvasRotulo(datos);
    
    // Descargar imagen
    const config = window.APP_CONFIG;
    const formato = config?.export?.imageFormat || 'png';
    const calidad = config?.export?.imageQuality || 0.95;
    const extension = formato === 'jpeg' ? 'jpg' : formato;
    const prefijo = config?.export?.individualPrefix || 'rotulo_';
    const nombreArchivo = `${prefijo}${datos.producto}.${extension}`;
    window.Utils.descargarCanvas(canvas, nombreArchivo, formato, calidad);
    
    window.Utils.mostrarNotificacion('Imagen descargada correctamente', 'success');
  } catch (error) {
    console.error('Error al descargar imagen:', error);
    window.Utils.mostrarNotificacion('Error al generar la imagen', 'warning');
  }
};

/**
 * Obtiene todos los datos del formulario para crear un rótulo
 * @returns {Object} Datos del rótulo
 */
const obtenerDatosRotulo = () => {
  const { actual, anterior, ahorro } = obtenerValoresPrecios();
  const producto = DOM_ELEMENTS.producto.value.trim();
  const codigo = DOM_ELEMENTS.codigo.value.trim();
  const promo = DOM_ELEMENTS.promo.value.trim();
  const fondo = DOM_ELEMENTS.selectorFondo.value;
  
  // Obtener unidad de medida seleccionada
  const unidadRadio = document.querySelector('input[name="tipoVenta"]:checked');
  const unidad = unidadRadio ? unidadRadio.value : '';
  
  return {
    producto,
    codigo,
    actual,
    anterior,
    ahorro,
    promo,
    unidad,
    fondo,
    timestamp: Date.now()
  };
};

/**
 * Valida que los datos del rótulo sean válidos
 * @param {Object} datos - Datos del rótulo a validar
 * @returns {boolean} True si los datos son válidos
 */
const validarDatosRotulo = (datos) => {
  const resultado = window.Validation.validarRotulo(datos);
  if (!resultado.isValid) {
    if (resultado.errors && resultado.errors.length > 0) {
      window.Utils.mostrarError(resultado.errors[0]);
    }
    return false;
  }
  return true;
};

/**
 * Agrega un rótulo a la cola
 */
const agregarRotuloACola = () => {
  const datos = obtenerDatosRotulo();
  
  if (!validarDatosRotulo(datos)) {
    return;
  }
  
  if (APP_STATE.editandoIndice !== null) {
    // Guardar edición
    APP_STATE.colaRotulos[APP_STATE.editandoIndice] = datos;
    APP_STATE.editandoIndice = null;
    window.Utils.mostrarNotificacion('Rótulo editado correctamente', 'success');
  } else {
    // Agregar a la cola
    APP_STATE.colaRotulos.push(datos);
    window.Utils.mostrarNotificacion('Rótulo agregado a la cola', 'success');
  }
  
  // Actualizar interfaz
  actualizarInterfazCola();
  
  // Limpiar formulario
  limpiarFormulario();
};

/**
 * Elimina un rótulo de la cola por índice
 * @param {number} indice - Índice del rótulo a eliminar
 */
const eliminarRotuloDeCola = (indice) => {
  APP_STATE.colaRotulos.splice(indice, 1);
  actualizarInterfazCola();
  window.Utils.mostrarNotificacion('Rótulo eliminado de la cola', 'info');
};

/**
 * Limpia toda la cola de rótulos
 */
const limpiarCola = () => {
  APP_STATE.colaRotulos = [];
  actualizarInterfazCola();
  window.Utils.mostrarNotificacion('Cola de rótulos limpiada', 'info');
};

/**
 * Actualiza la interfaz de la cola de rótulos
 */
let actualizarInterfazCola = () => {
  const { colaRotulos } = APP_STATE;
  const { listaRotulos, contadorRotulos, botonDescargarLote, botonLimpiarCola } = DOM_ELEMENTS;
  
  // Actualizar contador
  contadorRotulos.textContent = `${colaRotulos.length} rótulo${colaRotulos.length !== 1 ? 's' : ''}`;
  
  // Habilitar/deshabilitar botones
  const tieneRotulos = colaRotulos.length > 0;
  botonDescargarLote.disabled = !tieneRotulos;
  botonLimpiarCola.disabled = !tieneRotulos;
  
  // Limpiar lista
  listaRotulos.innerHTML = '';
  
  if (!tieneRotulos) {
    // Mostrar mensaje de cola vacía
    listaRotulos.innerHTML = `
      <div class="mensaje-cola-vacia">
        <i class="fas fa-list"></i>
        <p>No hay rótulos en la cola</p>
        <span>Agrega productos usando el botón "Agregar a la cola"</span>
      </div>
    `;
    return;
  }
  
  // Crear elementos para cada rótulo
  colaRotulos.forEach((rotulo, indice) => {
    const itemRotulo = crearElementoRotulo(rotulo, indice);
    listaRotulos.appendChild(itemRotulo);
  });
};

/**
 * Crea un elemento HTML para mostrar un rótulo en la cola
 * @param {Object} rotulo - Datos del rótulo
 * @param {number} indice - Índice del rótulo en la cola
 * @returns {HTMLElement} Elemento HTML del rótulo
 */
const crearElementoRotulo = (rotulo, indice) => {
  const item = document.createElement('div');
  item.className = 'item-rotulo';
  
  const info = document.createElement('div');
  info.className = 'info-rotulo';
  
  const nombre = document.createElement('div');
  nombre.className = 'nombre-producto';
  nombre.textContent = rotulo.producto;
  
  const detalles = document.createElement('div');
  detalles.className = 'detalles-rotulo';
  
  // Agregar detalles del rótulo
  const detallesArray = [];
  
  if (rotulo.codigo) {
    detallesArray.push(`<div class="detalle-item"><i class="fas fa-barcode"></i>${rotulo.codigo}</div>`);
  }
  
  if (rotulo.actual) {
    const precioFormateado = window.Utils.formatearPrecio(rotulo.actual);
    if (rotulo.unidad) {
      detallesArray.push(`<div class="detalle-item"><i class="fas fa-dollar-sign"></i>${precioFormateado}<span class="unidad">/${rotulo.unidad}</span></div>`);
    } else {
      detallesArray.push(`<div class="detalle-item"><i class="fas fa-dollar-sign"></i>${precioFormateado}</div>`);
    }
  }
  
  if (rotulo.anterior && rotulo.ahorro > 0) {
    detallesArray.push(`<div class="detalle-item"><i class="fas fa-tag"></i>Antes: ₡${rotulo.anterior}</div>`);
    detallesArray.push(`<div class="detalle-item"><i class="fas fa-piggy-bank"></i>Ahorra: ₡${rotulo.ahorro}</div>`);
  }
  
  if (rotulo.promo) {
    detallesArray.push(`<div class="detalle-item"><i class="fas fa-times-circle"></i>Promo: ${rotulo.promo}</div>`);
  }
  
  detalles.innerHTML = detallesArray.join('');
  
  const acciones = document.createElement('div');
  acciones.className = 'acciones-rotulo';
  
  const botonEditar = document.createElement('button');
  botonEditar.type = 'button';
  botonEditar.className = 'boton-editar-rotulo';
  botonEditar.innerHTML = '<i class="fas fa-edit"></i>';
  botonEditar.title = 'Editar rótulo';
  botonEditar.addEventListener('click', () => editarRotuloDeCola(indice));

  // Botón de eliminar
  const botonEliminar = document.createElement('button');
  botonEliminar.type = 'button';
  botonEliminar.className = 'boton-eliminar-rotulo';
  botonEliminar.innerHTML = '<i class="fas fa-trash"></i>';
  botonEliminar.title = 'Eliminar de la cola';
  botonEliminar.addEventListener('click', () => eliminarRotuloDeCola(indice));

  // Ensamblar elemento
  info.appendChild(nombre);
  info.appendChild(detalles);
  acciones.appendChild(botonEditar);
  acciones.appendChild(botonEliminar);
  item.appendChild(info);
  item.appendChild(acciones);
  
  return item;
};

/**
 * Descarga todos los rótulos de la cola como imágenes
 */
const descargarLoteRotulos = async () => {
  const { colaRotulos } = APP_STATE;

  if (colaRotulos.length === 0) {
    window.Utils.mostrarError('No hay rótulos en la cola para descargar.');
    return;
  }

  try {
    window.Utils.mostrarNotificacion('Generando rótulos...', 'info');

    // Guardar fondo original
    const fondoOriginal = APP_STATE.linkFondo.href;

    // Crear un ZIP con todos los rótulos
    const JSZip = window.JSZip;
    if (!JSZip) {
      // Si no hay JSZip, descargar uno por uno
      for (let i = 0; i < colaRotulos.length; i++) {
        await cambiarFondoYEsperar(colaRotulos[i].fondo);
        await descargarRotuloIndividual(colaRotulos[i], i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      // Restaurar fondo original
      APP_STATE.linkFondo.href = fondoOriginal;
      window.Utils.mostrarNotificacion('Todos los rótulos han sido descargados', 'success');
      return;
    }

    // Usar JSZip para crear un archivo comprimido
    const zip = new JSZip();

    for (let i = 0; i < colaRotulos.length; i++) {
      const rotulo = colaRotulos[i];
      await cambiarFondoYEsperar(rotulo.fondo);
      const canvas = await generarCanvasRotulo(rotulo);
      const config = window.APP_CONFIG;
      const formato = config?.export?.imageFormat || 'png';
      const calidad = config?.export?.imageQuality || 0.95;
      const extension = formato === 'jpeg' ? 'jpg' : formato;
      const prefijo = config?.export?.individualPrefix || 'rotulo_';
      const nombreArchivo = `${prefijo}${rotulo.producto}.${extension}`;
      zip.file(nombreArchivo, canvas.toDataURL(`image/${formato}`, calidad).split(',')[1], {base64: true});
    }

    // Restaurar fondo original
    APP_STATE.linkFondo.href = fondoOriginal;

    const contenido = await zip.generateAsync({type: 'blob'});
    const enlace = document.createElement('a');
    enlace.download = DOM_ELEMENTS.nombreArchivoZip.value || 'rotulos-lote.zip';
    enlace.href = URL.createObjectURL(contenido);
    enlace.click();

    window.Utils.mostrarNotificacion('Lote de rótulos descargado exitosamente', 'success');

  } catch (error) {
    console.error('Error al descargar lote:', error);
    window.Utils.mostrarError('Error al generar el lote de rótulos.');
  }
};

// Función auxiliar para cambiar el fondo y esperar a que se aplique
async function cambiarFondoYEsperar(fondo) {
  return new Promise(resolve => {
    if (window.APP_CONFIG) {
      const config = window.APP_CONFIG;
      const fondoSeleccionado = config.labels.backgrounds.find(b => b.id === fondo);
      if (fondoSeleccionado) {
        APP_STATE.linkFondo.href = fondoSeleccionado.cssFile;
      } else {
        APP_STATE.linkFondo.href = `css/${fondo}.css`;
      }
    } else {
      APP_STATE.linkFondo.href = `css/${fondo}.css`;
    }
    setTimeout(resolve, 120); // Espera 120ms para que el CSS se aplique
  });
}

/**
 * Genera un canvas para un rótulo específico
 * @param {Object} rotulo - Datos del rótulo
 * @returns {HTMLCanvasElement} Canvas con el rótulo
 */
const generarCanvasRotulo = async (rotulo) => {
  // Crear un elemento temporal para el rótulo
  const rotuloTemp = DOM_ELEMENTS.rotulo.cloneNode(true);
  rotuloTemp.style.position = 'absolute';
  rotuloTemp.style.left = '-9999px';
  document.body.appendChild(rotuloTemp);

  // Aplicar datos al rótulo temporal
  const textoProducto = rotuloTemp.querySelector('.producto');
  const textoActual = rotuloTemp.querySelector('.precio-actual');
  const textoAnterior = rotuloTemp.querySelector('.antes');
  const textoAhorre = rotuloTemp.querySelector('.ahorre');

  textoProducto.textContent = rotulo.producto;

  // Siempre mostrar precio actual
  if (window.Utils.esPrecioValido(rotulo.actual)) {
    const precioFormateado = window.Utils.formatearPrecio(rotulo.actual);
    
    if (rotulo.unidad) {
      // Si hay unidad seleccionada
      if (rotulo.promo && rotulo.promo > 0) {
        // Si también hay promoción, mostrar ambos
        textoActual.innerHTML = `<span class="promo">${rotulo.promo}x </span>${precioFormateado}<span class="unidad">/${rotulo.unidad}</span>`;
      } else {
        // Solo unidad
        textoActual.innerHTML = `${precioFormateado}<span class="unidad">/${rotulo.unidad}</span>`;
      }
    } else if (rotulo.promo && rotulo.promo > 0) {
      // Solo promoción (sin unidad)
      textoActual.innerHTML = `<span class="promo">${rotulo.promo}x </span>${precioFormateado}`;
    } else {
      // Solo precio
      textoActual.textContent = precioFormateado;
    }
    textoActual.style.display = 'block';
  } else {
    textoActual.innerHTML = '';
    textoActual.style.display = 'block';
  }

  if (window.Utils.esPrecioValido(rotulo.actual) && window.Utils.esPrecioValido(rotulo.anterior)) {
    if (window.Utils.esPrecioValido(rotulo.anterior)) {
      if (window.Utils.esPrecioValido(rotulo.actual) && rotulo.ahorro > 0) {
        textoAnterior.textContent = `Precio regular: ${window.Utils.formatearPrecio(rotulo.anterior)}`;
        textoAhorre.textContent = `Ahorro: ${window.Utils.formatearPrecio(rotulo.ahorro)}`;
        textoAnterior.style.display = 'block';
        textoAhorre.style.display = 'block';
      } else {
        textoAnterior.textContent = '';
        textoAhorre.textContent = '';
        textoAnterior.style.display = 'none';
        textoAhorre.style.display = 'none';
      }
    } else {
      textoAnterior.textContent = '';
      textoAhorre.textContent = '';
      textoAnterior.style.display = 'none';
      textoAhorre.style.display = 'none';
    }
  } else {
    textoAnterior.textContent = '';
    textoAhorre.textContent = '';
    textoAnterior.style.display = 'none';
    textoAhorre.style.display = 'none';
  }

  // Generar canvas
  const canvas = await html2canvas(rotuloTemp);

  // Limpiar elemento temporal
  document.body.removeChild(rotuloTemp);

  return canvas;
};

/**
 * Descarga un rótulo individual
 * @param {Object} rotulo - Datos del rótulo
 * @param {number} indice - Índice del rótulo
 */
const descargarRotuloIndividual = async (rotulo, indice) => {
  try {
    const canvas = await generarCanvasRotulo(rotulo);
    const config = window.APP_CONFIG;
    const formato = config?.export?.imageFormat || 'png';
    const calidad = config?.export?.imageQuality || 0.95;
    const extension = formato === 'jpeg' ? 'jpg' : formato;
    const prefijo = config?.export?.individualPrefix || 'rotulo_';
    const nombreArchivo = `${prefijo}${rotulo.producto}.${extension}`;
    window.Utils.descargarCanvas(canvas, nombreArchivo, formato, calidad);
  } catch (error) {
    console.error(`Error al descargar rótulo ${indice + 1}:`, error);
  }
};

// ============================================================================
// FUNCIONES DE AUTocompletado Y BASE DE DATOS
// ============================================================================

/**
 * Carga la base de datos de productos desde el archivo JSON
 * Usa async/await para mejor manejo de errores
 */
const cargarBaseDatos = async () => {
  try {
    const response = await fetch('js/productos.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    APP_STATE.baseDatos = data;
  } catch (error) {
    console.error('Error al cargar la base de datos:', error);
    window.Utils.mostrarError('Error al cargar la base de datos de productos.');
  }
};

/**
 * Autocompleta el campo de producto basado en el código ingresado
 * Optimizada para búsqueda eficiente
 */
const autocompletarProducto = () => {
  const codigoIngresado = DOM_ELEMENTS.codigo.value.trim().toUpperCase();
  
  if (!codigoIngresado) {
    cargarImagenProducto(null); // Ocultar imagen
    return;
  }

  const productoEncontrado = APP_STATE.baseDatos.find(producto =>
    producto.codigos.includes(codigoIngresado)
  );
  
  if (productoEncontrado) {
    DOM_ELEMENTS.producto.value = productoEncontrado.nombre;
    DOM_ELEMENTS.producto.classList.add('no-vacio');
    actualizarRotulo();
  }
  
  // Cargar imagen asociada al código
  cargarImagenProducto(codigoIngresado);
};

// ============================================================================
// FUNCIONES DE INTERFAZ DE USUARIO
// ============================================================================

/**
 * Maneja las clases CSS para inputs no vacíos
 * Optimizada para mejor performance con delegación de eventos
 */
const manejarClasesInputs = () => {
  const actualizarClase = (input) => {
    const tieneValor = input.value.trim() !== '';
    input.classList.toggle('no-vacio', tieneValor);
  };

  // Aplicar a todos los inputs existentes
  document.querySelectorAll('.campo-input input').forEach(actualizarClase);

  // Delegación de eventos para inputs dinámicos
  document.addEventListener('input', (e) => {
    if (e.target.matches('.campo-input input')) {
      actualizarClase(e.target);
    }
  });
};

/**
 * Añade efecto ripple a los botones
 * Optimizada para mejor performance y reutilización
 */
const inicializarEfectoRipple = () => {
  const crearRipple = (e, boton) => {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = boton.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
    `;

    boton.appendChild(ripple);

    // Limpiar ripple después de la animación
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  };

  // Aplicar a botones existentes
  document.querySelectorAll('.ripple').forEach(boton => {
    boton.addEventListener('click', (e) => crearRipple(e, boton));
});

  // Delegación para botones dinámicos
  document.addEventListener('click', (e) => {
    if (e.target.matches('.ripple')) {
      crearRipple(e, e.target);
    }
  });
};

/**
 * Inicializa el sistema de fondos del rótulo
 * Permite cambiar dinámicamente el estilo del rótulo
 */
const inicializarSistemaFondos = () => {
  // Crear elemento link para el fondo
  APP_STATE.linkFondo = document.createElement('link');
  APP_STATE.linkFondo.rel = 'stylesheet';
  APP_STATE.linkFondo.id = 'estiloFondo';
  
  // Usar configuración si está disponible
  if (window.APP_CONFIG) {
    const config = window.APP_CONFIG;
    const fondoDefault = config.labels.backgrounds.find(b => b.id === config.labels.defaultBackground);
    APP_STATE.linkFondo.href = fondoDefault ? fondoDefault.cssFile : CONFIG.DEFAULT_FONDO;
  } else {
    APP_STATE.linkFondo.href = CONFIG.DEFAULT_FONDO;
  }
  
  document.head.appendChild(APP_STATE.linkFondo);

  // Event listener para cambiar fondo
  DOM_ELEMENTS.selectorFondo?.addEventListener('change', function() {
    const fondo = this.value;
    if (window.APP_CONFIG) {
      const config = window.APP_CONFIG;
      const fondoSeleccionado = config.labels.backgrounds.find(b => b.id === fondo);
      if (fondoSeleccionado) {
        APP_STATE.linkFondo.href = fondoSeleccionado.cssFile;
        APP_STATE.fondoSeleccionado = fondo;
      }
    } else {
      APP_STATE.linkFondo.href = `css/${fondo}.css`;
    }
  });
};

// --- PERSISTENCIA DE LA COLA EN CACHE (localStorage) ---
function guardarColaEnCache() {
  localStorage.setItem('colaRotulos', JSON.stringify(APP_STATE.colaRotulos));
}
function cargarColaDeCache() {
  const data = localStorage.getItem('colaRotulos');
  if (data) {
    try {
      APP_STATE.colaRotulos = JSON.parse(data);
    } catch (e) {
      APP_STATE.colaRotulos = [];
    }
  }
}
const actualizarInterfazCola_original = actualizarInterfazCola;
actualizarInterfazCola = function() {
  actualizarInterfazCola_original();
  guardarColaEnCache();
}
cargarColaDeCache();

// ============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================================================

/**
 * Inicializa todos los event listeners de la aplicación
 * Organizada por funcionalidad para mejor mantenimiento
 */
const inicializarEventListeners = () => {
  // Event listeners principales para la cola
  DOM_ELEMENTS.botonAgregarCola?.addEventListener('click', agregarRotuloACola);
  DOM_ELEMENTS.botonDescargarLote?.addEventListener('click', descargarLoteRotulos);
  DOM_ELEMENTS.botonLimpiarCola?.addEventListener('click', limpiarCola);
  DOM_ELEMENTS.botonDescargarRotulo?.addEventListener('click', descargarImagen);
  
  // Event listeners para actualización en tiempo real
  const camposActualizacion = [
    DOM_ELEMENTS.producto,
    DOM_ELEMENTS.actual,
    DOM_ELEMENTS.anterior,
    DOM_ELEMENTS.promo
  ];
  
  camposActualizacion.forEach(campo => {
    campo?.addEventListener('input', actualizarRotulo);
  });

  // Event listeners para tipo de venta (usando delegación para elementos dinámicos)
  document.addEventListener('change', (e) => {
    if (e.target.matches('input[name="tipoVenta"]')) {
      APP_STATE.unidadSeleccionada = e.target.value;
      actualizarRotulo();
    }
  });

  // Event listener para autocompletado
  DOM_ELEMENTS.codigo?.addEventListener('input', autocompletarProducto);
};

/**
 * Función principal de inicialización
 * Ejecuta todas las funciones de setup en el orden correcto
 */
const inicializarAplicacion = async () => {
  try {
    // Esperar a que la configuración esté disponible
    if (!window.APP_CONFIG) {
      console.warn('⚠️ Configuración no disponible, usando valores por defecto');
    }
    
    // Inicializar elementos dinámicos
    generarOpcionesUnidades();
    generarOpcionesFondos();
    actualizarIndicadorTamaño();
    actualizarTituloApp();
    
    // Cargar base de datos primero
    await cargarBaseDatos();
    
    // Inicializar sistemas de UI
    inicializarSistemaFondos();
    inicializarEfectoRipple();
    manejarClasesInputs();
    inicializarControlesPreview(); // Inicializar controles de previsualización
    inicializarModoOscuro(); // Inicializar modo oscuro
    inicializarAtajosTeclado(); // Inicializar atajos de teclado
    
    // Configurar event listeners
    inicializarEventListeners();
    
    // Inicializar modal de edición
    inicializarModalEditarRotulo();
    
    // Inicializar interfaz de la cola
    actualizarInterfazCola();
    
    // Actualizar rótulo inicial
    actualizarRotulo();
    
    console.log('✅ Aplicación inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
    window.Utils.mostrarError('Error al inicializar la aplicación.');
  }
};

// ============================================================================
// EJECUCIÓN CUANDO EL DOM ESTÉ LISTO
// ============================================================================

// Usar DOMContentLoaded para mejor performance
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarAplicacion);
} else {
  // DOM ya está listo
  inicializarAplicacion();
}

// Reemplazar la función editarRotuloDeCola para usar el modal
function editarRotuloDeCola(indice) {
  const rotulo = APP_STATE.colaRotulos[indice];
  if (!rotulo) return;
  
  // Mostrar modal
  const modal = document.getElementById('modalEditarRotulo');
  modal.style.display = 'flex';
  
  // Cargar datos en campos del modal
  document.getElementById('editarProducto').value = rotulo.producto;
  document.getElementById('editarCodigo').value = rotulo.codigo;
  document.getElementById('editarActual').value = rotulo.actual;
  document.getElementById('editarAnterior').value = rotulo.anterior;
  document.getElementById('editarPromo').value = rotulo.promo;
  
  // Unidades - manejo dinámico
  if (window.APP_CONFIG) {
    const config = window.APP_CONFIG;
    // Desmarcar todos los radio buttons primero
    config.labels.units.forEach(unidad => {
      const radioId = `editar${unidad.value || 'Empty'}`;
      const radio = document.getElementById(radioId);
      if (radio) {
        radio.checked = false;
      }
    });
    
    // Marcar el radio button correspondiente a la unidad del rótulo
    const unidadEncontrada = config.labels.units.find(u => u.value === rotulo.unidad);
    if (unidadEncontrada) {
      const radioId = `editar${unidadEncontrada.value || 'Empty'}`;
      const radio = document.getElementById(radioId);
      if (radio) {
        radio.checked = true;
      }
    }
  } else {
    // Fallback para configuración no disponible
    if (rotulo.unidad === 'kg') document.getElementById('editarKg').checked = true;
    else if (rotulo.unidad === 'ud') document.getElementById('editarUd').checked = true;
    else document.getElementById('editarEmpty').checked = true;
  }
  
  // Fondo
  document.getElementById('editarFondo').value = rotulo.fondo;
  
  // Guardar índice en edición
  APP_STATE.editandoIndice = indice;
}

// Lógica para guardar/cancelar edición desde el modal
function inicializarModalEditarRotulo() {
  const modal = document.getElementById('modalEditarRotulo');
  const form = document.getElementById('formEditarRotulo');
  const cerrarBtn = document.getElementById('cerrarModalEditar');
  const cancelarBtn = document.getElementById('cancelarModalEditar');

  function cerrarModal() {
    modal.style.display = 'none';
    APP_STATE.editandoIndice = null;
  }

  cerrarBtn.onclick = cerrarModal;
  cancelarBtn.onclick = cerrarModal;
  modal.querySelector('.modal-editar-overlay').onclick = cerrarModal;

  form.onsubmit = function(e) {
    e.preventDefault();
    const datos = {
      producto: document.getElementById('editarProducto').value.trim(),
      codigo: document.getElementById('editarCodigo').value.trim(),
      actual: parseInt(document.getElementById('editarActual').value) || 0,
      anterior: parseInt(document.getElementById('editarAnterior').value) || 0,
      promo: document.getElementById('editarPromo').value.trim(),
      fondo: document.getElementById('editarFondo').value,
    };
    // Obtener unidad seleccionada dinámicamente
    let unidadSeleccionada = '';
    if (window.APP_CONFIG) {
      const config = window.APP_CONFIG;
      for (const unidad of config.labels.units) {
        const radioId = `editar${unidad.value || 'Empty'}`;
        const radio = document.getElementById(radioId);
        if (radio && radio.checked) {
          unidadSeleccionada = unidad.value;
          break;
        }
      }
    } else {
      // Fallback para configuración no disponible
      unidadSeleccionada = document.getElementById('editarKg').checked ? 'kg' : 
                          (document.getElementById('editarUd').checked ? 'ud' : '');
    }
    
    datos.unidad = unidadSeleccionada;
    datos.ahorro = datos.anterior - datos.actual;
    datos.timestamp = Date.now();
    
    // Validación estricta usando validación centralizada
    const resultado = window.Validation.validarRotulo(datos);
    if (!resultado.isValid) {
      if (resultado.errors && resultado.errors.length > 0) {
        window.Utils.mostrarError(resultado.errors[0]);
      }
      return;
    }
    if (APP_STATE.editandoIndice !== null) {
      APP_STATE.colaRotulos[APP_STATE.editandoIndice] = datos;
      actualizarInterfazCola();
      window.Utils.mostrarNotificacion('Rótulo editado correctamente', 'success');
    }
    cerrarModal();
  };
}

// Llamar a inicializarModalEditarRotulo en la inicialización principal
document.addEventListener('DOMContentLoaded', function() {
  inicializarModalEditarRotulo();
});

// ============================================================================
// FUNCIONES PARA MANEJO DE IMÁGENES DE PRODUCTOS
// ============================================================================

/**
 * Carga y muestra la imagen del producto basada en el código
 * @param {string} codigo - Código del producto
 */
const cargarImagenProducto = async (codigo) => {
  const imagenProducto = document.getElementById('imagen-producto');
  
  if (!codigo) {
    // Ocultar imagen si no hay código
    imagenProducto.style.display = 'none';
    imagenProducto.removeAttribute('data-codigo');
    return;
  }
  
  try {
    // Intentar cargar la imagen desde la carpeta recursos/imagenes/
    const response = await fetch(`recursos/imagenes/${codigo}`);
    
    if (!response.ok) {
      // Si no existe el archivo, ocultar imagen
      imagenProducto.style.display = 'none';
      imagenProducto.removeAttribute('data-codigo');
      return;
    }
    
    // Obtener el blob de la imagen
    const blob = await response.blob();
    
    // Convertir a base64
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64 = e.target.result;
      
      // Aplicar imagen
      imagenProducto.style.backgroundImage = `url('${base64}')`;
      imagenProducto.style.display = 'block';
      imagenProducto.setAttribute('data-codigo', codigo);
    };
    reader.readAsDataURL(blob);
    
  } catch (error) {
    console.warn(`No se pudo cargar la imagen para el código ${codigo}:`, error);
    imagenProducto.style.display = 'none';
    imagenProducto.removeAttribute('data-codigo');
  }
};