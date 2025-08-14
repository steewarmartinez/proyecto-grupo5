document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("logueado") !== "true") {
    window.location.href = "login.html";
    return;
  }

  //MANTENER EL RESTO DEL CODIGO ADENTRO DE ESTE BLOQUE, NO LO SAQUEN AFUERA!!

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("autos").addEventListener("click", function () {
      localStorage.setItem("catID", 101);
      window.location = "products.html";
    });
    document.getElementById("juguetes").addEventListener("click", function () {
      localStorage.setItem("catID", 102);
      window.location = "products.html";
    });
    document.getElementById("muebles").addEventListener("click", function () {
      localStorage.setItem("catID", 103);
      window.location = "products.html";
    });
  });
});
