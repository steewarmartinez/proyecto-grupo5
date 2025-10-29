const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
document.addEventListener("DOMContentLoaded", () => {
  const loginMobile = document.getElementById("loginMobile");
  const registerMobile = document.getElementById("registerMobile");
  const goRegister = document.getElementById("goRegister");
  const goLogin = document.getElementById("goLogin");

  if (goRegister && goLogin) {
    goRegister.addEventListener("click", () => {
      loginMobile.classList.remove("active");
      registerMobile.classList.add("active");
    });

    goLogin.addEventListener("click", () => {
      registerMobile.classList.remove("active");
      loginMobile.classList.add("active");
    });
  }
});

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

function mantenerLogin(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuarioInput = form.querySelector('input[type="email"]');
    const contraseñaInput = form.querySelector('input[type="password"]');

    const usuario = usuarioInput?.value.trim();
    const contraseña = contraseñaInput?.value.trim();

    if (usuario && contraseña) {
      localStorage.setItem("logueado", "true");
      localStorage.setItem("usuario", usuario);

      window.location.href = "index.html";
    } else {
      alert("Por favor, complete todos los campos");
    }
  });
}

// Llamada para ambos formularios
document.addEventListener("DOMContentLoaded", function () {
  mantenerLogin("formLogin"); // desktop
  mantenerLogin("loginMobile"); // mobile
});

mantenerLogin();
cerrarSesion();
