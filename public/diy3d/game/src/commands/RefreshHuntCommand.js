define(["diy3d/game/src/builders/GridBuilder", "diy3d/game/src/utils/GridUtils"],

	function(GridBuilder, GridUtils){
	"use strict";

	var RefreshHuntCommand = function(game){
		this.game = game;
	};

	RefreshHuntCommand.prototype.exec = function(){
		var manager = this.game.manager;
		_.each(this.game.ids["baddie"], function(id){
			var sComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
			delete sComp.vel;
			delete sComp.path;
		});
	};

	return RefreshHuntCommand;

});
