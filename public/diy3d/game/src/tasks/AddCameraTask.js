define([], function(){

	"use strict";

	var AddCameraTask = function(game){
		game.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, 0), game.scene);
	};

	return AddCameraTask;

});