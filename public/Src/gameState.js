(()=> {
    const config = (window)? window.conifg : Object.assign({}, require('./public/Src/config.js')); 
    config.pxmKeys.forEach((key)=>config[key] = config[key]*config.pxm); 
    const {jumpPower, strafeSpeed, airStrafeSpeed} = config; 
    const {sum} = require('./Util'); 

    const setVelocities = (inputs, body, timestep)=>{
        if(inputs.jump && body.isOn){
            body.velocity = sum(body.prevPosition, body.position, (a,b)=>(b - a) / timestep);
            body.velocity[1] = jumpPower;
            body.isDirty = true; 
        }
        if(inputs.left && !inputs.right){
            if(body.isOn){
                body.impulses.push([-strafeSpeed, 0]);
            }else{
                body.impulses.push([-airStrafeSpeed, 0]);
            }
        }
        if(inputs.right && !inputs.left){
            if(body.isOn){
                body.impulses.push([strafeSpeed, 0]);
            }else{
                body.impulses.push([airStrafeSpeed, 0]); 
            }
        }
    };
    const applyExplosion = (rocket, state)=>{
        
    };
    const parseInput = (input, state)=>{
        let key = ''; 
        if(input.jump !== undefined){
            key = 'jump'; 
        }
        if(input.left !== undefined){
            key = 'left';
        }
        if(input.right !== undefined){
            key = 'right';
        }
        if(key){
            state.players[input.id].inputs[key] = input[key];
        }
    };
    const addPlayer = (id, body, state)=>{
        state.players[id] = {
            body:body, 
            inputs: {}
        };
    };
    const addRocket = (id, body, state)=>{
        state.rockets[id] = {
            body:body
        };
    };
    const removeRocket = (id, state)=>{
        delete state.rockets[id];
    };
    const forPlayers = (cb, state, result = {})=>{
        for(key in state.players){
            result[key] = cb(key, state.players[key]); 
        }
        return result; 
    };
    const forRockets = (cb, state, result = {})=>{
        for(key in state.rockets){
            result[key] = cb(key, state.rockets[key]); 
        }
        return result; 
    };
    const forBody = (cb, state)=>{
        let result = forPlayers(cb, state);
        return forRocket(cb, state, result); 
    };
    const serializeBody = (id, body)=>{
        return {
            id: id,
            position: body.position,
            velocity: body.velocity
        };
    };
    const createState = ()=>{
        return {
            players: {},
            rockets: {}
        };
    };

    const createPlane = (y, p2, world)=>{
        let shape = new p2.Plane({material: groundMat});
        let body = new p2.Body({mass: 0, position:[0,y]});
        body.addShape(shape);   
        world.addBody(body); 
        return body; 
    };


    module.exports = {
        createState,
        serializeBody,
        forBody,
        forRockets,
        forPlayers,
        setVelocities,
        parseInput,
        addPlayer,
        addRocket
    };
    if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = returns;
    }
    exports.config = returns;
  } else {
    window.gameState = returns;
  }


})();