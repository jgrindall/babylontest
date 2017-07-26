define([], function(){

	"use strict";

	var FRICTION = 0.7;

	var PI2 = 2*Math.PI;

	var PIOVER2 = Math.PI/2;

	var ALPHA = Math.PI * 35/180;

	var MIN_RADIUS = 0.2;

	var ANG_SPEED = 0.025;

	var PlayerMovementProcessor = function(game){
		this.game = game;
		this.playerId = this.game.playerId;
		this.camera = this.game.camera;
		this.gamePad = this.game.gamePad;
	};

	PlayerMovementProcessor.prototype.update = function () {
	    var speedData, manager = this.game.manager, scale, data, fps, meshComp, speedComp, dx, dz, quat, q, r, t, scaledR;
	    data = this.gamePad.getData();
	    q = Math.atan2(data.dy, data.dx);
	    r = Math.sqrt(data.dx*data.dx + data.dy*data.dy);
	    scaledR = (r - MIN_RADIUS) / (1 - MIN_RADIUS);
	    //console.log(q);
		meshComp = manager.getComponentDataForEntity('MeshComponent', this.playerId);
		speedComp = manager.getComponentDataForEntity('SpeedComponent', this.playerId);
		speedComp.ang_speed = 0;
	    speedComp.speed = 0;
	    fps = Math.max(10, Math.min(this.game.engine.getFps(), 60));
	    scale = 60/fps;
	    if(r < MIN_RADIUS){
	    	// near the middle
	    }
	    else{
	    	if(q > 0 && q < ALPHA){
	    		//r
	    		speedComp.ang_speed = scaledR;
	    	}
	    	else if(q > ALPHA && q < PIOVER2 - ALPHA){
	    		// ru
	    		t = (q - ALPHA) / (PIOVER2 - 2*ALPHA);
	    		speedComp.ang_speed = (1 - t)*scaledR;
	    		speedComp.speed = t * (-scaledR);
	    	}
	    	else if(q > PIOVER2 - ALPHA && q < PIOVER2){
	    		//u
	    		speedComp.speed = -scaledR;
	    	}
	    	else if(q > PIOVER2 && q < PIOVER2 + ALPHA){
	    		//u
	    		speedComp.speed = -scaledR;
	    	}
	    	else if(q > PIOVER2 + ALPHA && q < Math.PI - ALPHA){
	    		//ul
	    		t = (q - PIOVER2 - ALPHA) / (PIOVER2 - ALPHA);
	    		speedComp.ang_speed = -t*scaledR;
	    		speedComp.speed = (1 - t) * (-scaledR);
	    	}
	    	else if(q > Math.PI - ALPHA && q < Math.PI){
	    		//l
	    		speedComp.ang_speed = -scaledR;
	    	}
	    	else if(q > -Math.PI && q < -Math.PI + ALPHA){
	    		//l
	    		speedComp.ang_speed = -scaledR;
	    	}
	    	else if(q > -Math.PI + ALPHA && q < -PIOVER2 - ALPHA){
	    		//dl
	    		t = (q + PIOVER2 + ALPHA) / (-PIOVER2 + 2*ALPHA);
	    		speedComp.ang_speed = -t*scaledR;
	    		speedComp.speed = (1 - t) * scaledR;
	    	}
	    	else if(q > -PIOVER2 - ALPHA && q < -PIOVER2){
	    		//d
	    		speedComp.speed = scaledR;
	    	}
	    	else if(q > -PIOVER2 && q < -PIOVER2 + ALPHA){
	    		//d
	    		speedComp.speed = scaledR;
	    	}
	    	else if(q > -PIOVER2 + ALPHA && q < -ALPHA){
	    		//dl
	    		t = (q + PIOVER2 - ALPHA) / (PIOVER2 - 2*ALPHA);
	    		speedComp.ang_speed = t*scaledR;
	    		speedComp.speed = (1 - t) * scaledR;
	    	}
	    	else if(q > -ALPHA && q < 0){
	    		//r
	    		speedComp.ang_speed = scaledR;
	    	}
	    }
	    speedComp.speed *= scale;
	    speedComp.ang_speed *= scale;
		speedComp.angle += speedComp.ang_speed * ANG_SPEED;
		quat = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), speedComp.angle);
		meshComp.mesh.rotationQuaternion = quat;
		dx = speedComp.speed*Math.sin(speedComp.angle);
		dz = speedComp.speed*Math.cos(speedComp.angle);
		meshComp.mesh.moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
		this.camera.position = meshComp.mesh.position;
		this.camera.rotationQuaternion = quat;
	};

	return PlayerMovementProcessor;

});
