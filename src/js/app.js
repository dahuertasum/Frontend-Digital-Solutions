/* ======================================================
   CARGAR PRODUCTOS
======================================================*/

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
    if (!container) return;

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
          ${
            producto.oferta
            ? `
              <span class="price-old">$${producto.precio.toLocaleString("es-CO")}</span>
              <span class="price-new">$${producto.precioDescuento.toLocaleString("es-CO")}</span>
              `
            : `<span class="price-new">$${producto.precio.toLocaleString("es-CO")}</span>`
          }
        </div>

        <button class="btn-add" type="button" data-id="${producto.id}">
          Añadir al carrito
        </button>

      </div>
      `;

      container.appendChild(div);

    });

  }

})();


/* ======================================================
   ACCESIBILIDAD
======================================================*/

(() => {

  const btnAumentar = document.querySelector('#aumentarFuente');
  const btnDisminuir = document.querySelector('#disminuirFuente');
  const btnContraste = document.querySelector('#contraste');

  let tamañoFuente = 16;

  if (btnAumentar || btnDisminuir || btnContraste) {

    btnAumentar.addEventListener('click', () => {

      if (tamañoFuente < 25) {

        tamañoFuente += 1;
        document.body.style.fontSize = `${tamañoFuente}px`;

        document.querySelectorAll('label').forEach(label => {

          let fontSize = parseFloat(window.getComputedStyle(label).fontSize);

          if (fontSize) {
            label.style.fontSize = (fontSize + 1) + "px";
          }

        });

      }

    });

    btnDisminuir.addEventListener("click", () => {

      if (tamañoFuente >= 12) {

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

      if (document.body.classList.contains("modo-contraste")) {
        localStorage.setItem("modoContraste", "activo");
      } else {
        localStorage.removeItem("modoContraste");
      }

    });

  }

})();


/* ======================================================
   FILTRO DE PRODUCTOS
======================================================*/

const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");
const priceFilter = document.getElementById("priceFilter");

if (searchInput) searchInput.addEventListener("input", filterProducts);
if (brandFilter) brandFilter.addEventListener("change", filterProducts);
if (priceFilter) priceFilter.addEventListener("change", filterProducts);


function filterProducts() {

  const products = document.querySelectorAll(".product");

  const searchText = searchInput.value.toLowerCase();
  const selectedBrand = brandFilter.value;
  const selectedPrice = priceFilter.value;

  products.forEach(product => {

    const name = product.querySelector(".product-text").textContent.toLowerCase();
    const brand = product.getAttribute("data-brand");
    const price = parseFloat(product.getAttribute("data-price"));

    let show = true;

    if (!name.includes(searchText)) show = false;

    if (selectedBrand && brand !== selectedBrand) show = false;

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


/* ======================================================
   LOGIN
======================================================*/

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const errorEmail = document.getElementById("errorEmail");
    const errorPassword = document.getElementById("errorPassword");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    let valid = true;

    if (!emailRegex.test(email)) {
      errorEmail.textContent = "Correo inválido";
      valid = false;
    } else {
      errorEmail.textContent = "";
    }

    if (!passwordRegex.test(password)) {
      errorPassword.textContent =
        "Debe tener 8 caracteres, una mayúscula y un número";
      valid = false;
    } else {
      errorPassword.textContent = "";
    }

    if (valid) {

      try {

        const response = await fetch("http://127.0.0.1:5000/login", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })

        });

        const data = await response.json();

        if(data.token){
          localStorage.setItem("token", data.token)
          alert("Login exitoso")
          window.location.href="productos.html"
        }

      } catch (error) {

        console.error("Error login:", error);

      }

    }

  });

}


/* ======================================================
   REGISTRO
======================================================*/

const registerForm = document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("emailRegistro").value.trim();
    const password = document.getElementById("passwordRegistro").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const errorNombre = document.getElementById("errorNombre");
    const errorEmail = document.getElementById("errorEmailRegistro");
    const errorPassword = document.getElementById("errorPasswordRegistro");
    const errorConfirm = document.getElementById("errorConfirmPassword");

    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    let valid = true;

    // VALIDAR NOMBRE
    if (!nombreRegex.test(nombre)) {
      errorNombre.textContent = "Nombre inválido (solo letras)";
      valid = false;
    } else {
      errorNombre.textContent = "";
    }

    // VALIDAR EMAIL
    if (!emailRegex.test(email)) {
      errorEmail.textContent = "Correo electrónico inválido";
      valid = false;
    } else {
      errorEmail.textContent = "";
    }

    // VALIDAR PASSWORD
    if (!passwordRegex.test(password)) {
      errorPassword.textContent =
        "Debe tener 8 caracteres, mayúscula, minúscula y número";
      valid = false;
    } else {
      errorPassword.textContent = "";
    }

    // VALIDAR CONFIRMACION
    if (password !== confirmPassword) {
      errorConfirm.textContent = "Las contraseñas no coinciden";
      valid = false;
    } else {
      errorConfirm.textContent = "";
    }

    // SI TODO ES VALIDO -> LLAMAR API
    if (valid) {

      try {

        const response = await fetch("http://127.0.0.1:5000/registro", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre: nombre,
            email: email,
            password: password
          })
        });

        const data = await response.json();

        alert(data.message);

      } catch (error) {

        console.error("Error en registro:", error);

      }

    }

  });

}


/* ======================================================
   VISIBILIDAD PASSWORD
======================================================*/

document.querySelectorAll(".togglePassword").forEach(icon => {

  icon.addEventListener("click", () => {

    const input = icon.previousElementSibling;

    const type = input.type === "password" ? "text" : "password";

    input.type = type;

    icon.classList.toggle("fa-eye-slash");

  });

});