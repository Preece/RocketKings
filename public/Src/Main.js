var Main = new Phaser.State();

Main.create = function() {
    player = new Player(game, 0, 0, 'Player');
    game.add.existing(player);

    player.body.setZeroDamping();
    player.body.fixedRotation = true;

    this.cursors = game.input.keyboard.createCursorKeys();

};

Main.update = function() {

    player.body.setZeroVelocity();

    if (this.cursors.left.isDown)
    {
        player.body.moveLeft(200);
    }
    else if (this.cursors.right.isDown)
    {
        player.body.moveRight(200);
    }

    if (this.cursors.up.isDown)
    {
        player.body.moveUp(200);
    }
    else if (this.cursors.down.isDown)
    {
        player.body.moveDown(200);
    }
};

Main.render = function() {
    
};
