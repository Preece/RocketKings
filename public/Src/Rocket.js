Rocket = function(game, x, y, name) {

	Phaser.Sprite.call(this, game, x, y, name);

	this.animations.add('idle', ['Lob0001', 'Lob0002'], 14, true, false);
	this.animations.add('idle2', ['Lob0002'], 14, true, false);
	this.play('idle');

	this.xVel = 0;
	this.yVel = 0;

	this.anchor.setTo(0.5);
};

Rocket.prototype = Object.create(Phaser.Sprite.prototype);
Rocket.prototype.constructor = Rocket;

Rocket.prototype.update = function() {
	this.x += this.xVel;
	this.y += this.yVel;
};

Rocket.prototype.Launch = function(vec) {
	vec.setMagnitude(10);

	this.xVel = vec.x * -1;
	this.yVel = vec.y * -1;

	//this.rotation = Math.atan2(vec.x, vec.y);
};