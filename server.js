//Obviously more needed here, but just copying the main socket logic code for server side!
//Dependencies: socket-io, http, express
const express = require('express');
var app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server);

server.listen(port, () => {
    console.log('listening');
});

io.on('connection', (socket) => {
    console.log("connected");

    socket.on('disconnect', () => {
        socket.emit("disconnected")
    });

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });
})
