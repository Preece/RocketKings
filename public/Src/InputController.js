InputController = function() {
    var that = this;

    this.timers = new TimerUtil();
    this.allowInput = true;

    this.binds = {};
    this.binds.jump       = Phaser.Keyboard.SPACEBAR;
    this.binds.up         = Phaser.Keyboard.W;
    this.binds.crouch     = Phaser.Keyboard.S;
    this.binds.runLeft    = Phaser.Keyboard.A;
    this.binds.runRight   = Phaser.Keyboard.D;

    game.input.keyboard.onDownCallback = function(e) {

        if(e.repeat) return;

        switch(e.keyCode) {
            case inputController.binds.jump:
                inputController.OnJump(true);
            break;

            case inputController.binds.up:
                inputController.OnUp(true);
            break;

            case inputController.binds.crouch:
                inputController.OnDown(true);
            break;

            case inputController.binds.runLeft:
                inputController.OnLeft(true);
            break;

            case inputController.binds.runRight:
                inputController.OnRight(true);
            break;

        }
    };

    game.input.keyboard.onUpCallback = function(e) {

        switch(e.keyCode) {
            
            case inputController.binds.jump:
                inputController.OnJump(false);
            break;

            case inputController.binds.up:
                inputController.OnUp(false);
            break;

            case inputController.binds.crouch:
                inputController.OnDown(false);
            break;

            case inputController.binds.runLeft:
                inputController.OnLeft(false);
            break;

            case inputController.binds.runRight:
                inputController.OnRight(false);
            break;

        }
    };
};

InputController.prototype.Update = function() {

};


InputController.prototype.OnJump = function(pressed) {

    if(this.allowInput) {
        if(pressed) {
            events.publish('dude_jump', {jump: true});
        } else {
            events.publish('dude_jump', {jump: false});
        }
    } 
};

InputController.prototype.OnLeft = function(pressed) {

    if(this.allowInput) {

        if(pressed) {
            events.publish('dude_run', {run:true, dir:'left'});

        } else {
            events.publish('dude_run', {run:false, dir: 'left'});

        }
    }
};

InputController.prototype.OnRight = function(pressed) {

    if(this.allowInput) {

        if(pressed) {
            events.publish('dude_run', {run:true, dir:'right'});

        } else {
            events.publish('dude_run', {run:false, dir: 'right'});

        }
    }
};

InputController.prototype.OnUp = function(pressed) {

    if(this.allowInput) {
        if(pressed) {
            events.publish('control_up', {pressed: true});
            
        } else {
            events.publish('control_up', {pressed: false});
        }
    }
};

InputController.prototype.OnDown = function(pressed) {

    if(this.allowInput) {
        if(pressed) {
            events.publish('dude_crouch', {crouch: true});
        } else {
            events.publish('dude_crouch', {crouch: false});
        }
    }
};
