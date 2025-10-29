function parsePriceText(text) {
  if (!text) return 0;
  const onlyDigits = text.replace(/[^\d\-.,]/g, "").replace(/\./g, "");
  const n = parseInt(onlyDigits, 10);
  return isNaN(n) ? 0 : n;
}

function formatPrice(num) {
  return `$ ${Number(num).toLocaleString("es-ES")}`;
}

/**
 * Recalcula subtotal sumando (precio * cantidad) de cada item,
 * actualiza subtotal, envío y total en la sección de resumen.
 */
function actualizarResumen() {
  const items = document.querySelectorAll(".cart-item");
  let subtotal = 0;

  items.forEach((item) => {
    const priceEl = item.querySelector(".precio");
    const qtyEl = item.querySelector(".cantidad");
    const price = priceEl
      ? parseInt(
          priceEl.dataset.price || parsePriceText(priceEl.textContent),
          10
        )
      : 0;
    const qty = qtyEl
      ? parseInt(qtyEl.dataset.qty || qtyEl.textContent, 10)
      : 1;
    subtotal += price * (isNaN(qty) ? 1 : qty);
  });

  const tarjeta = document.querySelector(".tarjeta-resumen");
  const shipping = tarjeta ? parseInt(tarjeta.dataset.shipping || 0, 10) : 0;

  const subtotalEl = document.getElementById("subtotalValue");
  const shippingEl = document.getElementById("shippingValue");
  const totalEl = document.getElementById("totalValue");

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = formatPrice(shipping);
  if (totalEl) totalEl.textContent = formatPrice(subtotal + shipping);
}

/* Helpers para localStorage */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* MOSTRAR PRODUCTOS DEL LOCALSTORAGE */
function mostrarProductosDelLocalStorage() {
  const container = document.querySelector(".cart-cartas"); // Cambiado
  if (!container) return;

  const cart = loadCart();

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-msg">No hay ningún producto cargado en el carrito.</p>`;
    actualizarResumen();
    return;
  }

  container.innerHTML = cart
    .map(
      (p) => `
      <div class="cart-item" data-id="${p.id}">
        <img src="${p.image || 'img/no-image.png'}" alt="${p.name}" class="cart-thumb">

        <div class="item-info">
          <div class="item-datalles">
            <h3>${p.name}</h3>
            <p class="nombre-tienda">Cliente</p>
            
            <div class="controles-cantidad">
              <button class="btn btn-sm btn-disminuir">-</button>
              <span class="cantidad" data-qty="${p.quantity}">${
        p.quantity
      }</span>
              <button class="btn btn-sm btn-aumentar">+</button>
            </div>
          </div>
        </div>

        <div class="precio-item">
                <span class="precio" data-price="${p.cost}">${p.currency} ${
        p.cost
      }</span>
                <button class="btn btn-sm btn-eliminar">Eliminar</button>
              </div>
      </div>`
    )
    .join("");

  // Inicializamos los botones **después** de renderizar los productos
  initQuantityControls();
}

function initQuantityControls() {
  document.querySelectorAll(".cart-item").forEach((item) => {
    const btnA = item.querySelector(".btn-aumentar");
    const btnD = item.querySelector(".btn-disminuir");
    const btnE = item.querySelector(".btn-eliminar");
    const qtyEl = item.querySelector(".cantidad");
    const id = item.dataset.id;

    if (qtyEl && !qtyEl.dataset.qty)
      qtyEl.dataset.qty = parseInt(qtyEl.textContent, 10) || 1;

    if (btnA) {
      btnA.addEventListener("click", () => {
        if (!qtyEl) return;
        let q = parseInt(qtyEl.dataset.qty, 10) || 0;
        q++;
        qtyEl.dataset.qty = q;
        qtyEl.textContent = q;
        // Persistir cambio en localStorage
        const cart = loadCart();
        const prod = cart.find((x) => String(x.id) === String(id));
        if (prod) {
          prod.quantity = q;
          saveCart(cart);
        }
        actualizarResumen();
      });
    }

    if (btnD) {
      btnD.addEventListener("click", () => {
        if (!qtyEl) return;
        let q = parseInt(qtyEl.dataset.qty, 10) || 0;
        q = Math.max(1, q - 1);
        qtyEl.dataset.qty = q;
        qtyEl.textContent = q;
        // Persistir cambio en localStorage
        const cart = loadCart();
        const prod = cart.find((x) => String(x.id) === String(id));
        if (prod) {
          prod.quantity = q;
          saveCart(cart);
        }
        actualizarResumen();
      });
    }

    if (btnE) {
      btnE.addEventListener("click", () => {
        // Eliminar del DOM y de localStorage
        let cart = loadCart();
        cart = cart.filter((x) => String(x.id) !== String(id));
        saveCart(cart);
        // Volver a renderizar lista
        mostrarProductosDelLocalStorage();
        actualizarResumen();
      });
    }
  });

  actualizarResumen();
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarProductosDelLocalStorage(); // Se ejecuta al cargar la página
});
