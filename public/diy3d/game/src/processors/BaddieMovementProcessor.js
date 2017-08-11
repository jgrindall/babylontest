define(["diy3d/game/src/utils/GridUtils"], function(GridUtils){

	"use strict";

	var SF = 0.35;

	var DIRS = [
		{'x':1, 'z':0},
		{'x':-1, 'z':0},
		{'x':0, 'z':1},
		{'x':0, 'z':-1}
	];

	var _pathIsUnit = function(strategy, path){
		if(strategy === "north-south"){
			return Math.abs(path.zmin - path.zmax) < 0.1;
		}
		else if(strategy === "west-east"){
			return Math.abs(path.xmin - path.xmax) < 0.1;
		}
	};

	var BaddieMovementProcessor = function(game){
		this.game = game;
	};

	BaddieMovementProcessor.prototype.moveWestEast = function(sComp, meshComp){
		var position = meshComp.mesh.position;
		if(position.x <= sComp.path.xmin){
			sComp.vel.x = 1;
		}
		else if(position.x >= sComp.path.xmax){
			sComp.vel.x = -1;
		}
		position.x += sComp.vel.x*SF;
	};

	BaddieMovementProcessor.prototype.moveNorthSouth = function(sComp, meshComp){
		var position = meshComp.mesh.position;
		if(position.z <= sComp.path.zmin){
			sComp.vel.z = 1;
		}
		else if(position.z >= sComp.path.zmax){
			sComp.vel.z = -1;
		}
		position.z += sComp.vel.z*SF;
	};

	BaddieMovementProcessor.prototype.moveRandom = function(sComp, meshComp){
		var position, newPos, ij;
		position = meshComp.mesh.position;
		newPos = {
			"x":position.x + sComp.vel.x*SF,
			"z":position.z + sComp.vel.z*SF
		};
		if(GridUtils.isFullVertices(this.game, newPos, SIZE/2)){
			sComp.vel = DIRS[Math.floor(Math.random()*4)];
		}
		else{
			position.x = newPos.x;
			position.z = newPos.z;
		}
	};

	BaddieMovementProcessor.prototype.moveHunt = function(sComp, meshComp){
		var position, section, _nextSection;
		position = meshComp.mesh.position;
		section = sComp.path.sections[sComp.path.currentNum];
		sComp.vel.x = 0;
		sComp.vel.z = 0;
		_nextSection = function(){
			position.x = section.end.x;
			position.z = section.end.z;
			sComp.path.currentNum++;
		};
		if(section){
			if(section.dir === "n"){
				if(position.z < section.end.z){
					sComp.vel.x = 0;
					sComp.vel.z = 1;
				}
				else{
					_nextSection();
				}
			}
			else if(section.dir === "s"){
				if(position.z > section.end.z){
					sComp.vel.x = 0;
					sComp.vel.z = -1;
				}
				else{
					_nextSection();
				}
			}
			else if(section.dir === "w"){
				if(position.x > section.end.x){
					sComp.vel.x = -1;
					sComp.vel.z = 0;
				}
				else{
					_nextSection();
				}
			}
			else if(section.dir === "e"){
				if(position.x < section.end.x){
					sComp.vel.x = 1;
					sComp.vel.z = 0;
				}
				else{
					_nextSection();
				}
			}
		}
		position.x += sComp.vel.x*SF;
		position.z += sComp.vel.z*SF;
	};

	BaddieMovementProcessor.prototype.addPath = function (sComp, meshComp) {
		var playerPos, baddiePos, playerPosIJ;
		playerPos = this.game.camera.position;
		playerPosIJ = GridUtils.babylonToIJ(playerPos);
		baddiePos = GridUtils.babylonToIJ(meshComp.mesh.position);
		if(sComp.move === "north-south"){
			sComp.vel = {'x':0, 'z':1};
		}
		else if(sComp.move === "west-east"){
			sComp.vel = {'x':1, 'z':0};
		}
		else if(sComp.move === "random"){
			sComp.vel = DIRS[Math.floor(Math.random()*4)];
		}
		else if(sComp.move === "hunt"){
			sComp.vel = {'x':0, 'z':0};
		}
		sComp.path = GridUtils.getPath(sComp.move, [baddiePos.i, baddiePos.j], this.game.data.solid, [playerPosIJ.i, playerPosIJ.j]);
	};

	BaddieMovementProcessor.prototype.updateBaddie = function (id) {
		var move, sComp, meshComp;
		sComp = this.game.manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		meshComp = this.game.manager.getComponentDataForEntity('MeshComponent', id);
		if(typeof sComp.vel === "undefined" || sComp.vel === null || typeof sComp.path === "undefined" || sComp.path === null){
			this.addPath(sComp, meshComp);
		}
		if(sComp.move === "north-south" && !_pathIsUnit(sComp.move, sComp.path)){
			this.moveNorthSouth(sComp, meshComp);
		}
		else if(sComp.move === "west-east" && !_pathIsUnit(sComp.move, sComp.path)){
			this.moveWestEast(sComp, meshComp);
		}
		else if(sComp.move === "random"){
			this.moveRandom(sComp, meshComp);
		}
		else if(sComp.move === "hunt" && sComp.path && sComp.path.sections){
			this.moveHunt(sComp, meshComp);
		}
	};

	BaddieMovementProcessor.prototype.update = function () {
		var i, ids = this.game.ids["baddie"] || [], len = ids.length;
		for(i = 0; i < len; i++){
			this.updateBaddie(ids[i]);
		}
	};

	return BaddieMovementProcessor;

});
