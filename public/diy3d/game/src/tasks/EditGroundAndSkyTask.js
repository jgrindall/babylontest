define(["diy3d/game/src/builders/EnvironmentBuilder"], function(EnvironmentBuilder){

	"use strict";

	var EditGroundAndSkyTask = function(game){
        EnvironmentBuilder.updateGround(game);
        EnvironmentBuilder.updateSky(game);
        //EnvironmentBuilder.addCeil(game.scene, game.meshCache, game.materialsCache);
	};

	return EditGroundAndSkyTask;

});
