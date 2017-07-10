define([], function(){
	"use strict";

	var FogSettings = {

	};

	FogSettings["thick"] = {
		"fogMode": BABYLON.Scene.FOGMODE_EXP,
		"fogDensity": 0.0075,
		"fogStart": 20.0,
		"fogEnd": 320.0,
		"fogColor": new BABYLON.Color4(0.2, 0.2, 0.2, 0.25)
	};

	FogSettings.add = function(scene, type){
		var data;
		if(!type){
			return;
		}
		data = FogSettings[type];
		if(data){
			scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
			scene.fogDensity = data.fogDensity;
			scene.fogStart = data.fogStart;
			scene.fogEnd = data.fogEnd;
			scene.fogColor = data.fogColor
		}
	};

	return FogSettings;

});

