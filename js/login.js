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

function mantenerLogin(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]')?.value.trim();
    const password = form.querySelector('input[type="password"]')?.value.trim();

    if (!email || !password) {
      return alert("Por favor, complete todos los campos");
    }

    try {
      const resp = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      // --- GUARDAR TOKEN Y USUARIO ---
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", email);

      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      alert("Error de conexión al servidor");
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
