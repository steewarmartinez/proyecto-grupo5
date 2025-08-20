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
            <button>Agregar a carrito</button>
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
  STATE.view = [...STATE.raw];

  const h2 = document.querySelector(".products h2, h2");
  if (h2 && h2.textContent.trim().toLowerCase() === "autos")
    h2.textContent = STATE.catName;

  render(STATE.view);

  const applyBtn = document.getElementById("AplicarFiltro");
  applyBtn?.addEventListener("click", AplicarFiltro);
});

const usuario = localStorage.getItem("usuario");
const loginLink = document.getElementById("login-link");
if (usuario && loginLink) {
  loginLink.textContent = usuario;
  loginLink.href = "#";
}
