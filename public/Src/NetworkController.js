NetworkController = function() {
	this.socket = io();

	this.socket.on('dude_connect', function(resp) {
		console.log('Dude Connected:', resp);

		//spawn dude
		Main.spawnDude();
	});

	this.socket.on('bro_connect', function(resp) {
		console.log('Bro Connected:', resp);

		//spawn bro
		Main.spawnBro();
	});

	this.socket.on('truth', function(truth) {
		console.log('Response:', truth);
	});



	events.subscribe('dude_jump', function(params) {
		this.socket.emit('dudeInput', { jump: params.jump });
    }, this);

    events.subscribe('dude_run', function(params) {
    	if(params.dir === 'left') {
			this.socket.emit('dudeInput', { left: params.run });

    	} else {
			this.socket.emit('dudeInput', { right: params.run });
    		
    	}
    }, this);


};

NetworkController.prototype.Update = function() {

};
