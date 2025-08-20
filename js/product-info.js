const usuario = localStorage.getItem("usuario");
const loginLink = document.getElementById("login-link");
if (usuario && loginLink) {
  loginLink.textContent = usuario;
  loginLink.href = "#";
}