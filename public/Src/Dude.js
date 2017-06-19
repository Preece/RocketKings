Dude = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);

    //load up the animations
    FileMap.dudeAnimations.forEach(function(anim) {
        this.animations.add(anim.Name, anim.Frames, anim.Fps, anim.Loop, false);
    }, this);

    this.ChangeState(this.Standing);
    
    this.states = {};
    this.id = -1;

    this.timers = new TimerUtil();

    events.subscribe('dude_jump', function(params) {
        if(params.id === this.id) {
            if(params.jump && this.OnGround()) {
                this.body.moveUp(200);
            }
        }
    }, this);

    events.subscribe('dude_run_left', function(params) {
        if(params.id === this.id) {
            this.states.leftDown = params.run;
        }
    }, this);

    events.subscribe('dude_run_right', function(params) {
        if(params.id === this.id) {
            this.states.rightDown = params.run;
        }
    }, this);
};

Dude.prototype = Object.create(Phaser.Sprite.prototype);
Dude.prototype.constructor = Dude;

Dude.prototype.preStateUpdate = function() {

    if(this.states.leftDown && !this.states.rightDown) {
        this.SetDirection('left');
        this.body.moveLeft(200);
    } else if(this.states.rightDown && !this.states.leftDown) {
        this.SetDirection('right');
        this.body.moveRight(200);
    }
};

Dude.prototype.postStateUpdate = function() {

};

Dude.prototype.update = function() {
    this.preStateUpdate();
    this.state();
    this.postStateUpdate();
};

Dude.prototype.SetDirection = function(dir) {
    if(this.states.direction !== dir && this.animations.paused === false) {
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

Dude.prototype.OnGround = function() {

    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;

    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
    {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];

        if (c.bodyA === this.body.data || c.bodyB === this.body.data)
        {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === this.body.data) d *= -1;
            if (d > 0.5) result = true;
        }
    }
    
    return result;

};

Dude.prototype.PushBack = function(source) {
    var vec = new Phaser.Point(this.x - source.x, this.y - source.y);

    var dist = vec.getMagnitude();

    vec = vec.normalize();

    if(dist < 100) {
        vec.setMagnitude(400);
        this.body.velocity.x += vec.x;
        this.body.velocity.y += vec.y;
    }

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