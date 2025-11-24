const STATE = { raw: [], view: [], catName: "" };

// Crea la estructura HTML para cada producto que se muestra en pantalla
function InfoProducto(p) {
  return `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.image}" alt="${
    p.name
  }" class="product-thumb" loading="lazy">
      <div class="product-info">
        <div class="product-head">
          <h3 class="product-title">${p.name}</h3>
          <span class="product-sold">${p.soldCount} vendidos</span>
        </div>
        <p class="product-desc">${p.description}</p>
        <div class="product-price">${p.currency ?? "USD"} ${p.cost}</div>
        <div class="btn">
          <button class="agregarCarrito" data-id="${
            p.id
          }">Agregar a carrito</button> 
        </div>
      </div>
    </div>
  `;
}

// Agrega un producto al carrito y lo guarda en localStorage
function agregarCarrito(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Revisa si el producto ya está en el carrito
  const existeProducto = cart.find((item) => item.id === product.id);

  if (existeProducto) {
    // Si ya está, solo aumenta la cantidad
    existeProducto.quantity += 1;
  } else {
    // Si no, lo agrega con cantidad 1
    cart.push({ ...product, quantity: 1 });
  }

  // Guarda el carrito actualizado
  localStorage.setItem("cart", JSON.stringify(cart));

  // Muestra una notificación de éxito
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `${product.name} agregado al carrito`,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
  actualizarBadge(); // Actualiza el contador del carrito
}

// Muestra la lista de productos en pantalla
function render(list) {
  const box = document.getElementById("productsList");
  if (!box) return;

  // Si no hay productos, muestra un mensaje vacío
  if (!list.length) {
    box.innerHTML = `<div class="no-results">No se encontraron productos con esos filtros.</div>`;
    return;
  }

  // Inserta los productos
  box.innerHTML = list.map(InfoProducto).join("");

  // Escucha el click de los botones “Agregar al carrito”
  document.querySelectorAll(".agregarCarrito").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que el click abra el detalle del producto
      e.preventDefault();

      const productId = e.target.dataset.id;
      const product = STATE.raw.find((p) => p.id == productId);

      if (product) agregarCarrito(product);
    });
  });

  // Escucha el click sobre la tarjeta del producto (para ver su detalle)
  guardarId();
}

// Guarda el ID del producto en localStorage cuando se hace clic
function guardarId() {
  const links = document.querySelectorAll(".product-card");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.id;
      localStorage.setItem("selectedProductId", productId);
      window.location.href = "product-info.html"; // redirige a la página del producto
    });
  });
}

// Aplica los filtros por precio y cantidad vendida
function aplicarFiltro() {
  const maxPrice = parseFloat(document.getElementById("maxPrice")?.value);
  const minSold = parseInt(document.getElementById("minSold")?.value, 10);

  STATE.view = STATE.raw.filter((p) => {
    const okPrice = isNaN(maxPrice) ? true : p.cost <= maxPrice;
    const okSold = isNaN(minSold) ? true : p.soldCount >= minSold;
    return okPrice && okSold;
  });

  render(STATE.view);
}

// Restaura los filtros a su estado inicial
function borrarFiltros() {
  const maxPriceInput = document.getElementById("maxPrice");
  const minSoldInput = document.getElementById("minSold");
  if (maxPriceInput) maxPriceInput.value = "";
  if (minSoldInput) minSoldInput.value = "";
  STATE.view = [...STATE.raw];
  render(STATE.view);
}

