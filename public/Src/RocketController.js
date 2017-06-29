RocketController = function() {

	events.subscribe('shoot_rocket', function(params) {
		var source = dude;

		console.log(params.ownerId, dude.id);

		if(!!dude && params.ownerId === dude.id) {
			source = dude;
		} else if(!!bro && params.ownerId === bro.id) {
			source = bro;
		} else {
			console.log('Unknown rocket origin: ' + params.ownerId);
		}

		var vec = new Phaser.Point(source.x - params.x, source.y - params.y);
        vec = vec.normalize();

        rocketController.CreateRocket({x: source.x, y: source.y}, vec);
	}, this);
};

RocketController.prototype.CreateRocket = function(orig, vec) {

	var rocket = new Rocket(game, orig.x - (30 * vec.x), orig.y - (30 * vec.y), 'Dude');
	game.add.existing(rocket);

	game.physics.p2.enable(rocket, DEBUG_MODE);
    rocket.body.setRectangle(40, 20, 0, 0);

    rocket.body.collideWorldBounds = true;
    //rocket.body.setZeroDamping();
    rocket.body.setZeroVelocity();
    rocket.body.fixedRotation = true;

    rocket.body.data.gravityScale = 0;
    rocket.body.onBeginContact.add(rocket.Collide, rocket);

    rocket.body.owningDude = dude.id;

	rocket.Launch(vec);
    dude.Recoil(vec);
};