document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Leer el ID del producto desde localStorage
  const productId = localStorage.getItem("selectedProductId");

  if (!productId) {
    document.getElementById("producto-container").innerHTML =
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
    document.getElementById("producto-container").innerHTML =
      "<p>Error al cargar el producto.</p>";
  }
});

function mostrarProducto(product) {
  const galeriaDiv = document.getElementById("galeria-imagenes");
  const descDiv = document.getElementById("descripcion");
  const miniaturasDiv = document.getElementById("muestra-imagenes");

  // Galería principal
  galeriaDiv.innerHTML = product.images
    .map((img) => `<div><img src="${img}" alt="${product.name}"></div>`)
    .join("");

  // Miniaturas
  miniaturasDiv.innerHTML = product.images
    .map(

      (img, i) =>
        `<img src="${img}" class="miniatura" data-index="${i}" alt="${product.name}">`
    )
    .join("");

  // Descripción
  descDiv.innerHTML = `
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <p><strong>Precio:</strong> <span class="product-price"> ${product.currency} ${product.cost} </span></p>
    <p><strong>Categoría:</strong> <span class="product-desc">${product.category} </span></p>
    <p><strong>Vendidos:</strong> <span class="product-sold"> ${product.soldCount} </span></p>
    <div class="boton-agregarCarrito">
              <button class="agregarCarrito">Agregar a carrito</button>
            </div>
  `;

  // Carrusel
  let index = 0;
  const slides = galeriaDiv.children;
  const total = slides.length;

  function showSlide(i) {
    galeriaDiv.style.transform = `translateX(-${i * 100}%)`;
    document.querySelectorAll(".miniatura").forEach((m, j) => {
      m.style.border = j === i ? "2px solid black" : "none";
    });
  }

  document.getElementById("prev").onclick = () => {
    index = (index - 1 + total) % total;
    showSlide(index);
  };

  document.getElementById("next").onclick = () => {
    index = (index + 1) % total;
    showSlide(index);
  };

  document.querySelectorAll(".miniatura").forEach((thumb) => {
    thumb.onclick = () => {
      index = parseInt(thumb.dataset.index);
      showSlide(index);
    };
  });

  showSlide(index);
}

