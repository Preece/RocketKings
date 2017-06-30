(()=> {
const _ = (window)? window._ : require('underscore'); 
const {sum} = (window)? window.util : require('./Util'); 

//Ray intersection and collisions need to updated. 
//How will on collision work speciifically? 
//isOn needs to be thought out more.
//checkBounds, minY has some hard coded removal of intertia.

const checkBounds = (body, world)=>{
    let {position:[posX, posY], extents: [extX, extY]} = body;
    let {boundsMinX: minX, boundsMinY: minY, boundsMaxX: maxX, boundsMaxY: maxY} = world;
    if((posX - extX) < minX){
       onCollision(body, null,{
        axis: 0,
        offset: -(posX - extX - minX)
       });
    }
    if((posX + extX) > maxX){
        onCollision(body, null, {
            axis: 0,
            offset:-(posX + extX - maxX)
        });
    }
    if((posY - extY) < minY){
        onCollision(body, world.groundPlane, {
            axis: 1,
            offset: -(posY - extY - minY)
        });
    }
    if((posY + extY) > maxY){
        onCollision(body, null, {
            axis: 1,
            offset:-(posY + extY - maxY)
        });
    }
};

const createBody = (options, world)=>{
    let body = {
        position: [], 
        velocity: [],
        extents: [],
        impulses: [],
        collPriority: 0
    };
    ({
        x: body.position[0] = 0,
        y: body.position[1] = 0,
        xVelocity: body.velocity[0] = 0,
        yVelocity: body.velocity[1] = 0,
        width: body.extents[0] = 1,
        height: body.extents[1] = 1,
        useGravity: body.useGravity = true,
        isPlayer: body.isPlayer,
        isRocket: body.isRocket,
        collisionCB: body.collisionCB,
        mass: body.mass = 0,
        id: body.id
    } = options); 
    if(body.isPlayer){
        body.collPriority = 1; 
    }
    body.prevPosition = body.position; 
    body.extents = _.map(body.extents, (extent)=> extent/2);
    updateAABB(body); 
    body.prevMin = body.min;
    body.prevMax = body.max; 
    if(world){
        addBody(body, world);  
    }
    return body; 
};

const removeBody = (body, world)=>{
    //we replace the body we want to remove, with the last element in the list
    //then we shrink the list by one. 
    const dIndex = _.findWhere(world.dynamicBodies, {id: body.id});
    if(dIndex !== undefined){
        dLength = world.dynamicBodies.length - 1; 
        world.dynamicBodies[dIndex] = world.dynamicBodies[dLength];
        world.dynamicBodies.length = dLength; 
    }
    const bIndex = _.findWhere(world.bodies, {id: body.id});
    if(bIndex !== undefined){
        bLength = world.bodies.length - 1; 
        world.bodies[bIndex] = world.dynamicBodies[bLength]; 
        world.bodies.length = bLength; 
    }
};
const playerColl = (body, collBody, contact)=>{
    body.velocity[contact.axis] = 0; 
    body.position[contact.axis] += contact.offset; 
    if(contact.axis === 1 && body && body.position[1] > collBody.position[1]){
        body.isOn = collBody; 
    }
    updateAABB(body); 
};

const staticColl = ()=>{};
const onCollision = (bodyA, bodyB, contactA, contactB)=>{
    collisionRouter[bodyA.collPriority](bodyA, bodyB, contactA); 
    if(contactB){
        collisionRouter[bodyB.collPriority](bodyB, bodyA, contactB); 
    }
};
const collisionRouter =[
    staticColl,
    playerColl
];
const updateAABB = (body)=>{
    body.prevMin = body.min;
    body.prevMax = body.max;
    body.min = [body.position[0] - body.extents[0],
        body.position[1] - body.extents[1]]; 
    body.max = [body.position[0] + body.extents[0],
        body.position[1] + body.extents[1]];
};
const createWorld = (options = {})=>{
    let state = {}; 
    state.boundsObj = {isBounds: true};
    ({
        gravity: state.gravity = [0,-10],
        boundsMinX: state.boundsMinX = 0,
        boundsMinY: state.boundsMinY = 0,
        boundsMaxX: state.boundsMaxX = 100,
        boundsMaxY: state.boundsMaxY = 100,
        gridSize: state.gridSize = 10,
    } = options); 
    state.groundPlane = {
        isGroundplane: true, 
        position:[0,state.boundsMinY]
    };
    state.bodies = [];
    state.dynamicBodies = []; 
    state._uniqID = 0; 
    return state; 
};
const step = (step, world)=>{
    moveDynamicBodies(step, world); 
    collisionCheck(world);
};
const moveDynamicBodies = (step, world)=>{
    _.each(world.dynamicBodies, (body)=>{
        body.prevPosition = body.position; 
        if(body.isOn){
            body.isDirty = body.isDirty || isOffFloor(body, body.isOn);
        }
        if(body.isDirty){
            body.isOn = false; 
            body.isDirty = false; 
        }
        if(body.isOn){
            body.velocity = [0,0]; 
        }
        if(body.useGravity && !body.isOn){
            body.velocity = sum(body.velocity, world.gravity, (vel, grav)=> vel + grav * step);
        }
        body.position = sum(body.position, body.velocity, (pos, vel)=> pos + vel * step);
        _.each(body.impulses, (impulse)=>{
            body.position = sum(body.position, impulse, (pos, imp)=> pos + imp * step); 
        });
        body.impulses.length = 0; 
        
    });
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
        checkBounds(dBody, world);
        _.each(world.bodies, (collBody)=>{
            //make sure the body isn't itself. and making sure it hasn't collided already
            if(dBody.id !== collBody.id && !dBody.bodiesChecked[collBody.id]){
                //making sure we don't do the same collision check twice
                if(collBody.bodiesChecked !== undefined){
                    collBody.bodiesChecked[dBody.id]; 
                }
                if(dBody.min[0] < collBody.max[0] && dBody.max[0] > collBody.min[0] &&
                    dBody.min[1] < collBody.max[1] && dBody.max[1] > collBody.min[1]){
                    if(dBody.isRocket || collBody.isRocket){
                        if(dBody.isRocket){
                            dBody.collisionCB(dBody, collBody); 
                        }
                        if(collBody.isRocket){
                            collBody.collisionCB(dBody, collBody); 
                        }
                    }
                    else if(dBody.isPlayer && collBody.isPlayer){
                        const contacts = dynamicCollisions(dBody, collBody); 
                        onCollision(dBody, collBody, contacts[0], contacts[1]);
                    }else{
                        const contact = axisAABBIntersect(dBody, collBody); 
                        onCollision(dBody, collBody, contact); 
                    }
                }
            }
        });
    });
};
const axisAABBIntersect = (bodyA, bodyB)=>{
    if(bodyA.prevMin[1] < bodyB.prevMax[1] && bodyB.prevMin[1] < bodyA.prevMax[1]){
        const offset = (bodyA.position[0] > bodyB.position[0])? 
            bodyB.max[0] - bodyA.min[0]: bodyB.min[0] - bodyA.max[0];
        return {
            axis: 0,
            offset
        };
    }else{
        const offset = (bodyA.position[1] > bodyB.position[1])? 
            bodyB.max[1] - bodyA.min[1] : bodyA.max[1] - bodyB.min[1];
        return {
            axis: 1,
            offset
        };
    }   
};
const dynamicCollisions = (bodyA, bodyB)=>{
    const result = axisAABBIntersect(bodyA, bodyB); 
    const halfOffset = result.offset * 0.5; 
    const distTraveledA = (bodyA.position[result.axis] - bodyA.prevPosition[result.axis]) * -1; 
    let bodyAOffset; 
    if(distTraveledA >= 0){
        bodyAOffset = Math.min(halfOffset, distTraveledA);
    }else{
        bodyAOffset = Math.max(halfOffset, distTraveledA); 
    }
    //we are checking if one character landed on the other
    if(result.axis === 1){
        if(bodyA.isOn){
            return[{
                axis: result.axis,
                offset: 0
            },
            {
                axis: result.axis,
                offset: result.offset
            }]
        }
        if(bodyB.isOn){
            return [result, null]
        }
    }
    //the characters are not standing on each other
    return [{
        axis: result.axis,
        offset: halfOffset
    },
    {
        axis: result.axis,
        offset: halfOffset * -1
    }];  
};
const isOffFloor = (body, floor)=>{
    return !floor.isGroundplane && 
    (body.min[0] > floor.max[0] || body.max[0] < floor.min[0])
}

const rayAABBIntersection = (min, max, dir)=>{
    const result = {}; 
    const origin = [min[0] + max[0] / 2,
        min[1] + max[1] / 2]; 
    const xPlane = (dir[0] > 0) ? max[0] : min[0]; 
    const yPlane = (dir[1] > 0) ? max[1] : min[1]; 
    const xDist = dir[0] / (xPlane - origin[0]);
    const yDist = dir[1] / (yPlane - origin[1]);
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

let returns = {
    createWorld,
    createBody,
    addBody,
    step
};

    if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = returns;
    }
    exports.config = returns;
  } else {
    window.physics = returns;
  }


})();