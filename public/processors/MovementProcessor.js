define([], function(){
	
	var MovementProcessor = function(manager){
		this.manager = manager;
		this.init();
	};
	
	MovementProcessor.prototype.init = function(){
		console.log("init", this.manager);		
	};
	
	MovementProcessor.prototype.update = function () {
		console.log("update movement");
		var playerData = manager.getComponentsData('SpeedComponent');
		console.log(playerData);
		return;
		/*
        var playerId = Object.keys(faceUp);
		var dx, dz, scaleFactor = (60/engine.getFps());
		angle += ang_speed * scaleFactor;
		player.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
		dx = speed*Math.sin(angle) * scaleFactor;
		dz = speed*Math.cos(angle) * scaleFactor;
		if(!BIRDSEYE){
			player.isVisible = false;
		}
		player.moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
		if(_mode === "off"){
			ang_speed *= FRICTION;
			speed *= FRICTION;
			if(Math.abs(speed) < 0.1){
				speed = 0;
			}
			if(Math.abs(ang_speed) < 0.1){
				ang_speed = 0;
			}
		}
		matchPlayer();
		*/
	};

	return MovementProcessor;
	
});
