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
		var playerData, sf, ids, manager = this.manager;
		speedData = manager.getComponentsData('SpeedComponent');
		ids = Object.keys(speedData);
		_.each(ids, function(id, i){
			var dx, dz, mesh, data;
			mesh = manager.getComponentDataForEntity('MeshComponent', id);
			data = speedData[i];
			data.angle += data.ang_speed * sf;
			mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
			dx = data.speed*Math.sin(data.angle) * sf;
			dz = data.speed*Math.cos(data.angle) * sf;
			mesh.moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
			if(data.mode === "off"){
				data.ang_speed *= FRICTION;
				data.speed *= FRICTION;
				if(Math.abs(data.speed) < 0.1){
					data.speed = 0;
				}
				if(Math.abs(data.ang_speed) < 0.1){
					data.ang_speed = 0;
				}
			}
		});
	};

	return MatchPlayerProcessor;
	
});
