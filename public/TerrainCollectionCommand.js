define([], function(){
	"use strict";

	var TerrainCollectionCommand = function(){

	};

	TerrainCollectionCommand.prototype.exec = function(game){
		var hComp = game.manager.getComponentDataForEntity('HealthComponent', game.playerId);
		hComp.isRegenerating = true;
		hComp.health -= 2;
		game.health.update(hComp.health);
	};

	return TerrainCollectionCommand;

});
