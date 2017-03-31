Platformer.playState = {

	create: function(){
		//Create Sounds
		this.jumpSound = game.add.audio('jump');
		this.coinSound = game.add.audio('coin');
		this.deadSound = game.add.audio('dead');

		// Add the player
		this.player = game.add.sprite(game.world.centerX,game.world.centerY,'player');
		this.player.anchor.setTo(0.5,0.5);
		// Tell phaser that the player will use arcade physics
		game.physics.arcade.enable(this.player);
		// Add gravity to the player
		this.player.body.gravity.y = 500;
		// Controlling the player
		this.cursor = game.input.keyboard.createCursorKeys();
		// Allow player to use WASD
		this.wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D)
		};
		// Create the right animation loop
		this.player.animations.add('right', [1,2], 8, true);
		// Create the left animation loop
		this.player.animations.add('left', [3,4], 8, true);

		// Add the coin
		this.coin = game.add.sprite(60,140,'coin');
		// Add physics to the coin
		game.physics.arcade.enable(this.coin);
		this.coin.anchor.setTo(0.5,0.5);

		// Add score text
		this.scoreLabel = game.add.text(30,30, 'score: 0',
			{font: '18px Arial', fill: '#ffffff'});

		// Init the score value
		Platformer.gameProperties.score = 0;

		// Create an enemy group with arcade physics
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		// Create 10 enemies with the enemy image
		this.enemies.createMultiple(10,'enemy');

		// Create the world
		this.createWorld();

		// Contains the time of the next enemy creations
		this.nextEnemy = 0;

		// Create the particle emitter
		this.emitter = game.add.emitter(0,0,15);
		// Set the pixel image for the particles
		this.emitter.makeParticles('pixel');
		// Set random speeds for the particles
		this.emitter.setYSpeed(-150,150);
		this.emitter.setXSpeed(-150,150);
		// Disable gravity
		this.emitter.gravity.setTo(0,0);

		//Capture Phaser controls
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
			Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

		// If not on a desktop use mobile controls
		if (!game.device.desktop){
			this.addMobileInputs();
		}
	},

	update: function(){
		game.physics.arcade.collide(this.player, this.layer);
		this.movePlayer();
		// Check if the player has left the game world
		if (!this.player.inWorld){
			this.playerDie();
		}
		// Check if the player overlaps with a coin
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
		// Make the enemies and walls collide
		game.physics.arcade.collide(this.enemies, this.layer);
		// Call player die when it overlaps an enemy
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

		// If the nextEnemy time has passed
		if (this.nextEnemy < game.time.now){
			// Define difficulties
			var start = 4000, end = 1000, score = 100;
			// Formula to decrease the delay between enemies over time
			// At first it's 4000ms, then slowly goes to 1000ms
			var delay = Math.max(start - (start-end)*Platformer.gameProperties.score/score, end);

			// Add a new enemy and update nextEnemy time
			this.addEnemy();
			this.nextEnemy = game.time.now + delay;
		}
	},

	movePlayer: function(){
		if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft){
			this.player.body.velocity.x = -200;	// Move left
			this.player.animations.play('left');
		} else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
			this.player.body.velocity.x = 200;	// Move right
			this.player.animations.play('right');
		} else {
			this.player.body.velocity.x = 0;	// Stand still
			this.player.frame = 0;
		}

		if ((this.cursor.up.isDown || this.wasd.up.isDown || this.jumping) && this.player.body.onFloor()) {
			this.jumpPlayer();
		}
	},

	createWorld: function(){
		// Create the tilemap
		this.map = game.add.tilemap('map');

		//Add the tilset to the map
		this.map.addTilesetImage('tileset');

		// Create a layer
		this.layer = this.map.createLayer('Tile Layer 1');

		// Set the world size to match the size of the layer
		this.layer.resizeWorld();

		// Enable collisions for the first element of our tileset (the blue walls)
		this.map.setCollision(1);
	},

	playerDie: function(){
		if (!this.player.alive){
			return;
		}
		// Kill the player
		this.player.kill();
		this.deadSound.play();
		// Set particle emitter positions
		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;
		// When player dies use emitter
		// True: all particle explode at once, Lifespan of 600ms,
		// null: frequence is false, 15: The number of particles
		this.emitter.start(true, 500, null, 15);

		// Delay going back to the menu 600ms
		game.time.events.add(600,this.startMenu, this);
	},

	takeCoin: function(player, coin){
		this.coinSound.play();
		// Increase the score
	 	Platformer.gameProperties.score += 5;
		// Update score text
		this.scoreLabel.text = 'score: '+ Platformer.gameProperties.score;

		// Change the coin positions
		this.updateCoinPosition();

		// Scale the coin to 0 to make invisible
		this.coin.scale.setTo(0,0);
		// Grow coin when it appears
		game.add.tween(this.coin.scale).to({x:1, y:1}, 300).start();
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
	},

	startMenu: function(){
		game.state.start(Platformer.states.menu);
	},

	addMobileInputs: function(){
		//Add the jump button
		this.jumpButton = game.add.sprite(350,247, 'jumpButton');
		this.jumpButton.inputEnabled = true;
		this.jumpButton.alpha = 0.5;
		this.jumping;
		this.jumpButton.events.onInputOver.add(function(){this.jumping=true;}, this);
		this.jumpButton.events.onInputOut.add(function(){this.jumping=false;}, this);
		this.jumpButton.events.onInputDown.add(function(){this.jumping=true;}, this);
		this.jumpButton.events.onInputUp.add(function(){this.jumping=false;}, this);

		// Movement variables
		this.moveLeft = false;
		this.moveRight = false;

		// Add the move left button
		this.leftButton = game.add.sprite(50, 247, 'leftButton');
		this.leftButton.inputEnabled = true;
		this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
		this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
		this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
		this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
		this.leftButton.alpha = 0.5;
		// Add the move right button
		this.rightButton = game.add.sprite(130, 247, 'rightButton');
		this.rightButton.inputEnabled = true;
		this.rightButton.events.onInputOver.add(function(){this.moveRight=true;},this);
		this.rightButton.events.onInputOut.add(function(){this.moveRight=false;},this);
		this.rightButton.events.onInputDown.add(function(){this.moveRight=true;},this);
		this.rightButton.events.onInputUp.add(function(){this.moveRight=false;},this);
		this.rightButton.alpha = 0.5;

	},

	jumpPlayer: function(){
		if (this.player.body.onFloor()){
			this.player.body.velocity.y = -320;
			this.jumpSound.play();
		}
	},




};
