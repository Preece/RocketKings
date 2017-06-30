module.exports = (io, room)=> {
    const _ = require('underscore'); 
    const p2 = require('p2');
    const physics = require('./physics'); 

    const config = require('./public/Src/config.js'); 
    const pxmConfig = {}; 
    const applyPXM = (value, pxm)=>{
        if(Array.isArray(value)){
            return value.map((ele)=>applyPXM(ele, pxm));
        }else{
            return value * pxm; 
        }
    };
    config.pxmKeys.forEach((key)=>{
        const result = applyPXM(config[key], config.pxm);
        pxmConfig[key] = result; 
    }); 

    let objID = 0; 
    const timestep = 1/60; 
    let uncalcdTime = 0; 
    let frameNum = 0; 


    let actions = require('./gameState'); 
    const state = actions.createState(); 
    const world = physics.createWorld({
        boundsMaxX: config.width,
        boundsMaxY: config.height,
        gravity: pxmConfig.gravity
    }); 

    pxmConfig.platforms.forEach((platform)=>{
        let [x, y, width, height] = platform; 
        physics.createBody({x, y, width, height, mass: 0}, world);
    });

    const updateState = (actions, timestep, state)=>{
        actions.forPlayers((id, player)=>{
            actions.setVelocities(player.inputs, player.body, timestep  ); 
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
            updateState(actions, timestep, state);
            physics.step(timestep, world);
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
            const gameID = getID(); 
            const body = physics.createBody({
                x: pxmConfig.startPos[id][0],
                y: pxmConfig.startPos[id][1],
                width: 1,
                height: 1,
                mass: 1,
                isPlayer: true,
                id: gameID
            }, world);
            actions.addPlayer(gameID, body, state);
            socket.on('dude_input', (input)=>{  
                actions.parseInput(input, state); 
            });
        }
    };
};