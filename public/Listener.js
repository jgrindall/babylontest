define(["commands/ObjectCollectionCommand", "commands/DoorInteractionCommand", "commands/BaddieCollisionCommand", "commands/TerrainCollisionCommand"],

	function(ObjectCollectionCommand, DoorInteractionCommand, BaddieCollisionCommand, TerrainCollisionCommand){

	"use strict";

	var Listener  = function(game){
		this.game = game;
	};

	Listener.prototype.emit = function(type, options){
		var manager = this.game.manager;
		if(type === "objectCollect"){
			new ObjectCollectionCommand(this.game, options.toDeleteIds).exec();
		}
		else if(type === "baddieCollision"){
			new BaddieCollisionCommand(this.game).exec(options);
		}
		else if(type === "terrainCollision"){
			new TerrainCollisionCommand(this.game).exec(options);
		}
		else if(type === "doorInteraction"){
			new DoorInteractionCommand(this.game, options.id).exec();
		}
	};

	return Listener;

});
