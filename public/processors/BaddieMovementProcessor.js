define(["GeomUtils"], function(GeomUtils){

	"use strict";

	var SF = 0.25;

	var BaddieMovementProcessor = function(manager, baddieIds, boxes, canHit){
		this.manager = manager;
		this.baddieIds = baddieIds;
		this.boxes = boxes;
		this.canHit = canHit;
		this.init();
	};

	BaddieMovementProcessor.prototype.init = function(){
		//
	};

	BaddieMovementProcessor.prototype.getDirsHit = function (id) {
		var dirs = {n:0, s:0, w:0, e:0}, dx, dz, meshComp, mesh0, speedComp, vComp;
		var manager = this.manager;
		vComp = 		manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		meshComp = 		manager.getComponentDataForEntity('MeshComponent', id);
		mesh0 = 		meshComp.mesh[0];
		dx = 			vComp.vel.x * SF;
		dz = 			vComp.vel.z * SF;
		var i = 		Math.floor(mesh0.position.x/SIZE);
		var j = 		Math.floor(mesh0.position.z/SIZE);
		var boxes = 	this.canHit[i][j];
		var west = 		{x:mesh0.position.x - SIZE/2, 	z:mesh0.position.z};
		var east = 		{x:mesh0.position.x + SIZE/2, 	z:mesh0.position.z};
		var north = 	{x:mesh0.position.x, 			z:mesh0.position.z - SIZE/2};
		var south = 	{x:mesh0.position.x, 			z:mesh0.position.z + SIZE/2};
		var newWest =	{x:west.x + dx, 				z:west.z + dz};
		var newEast = 	{x:east.x + dx, 				z:east.z + dz};
		var newNorth = 	{x:north.x + dx, 				z:north.z + dz};
		var newSouth = 	{x:south.x + dx, 				z:south.z + dz};
		//console.log('check', boxes.length);
		_.each(boxes, function(box){
			if(GeomUtils.pointInBox(newNorth, box)){
				dirs['n'] = 1;
			}
			if(GeomUtils.pointInBox(newSouth, box)){
				dirs['s'] = 1;
			}
			if(GeomUtils.pointInBox(newWest, box)){
				dirs['w'] = 1;
			}
			if(GeomUtils.pointInBox(newEast, box)){
				dirs['e'] = 1;
			}
		});
		return dirs;
	};

	BaddieMovementProcessor.prototype.moveWestEast = function(id, sComp){
		var meshComp = this.manager.getComponentDataForEntity('MeshComponent', id);
		var position = meshComp.mesh.position;
		if(position.x < sComp.path.j0 * SIZE){
			sComp.vel.x = 1;
		}
		else if(position.x > sComp.path.j1 * SIZE){
			sComp.vel.x = -1;
		}
		position.x += sComp.vel.x*SF;
	};

	BaddieMovementProcessor.prototype.moveNorthSouth = function(id, sComp){
		var meshComp = this.manager.getComponentDataForEntity('MeshComponent', id);
		var position = meshComp.mesh.position;
		if(position.z < sComp.path.i0 * SIZE){
			sComp.vel.z = 1;
		}
		else if(position.z > sComp.path.i1 * SIZE){
			sComp.vel.z = -1;
		}
		position.z += sComp.vel.z*SF;
	};

	BaddieMovementProcessor.prototype.updateBaddie = function (id) {
		var manager = this.manager;
		var sComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		var strategy = sComp.strategy;
		if(strategy === "north-south"){
			this.moveNorthSouth(id, sComp);
		}
		else if(strategy === "west-east"){
			this.moveWestEast(id, sComp);
			//console.log(pos, sComp.path);
		}
		else{
			/*
			var dirs = 			_this.getDirsHit(id);
			if(dirs['w'] && !dirs['e']){
				sComp.vel.x = 1;
			}
			else if(dirs['e'] && !dirs['w']){
				sComp.vel.x = -1;
			}
			meshComp.mesh[0].position.x += sComp.vel.x * SF;
			*/
		}
	};

	BaddieMovementProcessor.prototype.update = function () {
		_.each(this.baddieIds, this.updateBaddie.bind(this));
	};

	return BaddieMovementProcessor;

});
