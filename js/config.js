// ============================================================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ============================================================================
// Este archivo contiene toda la configuración personalizable de la aplicación
// Modifica estos valores para adaptar la aplicación a tu tienda
// ============================================================================

const APP_CONFIG = {
  // ============================================================================
  // INFORMACIÓN DE LA TIENDA
  // ============================================================================
  store: {
    name: "Mi Tienda",
    slogan: "Calidad y Precio",
    currency: "₡", // Símbolo de moneda (₡, $, €, etc.)
    currencyCode: "CRC", // Código de moneda (CRC, USD, EUR, etc.)
    language: "es", // Idioma (es, en, fr, etc.)
    timezone: "America/Costa_Rica" // Zona horaria
  },

  // ============================================================================
  // CONFIGURACIÓN DE RÓTULOS
  // ============================================================================
  labels: {
    dimensions: {
      width: 768,
      height: 993,
      previewScale: 0.4 // Escala de la vista previa (0.4 = 40%)
    },
    defaultBackground: "fondo", // Fondo por defecto
    backgrounds: [
      {
        id: "fondo",
        name: "Diseño #1",
        cssFile: "css/fondo.css"
      },
      {
        id: "fondo2", 
        name: "Diseño #2",
        cssFile: "css/fondo2.css"
      },
      {
        id: "fondo3",
        name: "Diseño #3", 
        cssFile: "css/fondo3.css"
      }
    ],
    units: [
      { value: "kg", label: "Kilogramo" },
      { value: "ud", label: "Unidad" },
      { value: "lb", label: "Libra" },
      { value: "g", label: "Gramo" },
      { value: "l", label: "Litro" },
      { value: "ml", label: "Mililitro" },
      { value: "", label: "No indicar" }
    ]
  },

  // ============================================================================
  // CONFIGURACIÓN DE PRODUCTOS
  // ============================================================================
  products: {
    databaseFile: "js/productos.json", // Archivo de base de datos
    enableAutocomplete: true, // Habilitar autocompletado
    searchFields: ["codigos", "nombre"], // Campos para buscar
    defaultUnit: "" // Unidad por defecto
  },

  // ============================================================================
  // CONFIGURACIÓN DE INTERFAZ
  // ============================================================================
  ui: {
    theme: {
      primaryColor: "#146044",
      enableDarkMode: true,
      defaultDarkMode: false
    },
    notifications: {
      duration: 3000, // Duración en ms
      position: "top-right" // Posición (top-right, top-left, bottom-right, bottom-left)
    },
    shortcuts: {
      enabled: true,
      addToQueue: "Ctrl + Enter",
      downloadBatch: "Ctrl + Shift + Enter", 
      help: "F1",
      clearForm: "Escape"
    }
  },

  // ============================================================================
  // CONFIGURACIÓN DE EXPORTACIÓN
  // ============================================================================
  export: {
    imageFormat: "png", // Formato de imagen (png, jpeg)
    imageQuality: 0.95, // Calidad de imagen (0-1)
    zipFileName: "rotulos", // Nombre del archivo ZIP
    individualPrefix: "rotulo_" // Prefijo para archivos individuales
  },

  // ============================================================================
  // CONFIGURACIÓN DE VALIDACIÓN
  // ============================================================================
  validation: {
    requireProduct: true, // Requerir nombre de producto
    requireCurrentPrice: true, // Requerir precio actual
    requireCode: false, // Requerir código
    minPrice: 0, // Precio mínimo
    maxPrice: 999999, // Precio máximo
    maxProductLength: 50, // Longitud máxima del nombre del producto
    maxCodeLength: 20 // Longitud máxima del código
  },

  // ============================================================================
  // CONFIGURACIÓN DE ALMACENAMIENTO
  // ============================================================================
  storage: {
    enableLocalStorage: true, // Habilitar guardado local
    queueKey: "rotulosQueue", // Clave para la cola en localStorage
    settingsKey: "appSettings", // Clave para configuraciones
    maxQueueSize: 100 // Tamaño máximo de la cola
  }
};

// Hacer la configuración disponible globalmente
window.APP_CONFIG = APP_CONFIG; 