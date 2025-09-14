const STATE = { raw: [], view: [], catName: "" };

// Genera la tarjeta HTML de cada producto
function InfoProducto(p) {
<<<<<<< Updated upstream
    return `
    <a href="product-info.html?pid=${encodeURIComponent(
        p.id
    )}" class="product-card">
      <img src="${p.image}" alt="${p.name
        }" class="product-thumb" loading="lazy">
=======
  return `
<a href="product-info.html" class="product-card">
      <img src="${p.image}" alt="${
    p.name
  }" class="product-thumb" loading="lazy">
>>>>>>> Stashed changes
      <div class="product-info">
        <div class="product-head">
          <h3 class="product-title">${p.name}</h3>
          <span class="product-sold">${p.soldCount} vendidos</span>
        </div>
        <p class="product-desc">${p.description}</p>
        <div class="product-price">${p.currency ?? "USD"} ${p.cost}</div>
        <div class="btn">
            <button (click)="addToCart(product)">Agregar a carrito</button>
        </div>
      </div>
    </a>
  `;
}

// Renderiza la lista de productos en el contenedor
function render(list) {
    const box = document.getElementById("productsList");
    if (!box) return;

<<<<<<< Updated upstream
    if (!list.length) {
        box.innerHTML = `<div class="no-results">No se encontraron productos con esos filtros.</div>`;
        return;
    }
    box.innerHTML = list.map(InfoProducto).join("");
=======
  if (!list.length) {
    box.innerHTML = `<div class="no-results">No se encontraron productos con esos filtros.</div>`;
    return;
  }

  // Genera el HTML de las tarjetas y lo inserta
  box.innerHTML = list.map(InfoProducto).join("");

  // Llama a addProductListeners para asignar eventos a las tarjetas
  addProductListeners();
>>>>>>> Stashed changes
}

// Agrega el evento de click a cada tarjeta de producto
function addProductListeners() {
  const links = document.querySelectorAll(".product-card");
  links.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // evita navegación inmediata
      localStorage.setItem("selectedProductId", STATE.view[index].id); // guarda el ID seleccionado
      window.location.href = link.href; // luego navega
    });
  });
}

// Aplica filtros básicos de precio máximo y cantidad mínima vendida
function AplicarFiltro() {
<<<<<<< Updated upstream
    const maxPrice = parseFloat(document.getElementById("maxPrice")?.value);
    const minSold = parseInt(document.getElementById("minSold")?.value, 10);
=======
  const maxPrice = parseFloat(document.getElementById("maxPrice")?.value);
  const minSold = parseInt(document.getElementById("minSold")?.value, 10);

  STATE.view = STATE.raw.filter((p) => {
    const okPrice = isNaN(maxPrice) ? true : p.cost <= maxPrice;
    const okSold = isNaN(minSold) ? true : p.soldCount >= minSold;
    return okPrice && okSold;
  });

  render(STATE.view);
}

// Resetea filtros y vuelve a mostrar todos los productos
function BorrarFiltros() {
  const maxPriceInput = document.getElementById("maxPrice");
  const minSoldInput = document.getElementById("minSold");
  if (maxPriceInput) maxPriceInput.value = "";
  if (minSoldInput) minSoldInput.value = "";
  STATE.view = [...STATE.raw];
  render(STATE.view);
}

// Listener principal cuando el DOM se carga
document.addEventListener("DOMContentLoaded", async () => {
  // Obtener ID de categoría y construir URL dinámica
  let catID = localStorage.getItem("catID");
  const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  // Petición de productos
  const result = await getJSONData(PRODUCTS_URL);
  if (result.status !== "ok") {
    console.error("Error al cargar productos:", result.data);
    document.getElementById(
      "productsList"
    ).innerHTML = `<div class="no-results">No se pudieron cargar los productos.</div>`;
    return;
  }

  // Guardar información en STATE
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

  // Elementos del DOM para filtros y sliders
  const maxPriceInput = document.getElementById("maxPrice");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceSpan = document.getElementById("maxPriceVal");
  const minPriceSpan = document.getElementById("minPriceVal");
  const minSoldInput = document.getElementById("minSold");
  const minSoldSpan = document.getElementById("minSoldVal");

  // Calcular valores máximos y mínimos
  const prices = STATE.raw.map((p) => p.cost);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  const soldCounts = STATE.raw.map((p) => p.soldCount);
  const maxSold = Math.max(...soldCounts);

  // Configurar sliders con valores iniciales
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
    minSoldSpan.textContent = minSoldInput.value;
    minSoldInput.addEventListener("input", () => {
      minSoldSpan.textContent = minSoldInput.value;
    });
  }

  // Actualizar título de categoría
  const h2 = document.querySelector(".products h2, h2");
  if (h2 && h2.textContent.trim().toLowerCase() === "autos")
    h2.textContent = STATE.catName;

  // Renderizar productos inicialmente
  render(STATE.view);

  // Aplicar filtros al hacer click
  const applyBtn = document.getElementById("AplicarFiltro");
  applyBtn?.addEventListener("click", () => {
    const maxPriceVal = parseFloat(maxPriceInput?.value);
    const minPriceVal = parseFloat(minPriceInput?.value);
    const minSoldVal = parseInt(document.getElementById("minSold")?.value, 10);
>>>>>>> Stashed changes

    STATE.view = STATE.raw.filter((p) => {
        const okPrice = isNaN(maxPrice) ? true : p.cost <= maxPrice;
        const okSold = isNaN(minSold) ? true : p.soldCount >= minSold;
        return okPrice && okSold;
    });

    render(STATE.view);
<<<<<<< Updated upstream
}

document.addEventListener("DOMContentLoaded", async () => {
    //  Para traer los productos del Json 101
    const result = await getJSONData(PRODUCTS_URL);
    if (result.status !== "ok") {
        console.error("Error al cargar productos:", result.data);
        document.getElementById(
            "productsList"
        ).innerHTML = `<div class="no-results">No se pudieron cargar los productos.</div>`;
        return;
    }

    const { catName, products } = result.data;
    STATE.catName = catName || "Autos";
    STATE.raw = products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        cost: p.cost,
        currency: p.currency,
        soldCount: p.soldCount,
        image: p.image,
    }));
=======
  });

  // Ordenar por precio ascendente
  document.getElementById("sortPriceAsc").addEventListener("click", () => {
    STATE.view.sort((a, b) => a.cost - b.cost);
    render(STATE.view);
  });
  // Ordenar por precio descendente
  document.getElementById("sortPriceDesc").addEventListener("click", () => {
    STATE.view.sort((a, b) => b.cost - a.cost);
    render(STATE.view);
  });
  // Ordenar por vendidos
  document.getElementById("sortBySold").addEventListener("click", () => {
    STATE.view.sort((a, b) => b.soldCount - a.soldCount);
    render(STATE.view);
  });

  // Borrar filtros y resetear
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
>>>>>>> Stashed changes
    STATE.view = [...STATE.raw];

    const h2 = document.querySelector(".products h2, h2");
    if (h2 && h2.textContent.trim().toLowerCase() === "autos")
        h2.textContent = STATE.catName;

    render(STATE.view);
<<<<<<< Updated upstream

    const applyBtn = document.getElementById("AplicarFiltro");
    applyBtn?.addEventListener("click", AplicarFiltro);
});

const usuario = localStorage.getItem("usuario");
const loginLink = document.getElementById("login-link");
if (usuario && loginLink) {
  loginLink.textContent = usuario;
  loginLink.href = "#";
}
=======
  });
});
>>>>>>> Stashed changes
