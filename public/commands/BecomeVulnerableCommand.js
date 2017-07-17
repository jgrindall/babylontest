define([], function(){
	"use strict";

	var BecomeVulnerableCommand = function(game){
		this.game = game;
	};

	BecomeVulnerableCommand.prototype.exec = function(){
		var hComp = this.game.manager.getComponentDataForEntity('HealthComponent', this.game.playerId);
		hComp.isRegenerating = false;
		this.game.health.updateRegnerating(false);
	};

	return BecomeVulnerableCommand;

});
