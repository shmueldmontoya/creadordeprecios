# 🏷️ Generador de Rótulos - React

Una aplicación web moderna y personalizable para generar rótulos de precios para tiendas, supermercados y negocios, completamente configurable. **Desarrollada con React y Vite** para mejor rendimiento y mantenibilidad.

![Generador de Rótulos](https://img.shields.io/badge/Version-3.0.0-blue)
![React](https://img.shields.io/badge/React-19+-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![CSS3](https://img.shields.io/badge/CSS3-Latest-green)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Características

- ⚛️ **React 19+**: Arquitectura moderna y mantenible
- 🚀 **Vite**: Desarrollo ultrarrápido y build optimizado
- 🎨 **Diseños Personalizables**: Múltiples plantillas de fondo configurables
- 📱 **Responsive Design**: Funciona perfectamente en desktop, tablet y móvil
- 🌙 **Modo Oscuro**: Interfaz adaptable con tema claro/oscuro
- ⚡ **Previsualización en Tiempo Real**: Ve los cambios instantáneamente
- 📦 **Cola de Rótulos**: Procesa múltiples productos de una vez
- 💾 **Descarga en Lote**: Exporta todos los rótulos en un archivo ZIP
- 🔍 **Autocompletado**: Base de datos de productos integrada
- ⌨️ **Atajos de Teclado**: Navegación rápida y eficiente
- ✅ **Validaciones Configurables**: Sistema robusto de validación
- 💰 **Múltiples Monedas**: Soporte para diferentes divisas
- 📏 **Unidades Flexibles**: Kilogramos, unidades, etc.
- 💾 **Persistencia Local**: La cola se guarda automáticamente
- 🎯 **Formato de Números**: Separadores de miles configurables

## 🚀 Instalación

### Prerrequisitos

- **Node.js 16+** y **npm** o **yarn**

### Instalación Rápida

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd creadordepreciosreact

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Visita `http://localhost:5173` en tu navegador.

### Build para Producción

```bash
# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## 📁 Estructura del Proyecto

```
creadordepreciosreact/
├── src/
│   ├── components/            # Componentes React
│   │   ├── Header.jsx         # Header con nombre de tienda
│   │   ├── ProductForm.jsx    # Formulario de productos
│   │   ├── LabelPreview.jsx   # Vista previa del rótulo
│   │   ├── LabelQueue.jsx     # Cola de rótulos
│   │   ├── EditLabelModal.jsx # Modal de edición
│   │   └── Notification.jsx   # Sistema de notificaciones
│   ├── context/
│   │   └── AppConfigContext.jsx # Configuración centralizada
│   ├── hooks/
│   │   └── useProductos.js    # Hook para productos
│   ├── assets/
│   │   ├── main.css           # Estilos principales
│   │   └── validation.css     # Estilos de validación
│   ├── App.jsx                # Componente principal
│   └── main.jsx               # Punto de entrada
├── public/
│   ├── productos.json         # Base de datos de productos (estático)
│   ├── fondo.css              # Diseño de fondo 1 (estático)
│   ├── fondo2.css             # Diseño de fondo 2 (estático)
│   ├── fondo3.css             # Diseño de fondo 3 (estático)
│   └── fonts/                 # Fuentes personalizadas
├── index.html                 # HTML principal
├── package.json               # Dependencias
├── vite.config.js             # Configuración de Vite
└── README.md                  # Documentación
```

## ⚙️ Configuración

### Archivo de Configuración Principal

Edita `src/context/AppConfigContext.jsx`:

```javascript
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
      width: 768,                // Ancho del rótulo
      height: 993,               // Alto del rótulo
      previewScale: 0.4          // Escala de la vista previa
    },

    // Fondo por defecto
    defaultBackground: "fondo",

    // Fondos disponibles para los rótulos
    backgrounds: [
      { 
        id: "fondo",             // ID único del fondo
        name: "Fondo #1",        // Nombre que se muestra en la interfaz
        cssFile: "css/fondo.css" // Archivo CSS
      }
    ],

    // Unidades de medida disponibles
    units: [
      { value: "kg", label: "Kilogramo" },
      { value: "ud", label: "Unidad" },
      { value: "", label: "No indicar" }
    ],

    // Textos personalizables
    textoAhorro: "Ahorro:",              // Texto que aparece antes del monto ahorrado
    textoPrecioAnterior: "Precio regular:" // Texto que aparece antes del precio anterior
  },

  // ============================================================================
  // CONFIGURACIÓN DE PRODUCTOS
  // ============================================================================
  products: {
    defaultUnit: "kg"              // Unidad por defecto para productos nuevos
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
    useThousandSeparator: true  // ¿Usar separadores de miles? (true = 12,345.67, false = 12345.67)
  }
};
```

### Base de Datos de Productos

Edita `public/productos.json`:

```json
[
  {
    "codigos": ["001"],
    "nombre": "Manzana Roja"
  },
  {
    "codigos": ["002"],
    "nombre": "Plátano"
  }
]
```

## 🎯 Uso Básico

1. **Ingresa los datos del producto**:
   - Nombre del producto (se autocompleta al escribir código)
   - Precio actual
   - Precio anterior (opcional)
   - Código de barras (opcional)
   - Promoción x cantidad (opcional)

2. **Selecciona el diseño**:
   - Elige entre los fondos disponibles
   - Selecciona la unidad de medida

3. **Previsualiza y descarga**:
   - Ve el resultado en tiempo real
   - Descarga la imagen individual
   - O agrega a la cola para procesar en lote

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + Enter` | Agregar a la cola |
| `Ctrl + Shift + Enter` | Descargar lote |
| `F1` | Mostrar ayuda |
| `Escape` | Limpiar formulario |
| `Tab` | Navegar entre campos |

