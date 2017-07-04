define(["GeomUtils", "GridUtils"], function(GeomUtils, GridUtils){

	"use strict";

	var SF = 0.5;

	var _pathIsUnit = function(strategy, path){
		if(strategy === "north-south"){
			return Math.abs(path.zmin - path.zmax) < 0.1;
		}
		else if(strategy === "west-east"){
			return Math.abs(path.xmin - path.xmax) < 0.1;
		}
	};

	var BaddieMovementProcessor = function(manager, baddieIds){
		this.manager = manager;
		this.baddieIds = baddieIds;
		this.init();
	};

	BaddieMovementProcessor.prototype.init = function(){
		//
	};

	BaddieMovementProcessor.prototype.moveWestEast = function(id, sComp){
		var meshComp = this.manager.getComponentDataForEntity('MeshComponent', id);
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
		var meshComp = this.manager.getComponentDataForEntity('MeshComponent', id);
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
		var meshComp = this.manager.getComponentDataForEntity('MeshComponent', id);
		var position = meshComp.mesh.position;
		console.log("pos", position);
		var section = sComp.path.sections[sComp.path.currentNum];
		console.log("section", section);
		sComp.vel.x = 0;
		sComp.vel.z = 0;
		var _nextSection = function(){
			console.log("next section");
			position.x = section.end.x;
			position.z = section.end.y;
			sComp.path.currentNum++;
		};
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
				sComp.vel.x = -1;
				sComp.vel.z = 0;
			}
			else{
				_nextSection();
			}
		}
		console.log("move", sComp.vel);
		position.x += sComp.vel.x*SF;
		position.z += sComp.vel.z*SF;
	};

	BaddieMovementProcessor.prototype.updateBaddie = function (id) {
		var manager = this.manager;
		var sComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		var strategy = sComp.strategy;
		if(strategy === "north-south" && !_pathIsUnit(strategy, sComp.path)){
			this.moveNorthSouth(id, sComp);
		}
		else if(strategy === "west-east" && !_pathIsUnit(strategy, sComp.path)){
			this.moveWestEast(id, sComp);
		}
		else if(strategy === "hunt" && sComp.path && sComp.path.sections){
			this.moveHunt(id, sComp);
		}
	};

	BaddieMovementProcessor.prototype.update = function () {
		_.each(this.baddieIds, this.updateBaddie.bind(this));
	};

	return BaddieMovementProcessor;

});
