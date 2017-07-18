define(["builders/LightBuilder", "builders/EffectBuilder"], function(LightBuilder, EffectBuilder){

	"use strict";

	var AddLightsTask = function(game){
		LightBuilder.build(game.scene, game.data.lights);
		EffectBuilder.build(game.scene, game.data.effects);
	};

	return AddLightsTask;

});
