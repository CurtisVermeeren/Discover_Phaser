Platformer.loadState = {
	preload: function () {
		// Add a 'loading...' label on the screen
		var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',
		{ font: '30px Arial', fill: '#ffffff' });
		loadingLabel.anchor.setTo(0.5, 0.5);

		// Display the progress bar
		var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);

		// Load all our assets
		game.load.spritesheet('player', 'assets/player2.png', 20,20);
		game.load.image('enemy', 'assets/enemy.png');
		game.load.image('coin', 'assets/coin.png');

		// Load a new asset that we will use in the menu state
		game.load.image('background', 'assets/background.png');

		// Load game audio
		// Phaser can determine which file to load based on browser
		game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
		game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
		game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);

		// Load the particle images
		game.load.image('pixel', 'assets/pixel.png');

		// Load the mute button
		game.load.spritesheet('mute', 'assets/muteButton.png', 28,22);

		// Load the tilemap
		game.load.image('tileset', 'assets/tileset.png');
		game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);

		// Load button icons
		game.load.image('jumpButton', 'assets/jumpButton.png');
		game.load.image('rightButton', 'assets/rightButton.png');
		game.load.image('leftButton', 'assets/leftButton.png');
	},

	create: function(){
		game.state.start('menu');
	}

};
