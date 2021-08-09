var express = require('express')

var app = express()
let http = require('http');
const db = require("./queris");
let server = http.createServer(app)
let io = require('socket.io')(server)
var pg = require ('pg');



app.get('/', (req, res) => {
    res.sendFile('C:\\Users\\bcantet\\WebstormProjects\\BastiChat\\index.html');
});

const emitMostRecentMessges = () => {
    db.getSocketMessages()
        .then((result) => io.emit("prec messages", result))
        .catch(console.log);
};

io.on('connection', (socket) => {
    console.log('a user connected');
    emitMostRecentMessges();
    socket.on('chat message', (msg) => {
        console.log("message -> " + msg)
        io.emit('chat message', msg)
        db.createSocketMessage(JSON.parse(msg))
            .catch((err) => io.emit(err));
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});
