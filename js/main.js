const botonActualizar = document.getElementById('botonActualizarRotulo');
const botonDescargar = document.getElementById('botonDescargarRotulo');

// Event listeners para los botones e input fields
botonActualizar.addEventListener('click', actualizarRotulo);
botonDescargar.addEventListener('click', descargarImagen);
document.getElementById('producto').addEventListener('input', actualizarRotulo);
document.getElementById('actual').addEventListener('input', actualizarRotulo);
document.getElementById('anterior').addEventListener('input', actualizarRotulo);

function actualizarRotulo() {
  const producto = document.getElementById('producto').value.toUpperCase();
  const actual = parseInt(document.getElementById('actual').value);
  const anterior = parseInt(document.getElementById('anterior').value);
  const ahorro = anterior - actual;

  document.getElementById('texto-producto').innerText = producto;
  document.getElementById('texto-actual').innerText = `₡${actual}`;
  document.getElementById('texto-anterior').innerText = `₡${anterior}`;
  document.getElementById('texto-ahorre').innerText = `₡${ahorro}`;
}

function descargarImagen() {
  html2canvas(document.getElementById('rotulo')).then(canvas => {
    const enlace = document.createElement('a');
    enlace.download = 'rotulo.png';
    enlace.href = canvas.toDataURL();
    enlace.click();
  });
}

// Cargar la base de datos de productos desde un archivo JSON
let baseDatos = [];

fetch('js/productos.json')
  .then(res => res.json())
  .then(data => {
    baseDatos = data;
  });

document.getElementById('codigo').addEventListener('input', function () {
  const codigoIngresado = this.value.trim().toUpperCase();
  const productoEncontrado = baseDatos.find(p =>
    p.codigos.includes(codigoIngresado)
  );
  
  if (productoEncontrado) {
    document.getElementById('producto').value = productoEncontrado.nombre;
    actualizarRotulo();
  }
});
