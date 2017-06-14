Player = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);

    game.physics.p2.enable(this);
    this.body.collideWorldBounds = true;

    //load up the animations
    FileMap.playerAnimations.forEach(function(anim) {
        this.animations.add(anim.Name, anim.Frames, anim.Fps, anim.Loop, false);
    }, this);

    this.ChangeState(this.Standing);
    
    this.states = {};

    this.timers = new TimerUtil();


    //events.subscribe('player_jump', this.Jump, this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.preStateUpdate = function() {

};

Player.prototype.postStateUpdate = function() {

};

Player.prototype.update = function() {
    this.preStateUpdate();
    this.state();
    this.postStateUpdate();
};

Player.prototype.SetDirection = function(dir) {
    if(this.states.direction !== dir && this.animations.paused === false && !this.InAttackAnim()) {
        this.states.direction = dir;

        dir === 'left' ? this.scale.x = -1 : this.scale.x = 1;
    }
};

Player.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name) {
        this.animations.play(name);
    }
};

Player.prototype.ChangeState = function(newState) {
    this.state = newState;
};

Player.prototype.Reset = function() {
    
};


////////////////ACTIONS//////////////////
Player.prototype.Run = function(params) {

};

Player.prototype.StartStopRun = function(params) {
   
};

Player.prototype.Jump = function(params) {

};

Player.prototype.Hit = function(e, damage, grace_duration) {

};

//////////////////STATES/////////////////
Player.prototype.Standing = function() {
    this.PlayAnim('stand');
};

Player.prototype.Running = function() {

};

Player.prototype.Jumping = function() {

};
