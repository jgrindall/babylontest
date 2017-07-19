define([], function(){
	"use strict";

	var ReduceHealthCommand = function(game, amount){
		this.game = game;
		this.amount = amount;
	};

	ReduceHealthCommand.prototype.exec = function(){
		var hComp = this.game.manager.getComponentDataForEntity('HealthComponent', this.game.playerId);
		hComp.health -= this.amount;
		this.game.health.update(hComp.health);
	};

	return ReduceHealthCommand;

});
