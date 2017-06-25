define(["GeomUtils"], function(GeomUtils){

	"use strict";

	var SF = 0.15;

	var MovementProcessorB = function(manager, baddieIds, boxes, canHit){
		this.manager = manager;
		this.baddieIds = baddieIds;
		this.boxes = boxes;
		this.canHit = canHit;
		this.init();
	};

	MovementProcessorB.prototype.init = function(){
		//
	};

	MovementProcessorB.prototype.getDirsHit = function (id) {
		var dirs = {n:0, s:0, w:0, e:0}, dx, dz, meshComp, mesh0, speedComp, vComp;
		var manager = this.manager;
		vComp = 		manager.getComponentDataForEntity('VComponent', id);
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

	MovementProcessorB.prototype.update = function () {
		var _this = this, box = this.boxes[0];
		var manager = this.manager;
		var pullOut = function(){

		};
		_.each(this.baddieIds, function(id) {
			var dirs = 			_this.getDirsHit(id);
			var vComp = 		manager.getComponentDataForEntity('VComponent', id);
			var meshComp = 		manager.getComponentDataForEntity('MeshComponent', id);
			if(dirs['w'] && !dirs['e']){
				vComp.vel.x = 1;
			}
			else if(dirs['e'] && !dirs['w']){
				vComp.vel.x = -1;
			}
			pullOut();
			meshComp.mesh[0].position.x += vComp.vel.x * SF;
			//meshComp.mesh[1].position.x = meshComp.mesh[0].position.x;
			//meshComp.mesh[1].position.z = meshComp.mesh[0].position.z;
		});
	};

	return MovementProcessorB;

});
