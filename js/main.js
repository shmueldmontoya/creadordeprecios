const botonDescargar = document.getElementById('botonDescargarRotulo');

// Event listeners para los botones e input fields
botonDescargar.addEventListener('click', descargarImagen);
document.getElementById('producto').addEventListener('input', actualizarRotulo);
document.getElementById('actual').addEventListener('input', actualizarRotulo);
document.getElementById('anterior').addEventListener('input', actualizarRotulo);
document.getElementById('promo').addEventListener('input', actualizarRotulo);
document.getElementById('inputkg').addEventListener('change', actualizarRotulo);
document.getElementById('inputud').addEventListener('change', actualizarRotulo);
document.getElementById('inputempty').addEventListener('change', actualizarRotulo);


function obtenerValoresPrecios() {
  const actual = parseInt(document.getElementById('actual').value);
  const anterior = parseInt(document.getElementById('anterior').value);
  const ahorro = anterior - actual;
  return { actual, anterior, ahorro };
}


function actualizarRotulo() {
  const producto = document.getElementById('producto').value.toUpperCase();
  const { actual, anterior, ahorro } = obtenerValoresPrecios();

  document.getElementById('texto-producto').innerText = producto;

  const promo = document.getElementById('promo').value.trim();
  const tipoVenta = document.querySelector('input[name="tipoVenta"]:checked').value;

  const actualSpan = document.getElementById('texto-actual');
  const anteriorSpan = document.getElementById('texto-anterior');
  const ahorreSpan = document.getElementById('texto-ahorre');
  
  // Si el usuario selecciona "kg" o "ud", se muestra en el rótulo
  if (!isNaN(actual)) {
    actualSpan.innerHTML = `
    ${promo ? `<span class="promo">${promo}x</span> ` : ''}
    <span class="precio">₡${actual}</span>
    ${tipoVenta ? `<span class="unidad"> ${tipoVenta}</span>` : ''}
    `;

    actualSpan.style.display = 'block';
  } else {
    actualSpan.innerHTML = '';
    actualSpan.style.display = 'none';
  }
  // Si el usuario ingresa un precio anterior, se muestra el ahorro
  if (!isNaN(actual) && !isNaN(anterior)) {
    anteriorSpan.innerText = `Precio regular: ₡${anterior}`;
    ahorreSpan.innerText = `Ahorro: ₡${ahorro}`;
    anteriorSpan.style.display = 'block';
    ahorreSpan.style.display = 'block';
  } else {
    anteriorSpan.innerText = '';
    ahorreSpan.innerText = '';
    anteriorSpan.style.display = 'none';
    ahorreSpan.style.display = 'none';
  }
}

function descargarImagen() {
  const { actual, anterior, ahorro } = obtenerValoresPrecios();
  const producto = document.getElementById('producto').value.trim();

  if (!producto) {
    mostrarError('Por favor ingresa el nombre del producto.');
    return;
  }

  if (isNaN(actual)) {
    mostrarError('Debes ingresar al menos el precio actual.');
    return;
  }

  if (!isNaN(anterior) && ahorro <= 0) {
    mostrarError('El precio actual no puede ser igual o mayor que el precio anterior.');
    return;
  }

  // Generar el rótulo con html2canvas
  html2canvas(document.getElementById('rotulo')).then(canvas => {
    const enlace = document.createElement('a');
    const nombreProducto = document.getElementById('producto').value || 'rotulo';
    enlace.download = nombreProducto + '-rotulo.png';
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
// Autocompletar el campo de producto basado en el código ingresado
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
// Esto fue para solucionar el problema de que los input fields requerían el atributo 'required' para que no se rompieran los estilos css
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

// Cambiar el fondo del rotulo según la selección del usuario
const linkFondo = document.createElement('link');
linkFondo.rel = 'stylesheet';
linkFondo.id = 'estiloFondo';
linkFondo.href = 'css/fondo.css'; // fondo por defecto
document.head.appendChild(linkFondo);

document.getElementById('selectorFondo').addEventListener('change', function () {
  const fondo = this.value;
  linkFondo.href = `css/${fondo}.css`;
});

// Mostrar mensaje de error en caso de que el usuario no ingrese bien los datos
function mostrarError(mensaje) {
  const contenedor = document.getElementById('mensajeError');
  contenedor.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${mensaje}`;
  contenedor.style.display = 'block';

  requestAnimationFrame(() => {
    contenedor.classList.add('visible');
  });

  // Ocultar después de 3 segundos
  setTimeout(() => {
    contenedor.classList.remove('visible');
    setTimeout(() => {
      contenedor.style.display = 'none';
    }, 300); // igual al tiempo de la transición
  }, 3000);
}