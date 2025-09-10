const STATE = { raw: [], view: [], catName: "" };

function InfoProducto(p) {
  return `
    <a href="product-info.html?pid=${encodeURIComponent(
      p.id
    )}" class="product-card">
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
}

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

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener el ID de la categoría desde localStorage
  let catID = localStorage.getItem("catID") || localStorage.getItem("selectedCategoryId");
  if (!catID) catID = "101";

  const base = "https://japceibal.github.io/emercado-api/cats_products/";
  const url = `${base}${encodeURIComponent(catID)}.json`;

  console.log("Cargando productos desde:", url);

  let result;
  try {
    result = await getJSONData(url);
  } catch (e) {
    console.error("Falló la petición:", e);
    const box = document.getElementById("productsList");
    if (box) {
      box.innerHTML = `<div class="no-results">No se pudieron cargar los productos.</div>`;
    }
    return;
  }

  if (result.status !== "ok") {
    console.error("Error al cargar productos:", result.data);
    const box = document.getElementById("productsList");
    if (box) {
      box.innerHTML = `<div class="no-results">No se pudieron cargar los productos.</div>`;
    }
    return;
  }

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

  const h2 = document.querySelector(".products h2, h2");
  if (h2) h2.textContent = STATE.catName;

  render(STATE.view);

  document.getElementById("AplicarFiltro")?.addEventListener("click", AplicarFiltro);

  document.getElementById("sortPriceAsc")?.addEventListener("click", () => {
    STATE.view.sort((a, b) => a.cost - b.cost);
    render(STATE.view);
  });

  document.getElementById("sortPriceDesc")?.addEventListener("click", () => {
    STATE.view.sort((a, b) => b.cost - a.cost);
    render(STATE.view);
  });

  document.getElementById("sortBySold")?.addEventListener("click", () => {
    STATE.view.sort((a, b) => b.soldCount - a.soldCount);
    render(STATE.view);
  });

  document.getElementById("maxPrice")?.addEventListener("input", (e) => {
    const label = document.getElementById("maxPriceValue");
    if (label) label.textContent = `USD ${parseInt(e.target.value).toLocaleString()}`;
  });

  document.getElementById("minSold")?.addEventListener("input", (e) => {
    const label = document.getElementById("minSoldValue");
    if (label) label.textContent = e.target.value;
  });
});