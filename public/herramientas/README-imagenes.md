# 🖼️ Sistema de Imágenes de Productos

## 📋 Descripción

El sistema de imágenes de productos permite mostrar automáticamente una imagen cuando se ingresa un código específico en el generador de rótulos.

## 🚀 Cómo Funciona

1. **Ingreso de código**: El usuario ingresa un código (ej: "97", "230")
2. **Búsqueda de imagen**: El sistema busca un archivo con ese nombre en `recursos/imagenes/`
3. **Carga automática**: Si existe, carga la imagen y la muestra en la posición definida
4. **Inclusión en descarga**: La imagen se incluye automáticamente en el rótulo descargado

## 📁 Estructura de Archivos

```
recursos/
└── imagenes/
    ├── 97          # Archivo de texto con Base64 para código "97"
    ├── 230         # Archivo de texto con Base64 para código "230"
    ├── 001         # Archivo de texto con Base64 para código "001"
    └── ...
```

**Importante**: 
- Los archivos NO tienen extensión
- El nombre del archivo es exactamente el código del producto
- El contenido del archivo es texto plano con Base64 (data:image/...)

## 🛠️ Preparación de Imágenes

### Paso 1: Usar el Convertidor

1. Abre `herramientas/convertidor-imagenes.html` en tu navegador
2. Selecciona una imagen (PNG, JPG, GIF, etc.)
3. Ingresa el código del producto
4. Haz clic en "Convertir y Descargar"
5. Se descargará un archivo `.txt` con el contenido Base64

### Paso 2: Guardar la Imagen

1. Renombra el archivo descargado quitando la extensión `.txt`
2. Guárdalo en la carpeta `recursos/imagenes/`
3. El nombre debe ser exactamente el código del producto

**Ejemplo**:
- Archivo descargado: `97.txt`
- Renombrar a: `97`
- Ubicación final: `recursos/imagenes/97`

**Contenido del archivo**: El archivo debe contener el Base64 completo, por ejemplo:
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

## 🎨 Configuración de Posiciones

### Posiciones por Fondo

Las posiciones se definen en los archivos CSS de fondo:

```css
/* css/fondo.css */
.imagen-producto {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1;
  /* Posición por defecto para este fondo */
  top: 200px;
  left: 50px;
  width: 100px;
  height: 100px;
}
```

### Posiciones Específicas por Código

Puedes definir posiciones diferentes para códigos específicos:

```css
/* Posición específica para código "97" */
.imagen-producto[data-codigo="97"] {
  top: 180px;
  left: 40px;
  width: 120px;
  height: 120px;
}

/* Posición específica para código "230" */
.imagen-producto[data-codigo="230"] {
  top: 220px;
  right: 60px;
  width: 80px;
  height: 80px;
}
```

## 📏 Propiedades CSS Disponibles

- `top`, `bottom`: Posición vertical
- `left`, `right`: Posición horizontal
- `width`, `height`: Tamaño de la imagen
- `transform`: Rotación, escala, etc.
- `z-index`: Orden de capas

## 💡 Consejos de Diseño

### Tamaño de Imágenes
- **Recomendado**: 100x100px a 200x200px
- **Máximo**: 1MB por archivo
- **Formato**: PNG con fondo transparente para mejor resultado

### Posicionamiento
- Usa `background-size: contain` para mantener proporciones
- Considera el espacio disponible en cada fondo
- Prueba diferentes posiciones para encontrar la mejor ubicación

### Rendimiento
- Mantén las imágenes pequeñas para mejor rendimiento
- Usa formatos optimizados (PNG para transparencia, JPG para fotos)
- Evita imágenes muy grandes que puedan ralentizar la carga

## 🔧 Solución de Problemas

### La imagen no aparece
1. Verifica que el archivo existe en `recursos/imagenes/`
2. Confirma que el nombre del archivo coincide exactamente con el código
3. Revisa la consola del navegador para errores
4. Asegúrate de que el archivo no esté corrupto

### La imagen aparece en posición incorrecta
1. Verifica las reglas CSS del fondo actual
2. Ajusta las posiciones en el archivo CSS correspondiente
3. Considera usar posiciones específicas por código

### Error de carga
1. Verifica que el servidor web esté funcionando
2. Confirma que la carpeta `recursos/imagenes/` sea accesible
3. Revisa los permisos de archivo

## 📝 Ejemplos de Uso

### Ejemplo 1: Imagen Simple
```
Código: "97"
Archivo: recursos/imagenes/97
Posición: Por defecto del fondo
```

### Ejemplo 2: Imagen con Posición Específica
```css
/* En css/fondo.css */
.imagen-producto[data-codigo="230"] {
  top: 150px;
  right: 30px;
  width: 80px;
  height: 80px;
}
```

### Ejemplo 3: Múltiples Fondos
```css
/* fondo.css - Posición izquierda */
.imagen-producto[data-codigo="97"] {
  left: 40px;
  top: 200px;
}

/* fondo2.css - Posición derecha */
.imagen-producto[data-codigo="97"] {
  right: 40px;
  top: 200px;
}
```

## 🔄 Flujo Completo

1. **Preparación**: Usar convertidor → guardar archivo
2. **Configuración**: Definir posiciones en CSS
3. **Uso**: Ingresar código → imagen aparece automáticamente
4. **Descarga**: Imagen incluida en el rótulo final

## 📞 Soporte

Si tienes problemas con el sistema de imágenes:

1. Verifica que sigues todos los pasos correctamente
2. Revisa la consola del navegador para errores
3. Confirma que el servidor web esté funcionando
4. Verifica que los archivos tengan los permisos correctos 