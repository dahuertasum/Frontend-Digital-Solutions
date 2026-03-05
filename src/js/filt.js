document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("productsContainer");
    const brandFilter = document.getElementById("brandFilter");
    const priceFilter = document.getElementById("priceFilter");
    const searchInput = document.getElementById("searchInput");
  
    let productsData = [];
  
    // Cargar JSON
    fetch("../src/data/productos.json")
      .then(response => response.json())
      .then(data => {
        productsData = data;
        renderProducts(productsData);
      })
      .catch(error => console.error("Error al cargar productos:", error));
  
    // Renderizar productos respetando tu CSS
    function renderProducts(products) {
        productsContainer.innerHTML = "";
      
        if (products.length === 0) {
          productsContainer.innerHTML = "<p>No se encontraron productos.</p>";
          return;
        }
      
        products.forEach(product => {
          const precioActual = product.precioDescuento || product.precio;
          const precioAnterior = product.precioDescuento ? product.precio : null;
      
          const productHTML = `
            <div class="product">
              <div class="product-image-container">
                <img src="../src/assets/img/${product.imagenes.front}" alt="${product.nombre}" class="front" />
                <img src="../src/assets/img/${product.imagenes.back}" alt="${product.nombre}" class="back" />
              </div>
              <div class="product-text">
                <h3>${product.nombre}</h3>
                <p class="marca">Marca: ${product.marca}</p>
                <p>
                  ${precioAnterior ? `<span class="price-old">$${precioAnterior.toLocaleString()}</span>` : ""}
                  <span class="price price-new">$${precioActual.toLocaleString()}</span>
                </p>
                <button class="btn-add" type="button" data-id="${product.id}" data-title="${product.nombre}" data-price="${precioActual}" data-img="../src/assets/img/${product.imagenes.front}">Agregar</button>
              </div>
            </div>
          `;
      
          productsContainer.insertAdjacentHTML("beforeend", productHTML);
        });
      }
  
    // Función de filtrado (marca + precio + búsqueda)
    function filterProducts() {
      const brandValue = brandFilter.value.toLowerCase();
      const priceValue = priceFilter.value;
      const searchValue = searchInput.value.toLowerCase();
  
      const filtered = productsData.filter(product => {
        const productPrice = product.precioDescuento || product.precio;
  
        // Filtrar por marca
        const brandMatch = brandValue === "" || product.marca.toLowerCase() === brandValue;
  
        // Filtrar por precio
        let priceMatch = true;
        if (priceValue) {
          if (priceValue.includes("-")) {
            const [min, max] = priceValue.split("-");
            priceMatch = productPrice >= parseInt(min) && productPrice <= parseInt(max);
          } else {
            priceMatch = productPrice >= parseInt(priceValue);
          }
        }
  
        // Filtrar por búsqueda
        const searchMatch = product.nombre.toLowerCase().includes(searchValue);
  
        return brandMatch && priceMatch && searchMatch;
      });
  
      renderProducts(filtered);
    }
  
    // Eventos de filtrado automático
    brandFilter.addEventListener("change", filterProducts);
    priceFilter.addEventListener("change", filterProducts);
    searchInput.addEventListener("input", filterProducts);
  });