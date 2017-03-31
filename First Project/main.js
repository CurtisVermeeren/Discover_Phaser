// Create the first and only state
var mainState = {
	preload: function(){
		// Load sprite image
		game.load.image('logo', 'logo.png');
	},

	create: function(){
		// Creat the sprite
		this.sprite = game.add.sprite(200,150,'logo');
	},

	update: function(){
		// Rotate the sprite
		this.sprite.angle += 1;
	},

};


// Init the phaser game
var game = new Phaser.Game(400,300,Phaser.AUTO, 'game-div');

// Add and start the main state
game.state.add('main', mainState);
game.state.start('main');
