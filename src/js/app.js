// (function () {

//   document.addEventListener('DOMContentLoaded', () => {

//     // ===============================
//     // PRODUCTOS
//     // ===============================
//     let productosGlobal = [];
//     const contenedor = document.getElementById('productos');

//     if (contenedor) {
//       fetch('../src/data/productos.json')
//         .then(response => response.json())
//         .then(productos => {
//           productosGlobal = productos;
//           renderProductos(productosGlobal);
//         })
//         .catch(error => {
//           console.error('Error cargando productos:', error);
//         });
//     }

//     function renderProductos(lista) { 


//       lista.forEach(producto => {
//         const article = document.createElement('article');

//         let precioHTML = '';
//         if (producto.oferta) {
//           precioHTML = `
//             <p><del>$${producto.precio.toLocaleString()}</del></p>
//             <p><strong>$${producto.precioDescuento.toLocaleString()}</strong></p>
//           `;
//         } else {
//           precioHTML = `<p>$${producto.precio.toLocaleString()}</p>`;
//         }

//         article.innerHTML = `
//           <div class="img-container">
//             <img 
//               src="../src/assets/img/${producto.imagenes.front}" 
//               data-front="../src/assets/img/${producto.imagenes.front}"
//               data-back="../src/assets/img/${producto.imagenes.back}"
//               alt="${producto.nombre}"
//               class="producto-img"
//             >
//           </div>

//           <p>${producto.nombre}</p>
//           ${precioHTML}
//           <button class='btn-add'>Añadir al carrito</button>
//         `;

//         const img = article.querySelector('.producto-img');
//         img.addEventListener('mouseenter', () => img.src = img.dataset.back);
//         img.addEventListener('mouseleave', () => img.src = img.dataset.front);

//         contenedor.appendChild(article);
//       });
//     }

//     // ===============================
//     // FILTRO POR MARCA
//     // ===============================
//     const botonesMarca = document.querySelectorAll('.marca-btn');

//     if (botonesMarca.length > 0) {
//       botonesMarca.forEach(btn => {
//         btn.addEventListener('click', () => {
//           botonesMarca.forEach(b => b.classList.remove('active'));
//           btn.classList.add('active');

//           const marca = btn.dataset.marca;
//           const filtrados = productosGlobal.filter(p => p.marca === marca);
//           renderProductos(filtrados);
//         });
//       });
//     }

//     // ===============================
//     // SLIDER ECOSISTEMA
//     // ===============================
//     const slider = document.getElementById('slider');
//     const next = document.getElementById('next');
//     const prev = document.getElementById('prev');

//     if (slider && next && prev) {
//       next.addEventListener('click', () => {
//         slider.scrollLeft += 300;
//       });

//       prev.addEventListener('click', () => {
//         slider.scrollLeft -= 300;
//       });
//     }

//   });

// })();

// ACCESIBILIDAD

(() => {
  const btnAumentar = document.querySelector('#aumentarFuente');
  const btnDisminuir = document.querySelector('#disminuirFuente');
  const btnContraste = document.querySelector('#contraste');

  // Tamaño de fuente base

  let tamañoFuente = 16;
  let contrasteActivo = false;

  if (btnAumentar || btnDisminuir || contraste) {

    // Asociar evento click
    btnAumentar.addEventListener('click', () => {
      if (tamañoFuente < 25) {
        tamañoFuente += 1;
        document.body.style.fontSize = `${tamañoFuente}px`;
        document.querySelectorAll('label').forEach(label => {
          let fontSize = parseFloat(window.getComputedStyle(label).
            fontSize);
          if (fontSize) {
            label.style.fontSize = (fontSize + 1) + "px";
          }
        });

      }
    });

    btnDisminuir.addEventListener("click", () => {
      if (tamañoFuente >= 12) { // Evita que la fuente sea demasiado pequeña
        tamañoFuente -= 1;
        document.body.style.fontSize = `${tamañoFuente}px`;
        document.querySelectorAll("label").forEach(label => {
          let fontSize = parseFloat(window.getComputedStyle(label).fontSize);
          if (fontSize >= 12) {
            label.style.fontSize = (fontSize - 1) + "px";
          }
        });
      }
    });
    if (localStorage.getItem("modoContraste") === "activo") {
      document.body.classList.add("modo-contraste");
    }
    btnContraste.addEventListener("click", () => {
      document.body.classList.toggle("modo-contraste");

      // Guardar estado
      if (document.body.classList.contains("modo-contraste")) {
        localStorage.setItem("modoContraste", "activo");
      } else {
        localStorage.removeItem("modoContraste");
      }
    });
  }
})()

//Login 
const form = document.querySelector("form")

form.addEventListener("submit", async (e)=>{

e.preventDefault()

const email = document.getElementById("email").value
const password = document.getElementById("password").value

const response = await fetch("http://127.0.0.1:5000/login",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
email:email,
password:password
})

})

const data = await response.json()

alert(data.message)

})

