define(["diy3d/game/src/builders/GridBuilder"], function(GridBuilder){

	"use strict";

	var BuildGridTask = function(game){
		game.grid = GridBuilder.build(game.scene, game.meshCache, game.data.data);
	};

	return BuildGridTask;

});