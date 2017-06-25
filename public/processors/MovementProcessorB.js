define([], function(){

	"use strict";

	var SF = 0.075;

	var _pointInRect = function(p, r){
		//console.log("p, r", p, r);
		var tol = 1;
		return (p.x > r.left + tol) && (p.x < r.right - tol) && (p.y > r.bottom + tol) && (p.y < r.top - tol);
	};
	var _pointInBox = function(p, box){
		return _pointInRect(p, {
			left:box.position.x - SIZE*box.__width/2,
			right:box.position.x + SIZE*box.__width/2,
			bottom:box.position.z - SIZE*box.__height/2,
			top:box.position.z + SIZE*box.__height/2
		});
	};

	var MovementProcessorB = function(manager, baddieIds, boxes){
		this.manager = manager;
		this.baddieIds = baddieIds;
		this.boxes = boxes;
		console.log(baddieIds);
		console.log(boxes);
		this.init();
	};

	MovementProcessorB.prototype.init = function(){
		//
	};

	MovementProcessorB.prototype.getDirsHit = function (id) {
		var dirs = {n:0, s:0, w:0, e:0}, dx, dy, meshComp, mesh0, speedComp, vComp, boxes = this.boxes;
		var manager = this.manager;
		vComp = 		manager.getComponentDataForEntity('VComponent', id);
		meshComp = 		manager.getComponentDataForEntity('MeshComponent', id);
		mesh0 = 		meshComp.mesh[0];
		dx = 			vComp.vel.x * SF;
		dy = 			vComp.vel.y * SF;
		var west = 		{x:mesh0.position.x - SIZE/2, 	y:mesh0.position.z};
		var east = 		{x:mesh0.position.x + SIZE/2, 	y:mesh0.position.z};
		var north = 	{x:mesh0.position.x, 			y:mesh0.position.z - SIZE/2};
		var south = 	{x:mesh0.position.x, 			y:mesh0.position.z + SIZE/2};
		var newWest =	{x:west.x + dx, 				y:west.y + dy};
		var newEast = 	{x:east.x + dx, 				y:east.y + dy};
		var newNorth = 	{x:north.x + dx, 				y:north.y + dy};
		var newSouth = 	{x:south.x + dx, 				y:south.y + dy};
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
		var _this = this;
		var manager = this.manager;
		_.each(this.baddieIds, function(id) {
			var dirs = 			_this.getDirsHit(id);
			var vComp = 		manager.getComponentDataForEntity('VComponent', id);
			var meshComp = 		manager.getComponentDataForEntity('MeshComponent', id);
			$("span").text(JSON.stringify(dirs) + "   "  );
			if(!dirs['w'] && !dirs['e']){
				vComp.vel.x = 1;
			}
			else if(dirs['w'] && !dirs['e']){
				vComp.vel.x = -1;
			}
			else if(dirs['e'] && !dirs['w']){
				vComp.vel.x *= 1;
			}
			meshComp.mesh[0].position.x += vComp.vel.x * SF;
		});
	};

	return MovementProcessorB;

});
