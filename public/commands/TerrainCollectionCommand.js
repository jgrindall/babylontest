define(["commands/ReduceHealthCommand", "commands/BecomeInvulnerableCommand", "commands/BecomeVulnerableCommand"],

	function(ReduceHealthCommand, BecomeInvulnerableCommand, BecomeVulnerableCommand){
	"use strict";

	var TerrainCollectionCommand = function(game){
		this.game = game;
	};

	TerrainCollectionCommand.prototype.exec = function(){
		new ReduceHealthCommand(this.game, 2).exec();
		new BecomeInvulnerableCommand(this.game).exec();
		this.game.addToQueue(new BecomeVulnerableCommand(this.game), 5);
	};

	return TerrainCollectionCommand;

});
