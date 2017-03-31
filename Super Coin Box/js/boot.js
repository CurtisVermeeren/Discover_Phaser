var Platformer = {};

Platformer.gameProperties = {
	gameWidth: 500,
	gameHeight: 340,
	score: 0,
};

Platformer.bootState = {
	preload: function(){
		// Load the image
		game.load.image('progressBar', 'assets/progressBar.png');
	},

	create: function(){
		// Set game settings
		game.stage.backgroundColor = '#3498db';
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Scaling
		if (!game.device.desktop){
			// Set the type of scaling to show all
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

			document.body.style.backgroundColor = '#3498db';

			// Set the min and max width and height
			game.scale.minWidth = 250;
			game.scale.maxWidth = document.documentElement.clientWidth;
			game.scale.minHeight = 170;
			game.scale.maxHeight = document.documentElement.clientHeight;

			// Center the game on the screen
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;

			// Apply the scale changes
			game.scale.updateLayout(true);
		}

		// Start the load state
		game.state.start(Platformer.states.load);
	}
};
