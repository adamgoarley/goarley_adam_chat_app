var express = require('express');
var app = express();

const io = require('socket.io')(); 

const port = process.env.PORT || 3030;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

io.attach(server);

io.on('connection', function(socket) {
    socket.emit('connected', { sID: `${socket.id}`, count: io.engine.clientsCount - 1 }); 

    message = socket.id;
    io.emit('new_user', message);

 
    socket.on('chat_message', function(msg) {
        
        io.emit('new_message', { id: socket.id, message: msg});
    })

    
    socket.on('disconnect', function() {
        message = "A user has disconnected.";
        io.emit('user_disconnect', message);
    })

    
    socket.on('connection_message', function(msg) {
       
        socket.emit('new_message', {message: msg});
    })
})