// ============================================================================
// TEMPLATES PARA LA APLICACIÓN
// ============================================================================
// Este archivo contiene funciones para generar HTML dinámicamente
// sin mezclar HTML con la lógica de JavaScript
// ============================================================================

// Hacer las funciones disponibles globalmente
window.Templates = {};

/**
 * Crea una notificación usando DOM API en lugar de innerHTML
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación
 * @returns {HTMLElement} Elemento de notificación creado
 */
window.Templates.crearNotificacion = (mensaje, tipo = 'info') => {
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion notificacion-${tipo}`;
  
  const icono = document.createElement('i');
  const iconos = {
    success: 'check-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  icono.className = `fas fa-${iconos[tipo] || iconos.info}`;
  
  const texto = document.createElement('span');
  texto.textContent = mensaje;
  
  notificacion.appendChild(icono);
  notificacion.appendChild(texto);
  
  return notificacion;
};

/**
 * Crea un elemento de atajo de teclado
 * @param {string} teclas - Teclas a mostrar (ej: "Ctrl + Enter")
 * @param {string} descripcion - Descripción del atajo
 * @returns {HTMLElement} Elemento de atajo creado
 */
window.Templates.crearAtajo = (teclas, descripcion) => {
  const atajo = document.createElement('div');
  atajo.className = 'atajo';
  
  // Crear elementos kbd para cada tecla
  const teclasArray = teclas.split(' + ');
  teclasArray.forEach((tecla, index) => {
    const kbd = document.createElement('kbd');
    kbd.textContent = tecla;
    atajo.appendChild(kbd);
    
    // Agregar separador si no es la última tecla
    if (index < teclasArray.length - 1) {
      const separador = document.createTextNode(' + ');
      atajo.appendChild(separador);
    }
  });
  
  const span = document.createElement('span');
  span.textContent = descripcion;
  atajo.appendChild(span);
  
  return atajo;
};

/**
 * Crea el modal de ayuda completo
 * @returns {HTMLElement} Modal de ayuda creado
 */
window.Templates.crearModalAyuda = () => {
  const modal = document.createElement('div');
  modal.className = 'modal-ayuda';
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-ayuda-overlay';
  
  const content = document.createElement('div');
  content.className = 'modal-ayuda-content';
  
  const header = document.createElement('div');
  header.className = 'modal-ayuda-header';
  
  const titulo = document.createElement('h3');
  titulo.textContent = 'Atajos de Teclado';
  
  const botonCerrar = document.createElement('button');
  botonCerrar.className = 'cerrar-ayuda';
  botonCerrar.textContent = '×';
  
  const body = document.createElement('div');
  body.className = 'modal-ayuda-body';
  
  // Agregar atajos
  const atajos = [
    { teclas: 'Ctrl + Enter', descripcion: 'Agregar a la cola' },
    { teclas: 'Ctrl + Shift + Enter', descripcion: 'Descargar lote de rótulos' },
    { teclas: 'F1', descripcion: 'Mostrar/ocultar esta ayuda' },
    { teclas: 'Escape', descripcion: 'Limpiar formulario' },
    { teclas: 'Tab', descripcion: 'Navegar entre campos' }
  ];
  
  atajos.forEach(atajo => {
    body.appendChild(window.Templates.crearAtajo(atajo.teclas, atajo.descripcion));
  });
  
  // Ensamblar modal
  header.appendChild(titulo);
  header.appendChild(botonCerrar);
  content.appendChild(header);
  content.appendChild(body);
  overlay.appendChild(content);
  modal.appendChild(overlay);
  
  return modal;
}; 