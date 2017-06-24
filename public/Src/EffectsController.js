MAX_FLUFF_SPEED = 20;

EffectsController = function() {
    var that = this;

    this.timers = new TimerUtil();

};



EffectsController.prototype.Update = function() {

};


EffectsController.prototype.Explosion = function(src) {
    var boom = game.add.sprite(src.x - 100, src.y - 100, 'Dude');
    boom.animations.add('boom', ['Shield0000', 'Shield0001', 'Shield0002', 'Shield0003', 'Shield0004', 'Shield0005', 'Shield0006'], 24, false, false);
    boom.animations.play('boom');
    boom.animations.currentAnim.killOnComplete = true;
};
