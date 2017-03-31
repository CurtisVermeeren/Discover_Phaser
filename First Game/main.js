// Create the main game state
var mainState = {
	preload: function(){
		game.load.image('player', 'assets/player.png');
		game.load.image('wallV', 'assets/wallVertical.png');
		game.load.image('wallH', 'assets/wallHorizontal.png');
		game.load.image('coin', 'assets/coin.png');
		game.load.image('enemy', 'assets/enemy.png');
	},

	create: function(){
		game.stage.backgroundColor = '#3498db';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.player = game.add.sprite(game.world.centerX,game.world.centerY,'player');
		this.player.anchor.setTo(0.5,0.5);
		// Tell phaser that the player will use arcade physics
		game.physics.arcade.enable(this.player);
		// Add gravity to the player
		this.player.body.gravity.y = 500;
		// Controlling the player
		this.cursor = game.input.keyboard.createCursorKeys();
		// Create the world
		this.createWorld();
		// Add the coin
		this.coin = game.add.sprite(60,140,'coin');
		// Add physics to the coin
		game.physics.arcade.enable(this.coin);
		this.coin.anchor.setTo(0.5,0.5);
		// Add score text
		this.scoreLabel = game.add.text(30,30, 'score: 0',
			{font: '18px Arial', fill: '#ffffff'});
		// Init the score value
		this.score = 0;
		// Create an enemy group with arcade physics
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		// Create 10 enemies with the enemy image
		this.enemies.createMultiple(10,'enemy');
		// Call add enemy every 2.2 seconds
		game.time.events.loop(2200, this.addEnemy, this);

	},

	update: function(){
		game.physics.arcade.collide(this.player, this.walls);
		this.movePlayer();
		// Check if the player has left the game world
		if (!this.player.inWorld){
			this.playerDie();
		}
		// Check if the player overlaps with a coin
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

		// Make the enemies and walls collide
		game.physics.arcade.collide(this.enemies, this.walls);
		// Call player die when it overlaps an enemy
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

	},

	movePlayer: function(){
		if (this.cursor.left.isDown){
			this.player.body.velocity.x = -200;	// Move left
		} else if (this.cursor.right.isDown) {
			this.player.body.velocity.x = 200;	// Move right
		} else {
			this.player.body.velocity.x = 0;	// Stand still
		}

		if (this.cursor.up.isDown && this.player.body.touching.down) {
			this.player.body.velocity.y = -320; // Jumping
		}
	},

	createWorld: function(){
		// Create a new group for walls
		this.walls = game.add.group();
		// Add physics to the whole group
		this.walls.enableBody = true;
		// Create 10 walls in the group
		game.add.sprite(0, 0, 'wallV', 0, this.walls); 		// Left
		game.add.sprite(480, 0, 'wallV', 0, this.walls); 	// Right
		game.add.sprite(0, 0, 'wallH', 0, this.walls); 		// Top left
		game.add.sprite(300, 0, 'wallH', 0, this.walls); 	// Top right
		game.add.sprite(0, 320, 'wallH', 0, this.walls); 	// Bottom left
		game.add.sprite(300, 320, 'wallH', 0, this.walls);	// Bottom right
		game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
		game.add.sprite(400, 160, 'wallH', 0, this.walls); 	// Middle right

		var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
		middleTop.scale.setTo(1.5, 1);
		var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
		middleBottom.scale.setTo(1.5, 1);


		// Set all walls immovable.
		this.walls.setAll('body.immovable', true);
	},

	playerDie: function(){
		game.state.start('main');
	},

	takeCoin: function(player, coin){
		// Increase the score
		this.score += 5;
		// Update score text
		this.scoreLabel.text = 'score: '+ this.score;

		// Change the coin positions
		this.updateCoinPosition();
	},

	updateCoinPosition: function(){
		// Store all possible coin positions
		var coinPosition = [
			{x: 140, y: 60}, {x: 360, y: 60}, // Top row
			{x: 60, y: 140}, {x: 440, y: 140}, // Middle row
			{x: 130, y: 300}, {x: 370, y: 300} // Bottom row
		];

		// Remove the current coin position
		for (var i = 0; i < coinPosition.length; i++){
			if (coinPosition[i].x === this.coin.x){
				coinPosition.splice(i,1);
			}
		}

		// Randomly select a position from the array
		var newPosition = coinPosition[game.rnd.integerInRange(0,coinPosition.length-1)];

		// Set the new coint position
		this.coin.reset(newPosition.x, newPosition.y);
	},

	addEnemy: function(){
		// Get the the first dead enemy of the group
		var enemy = this.enemies.getFirstDead();
		// If there isn't any dead enemy do nothing
		if (!enemy){
			return;
		}
		// Init the enemy
		// Make the enemy fall from the hole at the top of the map
		enemy.anchor.setTo(0.5,1);
		enemy.reset(game.world.centerX,0);
		enemy.body.gravity.y = 500;
		// Will move horizontally either +100 or -100
		enemy.body.velocity.x = 100 * game.rnd.sign();
		// Giving bounce value of 1 will bounce enemy when a wall is hit
		enemy.body.bounce.x = 1;
		// Will kill the sprite when it is no longer in the world
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	}

};


// Init the phaser Game
var game = new Phaser.Game(500,340,Phaser.AUTO, 'game-div');

// Add and start states
game.state.add('main', mainState);
game.state.start('main');
