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
