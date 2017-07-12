define(["commands/ReduceHealthCommand", "commands/ShowDamageCommand", "commands/BecomeInvulnerableCommand", "commands/BecomeVulnerableCommand"],

	function(ReduceHealthCommand, ShowDamageCommand, BecomeInvulnerableCommand, BecomeVulnerableCommand){
	"use strict";

	var DoorInteractionCommand = function(game){
		this.game = game;
	};

	DoorInteractionCommand.prototype.exec = function(){
		this.game.pause();
		$("body").append("<div style='position:absolute;left:50%;top:50%;width:300px;height:200px;background:white;'></div>");
	};

	return DoorInteractionCommand;

});
