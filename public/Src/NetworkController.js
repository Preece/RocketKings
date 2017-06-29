NetworkController = function() {
	this.socket = io();

	this.socket.on('dude_connect', function(resp) {
		console.log('Dude Connected:', resp);

		//spawn dude
		if(!dude) dude = Main.spawnDude(resp);
	});

	this.socket.on('bro_connect', function(resp) {
		console.log('Bro Connected:', resp);  

		//spawn bro
		if(!bro) bro = Main.spawnDude(resp);
	});

	this.socket.on('physics_update', function(resp) {
		for(var i = 0; i < resp.length; i++) {
		}
	});

	
	//convey the inputs to the server
	events.subscribe('input_space', function(params) {
		this.socket.emit('dudeInput', { id: dude.id, jump: params.pushed });
    }, this);

    events.subscribe('input_left', function(params) {
		this.socket.emit('dudeInput', { id: dude.id, left: params.pushed });
    }, this);

    events.subscribe('input_right', function(params) {
		this.socket.emit('dudeInput', { id: dude.id, right: params.pushed });
    }, this);

    events.subscribe('input_mouse', function(params) {
		this.socket.emit('dudeInput', { ownerId: dude.id, x: params.x, y: params.y });
    }, this);


    //use the servers response to the inputs to update the dudes
    this.socket.on('truth', function(truth) {

		if(truth.jump !== undefined) {
			events.publish('dude_jump', {id: truth.id, jump: truth.jump});

		} else if(truth.left !== undefined) {
			events.publish('dude_run_left', {id: truth.id, run: truth.left});

		} else if(truth.right !== undefined) {
			events.publish('dude_run_right', {id: truth.id, run: truth.right});

		} else if(truth.x !== undefined) {
			events.publish('shoot_rocket', {ownerId: truth.ownerId, x: truth.x, y: truth.y});
		}

		
	});

};

NetworkController.prototype.Update = function() {

};
