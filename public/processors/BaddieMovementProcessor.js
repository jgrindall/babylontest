define(["GeomUtils", "GridUtils"], function(GeomUtils, GridUtils){

	"use strict";

	var SF = 0.35;

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
		this.init();
	};

	BaddieMovementProcessor.prototype.init = function(){
		//
	};

	BaddieMovementProcessor.prototype.moveWestEast = function(id, sComp){
		var meshComp = this.game.manager.getComponentDataForEntity('MeshComponent', id);
		var position = meshComp.mesh.position;
		if(position.x <= sComp.path.xmin){
			sComp.vel.x = 1;
		}
		else if(position.x >= sComp.path.xmax){
			sComp.vel.x = -1;
		}
		position.x += sComp.vel.x*SF;
	};

	BaddieMovementProcessor.prototype.moveNorthSouth = function(id, sComp){
		var meshComp = this.game.manager.getComponentDataForEntity('MeshComponent', id);
		var position = meshComp.mesh.position;
		if(position.z <= sComp.path.zmin){
			sComp.vel.z = 1;
		}
		else if(position.z >= sComp.path.zmax){
			sComp.vel.z = -1;
		}
		position.z += sComp.vel.z*SF;
	};

	BaddieMovementProcessor.prototype.moveHunt = function(id, sComp){
		var meshComp = this.game.manager.getComponentDataForEntity('MeshComponent', id);
		var position = meshComp.mesh.position;
		var section = sComp.path.sections[sComp.path.currentNum];
		sComp.vel.x = 0;
		sComp.vel.z = 0;
		var _nextSection = function(){
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
		alert("add path!");
		var playerPos = this.game.manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh.position;
		var baddiePos = GridUtils.babylonToIJ(meshComp.mesh.position);
		if(sComp.move === "north-south"){
			sComp.vel = {'x':0, 'z':1};
		}
		else if(sComp.move === "west-east"){
			sComp.vel = {'x':1, 'z':0};
		}
		else{
			sComp.vel = {'x':0, 'z':0};
		}
		alert("add path!");
		sComp.path = GridUtils.getPath(sComp.move, [baddiePos.i, baddiePos.j], this.game.grid.grid, [2, 13]);
	};

	BaddieMovementProcessor.prototype.updateBaddie = function (id) {
		var move, sComp, meshComp;
		sComp = this.game.manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		if(typeof sComp.vel === "undefined"){
			// not defined yet
			meshComp = this.game.manager.getComponentDataForEntity('MeshComponent', id);
			this.addPath(sComp, meshComp);
		}
		move = sComp.move;
		if(move === "north-south" && !_pathIsUnit(move, sComp.path)){
			this.moveNorthSouth(id, sComp);
		}
		else if(move === "west-east" && !_pathIsUnit(move, sComp.path)){
			this.moveWestEast(id, sComp);
		}
		else if(move === "hunt" && sComp.path && sComp.path.sections){
			this.moveHunt(id, sComp);
		}
	};

	BaddieMovementProcessor.prototype.update = function () {
		_.each(this.game.baddieIds, this.updateBaddie.bind(this));
	};

	return BaddieMovementProcessor;

});
