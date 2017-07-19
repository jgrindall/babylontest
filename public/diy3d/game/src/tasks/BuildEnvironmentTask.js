define(["diy3d/game/src/builders/EnvironmentBuilder"], function(EnvironmentBuilder){

	"use strict";

	var BuildEnvironmentTask = function(game){
		EnvironmentBuilder.addGround(game.scene, game.grid, game.meshCache, game.materialsCache);
		EnvironmentBuilder.addCeil(game.scene, game.meshCache, game.materialsCache);
		EnvironmentBuilder.addSky(game.scene, game.meshCache, game.materialsCache);
		EnvironmentBuilder.addFire(game.scene, game.grid.greedy.fire.quads, game.meshCache, game.materialsCache);
		EnvironmentBuilder.addWater(game.scene, game.grid.greedy.water.quads, game.meshCache, game.materialsCache);
	};

	return BuildEnvironmentTask;

});
