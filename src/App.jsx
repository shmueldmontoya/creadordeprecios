import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
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

function App() {
  const { labels, store, format, products, export: exportConfig, validation } = useAppConfig();
  const [theme, setTheme] = useState("light");
  const [showHelp, setShowHelp] = useState(false);
  const [form, setForm] = useState({
    codigo: "",
    producto: "",
    promo: "",
    actual: "",
    anterior: "",
    unidad: "",
    fondo: labels.defaultBackground || "fondo"
  });
  const [queue, setQueue] = useState([]);
  const [zipName, setZipName] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [notification, setNotification] = useState({ visible: false, type: "success", message: "" });
  const notificationTimeout = useRef(null);
  const notificationCloseTimeout = useRef(null);
  const [errors, setErrors] = useState({});
  const { productos, filtrar } = useProductos();
  const [autocomplete, setAutocomplete] = useState([]);
  const formRefs = useRef([]);

  // Inicializar la unidad por defecto después de que se cargue la configuración
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      unidad: products?.defaultUnit || ""
    }));
  }, [products]);

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
    setForm({
      codigo: "",
      producto: "",
      promo: "",
      actual: "",
      anterior: "",
      unidad: products?.defaultUnit || "",
      fondo: labels.defaultBackground || "fondo"
    });
    setErrors({});
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

  const handleUnitChange = (e) => {
    setForm((prev) => ({ ...prev, unidad: e.target.value }));
  };

  const handleBackgroundChange = (e) => {
    setForm((prev) => ({ ...prev, fondo: e.target.value }));
  };

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
    
    // Validar producto según requireProduct
    if (validationConfig.requireProduct && !form.producto) {
      errs.push('El nombre del producto es requerido');
    } else if (form.producto && form.producto.length > (validationConfig.maxProductLength ?? 50)) {
      errs.push('El nombre del producto debe tener máximo ' + (validationConfig.maxProductLength ?? 50) + ' caracteres');
    }
    
    // Validar precio actual según requireCurrentPrice
    if (validationConfig.requireCurrentPrice && !form.actual) {
      errs.push('El precio actual es requerido');
    } else if (form.actual) {
      const precioActual = Number(form.actual);
      if (isNaN(precioActual)) {
        errs.push('El precio actual debe ser un número válido');
      } else if (precioActual < (validationConfig.minPrice ?? 0)) {
        errs.push('El precio actual debe ser mayor o igual a ' + (validationConfig.minPrice ?? 0));
      } else if (precioActual > (validationConfig.maxPrice ?? 999999)) {
        errs.push('El precio actual debe ser menor o igual a ' + (validationConfig.maxPrice ?? 999999));
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
        errs.push('El precio anterior debe ser mayor o igual a ' + (validationConfig.minPrice ?? 0));
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
    
    return errs;
  };

  const handleDownload = async () => {
    const errs = validateForm();
    if (errs.length > 0) {
      showNotification("error", errs[0]);
      return;
    }
    const rotulo = document.getElementById("rotulo");
    if (!rotulo) return;
    try {
      const canvas = await html2canvas(rotulo, { backgroundColor: null, useCORS: true });
      const format = exportConfig?.imageFormat || "png";
      const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
      console.log('Formato configurado:', format);
      console.log('MIME type:', mimeType);
      console.log('Configuración export:', exportConfig);
      canvas.toBlob(blob => {
        if (blob) {
          const prefix = exportConfig?.individualPrefix || "rotulo_";
          const filename = `${prefix}${form.producto || "sin_nombre"}.${format}`;
          console.log('Archivo a descargar:', filename);
          saveAs(blob, filename);
          showNotification("success", "Imagen descargada correctamente");
        }
      }, mimeType);
    } catch (err) {
      showNotification("error", "Error al generar la imagen");
    }
  };

  const handleAddToQueue = () => {
    const errs = validateForm();
    if (errs.length > 0) {
      showNotification("error", errs[0]);
      return;
    }
    if (!form.producto || !form.actual) {
      showNotification("error", "El producto y el precio actual son obligatorios");
      return;
    }
    setQueue((prev) => [
      ...prev,
      {
        ...form,
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
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
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

  const handleDownloadAll = async () => {
    if (queue.length === 0) return;
    const zip = new JSZip();
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      // Renderizar el rótulo en un contenedor oculto
      const temp = document.createElement("div");
      temp.style.position = "fixed";
      temp.style.left = "-9999px";
      temp.style.top = "0";
      temp.style.zIndex = "-1";
      const textoPrecioAnterior = labels.textoPrecioAnterior || "Precio regular:";
      const textoAhorro = labels.textoAhorro || "Ahorro:";
      let ahorro = "";
      if (item.anterior && item.actual && Number(item.anterior) > Number(item.actual)) {
        const diff = Number(item.anterior) - Number(item.actual);
        ahorro = `${store.currency}${formatNumber(diff)}`;
      }
      temp.innerHTML = `<div class='rotulo rotulo-preview ${item.fondo}' id='rotulo-temp'>
        <div class='producto' id='texto-producto'>${item.producto}</div>
        <div class='precio-actual' id='texto-actual'>
          ${item.promo && item.promo > 0 ? `<span class='promo' id='texto-promo'>${item.promo}x&nbsp;</span>` : ''}${store.currency}${formatNumber(item.actual)}${item.unidad ? ` <span class='unidad'>/ ${item.unidad}</span>` : ""}
        </div>
        <div class='antes' id='texto-anterior'>${item.anterior && Number(item.anterior) > Number(item.actual) ? `${textoPrecioAnterior} ${store.currency}${formatNumber(item.anterior)}` : ""}</div>
        <div class='ahorre' id='texto-ahorre'>${ahorro && `${textoAhorro} ${ahorro}`}</div>
      </div>`;
      document.body.appendChild(temp);
      const rotuloTemp = temp.querySelector("#rotulo-temp");
      try {
        const canvas = await html2canvas(rotuloTemp, { backgroundColor: null, useCORS: true });
        const format = exportConfig?.imageFormat || "png";
        const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
        const blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType));
        const prefix = exportConfig?.individualPrefix || "rotulo_";
        zip.file(`${prefix}${item.producto || "sin_nombre"}_${i + 1}.${format}`, blob);
      } catch (err) {
        // Si falla, no agrega la imagen
      }
      document.body.removeChild(temp);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${zipName || "rotulos"}.zip`);
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
  }, [form, labels, autocomplete]);

  // Cargar fondo dinámicamente como en la app original
  useEffect(() => {
    const fondoConfig = labels.backgrounds.find(bg => bg.id === form.fondo);
    if (fondoConfig) {
      let link = document.getElementById('estiloFondo');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'estiloFondo';
        document.head.appendChild(link);
      }
      link.href = `/src/assets/${fondoConfig.cssFile.replace('css/', '')}`;
    }
    // Limpieza opcional: no removemos el link para mantener el fondo
  }, [form.fondo, labels.backgrounds]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header onHelp={handleHelp} onToggleTheme={handleToggleTheme} />
      <ProductForm
        values={form}
        units={labels.units}
        backgrounds={labels.backgrounds}
        onChange={handleChange}
        onUnitChange={handleUnitChange}
        onBackgroundChange={handleBackgroundChange}
        onDownload={handleDownload}
        onAddToQueue={handleAddToQueue}
        errors={errors}
      />
      <LabelPreview
        producto={form.producto}
        actual={form.actual}
        anterior={form.anterior}
        promo={form.promo}
        unidad={form.unidad}
        fondo={form.fondo}
        codigo={form.codigo}
      />
      <LabelQueue
        queue={queue}
        zipName={zipName}
        onZipNameChange={handleZipNameChange}
        onDownloadAll={handleDownloadAll}
        onClearQueue={handleClearQueue}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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
