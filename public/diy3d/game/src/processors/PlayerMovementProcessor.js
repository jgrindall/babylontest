define([], function(){

	"use strict";

	var FRICTION = 0.7;

	var PI2 = 2*Math.PI;

	var PlayerMovementProcessor = function(game){
		this.game = game;
		this.gamePad = this.game.gamePad;
	};

	PlayerMovementProcessor.prototype.update = function () {
	    var speedData, manager = this.game.manager, data, meshComp, speedComp, dx, dz;
	    data = this.gamePad.getData();
		meshComp = manager.getComponentDataForEntity('MeshComponent', this.game.playerId);
		speedComp = manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
	    speedComp.ang_speed = 0;
	    speedComp.speed = 0;
	    var scale = 60/this.game.engine.getFps();

	    if(Math.abs(data.dy) < 0.5 && data.dx > 0.05){
	    	// pure right
	    	speedComp.ang_speed = 1*scale;
	    	speedComp.speed = 0;
	    }
	    else if(Math.abs(data.dy) < 0.5 && data.dx < -0.05){
	    	// pure left
	    	speedComp.ang_speed = -1*scale;
	    	speedComp.speed = 0;
	    }
	    else if(Math.abs(data.dx) < 0.25 && data.dy > 0.25){
	    	// pure up
	    	speedComp.ang_speed = 0;
	    	speedComp.speed = -1*scale;
	    }
	    else if(Math.abs(data.dx) < 0.25 && data.dy < -0.25){
	    	// pure down
	    	speedComp.ang_speed = 0;
	    	speedComp.speed = 1*scale;
	    }
		speedComp.angle += speedComp.ang_speed * 0.025;
		meshComp.mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), speedComp.angle);

		dx = speedComp.speed*Math.sin(speedComp.angle) * 0.5;
		dz = speedComp.speed*Math.cos(speedComp.angle) * 0.5;
		meshComp.mesh.moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
	};

	return PlayerMovementProcessor;

});
