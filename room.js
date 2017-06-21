const world = require('./world');

module.exports = (io)=>{
    let roomID = 0; 
    let rooms = []; 
    let createRoom = (id)=>{
        roomID++; 
        return {
            isFull: function(){ return this.sockets.length >= this.capacity;},
            capacity: 2,
            sockets: [],
            id : roomID,
            world: world.createWorld(io, roomID),
            addSocket: function(socket) {
                this.sockets.push(socket);
                socket.room = this; 
                socket.join(this.id); 
                socket.dudeID = this.sockets.length - 1; 
                socket.emit('dude_connect', dude.dudeID);
                this.checkForBros(socket);
                world.addSocket(this.world, dude.dudeID); 
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
    };
    let addSocket = (dude)=>{
        if(!rooms.length || rooms[rooms.length - 1].isFull()){
            const road = createRoom(); 
            road.addSocket(dude); 
            rooms.push(road); 
        }else{
            rooms[rooms.length - 1].addSocket(dude); 
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