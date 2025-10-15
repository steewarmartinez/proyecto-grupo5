const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL =
  "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL =
  "https://japceibal.github.io/emercado-api/cats_products/101.json";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL =
  "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

document.addEventListener("DOMContentLoaded", function () {
  if (typeof mantenerLogin === "function") {
    mantenerLogin();
  }
});

const usuario = localStorage.getItem("usuario");
const loginLink = document.getElementById("login-link");
const loginDropDown = document.getElementById("login-dropdown");
const correoUsuario = document.getElementById("correo-usuario");
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

function cerrarSesion() {
  const usuario = localStorage.getItem("usuario");

  if (usuario) {
    localStorage.removeItem("logeado");
    localStorage.removeItem("usuario");

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
    Swal.fire({
      icon: "info",
      title: "Inicia sesión primero",
      showConfirmButton: true,
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const btnToggle = document.querySelector(".menu-toggle");
  const toggleOpen = document.getElementById("toggle_open");
  const toggleClose = document.getElementById("toggle_close");

  if (!menu || !btnToggle || !toggleOpen || !toggleClose) return;

  toggleClose.style.display = "none";

  btnToggle.addEventListener("click", () => {
    const opened = menu.classList.toggle("show");
    toggleOpen.style.display = opened ? "none" : "inline-block";
    toggleClose.style.display = opened ? "inline-block" : "none";
  });

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

function goToCart() {
  window.location.href = "cart.html";
}

const toggle = document.getElementById("modeToggle");
const knob = document.querySelector(".toggle-knob");

// Cargar tema guardado
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggle.checked = true;
  knob.textContent = "🌙";
}

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
