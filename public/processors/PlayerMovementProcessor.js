define([], function(){

	var FRICTION = 0.7;

	var PlayerMovementProcessor = function(game){
		this.game = game;
		this.init();
	};

	PlayerMovementProcessor.prototype.init = function(){
		//
	};

	PlayerMovementProcessor.prototype.update = function () {
		var speedData, sf, manager = this.game.manager;
		sf = (60/this.game.engine.getFps());  // a sort of correction factor to take into account slow fps - move the objects more
		var dx, dz, meshComp, speedComp;
		meshComp = manager.getComponentDataForEntity('MeshComponent', this.game.playerId);
		speedComp = manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
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
	};

	return PlayerMovementProcessor;

});
