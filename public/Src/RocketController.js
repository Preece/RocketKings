RocketController = function() {

};

RocketController.prototype.CreateRocket = function(orig, vec) {

	var rocket = new Rocket(game, orig.x, orig.y, 'Dude');
	game.add.existing(rocket);

	game.physics.p2.enable(rocket, DEBUG_MODE);
    rocket.body.setRectangle(20, 20, 0, 0);

    rocket.body.collideWorldBounds = true;
    //rocket.body.setZeroDamping();
    rocket.body.setZeroVelocity();
    rocket.body.fixedRotation = true;

	rocket.Launch(vec);
};