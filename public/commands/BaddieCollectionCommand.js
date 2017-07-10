define(["commands/ReduceHealthCommand", "commands/BecomeInvulnerableCommand", "commands/BecomeVulnerableCommand"],

	function(ReduceHealthCommand, BecomeInvulnerableCommand, BecomeVulnerableCommand){
	"use strict";

	var BaddieCollectionCommand = function(game){
		this.game = game;
	};

	BaddieCollectionCommand.prototype.exec = function(){
		new ReduceHealthCommand(this.game, 10).exec();
		new BecomeInvulnerableCommand(this.game).exec();
		this.game.addToQueue(new BecomeVulnerableCommand(this.game), 5);
	};

	return BaddieCollectionCommand;

});