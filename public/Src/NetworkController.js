NetworkController = function() {
	this.socket = io();

	this.socket.on('dude_connect', function(resp) {
		console.log('Dude Connected:', resp);

		//spawn dude
		Main.spawnDude(resp);
	});

	this.socket.on('bro_connect', function(resp) {
		console.log('Bro Connected:', resp);

		//spawn bro
		Main.spawnBro(resp);
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


    //use the servers response to the inputs to update the dudes
    this.socket.on('truth', function(truth) {
		console.log('Truth:', truth);

		if(!!truth.jump) {
			events.publish('dude_jump', {id: truth.id, jump: truth.jump});

		} else if(!!truth.left) {
			events.publish('dude_run_left', {id: truth.id, run: truth.left});

		} else if(!!truth.right) {
			events.publish('dude_run_right', {id: truth.id, run: truth.right});

		}

		
	});

};

NetworkController.prototype.Update = function() {

};
