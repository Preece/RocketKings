module.exports = (io)=>{
    let roadID = 0; 
    let roads = []; 
    let createRoad = (id)=>{
        roadID++; 
        return {
            isFull: function(){ return this.sojourners.length >= this.capacity;},
            capacity: 2,
            sojourners: [],
            id : roadID,
            addSojourner: function(sojourner) {
                this.sojourners.push(sojourner);
                sojourner.road = this; 
                sojourner.join(this.id); 
                sojourner.sin = this.sojourners.length - 1; 
                sojourner.emit('dude_connect', sojourner.sin);
                this.checkForCompanions(sojourner); 
            },
            checkForCompanions: function(sojourner){
                this.sojourners.filter((potentialCompanion)=> potentialCompanion.sin != sojourner.sin)
                .forEach((companion)=> {
                    sojourner.emit('bro_connect', companion.sin);
                    companion.emit('bro_connect', sojourner.sin);
                });
            },
            message: function(type, data){
                io.to(this.id).emit(type, data); 
            }
        };
    };
    let addSojourner = (sojourner)=>{
        if(!roads.length || roads[roads.length - 1].isFull()){
            const road = createRoad(); 
            road.addSojourner(sojourner); 
            roads.push(road); 
        }else{
            roads[roads.length - 1].addSojourner(sojourner); 
        }
    };
    io.on('connection', (sojourner)=>{
        addSojourner(sojourner); 
        sojourner.on('sub', (data)=>{
            sojourner.road.message('message', data); 
        });
        sojourner.on('dudeInput', (input)=>{
            sojourner.road.message('truth', input); 
        });
    });
};