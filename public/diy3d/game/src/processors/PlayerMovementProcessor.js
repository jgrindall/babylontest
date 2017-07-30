define(["diy3d/game/src/utils/GridUtils"], function(GridUtils){

	"use strict";

	var FRICTION = 		0.7;
	var PI2 = 			2*Math.PI;
	var PIOVER2 = 		Math.PI/2;
	var ALPHA = 		Math.PI * 35/180;
	var MIN_RADIUS = 	0.2;
	var ANG_SPEED = 	0.025;

	var PlayerMovementProcessor = function(game){
		this.game = game;
		this.playerId = this.game.playerId;
		this.camera = this.game.camera;
		this.gamePad = this.game.gamePad;
		this.data = this.game.grid.solid;
	};

	PlayerMovementProcessor.prototype.isFull = function(i, j){
		if(i < 0 || i >= SIZE_I || j < 0 || j >= SIZE_J){
			return true;
		}
		return (this.data[i][j] === 1);
	};

	PlayerMovementProcessor.prototype.resolve = function(pos, movex, movez){
		var tileI, tileJ, dx, dy, n, x, w, e, sw, nw, sw, se, left, top, isFull, newPos, newPosIJ;
		var PLAYER_SIZE = SIZE/4;
		newPos = {
			x: pos.x + movex,
			z: pos.z + movez,
		};
		var ij = GridUtils.babylonToIJ(newPos);
		var i = ij.i;
		var j = ij.j;
		dx = pos.x - j*SIZE;
		dy = pos.z - i*SIZE;
		n = isFull(i - 1, 	j);
		s = isFull(i + 1, 	j);
		w = isFull(i, 		j - 1);
		e = isFull(i, 		j + 1);
		nw = isFull(i - 1, 	j - 1);
		ne = isFull(i - 1, 	j + 1);
		sw = isFull(i + 1, 	j - 1);
		se = isFull(i + 1, 	j + 1);
		if(dx >= SIZE - PLAYER_SIZE/2){
			left = 2;
		}
		else if(dx > PLAYER_SIZE/2){
			left = 1;
		}
		if(dy >= SIZE - PLAYER_SIZE/2){
			top = 2;
		}
		else if(dy > PLAYER_SIZE/2){
			top = 1;
		}
		if(top === 0 && left === 1 && n){
			//b
			dy = PLAYER_SIZE/2 + EPS;
		}
		else if(top === 1 && left === 2 && e){
			//e
			dx = SIZE - PLAYER_SIZE/2 - EPS;
		}
		else if(top === 2 && left === 1 && s){
			//h
			dy = SIZE - PLAYER_SIZE/2 - EPS;
		}
		else if(top === 1 && left === 0 && w){
			//d
			dx = PLAYER_SIZE/2 + EPS;
		}
		else if(top === 0 && left === 0){
			//a
			if((n && !nw && !w) || (n && nw && !w)){
				dy = PLAYER_SIZE/2 + EPS;
			}
			else if((!n && !nw && w) || (!n && nw && w)){
				dx = PLAYER_SIZE/2 + EPS;
			}
			else if((n && !nw && w) || (n && nw && w)){
				dy = PLAYER_SIZE/2 + EPS;
				dx = PLAYER_SIZE/2 + EPS;
			}
			else if(!n && nw && !w){
				if(dx >= dy){
					dx = PLAYER_SIZE/2 + EPS;
				}
				else{
					dy = PLAYER_SIZE/2 + EPS;
				}
			}
		}
		else if(top === 0 && left === 2){
			//c
			if((n && !ne && !e) || (n && ne && !e)){
				dy = PLAYER_SIZE/2 + EPS;
			}
			else if((!n && !ne && e) || (!n && ne && e)){
				dx = SIZE - PLAYER_SIZE/2 - EPS;
			}
			else if((n && !ne && e) || (n && ne && e)){
				dy = PLAYER_SIZE/2 + EPS;
				dx = SIZE - PLAYER_SIZE/2 - EPS;
			}
			else if(!n && ne && !e){
				if(dx + dy >= SIZE){
					dx = SIZE - PLAYER_SIZE/2 - EPS;
				}
				else{
					dy = PLAYER_SIZE/2 + EPS;
				}
			}
		}
		else if(top === 2 && left === 0){
			//g
			if((s && !sw && !w) || (s && sw && !w)){
				dy = SIZE - PLAYER_SIZE/2 - EPS;
			}
			else if((!s && !sw && w) || (!s && sw && w)){
				dx = PLAYER_SIZE/2 + EPS;
			}
			else if((s && !sw && w) || (s && sw && w)){
				dy = SIZE - PLAYER_SIZE/2 - EPS;
				dx = PLAYER_SIZE/2 + EPS;
			}
			else if(!s && sw && !w){
				if(dx + dy <= SIZE){
					dx = PLAYER_SIZE/2 + EPS;
				}
				else{
					dy = SIZE - PLAYER_SIZE/2 - EPS;
				}
			}
		}
		else if(top === 2 && left === 2){
			//i
			if((s && !se && !e) || (s && se && !e)){
				dy = SIZE - PLAYER_SIZE/2 - EPS;
			}
			else if((!s && !se && e) || (!s && se && e)){
				dx = SIZE - PLAYER_SIZE/2 - EPS;
			}
			else if((s && !se && e) || (s && se && e)){
				dy = SIZE - PLAYER_SIZE/2 - EPS;
				dx = SIZE - PLAYER_SIZE/2 - EPS;
			}
			else if(!s && se && !e){
				if(dx <= dy){
					dx = SIZE - PLAYER_SIZE/2 - EPS;
				}
				else{
					dy = SIZE - PLAYER_SIZE/2 - EPS;
				}
			}
		}
		return {
			x: dx/SIZE + tileJ,
			z: dy/SIZE + tileI
		};
		*/
	};

	PlayerMovementProcessor.prototype.move = function(mesh, dx, dz){
		var p = this.resolve(mesh.position, dx, dz);
		mesh.position.x = p.x;
		mesh.position.z = p.z;
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
		this.camera.rotationQuaternion = quat;
		dx = speedComp.speed*Math.sin(speedComp.angle);
		dz = speedComp.speed*Math.cos(speedComp.angle);
		this.move(meshComp.mesh, dx, dz);
		this.camera.position = meshComp.mesh.position;
	};

	return PlayerMovementProcessor;

});
