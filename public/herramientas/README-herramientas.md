# 🛠️ Herramientas Incluidas

Este directorio contiene herramientas adicionales para facilitar la personalización del Generador de Rótulos.

## 📁 Contenido

### `generador-fondos.html`
**Herramienta principal para crear archivos CSS de fondos personalizados**

#### ¿Qué hace ahora?
- Permite ajustar visualmente las posiciones de los textos
- Genera automáticamente el código CSS necesario para el fondo
- Facilita la creación de nuevos diseños

#### ¿Cómo se usa ahora?
1. **Coloca tu imagen de fondo** (PNG/JPG) manualmente en la carpeta `public/` del proyecto. El nombre del archivo debe ser representativo, por ejemplo: `fondo4.png`.
2. **Abre** `herramientas/generador-fondos.html` en tu navegador
3. **Escribe el nombre del archivo de imagen** (ejemplo: `fondo4.png`)
4. **Escribe el ID del fondo** (ejemplo: `navidad2024`). Este identificador será el nombre del archivo CSS y la referencia en la app.
5. **Configura**:
   - Nombre del fondo (ej: "Diseño Supermercado")
   - Color del texto
   - Fuente
6. **Ajusta posiciones**:
   - Arrastra los textos en la previsualización
   - Los cambios se reflejan en tiempo real
7. **Genera CSS**:
   - Haz clic en "Generar CSS"
   - Revisa el código generado
8. **Descarga**:
   - Haz clic en "Descargar CSS"
   - El archivo se guardará como `[id-del-fondo].css`
9. **Instala**:
   - Coloca el archivo CSS en la carpeta `public/`
   - Agrega el fondo a la configuración en `AppConfigContext.jsx` si es necesario

#### Recomendaciones de imagen
- **Tamaño recomendado:** 768px de ancho x 993px de alto (o mayor, pero conservando la relación de aspecto)
- **Formato:** PNG o JPG
- **Nombre:** Usa nombres descriptivos y sin espacios

#### Ejemplo de configuración:
```javascript
// En AppConfigContext.jsx
backgrounds: [
  {
    id: "mi-supermercado",
    name: "Diseño Supermercado",
    cssFile: "fondo4.css"
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
- Verifica que el nombre del archivo en el CSS coincida exactamente con el archivo en la carpeta public

### Los textos no se posicionan correctamente
- Usa la previsualización para ajustar las posiciones
- Las coordenadas se calculan automáticamente
- Si no funciona, edita manualmente el CSS generado

### El CSS generado no funciona
- Verifica que el archivo esté en la carpeta `css/`
- Asegúrate de que el ID en la configuración coincida
- Revisa la consola del navegador para errores

## 📝 Notas Técnicas

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

#### Preguntas frecuentes

**¿Por qué debo poner un ID único para cada fondo?**
El ID permite que la aplicación distinga entre diferentes diseños de fondo y los muestre correctamente. Si dos fondos tienen el mismo ID, pueden sobrescribirse o causar errores. 