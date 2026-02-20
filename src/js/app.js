(function () {

  document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // PRODUCTOS
    // ===============================
    let productosGlobal = [];
    const contenedor = document.getElementById('productos');

    if (contenedor) {
      fetch('../src/data/productos.json')
        .then(response => response.json())
        .then(productos => {
          productosGlobal = productos;
          renderProductos(productosGlobal);
        })
        .catch(error => {
          console.error('Error cargando productos:', error);
        });
    }

    function renderProductos(lista) {
      

      lista.forEach(producto => {
        const article = document.createElement('article');

        let precioHTML = '';
        if (producto.oferta) {
          precioHTML = `
            <p><del>$${producto.precio.toLocaleString()}</del></p>
            <p><strong>$${producto.precioDescuento.toLocaleString()}</strong></p>
          `;
        } else {
          precioHTML = `<p>$${producto.precio.toLocaleString()}</p>`;
        }

        article.innerHTML = `
          <div class="img-container">
            <img 
              src="../src/assets/img/${producto.imagenes.front}" 
              data-front="../src/assets/img/${producto.imagenes.front}"
              data-back="../src/assets/img/${producto.imagenes.back}"
              alt="${producto.nombre}"
              class="producto-img"
            >
          </div>

          <p>${producto.nombre}</p>
          ${precioHTML}
          <button>Añadir al carrito</button>
        `;

        const img = article.querySelector('.producto-img');
        img.addEventListener('mouseenter', () => img.src = img.dataset.back);
        img.addEventListener('mouseleave', () => img.src = img.dataset.front);

        contenedor.appendChild(article);
      });
    }

    // ===============================
    // FILTRO POR MARCA
    // ===============================
    const botonesMarca = document.querySelectorAll('.marca-btn');

    if (botonesMarca.length > 0) {
      botonesMarca.forEach(btn => {
        btn.addEventListener('click', () => {
          botonesMarca.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const marca = btn.dataset.marca;
          const filtrados = productosGlobal.filter(p => p.marca === marca);
          renderProductos(filtrados);
        });
      });
    }

    // ===============================
    // SLIDER ECOSISTEMA
    // ===============================
    const slider = document.getElementById('slider');
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');

    if (slider && next && prev) {
      next.addEventListener('click', () => {
        slider.scrollLeft += 300;
      });

      prev.addEventListener('click', () => {
        slider.scrollLeft -= 300;
      });
    }

  });

})();