// Cuando carga la página, se ejecuta todo esto
document.addEventListener("DOMContentLoaded", async () => {
  // Obtiene el ID de la categoría desde localStorage
  let catID = localStorage.getItem("catID");
  const PRODUCTS_URL = `http://localhost:3000/data/cats_products/${catID}.json`;

  // Pide los productos desde la API
  const result = await getJSONData(PRODUCTS_URL);
  if (result.status !== "ok") {
    console.error("Error al cargar productos:", result.data);
    document.getElementById(
      "productsList"
    ).innerHTML = `<div class="no-results">No se pudieron cargar los productos.</div>`;
    return;
  }

  // Guarda los datos en el estado general
  const { catName, products } = result.data;
  STATE.catName = catName || "Categoría";
  STATE.raw = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    cost: p.cost,
    currency: p.currency,
    soldCount: p.soldCount,
    image: p.image,
  }));

  STATE.view = [...STATE.raw];

  // Captura los elementos del DOM relacionados con filtros
  const maxPriceInput = document.getElementById("maxPrice");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceSpan = document.getElementById("maxPriceVal");
  const minPriceSpan = document.getElementById("minPriceVal");
  const minSoldInput = document.getElementById("minSold");
  const minSoldSpan = document.getElementById("minSoldVal");

  // Calcula precios y ventas máximos/mínimos
  const prices = STATE.raw.map((p) => p.cost);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  const soldCounts = STATE.raw.map((p) => p.soldCount);
  const maxSold = Math.max(...soldCounts);

  // Configura sliders SOLO si existen
  if (maxPriceInput && maxPriceSpan) {
    maxPriceInput.max = maxPrice;
    maxPriceInput.value = maxPrice;
    maxPriceSpan.textContent = maxPrice;

    maxPriceInput.addEventListener("input", () => {
      maxPriceSpan.textContent = maxPriceInput.value;
    });
  }

  if (minPriceInput && minPriceSpan) {
    minPriceInput.max = maxPrice;
    minPriceInput.min = 0;
    minPriceInput.value = 0;
    minPriceSpan.textContent = 0;

    minPriceInput.addEventListener("input", () => {
      minPriceSpan.textContent = minPriceInput.value;
    });
  }

  if (minSoldInput && minSoldSpan) {
    minSoldInput.min = 0;
    minSoldInput.max = maxSold;
    minSoldInput.value = 0;
    minSoldSpan.textContent = minSoldInput.value;

    minSoldInput.addEventListener("input", () => {
      minSoldSpan.textContent = minSoldInput.value;
    });
  }

  // Cambia el título de la categoría si hace falta
  const h2 = document.querySelector(".products h2, h2");
  if (h2 && h2.textContent.trim().toLowerCase() === "autos") {
    h2.textContent = STATE.catName;
  }

  // Muestra los productos
  render(STATE.view);

  // Aplica filtros al hacer clic en el botón (solo si existe el botón)
  const applyBtn = document.getElementById("aplicarFiltro");
  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const maxPriceVal = parseFloat(maxPriceInput?.value);
      const minPriceVal = parseFloat(minPriceInput?.value);
      const minSoldVal = parseInt(
        document.getElementById("minSold")?.value,
        10
      );

      STATE.view = STATE.raw.filter((p) => {
        const okMax = isNaN(maxPriceVal) ? true : p.cost <= maxPriceVal;
        const okMin = isNaN(minPriceVal) ? true : p.cost >= minPriceVal;
        const okSold = isNaN(minSoldVal) ? true : p.soldCount >= minSoldVal;
        return okMax && okMin && okSold;
      });

      render(STATE.view);
    });
  }

  // Botones para ordenar productos (solo existen en products.html)
  const btnAsc = document.getElementById("sortPriceAsc");
  if (btnAsc) {
    btnAsc.addEventListener("click", () => {
      STATE.view.sort((a, b) => a.cost - b.cost);
      render(STATE.view);
    });
  }

  const btnDesc = document.getElementById("sortPriceDesc");
  if (btnDesc) {
    btnDesc.addEventListener("click", () => {
      STATE.view.sort((a, b) => b.cost - a.cost);
      render(STATE.view);
    });
  }

  const btnSold = document.getElementById("sortBySold");
  if (btnSold) {
    btnSold.addEventListener("click", () => {
      STATE.view.sort((a, b) => b.soldCount - a.soldCount);
      render(STATE.view);
    });
  }

  // Botón para limpiar todos los filtros
  document.getElementById("deleteFilters")?.addEventListener("click", () => {
    if (maxPriceInput) {
      maxPriceInput.value = maxPrice;
      maxPriceSpan.textContent = maxPrice;
    }
    if (minPriceInput) {
      minPriceInput.value = 0;
      minPriceSpan.textContent = 0;
    }
    if (minSoldSpan) {
      minSoldSpan.value = 0;
      minSoldSpan.textContent = 0;
    }

    document.getElementById("minSold").value = 0;

    STATE.view = [...STATE.raw];
    render(STATE.view);
  });

  // Filtro global de búsqueda (por nombre o descripción)
  function filtrarPorBusquedaGlobal() {
    const query =
      document.querySelector(".search-input")?.value.toLowerCase() || "";
    STATE.view = STATE.raw.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
    render(STATE.view);
  }

  // Detecta cuando el usuario escribe en la barra de búsqueda
  document
    .querySelector(".search-input")
    ?.addEventListener("input", filtrarPorBusquedaGlobal);
});
