define([], function(){
	"use strict";

	var BecomeVulnerableCommand = function(game){
		this.game = game;
	};

	BecomeVulnerableCommand.prototype.exec = function(){
		var hComp;
		if(this.game && this.game.manager && typeof this.game.playerId !== "undefined" && this.game.playerId !== null){
			hComp = this.game.manager.getComponentDataForEntity('HealthComponent', this.game.playerId);
			if(hComp){
				hComp.isRegenerating = false;
				this.game.health.updateRegnerating(false);
			}
		}
	};

	return BecomeVulnerableCommand;

});
