import { useState, useEffect } from "react";

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  useEffect(() => {
    fetch("/productos.json")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => setProductos([]));
  }, []);

  const filtrar = (query) => {
    if (!query) return [];
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(query.toLowerCase()) ||
      (p.codigos && p.codigos.some(c => c.includes(query)))
    );
  };

  return { productos, filtrar };
} 