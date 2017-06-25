define([], function(){

	"use strict";

	var SF = 0.075;

	var _pointInRect = function(p, r){
		//console.log("p, r", p, r);
		var tol = 1;
		return (p.x > r.left + tol) && (p.x < r.right - tol) && (p.z > r.bottom + tol) && (p.z < r.top - tol);
	};
	var _pointInBox = function(p, box){
		var inside =_pointInRect(p, {
			left:	box.position.x - SIZE*box.__width/2,
			right:	box.position.x + SIZE*box.__width/2,
			bottom:	box.position.z - SIZE*box.__height/2,
			top:	box.position.z + SIZE*box.__height/2
		});
		return inside;
	};

	var MovementProcessorB = function(manager, baddieIds, boxes){
		this.manager = manager;
		this.baddieIds = baddieIds;
		this.boxes = boxes;
		this.init();
	};

	MovementProcessorB.prototype.init = function(){
		//
	};

	MovementProcessorB.prototype.getDirsHit = function (id) {
		var dirs = {n:0, s:0, w:0, e:0}, dx, dz, meshComp, mesh0, speedComp, vComp, boxes = this.boxes;
		var manager = this.manager;
		vComp = 		manager.getComponentDataForEntity('VComponent', id);
		meshComp = 		manager.getComponentDataForEntity('MeshComponent', id);
		mesh0 = 		meshComp.mesh[0];
		dx = 			vComp.vel.x * SF;
		dz = 			vComp.vel.z * SF;
		var west = 		{x:mesh0.position.x - SIZE/2, 	z:mesh0.position.z};
		var east = 		{x:mesh0.position.x + SIZE/2, 	z:mesh0.position.z};
		var north = 	{x:mesh0.position.x, 			z:mesh0.position.z - SIZE/2};
		var south = 	{x:mesh0.position.x, 			z:mesh0.position.z + SIZE/2};
		var newWest =	{x:west.x + dx, 				z:west.z + dz};
		var newEast = 	{x:east.x + dx, 				z:east.z + dz};
		var newNorth = 	{x:north.x + dx, 				z:north.z + dz};
		var newSouth = 	{x:south.x + dx, 				z:south.z + dz};
		//we dont need to check all boxes, we need a lookup
		_.each(boxes, function(box){
			if(_pointInBox(newNorth, box)){
				dirs['n'] = 1;
			}
			if(_pointInBox(newSouth, box)){
				dirs['s'] = 1;
			}
			if(_pointInBox(newWest, box)){
				dirs['w'] = 1;
			}
			if(_pointInBox(newEast, box)){
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
			//$("p.dir").text(JSON.stringify(dirs));
			//$("p.pos").text(meshComp.mesh[0].position.x.toFixed(1) + ',' + meshComp.mesh[0].position.z.toFixed(1) + "in : " + _pointInBox(meshComp.mesh[0].position, box));
			if(dirs['w'] && !dirs['e']){
				//console.log("w");
				vComp.vel.x = 1;
			}
			else if(dirs['e'] && !dirs['w']){
				//console.log("e");
				vComp.vel.x = -1;
			}
			pullOut();
			meshComp.mesh[0].position.x += vComp.vel.x * SF;
		});
	};

	return MovementProcessorB;

});
