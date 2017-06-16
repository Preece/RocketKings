module.exports = (io)=> {
    p2 = require('p2');
    const objValues = {
        boxes : [
            [2,5,1,1],
            [7,15,1,1],
            [5,7,1,1]
          ],
          planes : [
            [0]
          ]
    };
    const timestep = 1/100; 
    let uncalcdTime = 0; 
    let boxes = []; 
    
    const world = new p2.World({gravity:[0,-9.82]}); 

    groundMat = new p2.Material(); 
    objMat = new p2.Material(); 
    world.addContactMaterial(new p2.ContactMaterial(groundMat, objMat, { friction: 0 , restitution: 0, relaxation:200, stiffness:15}));

    const createBox = (x, y, width, height)=>{
        let shape = new p2.Box({width: width, height: height, material: objMat});
        let body = new p2.Body({mass:1, position: [x,y]});
        body.addShape(shape);
        world.addBody(body); 
        boxes.push(body); 
    };

    const createPlane = (y)=>{
        let shape = new p2.Plane({material: groundMat});
        let body = new p2.Body({mass: 0, position:[0,y]});
        body.addShape(shape); 
        world.addBody(body); 
    };

    const serializeBody = (body)=> {
        return {x: body.position[0], y: body.position[1], width: body.shapes[0].width, height: body.shapes[0].height };
    };
    const updateLoop = (hr)=>{
        let now = Date.now(); 
        delta = now - lastFrame; 
        uncalcdTime += delta / 1000;
        if(uncalcdTime > timestep){
            world.step(timestep); 
            uncalcdTime -= timestep;
            io.emit('p2', boxes.map(serializeBody));
        }
        lastFrame = now; 
        setImmediate(updateLoop);
    };

    objValues.boxes.forEach((box)=>createBox.apply(this, box)); 
    objValues.planes.forEach((plane)=>createPlane.apply(this, plane)); 
    lastFrame = Date.now();
    updateLoop();
};