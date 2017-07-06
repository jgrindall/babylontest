define(["FogSettings"], function(FogSettings){
	"use strict";

	var _vector3FromArray = function(a){
		return new BABYLON.Vector3(a[0], a[1], a[2]);
	};

	var _color3FromArray = function(a){
		return new BABYLON.Color3(a[0], a[1], a[2]);
	};

	var _color4FromArray = function(a){
		return new BABYLON.Color4(a[0], a[1], a[2], a[3]);
	};

	var EffectBuilder = function(){
		build:function(scene, effectsData){
			scene.ambientColor = _color3FromArray(effectsData.ambientColor);
			FogSettings.add(scene, effectsData.fog);
			scene.gravity = _vector3FromArray(effectsData.gracvtity);
		}
	};

	return EffectBuilder;

});
