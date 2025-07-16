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
    name: "Mi tienda",
    currency: "₡" // Símbolo de moneda (₡, $, €, etc.)
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
        name: "Fondo #1",
        cssFile: "css/fondo.css"
      },
      {
        id: "fondo2", 
        name: "Fondo #2",
        cssFile: "css/fondo2.css"
      },
      {
        id: "fondo3",
        name: "Fondo #3", 
        cssFile: "css/fondo3.css"
      }
    ],
    units: [
      { value: "kg", label: "Kilogramo" },
      { value: "ud", label: "Unidad" },
      { value: "", label: "No indicar" }
    ]
  },

  // ============================================================================
  // CONFIGURACIÓN DE PRODUCTOS
  // ============================================================================
  products: {
    defaultUnit: "" // Unidad por defecto
  },



  // ============================================================================
  // CONFIGURACIÓN DE EXPORTACIÓN
  // ============================================================================
  export: {
    imageFormat: "png", // Formato de imagen (png, jpeg)
    imageQuality: 1, // Calidad de imagen (0-1)
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
    maxQueueSize: 100 // Tamaño máximo de la cola
  },

  // ============================================================================
  // CONFIGURACIÓN DE FORMATO
  // ============================================================================
  format: {
    useThousandSeparator: false, // Usar separadores de miles (comas)
    thousandSeparator: ",", // Separador de miles (coma, punto, espacio)
    decimalSeparator: "." // Separador decimal
  }
};

// Hacer la configuración disponible globalmente
window.APP_CONFIG = APP_CONFIG; 