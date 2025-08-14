const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formLogin");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    if (usuario !== "" && contraseña !== "") {
      localStorage.setItem("logueado", "true");
      localStorage.setItem("usuario", usuario);

      window.location.href = "index.html";
    } else {
      alert("Por favor, complete todos los campos.");
    }
  });
});
