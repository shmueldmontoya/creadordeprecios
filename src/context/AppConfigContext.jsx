import React, { createContext, useContext } from "react";

/**
 * CONFIGURACIÓN PRINCIPAL DE LA APLICACIÓN
 * ========================================
 * 
 * Este archivo contiene toda la configuración de la aplicación.
 * Modifica los valores según tus necesidades.
 * 
 * IMPORTANTE: Después de modificar este archivo, guarda y recarga la aplicación.
 */

const APP_CONFIG = {
  // ============================================================================
  // CONFIGURACIÓN DE LA TIENDA
  // ============================================================================
  store: {
    name: "Mi tienda",           // Nombre de tu tienda (se muestra en el header)
    currency: "₡"                // Símbolo de moneda (₡, $, €, etc.)
  },

  // ============================================================================
  // CONFIGURACIÓN DE RÓTULOS
  // ============================================================================
  labels: {
    // Dimensiones del rótulo en píxeles
    dimensions: {
      width: 768,                // Ancho del rótulo, NO CAMBIAR
      height: 993,               // Alto del rótulo, NO CAMBIAR
      previewScale: 0.4          // Escala de la vista previa, NO CAMBIAR
    },

    // Fondo por defecto (debe coincidir con uno de los IDs en backgrounds)
    defaultBackground: "fondo",

    // Fondos disponibles para los rótulos
    // IMPORTANTE: Los archivos CSS deben estar en /src/assets/
    backgrounds: [
      { 
        id: "fondo",             // ID único del fondo
        name: "Fondo #1",        // Nombre que se muestra en la interfaz
        cssFile: "css/fondo.css" // Archivo CSS (ruta relativa a /src/assets/)
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

    // Unidades de medida disponibles
    units: [
      // { value: "l", label: "Litro" }, <--Utiliza este formato para añadir más unidades de medida
      { value: "kg", label: "Kilogramo" },
      { value: "ud", label: "Unidad" },
      { value: "", label: "No indicar" }  // Opción para no mostrar unidad, NO CAMBIAR
    ],

    // Textos personalizables
    textoAhorro: "Ahorro:",              // Texto que aparece antes del monto ahorrado
    textoPrecioAnterior: "Precio regular:" // Texto que aparece antes del precio anterior
  },

  // ============================================================================
  // CONFIGURACIÓN DE PRODUCTOS
  // ============================================================================
  products: {
    defaultUnit: ""              // Unidad por defecto para productos nuevos
  },

  // ============================================================================
  // CONFIGURACIÓN DE EXPORTACIÓN
  // ============================================================================
  export: {
    imageFormat: "png",          // Formato de imagen (png, jpg, webp)
    individualPrefix: "rotulo_"  // Prefijo para archivos individuales
  },

  // ============================================================================
  // CONFIGURACIÓN DE VALIDACIÓN
  // ============================================================================
  validation: {
    requireProduct: true,        // ¿Es obligatorio el nombre del producto?
    requireCurrentPrice: true,   // ¿Es obligatorio el precio actual?
    requireCode: false,          // ¿Es obligatorio el código del producto?
    minPrice: 0,                 // Precio mínimo permitido
    maxPrice: 999999,            // Precio máximo permitido
    maxProductLength: 50         // Longitud máxima del nombre del producto
  },

  // ============================================================================
  // CONFIGURACIÓN DE FORMATO DE NÚMEROS
  // ============================================================================
  format: {
    useThousandSeparator: false  // ¿Usar separadores de miles? (true = 12,345 - false = 12345)
  }
};

// ============================================================================
// NO MODIFICAR DESDE AQUÍ HACIA ABAJO
// ============================================================================

const AppConfigContext = createContext(APP_CONFIG);

export const useAppConfig = () => useContext(AppConfigContext);

export const AppConfigProvider = ({ children }) => (
  <AppConfigContext.Provider value={APP_CONFIG}>
    {children}
  </AppConfigContext.Provider>
); 