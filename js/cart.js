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
 * calcula envío basado en el porcentaje seleccionado,
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

  // Obtener el porcentaje de envío seleccionado
  const envioSeleccionado = document.querySelector(
    'input[name="envio"]:checked'
  );
  const porcentajeEnvio = envioSeleccionado
    ? parseFloat(envioSeleccionado.value)
    : 0.15; // Default a 15% si no hay selección
  const costoEnvio = subtotal * porcentajeEnvio;

  const subtotalEl = document.getElementById("subtotalValue");
  const shippingEl = document.getElementById("shippingValue");
  const totalEl = document.getElementById("totalValue");

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = formatPrice(costoEnvio);
  if (totalEl) totalEl.textContent = formatPrice(subtotal + costoEnvio);
}

/* Helpers para localStorage */
function cargarCarrito() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}
function guardarCarrito(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* MOSTRAR PRODUCTOS DEL LOCALSTORAGE */
function mostrarProductosDelLocalStorage() {
  const container = document.querySelector(".cart-cartas"); // Cambiado
  if (!container) return;

  const cart = cargarCarrito();

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-msg">No hay ningún producto cargado en el carrito.</p>`;
    actualizarResumen();
    return;
  }

  container.innerHTML = cart
    .map(
      (p) => `
      <div class="cart-item" data-id="${p.id}">
        <img src="${p.image || "img/no-image.png"}" alt="${
        p.name
      }" class="cart-thumb">

        <div class="item-info">
          <div class="item-datalles">
            <h3>${p.name}</h3>
            
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
  inicializarControlesDeCantidad();
}

function inicializarControlesDeCantidad() {
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
        const cart = cargarCarrito();
        const prod = cart.find((x) => String(x.id) === String(id));
        if (prod) {
          prod.quantity = q;
          guardarCarrito(cart);
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
        const cart = cargarCarrito();
        const prod = cart.find((x) => String(x.id) === String(id));
        if (prod) {
          prod.quantity = q;
          guardarCarrito(cart);
        }
        actualizarResumen();
      });
    }

    if (btnE) {
      btnE.addEventListener("click", () => {
        // Eliminar del DOM y de localStorage
        let cart = cargarCarrito();
        cart = cart.filter((x) => String(x.id) !== String(id));
        guardarCarrito(cart);
        // Volver a renderizar lista
        mostrarProductosDelLocalStorage();
        actualizarResumen();
      });
    }
  });

  actualizarResumen();
}

// Función para validar y finalizar compra
function finalizarCompra() {
  const cart = cargarCarrito();
  if (cart.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Carrito vacío",
      text: "No hay productos en el carrito para finalizar la compra.",
    });
    return;
  }

  // Validar dirección de envío
  const departamento = document.getElementById("departamento").value.trim();
  const localidad = document.getElementById("localidad").value.trim();
  const calle = document.getElementById("calle").value.trim();
  const numero = document.getElementById("numero").value;
  const esquina = document.getElementById("esquina").value.trim();

  if (!departamento || !localidad || !calle || !numero || !esquina) {
    Swal.fire({
      icon: "warning",
      title: "Información incompleta",
      text: "Por favor, complete todos los campos de la dirección de envío.",
    });
    return;
  }

  // Validar forma de pago
  const pagoSeleccionado = document.querySelector('input[name="pago"]:checked');
  if (!pagoSeleccionado) {
    Swal.fire({
      icon: "warning",
      title: "Forma de pago no seleccionada",
      text: "Por favor, seleccione una forma de pago.",
    });
    return;
  }

  // Si todo está bien, mostrar confirmación
  const totalEl = document.getElementById("totalValue");
  const total = totalEl ? totalEl.textContent : "$ 0";

  Swal.fire({
    icon: "success",
    title: "Compra finalizada",
    text: `Su compra por ${total} ha sido procesada exitosamente.`,
    confirmButtonText: "Aceptar",
  }).then(() => {
    // Limpiar carrito y redirigir al inicio para comenzar otra vez las compras
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarProductosDelLocalStorage(); // Se ejecuta al cargar la página

  document.querySelectorAll('input[name="envio"]').forEach((radio) => {
    radio.addEventListener("change", actualizarResumen);
  });

  const btnFinalizar = document.querySelector(".finalizar-compra");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", finalizarCompra);
  }
});
