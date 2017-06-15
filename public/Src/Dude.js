Dude = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);
    this.anchor.setTo(0.5);

    dudeShape = new p2.Box({ width: 1, height: 2 });
    this.dudeBody = new p2.Body({
      mass: 1,
      position:[10,3],
      fixedRotation: true
    });
    this.dudeBody.addShape(dudeShape);
    this.dudeBody.damping = 0.5;
     
    Main.world.addBody(this.dudeBody);

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
            if(params.jump && this.CanJump()) this.dudeBody.velocity[1] = 20;
        }
    }, this);

    events.subscribe('dude_run_left', function(params) {
        if(params.id === this.id) {
            this.runningLeft = params.run;
        }
    }, this);

    events.subscribe('dude_run_right', function(params) {
        if(params.id === this.id) {
            this.runningRight = params.run;
        }
    }, this);

    events.subscribe('update_geom', function(params) {
        if(params.id === this.id) {
            console.log(params)
            this.serverGeom.setTo(params.x * 20, params.y * -20, params.width * 20, params.height * 20);
        }
    }, this);

    this.serverGeom = new Phaser.Rectangle(0, 0, 0, 0);
};

Dude.prototype = Object.create(Phaser.Sprite.prototype);
Dude.prototype.constructor = Dude;

Dude.prototype.preStateUpdate = function() {
    this.x = this.dudeBody.position[0] * 20 + 10;
    this.y = this.dudeBody.position[1] * -20 + 20;

    //this.serverGeom.setTo(this.x - 10, this.y - 10, 20, 40);

    if(this.runningLeft) {
        this.dudeBody.velocity[0] = -20;
    } else if(this.runningRight) {
        this.dudeBody.velocity[0] = 20;
    } else {
        this.dudeBody.velocity[0] = 0;
    }

    //this.dudeBody.velocity[0] = 20;
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

Dude.prototype.CanJump = function() {
    var yAxis = p2.vec2.fromValues(0,1);
    var result = false;

    for(var i=0; i<Main.world.narrowphase.contactEquations.length; i++) {
        var c = Main.world.narrowphase.contactEquations[i];
        if(c.bodyA === this.dudeBody || c.bodyB === this.dudeBody) {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if(c.bodyA === this.dudeBody) d *= -1;
            if(d > 0.5) result = true;
        }
    }

    return result;
}


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
