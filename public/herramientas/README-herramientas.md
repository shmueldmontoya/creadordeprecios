# 🛠️ Herramientas Incluidas

Este directorio contiene herramientas adicionales para facilitar la personalización del Generador de Rótulos.

## 📁 Contenido

### `generador-fondos.html`
**Herramienta principal para crear fondos personalizados**

#### ¿Qué hace?
- Convierte imágenes PNG/JPG a formato CSS Base64
- Permite ajustar visualmente las posiciones de los textos
- Genera automáticamente el código CSS necesario
- Facilita la creación de nuevos diseños

#### ¿Por qué es necesario?
La aplicación no puede usar imágenes PNG/JPG directamente como fondos debido a:
- Restricciones de seguridad del navegador
- Necesidad de ser portable (sin dependencias externas)
- Optimización para funcionar offline

#### Cómo usar:

1. **Abre** `herramientas/generador-fondos.html` en tu navegador
2. **Sube** tu imagen de fondo (PNG, JPG, etc.)
3. **Configura**:
   - ID del fondo (ej: "mi-supermercado")
   - Nombre del fondo (ej: "Diseño Supermercado")
   - Color del texto
   - Fuente
4. **Ajusta posiciones**:
   - Arrastra los textos en la previsualización
   - Los cambios se reflejan en tiempo real
5. **Genera CSS**:
   - Haz clic en "Generar CSS"
   - Revisa el código generado
6. **Descarga**:
   - Haz clic en "Descargar CSS"
   - El archivo se guardará como `[id-del-fondo].css`
7. **Instala**:
   - Coloca el archivo en la carpeta `css/`
   - Agrega el fondo a la configuración en `js/config.js`

#### Ejemplo de configuración:

```javascript
// En js/config.js
backgrounds: [
  {
    id: "mi-supermercado",
    name: "Diseño Supermercado",
    cssFile: "css/mi-supermercado.css"
  }
]
```

## 🎯 Consejos para Diseños

### Dimensiones Recomendadas
- **Ancho**: 768px
- **Alto**: 993px
- **Resolución**: 72 DPI para web

### Posicionamiento de Textos
- **Nombre del producto**: Generalmente en la parte superior
- **Precio actual**: En el centro, más grande
- **Precio anterior**: Debajo del precio actual
- **Texto de ahorro**: En la parte inferior

### Colores y Contraste
- Usa colores que contrasten bien con tu imagen de fondo
- Considera usar sombras o fondos semi-transparentes para los textos
- Prueba diferentes combinaciones de colores

### Fuentes
- **Mosk**: Fuente principal del proyecto (recomendada)
- **Araboto**: Fuente alternativa incluida
- **Arial**: Fuente del sistema (compatible)

## 🔧 Solución de Problemas

### La imagen no se carga
- Verifica que el formato sea PNG, JPG, JPEG, GIF
- Asegúrate de que el archivo no esté corrupto
- Intenta con una imagen más pequeña

### Los textos no se posicionan correctamente
- Usa la previsualización para ajustar las posiciones
- Las coordenadas se calculan automáticamente
- Si no funciona, edita manualmente el CSS generado

### El CSS generado no funciona
- Verifica que el archivo esté en la carpeta `css/`
- Asegúrate de que el ID en la configuración coincida
- Revisa la consola del navegador para errores

## 📝 Notas Técnicas

### Formato Base64
- Las imágenes se convierten automáticamente a Base64
- Esto aumenta el tamaño del archivo CSS
- Recomendado: Optimiza las imágenes antes de subirlas

### Posicionamiento Absoluto
- Los textos usan posicionamiento absoluto
- Las coordenadas son específicas para cada diseño
- Si cambias la imagen, necesitas reajustar las posiciones

### Compatibilidad
- Funciona en todos los navegadores modernos
- Requiere JavaScript habilitado
- No requiere conexión a internet después de la generación

---

**¡Con estas herramientas podrás crear diseños profesionales para tu tienda!** 🎨✨ 