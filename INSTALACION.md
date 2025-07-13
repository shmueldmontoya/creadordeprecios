# 🚀 Instalación Rápida

## ⚡ Configuración en 5 minutos

### Paso 1: Descargar el Proyecto

```bash
# Opción A: Clonar el repositorio
git clone https://github.com/tu-usuario/generador-rotulos.git

# Opción B: Descargar ZIP
# Ve a GitHub y descarga el archivo ZIP
```

### Paso 2: Configurar tu Tienda

Edita `js/config.js` y cambia estos valores:

```javascript
store: {
  name: "Mi Tienda",           // ← Tu nombre de tienda
  slogan: "Mi Slogan",         // ← Tu slogan
  currency: "$",               // ← Tu moneda ($, €, ₡, etc.)
  currencyCode: "USD"          // ← Código de tu moneda
}
```

### Paso 3: Agregar tus Productos

Reemplaza `js/productos.json` con tus productos:

```json
[
  {
    "codigos": ["001"],
    "nombre": "Tu Producto 1"
  },
  {
    "codigos": ["002"],
    "nombre": "Tu Producto 2"
  }
]
```

### Paso 4: Ejecutar

```bash
# ⚠️ IMPORTANTE: NO abrir index.html directamente
# Usa un servidor local:
python -m http.server 8000

# Luego visita: http://localhost:8000
```

¡Listo! 🎉

## 🔧 Configuraciones Predefinidas

Si quieres usar una configuración predefinida, copia una de estas en `js/config.js`:

### Para Supermercado (Estados Unidos)
```javascript
store: {
  name: "Fresh Market",
  slogan: "Fresh & Quality",
  currency: "$",
  currencyCode: "USD"
}
```

### Para Tienda de Ropa (España)
```javascript
store: {
  name: "Moda Elegante",
  slogan: "Estilo y Calidad",
  currency: "€",
  currencyCode: "EUR"
}
```

### Para Farmacia (México)
```javascript
store: {
  name: "Farmacia San José",
  slogan: "Salud y Bienestar",
  currency: "$",
  currencyCode: "MXN"
}
```

## 📱 Prueba Rápida

1. **Inicia el servidor**: `python -m http.server 8000`
2. **Abre**: `http://localhost:8000` en tu navegador
3. **Llena** el formulario con datos de prueba:
   - Producto: "Manzana Roja"
   - Precio actual: 2.50
   - Precio anterior: 3.00
4. **Haz clic** en "Descargar imagen"
5. **¡Verifica** que se descargue correctamente!

## 🎨 Personalización Visual

### Cambiar Colores

Edita `css/main.css`:

```css
:root {
  --color-primario: #146044;  /* ← Tu color principal */
  --color-fondo: #fafafa;     /* ← Color de fondo */
}
```

### Agregar tu Logo

1. **Coloca** tu logo en la carpeta `recursos/`
2. **Convierte** tu imagen a CSS Base64 usando el generador de fondos
3. **Edita** los archivos CSS de fondo para incluir tu logo
4. **Ajusta** las posiciones de los textos según tu diseño

## 🔍 Solución de Problemas

### ⚠️ La aplicación no carga datos
- **Problema**: "Error al cargar la base de datos de productos"
- **Causa**: Abrir `index.html` directamente sin servidor
- **Solución**: Usa un servidor local (ver opciones arriba)

### No se descargan las imágenes
- Verifica que estés usando un servidor local (no solo abrir el archivo HTML)
- Revisa la consola del navegador (F12) para errores
- **Problema común**: Errores de CORS al abrir HTML directamente

### No aparece el autocompletado
- Verifica que `js/productos.json` tenga la estructura correcta
- Asegúrate de que `enableAutocomplete: true` en la configuración
- **Problema común**: Intentar abrir `index.html` directamente

### Los fondos no se cargan
- Verifica que los archivos CSS existan en `css/`
- Revisa que los IDs en la configuración coincidan con las clases CSS
- **IMPORTANTE**: Los fondos deben ser CSS con imágenes en Base64, no PNG/JPG

## 📞 Necesitas Ayuda?

1. Revisa la [Guía de Personalización](PERSONALIZACION.md)
2. Verifica la consola del navegador (F12)
3. Asegúrate de que todos los archivos estén en las rutas correctas

---

**¡Tu generador de rótulos estará listo en minutos!** ⏱️✨ 