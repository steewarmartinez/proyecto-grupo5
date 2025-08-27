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
