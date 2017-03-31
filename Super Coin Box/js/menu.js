Platformer.menuState = {
	create: function(){
		// Add a background image
		game.add.image(0,0,'background');

		// Display the name of the game
		var nameLabel = game.add.text(game.world.centerX, -50,
		 	'Super coin Box', {font: '70px Geo', fill: '#ffffff'});
		nameLabel.anchor.setTo(0.5,0.5);
		var nameTween = game.add.tween(nameLabel);
		nameTween.to({y: game.world.height * 0.25}, 1000)
			.easing(Phaser.Easing.Bounce.Out)
			.start();

		// Save local highscore
		// If there is no local score set to 0
		if (!localStorage.getItem('bestScore')){
			localStorage.setItem('bestScore', 0);
		}

		// If the score is higher than the best update local highscore
		if (Platformer.gameProperties.score > localStorage.getItem('bestScore')){
			localStorage.setItem('bestScore', Platformer.gameProperties.score);
		}

		// Show the score at the center of the screen
		var text = 'Score: '+ Platformer.gameProperties.score + '\nBest Score: '+
			localStorage.getItem('bestScore');
		var scoreLabel = game.add.text(game.world.centerX, game.world.centerY,
			text, {font: '25px Arial', fill: '#ffffff'});
		scoreLabel.anchor.setTo(0.5,0.5);

		// Start game instructions
		if (game.device.desktop){
			var text = 'Press the up arrow key to start';
		} else {
			var text = 'Touch the screen to start';
		}

		var startLabel = game.add.text(game.world.centerX, game.world.height * 0.75,
			text, {font: '25px Arial', fill: '#ffffff'});
		startLabel.anchor.setTo(0.5,0.5);
		var startTween = game.add.tween(startLabel)
			.to({angle: -2}, 500)
			.to({angle: 2}, 500)
			.loop()
			.start();

		// Create a phaser keyboard variable
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

		// When the 'upKey' is pressed it will call start
		upKey.onDown.addOnce(this.start, this);
		game.input.onDown.addOnce(this.start, this);

		//Add mute bottons
		this.muteButton = game.add.button(20,20,'mute', this.toggleSound, this);
		// If the mouse is over the button it becomes hand cursor
		this.muteButton.input.useHandCursor = true;

		// If the game is already muted
		if (game.sound.mute){
			this.muteButton.frame = 1;
		}

	},

	start: function(){
		// Start the game
		game.state.start('play');
	},

	toggleSound: function(){
		// Set the mute as opposite of current
		game.sound.mute = !game.sound.mute;
		// Change the button frame
		this.muteButton.frame = game.sound.mute ? 1:0;
	}
};
