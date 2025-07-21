import React from 'react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const atajos = [
    { teclas: 'Ctrl + Enter', descripcion: 'Agregar a la cola' },
    { teclas: 'Ctrl + Shift + Enter', descripcion: 'Descargar lote de rótulos' },
    { teclas: 'F1', descripcion: 'Mostrar/ocultar esta ayuda' },
    { teclas: 'Escape', descripcion: 'Limpiar formulario' },
    { teclas: 'Tab', descripcion: 'Navegar entre campos' }
  ];

  const crearAtajo = (teclas, descripcion) => {
    const teclasArray = teclas.split(' + ');
    return (
      <div key={teclas} className="atajo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
          {teclasArray.map((tecla, index) => (
            <React.Fragment key={index}>
              <kbd>{tecla}</kbd>
              {index < teclasArray.length - 1 && <span style={{ margin: '0 2px' }}>+</span>}
            </React.Fragment>
          ))}
        </div>
        <span style={{ marginLeft: '15px' }}>{descripcion}</span>
      </div>
    );
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80%',
          overflow: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#146044' }}>Atajos de Teclado</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>
        <div>
          {atajos.map(atajo => crearAtajo(atajo.teclas, atajo.descripcion))}
        </div>
      </div>
    </div>
  );
};

export default HelpModal; 