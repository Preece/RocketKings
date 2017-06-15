InputController = function() {
    var that = this;

    this.timers = new TimerUtil();
    this.allowInput = true;

    this.binds = {};
    this.binds.space       = Phaser.Keyboard.SPACEBAR;
    this.binds.up         = Phaser.Keyboard.W;
    this.binds.down     = Phaser.Keyboard.S;
    this.binds.left    = Phaser.Keyboard.A;
    this.binds.right   = Phaser.Keyboard.D;

    game.input.keyboard.onDownCallback = function(e) {

        if(e.repeat) return;

        switch(e.keyCode) {
            case inputController.binds.space:
                events.publish('input_space', {pushed: true});
                events.publish('dude_jump', {id: dude.id, jump: true});
            break;

            case inputController.binds.up:
                events.publish('input_up', {pushed: true});
            break;

            case inputController.binds.down:
                events.publish('input_down', {pushed: true});
            break;

            case inputController.binds.left:
                events.publish('input_left', {pushed: true});
                events.publish('dude_run_left', {id: dude.id, run: true});
            break;

            case inputController.binds.right:
                events.publish('input_right', {pushed: true});
                events.publish('dude_run_right', {id: dude.id, run: true});

            break;

        }
    };

    game.input.keyboard.onUpCallback = function(e) {

        switch(e.keyCode) {
            
            case inputController.binds.space:
                events.publish('input_space', {pushed: false});

            break;

            case inputController.binds.up:
                events.publish('input_up', {pushed: false});
            break;

            case inputController.binds.down:
                events.publish('input_down', {pushed: false});
            break;

            case inputController.binds.left:
                events.publish('input_left', {pushed: false});

            break;

            case inputController.binds.right:
                events.publish('input_right', {pushed: false});

            break;

        }
    };

    game.input.onDown.add(function(e) {
        //console.log(e);
        var rot = Math.atan2();

        var vec = new Phaser.Point(dude.x - game.input.mousePointer.x, dude.y - game.input.mousePointer.y);
        vec = vec.normalize();

        rocketController.CreateRocket({x: dude.x, y: dude.y}, vec);
    }, this);
};

InputController.prototype.Update = function() {

};
