<<<<<<< Updated upstream
const usuario = localStorage.getItem("usuario");
const loginLink = document.getElementById("login-link");
if (usuario && loginLink) {
  loginLink.textContent = usuario;
  loginLink.href = "#";
=======
document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Leer el ID del producto desde localStorage
  const productId = localStorage.getItem("selectedProductId");

  if (!productId) {
    document.getElementById("product-container").innerHTML =
      "<p>No se seleccionó producto.</p>";
    return;
  }

  // 2️⃣ Construir la URL del API
  const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la petición");
    const product = await response.json();

    mostrarProducto(product);
  } catch (error) {
    console.error("Error al cargar producto:", error);
    document.getElementById("product-container").innerHTML =
      "<p>Error al cargar el producto.</p>";
  }
});

function mostrarProducto(product) {
  // Crear HTML de las imágenes
  const imagenesHTML = product.images
    .map(
      (img) =>
        `<div class="col-md-3 mb-2"><img src="${img}" class="img-fluid rounded" alt="${product.name}"></div>`
    )
    .join("");

  // HTML principal
  const html = `
    <div class="row">
      <div class="col-md-8">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
        <p><strong>Categoría:</strong> ${product.category}</p>
        <p><strong>Vendidos:</strong> ${product.soldCount}</p>
      </div>
    </div>
    <hr>
    <h4>Imágenes del producto</h4>
    <div class="row">
      ${imagenesHTML}
    </div>
  `;

  document.getElementById("product-container").innerHTML = html;
>>>>>>> Stashed changes
}