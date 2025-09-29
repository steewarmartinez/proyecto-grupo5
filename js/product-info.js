document.addEventListener("DOMContentLoaded", async () => {
  const productId = localStorage.getItem("selectedProductId");
  if (!productId) return;

  // Info del producto
  const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
  const commentsUrl = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;

  try {
    const [productRes, commentsRes] = await Promise.all([
      fetch(url),
      fetch(commentsUrl),
    ]);
    const product = await productRes.json();
    const comentarios = await commentsRes.json();

    mostrarProducto(product);
    mostrarCalificaciones(comentarios);
    mostrarRelacionados(product.relatedProducts);
  } catch (error) {
    console.error(error);
  }
});

// Mostrar comentarios
function mostrarCalificaciones(comentarios) {
  const cont = document.getElementById("calificaciones-list");
  if (!cont) return;
  cont.innerHTML = comentarios
    .map(
      (c) => `
      <div class="calificacion">
        <div class="calificacion-header">
          <strong>${c.user}</strong> <span>${c.dateTime}</span>
        </div>
        <div class="calificacion-puntaje">${"⭐".repeat(c.score)}</div>
        <div class="calificacion-comentario">${c.description}</div>
      </div>
    `
    )
    .join("");
}

// Mostrar productos relacionados
function mostrarRelacionados(relacionados) {
  const cont = document.getElementById("relacionados-list");
  if (!cont) return;
  cont.innerHTML = relacionados
    .map(
      (p) => `
      <div class="relacionado-card" data-id="${p.id}" style="cursor:pointer">
        <img src="${p.image}" alt="${p.name}" class="relacionado-img"/>
        <div class="relacionado-nombre">${p.name}</div>
      </div>
    `
    )
    .join("");
  // Listener para cambiar producto al hacer click
  cont.querySelectorAll(".relacionado-card").forEach((card) => {
    card.addEventListener("click", () => {
      localStorage.setItem("selectedProductId", card.dataset.id);
      location.reload();
    });
  });
}

// Mostrar producto
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

