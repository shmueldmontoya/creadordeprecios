# Guía de Personalización

Esta guía te ayudará a personalizar el Generador de Rótulos para tu tienda o negocio.

## 📋 Índice

1. [Configuración Básica](#configuración-básica)
2. [Personalización de Fondos](#personalización-de-fondos)
3. [Base de Datos de Productos](#base-de-datos-de-productos)
4. [Unidades de Medida](#unidades-de-medida)
5. [Moneda y Formato](#moneda-y-formato)
6. [Colores y Tema](#colores-y-tema)
7. [Validaciones](#validaciones)
8. [Funcionalidades Avanzadas](#funcionalidades-avanzadas)

## ⚙️ Configuración Básica

### 1. Información de la Tienda

Edita el archivo `js/config.js` para configurar la información básica de tu tienda:

```javascript
store: {
  name: "Mi Tienda",           // Nombre de tu tienda
  slogan: "Calidad y Precio",  // Slogan o frase promocional
  currency: "₡",              // Símbolo de moneda
  currencyCode: "CRC",        // Código de moneda
  language: "es",             // Idioma
  timezone: "America/Costa_Rica" // Zona horaria
}
```

### 2. Dimensiones de los Rótulos

```javascript
labels: {
  dimensions: {
    width: 768,        // Ancho en píxeles
    height: 993,       // Alto en píxeles
    previewScale: 0.4  // Escala de la vista previa (0.4 = 40%)
  }
}
```

## 🎨 Personalización de Fondos

### 1. Agregar Nuevos Fondos

1. Crea un nuevo archivo CSS en la carpeta `css/` (ej: `css/mi-fondo.css`)
2. Define los estilos para tu rótulo
3. Agrega el fondo a la configuración:

```javascript
backgrounds: [
  {
    id: "mi-fondo",
    name: "Mi Diseño Personalizado",
    cssFile: "css/mi-fondo.css"
  }
]
```

### 2. Estructura de un Archivo de Fondo

```css
/* Ejemplo de fondo personalizado */
.rotulo.mi-fondo {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  font-family: 'Arial', sans-serif;
  /* ... más estilos ... */
}

.mi-fondo .producto {
  font-size: 24px;
  font-weight: bold;
}

.mi-fondo .precio-actual {
  font-size: 32px;
  color: #ffeb3b;
}
```

### 3. Elementos Disponibles para Estilizar

- `.rotulo` - Contenedor principal del rótulo
- `.producto` - Nombre del producto
- `.precio-actual` - Precio actual
- `.antes` - Precio anterior
- `.ahorre` - Texto de ahorro
- `.unidad` - Unidad de medida

## 📦 Base de Datos de Productos

### 1. Estructura del Archivo

El archivo `js/productos.json` debe seguir esta estructura:

```json
[
  {
    "codigos": ["001", "001A"],
    "nombre": "Manzana Roja"
  },
  {
    "codigos": ["002"],
    "nombre": "Plátano"
  }
]
```

### 2. Campos Disponibles

- `codigos`: Array de códigos de barras o identificadores
- `nombre`: Nombre del producto

### 3. Configuración de Autocompletado

```javascript
products: {
  databaseFile: "js/productos.json",
  enableAutocomplete: true,
  searchFields: ["codigos", "nombre"],
  defaultUnit: ""
}
```

## 📏 Unidades de Medida

### 1. Configurar Unidades

```javascript
units: [
  { value: "kg", label: "Kilogramo" },
  { value: "ud", label: "Unidad" },
  { value: "lb", label: "Libra" },
  { value: "g", label: "Gramo" },
  { value: "l", label: "Litro" },
  { value: "ml", label: "Mililitro" },
  { value: "", label: "No indicar" }
]
```

### 2. Agregar Nuevas Unidades

Simplemente agrega nuevas entradas al array:

```javascript
{ value: "oz", label: "Onza" },
{ value: "gal", label: "Galón" }
```

## 💰 Moneda y Formato

### 1. Cambiar Moneda

```javascript
store: {
  currency: "$",        // Símbolo de moneda
  currencyCode: "USD"   // Código de moneda
}
```

### 2. Personalizar Formato de Precios

Edita la función `formatearPrecio` en `js/utils.js`:

```javascript
window.Utils.formatearPrecio = (precio, currency = null) => {
  const config = window.APP_CONFIG;
  const moneda = currency || config.store.currency;
  
  // Formato personalizado para tu región
  const precioFormateado = precio.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${moneda}${precioFormateado}`;
};
```

## 🎨 Colores y Tema

### 1. Colores Principales

Edita las variables CSS en `css/main.css`:

```css
:root {
  --color-primario: #146044;      // Color principal
  --color-fondo: #fafafa;         // Color de fondo
  --color-fondo-card: #ffffff;    // Color de tarjetas
  --color-texto: #333333;         // Color de texto
  --color-error: #f44336;         // Color de error
  --color-exito: #4caf50;         // Color de éxito
}
```

### 2. Modo Oscuro

El modo oscuro se configura automáticamente, pero puedes personalizarlo:

```css
[data-theme="dark"] {
  --color-fondo: #1a1a1a;
  --color-fondo-card: #2d2d2d;
  --color-texto: #ffffff;
  /* ... más colores ... */
}
```

## ✅ Validaciones

### 1. Configurar Validaciones

```javascript
validation: {
  requireProduct: true,        // Requerir nombre de producto
  requireCurrentPrice: true,   // Requerir precio actual
  requireCode: false,          // Requerir código
  minPrice: 0,                 // Precio mínimo
  maxPrice: 999999,           // Precio máximo
  maxProductLength: 50,        // Longitud máxima del nombre
  maxCodeLength: 20           // Longitud máxima del código
}
```

### 2. Mensajes de Error Personalizados

Edita el archivo `js/validation.js` para personalizar los mensajes:

```javascript
window.Validation.validarCampo = (campo, valor, opciones = {}) => {
  // ... código existente ...
  
  case 'producto':
    if (config.requireProduct && (!valor || valor.trim() === '')) {
      return { isValid: false, error: 'Tu mensaje personalizado aquí' };
    }
    break;
};
```

## 🚀 Funcionalidades Avanzadas

### 1. Atajos de Teclado

```javascript
shortcuts: {
  enabled: true,
  addToQueue: "Ctrl + Enter",
  downloadBatch: "Ctrl + Shift + Enter",
  help: "F1",
  clearForm: "Escape"
}
```

### 2. Configuración de Exportación

```javascript
export: {
  imageFormat: "png",           // Formato de imagen
  imageQuality: 0.95,          // Calidad (0-1)
  zipFileName: "rotulos",       // Nombre del archivo ZIP
  individualPrefix: "rotulo_"   // Prefijo para archivos individuales
}
```

### 3. Almacenamiento Local

```javascript
storage: {
  enableLocalStorage: true,     // Habilitar guardado local
  queueKey: "rotulosQueue",     // Clave para la cola
  settingsKey: "appSettings",   // Clave para configuraciones
  maxQueueSize: 100            // Tamaño máximo de la cola
}
```

## 📱 Responsive Design

La aplicación ya incluye diseño responsive, pero puedes personalizar los breakpoints en `css/main.css`:

```css
@media (max-width: 768px) {
  /* Estilos para tablets */
}

@media (max-width: 480px) {
  /* Estilos para móviles */
}
```

## 🔧 Solución de Problemas

### 1. La aplicación no carga datos

- **Problema**: "No se pueden cargar los productos" o "Error al cargar la base de datos"
- **Causa**: Intentar abrir `index.html` directamente sin servidor
- **Solución**: Ejecuta la aplicación en un servidor local (ver sección de instalación)

### 2. Los fondos no se cargan

- Verifica que los archivos CSS existan en la ruta especificada
- Asegúrate de que los IDs en la configuración coincidan con las clases CSS
- **IMPORTANTE**: Los fondos deben ser CSS con imágenes en Base64, no archivos PNG/JPG
- **Solución**: Usa el generador de fondos para convertir tus imágenes

### 3. El autocompletado no funciona

- Verifica que el archivo `productos.json` tenga la estructura correcta
- Asegúrate de que `enableAutocomplete` esté en `true`
- **Problema común**: Intentar abrir `index.html` directamente sin servidor
- **Solución**: Usa un servidor local (Python, Node.js, PHP, etc.)

### 4. Los rótulos no se descargan

- Verifica que las librerías `html2canvas` y `JSZip` se carguen correctamente
- Revisa la consola del navegador para errores
- Asegúrate de estar usando un servidor local
- **Problema común**: Errores de CORS al abrir HTML directamente

### 5. Problemas de compatibilidad

- La aplicación requiere navegadores modernos con soporte para ES6
- Verifica que `localStorage` esté habilitado
- **Recomendado**: Chrome, Firefox, Safari, Edge (versiones recientes)

### 6. Los textos no se posicionan correctamente

- **Causa**: Las posiciones están hardcodeadas para cada diseño específico
- **Solución**: Usa el generador de fondos para ajustar las posiciones
- O edita manualmente las coordenadas en el CSS del fondo
- **Nota**: Si cambias la imagen de fondo, necesitarás reajustar todas las posiciones

## 📞 Soporte

Si tienes problemas o necesitas ayuda adicional:

1. Revisa la consola del navegador para errores
2. Verifica que todos los archivos estén en las rutas correctas
3. Asegúrate de que la configuración sea válida

---

¡Con esta guía deberías poder personalizar completamente el Generador de Rótulos para tu negocio! 