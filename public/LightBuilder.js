define([], function(){
	"use strict";

	var _vector3FromArray = function(a){
		return new BABYLON.Vector3(a[0], a[1], a[2]);
	};

	var _color3FromArray = function(a){
		return new BABYLON.Color3(a[0], a[1], a[2]);
	};

	var LightBuilder = {
		build:function(scene, lights){
			_.each(lights, function(lightData){
				var light;
				if(lightData.type === "hemi"){
					light = new BABYLON.HemisphericLight("Hemi0", _vector3FromArray(lightData.position), scene);
				}
				else{
					light = new BABYLON.PointLight("Hemi0", _vector3FromArray(lightData.position), scene);
				}
				light.intensity = lightData.intensity;
				if(lightData.diffuse){
					light.diffuse = _color3FromArray(lightData.diffuse);
				}
				if(lightData.specular){
					light.specular = _color3FromArray(lightData.specular);
				}
				if(lightData.groundColor){
					light.groundColor = _color3FromArray(lightData.groundColor);
				}
			});
		}
	};


	return LightBuilder;

});

