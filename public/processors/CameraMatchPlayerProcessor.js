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
		var manager = this.game.manager, cameraComp, meshComp, speedComp;
		cameraComp = manager.getComponentDataForEntity('CameraComponent', this.game.cameraId);
		meshComp = manager.getComponentDataForEntity('MeshComponent', this.game.playerId);
		speedComp = manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
		cameraComp.camera.position = meshComp.mesh.position.clone();
		cameraComp.camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), speedComp.angle);
	};

	return CameraMatchPlayerProcessor;

});
