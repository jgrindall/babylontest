define([], function(){
	"use strict";

	var BaddieCollectionCommand = function(){

	};

	BaddieCollectionCommand.prototype.exec = function(manager, playerId, baddieId){
		manager.getComponentDataForEntity('HealthComponent', playerId).isRegenerating = true;
		manager.getComponentDataForEntity('HealthComponent', playerId).health -= 10;
		manager.listener.emit("b", playerId, "HealthComponent");
	};

	return BaddieCollectionCommand;

});
