const world = require('./world');
const sandbox = require('./physicsSandbox.js');

module.exports = (io)=>{
    let roomID = 0; 
    let rooms = []; 
    let createRoom = function(id){
        roomID++; 
        let room = {
            isFull: function(){ return this.sockets.length >= this.capacity;},
            capacity: 2,
            sockets: [],
            id : roomID,
            addSocket: function(socket) {
                this.sockets.push(socket);
                socket.room = this; 
                socket.join(this.id); 
                socket.dudeID = this.sockets.length - 1; 
                socket.emit('dude_connect', socket.dudeID);
                this.checkForBros(socket);
                this.sandbox.connectSocket(socket);
            },
            checkForBros: function(dude){
                this.sockets.filter((potentialBros)=> potentialBros.dudeID != dude.dudeID)
                .forEach((bro)=> {
                    dude.emit('bro_connect', bro.dudeID);
                    bro.emit('bro_connect', dude.dudeID);
                });
            },
            message: function(type, data){
                io.to(this.id).emit(type, data); 
            }
        };
        room.sandbox = sandbox(io, room); 

        return room; 
    };
    let addSocket = (socket)=>{
        if(!rooms.length || rooms[rooms.length - 1].isFull()){
            const road = createRoom(); 
            road.addSocket(socket); 
            rooms.push(road); 
        }else{
            rooms[rooms.length - 1].addSocket(socket); 
        }
    };
    io.on('connection', (socket)=>{
        addSocket(socket);
        socket.on('sub', (data)=>{
            socket.room.message('message', data);
        });
        socket.on('dudeInput', (input)=>{
            //convert inputs to movements on the server
            dude.room.message('truth', input); 
        });
    });
};