define(["diy3d/game/src/commands/RemoveDoorCommand", "diy3d/game/src/commands/RefreshHuntCommand", "diy3d/game/src/commands/StopPlayerCommand"],

	function(RemoveDoorCommand, RefreshHuntCommand, StopPlayerCommand){
	"use strict";

	var DoorInteractionCommand = function(game, id){
		this.game = game;
		this.id = id;
	};

	DoorInteractionCommand.prototype.exec = function(){
		var game = this.game, id = this.id;
		game.pause();
		new StopPlayerCommand(game).exec();
		setTimeout(function(){
			game.unpause();
			new RemoveDoorCommand(game, id).exec();
			new RefreshHuntCommand(game).exec();
		}, 500);
	};

	return DoorInteractionCommand;

});
