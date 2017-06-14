var Main = new Phaser.State();

Main.create = function() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0;
    game.physics.p2.gravity.y = 800;

    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    player = new Dude(game, 100, 100, 'Dude');
    game.add.existing(player);

    game.physics.p2.enable(player, DEBUG_MODE);
    player.body.clearShapes();
    player.body.addRectangle(20, 50);

    player.body.collideWorldBounds = true;
    player.body.setZeroDamping();
    player.body.setZeroVelocity();
    player.body.fixedRotation = true;

    events.subscribe('player_jump', function() {
        player.body.moveUp(200);
    }, this);
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
