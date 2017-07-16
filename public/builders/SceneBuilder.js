define(["builders/LightBuilder", "builders/EffectBuilder"],

	function(LightBuilder, EffectBuilder){

	"use strict";

	var SceneBuilder = {

	};

	SceneBuilder.makeScene = function(engine){
		var scene = new BABYLON.Scene(engine);
		scene.collisionsEnabled = true;
		LightBuilder.build(scene, window._LIGHTS);
		//EffectBuilder.build(scene, window._EFFECTS);
		return scene;
	};

	return SceneBuilder;

});
