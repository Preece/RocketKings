const p2 = require('p2');

function mpx(v) { return v * 20; };
function pxm(v) { return v * 0.05; };
function mpxi(v) { return v * -20; };
function pxmi(v) { return v * -0.05; };

module.exports = {
	createWorld: function(io, roadID) {
		var that = this;

		var world = new p2.World({
	        gravity: [0, -10]
	    });

		Object.assign(world.defaultContactMaterial, {
			friction: 0.3,
			restitution: 0,
			stiffness: 1000000,
			relaxation: 4,
		});


	    planeShape = new p2.Plane();
	    planeBody = new p2.Body({
	      position:[0,-15]
	    });
	    planeBody.addShape(planeShape);
	    world.addBody(planeBody);

	    var timeStep = 1 / 60;

		setInterval(function(){

		    world.step(timeStep);

		    var physicsBlob = [];

		    for(var i = 0; i < world.bodies.length; i++) {
                physicsBlob.push(that.serializeBody(world.bodies[i]));
            }

		    io.to(roadID).emit('physics_update', physicsBlob); 
		 
		}, 1000 * timeStep);


		return world;
	},

	serializeBody: function(body) {
		return { id: body.dudeId, x: body.position[0], y: body.position[1], width: body.shapes[0].width, height: body.shapes[0].height };
	},

	addDude: function(world, id) {
		var dudeShape = new p2.Box({ width: 1, height: 2 });
	    this.dudeBody = new p2.Body({
	      mass: 1,
	      position:[10,3],
	      fixedRotation: true
	    });
	    this.dudeBody.addShape(dudeShape);
	    this.dudeBody.damping = 0.5;
	    this.dudeBody.dudeId = id;
	     
	    world.addBody(this.dudeBody);
	}
};