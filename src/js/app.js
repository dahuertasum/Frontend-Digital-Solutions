(function () {

  document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
  });

  let productosGlobal = [];

  async function cargarProductos() {
    try {
      const response = await fetch("../src/data/productos.json");
      const data = await response.json();

      productosGlobal = data;
      renderProductos(data);

    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  }

  function renderProductos(productos) {

    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    productos.forEach(producto => {

      const precioFinal = producto.precioDescuento || producto.precio;

      const div = document.createElement("div");
      div.classList.add("product");

      div.setAttribute("data-brand", producto.marca);
      div.setAttribute("data-price", precioFinal);

      div.innerHTML = `
  <div class="product-image-container">
    <img 
      src="../src/assets/img/${producto.imagenes.front}" 
      alt="${producto.nombre}"
      class="front"
    >
    <img 
      src="../src/assets/img/${producto.imagenes.back}" 
      alt="${producto.nombre}"
      class="back"
    >
  </div>

  <div class="product-info">
    <p class="product-text">${producto.nombre}</p>
    <div class="price">
      ${producto.oferta
          ? `
          <span class="price-old">$${producto.precio.toLocaleString("es-CO")}</span>
          <span class="price-new">$${producto.precioDescuento.toLocaleString("es-CO")}</span>
        `
          : `<span class="price-new">$${producto.precio.toLocaleString("es-CO")}</span>`
        }
    </div>
    <button class="btn-add" type="button" data-id="${producto.id}">Añadir al carrito</button>
  </div>
`;

      container.appendChild(div);

    });

  }

})();

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

const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");
const priceFilter = document.getElementById("priceFilter");

function filterProducts() {
  const products = document.querySelectorAll(".product"); // <- se actualiza cada vez
  const searchText = searchInput.value.toLowerCase();
  const selectedBrand = brandFilter.value;
  const selectedPrice = priceFilter.value;

  products.forEach(product => {
    const name = product.querySelector(".product-text").textContent.toLowerCase();
    const brand = product.getAttribute("data-brand");
    const price = parseFloat(product.getAttribute("data-price"));

    let show = true;

    // Filtro por texto
    if (!name.includes(searchText)) show = false;

    // Filtro por marca
    if (selectedBrand && brand !== selectedBrand) show = false;

    // Filtro por precio
    if (selectedPrice) {
      if (selectedPrice.includes("-")) {
        const [min, max] = selectedPrice.split("-").map(Number);
        if (price < min || price > max) show = false;
      } else {
        if (price < Number(selectedPrice)) show = false;
      }
    }

    product.style.display = show ? "block" : "none";
  });
}

// Eventos
searchInput.addEventListener("input", filterProducts);
brandFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);


