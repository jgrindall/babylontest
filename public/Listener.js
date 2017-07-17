define(["commands/ObjectCollectionCommand", "commands/DoorInteractionCommand", "commands/BaddieCollisionCommand", "commands/TerrainCollectionCommand"],

	function(ObjectCollectionCommand, DoorInteractionCommand, BaddieCollisionCommand, TerrainCollectionCommand){

	"use strict";

	var Listener  = function(game){
		this.game = game;
		this.playerId = game.playerId;
	};

	Listener.prototype.emit = function(type, options){
		var manager = this.game.manager, playerId = this.game.playerId;
		if(type === "objectCollect"){
			new ObjectCollectionCommand(this.game, options.toDeleteIds).exec();
		}
		else if(type === "baddieCollision"){
			new BaddieCollisionCommand(this.game).exec();
		}
		else if(type === "terrainCollision"){
			new TerrainCollectionCommand(this.game).exec();
		}
		else if(type === "doorInteraction"){
			new DoorInteractionCommand(this.game, options.id).exec();
		}
	};

	return Listener;

});
