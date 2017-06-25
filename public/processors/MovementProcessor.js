define([], function(){
	"use strict";

	var FRICTION = 0.7;

	var MovementProcessor = function(manager, engine, playerId){
		this.manager = manager;
		this.engine = engine;
		this.playerId = playerId;
		this.init();
	};

	MovementProcessor.prototype.init = function(){
		//
	};

	MovementProcessor.prototype.update = function () {
		var speedData, speedEntities, sf, ids, manager = this.manager;
		speedEntities = manager.getComponentsData('SpeedComponent');
		sf = (60/this.engine.getFps());  // a sort of correction factor to take into account slow fps - move the objects more

		for (var entity in speedEntities) {
			var dx, dz, meshComp, speedComp;
			meshComp = manager.getComponentDataForEntity('MeshComponent', entity);
			speedComp = manager.getComponentDataForEntity('SpeedComponent', entity);
			speedComp.angle += speedComp.ang_speed * sf;
			meshComp.mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), speedComp.angle);
			dx = speedComp.speed*Math.sin(speedComp.angle) * sf;
			dz = speedComp.speed*Math.cos(speedComp.angle) * sf;
			meshComp.mesh.moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
			if(speedComp.mode === "off"){
				speedComp.ang_speed *= FRICTION;
				speedComp.speed *= FRICTION;
				if(Math.abs(speedComp.speed) < 0.1){
					speedComp.speed = 0;
				}
				if(Math.abs(speedComp.ang_speed) < 0.1){
					speedComp.ang_speed = 0;
				}
			}
		}
	};

	return MovementProcessor;

});
