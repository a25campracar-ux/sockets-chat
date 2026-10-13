const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const servidor = http.createServer(app);
const io = new Server(servidor);

// para que express enseñe lo de la carpeta public
app.use(express.static("public"));


// cada vez que alguien se conecta
io.on("connection", function(socket) {
  console.log("alguien se ha conectado");

  // cuando un cliente manda un mensaje
  socket.on("chat:send", function(datos) {

    // si no llega nada o no es texto, paso de el
    if (!datos) return;
    if (typeof datos.nombre != "string") return;
    if (typeof datos.texto != "string") return;

    // quito espacios de los lados
    let nombre = datos.nombre.trim();
    let texto = datos.texto.trim();

    // si esta vacio o se pasa del limite, no lo mando
    if (nombre == "" || nombre.length > 20) return;
    if (texto == "" || texto.length > 500) return;

    // la hora la pone el servidor, no el cliente
    let hora = new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    });

    // lo mando a todos (tambien al que lo ha escrito)
    io.emit("chat:message", {
      nombre: nombre,
      texto: texto,
      hora: hora
    });
  });

  // cuando alguien se va
  socket.on("disconnect", function() {
    console.log("alguien se ha desconectado");
  });
});


servidor.listen(3000, function() {
  console.log("servidor en http://localhost:3000");
});