// ============================================================================
// CONFIGURACIÓN DE EJEMPLO - DIFERENTES ESCENARIOS
// ============================================================================
// Este archivo muestra ejemplos de configuración para diferentes tipos de negocios
// Copia y pega la configuración que necesites en config.js
// ============================================================================

// ============================================================================
// EJEMPLO 1: SUPERMERCADO EN ESTADOS UNIDOS
// ============================================================================
const CONFIG_SUPERMERCADO_USA = {
  store: {
    name: "Fresh Market",
    slogan: "Fresh & Quality",
    currency: "$",
    currencyCode: "USD",
    language: "en",
    timezone: "America/New_York"
  },
  labels: {
    dimensions: {
      width: 768,
      height: 993,
      previewScale: 0.4
    },
    defaultBackground: "fondo",
    backgrounds: [
      {
        id: "fondo",
        name: "Fresh Market Design",
        cssFile: "css/fondo.css"
      },
      {
        id: "fondo2",
        name: "Sale Design",
        cssFile: "css/fondo2.css"
      },
      {
        id: "fondo3",
        name: "Generic Design",
        cssFile: "css/fondo3.css"
      }
    ],
    units: [
      { value: "lb", label: "Pound" },
      { value: "oz", label: "Ounce" },
      { value: "gal", label: "Gallon" },
      { value: "qt", label: "Quart" },
      { value: "pt", label: "Pint" },
      { value: "fl oz", label: "Fluid Ounce" },
      { value: "each", label: "Each" },
      { value: "", label: "No unit" }
    ]
  },
  validation: {
    requireProduct: true,
    requireCurrentPrice: true,
    requireCode: false,
    minPrice: 0,
    maxPrice: 9999.99,
    maxProductLength: 40,
    maxCodeLength: 15
  }
};

// ============================================================================
// EJEMPLO 2: TIENDA DE ROPA EN ESPAÑA
// ============================================================================
const CONFIG_TIENDA_ROPA_ESPAÑA = {
  store: {
    name: "Moda Elegante",
    slogan: "Estilo y Calidad",
    currency: "€",
    currencyCode: "EUR",
    language: "es",
    timezone: "Europe/Madrid"
  },
  labels: {
    dimensions: {
      width: 600,
      height: 800,
      previewScale: 0.5
    },
    defaultBackground: "fondo",
    backgrounds: [
      {
        id: "fondo",
        name: "Diseño Elegante",
        cssFile: "css/fondo.css"
      },
      {
        id: "fondo2",
        name: "Diseño Rebajas",
        cssFile: "css/fondo2.css"
      }
    ],
    units: [
      { value: "ud", label: "Unidad" },
      { value: "par", label: "Par" },
      { value: "set", label: "Set" },
      { value: "", label: "No indicar" }
    ]
  },
  validation: {
    requireProduct: true,
    requireCurrentPrice: true,
    requireCode: true,
    minPrice: 0,
    maxPrice: 999.99,
    maxProductLength: 30,
    maxCodeLength: 12
  }
};

// ============================================================================
// EJEMPLO 3: FARMACIA EN MÉXICO
// ============================================================================
const CONFIG_FARMACIA_MEXICO = {
  store: {
    name: "Farmacia San José",
    slogan: "Salud y Bienestar",
    currency: "$",
    currencyCode: "MXN",
    language: "es",
    timezone: "America/Mexico_City"
  },
  labels: {
    dimensions: {
      width: 700,
      height: 900,
      previewScale: 0.45
    },
    defaultBackground: "fondo",
    backgrounds: [
      {
        id: "fondo",
        name: "Diseño Farmacia",
        cssFile: "css/fondo.css"
      },
      {
        id: "fondo2",
        name: "Diseño Oferta",
        cssFile: "css/fondo2.css"
      }
    ],
    units: [
      { value: "ml", label: "Mililitro" },
      { value: "l", label: "Litro" },
      { value: "mg", label: "Miligramo" },
      { value: "g", label: "Gramo" },
      { value: "ud", label: "Unidad" },
      { value: "caja", label: "Caja" },
      { value: "", label: "No indicar" }
    ]
  },
  validation: {
    requireProduct: true,
    requireCurrentPrice: true,
    requireCode: true,
    minPrice: 0,
    maxPrice: 9999.99,
    maxProductLength: 35,
    maxCodeLength: 20
  }
};

// ============================================================================
// EJEMPLO 4: TIENDA DE ELECTRÓNICOS EN CANADÁ
// ============================================================================
const CONFIG_ELECTRONICOS_CANADA = {
  store: {
    name: "Tech Store",
    slogan: "Innovation & Quality",
    currency: "C$",
    currencyCode: "CAD",
    language: "en",
    timezone: "America/Toronto"
  },
  labels: {
    dimensions: {
      width: 800,
      height: 1000,
      previewScale: 0.35
    },
    defaultBackground: "fondo",
    backgrounds: [
      {
        id: "fondo",
        name: "Tech Design",
        cssFile: "css/fondo.css"
      },
      {
        id: "fondo2",
        name: "Sale Design",
        cssFile: "css/fondo2.css"
      }
    ],
    units: [
      { value: "each", label: "Each" },
      { value: "set", label: "Set" },
      { value: "pack", label: "Pack" },
      { value: "box", label: "Box" },
      { value: "", label: "No unit" }
    ]
  },
  validation: {
    requireProduct: true,
    requireCurrentPrice: true,
    requireCode: false,
    minPrice: 0,
    maxPrice: 99999.99,
    maxProductLength: 45,
    maxCodeLength: 25
  }
};

// ============================================================================
// EJEMPLO 5: MINIMARKET EN ARGENTINA
// ============================================================================
const CONFIG_MINIMARKET_ARGENTINA = {
  store: {
    name: "MiniMarket Express",
    slogan: "Rápido y Conveniente",
    currency: "$",
    currencyCode: "ARS",
    language: "es",
    timezone: "America/Argentina/Buenos_Aires"
  },
  labels: {
    dimensions: {
      width: 650,
      height: 850,
      previewScale: 0.5
    },
    defaultBackground: "fondo",
    backgrounds: [
      {
        id: "fondo",
        name: "Diseño Express",
        cssFile: "css/fondo.css"
      },
      {
        id: "fondo2",
        name: "Diseño Oferta",
        cssFile: "css/fondo2.css"
      }
    ],
    units: [
      { value: "kg", label: "Kilogramo" },
      { value: "g", label: "Gramo" },
      { value: "l", label: "Litro" },
      { value: "ml", label: "Mililitro" },
      { value: "ud", label: "Unidad" },
      { value: "paq", label: "Paquete" },
      { value: "", label: "No indicar" }
    ]
  },
  validation: {
    requireProduct: true,
    requireCurrentPrice: true,
    requireCode: false,
    minPrice: 0,
    maxPrice: 999999.99,
    maxProductLength: 25,
    maxCodeLength: 15
  }
};

// ============================================================================
// INSTRUCCIONES DE USO
// ============================================================================
/*
Para usar una de estas configuraciones:

1. Copia la configuración que necesites
2. Reemplaza el contenido de js/config.js con la configuración elegida
3. Ajusta los valores según tus necesidades específicas

Ejemplo:
- Si tienes un supermercado en Estados Unidos, usa CONFIG_SUPERMERCADO_USA
- Si tienes una tienda de ropa en España, usa CONFIG_TIENDA_ROPA_ESPAÑA
- Y así sucesivamente...

Recuerda también:
- Actualizar la base de datos de productos (js/productos.json)
- Personalizar los fondos CSS según tu marca
- Ajustar las validaciones según tus requerimientos
*/ 