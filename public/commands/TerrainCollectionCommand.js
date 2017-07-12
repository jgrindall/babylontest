define(["commands/ReduceHealthCommand", "commands/ShowDamageCommand", "commands/BecomeInvulnerableCommand", "commands/BecomeVulnerableCommand"],

	function(ReduceHealthCommand, ShowDamageCommand, BecomeInvulnerableCommand, BecomeVulnerableCommand){
	"use strict";

	var TerrainCollectionCommand = function(game){
		this.game = game;
	};

	TerrainCollectionCommand.prototype.exec = function(){
		new ShowDamageCommand(this.game).exec();
		new ReduceHealthCommand(this.game, 2).exec();
		new BecomeInvulnerableCommand(this.game).exec();
		this.game.addToQueue(new BecomeVulnerableCommand(this.game), 5);
	};

	return TerrainCollectionCommand;

});