## 🎨 Personalización

### Fondos Personalizados

Los fondos son archivos CSS (por ejemplo, `public/fondo.css`) con imágenes convertidas a Base64. Para crear nuevos fondos:

1. **Convierte tu imagen** a Base64
2. **Crea un archivo CSS** en la carpeta `public/` con las posiciones de los textos
3. **Agrega el fondo** a la configuración

Ejemplo de archivo CSS en `public/`:
```css
.rotulo.mi-diseno {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...');
  background-size: cover;
  background-position: center;
}

.mi-diseno .producto {
  position: absolute;
  top: 150px;
  left: 40px;
  right: 40px;
  font-size: 24px;
  font-weight: bold;
}

.mi-diseno .precio-actual {
  position: absolute;
  top: 620px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 110px;
}
```

### Formato de Números

```javascript
format: {
  useThousandSeparator: true  // true = 12,345, false = 12345
}
```

### Validaciones

```javascript
validation: {
  requireProduct: true,        // Requerir nombre del producto
  requireCurrentPrice: true,   // Requerir precio actual
  requireCode: false,          // Requerir código
  minPrice: 0,                 // Precio mínimo
  maxPrice: 999999,            // Precio máximo
  maxProductLength: 50         // Longitud máxima del nombre
}
```

### Formato de Exportación

```javascript
export: {
  imageFormat: "png",          // png, jpg, webp
  individualPrefix: "rotulo_"  // Prefijo para archivos
}
```

## 🔧 Funcionalidades Técnicas

### React Features
- **Hooks**: useState, useEffect, useRef, useContext
- **Context API**: Configuración global
- **Componentes Modulares**: Reutilizables y mantenibles
- **Event Handling**: Formularios controlados

### Características Avanzadas
- **LocalStorage**: Persistencia automática de la cola
- **html2canvas**: Generación de imágenes
- **JSZip**: Descarga en lote
- **Font Awesome**: Iconos
- **CSS Variables**: Temas claro/oscuro

### Validaciones Inteligentes
- **Validación en tiempo real**
- **Mensajes de error personalizables**
- **Reglas configurables**
- **Validación de rangos de precios**

## 🌐 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📱 Responsive Design

La aplicación se adapta automáticamente a:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Móvil**: < 768px

## 🛠️ Herramientas adicionales

En la carpeta `public/herramientas/` encontrarás utilidades web y documentación extra para facilitar la personalización y el uso de la aplicación. Estas herramientas son accesibles directamente desde el navegador una vez desplegado el proyecto.

### ¿Qué contiene?
- `convertidor-imagenes.html`: Conversor para transformar imágenes a Base64, útil para crear nuevos fondos personalizados.
- `generador-fondos.html`: Herramienta para generar archivos CSS de fondos personalizados.
- `README-imagenes.md` y `README-herramientas.md`: Documentación y guías de uso para las herramientas.

### ¿Cómo acceder?

Una vez desplegado, puedes abrir las herramientas desde:
```
https://<tu-dominio>/herramientas/convertidor-imagenes.html
https://<tu-dominio>/herramientas/generador-fondos.html
```
O navegando a la carpeta `/herramientas/` en tu sitio o explorador de archivos 

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Previsualizar build
npm run lint         # Linting del código
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Biblioteca de UI
- [Vite](https://vitejs.dev/) - Build tool
- [html2canvas](https://html2canvas.hertzen.com/) - Generación de imágenes
- [JSZip](https://stuk.github.io/jszip/) - Archivos ZIP
- [Font Awesome](https://fontawesome.com/) - Iconos

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la configuración en `AppConfigContext.jsx`
2. Verifica la consola del navegador para errores
3. Asegúrate de que todas las dependencias estén instaladas

## 🔄 Changelog

### v3.0.0 - React + Vite
- ⚛️ **Migración completa** a React 18+ con Vite
- 🎯 **Componentes modulares** y reutilizables
- 🚀 **Build optimizado** con Vite

### v2.1.0
- 🔧 Corrección de bugs y mejoras significativas del código

### v2.0.0
- ✨ Sistema de configuración centralizado
- 🎨 Múltiples fondos personalizables
- ✅ Sistema de validación robusto
- 📱 Mejor responsive design
- 🔧 Código modular y mantenible

### v1.0.0
- 🎉 Lanzamiento inicial
- 📦 Funcionalidades básicas
- 🎨 Un diseño de fondo