RocketController = function() {

};

RocketController.prototype.CreateRocket = function(orig, vec) {

	var rocket = new Rocket(game, orig.x - 70, orig.y - 90, 'Dude');
	game.add.existing(rocket);

	rocket.Launch(vec);
	

	//rocket.body.velocity = game.physics.arcade.velocityFromRotation(rot, 300);
};