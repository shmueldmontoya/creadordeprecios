import { useEffect, useState } from "react";

/**
 * Hook para obtener el tamaño real de una imagen (ancho y alto en píxeles)
 * @param {string} imageFileName - Nombre del archivo de imagen (ej: 'fondo2.png')
 * @returns {{ width: number|null, height: number|null }}
 */
export default function useImageSize(imageFileName) {
  const [size, setSize] = useState({ width: null, height: null });

  useEffect(() => {
    if (!imageFileName) {
      setSize({ width: null, height: null });
      return;
    }
    const img = new window.Image();
    img.src = `/${imageFileName}`;
    img.onload = () => {
      setSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setSize({ width: null, height: null });
    };
    // Limpieza opcional
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageFileName]);

  return size;
} 