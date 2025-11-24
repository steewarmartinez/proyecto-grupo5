const BASE_URL = "http://localhost:3000/data/";

// Rutas locales (servidas desde el backend)
const CATEGORIES_URL = BASE_URL + "cats/cat.json";
const PUBLISH_PRODUCT_URL = BASE_URL + "sell/publish.json";
const PRODUCTS_URL = BASE_URL + "cats_products/101.json";
const PRODUCT_INFO_URL = BASE_URL + "products/";
const PRODUCT_INFO_COMMENTS_URL = BASE_URL + "products_comments/";
const CART_INFO_URL = BASE_URL + "user_cart/";
const CART_BUY_URL = BASE_URL + "cart/buy.json";
const EXT_TYPE = ".json";

// Muestra el spinner cuando se hace una petición
let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

// Oculta el spinner una vez que termina la carga
let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();

  const token = localStorage.getItem("token");

  return fetch(url, {
    headers: {
      "access-token": token || "",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        // SI EL TOKEN ES MALO → REDIRIGE
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          window.location.href = "login.html";
        }
        throw Error(response.statusText);
      }
    })
    .then((response) => {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch((error) => {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

// Al cargar la página, si existe la función mantenerLogin, la ejecuta
document.addEventListener("DOMContentLoaded", function () {
  if (typeof mantenerLogin === "function") {
    mantenerLogin();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // si estás en login.html no redirige
    if (!window.location.href.includes("login")) {
      window.location.href = "login.html";
    }
  }
});

// Mostrar el usuario logeado en distintos lugares de la interfaz
const usuario = localStorage.getItem("usuario");
const loginLink = document.getElementById("login-link");
const loginDropDown = document.getElementById("login-dropdown");
const correoUsuario = document.getElementById("correo-usuario");

// Si hay un usuario guardado, cambia los textos de los links
if (usuario && loginLink) {
  loginLink.textContent = usuario;
  loginLink.href = "#";
}
if (usuario && loginDropDown) {
  loginDropDown.textContent = usuario;
  loginDropDown.href = "#";
}
if (usuario && correoUsuario) {
  correoUsuario.textContent = usuario;
  correoUsuario.href = "#";
}

// Cierra la sesión del usuario y limpia el localStorage
function cerrarSesion() {
  const usuario = localStorage.getItem("usuario");

  if (usuario) {
    // Borra los datos de sesión
    localStorage.removeItem("logeado");
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    // Actualiza el texto de los enlaces a "Inicia sesión"
    if (loginLink) {
      loginLink.textContent = "Inicia sesión";
      loginLink.href = "#";
    }
    if (loginDropDown) {
      loginDropDown.textContent = "Inicia sesión";
      loginDropDown.href = "#";
    }
    if (correoUsuario) {
      correoUsuario.textContent = "";
      correoUsuario.href = "#";
    }

    // Muestra una notificación rápida usando SweetAlert
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Sesión cerrada",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } else {
    // Si intenta cerrar sesión sin estar logeado
    Swal.fire({
      icon: "info",
      title: "Inicia sesión primero",
      showConfirmButton: true,
    });
  }
}

// Control del menú desplegable en pantallas chicas
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const btnToggle = document.querySelector(".menu-toggle");
  const toggleOpen = document.getElementById("toggle_open");
  const toggleClose = document.getElementById("toggle_close");

  // Si no existen los elementos, no hace nada
  if (!menu || !btnToggle || !toggleOpen || !toggleClose) return;

  // Por defecto el icono de cerrar no se muestra
  toggleClose.style.display = "none";

  // Abre o cierra el menú cuando se hace clic en el botón
  btnToggle.addEventListener("click", () => {
    const opened = menu.classList.toggle("show");
    toggleOpen.style.display = opened ? "none" : "inline-block";
    toggleClose.style.display = opened ? "inline-block" : "none";
  });

  // Si se hace clic en un enlace del menú, se cierra automáticamente
  menu.querySelectorAll(".nav-link").forEach((a) => {
    a.addEventListener("click", () => {
      if (menu.classList.contains("show")) {
        menu.classList.remove("show");
        toggleOpen.style.display = "inline-block";
        toggleClose.style.display = "none";
      }
    });
  });
});

// Redirige a la página del carrito
function irAlCarrito() {
  window.location.href = "cart.html";
}

// Modo oscuro / claro
const toggle = document.getElementById("modeToggle");
const knob = document.querySelector(".toggle-knob");

// Si el usuario ya tenía el modo oscuro guardado, se aplica
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggle.checked = true;
  knob.textContent = "🌙";
}

// Cambia entre modo oscuro y claro cuando se toca el switch
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    document.body.classList.add("dark-mode");
    knob.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    knob.textContent = "☀️";
    localStorage.setItem("theme", "light");
  }
});

// Actualiza el número que aparece en el ícono del carrito
function actualizarBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // Suma todas las cantidades de los productos guardados
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent = totalItems;
    // Si hay productos, se muestra el número; si no, se oculta
    badge.style.display = totalItems > 0 ? "flex" : "none";
  }
}

// Ejecuta la función apenas carga la página
document.addEventListener("DOMContentLoaded", actualizarBadge);
