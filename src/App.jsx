import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Accordion from "./components/Accordion";
import ProductForm from "./components/ProductForm";
import LabelPreview from "./components/LabelPreview";
import LabelQueue from "./components/LabelQueue";
import EditLabelModal from "./components/EditLabelModal";
import Notification from "./components/Notification";
import HelpModal from "./components/HelpModal";
import { useAppConfig } from "./context/AppConfigContext";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import useProductos from "./hooks/useProductos";
import Footer from "./components/Footer";
import useImageSize from "./hooks/useImageSize";

function App() {
  const { labels, store, format, products, export: exportConfig, validation } = useAppConfig();
  const [theme, setTheme] = useState("light");
  const [showHelp, setShowHelp] = useState(false);
  const [forms, setForms] = useState([
    {
      codigo: "",
      producto: "",
      promo: "",
      actual: "",
      anterior: "",
      unidad: "",
      fondo: labels.defaultBackground || "fondo"
    },
    {
      codigo: "",
      producto: "",
      promo: "",
      actual: "",
      anterior: "",
      unidad: "",
      fondo: labels.defaultBackground || "fondo"
    },
    {
      codigo: "",
      producto: "",
      promo: "",
      actual: "",
      anterior: "",
      unidad: "",
      fondo: labels.defaultBackground || "fondo"
    },
    {
      codigo: "",
      producto: "",
      promo: "",
      actual: "",
      anterior: "",
      unidad: "",
      fondo: labels.defaultBackground || "fondo"
    }
  ]);
  const [queue, setQueue] = useState([]);
  const [zipName, setZipName] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [notification, setNotification] = useState({ visible: false, type: "success", message: "" });
  const notificationTimeout = useRef(null);
  const notificationCloseTimeout = useRef(null);
  const [errors, setErrors] = useState([{}, {}, {}, {}]);
  const { productos, filtrar } = useProductos();
  const [autocomplete, setAutocomplete] = useState([]);
  const formRefs = useRef([]);
  const [processing, setProcessing] = useState(false);

  // Inicializar la unidad por defecto después de que se cargue la configuración
  useEffect(() => {
    setForms(prev => prev.map(form => ({
      ...form,
      unidad: products?.defaultUnit || ""
    })));
  }, [products]);

  // Detectar si el fondo actual es de 4 paneles
  const is4Paneles = () => {
    const fondoConfig = labels.backgrounds.find(bg => bg.id === forms[0].fondo);
    return fondoConfig?.es4Paneles || false;
  };

  // Combinar datos de los 4 formularios para previsualización
  const getCombinedFormData = () => {
    if (!is4Paneles()) {
      return forms[0];
    }
    // Para 4 paneles, combinar datos de todos los formularios
    return {
      ...forms[0], // Usar el primer formulario como base
      producto: forms.map(f => f.producto).join(' | '),
      actual: forms.map(f => f.actual).join(' | '),
      anterior: forms.map(f => f.anterior).join(' | '),
      promo: forms.map(f => f.promo).join(' | '),
      unidad: forms.map(f => f.unidad).join(' | '), // Combinar unidades de todos los paneles
      codigo: forms.map(f => f.codigo).join(' | ')
    };
  };

  // Manejar cambios en formularios individuales
  const handleFormChange = (index, e) => {
    const { name, value } = e.target;
    if (name === "codigo") {
      // Buscar producto por código
      const prod = productos.find(p => p.codigos && p.codigos.includes(value));
      setForms(prev => prev.map((form, i) =>
        i === index ? {
          ...form,
          codigo: value,
          producto: prod ? prod.nombre : ""
        } : form
      ));
    } else if (name === "producto") {
      setForms(prev => prev.map((form, i) =>
        i === index ? { ...form, producto: value } : form
      ));
    } else {
      setForms(prev => prev.map((form, i) =>
        i === index ? { ...form, [name]: value } : form
      ));
    }
  };

  const handleUnitChange = (index, e) => {
    setForms(prev => prev.map((form, i) =>
      i === index ? { ...form, unidad: e.target.value } : form
    ));
  };

  // Funciones para modo de un solo formulario
  const handleSingleChange = (e) => {
    const { name, value } = e.target;
    if (name === "codigo") {
      const prod = productos.find(p => p.codigos && p.codigos.includes(value));
      setForms(prev => prev.map((form, i) =>
        i === 0 ? {
          ...form,
          codigo: value,
          producto: prod ? prod.nombre : ""
        } : form
      ));
    } else if (name === "producto") {
      setForms(prev => prev.map((form, i) =>
        i === 0 ? { ...form, producto: value } : form
      ));
    } else {
      setForms(prev => prev.map((form, i) =>
        i === 0 ? { ...form, [name]: value } : form
      ));
    }
  };

  const handleSingleUnitChange = (e) => {
    setForms(prev => prev.map((form, i) =>
      i === 0 ? { ...form, unidad: e.target.value } : form
    ));
  };

  const handleBackgroundChange = (e) => {
    const newFondo = e.target.value;
    setForms(prev => prev.map(form => ({ ...form, fondo: newFondo })));
  };

  // Cargar cola desde localStorage al iniciar
  useEffect(() => {
    const savedQueue = localStorage.getItem('rotulosQueue');
    if (savedQueue) {
      try {
        const parsedQueue = JSON.parse(savedQueue);
        setQueue(parsedQueue);
      } catch (e) {
        console.error('Error al cargar cola desde localStorage:', e);
      }
    }
  }, []);

  // Guardar cola en localStorage cuando cambie
  useEffect(() => {
    if (queue.length > 0) {
      localStorage.setItem('rotulosQueue', JSON.stringify(queue));
    } else {
      localStorage.removeItem('rotulosQueue');
    }
  }, [queue]);

  const clearForm = () => {
    setForms(prev => prev.map(form => ({
      ...form,
      codigo: "",
      producto: "",
      promo: "",
      actual: "",
      anterior: "",
      unidad: products?.defaultUnit || ""
    })));
    setErrors([{}, {}, {}, {}]);
    setAutocomplete([]);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    document.documentElement.setAttribute("data-theme", theme === "light" ? "dark" : "light");
  };

  const handleHelp = () => setShowHelp(true);
  const handleCloseHelp = () => setShowHelp(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "codigo") {
      // Buscar producto por código
      const prod = productos.find(p => p.codigos && p.codigos.includes(value));
      setForm((prev) => ({
        ...prev,
        codigo: value,
        producto: prod ? prod.nombre : ""
      }));
    } else if (name === "producto") {
      setForm((prev) => ({ ...prev, producto: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAutocompleteSelect = (p) => {
    setForm((prev) => ({ ...prev, producto: p.nombre, codigo: p.codigos?.[0] || "" }));
    setAutocomplete([]);
  };

  // Funciones originales comentadas - ahora se usan las nuevas versiones arriba
  // const handleUnitChange = (e) => {
  //   setForm((prev) => ({ ...prev, unidad: e.target.value }));
  // };

  // const handleBackgroundChange = (e) => {
  //   setForm((prev) => ({ ...prev, fondo: e.target.value }));
  // };

  // Sistema de notificaciones fiel al original
  const showNotification = (type, message) => {
    // Si hay una notificación visible, ciérrala antes de mostrar la nueva
    setNotification((prev) => {
      if (prev.visible) {
        // Oculta la actual y luego muestra la nueva
        clearTimeout(notificationTimeout.current);
        clearTimeout(notificationCloseTimeout.current);
        setNotification(n => ({ ...n, visible: false }));
        // Espera la animación de salida antes de mostrar la nueva
        notificationCloseTimeout.current = setTimeout(() => {
          setNotification({ visible: true, type, message });
          notificationTimeout.current = setTimeout(() => {
            setNotification(n => ({ ...n, visible: false }));
          }, 3000);
        }, 400);
        return prev;
      } else {
        // Muestra la nueva notificación
        clearTimeout(notificationTimeout.current);
        setNotification({ visible: true, type, message });
        notificationTimeout.current = setTimeout(() => {
          setNotification(n => ({ ...n, visible: false }));
        }, 3000);
        return { visible: true, type, message };
      }
    });
  };

  useEffect(() => {
    return () => {
      clearTimeout(notificationTimeout.current);
      clearTimeout(notificationCloseTimeout.current);
    };
  }, []);

  // Función utilitaria para formatear números según la configuración
  const formatNumber = (number) => {
    if (!number || isNaN(Number(number))) return number;
    const num = Number(number);
    
    if (format && format.useThousandSeparator) {
      let formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: true
      });
      return formatted;
    }
    
    return num.toString();
  };

  const validateForm = () => {
    const errs = [];
    const validationConfig = validation || {};

    if (is4Paneles()) {
      // Modo 4 paneles: validar que al menos un panel tenga los campos requeridos
      const hasValidPanel = forms.some(form => {
        const hasRequiredProduct = !validationConfig.requireProduct || (form.producto && form.producto.trim() !== '');
        const hasRequiredPrice = !validationConfig.requireCurrentPrice || (form.actual && form.actual.trim() !== '');
        const hasRequiredCode = !validationConfig.requireCode || (form.codigo && form.codigo.trim() !== '');

        return hasRequiredProduct && hasRequiredPrice && hasRequiredCode;
      });

      if (!hasValidPanel) {
        errs.push('Al menos un panel debe tener nombre del producto, precio actual y código completos');
        return errs;
      }

      // Validar solo los paneles que tienen datos
      forms.forEach((form, index) => {
        // Solo validar si el panel tiene algún dato
        if (form.producto || form.actual || form.anterior || form.promo || form.codigo) {
          const panelPrefix = `Panel ${index + 1}: `;

          // Validar producto según requireProduct (solo si está presente)
          if (form.producto && form.producto.length > (validationConfig.maxProductLength ?? 50)) {
            errs.push(`${panelPrefix}El nombre del producto debe tener máximo ${validationConfig.maxProductLength ?? 50} caracteres`);
          }

          // Validar precio actual (solo si está presente)
          if (form.actual) {
            const precioActual = Number(form.actual);
            if (isNaN(precioActual)) {
              errs.push(`${panelPrefix}El precio actual debe ser un número válido`);
            } else if (precioActual < (validationConfig.minPrice ?? 0)) {
              errs.push(`${panelPrefix}El precio actual debe ser mayor o igual a ${validationConfig.minPrice ?? 0}`);
            } else if (precioActual > (validationConfig.maxPrice ?? 999999)) {
              errs.push(`${panelPrefix}El precio actual debe ser menor o igual a ${validationConfig.maxPrice ?? 999999}`);
            }
          }

          // Validar código (solo si está presente)
          if (form.codigo && form.codigo.length > 20) {
            errs.push(`${panelPrefix}El código debe tener máximo 20 caracteres`);
          }

          // Validar precio anterior (si se proporciona)
          if (form.anterior) {
            const precioAnterior = Number(form.anterior);
            if (isNaN(precioAnterior) || precioAnterior < (validationConfig.minPrice ?? 0)) {
              errs.push(`${panelPrefix}El precio anterior debe ser mayor o igual a ${validationConfig.minPrice ?? 0}`);
            }
          }

          // Validar promoción (si se proporciona)
          if (form.promo && (isNaN(Number(form.promo)) || Number(form.promo) <= 0)) {
            errs.push(`${panelPrefix}La promoción debe ser un número mayor a 0`);
          }

          // Validar que el precio anterior sea mayor al actual si ambos están presentes
          if (form.anterior && form.actual && Number(form.anterior) <= Number(form.actual)) {
            errs.push(`${panelPrefix}El precio anterior debe ser mayor al precio actual`);
          }
        }
      });
    } else {
      // Modo normal: validar el formulario único
      const form = forms[0];

      // Validar producto según requireProduct
      if (validationConfig.requireProduct && !form.producto) {
        errs.push('El nombre del producto es requerido');
      } else if (form.producto && form.producto.length > (validationConfig.maxProductLength ?? 50)) {
        errs.push(`El nombre del producto debe tener máximo ${validationConfig.maxProductLength ?? 50} caracteres`);
      }

      // Validar precio actual según requireCurrentPrice
      if (validationConfig.requireCurrentPrice && !form.actual) {
        errs.push('El precio actual es requerido');
      } else if (form.actual) {
        const precioActual = Number(form.actual);
        if (isNaN(precioActual)) {
          errs.push('El precio actual debe ser un número válido');
        } else if (precioActual < (validationConfig.minPrice ?? 0)) {
          errs.push(`El precio actual debe ser mayor o igual a ${validationConfig.minPrice ?? 0}`);
        } else if (precioActual > (validationConfig.maxPrice ?? 999999)) {
          errs.push(`El precio actual debe ser menor o igual a ${validationConfig.maxPrice ?? 999999}`);
        }
      }

      // Validar código según requireCode
      if (validationConfig.requireCode && !form.codigo) {
        errs.push('El código del producto es requerido');
      } else if (form.codigo && form.codigo.length > 20) {
        errs.push('El código debe tener máximo 20 caracteres');
      }

      // Validar precio anterior (si se proporciona)
      if (form.anterior) {
        const precioAnterior = Number(form.anterior);
        if (isNaN(precioAnterior) || precioAnterior < (validationConfig.minPrice ?? 0)) {
          errs.push(`El precio anterior debe ser mayor o igual a ${validationConfig.minPrice ?? 0}`);
        }
      }

      // Validar promoción (si se proporciona)
      if (form.promo && (isNaN(Number(form.promo)) || Number(form.promo) <= 0)) {
        errs.push('La promoción debe ser un número mayor a 0');
      }

      // Validar que el precio anterior sea mayor al actual si ambos están presentes
      if (form.anterior && form.actual && Number(form.anterior) <= Number(form.actual)) {
        errs.push('El precio anterior debe ser mayor al precio actual');
      }
    }

    return errs;
  };

  // Exportar rótulo a imagen
  const exportRotulo = async (rotulo, width, height, filename, mimeType, showOverlay = true, hidePreview = true) => {
    // Guardar estilos originales
    const originalStyles = {
      width: rotulo.style.width,
      height: rotulo.style.height,
      transform: rotulo.style.transform,
      position: rotulo.style.position,
      left: rotulo.style.left,
      top: rotulo.style.top,
      zIndex: rotulo.style.zIndex,
      visibility: rotulo.style.visibility
    };

    // Ocultar previsualización solo si se solicita
    if (hidePreview && previewRef.current) {
      previewRef.current.style.visibility = 'hidden';
    }

    // Preparar el rótulo para captura con dimensiones exactas
    rotulo.style.width = width + 'px';
    rotulo.style.height = height + 'px';
    rotulo.style.transform = 'none';
    rotulo.style.position = 'absolute';
    rotulo.style.left = '-99999px';
    rotulo.style.top = '-99999px';
    rotulo.style.zIndex = '-1';
    rotulo.style.visibility = 'visible';

    if (showOverlay) {
      setProcessing(true);
    }

    await new Promise(resolve => setTimeout(resolve, 50)); // Esperar a que el DOM se actualice
    const canvas = await html2canvas(rotulo, { backgroundColor: null, useCORS: true, width, height, scale: 1 });

    if (showOverlay) {
      setProcessing(false);
    }

    // Restaurar estilos originales
    rotulo.style.width = originalStyles.width;
    rotulo.style.height = originalStyles.height;
    rotulo.style.transform = originalStyles.transform;
    rotulo.style.position = originalStyles.position;
    rotulo.style.left = originalStyles.left;
    rotulo.style.top = originalStyles.top;
    rotulo.style.zIndex = originalStyles.zIndex;
    rotulo.style.visibility = originalStyles.visibility;

    // Restaurar previsualización solo si se ocultó
    if (hidePreview && previewRef.current) {
      previewRef.current.style.visibility = 'visible';
    }

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob);
      }, mimeType);
    });
  };

  const handleDownload = async () => {
    const errs = validateForm();
    if (errs.length > 0) {
      showNotification("error", errs[0]);
      return;
    }
    const rotulo = document.getElementById("rotulo");
    if (!rotulo) return;
    if (!realSize.width || !realSize.height) {
      showNotification("error", "No se pudo obtener el tamaño real del fondo");
      return;
    }
    try {
      const combinedData = getCombinedFormData();
      const format = exportConfig?.imageFormat || "png";
      const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
      const prefix = exportConfig?.individualPrefix || "rotulo_";
      const filename = `${prefix}${combinedData.producto || "sin_nombre"}.${format}`;
      const blob = await exportRotulo(rotulo, realSize.width, realSize.height, filename, mimeType, true, true);
      if (blob) {
        saveAs(blob, filename);
        showNotification("success", "Imagen descargada correctamente");
      }
    } catch (err) {
      setProcessing(false);
      showNotification("error", "Error al generar la imagen");
    }
  };

  const handleAddToQueue = () => {
    const errs = validateForm();
    if (errs.length > 0) {
      showNotification("error", errs[0]);
      return;
    }

    const combinedData = getCombinedFormData();
    setQueue((prev) => [
      ...prev,
      {
        ...combinedData,
        id: Date.now().toString() + Math.random().toString(36).slice(2)
      }
    ]);
    showNotification("success", "Rótulo agregado a la cola");
    clearForm(); // Limpiar el formulario al agregar a la cola
  };

  const handleDelete = (id) => {
    setQueue((prev) => prev.filter(item => item.id !== id));
  };

  const handleClearQueue = () => {
    setQueue([]);
  };

  const handleZipNameChange = (e) => {
    setZipName(e.target.value);
  };

  const handleEdit = (item, idx) => {
    setEditIdx(idx);
    setEditData(item);
  };

  const handleEditChange = (e) => {
    if (e.target.name === 'combined') {
      // Manejar actualización completa para 4 paneles
      setEditData(e.target.value);
    } else {
      const { name, value } = e.target;
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditUnitChange = (e) => {
    setEditData((prev) => ({ ...prev, unidad: e.target.value }));
  };

  const handleEditBackgroundChange = (e) => {
    setEditData((prev) => ({ ...prev, fondo: e.target.value }));
  };

  const handleEditSave = () => {
    setQueue((prev) => prev.map((item, idx) => idx === editIdx ? { ...editData, id: item.id } : item));
    setEditIdx(null);
    setEditData(null);
  };

  const handleEditCancel = () => {
    setEditIdx(null);
    setEditData(null);
  };

  // Utilidad para cargar todos los CSS de fondos
  const ensureAllBackgroundCSSLoaded = async () => {
    const promises = labels.backgrounds.map(bg => {
      return new Promise(resolve => {
        let link = document.getElementById('estiloFondo-' + bg.id);
        if (!link) {
          link = document.createElement('link');
          link.rel = 'stylesheet';
          link.id = 'estiloFondo-' + bg.id;
          link.href = `/${bg.cssFile.replace('css/', '')}`;
          link.onload = () => resolve();
          document.head.appendChild(link);
        } else {
          resolve();
        }
      });
    });
    await Promise.all(promises);
  };

  const handleDownloadAll = async () => {
    if (queue.length === 0) return;
    setProcessing(true);
    // Ocultar previsualización al inicio del lote
    if (previewRef.current) {
      previewRef.current.style.visibility = 'hidden';
      previewRef.current.style.position = 'absolute';
      previewRef.current.style.left = '-99999px';
      previewRef.current.style.top = '-99999px';
      previewRef.current.style.zIndex = '-1';
    }
    await ensureAllBackgroundCSSLoaded(); // Asegura que todos los CSS de fondos estén cargados
    const zip = new JSZip();
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      // Obtener fondo y tamaño real para cada item
      const fondoConfigItem = labels.backgrounds.find(bg => bg.id === item.fondo);
      const fondoImageFileItem = fondoConfigItem ? `${fondoConfigItem.id}.png` : null;
      // Usar el hook manualmente para obtener el tamaño real (no se puede usar hook en ciclo, así que cargamos la imagen aquí)
      const size = await new Promise(resolve => {
        if (!fondoImageFileItem) return resolve({ width: null, height: null });
        const img = new window.Image();
        img.src = `/${fondoImageFileItem}`;
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve({ width: null, height: null });
      });
      if (!size.width || !size.height) continue;
      // Renderizar el rótulo temporalmente con los datos del item
      // Para 4 paneles, necesitamos descomponer los datos combinados de vuelta a array
      if (item.fondo && labels.backgrounds.find(bg => bg.id === item.fondo)?.es4Paneles) {
        // Si es 4 paneles, descomponer los datos
        const productos = item.producto ? item.producto.split(' | ') : ['', '', '', ''];
        const actuales = item.actual ? item.actual.split(' | ') : ['', '', '', ''];
        const anteriores = item.anterior ? item.anterior.split(' | ') : ['', '', '', ''];
        const promos = item.promo ? item.promo.split(' | ') : ['', '', '', ''];
        const codigos = item.codigo ? item.codigo.split(' | ') : ['', '', '', ''];
        const unidades = item.unidad ? item.unidad.split(' | ') : ['', '', '', ''];

        setForms([
          { ...item, producto: productos[0] || '', actual: actuales[0] || '', anterior: anteriores[0] || '', promo: promos[0] || '', codigo: codigos[0] || '', unidad: unidades[0] || '' },
          { ...item, producto: productos[1] || '', actual: actuales[1] || '', anterior: anteriores[1] || '', promo: promos[1] || '', codigo: codigos[1] || '', unidad: unidades[1] || '' },
          { ...item, producto: productos[2] || '', actual: actuales[2] || '', anterior: anteriores[2] || '', promo: promos[2] || '', codigo: codigos[2] || '', unidad: unidades[2] || '' },
          { ...item, producto: productos[3] || '', actual: actuales[3] || '', anterior: anteriores[3] || '', promo: promos[3] || '', codigo: codigos[3] || '', unidad: unidades[3] || '' }
        ]);
      } else {
        // Si no es 4 paneles, usar el primer formulario
        setForms(prev => prev.map((form, index) => index === 0 ? item : form));
      }
      await new Promise(resolve => setTimeout(resolve, 100)); // Esperar a que el DOM se actualice
      const rotuloTemp = document.getElementById("rotulo");
      const format = exportConfig?.imageFormat || "png";
      const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
      const prefix = exportConfig?.individualPrefix || "rotulo_";
      const filename = `${prefix}${item.producto || "sin_nombre"}_${i + 1}.${format}`;
      const blob = await exportRotulo(rotuloTemp, size.width, size.height, filename, mimeType, false, false);
      if (blob) {
        zip.file(filename, blob);
      }
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${zipName || "rotulos"}.zip`);
    setProcessing(false);
    // Restaurar previsualización al final del lote
    if (previewRef.current) {
      previewRef.current.style.visibility = 'visible';
      previewRef.current.style.position = '';
      previewRef.current.style.left = '';
      previewRef.current.style.top = '';
      previewRef.current.style.zIndex = '';
    }
    showNotification("success", "Descarga en lote completada");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAddToQueue();
      } else if (e.ctrlKey && e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        handleDownloadAll();
      } else if (e.key === "F1") {
        e.preventDefault();
        handleHelp();
      } else if (e.key === "Escape") {
        e.preventDefault();
        clearForm();
      } else if (e.key === "Tab") {
        // Navegación de campos (opcional, nativo en la mayoría de navegadores)
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [forms, labels, autocomplete]);

  // Cargar fondo dinámicamente como en la app original
  useEffect(() => {
    const combinedData = getCombinedFormData();
    const fondoConfig = labels.backgrounds.find(bg => bg.id === combinedData.fondo);
    if (fondoConfig) {
      let link = document.getElementById('estiloFondo');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'estiloFondo';
        document.head.appendChild(link);
      }
      link.href = `/${fondoConfig.cssFile.replace('css/', '')}`;
    }
    // Limpieza opcional: no removemos el link para mantener el fondo
  }, [forms, labels.backgrounds]);

  // Obtener el archivo de imagen de fondo actual
  const combinedData = getCombinedFormData();
  const fondoConfig = labels.backgrounds.find(bg => bg.id === combinedData.fondo);
  const fondoImageFile = fondoConfig ? `${fondoConfig.id}.png` : null;
  const realSize = useImageSize(fondoImageFile);
  const previewRef = useRef();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header onHelp={handleHelp} onToggleTheme={handleToggleTheme} />
      <Accordion
        forms={forms}
        units={labels.units}
        backgrounds={labels.backgrounds}
        onFormChange={handleFormChange}
        onUnitChange={handleUnitChange}
        onBackgroundChange={handleBackgroundChange}
        onDownload={handleDownload}
        onAddToQueue={handleAddToQueue}
        errors={errors}
        is4Paneles={is4Paneles()}
        onSingleChange={handleSingleChange}
        onSingleUnitChange={handleSingleUnitChange}
      />

      {is4Paneles() && (
        <div className="controles-4paneles">
          <div className="campo-fondo">
            <span className="etiqueta-fondo">Diseño de fondo:</span>
            <select
              id="selectorFondo"
              className="selector-fondo"
              value={forms[0].fondo}
              onChange={handleBackgroundChange}
              aria-label="Diseño de fondo"
            >
              {labels.backgrounds.map(bg => (
                <option key={bg.id} value={bg.id}>{bg.name}</option>
              ))}
            </select>
          </div>
          <div className="botones-formulario">
            <button
              id="botonDescargarRotulo"
              className="botonDescargarRotulo ripple"
              type="button"
              onClick={handleDownload}
              aria-label="Descargar imagen del rótulo"
            >
              Descargar imagen
            </button>
            <button
              id="botonAgregarCola"
              className="botonAgregarCola ripple"
              type="button"
              onClick={handleAddToQueue}
              aria-label="Agregar rótulo a la cola"
            >
              Agregar a la cola
            </button>
          </div>
        </div>
      )}
      <div className="contenedor-previsualizacion" ref={previewRef}>
        {(() => {
          const combinedData = getCombinedFormData();
          return (
            <LabelPreview
              producto={combinedData.producto}
              actual={combinedData.actual}
              anterior={combinedData.anterior}
              promo={combinedData.promo}
              unidad={combinedData.unidad}
              fondo={combinedData.fondo}
              codigo={combinedData.codigo}
            />
          );
        })()}
      </div>
      {processing && (
        <div className="processing-overlay">
          <div className="processing-card">
            <div className="processing-spinner"></div>
            <div className="processing-title">
              Procesando...
            </div>
            <div className="processing-subtitle">
              Generando las imágenes
            </div>
          </div>
        </div>
      )}
      <LabelQueue
        queue={queue}
        zipName={zipName}
        onZipNameChange={handleZipNameChange}
        onDownloadAll={handleDownloadAll}
        onClearQueue={handleClearQueue}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Footer />
      <EditLabelModal
        open={editIdx !== null}
        data={editData || {}}
        units={labels.units}
        backgrounds={labels.backgrounds}
        onChange={handleEditChange}
        onUnitChange={handleEditUnitChange}
        onBackgroundChange={handleEditBackgroundChange}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
      <Notification
        type={notification.type}
        message={notification.message}
        visible={notification.visible}
      />
      <HelpModal isOpen={showHelp} onClose={handleCloseHelp} />
      </div>
  );
}

export default App;
