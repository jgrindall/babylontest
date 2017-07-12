define(["commands/ReduceHealthCommand", "commands/ShowDamageCommand", "commands/BecomeInvulnerableCommand", "commands/BecomeVulnerableCommand"],

	function(ReduceHealthCommand, ShowDamageCommand, BecomeInvulnerableCommand, BecomeVulnerableCommand){
	"use strict";

	var DoorInteractionCommand = function(game){
		this.game = game;
	};

	DoorInteractionCommand.prototype.exec = function(){
		this.game.pause();
	};

	return DoorInteractionCommand;

});
