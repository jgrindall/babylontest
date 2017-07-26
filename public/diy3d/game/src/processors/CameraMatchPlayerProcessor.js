define([], function(){
	"use strict";

	var CameraMatchPlayerProcessor = function(game){
		this.game = game;
	};

	CameraMatchPlayerProcessor.prototype.update = function () {
		var manager = this.game.manager, camera = this.game.camera, meshComp, speedComp;
		meshComp = manager.getComponentDataForEntity('MeshComponent', this.game.playerId);
		speedComp = manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
		camera.position = meshComp.mesh.position;
		camera.rotationQuaternion = meshComp.mesh.rotationQuaternion;
	};

	return CameraMatchPlayerProcessor;

});
