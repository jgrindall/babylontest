define([], function(){
	"use strict";

	var BecomeInvulnerableCommand = function(game){
		this.game = game;
	};

	BecomeInvulnerableCommand.prototype.exec = function(){
		var hComp = this.game.manager.getComponentDataForEntity('HealthComponent', this.game.playerId);
		hComp.isRegenerating = true;
		this.game.health.updateRegnerating(true);
	};

	return BecomeInvulnerableCommand;

});
