const inputImagen = document.getElementById("input-imagen");
const fotoPerfil = document.getElementById("foto-perfil");
const btnBorrar = document.getElementById("btn-borrar");
const opcionesImagen = document.getElementById("opciones-imagen");
const btnEditar = document.getElementById("btnEditar");

const campos = [
  "nombre-usuario",
  "apellido-usuario",
  "telefono-usuario",
  "genero-usuario",
  "pais-usuario",
];

let editando = false;

// Cargar datos guardados al iniciar
window.addEventListener("DOMContentLoaded", () => {
  const imagenGuardada = localStorage.getItem("fotoPerfil");
  if (imagenGuardada) fotoPerfil.src = imagenGuardada;

  campos.forEach((id) => {
    const valor = localStorage.getItem(id);

    // Valor por defecto si no hay nada guardado
    let valorPorDefecto = "";
    if (id === "nombre-usuario") valorPorDefecto = "Nombre";
    if (id === "apellido-usuario") valorPorDefecto = "Apellido";

    document.getElementById(id).textContent = valor || valorPorDefecto;
  });
});

// Cambiar foto de perfil
inputImagen.addEventListener("change", (event) => {
  const archivo = event.target.files[0];
  if (!archivo) return;
  const lector = new FileReader();
  lector.onload = function (e) {
    const imagenBase64 = e.target.result;
    fotoPerfil.src = imagenBase64;
    localStorage.setItem("fotoPerfil", imagenBase64);
  };
  lector.readAsDataURL(archivo);
});

// Borrar foto
btnBorrar.addEventListener("click", () => {
  localStorage.removeItem("fotoPerfil");
  fotoPerfil.src = "assets/perfil.jpg";
  inputImagen.value = "";
});

// Habilitar edición
btnEditar.addEventListener("click", () => {
  editando = !editando;

  if (editando) {
    btnEditar.textContent = "Guardar cambios";
    opcionesImagen.style.display = "flex";

    // Convertir los campos en inputs editables
    campos.forEach((id) => {
      const elemento = document.getElementById(id);
      const valorActual = elemento.textContent || "";
      const input = document.createElement("input");
      input.type = "text";
      input.value = valorActual;
      input.id = id + "-input";
      input.className = "input-editar";
      elemento.replaceWith(input);
    });
  } else {
    btnEditar.textContent = "Editar perfil";
    opcionesImagen.style.display = "none";

    // Guardar los datos y volver a mostrar como texto
    campos.forEach((id) => {
      const input = document.getElementById(id + "-input");
      let nuevoValor = input.value.trim();

      //  Verificador: no permitir nombre o apellido vacío
      if (id === "nombre-usuario" && nuevoValor === "") {
        alert("El nombre no puede quedar vacío.");
        nuevoValor = localStorage.getItem(id) || "Nombre";
      }
      if (id === "apellido-usuario" && nuevoValor === "") {
        alert("El apellido no puede quedar vacío.");
        nuevoValor = localStorage.getItem(id) || "Apellido";
      }

      localStorage.setItem(id, nuevoValor);

      // Crear elemento correcto según el campo
      let nuevoElemento;
      if (id === "nombre-usuario") {
        nuevoElemento = document.createElement("h2");
      } else if (id === "apellido-usuario") {
        nuevoElemento = document.createElement("h3");
      } else {
        nuevoElemento = document.createElement("a");
      }

      nuevoElemento.id = id;
      nuevoElemento.textContent = nuevoValor || "";

      input.replaceWith(nuevoElemento);
    });
  }
});
