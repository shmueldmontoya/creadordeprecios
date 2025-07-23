import React from "react";
import { useAppConfig } from "../context/AppConfigContext";

const Header = ({ onHelp, onToggleTheme }) => {
  const { store } = useAppConfig();
  // Detectar si es móvil
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  return (
    <header>
      <h1 id="tituloApp">Generador de Rótulos - {store.name}</h1>
      <div className="header-buttons">
        {!isMobile && (
          <button
            id="botonAyuda"
            className="boton-ayuda"
            title="Atajos de teclado (F1)"
            onClick={onHelp}
          >
            <i className="fas fa-question-circle"></i>
          </button>
        )}
        <button
          id="botonModoOscuro"
          className="boton-modo-oscuro"
          title="Cambiar modo oscuro"
          onClick={onToggleTheme}
        >
          <i className="fas fa-moon"></i>
        </button>
      </div>
    </header>
  );
};

export default Header; 