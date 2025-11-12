// Botones principales del login/register en versión escritorio
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

// Cuando la página termina de cargar...
document.addEventListener("DOMContentLoaded", () => {
  // Elementos para el login y registro en versión móvil
  const loginMobile = document.getElementById("loginMobile");
  const registerMobile = document.getElementById("registerMobile");
  const goRegister = document.getElementById("goRegister");
  const goLogin = document.getElementById("goLogin");

  // Si existen los botones de cambio, se configuran los eventos
  if (goRegister && goLogin) {
    // Cuando se hace clic en “Ir a registro”
    goRegister.addEventListener("click", () => {
      // Oculta el formulario de login y muestra el de registro
      loginMobile.classList.remove("active");
      registerMobile.classList.add("active");
    });

    // Cuando se hace clic en “Ir a login”
    goLogin.addEventListener("click", () => {
      // Oculta el de registro y muestra el de login
      registerMobile.classList.remove("active");
      loginMobile.classList.add("active");
    });
  }
});

// Cambia al panel de registro en escritorio
signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

// Cambia al panel de inicio de sesión en escritorio
signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Función que maneja el inicio de sesión (guarda el usuario y redirige)
function mantenerLogin(formId) {
  const form = document.getElementById(formId);
  if (!form) return; // si no existe el formulario, no hace nada

  // Escucha cuando el usuario envía el formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita que se recargue la página

    // Busca los campos de email y contraseña dentro del formulario
    const usuarioInput = form.querySelector('input[type="email"]');
    const contraseñaInput = form.querySelector('input[type="password"]');

    // Toma los valores y les saca espacios extra
    const usuario = usuarioInput?.value.trim();
    const contraseña = contraseñaInput?.value.trim();

    // Si ambos campos tienen algo, guarda los datos y redirige
    if (usuario && contraseña) {
      localStorage.setItem("logueado", "true");
      localStorage.setItem("usuario", usuario);

      // Vuelve al inicio después de iniciar sesión
      window.location.href = "index.html";
    } else {
      // Si falta algo, muestra una alerta simple
      alert("Por favor, complete todos los campos");
    }
  });
}

// Al cargar la página, aplica la función tanto a desktop como a mobile
document.addEventListener("DOMContentLoaded", function () {
  mantenerLogin("formLogin"); // formulario de escritorio
  mantenerLogin("loginMobile"); // formulario de celular
});

// Se llaman estas funciones por si existen en otro script
mantenerLogin();
cerrarSesion();
