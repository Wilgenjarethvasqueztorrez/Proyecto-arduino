const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos (HTML, JS, CSS)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Configurar puerto serial
const port = new SerialPort({ path: 'COM3', baudRate: 9600 }); // Cambia COM3 por el puerto de tu Arduino
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Comunicación con cliente web
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('servo', (angle) => {
    console.log('Ángulo recibido:', angle);
    port.write(angle + '\n');
  });
});

// Iniciar servidor
server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
