const express = require('express');
const app = express(); 
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', ()=> console.log("Connceted"));
app.use(express.static('public'));
app.get('/', (req, res)=>{
    res.sendFilde(__dirname + '/public/index.html'); 
});
server.listen(3000);