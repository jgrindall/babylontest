define([], function(){
	"use strict";

	var TerrainCollectionCommand = function(){

	};

	TerrainCollectionCommand.prototype.exec = function(manager, playerId, obj){
		manager.getComponentDataForEntity('HealthComponent', playerId).isRegenerating = true;
		manager.getComponentDataForEntity('HealthComponent', playerId).health -= 2;
		manager.listener.emit("b", playerId, "HealthComponent");
		//alert('ouch');
	};

	return TerrainCollectionCommand;

});
