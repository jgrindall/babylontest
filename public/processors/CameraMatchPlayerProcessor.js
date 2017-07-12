define([], function(){
	"use strict";

	var CameraMatchPlayerProcessor = function(game){
		this.game = game;
		this.init();
	};

	CameraMatchPlayerProcessor.prototype.init = function(){
		//
	};

	CameraMatchPlayerProcessor.prototype.update = function () {
		var manager = this.game.manager, camera = this.game.camera, meshComp, speedComp;
		meshComp = manager.getComponentDataForEntity('MeshComponent', this.game.playerId);
		speedComp = manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
		camera.position = meshComp.mesh.position.clone();
		camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), speedComp.angle);
	};

	return CameraMatchPlayerProcessor;

});
