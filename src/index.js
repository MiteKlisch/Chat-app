const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 4000;
const puplicDirecrory = path.join(__dirname, '../public');

app.use(express.static(path.join(puplicDirecrory)));

//let count = 0;

io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    // socket.emit('countUpdated', count);
    // socket.on('increment', () => {
    //     count++
    //     //socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // })


    socket.on('join', ({ username, room }) => {
        socket.join(room);

        socket.emit('message', generateMessage('Welcome!'));
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`));
        //socket.emit, io.emit, socket.bradcast.emit
        //io.to.emit, socket.broadcast.to.emit
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        
        if (filter.isProfane(message)) {
           return callback('Profanity is not allowed!')
        }

        io.to('Gym').emit('message', generateMessage(message));
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left.'))
    });
    
    socket.on('sendLocation', (position, callback) => {
        io.emit('locatioMessage', generateLocationMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`));
        callback();
    });
})

server.listen(port, () => {
    console.log(`Sever is up on port ${port}`)
})