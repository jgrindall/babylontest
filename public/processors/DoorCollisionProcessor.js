define(["utils/GridUtils"], function(GridUtils){
	"use strict";

	var TOLERANCE_0 = SIZE/3;
	var TOLERANCE_1 = SIZE;
	var TOLERANCE_ANGLE = 0.4;

	var CHECKS = {
		"s":{
			"dir":"s",
			"dx":0,
			"dz":SIZE/2,
			"minDx":TOLERANCE_0,
			"minDz":TOLERANCE_1,
			"angles":[
				Math.PI
			]
		},
		"n":{
			"dir":"n",
			"dx":0,
			"dz":-SIZE/2,
			"minDx":TOLERANCE_0,
			"minDz":TOLERANCE_1,
			"angles":[
				0,
				2*Math.PI
			]
		},
		"w":{
			"dir":"w",
			"dx":-SIZE/2,
			"dz":0,
			"minDx":TOLERANCE_1,
			"minDz":TOLERANCE_0,
			"angles":[
				Math.PI/2
			]
		},
		"e":{
			"dir":"e",
			"dx":SIZE/2,
			"dz":0,
			"minDx":TOLERANCE_1,
			"minDz":TOLERANCE_0,
			"angles":[
				3*Math.PI/2
			]
		}
	};

	var DoorCollisionProcessor = function(game){
		this.game = game;
	};

	DoorCollisionProcessor.prototype.update = function () {
		var manager = this.game.manager, playerMesh, angle, playerPos, _getDir, doorIdHit;
		playerMesh = manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh;
		angle = manager.getComponentDataForEntity('SpeedComponent', this.game.playerId).angle;
		playerPos = playerMesh.position;
		_getDir = function(pos){
			return _.find(CHECKS, function(val, key){
				var p, dx, dz, i;
				p = {
					"x":pos.x + val.dx,
					"z":pos.z + val.dz
				};
				dx = Math.abs(p.x - playerPos.x);
				dz = Math.abs(p.z - playerPos.z);
				if(dx < val.minDx && dz < val.minDz){
					for(i = 0; i < val.angles.length; i++){
						if(Math.abs(angle - val.angles[i]) < TOLERANCE_ANGLE){
							return true;
						}
					}
				}
			});
		};
		doorIdHit = _.find(this.game.doorIds, function(id){
			var doorMesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			return !!_getDir(doorMesh.position);
		});
		if(doorIdHit){
			manager.listener.emit("doorInteraction", {"id":doorIdHit});
		}
	};

	return DoorCollisionProcessor;

});
