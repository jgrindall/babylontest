define([], function(){
	"use strict";

	var BaddieCollectionCommand = function(){

	};

	BaddieCollectionCommand.prototype.exec = function(game){
		var hComp = game.manager.getComponentDataForEntity('HealthComponent', game.playerId);
		hComp.isRegenerating = true;
		hComp.health -= 10;
		game.health.update(hComp.health);
	};

	return BaddieCollectionCommand;

});
