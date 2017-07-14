define(["commands/RemoveDoorCommand"],

	function(RemoveDoorCommand){
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
		}, 3000);
	};

	return DoorInteractionCommand;

});
