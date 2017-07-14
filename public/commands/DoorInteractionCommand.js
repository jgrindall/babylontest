define(["commands/RemoveDoorCommand", "commands/RefreshHuntCommand"],

	function(RemoveDoorCommand, RefreshHuntCommand){
	"use strict";

	var DoorInteractionCommand = function(game, id){
		this.game = game;
		this.id = id;
	};

	DoorInteractionCommand.prototype.exec = function(){
		var game = this.game, id = this.id;
		game.pause();
		setTimeout(function(){
			game.unpause();
			new RemoveDoorCommand(game, id).exec();
			new RefreshHuntCommand(game).exec();
		}, 500);
	};

	return DoorInteractionCommand;

});
