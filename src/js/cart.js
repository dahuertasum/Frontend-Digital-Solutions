// CARRITO DE COMPRAS

let productsArray = [];

document.addEventListener('DOMContentLoaded', function () {

    const btn = document.querySelector('#cart');
    const caja = document.querySelector('#caja');
    const productos = document.querySelector('#productos');
    const contentProducts = document.querySelector('#contentProducts');

    if (btn && caja && contentProducts) {
        btn.addEventListener('click', () => {
            caja.classList.toggle('caja');
        })
    }

    if (productos) {
        productos.addEventListener('click', getDataElements);
    }
});



function updateCartCount() {
    const cartCount = document.querySelector('#cartCount');
    cartCount.textContent = productsArray.length;
}

function updateTotal() {
    const total = document.querySelector('#total');
    let totalProduct = productsArray.reduce((total, prod) => total + prod.price * prod.quantity, 0);
    total.textContent = totalProduct.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    });
}

function getDataElements(event) {
    if (event.target.classList.contains('btn-add')) {
        const elementHtml = event.target.parentElement.parentElement;
        selectData(elementHtml);
    };
}

function selectData(product) {
    const productObj = {
        img: product.querySelector('img').src,
        title: product.querySelector('p').textContent,
        price: parseFloat(product.querySelector('.price').textContent.replace('$', '')),
        id: parseInt(product.querySelector('button[type="button"]').dataset.id, 10),
        quantity: 1
    }

    const exists = productsArray.some(prod => prod.id === productObj.id);

    if (exists) {
        showAlert('El producto ya existe en el carrito', 'error');
        return;
    }

    productsArray = [...productsArray, productObj];
    showAlert('✅ Producto agregado correctamente', 'sucess');
    productsHtml();
    updateCartCount();
    updateTotal();
}

function productsHtml() {

    contentProducts.innerHTML = "";

    if (productsArray.length === 0) {
        contentProducts.innerHTML = `
        <tr>
            <td class="message" colspan="5">
                 No hay productos agregados
            </td>
        </tr>
    `;
        return;
    }

    productsArray.forEach(prod => {
        const { img, title, price, quantity, id } = prod;

        const tr = document.createElement('tr');

        const tdImg = document.createElement('td');
        const prodImg = document.createElement('img');
        prodImg.src = img;
        prodImg.className = 'producto-cont';
        prodImg.alt = 'imagen producto';
        tdImg.appendChild(prodImg);


        const tdTitle = document.createElement('td');
        const prodTittle = document.createElement('p');
        prodTittle.className = 'producto-cont';
        prodTittle.textContent = title;
        tdTitle.appendChild(prodTittle);

        const tdPrice = document.createElement('td');
        const prodPrice = document.createElement('p');
        const priceNumber = Number(price);
        prodPrice.textContent = priceNumber.toLocaleString('es-CO');
        prodPrice.className = 'producto-cont';
        tdPrice.appendChild(prodPrice);

        const tdQuantity = document.createElement('td');
        const prodQuantity = document.createElement('input');
        prodQuantity.type = 'number';
        prodQuantity.min = '1';
        prodQuantity.className = 'cont';
        prodQuantity.value = quantity;
        prodQuantity.dataset.id = id;
        prodQuantity.oninput = updateQuantity;
        tdQuantity.appendChild(prodQuantity);

        const tdDelete = document.createElement('td');
        const prodDelete = document.createElement('i');
        prodDelete.type = 'button';
        prodDelete.className = 'fa-solid fa-delete-left';

        prodDelete.dataset.id = id;
        prodDelete.addEventListener('click', (e) => {

            const productId = e.target.dataset.id;

            // Filtramos el array quitando el producto
            productsArray = productsArray.filter(prod => prod.id != productId);

            // Volvemos a pintar el carrito
            productsHtml();
            updateCartCount();
            updateTotal();
        });

        tdDelete.appendChild(prodDelete);

        tr.append(tdImg, tdTitle, tdPrice, tdQuantity, tdDelete);

        contentProducts.appendChild(tr);

    });
}

function updateQuantity(e) {
    const newQuantity = parseInt(e.target.value, 10);
    const idProd = parseInt(e.target.dataset.id, 10);

    const product = productsArray.find(prod => prod.id === idProd);
    if (product && newQuantity > 0) {
        product.quantity = newQuantity;
    }
    productsHtml();
    updateTotal();
}

function showAlert(message, type) {
    const noRepeatAlert = document.querySelector('.alerta');
    if (noRepeatAlert) {
        noRepeatAlert.remove();
    }

    const div = document.createElement('div');
    div.id = 'alerta';
    div.classList.add('alerta', type);
    div.textContent = message;

    document.body.appendChild(div);

    setTimeout(() => {
        div.style.opacity = "0";
    }, 2500);

    setTimeout(() => {
        div.remove();
    }, 3000);
}
