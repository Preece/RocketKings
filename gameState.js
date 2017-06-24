let config = Object.assign({}, require('./public/Src/config.js')); 
config.pxmKeys.forEach((key)=>config[key] = config[key]*config.pxm); 
let {jumpPower: jumpPower, runSpeed: runSpeed} = config; 

const checkOnGround = (p2, world, body)=>{
    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;

    for (var i = 0; i < world.narrowphase.contactEquations.length; i++)
    {
        var c = world.narrowphase.contactEquations[i];

        if (c.bodyA === body || c.bodyB === body)
        {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === body) d *= -1;
            if (d > 0.5) result = true;
        }
    }
    
    return result;
};
const setVelocities = (inputs, body)=>{
    if(inputs.jump && inputs.onGround){
        body.velocity[1] = jumpPower;
    }
    if(inputs.left && !inputs.right){
        body.velocity[0] = runSpeed;
    }
    if(inputs.right && !inputs.left){
        body.velocity[0] = runSpeed;
    }
};
const parseInput = (input, state)=>{
    let key = ''; 
    if(input.jump){
        key = 'jump'; 
    }
    if(input.left){
        key = 'left';
    }
    if(input.right){
        key = 'right';
    }
    state.players[input.id].inputs[key] = input[key]; 
    console.log('parsing', state.players[input.id].inputs);
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
const setOnGround = (id, value, state)=>{
    state.players[id].onGround = value; 
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
const create = ()=>{
    return {
        players: {},
        rockets: {}
    };
};
const createBox = (x, y, width, height, p2, world)=>{
    let shape = new p2.Box({width: width, height: height});
    let body = new p2.Body({mass:1, position: [x,y]});
    body.addShape(shape);
    world.addBody(body); 
    return body;
};

const createPlane = (y, p2, world)=>{
    let shape = new p2.Plane({material: groundMat});
    let body = new p2.Body({mass: 0, position:[0,y]});
    body.addShape(shape);   
    world.addBody(body); 
    return body; 
};


module.exports = {
    create,
    serializeBody,
    forBody,
    forRockets,
    forPlayers,
    setOnGround,
    checkOnGround,
    setVelocities,
    parseInput,
    addPlayer,
    addRocket,
    removeRocket, 
    createPlane, 
    createBox
};