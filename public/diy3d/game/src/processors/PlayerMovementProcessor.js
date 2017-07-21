define([], function(){

	"use strict";

	var FRICTION = 0.7;

	var PI2 = 2*Math.PI;

	var PlayerMovementProcessor = function(game){
		this.game = game;
		this.gamePad = this.game.gamePad;
		this.init();
	};

	PlayerMovementProcessor.prototype.init = function(){
		//
	};

	PlayerMovementProcessor.prototype.update = function () {
	    var speedData, sf, manager = this.game.manager, data, meshComp, speedComp, dx, dz;
	    data = this.gamePad.getData();
		meshComp = manager.getComponentDataForEntity('MeshComponent', this.game.playerId);
		speedComp = manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
	    console.log(data.dx, data.dy);

	    speedComp.ang_speed = 0;
	    speedComp.speed = 0;

	    if(Math.abs(data.dy) < 0.5 && data.dx > 0.05){
	    	// pure right
	    	speedComp.ang_speed = 1;
	    	speedComp.speed = 0;
	    }
	    else if(Math.abs(data.dy) < 0.5 && data.dx < -0.05){
	    	// pure left
	    	speedComp.ang_speed = -1;
	    	speedComp.speed = 0;
	    }
	    else if(Math.abs(data.dx) < 0.25 && data.dy > 0.25){
	    	// pure up
	    	speedComp.ang_speed = 0;
	    	speedComp.speed = -1;
	    }
	    else if(Math.abs(data.dx) < 0.25 && data.dy < -0.25){
	    	// pure down
	    	speedComp.ang_speed = 0;
	    	speedComp.speed = 1;
	    }
		speedComp.angle += speedComp.ang_speed * 0.025;
		meshComp.mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), speedComp.angle);

		dx = speedComp.speed*Math.sin(speedComp.angle) * 0.5;
		dz = speedComp.speed*Math.cos(speedComp.angle) * 0.5;
		meshComp.mesh.moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
	};

	return PlayerMovementProcessor;

});
