define(["builders/EnvironmentBuilder"], function(EnvironmentBuilder){

	"use strict";

	var BuildEnvironmentTask = function(game){
		EnvironmentBuilder.addGround(game.scene, game.grid, game.meshCache);
		EnvironmentBuilder.addCeil(game.scene, game.meshCache);
		EnvironmentBuilder.addSky(game.scene, game.meshCache);
		EnvironmentBuilder.addFire(game.scene, game.grid.greedy.fire.quads, game.meshCache);
		EnvironmentBuilder.addWater(game.scene, game.grid.greedy.water.quads, game.meshCache);
	};

	return BuildEnvironmentTask;

});
