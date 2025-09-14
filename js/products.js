const STATE = { raw: [], view: [], catName: "" };

function InfoProducto(p) {
  return `
    <a href="product-info.html?pid=${encodeURIComponent(
      p.id
    )}" class="product-card" data-id="${p.id}">
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
            <button class="addToCart">Agregar a carrito</button> 
        </div>
      </div>
    </a>
  `;
}

function render(list) {
  const box = document.getElementById("productsList");
  if (!box) return;

  if (!list.length) {
    box.innerHTML = `<div class="no-results">No se encontraron productos con esos filtros.</div>`;
    return;
  }
  box.innerHTML = list.map(InfoProducto).join("");

  // 🔹 Añadimos los listeners para guardar el ID en localStorage
  addProductListeners();
}

// ✅ Nueva función: guardar ID al hacer clic
function addProductListeners() {
  const links = document.querySelectorAll(".product-card");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = link.dataset.id;
      localStorage.setItem("selectedProductId", productId);
      window.location.href = link.href; // Redirige luego de guardar
    });
  });
}

// (El resto de tu código queda igual: filtros, ordenamiento, etc.)

function AplicarFiltro() {
  const maxPrice = parseFloat(document.getElementById("maxPrice")?.value);
  const minSold = parseInt(document.getElementById("minSold")?.value, 10);

  STATE.view = STATE.raw.filter((p) => {
    const okPrice = isNaN(maxPrice) ? true : p.cost <= maxPrice;
    const okSold = isNaN(minSold) ? true : p.soldCount >= minSold;
    return okPrice && okSold;
  });

  render(STATE.view);
}

function BorrarFiltros() {
  const maxPriceInput = document.getElementById("maxPrice");
  const minSoldInput = document.getElementById("minSold");
  if (maxPriceInput) maxPriceInput.value = "";
  if (minSoldInput) minSoldInput.value = "";
  STATE.view = [...STATE.raw];
  render(STATE.view);
}

// Luego agregas un listener al botón de borrar filtros

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Obtener el ID de la categoría desde localStorage
  let catID = localStorage.getItem("catID");
  // 2. Construir la URL dinámica
  const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  // 3. Hacer la petición
  const result = await getJSONData(PRODUCTS_URL);
  if (result.status !== "ok") {
    console.error("Error al cargar productos:", result.data);
    document.getElementById(
      "productsList"
    ).innerHTML = `<div class="no-results">No se pudieron cargar los productos.</div>`;
    return;
  }

  // 4. Guardar en tu STATE
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

  // (acá después seguís con tu lógica de renderizado)

  STATE.view = [...STATE.raw];

  const maxPriceInput = document.getElementById("maxPrice");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceSpan = document.getElementById("maxPriceVal");
  const minPriceSpan = document.getElementById("minPriceVal");
  const minSoldInput = document.getElementById("minSold");
  const minSoldSpan = document.getElementById("minSoldVal");

  const prices = STATE.raw.map((p) => p.cost);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  const soldCounts = STATE.raw.map((p) => p.soldCount);
  const maxSold = Math.max(...soldCounts);

  // Configurar sliders con valores reales
  if (maxPriceInput) {
    maxPriceInput.max = maxPrice;
    maxPriceInput.value = maxPrice;
    maxPriceSpan.textContent = maxPrice;
  }

  if (minPriceInput) {
    minPriceInput.max = maxPrice;
    minPriceInput.min = 0;
    minPriceInput.value = 0;
    minPriceSpan.textContent = 0;
  }

  if (minSoldInput) {
    minSoldInput.min = 0;
    minSoldInput.max = maxSold;
    minSoldInput.value = 0;
  }

  if (maxPriceSpan) maxPriceSpan.textContent = maxPriceInput.value;
  if (minPriceSpan) minPriceSpan.textContent = minPriceInput.value;
  if (minSoldSpan) minSoldSpan.textContent = minSoldInput.value;

  // Actualizar valores en tiempo real
  maxPriceInput.addEventListener("input", () => {
    maxPriceSpan.textContent = maxPriceInput.value;
  });
  minPriceInput.addEventListener("input", () => {
    minPriceSpan.textContent = minPriceInput.value;
  });

  if (minSoldInput && minSoldSpan) {
    minSoldSpan.textContent = minSoldInput.value; // mostrar valor inicial

    // actualizar valor en tiempo real
    minSoldInput.addEventListener("input", () => {
      minSoldSpan.textContent = minSoldInput.value;
    });
  }

  const h2 = document.querySelector(".products h2, h2");
  if (h2 && h2.textContent.trim().toLowerCase() === "autos")
    h2.textContent = STATE.catName;

  render(STATE.view);

  const applyBtn = document.getElementById("AplicarFiltro");
  applyBtn?.addEventListener("click", () => {
    const maxPriceVal = parseFloat(maxPriceInput?.value);
    const minPriceVal = parseFloat(minPriceInput?.value);
    const minSoldVal = parseInt(document.getElementById("minSold")?.value, 10);

    STATE.view = STATE.raw.filter((p) => {
      const okMax = isNaN(maxPriceVal) ? true : p.cost <= maxPriceVal;
      const okMin = isNaN(minPriceVal) ? true : p.cost >= minPriceVal;
      const okSold = isNaN(minSoldVal) ? true : p.soldCount >= minSoldVal;
      return okMax && okMin && okSold;
    });

    render(STATE.view);
  });
  /*Aplica los filtros a los productos*/

  /* Ordena del mas barato al mas caro */
  document.getElementById("sortPriceAsc").addEventListener("click", () => {
    STATE.view.sort((a, b) => a.cost - b.cost);
    render(STATE.view);
  });
  /* Ordena del mas caro al mas barato */
  document.getElementById("sortPriceDesc").addEventListener("click", () => {
    STATE.view.sort((a, b) => b.cost - a.cost);
    render(STATE.view);
  });
  /* Ordena del mas vendio al menos vendido */
  document.getElementById("sortBySold").addEventListener("click", () => {
    STATE.view.sort((a, b) => b.soldCount - a.soldCount);
    render(STATE.view);
  });

  // Para borrar los filtros
  document.getElementById("deleteFilters")?.addEventListener("click", () => {
    // Resetear inputs a valores calculados
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
});
