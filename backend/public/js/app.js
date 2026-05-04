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
          src="img/${producto.imagenes.front}" 
          alt="${producto.nombre}"
          class="front"
        >
        <img 
          src="img/${producto.imagenes.back}" 
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

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const errorEmail = document.getElementById("errorEmail");
    const errorPassword = document.getElementById("errorPassword");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    let valid = true;

    // Validación email
    if (!emailRegex.test(email)) {
      errorEmail.textContent = "Correo inválido";
      valid = false;
    } else {
      errorEmail.textContent = "";
    }

    // Validación password
    if (!passwordRegex.test(password)) {
      errorPassword.textContent =
        "Debe tener 8 caracteres, una mayúscula y un número";
      valid = false;
    } else {
      errorPassword.textContent = "";
    }

    if (!valid) return;

    try {

      const response = await fetch("/login", {
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

      if (response.ok && data.token) {

        // 🔐 guardar token
        localStorage.setItem("token", data.token);

        alert("Login exitoso 🚀");

        // 🔁 redirección correcta
        window.location.href = "/dashboard";

      } else {
        alert(data.message || "Error en el login");
      }

    } catch (error) {
      console.error("Error login:", error);
      alert("Error de conexión con el servidor");
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

    // 🚀 SI TODO ES VALIDO
    if (valid) {

      try {

        const response = await fetch("https://frontend-digital-solutions.onrender.com/registro", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre,
            email,
            password
          })
        });

        const data = await response.json();

        // ✅ SI TODO SALE BIEN
        if (response.ok) {
          alert(data.message || "Usuario registrado correctamente");

          // limpiar formulario
          registerForm.reset();

          // redirigir al login
          window.location.href = "login.html";

        } else {
          // ❌ ERROR CONTROLADO
          alert(data.error || "Error al registrar usuario");
        }

      } catch (error) {
        console.error("Error en registro:", error);
        alert("Error de conexión con el servidor");
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
/* ======================================================
   Salir panel Admin
======================================================*/
function logoutAdmin(){

localStorage.removeItem("token")

window.location.href="login.html"

}

/* ======================================================
   USUARIOS (DASHBOARD)
======================================================*/

async function cargarUsuarios() {

  const token = localStorage.getItem("token");

  // 🔐 validar token
  if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
    return;
  }

  try {

    const response = await fetch("https://frontend-digital-solutions.onrender.com/usuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    // 🚨 manejar errores del backend
    if (!response.ok) {
      throw new Error("Error al obtener usuarios (posible token inválido)");
    }

    const data = await response.json();

    const tbody = document.querySelector("#tablaUsuarios tbody");
    tbody.innerHTML = ""; // limpiar tabla antes de cargar

    // 📊 contadores
    let totalUsuarios = 0;
    let totalAdmins = 0;
    let totalClientes = 0;

    data.forEach(user => {

      const tr = document.createElement("tr");

      const rolTexto = user.rol === "admin" ? "Administrador" : "Cliente";

      // contar
      totalUsuarios++;

      if (user.rol === "admin") {
        totalAdmins++;
      } else {
        totalClientes++;
      }

      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>${rolTexto}</td>
        <td class="admin-actions">
          <button class="btn-edit" onclick="editarUsuario(${user.id}, '${user.nombre}', '${user.email}', '${user.rol}')">
            Editar
          </button>
          <button class="btn-delete" onclick="eliminarUsuario(${user.id})">
            Eliminar
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // 🧠 actualizar tarjetas
    document.getElementById("totalUsuarios").textContent = totalUsuarios;
    document.getElementById("totalAdmins").textContent = totalAdmins;
    document.getElementById("totalClientes").textContent = totalClientes;

  } catch (error) {

    console.error("Error cargando usuarios:", error);
    alert("Error al cargar usuarios");

  }
}

// 🚀 ejecutar automáticamente
document.addEventListener("DOMContentLoaded", cargarUsuarios);

/* ======================================================
   ELIMINAR USUARIOS
======================================================*/

async function eliminarUsuario(id) {

  const confirmar = confirm("¿Seguro que quieres eliminar este usuario?");
  if (!confirmar) return;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
    return;
  }

  try {

    const response = await fetch(`https://frontend-digital-solutions.onrender.com/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      throw new Error("Error al eliminar usuario");
    }

    const data = await response.json();

    alert(data.message);

    // 🔄 recargar lista sin refrescar toda la página
    cargarUsuarios();

  } catch (error) {

    console.error("Error eliminando usuario:", error);
    alert("No se pudo eliminar el usuario");

  }
}
/* ======================================================
   Modificar Usuarios
======================================================*/
function editarUsuario(id,nombre,email,rol){

const nuevoNombre = prompt("Editar nombre:",nombre)
const nuevoEmail = prompt("Editar email:",email)

if(!nuevoNombre || !nuevoEmail) return

const token = localStorage.getItem("token")

fetch(`http://127.0.0.1:5000/usuarios/${id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + token
},

body: JSON.stringify({
nombre:nuevoNombre,
email:nuevoEmail
})

})
.then(res=>res.json())
.then(data=>{

alert(data.message)
location.reload()

})

}