define([], function(){
	"use strict";

	var StopPlayerCommand = function(game){
		this.game = game;
	};

	StopPlayerCommand.prototype.exec = function(){
		var speedComp = this.game.manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
		speedComp.speed = 0;
		speedComp.ang_speed = 0;
	};

	return StopPlayerCommand;

});
