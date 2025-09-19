# 🏷️ Generador de Rótulos - React

Una aplicación web personalizable para generar rótulos de precios para tiendas, supermercados y negocios, completamente configurable. **Desarrollada con React y Vite**

> **Nota:** Esta versión utiliza imágenes reales (archivos PNG/JPG) para los fondos, a diferencia de la versión JS Vanilla que usaba cadenas de texto base64 por restricciones de CORS del navegador.

![Generador de Rótulos](https://img.shields.io/badge/Version-3.0.0-blue)
![React](https://img.shields.io/badge/React-19+-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![CSS3](https://img.shields.io/badge/CSS3-Latest-green)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Características

- 🎨 **Diseños Personalizables**: Múltiples plantillas de fondo configurables
- 🏗️ **Fondos de 4 Paneles**: Soporte para rótulos con 4 secciones independientes
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
git clone https://github.com/shmueldmontoya/creadordeprecios.git
cd creadordeprecios

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Build para Producción

```bash
# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## 📁 Estructura del Proyecto

(Ver estructura de carpetas en el explorador del proyecto o en la documentación de herramientas para más detalles)

## ⚙️ Configuración

La configuración principal se encuentra en `src/context/AppConfigContext.jsx`. Allí puedes personalizar los datos de la tienda, los fondos disponibles, las unidades, textos y validaciones.

Para agregar un fondo personalizado:
1. Coloca la imagen en la carpeta `public/` (ejemplo: `fondo4.png`).
2. Usa la herramienta `public/herramientas/generador-fondos.html` para generar el archivo CSS, ajustando posiciones y estilos.
3. Descarga el CSS generado y colócalo en `public/`.
4. Agrega el fondo a la lista en `AppConfigContext.jsx` con un ID único, nombre y el nombre del archivo CSS.

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

## 🏗️ Fondos de 4 Paneles

La aplicación incluye soporte especial para fondos de 4 paneles, ideales para rótulos con múltiples productos o secciones.

### Cómo Funciona

- **Detección Automática**: Al seleccionar un fondo configurado como "4 paneles", la interfaz cambia automáticamente.
- **Acordeón Interactivo**: Se muestra un acordeón con 4 paneles plegables, cada uno con su propio formulario.
- **Previsualización Unificada**: Todos los datos se combinan en una sola imagen de rótulo.
- **Validación Independiente**: Cada panel se valida por separado, pero todos deben tener al menos un producto válido.

### Configuración

Para agregar fondos de 4 paneles:
1. Crea la imagen de fondo con 4 secciones distintas
2. Configura el CSS para posicionar cada set de datos en su panel correspondiente
3. Agrega el fondo en `AppConfigContext.jsx` con `es4Paneles: true`

### Ejemplo de Uso

1. Selecciona "4 Paneles Martes" del selector de fondos
2. Se expande automáticamente el acordeón con 4 paneles
3. Llena los datos de cada panel (Panel 1, Panel 2, Panel 3, Panel 4)
4. La previsualización muestra todos los datos en la imagen de 4 paneles
5. Descarga la imagen completa con todos los productos

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

Los fondos se gestionan con archivos CSS y una imagen en la carpeta `public/`. Usa la herramienta de generación de fondos para crear nuevos diseños fácilmente, sin necesidad de convertir imágenes a base64 como se hacía con la versión de JavaScript Vanilla debido restricciones de CORS del navegador.

Consulta la documentación en `public/herramientas/README-herramientas.md` para el flujo actualizado y recomendaciones de uso.


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
- `generador-fondos.html`: Herramienta para generar archivos CSS de fondos personalizados.
- `README-herramientas.md`: Documentación y guías de uso para las herramientas.

### ¿Cómo acceder?

Puedes abrir las herramientas desde la carpeta `/herramientas/` en tu sitio o explorador.

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

### v3.1.0 - Fondos de 4 Paneles
- 🏗️ **Soporte para fondos de 4 paneles**: Nueva funcionalidad para rótulos con múltiples secciones
- 🎛️ **Acordeón interactivo**: Interfaz plegable para introducir datos de 4 paneles
- 🔄 **Transición automática**: Cambio dinámico entre modos de 1 y 4 paneles
- ♿ **Accesibilidad mejorada**: Atributos ARIA completos en el acordeón
- 📝 **Validación múltiple**: Sistema de validación independiente por panel

### v3.0.0 - React + Vite
- ⚛️ **Migración completa** a React 19+ con Vite
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