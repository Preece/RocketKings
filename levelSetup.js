createPlane = (x, y, angle, world, p2)=>{
    let body = new p2.Body({mass: 0, position: [x,y], angle});
    body.addShape(new p2.Plane()); 
    world.addBody(body); 
    return body; 
};
module.exports = {
    createBounds: (width, height, world, p2)=>{
        bounds = []; 
        bounds.push(createPlane(0,0, Math.PI / 2, world, p2));
        bounds.push(createPlane(width,0, -Math.PI / 2, world, p2));
        bounds.push(createPlane(0, height, -Math.PI, world, p2));
        bounds.push(createPlane(0, 0, 0, world, p2)); 
        return bounds; 
    }
};