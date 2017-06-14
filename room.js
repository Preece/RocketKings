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
            addSocket: function(socket) {
                this.sockets.push(socket);
                socket.gameRoom = this; 
                socket.join(this.id); 
            },
            message: function(type, data){
                io.to(this.id).emit(type, data); 
            }
        };
    };
    let addSocket = (socket)=>{
        if(!rooms.length || rooms[rooms.length - 1].isFull()){
            const room = createRoom(); 
            room.addSocket(socket); 
            rooms.push(room); 
        }else{
            rooms[rooms.length - 1].addSocket(socket); 
        }
    };
    io.on('connection', (socket)=>{
        addSocket(socket); 
        socket.on('sub', (data)=>{
            socket.gameRoom.message('message', data); 
        });
        socket.on('dudeInput', (input)=>{
            socket.gameRoom.message('truth', input); 
        });
    });
};