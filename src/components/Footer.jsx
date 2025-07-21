import React from "react";

const Footer = () => (
  <footer
    style={{
      width: '100%',
      background: 'var(--color-fondo-card)',
      color: 'var(--color-texto-secundario)',
      textAlign: 'center',
      padding: '16px 0',
      fontSize: '0.95rem',
      borderTop: '2px solid #146044',
      marginTop: '40px',
      transition: 'background 0.3s, color 0.3s'
    }}
  >
    Proyecto de código abierto, creado por Samuel Delgado |
    <a
      href="https://github.com/shmueldmontoya/creadordeprecios"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#146044', textDecoration: 'none', marginLeft: 4 }}
      aria-label="Ver código fuente en GitHub"
    >
      <i className="fa-brands fa-github"></i> Código fuente
    </a>
  </footer>
);

export default Footer; 