define(["builders/TerrainBuilder"], function(TerrainBuilder){

	"use strict";

	var BuildTerrainTask = function(game){
		TerrainBuilder.addBoxes(game.scene, game.grid.greedy.boxes.quads, game.meshCache);
		TerrainBuilder.addWalls(game.scene, game.grid.grid, game.meshCache);
	};

	return BuildTerrainTask;

});
