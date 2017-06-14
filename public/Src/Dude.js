Dude = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);

    //load up the animations
    FileMap.dudeAnimations.forEach(function(anim) {
        this.animations.add(anim.Name, anim.Frames, anim.Fps, anim.Loop, false);
    }, this);

    this.ChangeState(this.Standing);
    
    this.states = {};

    this.timers = new TimerUtil();

    events.subscribe('dude_jump', function(params) {
        if(params.jump) {
            this.body.moveUp(200);
        }
    }, this);

    events.subscribe('dude_run', function(params) {
        if(params.run) {
            if(params.dir === 'left') {
                this.body.moveLeft(200);

            } else {
                this.body.moveRight(200);
                
            }
        }
    }, this);
};

Dude.prototype = Object.create(Phaser.Sprite.prototype);
Dude.prototype.constructor = Dude;

Dude.prototype.preStateUpdate = function() {

};

Dude.prototype.postStateUpdate = function() {

};

Dude.prototype.update = function() {
    this.preStateUpdate();
    this.state();
    this.postStateUpdate();
};

Dude.prototype.SetDirection = function(dir) {
    if(this.states.direction !== dir && this.animations.paused === false && !this.InAttackAnim()) {
        this.states.direction = dir;

        dir === 'left' ? this.scale.x = -1 : this.scale.x = 1;
    }
};

Dude.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name) {
        this.animations.play(name);
    }
};

Dude.prototype.ChangeState = function(newState) {
    this.state = newState;
};

Dude.prototype.Reset = function() {
    
};


////////////////ACTIONS//////////////////
Dude.prototype.Run = function(params) {

};

Dude.prototype.StartStopRun = function(params) {
   
};

Dude.prototype.Jump = function(params) {

};

Dude.prototype.Hit = function(e, damage, grace_duration) {

};

//////////////////STATES/////////////////
Dude.prototype.Standing = function() {
    this.PlayAnim('stand');
};

Dude.prototype.Running = function() {

};

Dude.prototype.Jumping = function() {

};
