module.exports = (p2, world)=> {
    let boxes = []; 
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
    objValues.boxes.forEach((box)=>createBox.apply(this, box)); 
    objValues.planes.forEach((plane)=>createPlane.apply(this, plane)); 
    return boxes; 
};