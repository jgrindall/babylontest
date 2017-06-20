define([], function(){

	var MatchPlayerProcessor = function(manager, engine, playerId, cameraId){
		this.manager = manager;
		this.engine = engine;
		this.playerId = playerId;
		this.cameraId = cameraId;
		this.init();
	};

	MatchPlayerProcessor.prototype.init = function(){
		//
	};

	MatchPlayerProcessor.prototype.update = function () {
		var manager = this.manager;
		cameraComp = manager.getComponentDataForEntity('CameraComponent', this.cameraId);
		meshComp = manager.getComponentDataForEntity('MeshComponent', this.playerId);
		speedComp = manager.getComponentDataForEntity('SpeedComponent', this.playerId);
		cameraComp.camera.position = meshComp.mesh.position.clone();
		cameraComp.camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), speedComp.angle);
	};

	return MatchPlayerProcessor;

});
