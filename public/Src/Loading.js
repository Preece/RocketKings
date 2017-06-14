var Loading = new Phaser.State();

Loading.preload = function() {
    
    //load images
    FileMap.Images.forEach(function(img) {
        game.load.image(img.Name, img.File);
    });

    //load atlases
    FileMap.Atlas.forEach(function(atlas) {
        game.load.atlasJSONHash(atlas.Name, atlas.Img, atlas.File);
    });

    //load audio
    FileMap.Audio.forEach(function(audio) {
        game.load.audio(audio.Name, audio.File);
    });

    //load music
    FileMap.Music.forEach(function(music) {
        game.load.audio(music.Name, music.File);
    });

    FileMap.Ambient.forEach(function(music) {
        game.load.audio(music.Name, music.File);
    });

};

Loading.create = function() {

    //game.add.plugin(Phaser.Plugin.Debug);

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0.8;

    game.time.advancedTiming = true;
    game.time.desiredFps = 60;

    game.state.start('Main', false, false);

};
