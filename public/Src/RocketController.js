RocketController = function() {

};

RocketController.prototype.CreateRocket = function(orig, vec) {

	var rocket = new Rocket(game, orig.x - (30 * vec.x), orig.y - (30 * vec.y), 'Dude');
	game.add.existing(rocket);

	game.physics.p2.enable(rocket, DEBUG_MODE);
    rocket.body.setRectangle(20, 20, 0, 0);

    rocket.body.collideWorldBounds = true;
    //rocket.body.setZeroDamping();
    rocket.body.setZeroVelocity();
    rocket.body.fixedRotation = true;

    rocket.body.data.gravityScale = 0;
    rocket.body.onBeginContact.add(rocket.Collide, rocket);

    rocket.body.owningDude = dude.id;

	rocket.Launch(vec);
};