define(["diy3d/game/src/builders/LightBuilder", "diy3d/game/src/builders/EffectBuilder"], function(LightBuilder, EffectBuilder){

	"use strict";

	var EditLightsTask = function(game){
		LightBuilder.build(game.scene, game.json.data.light);
		//EffectBuilder.build(game.scene, game.json.effects);
	};

	return EditLightsTask;

});
