const botonDescargar = document.getElementById('botonDescargarRotulo');

// Event listeners para los botones e input fields
botonDescargar.addEventListener('click', descargarImagen);
document.getElementById('producto').addEventListener('input', actualizarRotulo);
document.getElementById('actual').addEventListener('input', actualizarRotulo);
document.getElementById('anterior').addEventListener('input', actualizarRotulo);
document.getElementById('promo').addEventListener('input', actualizarRotulo);


function actualizarRotulo() {
  const producto = document.getElementById('producto').value.toUpperCase();
  const actual = parseInt(document.getElementById('actual').value);
  const anterior = parseInt(document.getElementById('anterior').value);
  const ahorro = anterior - actual;

  document.getElementById('texto-producto').innerText = producto;
  const promo = document.getElementById('promo').value.trim();
  const tipoVenta = document.querySelector('input[name="tipoVenta"]:checked').value;
  document.getElementById('texto-actual').innerHTML = `${promo ? `<span class="promo">${promo + "x"}</span> ` : ''}<span class="precio">₡${actual}</span><span class="unidad"> ${tipoVenta}</span>`;
  document.getElementById('texto-anterior').innerText = `Precio regular: ₡${anterior}`;
  document.getElementById('texto-ahorre').innerText = `Ahorro: ₡${ahorro}`;
}
// Inicializar el rotulo al cargar la página
document.querySelectorAll('input[name="tipoVenta"]').forEach(radio => {
  radio.addEventListener('change', actualizarRotulo);
});


function descargarImagen() {
  html2canvas(document.getElementById('rotulo')).then(canvas => {
    const enlace = document.createElement('a');
    enlace.download = document.getElementById('producto').value + '-rotulo.png';
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
    document.getElementById('producto').classList.add('no-vacio');
    actualizarRotulo();
  }
});

// Añadir clase 'no-vacio' a los inputs que no están vacíos
// Esto fue para solucionar el problema de que los input fields requerían el atributo 'required' para que no se rompieran los estilos
document.querySelectorAll('.campo-input input').forEach(input => {
  const actualizarClase = () => {
    if (input.value.trim() !== '') {
      input.classList.add('no-vacio');
    } else {
      input.classList.remove('no-vacio');
    }
  };

  input.addEventListener('input', actualizarClase);
  actualizarClase();
});

// Esto es para añadir el efecto de ripple a los botones
document.querySelectorAll('.ripple').forEach(boton => {
  boton.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

    this.appendChild(ripple);

    // Eliminar el ripple después de la animación
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
});