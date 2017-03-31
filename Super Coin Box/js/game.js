var game = new Phaser.Game(Platformer.gameProperties.gameWidth-1 ,
	Platformer.gameProperties.gameHeight,
	Phaser.AUTO, 'game-div');

Platformer.states = {
	boot: 'boot',
	load: 'load',
	menu: 'menu',
	play: 'play',
}

// Add all the states
game.state.add(Platformer.states.boot, Platformer.bootState);
game.state.add(Platformer.states.load, Platformer.loadState);
game.state.add(Platformer.states.menu, Platformer.menuState);
game.state.add(Platformer.states.play, Platformer.playState);

// Start the boot state
game.state.start(Platformer.states.boot);
