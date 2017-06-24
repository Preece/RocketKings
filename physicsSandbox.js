module.exports = (io, room)=> {
    _ = require('underscore'); 
    p2 = require('p2');
    let config = Object.assign({}, require('./public/Src/config.js')); 
    config.pxmKeys.forEach((key)=>config[key] = config[key]*config.pxm); 
    let startPos = config.startPos; 

    let objID = 0; 
    const timestep = 1/60; 
    let uncalcdTime = 0; 
    let frameNum = 0; 
    const world = new p2.World({gravity:[0,-9.82]}); 
    world.defaultContactMaterial.restitution = 0; 
    world.defaultContactMaterial.friction = 0.5;
    world.setGlobalStiffness(1e5);


    let setup = require('./levelSetup');
    let bounds = setup.createBounds(config.width, config.height, world, p2);

    let actions = require('./gameState'); 
    const state = actions.create(); 


    const updateState = (actions, state)=>{
        actions.forPlayers((id, player)=>{
            player.inputs.onGround = actions.checkOnGround(p2, world, player.body); 
            actions.setVelocities(player.inputs, player.body); 
        }, state); 
    };
    const serializeState = (state)=>{
        const result = {}; 
        result.players = actions.forPlayers((id, player)=>{
            return {
                position: player.body.position,
                velocity: player.body.velocity
            };
        }, state);
        result.rockets = actions.forRockets((id, rocket)=>{
            return {
                position: rocket.body.position,
                velocity: rocket.body.vecocity
            };
        }, state);
        return result; 
    };
    const getID = ()=>{
        return objID++; 
    };
    const updateLoop = ()=>{
        let now = Date.now(); 
        delta = now - lastFrame; 
        uncalcdTime += delta / 1000;
        if(uncalcdTime > timestep){
            updateState(actions, state);
            world.step(timestep);
            frameNum++;
            uncalcdTime -= timestep;
            io.to(room.id).emit('truth', serializeState(state));
        }
        lastFrame = now;
        setImmediate(updateLoop);
    };
    lastFrame = Date.now();
    updateLoop();

    return {
        connectSocket: (socket)=>{
            const id = socket.dudeID; 
            actions.addPlayer(getID(),
                actions.createBox(config.startPos[id][0], config.startPos[id][1],1,1, p2, world),
                state);
            socket.on('dude_input', (input)=>{
                console.log(state, input); 
                actions.parseInput(input, state); 
            });
        }
    };
};