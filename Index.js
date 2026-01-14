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

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    let con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "webbserverprogrammering"
    });

    con.connect(function(err) {
      if (err) return console.error(err);
      
      con.query(`SELECT Output FROM chattbott WHERE Input = ?`, [msg], function (err, result) {
        if (err) throw err;

        if (result.length > 0) {
          io.emit('chat message', result[0].Output);
        } else {
          io.emit('chat message', "Jag förstår inte...");
        }

        con.end();
      });
    });
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});