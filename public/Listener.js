define(["ObjectCollectionCommand", "BaddieCollectionCommand", "TerrainCollectionCommand"],

	function(ObjectCollectionCommand, BaddieCollectionCommand, TerrainCollectionCommand){

	"use strict";

	var Listener  = function(game){
		this.game = game;
		this.playerId = game.playerId;
	};

	Listener.prototype.emit = function(type, options){
		var manager = this.game.manager, playerId = this.game.playerId;
		if(type === "objectCollect"){
			new ObjectCollectionCommand().exec(this.game, options.toDeleteIds);
		}
		else if(type === "baddieCollision"){
			new BaddieCollectionCommand().exec(this.game);
		}
		else if(type === "terrainCollision"){
			new TerrainCollectionCommand().exec(this.game);
		}
	};

	return Listener;

});
