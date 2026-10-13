// cosas de la pagina
const entrada = document.getElementById("entrada");
const chat = document.getElementById("chat");
const formNombre = document.getElementById("form-nombre");
const inputNombre = document.getElementById("input-nombre");
const errorNombre = document.getElementById("error-nombre");
const miNombre = document.getElementById("mi-nombre");

let nombre = ""; // aqui se guarda el nombre cuando entras

// cuando le das a entrar
formNombre.addEventListener("submit", function(e) {
  e.preventDefault(); // para que no se recargue

  let texto = inputNombre.value.trim(); // quito espacios de los lados

  // si esta vacio o es muy largo, error y fuera
  if (texto == "") {
    errorNombre.textContent = "Pon un nombre";
    return;
  }
  if (texto.length > 20) {
    errorNombre.textContent = "Maximo 20 letras";
    return;
  }

  // si llega aqui el nombre vale, escondo la entrada y enseño el chat
  nombre = texto;
  miNombre.textContent = "Nombre: " + nombre;
  entrada.classList.add("oculto");
  chat.classList.remove("oculto");
});


// ----- SOCKET -----
const socket = io(); // conecta con el servidor

const mensajes = document.getElementById("mensajes");
const formMensaje = document.getElementById("form-mensaje");
const inputMensaje = document.getElementById("input-mensaje");
const botonEnviar = document.getElementById("boton-enviar");
const estado = document.getElementById("estado");


// ----- ENVIAR MENSAJE -----
// es un form asi que con enter tambien funciona
formMensaje.addEventListener("submit", function(e) {
  e.preventDefault();

  let texto = inputMensaje.value.trim();

  if (texto == "") return;
  if (texto.length > 500) return;
  if (nombre == "") return;       // sin nombre no se puede
  if (!socket.connected) return;  // y sin conexion tampoco

  socket.emit("chat:send", { nombre: nombre, texto: texto });

  inputMensaje.value = ""; // limpio el campo
  inputMensaje.focus();
});


// ----- RECIBIR MENSAJE -----
// ojo: esto va fuera de "connect" para que no se repita al reconectar
socket.on("chat:message", function(mensaje) {
  let div = document.createElement("div");
  div.classList.add("mensaje");

  // hora
  let hora = document.createElement("span");
  hora.classList.add("hora");
  hora.textContent = mensaje.hora + " ";

  // quien lo manda
  let autor = document.createElement("strong");
  autor.textContent = mensaje.nombre + ": ";

  // el mensaje (con textContent para que no se meta html)
  let texto = document.createElement("span");
  texto.textContent = mensaje.texto;

  div.appendChild(hora);
  div.appendChild(autor);
  div.appendChild(texto);
  mensajes.appendChild(div);

  // bajar el scroll al ultimo mensaje
  mensajes.scrollTop = mensajes.scrollHeight;
});


// ----- CONECTADO / DESCONECTADO -----
function mostrarConectado() {
  estado.textContent = "Conectado";
  estado.className = "conectado";
  botonEnviar.disabled = false;
}

function mostrarDesconectado() {
  estado.textContent = "Desconectado";
  estado.className = "desconectado";
  botonEnviar.disabled = true; // el texto del input se queda como esta
}

socket.on("connect", mostrarConectado);
socket.on("disconnect", mostrarDesconectado);

// al cargar la pagina miro como esta la conexion
if (socket.connected) {
  mostrarConectado();
} else {
  mostrarDesconectado();
}