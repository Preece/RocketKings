const _ = require('underscore'); 
const {sum} = require('./Util'); 

//Ray intersection and collisions need to updated. 
//How will on collision work speciifically? 
//isOn needs to be thought out more.
//checkBounds, minY has some hard coded removal of intertia.
const checkBounds = (body, state)=>{
    let {position:[posX, posY], extents: [extX, extY]} = body;
    let {boundsMinX: minX, boundsMinY: minY, boundsMaxX: maxX, boundsMaxY: maxY} = state;
    let result = [0,0];
    let collided = false;
    if((posX - extX) < minX){
        collided = true; 
        result[0] = -(posX - extX - minX);
        body.onCollision(state.boundsObj, [minX, posY]); 
        body.velocity[0] = 0; 
    }
    if((posX + extX) > maxX){
        collided = true; 
        result[0] = -(posX + extX - maxX);
        body.onCollision(state.boundsObj, [maxX, posY]); 
        body.velocity[0] = 0; 
    }
    if((posY - extY) < minY){
        collided = true; 
        result[1] = -(posY - extY - minY);
        body.isOn = state.groundPlane; 
        body.onCollision(state.groundPlane, [posX, minY]); 
        body.velocity = [0,0]; 
    }
    if((posY + extY) > maxY){
        collided = true; 
        result[1] = -(posY + extY - maxY); 
        body.onCollision(state.boundsObj, [posX, maxY]); 
        body.velocity[1] = 0; 
    }
    if(collided){
        return result; 
    }
    return null; 
};

const createBody = (options, world)=>{
    let body = {
        position: [], 
        velocity: [],
        extents: [],
        impulses: []
    };
    ({
        x: body.position[0] = 0,
        y: body.position[1] = 0,
        xVelocity: body.velocity[0] = 0,
        yVelocity: body.velocity[1] = 0,
        width: body.extents[0] = 1,
        height: body.extents[1] = 1,
        useGravity: body.useGravity = true,
        onCollision: body.onCollision = ()=>{},
        mass: body.mass = 0
    } = options); 
    body.prevPosition = body.position; 
    body.extents = _.map(body.extents, (extent)=> extent/2);
    updateAABB(body); 
    if(world){
        addBody(body, world);  
    }
    return body; 
};
const updateAABB = (body)=>{
    body.min = [body.position[0] - body.extents[0],
        body.position[1] - body.extents[1]]; 
    body.max = [body.position[0] + body.extents[0],
        body.position[1] + body.extents[1]];
};
const createWorld = (options = {})=>{
    let state = {}; 
    state.groundPlane = {isGround: true, isBounds: true};
    state.boundsObj = {isBounds: true};
    ({
        gravity: state.gravity = [0,-10],
        boundsMinX: state.boundsMinX = 0,
        boundsMinY: state.boundsMinY = 0,
        boundsMaxX: state.boundsMaxX = 100,
        boundsMaxY: state.boundsMaxY = 100,
        gridSize: state.gridSize = 10,
    } = options); 
    state.bodies = [];
    state.dynamicBodies = []; 
    state._uniqID = 0; 
    return state; 
};
const step = (step, world)=>{
    _.each(world.dynamicBodies, (body)=>{
        body.prevPosition = body.position; 
        if(body.isDirty){
            body.isOn = false; 
        }
        if(body.useGravity && !body.isOn){
            body.velocity = sum(body.velocity, world.gravity, (vel, grav)=> vel + grav * step);
        }
        body.position = sum(body.position, body.velocity, (pos, vel)=> pos + vel * step);
        _.each(body.impulses, (impulse)=>{
            body.position = sum(body.position, impulse, (pos, imp)=> pos + imp * step); 
        });
        body.impulses.length = 0; 
        let coll = checkBounds(body, world);
        if(coll !== null){
            body.position = sum(body.position, coll, (a,b)=>a + b); 
        }
    });
    collisionCheck(world);
};
const collisionCheck = (world)=>{
    //Update bounding boxes for ease of use later, and clear uniq collision check
    _.each(world.dynamicBodies, (dBody)=> {
        updateAABB(dBody);
        dBody.bodiesChecked = {}; 
    }); 

    //we iterate over every dynamic body, then all bodies
    //we assume static bodies can't collide with each other
    _.each(world.dynamicBodies, (dBody)=>{
        _.each(world.bodies, (collBody)=>{
            //make sure the body isn't itself.
            if(dBody.id !== collBody.id && !dBody.bodiesChecked[collBody.id]){
                if(dBody.min[0] < collBody.max[0] && dBody.max[0] > collBody.min[0] &&
                    dBody.min[1] < collBody.max[1] && dBody.max[1] > collBody.min[1]){
                    //create the overlap volume
                    const collMin = [Math.max(dBody.min[0], collBody.min[0]),
                        Math.max(dBody.min[1], collBody.min[1])];
                    const collMax = [Math.min(dBody.max[0], collBody.max[0]),
                        Math.min(dBody.max[1], collBody.max[1])];
                    //get the difference in velocities
                    let velDiff =sum(
                        sum(dBody.position, dBody.prevPosition, (a,b)=> a - b),
                        sum(collBody.position, dBody.prevPosition, (a,b)=> a - b),
                        (a, b)=> a-b);

                    let contact = rayAABBIntersection(collMin, collMax, velDiff);
                    if(contact.axis === 0){
                        const mod = (dBody.position[0] < dBody.prevPosition[0])? 1 : -1;
                        dBody.velocity[0] = 0;
                        dBody.position[0] = contact.point[0] + dBody.extents[0] * mod; 
                    }else{
                        dBody.velocity[1] = 0; 
                        const mod = (dBody.position[1] < dBody.prevPosition[1])? 1 : -1;
                        dBody.position[1] = contact.point[1] + dBody.extents[1] * mod; 
                        if(dBody.position[1] > collBody.position[1]){
                            dBody.isOn = collBody; 
                        }
                    }
                    console.log(dBody.position); 
                    dBody.onCollision(collBody, contact.point); 
                    //collided with a dynamic body
                    if(collBody.mass > 0){
                        collBody.bodiesChecked[dBody.id] = true; 
                        collBody.onCollision(dBody, contact.point); 
                        if(contact.axis === 0){
                            collBody.velocity[0] = 0; 
                        }else{
                            collBody.velocity[1] = 0; 
                            if(dBody.position[1] < collBody.position[1]){
                                collBody.isOn = dBody;
                            }
                        }
                    }
                }
            }
        });
    });
};

const rayAABBIntersection = (min, max, dir)=>{
    const result = {}; 
    const origin = [min[0] + max[0] / 2,
        min[1] + max[1] / 2]; 
    const xPlane = (dir[0] > 0) ? max[0] : min[0]; 
    const yPlane = (dir[1] > 0) ? max[1] : min[1]; 
    const xDist = dir[0] / (xPlane - origin[0]);
    const yDist = dir[1] / (yPlane - origin[1]);
    console.log(min, max); 
    console.log(xPlane, yPlane);  
    console.log(xDist, yDist); 
    if(xDist < yDist){
        result.axis = 0; 
        result.point = [dir[0] / xDist + origin[0], dir[1] / xDist + origin[1]];
    }else{
        result.axis = 1;
        result. point = [dir[0] / yDist + origin[0], dir[1] / yDist + origin[1]]; 
    }
    return result; 
 };

const addBody = (body, world)=>{
    world.bodies.push(body); 
    if(body.mass > 0){
        world.dynamicBodies.push(body); 
    }
    body.id = world._uniqID++; 
};

module.exports = {
    createWorld,
    createBody,
    addBody,
    step
};