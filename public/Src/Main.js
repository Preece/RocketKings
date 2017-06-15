var Main = new Phaser.State();

Main.create = function() {

    this.world = new p2.World({
        gravity: [0, -80]
    });

    this.world.defaultContactMaterial.friction = 0.5;
    this.world.setGlobalStiffness(1e5);

    planeShape = new p2.Plane();
    planeBody = new p2.Body({
      position:[0,-15]
    });
    planeBody.addShape(planeShape);
    this.world.addBody(planeBody);

    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    inputController = new InputController();
    networkController = new NetworkController();
    rocketController = new RocketController();

    var timeStep = 1 / 60;

    setInterval(function(){

        Main.world.step(timeStep);
     
    }, 1000 * timeStep);
};

Main.spawnDude = function(id) {

    var duder = new Dude(game, 0, 0, 'Dude');
    duder.id = id;
    game.add.existing(duder);
    return duder;
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
