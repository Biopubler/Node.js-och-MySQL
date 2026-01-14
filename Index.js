const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
let mysql = require('mysql');


const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

//Tilläg
io.on('connection', (socket) => {
  socket.on('chat message', (Hej) => {
    

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "webbserverprogrammering"
});

con.connect(function(err) {
  if (err) throw err;
  con.query(`SELECT * FROM chattbott WHERE Input="${Hej}"`, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
      io.emit('chat message', result[0].Output);

  });
});

  });
});
//Tiläg slut

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});