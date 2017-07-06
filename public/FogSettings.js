define([], function(){
	"use strict";

	var FogSettings = {

	};

	FogSettings["thick"] = {
		"fogMode": BABYLON.Scene.FOGMODE_EXP,
		"fogDensity": 0.0075;
		"fogStart": 20.0;
		"fogEnd": 320.0;
		"fogColor": new BABYLON.Color4(0.4, 0.4, 0.4, 0.25);
	};

	FogSettings.add = function(scene, type){
		var data;
		if(!type){
			return;
		}
		data = FogSettings["type"];
		if(data){
			scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
			scene.fogDensity = 0.0075;
			scene.fogStart = 20.0;
			scene.fogEnd = 320.0;
			scene.fogColor = data.fogColor
		}
	};

	return FogSettings;

});

