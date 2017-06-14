const express = require('express');
const app = express(); 
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('./room')(io);
    
/*
io.on('connection', (socket)=> {
    console.log("Connceted");
    socket.on('sub', (data)=> {
        console.log(data);
        io.emit('message', data); 
    }); 
});
*/
app.use(express.static('public'));
app.get('/', (req, res)=>{
    res.sendFilde(__dirname + '/public/index.html'); 
});
server.listen(3000);