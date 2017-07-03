define(["GeomUtils"], function(GeomUtils){

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

	var BaddieMovementProcessor = function(manager, baddieIds, boxes){
		this.manager = manager;
		this.baddieIds = baddieIds;
		this.boxes = boxes;
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

	BaddieMovementProcessor.prototype.updateBaddie = function (id) {
		var manager = this.manager;
		var sComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		var strategy = sComp.strategy;
		if(strategy === "north-south" && !_pathIsUnit(strategy, sComp.path)){
			this.moveNorthSouth(id, sComp);
		}
		else if(strategy === "west-east" && !_pathIsUnit(strategy, sComp.path)){
			this.moveWestEast(id, sComp);
			//console.log(pos, sComp.path);
		}
		else{
			// hunt
		}
	};

	BaddieMovementProcessor.prototype.update = function () {
		_.each(this.baddieIds, this.updateBaddie.bind(this));
	};

	return BaddieMovementProcessor;

});
