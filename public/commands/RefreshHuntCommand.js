define(["builders/GridBuilder", "utils/GridUtils"],

	function(GridBuilder, GridUtils){
	"use strict";

	var RefreshHuntCommand = function(game){
		this.game = game;
	};

	RefreshHuntCommand.prototype.exec = function(){
		var manager = this.game.manager;
		_.each(this.game.baddieIds, function(id){
			var sComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
			delete sComp.vel;
			delete sComp.path;
			console.log("DEL", id, sComp);
		});
	};

	return RefreshHuntCommand;

});
