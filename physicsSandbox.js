module.exports = (io)=> {
    p2 = require('p2');
    config = require('./public/Src/config'); 
    console.log(config); 
    const timestep = 1/100; 
    let uncalcdTime = 0; 
    let frameNum = 0; 
    
    const world = new p2.World({gravity:[0,-9.82]}); 
    let boxes = require('./boxStartup')(p2, world); 

    console.log(boxes[0].velocity); 
    const serializeBody = (body)=> {
        return {x: body.position[0], y: body.position[1], width: body.shapes[0].width, height: body.shapes[0].height };
    };
    const updateLoop = (hr)=>{
        let now = Date.now(); 
        delta = now - lastFrame; 
        uncalcdTime += delta / 1000;
        if(uncalcdTime > timestep){
            world.step(timestep); 
            frameNum++; 
            uncalcdTime -= timestep;
            io.emit('p2', boxes.map(serializeBody));
        }
        lastFrame = now; 
        setImmediate(updateLoop);
    };

    lastFrame = Date.now();
    updateLoop();
};