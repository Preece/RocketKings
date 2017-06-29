var Main = new Phaser.State();

Main.create = function() {

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0;
    game.physics.p2.gravity.y = 400;

    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    inputController = new InputController();
    networkController = new NetworkController();
    rocketController = new RocketController();
    effectsController = new EffectsController();
};

Main.spawnDude = function(id) {

    dude = new Dude(game, 100, 100, 'Dude');
    dude.id = id;
    game.add.existing(dude);

    game.physics.p2.enable(dude, DEBUG_MODE);
    dude.body.setRectangle(40, 80, -5, 0);

    dude.body.collideWorldBounds = true;
    dude.body.setZeroDamping();
    dude.body.setZeroVelocity();
    dude.body.fixedRotation = true;

    console.log(this.worldToJSON());

    return dude;
};

Main.update = function() {

    // if (this.cursors.left.isDown)
    // {
    //     player.body.moveLeft(200);
    // }
    // else if (this.cursors.right.isDown)
    // {
    //     player.body.moveRight(200);
    // }

    // if (this.cursors.up.isDown)
    // {
    //     player.body.moveUp(200);
    // }
    // else if (this.cursors.down.isDown)
    // {
    //     player.body.moveDown(200);
    // }
};

Main.render = function() {
    //if(!!dude) game.debug.geom( dude.serverGeom, 'rgba(255,0,0,0.5)' ) ;
};

Main.worldToJSON = function() {
    var world = {};
    var p2world = game.physics.p2.world;

    world.applyDamping = p2world.applyDamping;
    world.applyGravity = p2world.applyGravity;
    world.applySpringForces = p2world.applySpringForces;
    world.emitImpactEvent = p2world.emitImpactEvent;
    world.frictionGravity = p2world.frictionGravity;
    world.sleepMode = p2world.sleepMode;
    world.solveConstraints = p2world.solveConstraints;
    world.islandSplit = p2world.islandSplit;
    world.stepping = p2world.stepping;
    world.useFrictionGravityOnZeroGravity = p2world.useFrictionGravityOnZeroGravity;
    world.useWorldGravityAsFrictionGravity = p2world.useWorldGravityAsFrictionGravity;
    world.defaultContactMaterial = p2world.defaultContactMaterial;
    world.defaultMaterial = p2world.defaultMaterial;
    world.gravity = p2world.gravity;
    world.bodies = [];
    
    //world.bodies = p2world.bodies;
    for(var i = 0; i < p2world.bodies.length; i++) {
        var body = {};

        body.angle = p2world.bodies[i].angle;
        body.angularDamping = p2world.bodies[i].angularDamping;
        body.angularForce = p2world.bodies[i].angularForce;
        body.angularVelocity = p2world.bodies[i].angularVelocity;
        body.boundingRadius = p2world.bodies[i].boundingRadius;
        body.ccdIterations = p2world.bodies[i].ccdIterations;
        body.ccdSpeedThreshold = p2world.bodies[i].ccdSpeedThreshold;
        body.collisionResponse = p2world.bodies[i].collisionResponse;
        body.concavePath = p2world.bodies[i].concavePath;
        body.damping = p2world.bodies[i].damping;
        body.fixedRotation = p2world.bodies[i].fixedRotation;
        body.fixedX = p2world.bodies[i].fixedX;
        body.fixedY = p2world.bodies[i].fixedY;
        body.force = p2world.bodies[i].force;
        body.gravityScale = p2world.bodies[i].gravityScale;
        body.inertia = p2world.bodies[i].inertia;
        body.mass = p2world.bodies[i].mass;
        body.massMultiplier = p2world.bodies[i].massMultiplier;
        body.position = p2world.bodies[i].position;
        body.sleepSpeedLimit = p2world.bodies[i].sleepSpeedLimit;
        body.sleepState = p2world.bodies[i].sleepState;
        body.sleepTimeLimit = p2world.bodies[i].sleepTimeLimit;
        body.timeLastSleepy = p2world.bodies[i].timeLastSleepy;
        body.type = p2world.bodies[i].type;
        body.velocity = p2world.bodies[i].velocity;
        body.vlambda = p2world.bodies[i].vlambda;
        body.wantsToSleep = p2world.bodies[i].wantsToSleep;
        body.wlambda = p2world.bodies[i].wlambda;
        body._wakeUpAfterNarrowphase = p2world.bodies[i]._wakeUpAfterNarrowphase;
        body.shapes = [];

        for(var j = 0; j < p2world.bodies[j].shapes.length; j++) {
            var shape = {};

            shape.angle = p2world.bodies[i].shapes[j].angle;
            shape.area = p2world.bodies[i].shapes[j].area;
            shape.boundingRadius = p2world.bodies[i].shapes[j].boundingRadius;
            shape.collisionGroup = p2world.bodies[i].shapes[j].collisionGroup;
            shape.collisionMask = p2world.bodies[i].shapes[j].collisionMask;
            shape.collisionResponse = p2world.bodies[i].shapes[j].collisionResponse;
            shape.material = p2world.bodies[i].shapes[j].material;
            shape.position = p2world.bodies[i].shapes[j].position;
            shape.sensor = p2world.bodies[i].shapes[j].sensor;
            shape.type = p2world.bodies[i].shapes[j].type;

            body.shapes.push(shape);
        }

        world.bodies.push(body);
    }

    return world;
};