# 🏷️ Generador de Rótulos - Plantilla

Una aplicación web moderna y personalizable para generar rótulos de precios para tiendas, supermercados y negocios, completamente configurable.

![Generador de Rótulos](https://img.shields.io/badge/Version-2.0.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![CSS3](https://img.shields.io/badge/CSS3-Latest-green)
![HTML5](https://img.shields.io/badge/HTML5-Latest-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Características

- 🎨 **Diseños Personalizables**: Múltiples plantillas de fondo configurables
- 📱 **Responsive Design**: Funciona perfectamente en desktop, tablet y móvil
- 🌙 **Modo Oscuro**: Interfaz adaptable con tema claro/oscuro
- ⚡ **Previsualización en Tiempo Real**: Ve los cambios instantáneamente
- 📦 **Cola de Rótulos**: Procesa múltiples productos de una vez
- 💾 **Descarga en Lote**: Exporta todos los rótulos en un archivo ZIP
- 🔍 **Autocompletado**: Base de datos de productos integrada
- ⌨️ **Atajos de Teclado**: Navegación rápida y eficiente
- ✅ **Validaciones**: Sistema robusto de validación de datos
- 💰 **Múltiples Monedas**: Soporte para diferentes divisas
- 📏 **Unidades Flexibles**: Kilogramos, unidades, libras, etc.

## 🚀 Instalación

### ⚠️ IMPORTANTE: Servidor Local Requerido

**La aplicación NO funciona abriendo directamente el archivo `index.html`** debido a restricciones de seguridad del navegador que impiden cargar la base de datos de productos.

### Opción 1: Servidor Local (Recomendado)

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve .

# Con PHP
php -S localhost:8000
```

Luego visita `http://localhost:8000`

### Opción 2: Servidor de Desarrollo

Si tienes Node.js instalado:
```bash
npm install -g live-server
live-server
```

### Opción 3: Extensiones de VS Code

- **Live Server**: Instala la extensión y haz clic derecho en `index.html` → "Open with Live Server"
- **Live Preview**: Extensión oficial de Microsoft para previsualización en vivo

## ⚙️ Configuración Rápida

### 1. Información de tu Tienda

Edita `js/config.js`:

```javascript
store: {
  name: "Mi Supermercado",
  slogan: "Calidad Garantizada",
  currency: "$",              // Tu moneda
  currencyCode: "USD"
}
```

### 2. Base de Datos de Productos

Reemplaza `js/productos.json` con tus productos:

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

### 3. Fondos Personalizados

Crea tus propios diseños en `css/` y agrégalos a la configuración.

## 📁 Estructura del Proyecto

```
creadordepreciosfinal-main/
├── index.html              # Página principal
├── js/
│   ├── config.js           # Configuración centralizada
│   ├── utils.js            # Utilidades y funciones comunes
│   ├── validation.js       # Sistema de validación
│   ├── templates.js        # Plantillas HTML dinámicas
│   ├── main.js             # Lógica principal
│   ├── productos.json      # Base de datos de productos
│   └── productos-ejemplo.json # Ejemplo de productos
├── css/
│   ├── main.css            # Estilos principales
│   ├── validation.css      # Estilos de validación
│   ├── fondo.css           # Diseño de fondo 1
│   ├── fondo2.css          # Diseño de fondo 2
│   └── fondo3.css          # Diseño de fondo 3
├── herramientas/
│   ├── generador-fondos.html # Herramienta para crear fondos
│   └── README-herramientas.md # Documentación de herramientas
├── recursos/
│   └── fuentes/            # Fuentes personalizadas
├── README.md               # Este archivo
├── PERSONALIZACION.md      # Guía de personalización
├── INSTALACION.md          # Guía de instalación rápida
└── LICENSE                 # Licencia MIT
```

## 🎯 Uso Básico

1. **Ingresa los datos del producto**:
   - Nombre del producto
   - Precio actual
   - Precio anterior (opcional)
   - Código de barras (opcional)
   - Promoción (opcional)

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

### 🛠️ Herramientas Incluidas

#### Generador de Fondos
- **Ubicación**: `herramientas/generador-fondos.html`
- **Función**: Convierte imágenes PNG/JPG a CSS Base64 y ajusta posiciones de textos
- **Uso**: Abre en tu navegador y sigue las instrucciones

### 🖼️ Fondos Personalizados

**IMPORTANTE**: Los fondos NO son imágenes PNG/JPG, sino **CSS con imágenes convertidas a Base64**.

#### Opción 1: Usar el Generador de Fondos (Recomendado)

1. **Abre** `herramientas/generador-fondos.html` en tu navegador
2. **Sube** tu imagen (PNG, JPG, etc.)
3. **Ajusta** las posiciones de los textos
4. **Descarga** el archivo CSS generado
5. **Coloca** el archivo en la carpeta `css/`
6. **Agrega** el fondo a la configuración

#### Opción 2: Crear Manualmente

Crea un archivo CSS con tu imagen convertida a Base64:

```css
.rotulo.mi-diseno {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...');
  background-size: cover;
  background-position: center;
  color: white;
  font-family: 'Arial', sans-serif;
}

.mi-diseno .producto {
  position: absolute;
  top: 150px;  /* Posición específica */
  left: 40px;
  right: 40px;
  font-size: 24px;
  font-weight: bold;
}

.mi-diseno .precio-actual {
  position: absolute;
  top: 620px;  /* Posición específica */
  left: 0;
  right: 0;
  text-align: center;
  font-size: 110px;
}
```

**Nota**: Las posiciones de los textos están hardcodeadas para cada diseño. Si cambias la imagen, necesitarás ajustar las posiciones.

#### Agregar a la Configuración

```javascript
backgrounds: [
  {
    id: "mi-diseno",
    name: "Mi Diseño",
    cssFile: "css/mi-diseno.css"
  }
]
```

### Monedas y Formatos

```javascript
store: {
  currency: "€",        // Euro
  currencyCode: "EUR"
}
```

### Unidades de Medida

```javascript
units: [
  { value: "kg", label: "Kilogramo" },
  { value: "lb", label: "Libra" },
  { value: "oz", label: "Onza" },
  { value: "", label: "No indicar" }
]
```

## ⚠️ Limitaciones Técnicas

### Requisitos de Servidor
- **La aplicación NO funciona** abriendo directamente `index.html`
- **Requiere un servidor local** debido a restricciones de CORS del navegador
- **Necesario para**: Cargar la base de datos de productos (`productos.json`)

### Formato de Fondos
- **NO soporta** imágenes PNG/JPG directamente como fondos
- **Requiere** conversión a CSS Base64
- **Razón**: Para funcionar sin dependencias externas y ser portable
- **Solución**: Usa el generador de fondos incluido

### Posicionamiento de Textos
- **Las posiciones están hardcodeadas** para cada diseño específico
- **Si cambias la imagen**, necesitas reajustar todas las posiciones
- **Solución**: Usa el generador de fondos para ajustar posiciones visualmente

## 🔧 Configuración Avanzada

### Validaciones

```javascript
validation: {
  requireProduct: true,        // Requerir nombre
  requireCurrentPrice: true,   // Requerir precio actual
  minPrice: 0,                 // Precio mínimo
  maxPrice: 999999,           // Precio máximo
  maxProductLength: 50        // Longitud máxima del nombre
}
```

### Exportación

```javascript
export: {
  imageFormat: "png",          // Formato de imagen
  imageQuality: 0.95,         // Calidad (0-1)
  zipFileName: "rotulos"       // Nombre del archivo ZIP
}
```

## 🌐 Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Opera 47+

## 📱 Responsive Design

La aplicación se adapta automáticamente a:

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Móvil**: < 768px

## 🚀 Funcionalidades Técnicas

- **Vanilla JavaScript**: Sin dependencias pesadas
- **CSS Grid & Flexbox**: Layout moderno y flexible
- **LocalStorage**: Persistencia de datos local
- **Canvas API**: Generación de imágenes
- **File API**: Descarga de archivos
- **ES6+**: Sintaxis moderna de JavaScript

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [html2canvas](https://html2canvas.hertzen.com/) - Generación de imágenes
- [JSZip](https://stuk.github.io/jszip/) - Archivos ZIP
- [Font Awesome](https://fontawesome.com/) - Iconos
- [Google Fonts](https://fonts.google.com/) - Tipografías

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la [Guía de Personalización](PERSONALIZACION.md)
2. Verifica la consola del navegador para errores
3. Asegúrate de que todos los archivos estén en las rutas correctas

## 🔄 Changelog

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

---

**¡Haz que tu tienda se vea profesional con rótulos de calidad!** 🏪✨
