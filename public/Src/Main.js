var Main = new Phaser.State();

Main.create = function() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0;
    game.physics.p2.gravity.y = 800;

    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    inputController = new InputController();
    networkController = new NetworkController();
};

Main.spawnDude = function() {

    dude = new Dude(game, 100, 100, 'Dude');
    game.add.existing(dude);

    game.physics.p2.enable(dude, DEBUG_MODE);
    dude.body.clearShapes();
    dude.body.addRectangle(20, 50);

    dude.body.collideWorldBounds = true;
    dude.body.setZeroDamping();
    dude.body.setZeroVelocity();
    dude.body.fixedRotation = true;
};

Main.spawnBro = function() {
    bro = new Dude(game, 100, 100, 'Dude');
    game.add.existing(bro);

    game.physics.p2.enable(bro, DEBUG_MODE);
    bro.body.clearShapes();
    bro.body.addRectangle(20, 50);

    bro.body.collideWorldBounds = true;
    bro.body.setZeroDamping();
    bro.body.setZeroVelocity();
    bro.body.fixedRotation = true;
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

};
