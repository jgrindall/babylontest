define(["builders/TerrainBuilder"], function(TerrainBuilder){

	"use strict";

	var BuildTerrainTask = function(game){
		TerrainBuilder.addFromData(game.scene, game.grid, game.meshCache);
		TerrainBuilder.addGround(game.scene, game.grid, game.meshCache);
		TerrainBuilder.addCeil(game.scene, game.meshCache);
		TerrainBuilder.addSky(game.scene, game.meshCache);
	};

	return BuildTerrainTask;

});